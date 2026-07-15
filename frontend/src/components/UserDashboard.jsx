import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
  CreditCard,
  Link2,
  Watch
} from 'lucide-react';

import MoodSelector from './MoodSelector';
import Analytics from './Analytics';
import SelfCareTracker from './SelfCareTracker';
import BreathingExercise from './BreathingExercise';
import CBTDiary from './CBTDiary';
import PsychiatristDirectory from './PsychiatristDirectory';
import ChatSession from './ChatSession';
import CallSession from './CallSession';
import VitalsTracker from './VitalsTracker';
import MedicalRecords from './MedicalRecords';
import SymptomChecker from './SymptomChecker';

function ProfileBillingView() {
  const { user, authenticatedFetch } = useAuth();
  const [walletBalance, setWalletBalance] = useState(user.wallet_balance || 0);
  const [abhaId, setAbhaId] = useState(user.abha_number || '');
  const [topupAmount, setTopupAmount] = useState('');

  const handleTopup = async () => {
    try {
      const res = await authenticatedFetch('/billing/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(topupAmount), payment_gateway: 'mock' })
      });
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.new_balance);
        setTopupAmount('');
        alert('Wallet topped up successfully!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLinkAbha = async () => {
    try {
      const res = await authenticatedFetch('/users/link-abha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abha_number: abhaId })
      });
      if (res.ok) {
        alert('ABHA ID linked successfully!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const syncWearable = async (deviceType) => {
    try {
      const res = await authenticatedFetch('/users/sync-wearable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_type: deviceType,
          data: { steps: Math.floor(Math.random()*10000), heart_rate: 70 + Math.floor(Math.random()*15) }
        })
      });
      if (res.ok) {
        alert(`${deviceType} synced successfully!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
      <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} style={{ color: 'var(--color-primary)' }} />
            Wallet & Payments
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-success)' }}>
            ₹{walletBalance.toFixed(2)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="number" className="form-input" placeholder="Amount (₹)" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} />
            <button className="btn-submit" style={{ marginTop: 0 }} onClick={handleTopup}>Top Up (Mock)</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link2 size={18} style={{ color: 'var(--color-primary)' }} />
            National Health ID (ABHA)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Link your ABHA number for seamless health record sharing.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" className="form-input" placeholder="ABHA ID (e.g. 12-3456-7890-1234)" value={abhaId} onChange={(e) => setAbhaId(e.target.value)} />
            <button className="btn-submit" style={{ marginTop: 0 }} onClick={handleLinkAbha}>Link</button>
          </div>
        </div>
      </div>

      <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Watch size={18} style={{ color: 'var(--color-info)' }} />
            Wearables Integration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => syncWearable('AppleHealth')}>
              <span style={{ fontWeight: '600' }}>Apple Health</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Sync Now</span>
            </button>
            <button className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => syncWearable('Fitbit')}>
              <span style={{ fontWeight: '600' }}>Fitbit Data</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Sync Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const [refreshStats, setRefreshStats] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        <div style={{ gridColumn: 'span 5' }}>
          <MoodSelector onLogSuccess={() => setRefreshStats(prev => prev + 1)} />
        </div>
        <div style={{ gridColumn: 'span 7' }}>
          <Analytics key={refreshStats} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        <div style={{ gridColumn: 'span 6' }}>
          <VitalsTracker />
        </div>
        <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SymptomChecker />
          <MedicalRecords />
        </div>
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
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
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
        Access your active chat consultation sessions immediately below. All history is fully encrypted.
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

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, selfcare, mindtools, appointments, messages, profile

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
      case 'profile':
        return <ProfileBillingView />;
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
      case 'profile': return 'Profile, Wallet & Wearables';
      default: return 'Ansaea Control';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} />
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
          <li>
            <button
              onClick={() => setCurrentView('profile')}
              className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <UserCheck size={18} /> Profile & Wallet
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
