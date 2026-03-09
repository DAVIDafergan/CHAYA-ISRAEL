import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase for the route handler
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
    
    // Log the event type for debugging
    console.log(`Processing PayPal Webhook Event: ${eventType}`);

    // Supported events for successful payments
    const successfulEvents = [
      'PAYMENT.CAPTURE.COMPLETED',
      'CHECKOUT.ORDER.APPROVED',
      'CHECKOUT.ORDER.COMPLETED'
    ];

    if (successfulEvents.includes(eventType)) {
      const resource = body.resource;
      
      // Extract data with fallback paths based on different PayPal event structures
      const purchaseUnit = resource.purchase_units?.[0] || {};
      const amountData = resource.amount || purchaseUnit.amount || {};
      const payerData = resource.payer || body.resource.payer || {};
      
      // Normalize email to lowercase for consistent searching
      const rawEmail = payerData.email_address || payerData.email || "unknown@paypal.com";
      const payerEmail = rawEmail.toLowerCase().trim();
      
      // Search for user by email to associate the donation
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
        console.error("Error searching for user by email:", err);
      }

      const donationData = {
        transactionId: resource.id || body.id || 'webhook-' + Date.now(),
        amount: parseFloat(amountData.value || "0"),
        currency: amountData.currency_code || "USD",
        userId: userId,
        payerEmail: payerEmail,
        payerName: `${payerData.name?.given_name || ""} ${payerData.name?.surname || ""}`.trim() || "PayPal Donor",
        status: 'COMPLETED',
        timestamp: resource.create_time || resource.update_time || new Date().toISOString(),
        note: purchaseUnit.description || body.summary || "",
        cause: purchaseUnit.description?.split('Donation for ')[1]?.split(' - ')[0] || "General",
        createdAt: serverTimestamp(),
        source: 'webhook'
      };

      // Check if this transaction already exists to avoid duplicates
      const existingQuery = query(
        collection(db, 'donations'),
        where('transactionId', '==', donationData.transactionId),
        limit(1)
      );
      const existingSnapshot = await getDocs(existingQuery);

      if (existingSnapshot.empty) {
        await addDoc(collection(db, 'donations'), donationData);
        console.log(`Donation successfully saved from webhook: ${donationData.transactionId}`);
      } else {
        console.log(`Donation ${donationData.transactionId} already exists, skipping.`);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}