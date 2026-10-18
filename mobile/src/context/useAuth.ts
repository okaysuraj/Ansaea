import { createContext, useContext } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<AuthResult>;
  register: (
    username: string,
    email: string,
    password?: string,
    role?: string,
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  authenticatedFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
