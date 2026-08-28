import { NextResponse } from 'next/server';
import { admin, adminDb } from '@/lib/firebase-admin';
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
    const authHeader = request.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (decoded.email?.toLowerCase() !== ADMIN_EMAIL) {
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
