import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, MessageSquare, Calendar, LogOut, Activity, UserCheck, Stethoscope, Briefcase } from 'lucide-react';
import ClinicalNotes from './ClinicalNotes';
import EPrescription from './EPrescription';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const { authenticatedFetch } = useAuth();
  
  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const response = await authenticatedFetch('/psychiatrists/appointments');
        const data = await response.json();
        if (response.ok) {
          setAppointments(data);
          
          // Extract unique patients from appointments
          const uniquePatientsMap = {};
          data.forEach(appt => {
            if (!uniquePatientsMap[appt.user_id]) {
              uniquePatientsMap[appt.user_id] = {
                id: appt.user_id,
                // In a real app we'd fetch the patient's name, but here we can just use a placeholder
                name: "Patient " + appt.user_id.substring(0, 4), 
                lastSeen: appt.date,
                status: appt.status === 'completed' ? 'Stable' : 'Needs Review'
              };
            }
          });
          setPatients(Object.values(uniquePatientsMap));
        }
      } catch (err) {
        console.error("Error fetching doctor appointments:", err);
      }
    };
    fetchAppts();
  }, []);

  const [earnings, setEarnings] = useState({ total_earnings: 0, recent_transactions: [] });
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [autoBuffer, setAutoBuffer] = useState(15);
  
  const fetchEarnings = async () => {
    try {
      const response = await authenticatedFetch('/doctors/earnings');
      if (response.ok) {
        const data = await response.json();
        setEarnings(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (currentView === 'management') fetchEarnings();
  }, [currentView]);

  const handleUpdateSlots = async () => {
    try {
      const response = await authenticatedFetch('/doctors/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: slotDate,
          slots: [slotTime],
          auto_buffer_mins: autoBuffer
        })
      });
      if (response.ok) {
        alert('Slots updated successfully!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming');

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
                  <div className="stat-label">Upcoming Appointments</div>
                  <div className="stat-value" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{upcomingAppts.length}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
                  <div className="stat-label">Active Patients</div>
                  <div className="stat-value" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{patients.length}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-info)' }}>
                  <div className="stat-label">Total Consultations</div>
                  <div className="stat-value" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{appointments.length}</div>
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
              {patients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  No active patients.
                </div>
              ) : patients.map((patient, i) => (
                <div key={i} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{patient.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Last Scheduled: {patient.lastSeen}</div>
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
            {upcomingAppts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No appointments scheduled for today.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingAppts.map((appt) => (
                  <div key={appt.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600' }}>Patient {appt.user_id.substring(0, 4)}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{appt.date} at {appt.time_slot}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                        {appt.session_type} Session
                      </span>
                      <button className="btn-submit" style={{ padding: '0.4rem 1rem', marginTop: 0, fontSize: '0.8rem' }}>Join</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      case 'tools':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            <div style={{ gridColumn: 'span 6' }}>
              <ClinicalNotes />
            </div>
            <div style={{ gridColumn: 'span 6' }}>
              <EPrescription />
            </div>
          </div>
        );
      case 'management':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={18} style={{ color: 'var(--color-primary)' }} /> Earnings Overview
                </h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-success)', marginBottom: '1rem' }}>
                  ₹{earnings.total_earnings.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Recent Payouts:</div>
                {earnings.recent_transactions.map((tx, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    <span style={{ color: 'var(--color-success)' }}>+₹{tx.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} style={{ color: 'var(--color-info)' }} /> Advanced Slot Management
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date</label>
                    <input type="date" className="form-input" value={slotDate} onChange={e => setSlotDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time Slot (e.g. 10:00 AM)</label>
                    <input type="text" className="form-input" value={slotTime} onChange={e => setSlotTime(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-Buffer Time (Mins)</label>
                    <input type="number" className="form-input" value={autoBuffer} onChange={e => setAutoBuffer(parseInt(e.target.value))} />
                  </div>
                  <button className="btn-submit" onClick={handleUpdateSlots}>Save Schedule</button>
                </div>
              </div>
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
      case 'tools': return 'Clinical Tools';
      case 'management': return 'Management & Earnings';
      default: return 'Ansaea Clinical';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} />
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
          <li>
            <button
              onClick={() => setCurrentView('tools')}
              className={`nav-item ${currentView === 'tools' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <Stethoscope size={18} /> Clinical Tools
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView('management')}
              className={`nav-item ${currentView === 'management' ? 'active' : ''}`}
              style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <Briefcase size={18} /> Management
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
