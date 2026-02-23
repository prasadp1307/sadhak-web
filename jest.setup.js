// Jest setup file
// Mock Firebase
jest.mock('./lib/firebase', () => ({
  db: jest.fn(),
  auth: jest.fn(),
}));
