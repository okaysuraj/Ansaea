import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebase';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

axios.defaults.baseURL = API_URL;

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password?: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  authenticatedFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          try {
            const idToken = await firebaseUser.getIdToken(true); // Force refresh token to get latest claims
            
            // Fetch real role and username from the backend database
            const res = await fetch(`${API_URL}/api/users/me`, {
              headers: { 'Authorization': `Bearer ${idToken}` }
            });
            const dbUser = await res.json();
            
            const fetchedUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: dbUser.username || firebaseUser.email?.split('@')[0] || '',
              role: dbUser.role || "patient" 
            };
            setUser(fetchedUser);
            setToken(idToken);
            routeByRole(fetchedUser.role);
          } catch (err) {
             console.error("Failed to fetch user profile", err);
             setUser(null);
             setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (username: string, email: string, password?: string, role = "patient") => {
    try {
      if (!password) throw new Error("Password is required for registration.");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const tempToken = await userCredential.user.getIdToken();
      await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ role, username })
      });

      await sendEmailVerification(userCredential.user);
      
      await signOut(auth); // Force them to login after verifying email
      
      return { success: true };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email: string, password?: string) => {
    try {
      if (!password) throw new Error("Password is required.");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Strict Email Verification check
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        return { success: false, error: 'Please verify your email address before logging in.' };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const routeByRole = (role: string) => {
    // Only route if we are currently not on an authenticated screen (e.g. at login screen)
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
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
    router.replace('/');
  };

  const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (auth.currentUser && auth.currentUser.emailVerified) {
        const idToken = await auth.currentUser.getIdToken();
        (headers as Record<string, string>)['Authorization'] = `Bearer ${idToken}`;
      } else if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error("No valid authentication token found. Please login.");
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
      
      if (response.status === 401 || response.status === 403) {
        await logout();
      }
      
      return response;
    } catch (e) {
      console.error('Fetch error:', e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
