import { ArrowRight, Search, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';

export default function PatientDirectory() {
  const { authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await authenticatedFetch('/doctors/patients');
        if (res.ok) {
          const data = await res.json();
          setPatients(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load patient directory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [authenticatedFetch]);

  const filtered = patients.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
            Clinical Registry
          </span>
          <h1>Assigned Patients</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Directory of patients with scheduled or completed consultations.
          </p>
        </div>
        <span className="badge badge-accent">{patients.length} Active Patients</span>
      </div>

      <div className="card card-padding">
        <div style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
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
            className="form-input"
            placeholder="Search patients by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {loading ? (
          <div
            style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            Loading patients from database...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <div
              className="stat-icon"
              style={{ width: '48px', height: '48px', margin: '0 auto var(--space-3)' }}
            >
              <Users size={24} />
            </div>
            <h4>No patients found</h4>
            <p className="text-caption">
              {searchQuery
                ? 'No patients match your search query.'
                : 'Patients will automatically appear here once consultations are scheduled.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr
                  style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-tertiary)' }}
                >
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Patient
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Email
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Status
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-3) var(--space-2)',
                      fontWeight: '600',
                      textAlign: 'right',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr key={patient.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                      }}
                    >
                      <div
                        className="stat-icon"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-avatar)',
                        }}
                      >
                        <UserCheck size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {patient.name}
                        </div>
                        <div
                          className="text-mono"
                          style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}
                        >
                          ID: {patient.id.substring(0, 8)}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {patient.email}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span className="badge badge-success">{patient.status || 'Active'}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                      >
                        View History <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
