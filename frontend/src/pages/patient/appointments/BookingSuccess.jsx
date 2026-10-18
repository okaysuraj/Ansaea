import { Calendar, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment || location.state || {};

  const doctorName = appointment.doctor_name || appointment.doctor?.name || 'Dr. Specialist';
  const doctorSpecialty =
    appointment.doctor_specialty || appointment.doctor?.specialty || 'Clinical Psychiatrist';
  const dateStr = appointment.date || 'Upcoming';
  const timeSlot = appointment.time_slot || '10:00 AM';
  const sessionType = appointment.session_type ? appointment.session_type.toUpperCase() : 'VIDEO';

  return (
    <div className="auth-premium-wrapper">
      <div className="auth-premium-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 10px rgba(34, 197, 94, 0.1)',
            }}
          >
            <CheckCircle2 size={48} color="#22c55e" />
          </div>
        </div>

        <h1 className="auth-title">Booking Confirmed!</h1>
        <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>
          Your appointment has been successfully recorded in the clinical registry.
        </p>

        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left',
            background: 'var(--surface-0)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}
          >
            <Calendar size={20} color="var(--primary)" />
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              Appointment Details
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <strong>Doctor:</strong> {doctorName}
              </span>
              <span className="text-caption">{doctorSpecialty}</span>
            </div>
            <div>
              <strong>Schedule:</strong> {dateStr} at {timeSlot}
            </div>
            <div>
              <strong>Consultation Mode:</strong> {sessionType} Consultation
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/patient/appointments')}>
            View My Appointments
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/patient/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
