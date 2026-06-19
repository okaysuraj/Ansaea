import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, MessageSquare, Calendar, LogOut, Activity, UserCheck } from 'lucide-react';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="dashboard-grid">
            <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)' }}>Welcome, Dr. {user.username}</h3>
              <p style={{ color: 'var(--text-muted)' }}>Here is an overview of your clinical schedule and patient roster for today.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
                  <div className="stat-label">Appointments Today</div>
                  <div className="stat-value" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>4</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
                  <div className="stat-label">Active Patients</div>
                  <div className="stat-value" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>12</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-info)' }}>
                  <div className="stat-label">Unread Messages</div>
                  <div className="stat-value" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>2</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'patients':
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users style={{ color: 'var(--color-primary)' }} /> Patient Roster
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'John Doe', status: 'High Adherence', lastSeen: '2 days ago' },
                { name: 'Alice Smith', status: 'Needs Review', lastSeen: '1 week ago' },
                { name: 'Bob Johnson', status: 'Stable', lastSeen: '3 days ago' },
              ].map((patient, i) => (
                <div key={i} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{patient.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Last Session: {patient.lastSeen}</div>
                  </div>
                  <div>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      backgroundColor: patient.status === 'Needs Review' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: patient.status === 'Needs Review' ? 'var(--color-danger)' : 'var(--color-success)'
                    }}>
                      {patient.status}
                    </span>
                    <button className="btn-outline" style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>View Chart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar style={{ color: 'var(--color-primary)' }} /> Upcoming Consultations
            </h3>
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No appointments scheduled for today.
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare style={{ color: 'var(--color-primary)' }} /> Patient Messages
            </h3>
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No active conversations.
            </div>
          </div>
        );
      default:
        return <div>Select a view</div>;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return `Clinical Dashboard`;
      case 'patients': return 'Patient Roster';
      case 'schedule': return 'Schedule';
      case 'messages': return 'Messages';
      default: return 'Ansaea Clinical';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <img src="/favicon.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} />
          <span>Ansaea Clinical</span>
        </div>

        <ul className="nav-links">
          <li>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <LayoutDashboard size={18} /> Overview
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView('patients')}
              className={`nav-item ${currentView === 'patients' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <Users size={18} /> Patients
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView('schedule')}
              className={`nav-item ${currentView === 'schedule' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <Calendar size={18} /> Schedule
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
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Dr. {user.username}</div>
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
            <UserCheck size={14} /> System Status: Secure
          </div>
        </div>

        {renderView()}
      </main>
    </div>
  );
}
