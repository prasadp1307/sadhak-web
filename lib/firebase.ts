import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Required environment variables for Firebase configuration
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
] as const;

/**
 * Validate that all required environment variables are present
 */
const validateEnvironmentVariables = (): void => {
  const missingVars: string[] = [];
  
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.error('[Firebase Config] Missing required environment variables:', missingVars.join(', '));
    throw new Error('Missing required Firebase configuration: ' + missingVars.join(','));
  }

  // Log non-sensitive config info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Firebase Config] Initializing with:', {
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
};

/**
 * Get Firebase configuration object from environment variables
 */
export const getFirebaseConfig = () => ({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
});

// Initialize Firebase application - validates config before initialization
let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let firestoreInstance: Firestore | undefined;

// Validate and initialize on module load
validateEnvironmentVariables();

try {
  app = initializeApp(getFirebaseConfig());
  authInstance = getAuth(app);
  firestoreInstance = getFirestore(app);
  console.log('[Firebase] Successfully initialized');
} catch (error) {
  console.error('[Firebase] Initialization failed:', error instanceof Error ? error.message : 'Unknown error');
  throw error;
}

/**
 * Exported authenticated instance
 */
export const auth = authInstance;

/**
 * Exported Firestore database instance
 */
export const db = firestoreInstance;
