import * as admin from 'firebase-admin';

/**
 * Singleton Firebase Admin initialization.
 * Prevents multiple initializations and memory leaks in Next.js development mode.
 */
function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    // admin.apps is typed as (App | null)[] by the SDK, but a slot we just
    // confirmed exists via .length is never actually null in practice.
    return admin.apps[0]!;
  }

  return admin.initializeApp({
    projectId: 'chayaisrael-8e860',
  });
}

const adminApp = getAdminApp();
const adminDb = adminApp.firestore();

export { admin, adminDb, adminApp };
