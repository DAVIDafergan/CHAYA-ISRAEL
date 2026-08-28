const {PDFDocument, rgb} = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const {NOTO_SANS_HEBREW_BASE64} = require("./fonts/notoSansHebrewBase64");

// Kept in sync by hand with src/lib/receipt-pdf.ts — this Cloud Functions
// codebase is a separate deployable unit from the Next.js app (its own
// package.json/node_modules), so it can't just import that file directly.
// If the receipt layout or org details change, update both.

// TODO: confirm exact legal name with the org's CPA before relying on this for
// filings — GuideStar (from the org's Form 990) lists "The Chaya-Israel
// Foundation, Inc.", while this matches the current chayaisrael.com site copy.
const ORG_LEGAL_NAME = "The Chaya Israel Foundation";
const ORG_EIN = "42-1605375";
const ORG_ADDRESS = "Chaya Israel Foundation C/O Fuchs, 335 East 77th Street, Apt. # 3, New York, NY 10075";
const ORG_TAX_STATEMENT =
  "The Chaya Israel Foundation is a 501(c)(3) Charitable Organization. " +
  "All donations are tax deductible to US citizens.";
const NO_GOODS_OR_SERVICES_STATEMENT =
  "No goods or services were provided in exchange for this contribution.";

const PRIMARY_COLOR = rgb(0.11, 0.31, 0.85);
const TEXT_COLOR = rgb(0.15, 0.15, 0.15);
const MUTED_COLOR = rgb(0.45, 0.45, 0.45);
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 56;

// pdf-lib's built-in StandardFonts (Helvetica etc.) are WinAnsi-encoded —
// Latin-only. A real donor with a Hebrew name (confirmed in production:
// donation MYuNSSbhN2FRJ2mff8Zn) crashes generateReceiptPdf entirely with
// "WinAnsi cannot encode ..." the moment drawText() hits a Hebrew character.
// Noto Sans Hebrew (SIL OFL) covers Hebrew + Latin + digits + common
// punctuation in one font, so it's used for every string here — no
// per-language font switching. It's a variable font (only the default
// Regular-weight instance is embedded, not a separate bold cut), so
// headings lose bold weight and rely on color for emphasis instead — a
// cosmetic tradeoff for closing an actual crash.
//
// Font bytes are embedded as base64 (fonts/notoSansHebrewBase64.js) rather
// than read from disk — see the matching note in
// src/lib/receipt-pdf.ts for why a __dirname-relative file read is
// unreliable for a module shared across separately-bundled routes.

const HEBREW_CHAR_RANGE = /[֐-׿]/;

/**
 * pdf-lib's drawText() lays out glyphs left-to-right with no bidi support.
 * For a name that's entirely/mostly Hebrew, reverse word order (keeping
 * each word's internal character order intact) so it reads correctly
 * right-to-left on the page. This is a pragmatic approximation for a
 * single name field, not a full Unicode bidi algorithm.
 * @param {string} text Text to possibly reorder.
 * @return {string} Text in visual left-to-right draw order.
 */
function displayOrder(text) {
  if (!HEBREW_CHAR_RANGE.test(text)) return text;
  return text.split(" ").reverse().join(" ");
}

/**
 * Matches the receipt number shown on the live receipt page
 * (src/app/receipt/[id]/page.tsx): first 8 chars of the PayPal transaction ID.
 * @param {object} donation Donation record (transactionId and/or id).
 * @return {string} Short receipt number.
 */
function formatReceiptNumber(donation) {
  const source = donation.transactionId || donation.id || "UNKNOWN";
  return source.substring(0, 8).toUpperCase();
}

/**
 * Generates the official tax-receipt PDF for one donation.
 * @param {object} donation Donation record (amount, currency, payerName, payerEmail, cause, transactionId, timestamp).
 * @return {Promise<Buffer>} The generated PDF as a Buffer.
 */
async function generateReceiptPdf(donation) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const hebrewFontBytes = Buffer.from(NOTO_SANS_HEBREW_BASE64, "base64");
  const font = await pdfDoc.embedFont(hebrewFontBytes, {subset: true});

  let cursorY = PAGE_HEIGHT - 64;

  const drawLine = (text, options = {}, spacingAfter = 16) => {
    page.drawText(displayOrder(text), {
      x: MARGIN_X,
      y: cursorY,
      size: options.size || 11,
      font: options.font || font,
      color: options.color || TEXT_COLOR,
    });
    cursorY -= spacingAfter;
  };

  const drawRule = (spacingAfter = 20) => {
    page.drawLine({
      start: {x: MARGIN_X, y: cursorY},
      end: {x: PAGE_WIDTH - MARGIN_X, y: cursorY},
      thickness: 0.75,
      color: rgb(0.85, 0.85, 0.85),
    });
    cursorY -= spacingAfter;
  };

  const drawSectionHeading = (text) => {
    drawLine(text, {size: 13, color: PRIMARY_COLOR}, 18);
  };

  const receiptLabel = `RC-${formatReceiptNumber(donation)}`;
  const donationDate = donation.timestamp ? new Date(donation.timestamp) : new Date();

  drawLine(ORG_LEGAL_NAME, {size: 22, color: PRIMARY_COLOR}, 24);
  drawLine("Official Donation Receipt", {size: 12, color: MUTED_COLOR}, 30);

  drawLine(`Receipt #: ${receiptLabel}`, {size: 11}, 16);
  drawLine(
      `Date of donation: ${donationDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      {},
      24,
  );
  drawRule();

  drawSectionHeading("Donor Information");
  drawLine(`Name: ${donation.payerName || "Generous Donor"}`);
  drawLine(`Email: ${donation.payerEmail}`, {}, 24);
  drawRule();

  drawSectionHeading("Donation Details");
  drawLine(`Amount: ${Number(donation.amount).toFixed(2)} ${donation.currency}`);
  drawLine(`Cause: ${donation.cause || "General support"}`);
  drawLine("Payment method: PayPal");
  drawLine(`PayPal transaction ID: ${donation.transactionId || "N/A"}`, {}, 20);
  drawLine(NO_GOODS_OR_SERVICES_STATEMENT, {size: 10, color: MUTED_COLOR}, 24);
  drawRule();

  drawSectionHeading("Organization Information");
  drawLine(ORG_LEGAL_NAME);
  drawLine(`EIN: ${ORG_EIN}`);
  drawLine(`Address: ${ORG_ADDRESS}`, {}, 20);
  drawLine(ORG_TAX_STATEMENT, {size: 10, color: MUTED_COLOR}, 40);
  drawRule();

  drawLine("Thank You", {size: 14, color: PRIMARY_COLOR}, 20);

  const thankYouLines = [
    `Dear ${donation.payerName || "Friend"},`,
    "",
    "On behalf of everyone at The Chaya Israel Foundation, thank you for your generous",
    "contribution. Your support directly fuels our mission and makes a lasting difference",
    "in the lives of those we serve.",
    "",
    "With heartfelt gratitude,",
    "The Chaya Israel Foundation",
  ];
  for (const line of thankYouLines) {
    drawLine(line, {size: 11}, 16);
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

module.exports = {generateReceiptPdf, formatReceiptNumber};
