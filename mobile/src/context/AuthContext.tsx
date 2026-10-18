import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { auth } from '../firebase';
import { fetchApi, readJson } from '../utils/api';
import { AuthContext, type User } from './useAuth';

function routeByRole(role: string) {
  switch (role) {
    case 'doctor':
      router.replace('/(doctor)/dashboard');
      break;
    case 'admin':
      router.replace('/(admin)/dashboard');
      break;
    case 'lab':
      router.replace('/(lab)/dashboard');
      break;
    case 'pharmacy':
      router.replace('/(pharmacy)/dashboard');
      break;
    default:
      router.replace('/(patient)/dashboard');
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser?.emailVerified) {
          if (active) {
            setUser(null);
            setToken(null);
          }
          return;
        }

        const idToken = await firebaseUser.getIdToken();
        const profile = await readJson(await fetchApi('/users/me', {}, idToken));
        if (active && auth.currentUser === firebaseUser) {
          setUser(profile);
          setToken(idToken);
          routeByRole(profile.role);
        }
      } catch {
        if (active && auth.currentUser === firebaseUser) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
    router.replace('/');
  }, []);

  const register = async (username: string, email: string, password?: string, role = 'patient') => {
    try {
      if (!password) throw new Error('Password is required for registration.');
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await firebaseUser.getIdToken();
      await readJson(
        await fetchApi(
          '/users/register',
          {
            method: 'POST',
            body: JSON.stringify({ role, username }),
          },
          idToken,
        ),
      );
      await sendEmailVerification(firebaseUser);
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error) };
    }
  };

  const login = async (email: string, password?: string) => {
    try {
      if (!password) throw new Error('Password is required.');
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      if (!firebaseUser.emailVerified) {
        await signOut(auth);
        throw new Error('Please verify your email address before logging in.');
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage(error) };
    }
  };

  // Screens can depend on this callback without refetching on every auth render.
  const authenticatedFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      if (!auth.currentUser?.emailVerified) {
        throw new Error('Please log in with a verified email address.');
      }
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetchApi(endpoint, options, idToken);
      // A forbidden action does not invalidate an otherwise valid session.
      if (response.status === 401) {
        await logout();
        throw new Error('Session expired. Please log in again.');
      }
      return response;
    },
    [logout],
  );

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, authenticatedFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
}
