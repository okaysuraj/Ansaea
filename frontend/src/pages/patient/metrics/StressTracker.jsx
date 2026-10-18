import { ArrowLeft, Plus, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { useApiData } from '../../../hooks/useApiData';

export default function StressTracker() {
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();

  const { data, loading, error, reload: fetchLogs } = useApiData('/tracker/mood', []);
  const logs = data.filter((reading) => reading.stress_level != null);
  const [showModal, setShowModal] = useState(false);
  const [stressLevel, setStressLevel] = useState(4);
  const [stressDate, setStressDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleLog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await authenticatedFetch('/tracker/mood', {
        method: 'POST',
        body: JSON.stringify({
          stress_level: parseInt(stressLevel),
          date: stressDate,
          mood_rating: 10 - parseInt(stressLevel),
          mood_type: 'stress_checkin',
          journal_entry: `Stress rating: ${stressLevel}/10`,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStressCategory = (lvl) => {
    if (lvl <= 3) return { label: 'Low / Calm', badge: 'badge-success' };
    if (lvl <= 6) return { label: 'Moderate Arousal', badge: 'badge-warning' };
    return { label: 'High Sympathetic Strain', badge: 'badge-danger' };
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/patient/health-metrics')}
          >
            <ArrowLeft size={14} /> Back to Metrics
          </button>
          <div>
            <h1 style={{ margin: 0 }}>Autonomic Stress Tracker</h1>
            <span className="text-caption">Sympathetic nervous arousal & allostatic load</span>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Log Stress Level
        </button>
      </div>

      {showModal && (
        <div
          className="card card-padding"
          style={{ maxWidth: '440px', margin: '0 auto', width: '100%' }}
        >
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Log Stress State</h3>
          <form
            onSubmit={handleLog}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
          >
            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Date
              </label>
              <input
                type="date"
                className="form-input"
                value={stressDate}
                onChange={(e) => setStressDate(e.target.value)}
                required
              />
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-1)',
                }}
              >
                <label className="text-label">Stress Rating (1 - 10)</label>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                  {stressLevel} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                className="form-input"
                style={{ padding: 0 }}
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value)}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                  marginTop: '4px',
                }}
              >
                <span>1: Totally Calm</span>
                <span>5: Mild Strain</span>
                <span>10: Acute Overwhelm</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Stress Rating'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card card-padding">
        {loading ? (
          <div
            style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            Loading stress records...
          </div>
        ) : logs.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <Zap size={36} style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }} />
            <h4>No stress logs recorded</h4>
            <p className="text-caption">
              Click 'Log Stress Level' above to calibrate your nervous system strain.
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
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Date</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Stress Level</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Autonomic State</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const cat = getStressCategory(log.stress_level);
                  return (
                    <tr key={log.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                        {log.date}
                      </td>
                      <td
                        style={{
                          padding: 'var(--space-3) var(--space-2)',
                          fontWeight: '700',
                          fontSize: '1rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {log.stress_level}{' '}
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 'normal',
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          / 10
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                        <span className={`badge ${cat.badge}`}>{cat.label}</span>
                      </td>
                      <td
                        style={{
                          padding: 'var(--space-3) var(--space-2)',
                          textAlign: 'right',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        Logged
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
