import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

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

const passwordsToTest = [
  'Sadhak@2026',
  'password123',
  'Sadhak@123',
  'sadhak123',
  'admin123',
  'Admin@123'
];

async function testLogin() {
  console.log('🔍 Testing login for user1@sadhak.com...\n');

  for (const pwd of passwordsToTest) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, 'user1@sadhak.com', pwd);
      console.log(`🎉 SUCCESS! Password found for user1@sadhak.com: "${pwd}"`);
      console.log(`   UID: ${userCredential.user.uid}`);
      process.exit(0);
    } catch (err: any) {
      console.log(`❌ Failed with password "${pwd}": ${err.code} - ${err.message}`);
    }
  }

  process.exit(1);
}

testLogin();
