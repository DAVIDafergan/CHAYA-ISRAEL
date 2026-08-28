import { NextResponse } from 'next/server';
import { verifyPaypalWebhookSignature } from '@/lib/paypal';
import { processPaypalWebhookEvent } from '@/lib/process-paypal-webhook';

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
