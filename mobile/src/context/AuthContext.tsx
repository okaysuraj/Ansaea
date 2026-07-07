import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { router } from 'expo-router';

// Configure axios default
// Use localhost for web/iOS, or 10.0.2.2 for Android emulator
import { Platform } from 'react-native';
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
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  authenticatedFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock check for existing user in a real app, this would check AsyncStorage/SecureStore
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      // Mock login for now. In reality, call the backend auth endpoint.
      let mockUser: User = {
        id: '123',
        email: email,
        username: email.split('@')[0],
        role: 'patient', // Default
      };

      if (email.includes('doctor')) mockUser.role = 'doctor';
      if (email.includes('admin')) mockUser.role = 'admin';
      if (email.includes('lab')) mockUser.role = 'lab';
      if (email.includes('pharm')) mockUser.role = 'pharmacy';

      setUser(mockUser);
      
      // Navigate based on role
      routeByRole(mockUser.role);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Login failed' };
    }
  };

  const routeByRole = (role: string) => {
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

  const logout = () => {
    setUser(null);
    router.replace('/');
  };

  // Helper for authenticated fetch
  const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (user?.email) {
        (headers as Record<string, string>)['Authorization'] = `Bearer dev_${user.email}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
      return response;
    } catch (e) {
      console.error('Fetch error:', e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, authenticatedFetch }}>
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
