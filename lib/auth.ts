import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

/**
 * Get user-friendly error message from Firebase error code
 */
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/configuration-not-found': 
      '🔧 Firebase Authentication is not enabled. Please enable Email/Password authentication in Firebase Console. See FIREBASE_SETUP_GUIDE.md for instructions.',
    'auth/invalid-email': 
      '❌ Invalid email address format.',
    'auth/user-disabled': 
      '❌ This account has been disabled.',
    'auth/user-not-found': 
      '❌ No account found with this email.',
    'auth/wrong-password': 
      '❌ Incorrect password.',
    'auth/email-already-in-use': 
      '❌ An account already exists with this email.',
    'auth/weak-password': 
      '❌ Password should be at least 6 characters.',
    'auth/operation-not-allowed': 
      '🔧 Email/Password authentication is not enabled. Please enable it in Firebase Console.',
    'auth/invalid-api-key': 
      '🔧 Invalid Firebase API key. Please check your .env.local file.',
    'auth/network-request-failed': 
      '🌐 Network error. Please check your internet connection.',
    'auth/too-many-requests': 
      '⏱️ Too many failed attempts. Please try again later.',
  };

  return errorMessages[errorCode] || `❌ Authentication error: ${errorCode}`;
};

export const signUp = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Check configuration.');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code);
    console.error('Sign up error:', error.code, error.message);
    throw new Error(errorMessage);
  }
};

export const signIn = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Check configuration.');
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code);
    console.error('Sign in error:', error.code, error.message);
    throw new Error(errorMessage);
  }
};

export const logOut = async () => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Check configuration.');
  }
  try {
    await signOut(auth);
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code);
    console.error('Sign out error:', error.code, error.message);
    throw new Error(errorMessage);
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.warn('Firebase Auth not initialized');
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
