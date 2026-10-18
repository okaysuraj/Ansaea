import { Activity, ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { useApiData } from '../../../hooks/useApiData';

export default function BloodPressureHistory() {
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();

  const { data, loading, error, reload: fetchVitals } = useApiData('/tracker/vitals', []);
  const vitals = data.filter((reading) => reading.blood_pressure);
  const [showLogModal, setShowLogModal] = useState(false);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLog = async (e) => {
    e.preventDefault();
    if (!systolic || !diastolic) return;
    setSubmitting(true);
    try {
      const bpStr = `${systolic}/${diastolic}`;
      const res = await authenticatedFetch('/tracker/vitals', {
        method: 'POST',
        body: JSON.stringify({
          blood_pressure: bpStr,
          heart_rate: heartRate ? parseInt(heartRate) : null,
        }),
      });
      if (res.ok) {
        setShowLogModal(false);
        setSystolic('');
        setDiastolic('');
        setHeartRate('');
        fetchVitals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getBpCategory = (bp) => {
    if (!bp || !bp.includes('/')) return { label: 'Normal', badge: 'badge-success' };
    const [sys, dia] = bp.split('/').map(Number);
    if (sys < 120 && dia < 80) return { label: 'Optimal', badge: 'badge-success' };
    if (sys <= 129 && dia < 80) return { label: 'Elevated', badge: 'badge-warning' };
    if (sys <= 139 || dia <= 89) return { label: 'Stage 1 HTN', badge: 'badge-danger' };
    return { label: 'Stage 2 HTN', badge: 'badge-danger' };
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
            <h1 style={{ margin: 0 }}>Blood Pressure Log</h1>
            <span className="text-caption">Cardiovascular hemodynamic tracking</span>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowLogModal(true)}>
          <Plus size={15} /> Log Reading
        </button>
      </div>

      {showLogModal && (
        <div
          className="card card-padding"
          style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}
        >
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Record Blood Pressure</h3>
          <form
            onSubmit={handleLog}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
          >
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ flex: 1 }}>
                <label
                  className="text-label"
                  style={{ display: 'block', marginBottom: 'var(--space-1)' }}
                >
                  Systolic (mmHg)
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  className="text-label"
                  style={{ display: 'block', marginBottom: 'var(--space-1)' }}
                >
                  Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Pulse / Heart Rate (BPM)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="72"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--space-2)',
                marginTop: 'var(--space-2)',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowLogModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Reading'}
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
            Loading readings...
          </div>
        ) : vitals.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <Activity size={36} style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }} />
            <h4>No blood pressure readings recorded</h4>
            <p className="text-caption">
              Click 'Log Reading' above to record your first clinical measurement.
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
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Reading</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Heart Rate</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Status</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                    Recorded At
                  </th>
                </tr>
              </thead>
              <tbody>
                {vitals.map((v, i) => {
                  const cat = getBpCategory(v.blood_pressure);
                  return (
                    <tr key={v.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td
                        style={{
                          padding: 'var(--space-3) var(--space-2)',
                          fontWeight: '700',
                          fontSize: '1rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {v.blood_pressure}{' '}
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 'normal',
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          mmHg
                        </span>
                      </td>
                      <td
                        style={{
                          padding: 'var(--space-3) var(--space-2)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {v.heart_rate ? `${v.heart_rate} BPM` : '—'}
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
                        {v.date ? new Date(v.date).toLocaleString() : 'Recent'}
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
