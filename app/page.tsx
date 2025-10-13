'use client';

import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SadhakAyurvedApp from "@/components/SadhakAyurvedApp";
import AuthPage from './auth/page';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return <SadhakAyurvedApp />;
}
