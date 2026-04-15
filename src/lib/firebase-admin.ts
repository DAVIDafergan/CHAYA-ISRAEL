
import * as admin from 'firebase-admin';

/**
 * Singleton Firebase Admin initialization.
 * Prevents multiple initializations and memory leaks.
 */
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'chayaisrael-8e860',
  });
}

const adminDb = admin.firestore();

export { admin, adminDb };
