'use client';

import { useEffect, useState } from 'react';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';

interface UserInfo {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastSignIn: string;
}

export default function UsersAdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Get current user info
        const userInfo: UserInfo = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          createdAt: user.metadata.creationTime || 'Unknown',
          lastSignIn: user.metadata.lastSignInTime || 'Unknown',
        };
        setUsers([userInfo]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-8">
            <p className="text-center">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-600 mt-2">View all registered users</p>
          </div>
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>

        {!currentUser ? (
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to view users</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth">
                <Button>Go to Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Current Session</CardTitle>
                <CardDescription>You are currently signed in as:</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-green-800">{currentUser.email}</p>
                  <p className="text-sm text-green-600">UID: {currentUser.uid}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>
                  Total users: {users.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <div
                      key={user.uid}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-lg">User #{index + 1}</span>
                            {user.emailVerified && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Email:</span>{' '}
                              <span className="text-gray-700">{user.email}</span>
                            </p>
                            <p>
                              <span className="font-medium">UID:</span>{' '}
                              <span className="text-gray-500 font-mono text-xs">{user.uid}</span>
                            </p>
                            <p>
                              <span className="font-medium">Created:</span>{' '}
                              <span className="text-gray-600">{user.createdAt}</span>
                            </p>
                            <p>
                              <span className="font-medium">Last Sign In:</span>{' '}
                              <span className="text-gray-600">{user.lastSignIn}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">📝 Note:</h3>
                  <p className="text-sm text-blue-800 mb-2">
                    This page shows the currently signed-in user. To view all users:
                  </p>
                  <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://console.firebase.google.com/project/sadhak-web/authentication/users" target="_blank" rel="noopener noreferrer" className="underline font-medium">Firebase Console</a></li>
                    <li>Navigate to Authentication → Users tab</li>
                    <li>You'll see all registered users with their details</li>
                  </ol>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">🔐 Dummy User Credentials:</h3>
                  <div className="text-sm text-yellow-800 space-y-2">
                    <div>
                      <p className="font-medium">User 1:</p>
                      <p>Email: user1@sadhak.com | Password: password123</p>
                    </div>
                    <div>
                      <p className="font-medium">User 2:</p>
                      <p>Email: user2@sadhak.com | Password: password123</p>
                    </div>
                    <div>
                      <p className="font-medium">User 3:</p>
                      <p>Email: user3@sadhak.com | Password: password123</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
