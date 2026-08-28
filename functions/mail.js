const {formatReceiptNumber} = require("./receipt-pdf");

// Kept in sync by hand with src/lib/mail.ts — see the note in receipt-pdf.js.

/**
 * Writes a document to the `mail` Firestore collection, which the installed
 * `firebase/firestore-send-email` extension picks up and actually sends.
 * @param {FirebaseFirestore.Firestore} db Admin Firestore instance.
 * @param {object} doc Mail document to queue.
 * @return {Promise<void>} Resolves once queued.
 */
async function queueMail(db, doc) {
  await db.collection("mail").add(doc);
}

/**
 * Donor-facing official tax receipt, with the generated PDF attached.
 * @param {FirebaseFirestore.Firestore} db Admin Firestore instance.
 * @param {object} donation Donation record.
 * @param {Buffer} pdfBuffer Generated receipt PDF.
 * @return {Promise<void>} Resolves once queued.
 */
async function sendDonorReceiptEmail(db, donation, pdfBuffer) {
  const receiptLabel = `RC-${formatReceiptNumber(donation)}`;
  const donorName = donation.payerName || "Generous Donor";
  const amount = Number(donation.amount).toFixed(2);

  await queueMail(db, {
    to: donation.payerEmail,
    message: {
      subject: `Your donation receipt — The Chaya Israel Foundation (#${receiptLabel})`,
      text: [
        `Dear ${donorName},`,
        "",
        `Thank you for your generous donation of ${amount} ${donation.currency} to The Chaya Israel Foundation.`,
        "Your official tax-deductible receipt is attached to this email as a PDF.",
        "",
        "With gratitude,",
        "The Chaya Israel Foundation",
        "",
        "----------------------------------------",
        "",
        `תורם/ת יקר/ה ${donorName},`,
        "",
        `תודה רבה על תרומתך הנדיבה בסך ${amount} ${donation.currency} לעמותת חיה ישראל (Chaya Israel Foundation).`,
        "הקבלה הרשמית לצורכי מס מצורפת למייל זה כקובץ PDF.",
        "",
        "בתודה,",
        "עמותת חיה ישראל",
      ].join("\n"),
      html: [
        `<p>Dear ${donorName},</p>`,
        `<p>Thank you for your generous donation of ${amount} ${donation.currency} to The Chaya Israel Foundation.</p>`,
        "<p>Your official tax-deductible receipt is attached to this email as a PDF.</p>",
        "<p>With gratitude,<br/>The Chaya Israel Foundation</p>",
        "<hr/>",
        `<p dir="rtl">תורם/ת יקר/ה ${donorName},</p>`,
        `<p dir="rtl">תודה רבה על תרומתך הנדיבה בסך ${amount} ` +
          `${donation.currency} לעמותת חיה ישראל (Chaya Israel Foundation).</p>`,
        "<p dir=\"rtl\">הקבלה הרשמית לצורכי מס מצורפת למייל זה כקובץ PDF.</p>",
        "<p dir=\"rtl\">בתודה,<br/>עמותת חיה ישראל</p>",
      ].join(""),
      // Must live under `message`, not at the document's top level — the
      // extension's deliver() reads `payload.message?.attachments`
      // specifically (undocumented; confirmed by reading its source and by
      // functions:log on two real donations that sent with no attachment
      // when this was top-level).
      attachments: [
        {
          filename: `Chaya-Israel-Receipt-${receiptLabel}.pdf`,
          content: pdfBuffer.toString("base64"),
          encoding: "base64",
        },
      ],
    },
    createdAt: new Date().toISOString(),
    source: "auto-receipt-trigger",
  });
}

module.exports = {sendDonorReceiptEmail};
