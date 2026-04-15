
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/onCall");
 * const {onDocumentwritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");

// Increased memory and instances for better SSR performance and reliability.
setGlobalOptions({
  maxInstances: 10,
  memory: "1GiB", // Sufficient for Next.js image optimization and SSR
  timeoutSeconds: 120, // Increased for stability
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
