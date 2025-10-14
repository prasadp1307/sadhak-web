import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

// Dummy users data
const dummyUsers = [
  {
    email: 'user1@sadhak.com',
    password: 'password123',
    name: 'Test User 1'
  },
  {
    email: 'user2@sadhak.com',
    password: 'password123',
    name: 'Test User 2'
  },
  {
    email: 'user3@sadhak.com',
    password: 'password123',
    name: 'Test User 3'
  }
];

async function createDummyUsers() {
  console.log('🚀 Starting to create dummy users...\n');

  for (const user of dummyUsers) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      console.log(`✅ Created user: ${user.email}`);
      console.log(`   UID: ${userCredential.user.uid}`);
      console.log(`   Email: ${userCredential.user.email}\n`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User already exists: ${user.email}\n`);
      } else {
        console.error(`❌ Error creating user ${user.email}:`, error.message, '\n');
      }
    }
  }

  console.log('✨ Dummy user creation process completed!');
  console.log('\n📋 User Credentials:');
  console.log('-------------------');
  dummyUsers.forEach((user, index) => {
    console.log(`${index + 1}. Email: ${user.email}`);
    console.log(`   Password: ${user.password}\n`);
  });
  
  console.log('🔍 To view users:');
  console.log('1. Start the dev server: npm run dev');
  console.log('2. Navigate to: http://localhost:3000/admin/users');
  console.log('3. Or check Firebase Console: https://console.firebase.google.com/project/sadhak-web/authentication/users');
  
  process.exit(0);
}

// Run the script
createDummyUsers().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
