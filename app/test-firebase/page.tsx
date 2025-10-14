'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  runAllFirebaseTests, 
  getFirebaseConfig,
  type FirebaseStatus 
} from '../../lib/firebase-test';

export default function TestFirebasePage() {
  const [testResults, setTestResults] = useState<FirebaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Load config on mount
    setConfig(getFirebaseConfig());
  }, []);

  const runTests = async () => {
    setLoading(true);
    try {
      const results = await runAllFirebaseTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Firebase Connection Test</h1>
          <p className="text-gray-600">Verify your Firebase credentials and services</p>
        </div>

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Configuration</CardTitle>
            <CardDescription>Environment variables status</CardDescription>
          </CardHeader>
          <CardContent>
            {config ? (
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span>API Key:</span>
                  <span className="font-semibold">{config.apiKey}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auth Domain:</span>
                  <span className="font-semibold">{config.authDomain}</span>
                </div>
                <div className="flex justify-between">
                  <span>Project ID:</span>
                  <span className="font-semibold">{config.projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Bucket:</span>
                  <span className="font-semibold">{config.storageBucket}</span>
                </div>
                <div className="flex justify-between">
                  <span>Messaging Sender ID:</span>
                  <span className="font-semibold">{config.messagingSenderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>App ID:</span>
                  <span className="font-semibold">{config.appId}</span>
                </div>
              </div>
            ) : (
              <p>Loading configuration...</p>
            )}
          </CardContent>
        </Card>

        {/* Test Button */}
        <div className="flex justify-center">
          <Button 
            onClick={runTests} 
            disabled={loading}
            size="lg"
            className="w-full max-w-md"
          >
            {loading ? 'Testing Connection...' : 'Run Firebase Tests'}
          </Button>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="space-y-4">
            {/* Overall Status */}
            <Card className={testResults.overall ? 'border-green-500' : 'border-red-500'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.overall)}
                  Overall Status
                </CardTitle>
                <CardDescription>
                  {testResults.overall 
                    ? 'All Firebase services are working correctly!' 
                    : 'Some Firebase services have issues'}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Initialization Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.initialized.success)}
                  Firebase Initialization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={getStatusColor(testResults.initialized.success)}>
                  {testResults.initialized.message}
                </p>
                {testResults.initialized.details && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(testResults.initialized.details, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>

            {/* Auth Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.auth.success)}
                  Firebase Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={getStatusColor(testResults.auth.success)}>
                  {testResults.auth.message}
                </p>
                {testResults.auth.details && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(testResults.auth.details, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>

            {/* Firestore Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.firestore.success)}
                  Firestore Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={getStatusColor(testResults.firestore.success)}>
                  {testResults.firestore.message}
                </p>
                {testResults.firestore.details && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(testResults.firestore.details, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Links */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/auth'}
            >
              Test Authentication Page
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              Go to Home Page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
