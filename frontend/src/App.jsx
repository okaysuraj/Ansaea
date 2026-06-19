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


function DashboardView() {
  const [refreshStats, setRefreshStats] = useState(0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
      <div style={{ gridColumn: 'span 5' }}>
        <MoodSelector onLogSuccess={() => setRefreshStats(prev => prev + 1)} />
      </div>
      <div style={{ gridColumn: 'span 7' }}>
        <Analytics key={refreshStats} />
      </div>
    </div>
  );
}

function MindToolsView() {
  const [activeTab, setActiveTab] = useState('breathing'); // breathing, cbt
  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('breathing')}
          className="glass-panel"
          style={{
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            borderColor: activeTab === 'breathing' ? 'var(--color-success)' : 'transparent',
            color: activeTab === 'breathing' ? 'var(--color-success)' : 'var(--text-muted)',
            background: activeTab === 'breathing' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Wind size={16} /> Ambient Breathing
        </button>

        <button
          onClick={() => setActiveTab('cbt')}
          className="glass-panel"
          style={{
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            borderColor: activeTab === 'cbt' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'cbt' ? 'var(--color-secondary)' : 'var(--text-muted)',
            background: activeTab === 'cbt' ? 'rgba(168, 85, 247, 0.05)' : 'rgba(255,255,255,0.01)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <BrainCircuit size={16} /> Cognitive Reframer
        </button>
      </div>

      {activeTab === 'breathing' ? <BreathingExercise /> : <CBTDiary />}
    </div>
  );
}

function AppointmentsView() {
  const { authenticatedFetch } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const fetchAppointments = async () => {
    try {
      const response = await authenticatedFetch('/psychiatrists/appointments');
      const data = await response.json();
      if (response.ok) {
        setAppointments(data);
      }
    } catch (e) {
      console.log('Error downloading appointments:', e);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refreshFlag]);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const response = await authenticatedFetch(`/psychiatrists/appointments/${id}/cancel`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (activeAppointment) {
    return <ChatSession appointment={activeAppointment} onBack={() => setActiveAppointment(null)} />;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
      
      {/* Search & Directory */}
      <div style={{ gridColumn: 'span 8' }}>
        <PsychiatristDirectory onBookingSuccess={() => setRefreshFlag(f => f + 1)} />
      </div>

      {/* Bookings List */}
      <div style={{ gridColumn: 'span 4' }}>
        <div className="glass-panel" style={{ padding: '1.75rem', minHeight: '60vh' }}>
          <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
            Booked Sessions
          </h4>

          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No booked consultations yet. Browse specialties on the directory.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {appointments.map((appt) => (
                <div key={appt.id} className="glass-panel" style={{ padding: '1.1rem', background: 'rgba(255,255,255,0.015)' }}>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <img
                      src={appt.doctor_imageUrl}
                      alt={appt.doctor_name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{appt.doctor_name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{appt.doctor_specialty}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    <span>{appt.date} • {appt.time_slot}</span>
                    <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: appt.session_type === 'chat' ? 'var(--color-primary)' : appt.session_type === 'call' ? 'var(--color-info)' : 'var(--color-success)' }}>
                      {appt.session_type}
                    </span>
                  </div>

                  {appt.status === 'upcoming' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          if (appt.session_type === 'chat') {
                            setActiveAppointment(appt);
                          } else {
                            setActiveCall(appt);
                          }
                        }}
                        className="btn-submit"
                        style={{
                          flex: 1,
                          marginTop: 0,
                          padding: '0.5rem 0',
                          fontSize: '0.8rem',
                          background: appt.session_type === 'chat' ? 'var(--color-primary)' : appt.session_type === 'call' ? 'var(--color-info)' : 'var(--color-success)',
                          boxShadow: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {appt.session_type === 'chat' ? <MessageSquare size={14} /> : appt.session_type === 'call' ? <Phone size={14} /> : <Video size={14} />}
                        Start Session
                      </button>

                      <button
                        onClick={() => handleCancel(appt.id)}
                        className="form-input"
                        style={{ width: 'auto', padding: '0.5rem 0.8rem', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {appt.status === 'cancelled' && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: '600', textTransform: 'uppercase' }}>
                      Session Cancelled
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeCall && (
        <CallSession
          appointment={activeCall}
          isVideo={activeCall.session_type === 'video'}
          onClose={() => setActiveCall(null)}
        />
      )}

    </div>
  );
}

function MessagesView() {
  const { authenticatedFetch } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);

  const fetchChats = async () => {
    try {
      const response = await authenticatedFetch('/psychiatrists/appointments');
      const data = await response.json();
      if (response.ok) {
        // Filter only chat sessions
        setAppointments(data.filter((appt) => appt.session_type === 'chat' && appt.status === 'upcoming'));
      }
    } catch (e) {
      console.log('Error fetch chats:', e);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  if (activeAppointment) {
    return <ChatSession appointment={activeAppointment} onBack={() => setActiveAppointment(null)} />;
  }

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '680px', minHeight: '50vh' }}>
      <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageSquare style={{ color: 'var(--color-primary)' }} /> Secure Conversations
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        Access your active chat consultation sessions immediately below. All history is fully logs encrypted.
      </p>

      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          No active text consultations available. Schedule chat sessions in the Bookings tab.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {appointments.map((appt) => (
            <div
              key={appt.id}
              onClick={() => setActiveAppointment(appt)}
              className="habit-row"
              style={{ cursor: 'pointer', padding: '1.25rem 1.75rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={appt.doctor_imageUrl}
                  alt={appt.doctor_name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1rem' }}>{appt.doctor_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appt.doctor_specialty} • Session slot: {appt.date} ({appt.time_slot})</div>
                </div>
              </div>
              <button className="btn-submit" style={{ width: 'auto', marginTop: 0, padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}>
                Open Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UserDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, selfcare, mindtools, appointments, messages

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'selfcare':
        return <SelfCareTracker />;
      case 'mindtools':
        return <MindToolsView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'messages':
        return <MessagesView />;
      default:
        return <DashboardView />;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return `Welcome back, ${user.username}`;
      case 'selfcare': return 'Daily Self-Care Check';
      case 'mindtools': return 'Cognitive Resiliency Kits';
      case 'appointments': return 'Psychiatrist Directory';
      case 'messages': return 'Messages Vault';
      default: return 'Ansaea Control';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <img src="/favicon.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} />
          <span>Ansaea Mind</span>
        </div>

        <ul className="nav-links">
          <li>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView('selfcare')}
              className={`nav-item ${currentView === 'selfcare' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <Heart size={18} /> Self-Care Checklist
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView('mindtools')}
              className={`nav-item ${currentView === 'mindtools' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <Wind size={18} /> Mindfulness Tools
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView('appointments')}
              className={`nav-item ${currentView === 'appointments' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <Calendar size={18} /> Book Session
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView('messages')}
              className={`nav-item ${currentView === 'messages' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <MessageSquare size={18} /> Messages
            </button>
          </li>
        </ul>

        {/* User profile foot */}
        <div className="nav-footer">
          <div className="user-profile">
            <div className="user-avatar">{user.username.substring(0, 2).toUpperCase()}</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.username}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{user.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="nav-item"
            style={{ background: 'transparent', border: 'none', width: '100%', color: 'var(--color-danger)', gap: '1rem', marginTop: '0.5rem' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </nav>

      {/* Main View Shell */}
      <main className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">{getPageTitle()}</h1>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-success)' }}>
            <UserCheck size={14} /> Database Sync Status: Active
          </div>
        </div>

        {renderView()}
      </main>
    </div>
  );
}

function AuthenticationScreen({ onNavigateToSignup }) {
  const { login, error, setError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    await login(email, password);
    
    setFormLoading(false);
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

function AppContent() {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return (
      <div className="auth-wrapper" style={{ flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <img src="/favicon.png" alt="Ansaea Logo" style={{ height: '48px', width: 'auto' }} />
          <h1 className="auth-logo" style={{ margin: 0 }}>Ansaea</h1>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading mental status records...</div>
      </div>
    );
  }

  if (user) {
    const isDoctor = user.role === 'doctor';
    return isDoctor ? <DoctorDashboard /> : <UserDashboard />;
  }

  if (showSignup) {
    return <SignupPage onNavigateToLogin={() => setShowSignup(false)} />;
  }

  return (
    <LandingPage 
      AuthComponent={<AuthenticationScreen onNavigateToSignup={() => setShowSignup(true)} />} 
      onNavigateToSignup={() => setShowSignup(true)} 
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
