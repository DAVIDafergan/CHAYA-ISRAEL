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

    // Event handling for PayPal payment completion
    const eventType = body.event_type;
    
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'CHECKOUT.ORDER.APPROVED') {
      const resource = body.resource;
      const payerEmail = (resource.payer?.email_address || "unknown@paypal.com").toLowerCase();
      
      // Smart Logic: Search for a registered user with this email
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
        transactionId: resource.id || 'unknown',
        amount: parseFloat(resource.amount?.value || resource.purchase_units?.[0]?.amount?.value || "0"),
        currency: resource.amount?.currency_code || resource.purchase_units?.[0]?.amount?.currency_code || "USD",
        userId: userId,
        payerEmail: payerEmail,
        payerName: `${resource.payer?.name?.given_name || ""} ${resource.payer?.name?.surname || ""}`.trim() || "PayPal Donor",
        status: resource.status || "COMPLETED",
        timestamp: resource.create_time || new Date().toISOString(),
        note: resource.purchase_units?.[0]?.description || "",
        cause: resource.purchase_units?.[0]?.description?.split('Donation for ')[1]?.split(' - ')[0] || "General",
        createdAt: serverTimestamp(),
      };

      // Add the donation record to Firestore
      await addDoc(collection(db, 'donations'), donationData);
    }

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}