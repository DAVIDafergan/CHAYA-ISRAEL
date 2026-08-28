const {setGlobalOptions} = require("firebase-functions");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const {generateReceiptPdf} = require("./receipt-pdf");
const {sendDonorReceiptEmail} = require("./mail");

// Increased memory and instances for better SSR performance and reliability.
setGlobalOptions({
  maxInstances: 10,
  memory: "1GiB", // Sufficient for Next.js image optimization and SSR
  timeoutSeconds: 120, // Increased for stability
});

if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Checks whether a newly-created donation is trustworthy enough to
 * auto-email a tax receipt for, without a human clicking "Send". This is a
 * defense-in-depth check, not the actual fix — until the PayPal webhook
 * verifies signatures server-to-server (Deploy 2), the dashboard toggle
 * that would let this trigger actually run stays disabled in the UI. Once
 * Deploy 2 ships, this still guards against any other stray write reaching
 * `donations` with a shape that was never a real completed capture.
 * @param {object} donation Newly-created donation document data.
 * @return {boolean} True if the donation looks like a real completed PayPal capture.
 */
function isTrustworthyCompletedDonation(donation) {
  if (donation.paypalDetails?.status !== "COMPLETED") {
    return false;
  }
  const transactionId = donation.transactionId;
  if (typeof transactionId !== "string" || transactionId.length < 8) {
    return false;
  }
  // Matches the placeholder ID shape used when the webhook couldn't find a
  // real PayPal resource ID — never a genuine transaction.
  if (transactionId.startsWith("tr-")) {
    return false;
  }
  return true;
}

/**
 * Fires on every new donation document. Sends an automatic tax-receipt
 * email only when an admin has explicitly turned the feature on
 * (settings/receiptConfig.autoReceiptEnabled) and the donation itself
 * passes isTrustworthyCompletedDonation(). Never throws past this
 * function's own error handling — a failed auto-send should not retry
 * forever or crash the trigger; the admin can always send it manually
 * afterward from the dashboard.
 */
exports.autoSendReceiptOnDonationCreated = onDocumentCreated(
    "donations/{donationId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) return;

      const donation = {id: snapshot.id, ...snapshot.data()};
      const db = admin.firestore();

      let configSnap;
      try {
        configSnap = await db.collection("settings").doc("receiptConfig").get();
      } catch (err) {
        console.error("[auto-receipt] Failed to read settings/receiptConfig:", err);
        return;
      }

      if (configSnap.data()?.autoReceiptEnabled !== true) {
        return;
      }

      if (donation.receiptSentAt) {
        console.log(`[auto-receipt] ${donation.id} already has receiptSentAt — skipping (likely a retried delivery).`);
        return;
      }

      if (!isTrustworthyCompletedDonation(donation)) {
        console.warn(`[auto-receipt] ${donation.id} did not pass the trustworthiness check — skipping auto-send.`);
        return;
      }

      try {
        const pdfBuffer = await generateReceiptPdf(donation);
        await sendDonorReceiptEmail(db, donation, pdfBuffer);
        await snapshot.ref.update({receiptSentAt: new Date().toISOString()});
        console.log(`[auto-receipt] Sent automatic receipt for donation ${donation.id}.`);
      } catch (err) {
        console.error(`[auto-receipt] Failed to auto-send receipt for donation ${donation.id}:`, err);
      }
    },
);
