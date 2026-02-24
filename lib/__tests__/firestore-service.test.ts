import {
  COLLECTIONS,
  getCollectionRef,
} from '../firestore-service';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn((db: unknown, name: string) => ({ db, name })),
}));

jest.mock('../firebase', () => ({
  db: 'mock-db',
  auth: 'mock-auth',
}));

describe('Firestore Service', () => {
  it('should have correct collection names', () => {
    expect(COLLECTIONS.PATIENTS).toBe('patients');
    expect(COLLECTIONS.USERS).toBe('users');
    expect(COLLECTIONS.APPOINTMENTS).toBe('appointments');
  });

  it('should return collection reference', () => {
    const ref = getCollectionRef(COLLECTIONS.PATIENTS);
    expect((ref as any).name).toBe('patients');
  });
});
