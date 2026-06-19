import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ansaea_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const storedUser = localStorage.getItem('ansaea_user');
    const storedToken = localStorage.getItem('ansaea_token');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password, role = "user") => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      localStorage.setItem('ansaea_token', data.access_token);
      localStorage.setItem('ansaea_user', JSON.stringify({ username: data.username, email: data.email, role: data.role }));
      
      setToken(data.access_token);
      setUser({ username: data.username, email: data.email, role: data.role });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      
      localStorage.setItem('ansaea_token', data.access_token);
      localStorage.setItem('ansaea_user', JSON.stringify({ username: data.username, email: data.email, role: data.role }));
      
      setToken(data.access_token);
      setUser({ username: data.username, email: data.email, role: data.role });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('ansaea_token');
    localStorage.removeItem('ansaea_user');
    setToken(null);
    setUser(null);
  };

  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please log in again.');
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
