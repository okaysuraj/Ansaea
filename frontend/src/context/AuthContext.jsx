import {
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { fetchApi, readJson } from '../utils/api';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
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
          setUser({ ...profile, uid: firebaseUser.uid });
          setToken(idToken);
          setError(null);
        }
      } catch (err) {
        if (active && auth.currentUser === firebaseUser) {
          setUser(null);
          setToken(null);
          setError(err.message);
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
  }, []);

  const register = async (username, email, password, role = 'patient') => {
    setError(null);
    try {
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
      await logout();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      if (!firebaseUser.emailVerified) {
        await logout();
        throw new Error('Please verify your email before logging in.');
      }
      return true;
    } catch (err) {
      setError(
        err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found'
          ? 'This user does not exist. Please signup.'
          : err.message,
      );
      return false;
    }
  };

  // Keep this stable: screens depend on it when loading their data.
  const authenticatedFetch = useCallback(
    async (endpoint, options = {}) => {
      if (!auth.currentUser?.emailVerified) {
        throw new Error('Please log in with a verified email address.');
      }
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetchApi(endpoint, options, idToken);
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
      value={{ user, token, loading, error, register, login, logout, authenticatedFetch, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
}
