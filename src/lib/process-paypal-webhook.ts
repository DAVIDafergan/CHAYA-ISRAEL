import { adminDb } from '@/lib/firebase-admin';
import { generateReceiptPdf } from '@/lib/receipt-pdf';
import { sendDonationNotificationEmail, sendDonorReceiptEmail } from '@/lib/mail';

// CHECKOUT.ORDER.APPROVED/COMPLETED are deliberately excluded: their
// `resource` is the Order object, which has no top-level `amount` (the real
// amount lives under purchase_units[].amount), so handling them here always
// records a $0 donation and — worse — permanently blocks the real amount
// from ever being saved, since the transactionId dedup check below treats
// that $0 record as "already recorded" once the genuine capture event
// arrives. PAYMENT.CAPTURE.COMPLETED is the actual money-received event for
// one-time donations and is the only one with a trustworthy resource.amount.
const HANDLED_EVENTS = [
  'PAYMENT.CAPTURE.COMPLETED',
  'PAYMENT.SALE.COMPLETED',
  'BILLING.SUBSCRIPTION.CREATED',
  'BILLING.SUBSCRIPTION.ACTIVATED',
  'BILLING.SUBSCRIPTION.UPDATED',
];

// Split out of route.ts so it can be exercised directly in tests against the
// Firestore emulator without needing a real PayPal signature — the HTTP-level
// signature gate in route.ts's POST() is tested separately, over real HTTP.
// (Also required: Next.js App Router route.ts files may only export the
// recognized handler/config names — anything else fails the build's route
// type-check, which is what originally caught this.)
export async function processPaypalWebhookEvent(body: any): Promise<{ saved: boolean; transactionId?: string }> {
  const eventType = body.event_type;
  if (!HANDLED_EVENTS.includes(eventType)) {
    return { saved: false };
  }

  const resource = body.resource;

  const amountValue = resource.amount?.value ||
    resource.seller_receivable_breakdown?.gross_amount?.value ||
    resource.billing_info?.last_payment?.amount?.value ||
    resource.plan_overide?.amount?.value || '0';

  const currencyCode = resource.amount?.currency_code ||
    resource.billing_info?.last_payment?.amount?.currency_code || 'USD';

  const subscriberEmail = resource.subscriber?.email_address;
  const payerEmailRaw = resource.payer?.email_address || resource.payer?.email || subscriberEmail || 'unknown@paypal.com';
  const payerEmail = payerEmailRaw.toLowerCase().trim();

  const nameData = resource.subscriber?.name || resource.payer?.name || {};
  const payerName = `${nameData.given_name || ''} ${nameData.surname || ''}`.trim() || 'PayPal Donor';

  const transactionId = resource.id || resource.subscription_id || body.id || `tr-${Date.now()}`;

  const note = resource.custom_description || resource.description || body.summary || '';
  let cause = 'General';
  if (note.toLowerCase().includes('donation for ')) {
    const parts = note.split(/donation for /i);
    if (parts[1]) cause = parts[1].split(' - ')[0].trim();
  }

  const isSubscriptionEvent = eventType.startsWith('BILLING.SUBSCRIPTION');
  const paymentType = isSubscriptionEvent ? 'RECURRING' : 'ONE_TIME';

  let userId = 'guest';
  try {
    const usersSnapshot = await adminDb.collection('users').where('email', '==', payerEmail).limit(1).get();
    if (!usersSnapshot.empty) {
      userId = usersSnapshot.docs[0].id;
    }
  } catch (err) {
    console.error('Error searching for user in webhook:', err);
  }

  const amount = parseFloat(amountValue);
  const nowIso = new Date().toISOString();

  const donationData = {
    transactionId,
    amount,
    currency: currencyCode,
    userId,
    payerEmail,
    payerName,
    status: 'COMPLETED',
    timestamp: resource.create_time || resource.update_time || resource.start_time || nowIso,
    note,
    cause,
    createdAt: nowIso,
    source: 'webhook',
    paymentType,
    webhookEventType: eventType,
  };

  const existingSnapshot = await adminDb.collection('donations').where('transactionId', '==', transactionId).limit(1).get();

  if (!existingSnapshot.empty) {
    console.log(`Donation ${transactionId} already recorded — skipping duplicate webhook delivery.`);
    return { saved: false, transactionId };
  }

  await adminDb.collection('donations').add(donationData);
  console.log(`Donation SAVED: ${transactionId} for ${payerEmail}`);

  // Receipt + notification emails only fire once, for a brand-new COMPLETED
  // donation. Any failure here is logged but must never fail the webhook
  // response back to PayPal.
  try {
    await sendDonationNotificationEmail(donationData);
  } catch (err) {
    console.error('Error queuing internal donation notification email:', err);
  }

  try {
    const pdfBuffer = await generateReceiptPdf(donationData);
    await sendDonorReceiptEmail(donationData, pdfBuffer);
  } catch (err) {
    console.error('Error generating/queuing donor receipt email:', err);
  }

  return { saved: true, transactionId };
}
