import { Award, Calendar, Search, Star } from 'lucide-react';
import { useState } from 'react';
import { useApiData } from '../hooks/useApiData';
import AppointmentScheduler from './AppointmentScheduler';

export default function PsychiatristDirectory({ onBookingSuccess }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { data: doctors, loading: isLoading, error } = useApiData('/psychiatrists', []);

  const filteredDoctors = doctors.filter(
    (doc) =>
      (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.specialty || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* Top filter bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div>
          <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>
            Specialist Network
          </span>
          <h2>Licensed Mental Health Clinicians</h2>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Connect with board-certified psychiatrists and psychologists for confidential video or
            chat sessions.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
            }}
          />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {error && (
        <div
          className="badge badge-danger"
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="empty-state">
          <div className="empty-state-title">Loading clinical registry...</div>
          <div className="empty-state-desc">
            Fetching available board-certified professionals and slots.
          </div>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No specialists matched</div>
          <div className="empty-state-desc">
            Try clearing your search query or selecting a different specialty.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="card card-padding"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-4)',
                  alignItems: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <img
                  src={doc.imageUrl}
                  alt={doc.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-avatar)',
                    objectFit: 'cover',
                    border: '1px solid var(--border)',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    <span className="badge badge-accent">{doc.specialty}</span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        color: 'var(--status-warning)',
                      }}
                    >
                      <Star size={13} fill="currentColor" /> {doc.rating || '5.0'}
                    </span>
                  </div>
                  <h4 style={{ margin: 0 }}>{doc.name}</h4>
                </div>
              </div>

              <p
                className="text-caption"
                style={{ flex: 1, marginBottom: 'var(--space-4)', lineHeight: '1.5' }}
              >
                {doc.bio}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3) 0',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: 'var(--space-4)',
                  fontSize: '0.8125rem',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Award size={15} style={{ color: 'var(--accent)' }} /> {doc.experience_years} yrs
                  exp.
                </span>
                <span
                  className="text-mono"
                  style={{ fontWeight: '600', color: 'var(--text-primary)' }}
                >
                  ${doc.session_price} / session
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoctor(doc)}
                className="btn btn-primary btn-full"
              >
                <Calendar size={15} /> Schedule Consultation
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
