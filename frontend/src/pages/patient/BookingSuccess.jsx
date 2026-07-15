import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar } from 'lucide-react';

export default function BookingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="auth-premium-wrapper">
      <div className="auth-premium-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', background: '#f0fdf4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 10px rgba(34, 197, 94, 0.1)'
          }}>
            <CheckCircle2 size={48} color="#22c55e" />
          </div>
        </div>
        
        <h1 className="auth-title">Booking Confirmed!</h1>
        <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>
          Your appointment has been successfully scheduled.
        </p>

        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'left', background: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Calendar size={20} color="#666" />
            <span style={{ fontWeight: '600' }}>Appointment Details</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6 }}>
            <div><strong>Doctor:</strong> Dr. Sarah Jenkins</div>
            <div><strong>Date:</strong> Tomorrow, 10:00 AM</div>
            <div><strong>Type:</strong> Video Consultation</div>
          </div>
        </div>

        <button className="btn-primary-auth" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
