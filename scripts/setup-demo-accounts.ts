import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const demoAccounts = [
  { email: 'admin@sadhak.com', password: 'Sadhak@2026' },
  { email: 'demo@sadhak.com', password: 'Sadhak@2026' },
  { email: 'showcase@sadhak.com', password: 'Sadhak@2026' }
];

async function setupDemoAccounts() {
  console.log('🚀 Provisioning Showcase Demo Accounts...\n');

  for (const acc of demoAccounts) {
    console.log(`Processing ${acc.email}...`);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, acc.email, acc.password);
      console.log(`  ✅ Successfully created new account: ${acc.email}`);
      console.log(`     UID: ${userCredential.user.uid}`);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        console.log(`  ⚠️ Account already exists: ${acc.email}. Testing login...`);
        try {
          const userCredential = await signInWithEmailAndPassword(auth, acc.email, acc.password);
          console.log(`  ✅ Login verified for ${acc.email}`);
          console.log(`     UID: ${userCredential.user.uid}`);
        } catch (loginErr: any) {
          console.log(`  ❌ Login failed for ${acc.email}: ${loginErr.code} - ${loginErr.message}`);
        }
      } else {
        console.log(`  ❌ Error for ${acc.email}: ${err.code} - ${err.message}`);
      }
    }
    console.log('');
  }

  process.exit(0);
}

setupDemoAccounts();
