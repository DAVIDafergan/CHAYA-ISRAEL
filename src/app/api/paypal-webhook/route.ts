
import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ error: 'Empty body' }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const eventType = body.event_type;
    
    console.log(`Processing PayPal Webhook Event: ${eventType}`);

    // Events that signify a valid donation or subscription
    const handledEvents = [
      'PAYMENT.CAPTURE.COMPLETED',
      'CHECKOUT.ORDER.APPROVED',
      'CHECKOUT.ORDER.COMPLETED',
      'PAYMENT.SALE.COMPLETED',
      'BILLING.SUBSCRIPTION.CREATED',
      'BILLING.SUBSCRIPTION.ACTIVATED',
      'BILLING.SUBSCRIPTION.UPDATED'
    ];

    if (handledEvents.includes(eventType)) {
      const resource = body.resource;
      
      // 1. Extract Amount
      // Subscriptions might not have a 'last_payment' yet on 'CREATED', 
      // so we try to find any value or default to 0.
      const amountValue = resource.amount?.value || 
                         resource.seller_receivable_breakdown?.gross_amount?.value || 
                         resource.billing_info?.last_payment?.amount?.value || 
                         resource.plan_overide?.amount?.value || "0";

      const currencyCode = resource.amount?.currency_code || 
                          resource.billing_info?.last_payment?.amount?.currency_code || "USD";

      // 2. Extract Payer Email
      // Subscriptions use 'subscriber', standard checkouts use 'payer'
      const subscriberEmail = resource.subscriber?.email_address;
      const payerEmailRaw = resource.payer?.email_address || resource.payer?.email || subscriberEmail || "unknown@paypal.com";
      const payerEmail = payerEmailRaw.toLowerCase().trim();

      // 3. Extract Payer Name
      const nameData = resource.subscriber?.name || resource.payer?.name || {};
      const payerName = `${nameData.given_name || ""} ${nameData.surname || ""}`.trim() || "PayPal Donor";

      // 4. Transaction ID
      // For subscriptions, the primary ID is the Subscription ID (starts with I-)
      const transactionId = resource.id || resource.subscription_id || body.id || `tr-${Date.now()}`;

      // 5. Metadata (Cause and Note)
      const note = resource.custom_description || resource.description || body.summary || "";
      let cause = "General";
      if (note.toLowerCase().includes('donation for ')) {
        const parts = note.split(/donation for /i);
        if (parts[1]) cause = parts[1].split(' - ')[0].trim();
      }

      const isSubscriptionEvent = eventType.startsWith('BILLING.SUBSCRIPTION');
      const paymentType = isSubscriptionEvent ? 'RECURRING' : 'ONE_TIME';

      // Find internal userId if exists
      let userId = 'guest';
      try {
        const usersQuery = query(
          collection(db, 'users'), 
          where('email', '==', payerEmail),
          limit(1)
        );
        const userSnapshot = await getDocs(usersQuery);
        if (!userSnapshot.empty) {
          userId = userSnapshot.docs[0].id;
        }
      } catch (err) {
        console.error("Error searching for user in webhook:", err);
      }

      const donationData = {
        transactionId,
        amount: parseFloat(amountValue),
        currency: currencyCode,
        userId,
        payerEmail,
        payerName,
        status: 'COMPLETED',
        timestamp: resource.create_time || resource.update_time || resource.start_time || new Date().toISOString(),
        note,
        cause,
        createdAt: serverTimestamp(),
        source: 'webhook',
        paymentType,
        webhookEventType: eventType
      };

      // Prevent duplicates by checking transactionId
      const existingQuery = query(
        collection(db, 'donations'),
        where('transactionId', '==', transactionId),
        limit(1)
      );
      const existingSnapshot = await getDocs(existingQuery);

      if (existingSnapshot.empty) {
        await addDoc(collection(db, 'donations'), donationData);
        console.log(`Donation SAVED: ${transactionId} for ${payerEmail} (${eventType})`);
      } else {
        console.log(`Donation ALREADY EXISTS: ${transactionId}, skipping.`);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Webhook ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
