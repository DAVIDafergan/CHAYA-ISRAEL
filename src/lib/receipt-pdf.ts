import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib';

// ⚠️ LEGAL DETAILS — VERIFY BEFORE SENDING REAL RECEIPTS TO DONORS ⚠️
// These values feed directly into an IRS-facing tax document. Do not change them
// without confirmation from the org's accountant/CPA.

// TODO: confirm exact legal name with the org's CPA before relying on this for
// filings — GuideStar (from the org's Form 990) lists "The Chaya-Israel
// Foundation, Inc.", while this matches the current chayaisrael.com site copy.
const ORG_LEGAL_NAME = 'The Chaya Israel Foundation';

// Verified consistently across GuideStar, Daffy, GreatNonprofits, Benevity.
const ORG_EIN = '42-1605375';

// Confirmed address for the organization.
const ORG_ADDRESS = 'Chaya Israel Foundation C/O Fuchs, 335 East 77th Street, Apt. # 3, New York, NY 10075';

const ORG_TAX_STATEMENT =
  'The Chaya Israel Foundation is a 501(c)(3) Charitable Organization. All donations are tax deductible to US citizens.';

// Assumes no goods or services were provided in exchange for any donation.
// Verify this is accurate — if the org ever offers perks/tickets/membership in
// exchange for a donation, this statement must be replaced with a description
// and good-faith estimate of that value instead.
const NO_GOODS_OR_SERVICES_STATEMENT =
  'No goods or services were provided in exchange for this contribution.';

const PRIMARY_COLOR = rgb(0.11, 0.31, 0.85);
const TEXT_COLOR = rgb(0.15, 0.15, 0.15);
const MUTED_COLOR = rgb(0.45, 0.45, 0.45);
const PAGE_WIDTH = 612; // US Letter
const PAGE_HEIGHT = 792;
const MARGIN_X = 56;

interface DrawTextOptions {
  size?: number;
  font?: PDFFont;
  color?: ReturnType<typeof rgb>;
}

// Matches the receipt number shown on the live receipt page
// (src/app/receipt/[id]/page.tsx): first 8 chars of the PayPal transaction ID.
export function formatReceiptNumber(donation: { transactionId?: string; id?: string }): string {
  const source = donation.transactionId || donation.id || 'UNKNOWN';
  return source.substring(0, 8).toUpperCase();
}

export interface ReceiptDonation {
  id?: string;
  transactionId?: string;
  amount: number;
  currency: string;
  payerName?: string;
  payerEmail: string;
  cause?: string;
  status?: string;
  timestamp?: string;
  createdAtDate?: Date;
}

export async function generateReceiptPdf(donation: ReceiptDonation): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let cursorY = PAGE_HEIGHT - 64;

  const drawLine = (text: string, options: DrawTextOptions = {}, spacingAfter = 16) => {
    page.drawText(text, {
      x: MARGIN_X,
      y: cursorY,
      size: options.size ?? 11,
      font: options.font ?? regularFont,
      color: options.color ?? TEXT_COLOR,
    });
    cursorY -= spacingAfter;
  };

  const drawRule = (spacingAfter = 20) => {
    page.drawLine({
      start: { x: MARGIN_X, y: cursorY },
      end: { x: PAGE_WIDTH - MARGIN_X, y: cursorY },
      thickness: 0.75,
      color: rgb(0.85, 0.85, 0.85),
    });
    cursorY -= spacingAfter;
  };

  const drawSectionHeading = (text: string) => {
    drawLine(text, { size: 13, font: boldFont, color: PRIMARY_COLOR }, 18);
  };

  const receiptLabel = `RC-${formatReceiptNumber(donation)}`;
  const donationDate = donation.createdAtDate
    ? donation.createdAtDate
    : donation.timestamp
      ? new Date(donation.timestamp)
      : new Date();

  // --- Header -----------------------------------------------------------
  drawLine(ORG_LEGAL_NAME, { size: 22, font: boldFont, color: PRIMARY_COLOR }, 24);
  drawLine('Official Donation Receipt', { size: 12, color: MUTED_COLOR }, 30);

  drawLine(`Receipt #: ${receiptLabel}`, { size: 11, font: boldFont }, 16);
  drawLine(
    `Date of donation: ${donationDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
    {},
    24,
  );
  drawRule();

  // --- Donor information --------------------------------------------------
  drawSectionHeading('Donor Information');
  drawLine(`Name: ${donation.payerName || 'Generous Donor'}`);
  drawLine(`Email: ${donation.payerEmail}`, {}, 24);
  drawRule();

  // --- Donation details -----------------------------------------------
  drawSectionHeading('Donation Details');
  drawLine(`Amount: ${donation.amount.toFixed(2)} ${donation.currency}`);
  drawLine(`Cause: ${donation.cause || 'General support'}`);
  drawLine('Payment method: PayPal');
  drawLine(`PayPal transaction ID: ${donation.transactionId || 'N/A'}`, {}, 20);
  drawLine(NO_GOODS_OR_SERVICES_STATEMENT, { size: 10, color: MUTED_COLOR }, 24);
  drawRule();

  // --- Organization information ---------------------------------------
  drawSectionHeading('Organization Information');
  drawLine(ORG_LEGAL_NAME);
  drawLine(`EIN: ${ORG_EIN}`);
  drawLine(`Address: ${ORG_ADDRESS}`, {}, 20);
  drawLine(ORG_TAX_STATEMENT, { size: 10, color: MUTED_COLOR }, 40);
  drawRule();

  // --- Thank-you letter --------------------------------------------------
  drawLine('Thank You', { size: 14, font: boldFont, color: PRIMARY_COLOR }, 20);

  const thankYouLines = [
    `Dear ${donation.payerName || 'Friend'},`,
    '',
    'On behalf of everyone at The Chaya Israel Foundation, thank you for your generous',
    'contribution. Your support directly fuels our mission and makes a lasting difference',
    'in the lives of those we serve.',
    '',
    'With heartfelt gratitude,',
    'The Chaya Israel Foundation',
  ];
  for (const line of thankYouLines) {
    drawLine(line, { size: 11 }, 16);
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
