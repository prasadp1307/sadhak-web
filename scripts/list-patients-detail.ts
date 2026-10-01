import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listPatients() {
  const snap = await getDocs(collection(db, 'patients'));
  console.log(`Total patients in 'patients' collection: ${snap.docs.length}\n`);

  snap.docs.forEach(docSnap => {
    const d = docSnap.data();
    console.log({
      id: docSnap.id,
      name: d.name,
      createdBy: d.createdBy || 'PREVIOUS_REAL_USER (No createdBy tag)',
      createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt,
      lastVisit: d.lastVisit,
      phoneNumber: d.phoneNumber
    });
  });
}

listPatients().catch(console.error);
