import { Calendar, CheckCircle2, Clock, MessageSquare, Phone, Trash2, Video } from 'lucide-react';
import { useState } from 'react';
import CallSession from '../../../components/CallSession';
import ChatSession from '../../../components/ChatSession';
import { useAuth } from '../../../context/useAuth';
import { useApiData } from '../../../hooks/useApiData';

export default function MyAppointments() {
  const { authenticatedFetch } = useAuth();

  const {
    data: appointments,
    error,
    reload: fetchAppointments,
  } = useApiData('/psychiatrists/appointments', []);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this consultation?')) return;
    try {
      const response = await authenticatedFetch(`/psychiatrists/appointments/${id}/cancel`, {
        method: 'POST',
      });
      if (response.ok) fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  if (activeAppointment) {
    return (
      <ChatSession appointment={activeAppointment} onBack={() => setActiveAppointment(null)} />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {error && <p role="alert">{error}</p>}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>
            Patient Portal
          </span>
          <h1>My Consultations</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Scheduled and historical clinical visits with your medical team.
          </p>
        </div>
      </div>

      <div className="card card-padding" style={{ minHeight: '60vh' }}>
        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={24} />
            </div>
            <div className="empty-state-title">No scheduled appointments</div>
            <div className="empty-state-desc">
              You don't have any upcoming consultations. Browse our clinical specialist directory to
              book a session.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="card card-padding"
                style={{ background: 'var(--surface-0)', display: 'flex', flexDirection: 'column' }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'center',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  <img
                    src={
                      appt.doctor_imageUrl ||
                      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150'
                    }
                    alt={appt.doctor_name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-avatar)',
                      objectFit: 'cover',
                      border: '1px solid var(--border)',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-primary)' }}
                    >
                      {appt.doctor_name}
                    </div>
                    <div className="text-caption">{appt.doctor_specialty}</div>
                  </div>
                  <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>
                    {appt.session_type}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-4)',
                    padding: 'var(--space-2) 0',
                    borderTop: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <Clock size={13} style={{ color: 'var(--accent)' }} />
                  <span>
                    {appt.date} • {appt.time_slot}
                  </span>
                </div>

                {appt.status === 'upcoming' ? (
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (appt.session_type === 'chat') setActiveAppointment(appt);
                        else setActiveCall(appt);
                      }}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      {appt.session_type === 'chat' ? (
                        <MessageSquare size={14} />
                      ) : appt.session_type === 'call' ? (
                        <Phone size={14} />
                      ) : (
                        <Video size={14} />
                      )}
                      Join Room
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel(appt.id)}
                      className="btn btn-ghost btn-icon"
                      style={{ color: 'var(--status-danger)' }}
                      title="Cancel Booking"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : (
                  <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>
                    <CheckCircle2 size={12} /> Completed
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
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
