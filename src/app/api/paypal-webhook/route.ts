
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

    // Events that signify a successful payment (One-time or Subscription)
    const successfulEvents = [
      'PAYMENT.CAPTURE.COMPLETED',
      'CHECKOUT.ORDER.APPROVED',
      'CHECKOUT.ORDER.COMPLETED',
      'PAYMENT.SALE.COMPLETED' // This is triggered for each recurring subscription payment
    ];

    if (successfulEvents.includes(eventType)) {
      const resource = body.resource;
      
      // Handle different resource structures (Order vs Sale)
      const amountData = resource.amount || resource.seller_receivable_breakdown?.gross_amount || {};
      const payerData = resource.payer || body.resource?.payer || {};
      
      const rawEmail = payerData.email_address || payerData.email || "unknown@paypal.com";
      const payerEmail = rawEmail.toLowerCase().trim();
      
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
        console.error("Error searching for user by email in webhook:", err);
      }

      const transactionId = resource.id || body.id || 'webhook-' + Date.now();

      // For subscriptions, the description might be in different places
      const note = resource.custom_description || resource.description || body.summary || "";
      const cause = note.includes('Donation for ') ? note.split('Donation for ')[1]?.split(' - ')[0] : "General";

      const donationData = {
        transactionId: transactionId,
        amount: parseFloat(amountData.value || "0"),
        currency: amountData.currency_code || "USD",
        userId: userId,
        payerEmail: payerEmail,
        payerName: `${payerData.name?.given_name || ""} ${payerData.name?.surname || ""}`.trim() || "PayPal Donor",
        status: 'COMPLETED',
        timestamp: resource.create_time || resource.update_time || new Date().toISOString(),
        note: note,
        cause: cause,
        createdAt: serverTimestamp(),
        source: 'webhook',
        paymentType: eventType === 'PAYMENT.SALE.COMPLETED' ? 'RECURRING' : 'ONE_TIME'
      };

      const existingQuery = query(
        collection(db, 'donations'),
        where('transactionId', '==', transactionId),
        limit(1)
      );
      const existingSnapshot = await getDocs(existingQuery);

      if (existingSnapshot.empty) {
        await addDoc(collection(db, 'donations'), donationData);
        console.log(`Donation successfully saved from webhook: ${transactionId} (${donationData.paymentType})`);
      } else {
        console.log(`Donation ${transactionId} already exists, skipping.`);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
