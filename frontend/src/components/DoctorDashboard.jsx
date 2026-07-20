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

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Clinical Dashboard</h1>
        <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-success)' }}>
          <UserCheck size={14} /> System Status: Secure
        </div>
      </div>
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
    </div>
  );
}
