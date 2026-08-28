import { NextResponse } from 'next/server';
import { adminApp, adminDb } from '@/lib/firebase-admin';
import { generateReceiptPdf } from '@/lib/receipt-pdf';
import { sendDonorReceiptEmail } from '@/lib/mail';

const ADMIN_EMAIL = 'chaya123@chayaisrael.com';

// Sends the tax receipt PDF for one specific donation, on explicit admin
// action from the dashboard. There is deliberately no batch/loop variant of
// this endpoint — every send is a single, human-initiated action.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ donationId: string }> },
) {
  try {
    // Read the ID token from the Authorization header, falling back to the
    // request body. Firebase Hosting's Next.js integration is an early
    // preview (see the CLI's own "best-effort" warning on deploy) and custom
    // headers on rewritten dynamic routes are a known soft spot for that
    // integration — accepting the token from the body too means a real
    // admin session isn't blocked if a header gets dropped somewhere in
    // front of the function, without weakening the actual check.
    const authHeader = request.headers.get('authorization') || '';
    let idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
      try {
        const body = await request.clone().json();
        idToken = typeof body?.idToken === 'string' ? body.idToken : null;
      } catch {
        // no JSON body — fine, idToken stays null
      }
    }

    if (!idToken) {
      console.error('[send-receipt] Rejected: no ID token in Authorization header or body.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      // adminApp.auth() (the concrete app instance from src/lib/firebase-admin.ts),
      // not the bare admin.auth() global-default-app accessor — on a cold
      // function instance, admin.auth() intermittently threw "The default
      // Firebase app does not exist" even though this module's own
      // initializeApp() call had already produced adminApp. Scoping to the
      // instance we already hold sidesteps that global-registry race
      // entirely (confirmed via functions:log after the first production
      // attempts of this route all failed with that exact message).
      decoded = await adminApp.auth().verifyIdToken(idToken);
    } catch (err) {
      console.error('[send-receipt] Rejected: verifyIdToken failed —', err instanceof Error ? err.message : err);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (decoded.email?.toLowerCase() !== ADMIN_EMAIL) {
      console.error(`[send-receipt] Rejected: token email "${decoded.email}" is not the admin account.`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { donationId } = await params;
    const donationRef = adminDb.collection('donations').doc(donationId);
    const donationSnap = await donationRef.get();
    if (!donationSnap.exists) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const donation = { id: donationSnap.id, ...donationSnap.data() } as any;

    const pdfBuffer = await generateReceiptPdf(donation);
    await sendDonorReceiptEmail(donation, pdfBuffer);

    const receiptSentAt = new Date().toISOString();
    await donationRef.update({ receiptSentAt });

    return NextResponse.json({ success: true, receiptSentAt });
  } catch (error) {
    console.error('Error sending receipt email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
