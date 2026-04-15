import * as admin from 'firebase-admin';

/**
 * Singleton Firebase Admin initialization.
 * Prevents multiple initializations and memory leaks in Next.js development mode.
 */
function getAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  return admin.initializeApp({
    projectId: 'chayaisrael-8e860',
  });
}

const adminApp = getAdminApp();
const adminDb = adminApp.firestore();

export { admin, adminDb, adminApp };
