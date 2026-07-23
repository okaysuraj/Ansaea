import React, { useState, useEffect } from 'react';
import { Calendar, MessageSquare, Phone, Video } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ChatSession from '../../components/ChatSession';
import CallSession from '../../components/CallSession';

export default function MyAppointments() {
  const { authenticatedFetch } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await authenticatedFetch('/psychiatrists/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (e) {
      console.log('Error downloading appointments:', e);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const response = await authenticatedFetch(`/psychiatrists/appointments/${id}/cancel`, { method: 'POST' });
      if (response.ok) fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  if (activeAppointment) {
    return <ChatSession appointment={activeAppointment} onBack={() => setActiveAppointment(null)} />;
  }

  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Appointments</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            No booked consultations yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {appointments.map((appt) => (
              <div key={appt.id} className="glass-panel" style={{ padding: '1.5rem', background: '#fff' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <img src={appt.doctor_imageUrl} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{appt.doctor_name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{appt.doctor_specialty}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <span>{appt.date} • {appt.time_slot}</span>
                  <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: appt.session_type === 'chat' ? 'var(--color-primary)' : 'var(--color-success)' }}>
                    {appt.session_type}
                  </span>
                </div>

                {appt.status === 'upcoming' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        if (appt.session_type === 'chat') setActiveAppointment(appt);
                        else setActiveCall(appt);
                      }}
                      className="btn-submit"
                      style={{ flex: 1, marginTop: 0, padding: '0.75rem', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {appt.session_type === 'chat' ? <MessageSquare size={16} /> : appt.session_type === 'call' ? <Phone size={16} /> : <Video size={16} />}
                      Join
                    </button>
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="form-input"
                      style={{ width: 'auto', padding: '0.75rem 1rem', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {activeCall && (
        <CallSession appointment={activeCall} isVideo={activeCall.session_type === 'video'} onClose={() => setActiveCall(null)} />
      )}
    </div>
  );
}
