import React, { useState, useEffect } from 'react';
import { Search, Calendar, DollarSign, Award, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppointmentScheduler from './AppointmentScheduler';

export default function PsychiatristDirectory({ onBookingSuccess }) {
  const { authenticatedFetch } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authenticatedFetch('/psychiatrists');
      const data = await response.json();
      if (response.ok) {
        setDoctors(data);
      } else {
        setError('Unable to fetch psychiatrist list');
      }
    } catch (err) {
      setError(err.message || 'Database error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h3>Professional Wellness Experts</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Book direct chat, voice, or video therapy slots with medical professionals.</p>
        </div>
        
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '0.5rem 1rem', width: '320px', gap: '0.5rem' }}>
          <Search size={18} style={{ color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {error && (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Contacting Ansaea directory registry...</div>
      ) : filteredDoctors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No doctors match your query. Try broadening your terms.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="glass-panel doctor-card">
              <img src={doc.imageUrl} alt={doc.name} className="doctor-img" />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'var(--color-primary-glow)', color: '#a5b4fc', textTransform: 'uppercase' }}>
                  {doc.specialty}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-warning)' }}>
                  <Star size={14} fill="currentColor" /> {doc.rating}
                </span>
              </div>

              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>{doc.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.45', flex: 1, marginBottom: '1.25rem' }}>
                {doc.bio}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={16} /> {doc.experience_years} Years
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <DollarSign size={16} /> {doc.session_price} / hr
                </span>
              </div>

              <button
                onClick={() => setSelectedDoctor(doc)}
                className="btn-submit"
                style={{ marginTop: 0 }}
              >
                Schedule Session
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedDoctor && (
        <AppointmentScheduler
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSuccess={() => {
            setSelectedDoctor(null);
            if (onBookingSuccess) onBookingSuccess();
          }}
        />
      )}
    </div>
  );
}
