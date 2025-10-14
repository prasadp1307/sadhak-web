import { auth, db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export interface FirebaseTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export interface FirebaseStatus {
  initialized: FirebaseTestResult;
  auth: FirebaseTestResult;
  firestore: FirebaseTestResult;
  overall: boolean;
}

/**
 * Test if Firebase is properly initialized
 */
export const testFirebaseInitialization = (): FirebaseTestResult => {
  try {
    if (!auth || !db) {
      return {
        success: false,
        message: 'Firebase services not initialized',
      };
    }
    return {
      success: true,
      message: 'Firebase initialized successfully',
      details: {
        authConfigured: !!auth,
        firestoreConfigured: !!db,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Firebase initialization failed',
      details: error.message,
    };
  }
};

/**
 * Test Firebase Auth service
 */
export const testFirebaseAuth = async (): Promise<FirebaseTestResult> => {
  try {
    // Check if auth is available
    if (!auth) {
      return {
        success: false,
        message: 'Firebase Auth not initialized',
      };
    }

    // Check current auth state
    const currentUser = auth.currentUser;
    
    return {
      success: true,
      message: 'Firebase Auth is available',
      details: {
        authDomain: auth.config.authDomain,
        currentUser: currentUser ? currentUser.email : 'No user signed in',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Firebase Auth test failed',
      details: error.message,
    };
  }
};

/**
 * Test Firestore connection by attempting to read from a test collection
 */
export const testFirestore = async (): Promise<FirebaseTestResult> => {
  try {
    if (!db) {
      return {
        success: false,
        message: 'Firestore not initialized',
      };
    }

    // Try to create a test collection reference
    const testCollection = collection(db, '_connection_test');
    
    // Try to write a test document
    const testDoc = await addDoc(testCollection, {
      test: true,
      timestamp: new Date().toISOString(),
    });

    // Try to read it back
    const snapshot = await getDocs(testCollection);
    
    // Clean up - delete the test document
    await deleteDoc(doc(db, '_connection_test', testDoc.id));

    return {
      success: true,
      message: 'Firestore connection successful',
      details: {
        canWrite: true,
        canRead: true,
        documentsFound: snapshot.size,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Firestore connection failed',
      details: error.message,
    };
  }
};

/**
 * Run all Firebase tests
 */
export const runAllFirebaseTests = async (): Promise<FirebaseStatus> => {
  const initialized = testFirebaseInitialization();
  const authTest = await testFirebaseAuth();
  const firestoreTest = await testFirestore();

  return {
    initialized,
    auth: authTest,
    firestore: firestoreTest,
    overall: initialized.success && authTest.success && firestoreTest.success,
  };
};

/**
 * Get Firebase configuration details (without sensitive data)
 */
export const getFirebaseConfig = () => {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not set',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Not set',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
  };
};
