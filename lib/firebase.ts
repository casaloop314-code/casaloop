import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with error handling
let db: ReturnType<typeof getFirestore>;

try {
  db = getFirestore(app);
} catch (error) {
  console.error('[CasaLoop] Firestore init error:', error);
  // Still assign db so imports don't break - operations will fail gracefully
  db = getFirestore(app);
}

export { db };
