import { adminDb } from '@/lib/firebase-admin';
import { formatReceiptNumber, type ReceiptDonation } from '@/lib/receipt-pdf';

// Internal address notified whenever a donation completes — matches the
// existing contact-form notification target (src/app/api/contact/route.ts).
const DONATION_NOTIFY_EMAIL = 'kramera613@gmail.com';

/**
 * Writes a document to the `mail` Firestore collection, which the installed
 * `firebase/firestore-send-email` extension picks up and actually sends.
 * This runs via the Admin SDK, so it bypasses the client-facing Firestore
 * rule that restricts `mail` writes to the fixed contact-form address.
 */
async function queueMail(doc: Record<string, unknown>): Promise<void> {
  await adminDb.collection('mail').add(doc);
}

/**
 * Internal notification sent to the org whenever a donation completes.
 * Separate from, and in addition to, the donor-facing receipt email below.
 */
export async function sendDonationNotificationEmail(donation: ReceiptDonation & { status?: string }): Promise<void> {
  const receiptLabel = `RC-${formatReceiptNumber(donation)}`;
  await queueMail({
    to: DONATION_NOTIFY_EMAIL,
    message: {
      subject: `New donation received — $${donation.amount.toFixed(2)} from ${donation.payerName || 'a donor'}`,
      text: [
        'A new donation was received.',
        '',
        `Donor: ${donation.payerName || 'N/A'} <${donation.payerEmail}>`,
        `Amount: ${donation.amount.toFixed(2)} ${donation.currency}`,
        `Cause: ${donation.cause || 'General'}`,
        `Status: ${donation.status || 'COMPLETED'}`,
        `PayPal transaction ID: ${donation.transactionId || 'N/A'}`,
        `Receipt #: ${receiptLabel}`,
      ].join('\n'),
      html: [
        '<p>A new donation was received.</p>',
        '<ul>',
        `<li>Donor: ${donation.payerName || 'N/A'} &lt;${donation.payerEmail}&gt;</li>`,
        `<li>Amount: ${donation.amount.toFixed(2)} ${donation.currency}</li>`,
        `<li>Cause: ${donation.cause || 'General'}</li>`,
        `<li>Status: ${donation.status || 'COMPLETED'}</li>`,
        `<li>PayPal transaction ID: ${donation.transactionId || 'N/A'}</li>`,
        `<li>Receipt #: ${receiptLabel}</li>`,
        '</ul>',
      ].join(''),
    },
    createdAt: new Date().toISOString(),
    source: 'donation-notification',
  });
}

/**
 * Donor-facing official tax receipt, with the generated PDF attached.
 * English + Hebrew in the email body; the PDF itself is English-only.
 */
export async function sendDonorReceiptEmail(donation: ReceiptDonation, pdfBuffer: Buffer): Promise<void> {
  const receiptLabel = `RC-${formatReceiptNumber(donation)}`;
  const donorName = donation.payerName || 'Generous Donor';

  await queueMail({
    to: donation.payerEmail,
    message: {
      subject: `Your donation receipt — The Chaya Israel Foundation (#${receiptLabel})`,
      text: [
        `Dear ${donorName},`,
        '',
        `Thank you for your generous donation of ${donation.amount.toFixed(2)} ${donation.currency} to The Chaya Israel Foundation.`,
        'Your official tax-deductible receipt is attached to this email as a PDF.',
        '',
        'With gratitude,',
        'The Chaya Israel Foundation',
        '',
        '----------------------------------------',
        '',
        `תורם/ת יקר/ה ${donorName},`,
        '',
        `תודה רבה על תרומתך הנדיבה בסך ${donation.amount.toFixed(2)} ${donation.currency} לעמותת חיה ישראל (Chaya Israel Foundation).`,
        'הקבלה הרשמית לצורכי מס מצורפת למייל זה כקובץ PDF.',
        '',
        'בתודה,',
        'עמותת חיה ישראל',
      ].join('\n'),
      html: [
        `<p>Dear ${donorName},</p>`,
        `<p>Thank you for your generous donation of ${donation.amount.toFixed(2)} ${donation.currency} to The Chaya Israel Foundation.</p>`,
        '<p>Your official tax-deductible receipt is attached to this email as a PDF.</p>',
        '<p>With gratitude,<br/>The Chaya Israel Foundation</p>',
        '<hr/>',
        `<p dir="rtl">תורם/ת יקר/ה ${donorName},</p>`,
        `<p dir="rtl">תודה רבה על תרומתך הנדיבה בסך ${donation.amount.toFixed(2)} ${donation.currency} לעמותת חיה ישראל (Chaya Israel Foundation).</p>`,
        '<p dir="rtl">הקבלה הרשמית לצורכי מס מצורפת למייל זה כקובץ PDF.</p>',
        '<p dir="rtl">בתודה,<br/>עמותת חיה ישראל</p>',
      ].join(''),
      // Must live under `message`, not at the document's top level — the
      // extension's own deliver() reads `payload.message?.attachments`
      // specifically (confirmed by reading its source; this isn't
      // documented anywhere in the extension's README/PREINSTALL/
      // POSTINSTALL/CHANGELOG). A top-level `attachments` field is silently
      // dropped: Nodemailer just sends with no attachment and no error —
      // confirmed via functions:log on two real donations before this fix.
      attachments: [
        {
          filename: `Chaya-Israel-Receipt-${receiptLabel}.pdf`,
          content: pdfBuffer.toString('base64'),
          encoding: 'base64',
        },
      ],
    },
    createdAt: new Date().toISOString(),
    source: 'donation-receipt',
  });
}
