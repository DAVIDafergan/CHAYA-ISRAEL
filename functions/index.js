const {setGlobalOptions} = require("firebase-functions");

// Increased memory and instances for better SSR performance and reliability.
setGlobalOptions({
  maxInstances: 10,
  memory: "1GiB", // Sufficient for Next.js image optimization and SSR
  timeoutSeconds: 120, // Increased for stability
});
