'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { 
  COLLECTIONS,
  createDocument,
  getDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  documentExists,
  queryDocuments,
  getDocumentsPaginated,
  countDocuments,
  FirestoreDocument,
  type CollectionName
} from '../../lib/firestore-service';
import { where, orderBy, limit } from 'firebase/firestore';

interface TestPatient extends FirestoreDocument {
  name: string;
  email: string;
  age: number;
}

export default function TestFirestoreCRUDPage() {
  const [results, setResults] = useState<string[]>([]);
  const [testDocId, setTestDocId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Test form state
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('');

  const addResult = (message: string, isSuccess: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [`[${timestamp}] ${isSuccess ? '✅' : '❌'} ${message}`, ...prev.slice(0, 19)]);
  };

  const clearResults = () => setResults([]);

  // Test 1: Create Document
  const testCreateDocument = async () => {
    setLoading(true);
    try {
      const docId = await createDocument(COLLECTIONS.PATIENTS, {
        name: patientName || 'Test Patient',
        email: patientEmail || 'test@example.com',
        age: parseInt(patientAge) || 25,
      } as any);
      setTestDocId(docId);
      addResult(`CREATE: Document created with ID: ${docId}`);
    } catch (error: any) {
      addResult(`CREATE FAILED: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Read Document
  const testReadDocument = async () => {
    if (!testDocId) {
      addResult('READ SKIPPED: No document ID available. Run CREATE first.', false);
      return;
    }
    setLoading(true);
    try {
      const doc = await getDocument<TestPatient>(COLLECTIONS.PATIENTS, testDocId);
      if (doc) {
        addResult(`READ: Document found - Name: ${doc.name}, Email: ${doc.email}, Age: ${doc.age}`);
      } else {
        addResult('READ: Document not found', false);
      }
    } catch (error: any) {
      addResult(`READ FAILED: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Read All Documents
  const testReadAllDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getAllDocuments<TestPatient>(COLLECTIONS.PATIENTS);
      addResult(`READ ALL: Found ${docs.length} documents`);
      if (docs.length > 0) {
        addResult(`  First doc: ${docs[0].name} (${docs[0].email})`);
      }
    } catch (error: any) {
      addResult(`READ ALL FAILED: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Test 4: Update Document
  const testUpdateDocument = async () => {
    if (!testDocId) {
      addResult('UPDATE SKIPPED: No document ID available. Run CREATE first.', false);
      return;
    }
    setLoading(true);
    try {
      await updateDocument(COLLECTIONS.PATIENTS, testDocId, {
        name: 'Updated Patient Name',
        age: 30,
      } as any);
      addResult('UPDATE: Document updated successfully');
    } catch (error: any) {
      addResult(`UPDATE FAILED: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Test 5: Delete Document
  const testDeleteDocument = async () => {
    if (!testDocId) {
      addResult('DELETE SKIPPED: No document ID available. Run CREATE first.', false);
      return;
    }
    setLoading(true);
    try {
      await deleteDocument(COLLECTIONS.PATIENTS, testDocId);
      addResult('DELETE: Document deleted successfully');
      setTestDocId('');
    } catch (error: any) {
      addResult(`DELETE FAILED: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Test 6: Check Document Exists
  const testDocumentExists = async () => {
    if (!testDocId) {
      addResult('EXISTS CHECK SKIPPED: No document ID available. Run CREATE first.', false);
      return;
    }
    setLoading(true);
    try {
      const exists = await documentExists(COLLECTIONS.PATIENTS, testDocId);
      addResult(`EXISTS CHECK: Document ${exists ? 'exists' : 'does not exist'}`);
    } catch (error: any) {
      addResult(`EXISTS CHECK FAILED: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Test 7: Query Documents
  const testQueryDocuments = async () => {
    setLoading(true);
    try {
      const docs = await queryDocuments<TestPatient>(
        COLLECTIONS.PATIENTS,
        [where('age', '>=', 18), orderBy('age', 'desc'), limit(5)]
      );
      addResult(`QUERY: Found ${docs.length} documents matching criteria`);
    } catch (error: any) {
      addResult(`QUERY FAILED: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Test 8: Paginated Query
  const testPaginatedQuery = async () => {
    setLoading(true);
    try {
      const result = await getDocumentsPaginated<TestPatient>(COLLECTIONS.PATIENTS, 3);
      addResult(`PAGINATED: Page 1 - ${result.data.length} documents, hasMore: ${result.hasMore}`);
    } catch (error: any) {
      addResult(`PAGINATED FAILED: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Test 9: Count Documents
  const testCountDocuments = async () => {
    setLoading(true);
    try {
      const count = await countDocuments(COLLECTIONS.PATIENTS);
      addResult(`COUNT: Total documents: ${count}`);
    } catch (error: any) {
      addResult(`COUNT FAILED: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Test 10: Run All Tests
  const runAllTests = async () => {
    clearResults();
    addResult('=== Starting Full CRUD Test Suite ===');
    
    // Create
    await testCreateDocument();
    
    // Read
    await testReadDocument();
    
    // Update  
    await testUpdateDocument();
    
    // Read all
    await testReadAllDocuments();
    
    // Exists check
    await testDocumentExists();
    
    // Count
    await testCountDocuments();
    
    // Query
    await testQueryDocuments();
    
    // Paginated
    await testPaginatedQuery();
    
    addResult('=== Test Suite Complete ===');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Firebase Firestore CRUD Test</h1>
          <p className="text-gray-600">Test all Firestore operations</p>
        </div>

        {/* Test Document Form */}
        <Card>
          <CardHeader>
            <CardTitle>Test Patient Data</CardTitle>
            <CardDescription>Enter data for CRUD tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={patientEmail} 
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number"
                  value={patientAge} 
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Enter age"
                />
              </div>
            </div>
            {testDocId && (
              <div className="p-2 bg-blue-50 rounded text-sm">
                Current Test Document ID: <code className="bg-blue-100 px-1 rounded">{testDocId}</code>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CRUD Operations */}
        <Card>
          <CardHeader>
            <CardTitle>CRUD Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              <Button onClick={testCreateDocument} disabled={loading}>Create</Button>
              <Button onClick={testReadDocument} disabled={loading}>Read</Button>
              <Button onClick={testUpdateDocument} disabled={loading}>Update</Button>
              <Button onClick={testDeleteDocument} disabled={loading} variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>

        {/* Query Operations */}
        <Card>
          <CardHeader>
            <CardTitle>Query Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              <Button onClick={testReadAllDocuments} disabled={loading} variant="outline">Read All</Button>
              <Button onClick={testQueryDocuments} disabled={loading} variant="outline">Query</Button>
              <Button onClick={testPaginatedQuery} disabled={loading} variant="outline">Paginated</Button>
              <Button onClick={testCountDocuments} disabled={loading} variant="outline">Count</Button>
            </div>
          </CardContent>
        </Card>

        {/* Utility Operations */}
        <Card>
          <CardHeader>
            <CardTitle>Utility Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={testDocumentExists} disabled={loading} variant="secondary">Check Exists</Button>
              <Button onClick={runAllTests} disabled={loading} variant="default">Run All Tests</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Test Results
              <Button onClick={clearResults} variant="outline" size="sm">Clear</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
              {results.length === 0 ? (
                <span className="text-gray-500">Click a button to run tests...</span>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.href = '/test-firebase'}>
            Back to Firebase Test
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
