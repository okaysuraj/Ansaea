import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, Phone, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AppointmentScheduler({ doctor, onClose, onSuccess }) {
  const { authenticatedFetch } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sessionType, setSessionType] = useState('chat'); // chat, call, video
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  // Set min date to today
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setError('Please choose a valid date and time slot');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await authenticatedFetch('/psychiatrists/book', {
        method: 'POST',
        body: JSON.stringify({
          doctor_id: doctor.id,
          date: selectedDate,
          time_slot: selectedSlot,
          session_type: sessionType
        })
      });

      const data = await response.json();
      if (response.ok) {
        setBookingDone(true);
      } else {
        setError(data.detail || 'Slot not available. Try another time or doctor.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred booking session');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingDone) {
    return (
      <div className="call-modal" style={{ background: 'rgba(7, 10, 19, 0.98)' }}>
        <div className="glass-panel" style={{ width: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Calendar size={30} />
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Appointment Confirmed</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: '1.5' }}>
            Your wellness consultation session with <strong>{doctor.name}</strong> is locked in for <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> via <strong>{sessionType}</strong> mode.
          </p>
          <button onClick={onSuccess} className="btn-submit" style={{ marginTop: 0 }}>
            Go to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="call-modal">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem', position: 'relative' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Schedule Wellness Session</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2rem' }}>
          Consulting: <strong style={{ color: 'var(--text-primary)' }}>{doctor.name}</strong> • {doctor.specialty}
        </p>

        {error && (
          <div className="glass-panel" style={{ padding: '0.75rem', marginBottom: '1.25rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. Date Input */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> Choose Session Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* 2. Slot Selection */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} /> Select Available Slot
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
              {doctor.availability_slots.map((slot) => (
                <div
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className="glass-panel"
                  style={{
                    padding: '0.5rem 0',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    borderColor: selectedSlot === slot ? 'var(--color-primary)' : 'transparent',
                    background: selectedSlot === slot ? 'var(--color-primary-glow)' : 'rgba(255, 255, 255, 0.01)',
                    color: selectedSlot === slot ? 'var(--color-primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Session Medium Selection */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Consultation Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
              
              {/* Chat option */}
              <div
                onClick={() => setSessionType('chat')}
                className="glass-panel"
                style={{
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderColor: sessionType === 'chat' ? 'var(--color-primary)' : 'transparent',
                  background: sessionType === 'chat' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                  color: sessionType === 'chat' ? 'var(--color-primary)' : 'var(--text-muted)'
                }}
              >
                <MessageSquare size={20} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Live Chat</span>
              </div>

              {/* Call option */}
              <div
                onClick={() => setSessionType('call')}
                className="glass-panel"
                style={{
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderColor: sessionType === 'call' ? 'var(--color-info)' : 'transparent',
                  background: sessionType === 'call' ? 'rgba(14, 165, 233, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                  color: sessionType === 'call' ? 'var(--color-info)' : 'var(--text-muted)'
                }}
              >
                <Phone size={20} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Voice Call</span>
              </div>

              {/* Video option */}
              <div
                onClick={() => setSessionType('video')}
                className="glass-panel"
                style={{
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderColor: sessionType === 'video' ? 'var(--color-success)' : 'transparent',
                  background: sessionType === 'video' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                  color: sessionType === 'video' ? 'var(--color-success)' : 'var(--text-muted)'
                }}
              >
                <Video size={20} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Video Call</span>
              </div>

            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedDate || !selectedSlot}
            className="btn-submit"
            style={{ marginTop: 0 }}
          >
            {isSubmitting ? 'Confirming with Doctor...' : `Book consultation • $${doctor.session_price}`}
          </button>
        </form>
      </div>
    </div>
  );
}
