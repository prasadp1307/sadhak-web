import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Demo user credentials
const demoUser = {
  email: 'admin@sadhak.com',
  password: 'Sadhak@2026',
  role: 'Showcase Admin',
};

async function createDemoUser() {
  console.log('🚀 Starting Showcase/Demo user creation process...\n');
  console.log(`Target Email: ${demoUser.email}`);
  console.log(`Target Role:  ${demoUser.role}\n`);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      demoUser.email,
      demoUser.password
    );
    console.log(`✅ Successfully created Showcase Demo user: ${demoUser.email}`);
    console.log(`   UID: ${userCredential.user.uid}`);
    console.log(`   Email: ${userCredential.user.email}`);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️  User already exists: ${demoUser.email}`);
      console.log('Attempting verification by signing in...');
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          demoUser.email,
          demoUser.password
        );
        console.log(`✅ Verified existing Showcase Demo user login successfully.`);
        console.log(`   UID: ${userCredential.user.uid}`);
      } catch (signInErr: any) {
        console.error(`❌ User exists but credentials mismatch or error: ${signInErr.message}`);
      }
    } else {
      console.error(`❌ Error creating demo user ${demoUser.email}:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n✨ Showcase Demo User Setup Complete!');
  console.log('------------------------------------');
  console.log(`Email:    ${demoUser.email}`);
  console.log(`Password: ${demoUser.password}`);
  console.log(`Scope:    Isolated (Zero business/production data access)`);
  console.log('------------------------------------\n');

  process.exit(0);
}

// Run script
createDemoUser().catch((error) => {
  console.error('❌ Fatal error in demo user creation script:', error);
  process.exit(1);
});
