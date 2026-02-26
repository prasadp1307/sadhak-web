/**
 * Firestore Service - Production-ready CRUD operations
 * Uses modular Firebase SDK v9+
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db, isFirebaseInitialized } from './firebase';

// Collection names as constants
export const COLLECTIONS = {
  PATIENTS: 'patients',
  USERS: 'users',
  APPOINTMENTS: 'appointments',
  FOLLOW_UPS: 'followUps',
  PAYMENTS: 'payments',
  MEDICINES: 'medicines',
  TREATMENTS: 'treatments',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

/**
 * Base interface for all Firestore documents
 */
export interface FirestoreDocument {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Patient extends FirestoreDocument {
  name: string;
  age: number;
  dob?: string;
  address: string;
  phoneNumber: string;
  job: string;
  reference: string;
  symptoms?: string;
  treatmentPlan?: string;
  lastVisit?: string;
  nextAppointmentDate?: string;
  status: string;
  nadiParikshan?: string;
  condition?: string;
  ho?: string;
  treatment?: string;
  parikshan?: string;
}

export interface Appointment extends FirestoreDocument {
  time: string;
  date: string;
  patientId: string;
  patientName: string;
  type: string;
  duration: string;
  status?: string;
}

export interface FollowUp extends FirestoreDocument {
  patientId: string;
  date: string;
  time?: string; // Added to support explicit time tracking
  notes: string;
  reason: string;
  status: 'Pending' | 'Completed';
}

export interface Payment extends FirestoreDocument {
  patientId: string;
  appointmentId?: string;
  consultingFee: number;
  medicineCharges: number;
  procedureCharges: number;
  panchakarmaCharges: number;
  extraCharges: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  date: string;
}

export interface Medicine extends FirestoreDocument {
  name: string;
  category: string;
  stock: number;
  lowStock: boolean;
  price: string;
}

export interface Treatment extends FirestoreDocument {
  name: string;
  description: string;
  duration: string;
  category: string;
}

/**
 * Pagination result interface
 */
export interface PaginatedResult<T> {
  data: T[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

/**
 * Get a reference to a collection
 * Throws error if Firebase is not initialized
 */
export const getCollectionRef = (collectionName: CollectionName) => {
  if (!db) {
    throw new Error('Firestore not initialized. Check Firebase configuration.');
  }
  return collection(db, collectionName);
};

/**
 * Get a reference to a document
 * Throws error if Firebase is not initialized
 */
export const getDocumentRef = (collectionName: CollectionName, documentId: string) => {
  if (!db) {
    throw new Error('Firestore not initialized. Check Firebase configuration.');
  }
  return doc(db, collectionName, documentId);
};

/**
 * Create a new document
 */
export const createDocument = async <T extends Record<string, unknown>>(
  collectionName: CollectionName,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const collectionRef = getCollectionRef(collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`[Firestore] Created document ${docRef.id} in ${collectionName}`);
    return docRef.id;
  } catch (error) {
    console.error(`[Firestore] Error creating document in ${collectionName}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Get a single document by ID
 */
export const getDocument = async <T extends FirestoreDocument>(
  collectionName: CollectionName,
  documentId: string
): Promise<T | null> => {
  try {
    const docRef = getDocumentRef(collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    console.log(`[Firestore] Document ${documentId} not found in ${collectionName}`);
    return null;
  } catch (error) {
    console.error(`[Firestore] Error getting document ${documentId}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Get all documents in a collection
 */
export const getAllDocuments = async <T extends FirestoreDocument>(
  collectionName: CollectionName
): Promise<T[]> => {
  try {
    const collectionRef = getCollectionRef(collectionName);
    const querySnapshot = await getDocs(collectionRef);

    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });

    console.log(`[Firestore] Retrieved ${documents.length} documents from ${collectionName}`);
    return documents;
  } catch (error) {
    console.error(`[Firestore] Error getting all documents from ${collectionName}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Query documents with filters
 */
export const queryDocuments = async <T extends FirestoreDocument>(
  collectionName: CollectionName,
  constraints: QueryConstraint[]
): Promise<T[]> => {
  try {
    const collectionRef = getCollectionRef(collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });

    console.log(`[Firestore] Queried ${documents.length} documents from ${collectionName}`);
    return documents;
  } catch (error) {
    console.error(`[Firestore] Error querying ${collectionName}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Get documents with pagination
 */
export const getDocumentsPaginated = async <T extends FirestoreDocument>(
  collectionName: CollectionName,
  pageSize: number = 10,
  lastDocSnapshot?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedResult<T>> => {
  try {
    const collectionRef = getCollectionRef(collectionName);
    const constraints: QueryConstraint[] = [limit(pageSize)];

    if (lastDocSnapshot) {
      constraints.push(startAfter(lastDocSnapshot));
    }

    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return {
      data: documents,
      lastDoc,
      hasMore: documents.length === pageSize,
    };
  } catch (error) {
    console.error(`[Firestore] Error getting paginated documents from ${collectionName}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Update a document
 */
export const updateDocument = async <T extends object>(
  collectionName: CollectionName,
  documentId: string,
  data: Partial<Omit<T, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const docRef = getDocumentRef(collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
    console.log(`[Firestore] Updated document ${documentId} in ${collectionName}`);
  } catch (error) {
    console.error(`[Firestore] Error updating document ${documentId}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: CollectionName,
  documentId: string
): Promise<void> => {
  try {
    const docRef = getDocumentRef(collectionName, documentId);
    await deleteDoc(docRef);
    console.log(`[Firestore] Deleted document ${documentId} from ${collectionName}`);
  } catch (error) {
    console.error(`[Firestore] Error deleting document ${documentId}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Check if a document exists
 */
export const documentExists = async (
  collectionName: CollectionName,
  documentId: string
): Promise<boolean> => {
  try {
    const docRef = getDocumentRef(collectionName, documentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error(`[Firestore] Error checking document ${documentId}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

/**
 * Count documents in a collection (use sparingly - expensive operation)
 */
export const countDocuments = async (
  collectionName: CollectionName
): Promise<number> => {
  try {
    const collectionRef = getCollectionRef(collectionName);
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.size;
  } catch (error) {
    console.error(`[Firestore] Error counting documents in ${collectionName}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};
