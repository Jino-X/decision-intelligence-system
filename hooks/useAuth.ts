'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/' });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  }, []);

  const loginWithCredentials = useCallback(async (email: string, password: string) => {
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.ok) {
      router.push('/dashboard');
      router.refresh();
    }
    return result;
  }, [router]);

  return {
    user: session?.user ?? null,
    session,
    isLoading,
    isAuthenticated,
    logout,
    loginWithGoogle,
    loginWithCredentials,
  };
}
