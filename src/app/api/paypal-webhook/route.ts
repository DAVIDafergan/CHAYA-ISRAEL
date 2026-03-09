
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
      let userId: string | null = null;
      try {
        const user = await prisma.user.findUnique({
          where: { email: payerEmail },
          select: { id: true },
        });
        if (user) {
          userId = user.id;
        }
      } catch (err) {
        console.error("Error searching for user by email:", err);
      }

      const transactionId = resource.id || 'unknown';
      const amount = parseFloat(resource.amount?.value || resource.purchase_units?.[0]?.amount?.value || "0");
      const currency = resource.amount?.currency_code || resource.purchase_units?.[0]?.amount?.currency_code || "USD";
      const payerName = `${resource.payer?.name?.given_name || ""} ${resource.payer?.name?.surname || ""}`.trim() || "PayPal Donor";
      const status = resource.status || "COMPLETED";
      const note = resource.purchase_units?.[0]?.description || "";
      const cause = resource.purchase_units?.[0]?.description?.split('Donation for ')[1]?.split(' - ')[0] || "General";

      // Upsert the donation record to prevent duplicates
      await prisma.donation.upsert({
        where: { paypalTransactionId: transactionId },
        update: {
          status,
          amount,
          donorName: payerName,
          donorEmail: payerEmail,
          userId,
        },
        create: {
          paypalTransactionId: transactionId,
          amount,
          currency,
          donorEmail: payerEmail,
          donorName: payerName,
          status,
          note,
          cause,
          userId,
        },
      });
    }

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
