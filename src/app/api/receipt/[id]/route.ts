import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: params.id },
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    return NextResponse.json(donation);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
