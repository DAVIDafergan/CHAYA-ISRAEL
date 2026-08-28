import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyPaypalWebhookSignature } from '@/lib/paypal';
import { generateReceiptPdf } from '@/lib/receipt-pdf';
import { sendDonationNotificationEmail, sendDonorReceiptEmail } from '@/lib/mail';

const HANDLED_EVENTS = [
  'PAYMENT.CAPTURE.COMPLETED',
  'CHECKOUT.ORDER.APPROVED',
  'CHECKOUT.ORDER.COMPLETED',
  'PAYMENT.SALE.COMPLETED',
  'BILLING.SUBSCRIPTION.CREATED',
  'BILLING.SUBSCRIPTION.ACTIVATED',
  'BILLING.SUBSCRIPTION.UPDATED',
];

// Extracted so it can be exercised directly in tests against the Firestore
// emulator without needing a real PayPal signature — the HTTP-level
// signature gate in POST() below is tested separately, over real HTTP.
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

// This is the SOLE writer of the `donations` collection (see firestore.rules:
// create/update on `donations` is server-only). The old client-side write in
// src/app/donate/donate-form.tsx let anyone forge a "completed" donation from
// the browser console with no real PayPal charge — removed for that reason.
// This route uses the Admin SDK (bypasses Firestore rules) and only trusts a
// request after its PayPal signature verifies.
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ error: 'Empty body' }, { status: 400 });
    }

    const body = JSON.parse(rawBody);

    // Reject anything that isn't a genuine, signed notification from PayPal
    // before touching Firestore or sending any email.
    const isVerified = await verifyPaypalWebhookSignature(
      {
        transmissionId: request.headers.get('paypal-transmission-id'),
        transmissionTime: request.headers.get('paypal-transmission-time'),
        certUrl: request.headers.get('paypal-cert-url'),
        authAlgo: request.headers.get('paypal-auth-algo'),
        transmissionSig: request.headers.get('paypal-transmission-sig'),
      },
      body,
    );

    if (!isVerified) {
      console.error('[paypal-webhook] Rejected webhook with invalid or missing signature.');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    console.log(`Processing PayPal Webhook Event: ${body.event_type}`);
    await processPaypalWebhookEvent(body);

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Webhook ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
