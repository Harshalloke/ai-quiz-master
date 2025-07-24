'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import AuthForm from '../../components/AuthForm';

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/setup');
      }
    };

    checkUser();
  }, [router]);

  const handleSuccess = () => {
    router.push('/setup');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Quiz Master AI
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to save your progress and track your learning journey
          </p>
        </div>

        <AuthForm onSuccess={handleSuccess} />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Don't want to sign up? You can still use the app without an account.
          </p>
          <button
            onClick={() => router.push('/setup')}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
