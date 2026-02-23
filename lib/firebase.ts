import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Get Firebase configuration object from environment variables
 * Returns undefined if required variables are missing
 */
export const getFirebaseConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  
  // Check for required variables
  if (!apiKey || !authDomain || !projectId) {
    console.warn('[Firebase Config] Missing environment variables. Firebase will not be available.');
    console.warn('[Firebase Config] Required: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    return null;
  }
  
  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };
};

// Initialize Firebase application
let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let firestoreInstance: Firestore | undefined;

// Initialize only if config is available
const config = getFirebaseConfig();

if (config) {
  try {
    // Only initialize if no apps already exist
    if (getApps().length === 0) {
      app = initializeApp(config);
      console.log('[Firebase] Initialized successfully');
    } else {
      app = getApps()[0];
      console.log('[Firebase] Using existing app');
    }
    authInstance = getAuth(app);
    firestoreInstance = getFirestore(app);
    console.log('[Firebase] Auth and Firestore ready');
  } catch (error) {
    console.error('[Firebase] Initialization failed:', error instanceof Error ? error.message : 'Unknown error');
  }
} else {
  console.warn('[Firebase] Not initialized - missing configuration');
}

/**
 * Exported authenticated instance (may be undefined if config missing)
 */
export const auth = authInstance;

/**
 * Exported Firestore database instance (may be undefined if config missing)
 */
export const db = firestoreInstance;

/**
 * Check if Firebase is properly initialized
 */
export const isFirebaseInitialized = () => !!auth && !!db;
