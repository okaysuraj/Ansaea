import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  LayoutDashboard,
  Heart,
  Wind,
  BrainCircuit,
  Calendar,
  MessageSquare,
  LogOut,
  Phone,
  Video,
  UserCheck,
  Activity
} from 'lucide-react';

// Components
import MoodSelector from './components/MoodSelector';
import Analytics from './components/Analytics';
import SelfCareTracker from './components/SelfCareTracker';
import BreathingExercise from './components/BreathingExercise';
import CBTDiary from './components/CBTDiary';
import PsychiatristDirectory from './components/PsychiatristDirectory';
import ChatSession from './components/ChatSession';
import CallSession from './components/CallSession';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import DoctorDashboard from './components/DoctorDashboard';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import LabDashboard from './components/LabDashboard';
import PharmacyDashboard from './components/PharmacyDashboard';

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function AuthenticationScreen({ onNavigateToSignup }) {
  const { login, error, setError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    await login(email, password);
    
    setFormLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="auth-form-card">
      <div className="auth-form-header">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <img src="/favicon.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} />
          <h1 className="auth-form-logo" style={{ margin: 0 }}>Ansaea</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2 className="auth-form-title">
            Welcome back
          </h2>
          <p className="auth-form-subtitle">
            Access your clinical dashboard.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(186, 26, 26, 0.1)', color: '#ba1a1a', padding: '1rem', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="auth-input-group">
            <div className="auth-input-label">
              <label htmlFor="password">Password</label>
              <a className="auth-input-link" href="#">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="••••••••••••"
              required
            />
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
          <button type="submit" disabled={formLoading} className="auth-submit-btn">
            {formLoading ? (
              <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
            ) : (
              <span>Log in</span>
            )}
          </button>
          
          <div className="auth-footer-text">
            <span>Don't have an account? </span>
            <button type="button" onClick={onNavigateToSignup} className="auth-footer-link">
              Become a member
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (showLoginModal || showSignup)) {
      navigate('/dashboard');
      setShowLoginModal(false);
      setShowSignup(false);
    }
  }, [user, navigate, showLoginModal, showSignup]);

  if (loading) {
    return (
      <div className="auth-wrapper" style={{ flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <img src="/favicon.png" alt="Ansaea Logo" style={{ height: '48px', width: 'auto' }} />
          <h1 className="auth-logo" style={{ margin: 0 }}>Ansaea</h1>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading records...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        user ? <Navigate to="/dashboard" /> : (
          showSignup ? (
            <SignupPage 
              onNavigateToLogin={() => {
                setShowSignup(false);
                setShowLoginModal(true);
              }} 
            />
          ) : (
            <LandingPage 
              user={user}
              onNavigateToDashboard={() => navigate('/dashboard')}
              AuthComponent={
                <AuthenticationScreen 
                  onNavigateToSignup={() => {
                    setShowLoginModal(false);
                    setShowSignup(true);
                  }} 
                />
              } 
              onNavigateToSignup={() => setShowSignup(true)}
              showAuthModal={showLoginModal}
              onOpenAuth={() => setShowLoginModal(true)}
              onCloseAuth={() => setShowLoginModal(false)}
            />
          )
        )
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {(() => {
            switch (user?.role) {
              case 'doctor': return <DoctorDashboard />;
              case 'admin': return <AdminDashboard />;
              case 'lab': return <LabDashboard />;
              case 'pharmacy': return <PharmacyDashboard />;
              default: return <UserDashboard />;
            }
          })()}
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
