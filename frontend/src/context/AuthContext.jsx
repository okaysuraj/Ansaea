import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Only set user if email is verified
        if (firebaseUser.emailVerified) {
          const idToken = await firebaseUser.getIdToken();
          
          try {
            // Fetch real role and username from the database
            const res = await fetch(`${API_URL}/users/me`, {
              headers: { 'Authorization': `Bearer ${idToken}` }
            });
            const dbUser = await res.json();
            
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              username: dbUser.username || firebaseUser.email.split('@')[0],
              role: dbUser.role || "user" 
            });
            setToken(idToken);
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

  const register = async (username, email, password, role = "user") => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save role and username to the backend database before signing out
      const tempToken = await userCredential.user.getIdToken();
      await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ role, username })
      });

      await sendEmailVerification(userCredential.user);
      
      // Sign out immediately so they have to verify email before logging in
      await signOut(auth);
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error('Please verify your email before logging in.');
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (auth.currentUser && auth.currentUser.emailVerified) {
      const idToken = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${idToken}`;
    } else if (token) {
       headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      await logout();
      throw new Error('Session expired or unauthorized. Please log in again.');
    }
    
    return response;
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    authenticatedFetch,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
