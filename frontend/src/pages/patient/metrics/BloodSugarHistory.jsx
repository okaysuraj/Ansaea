import { ArrowLeft, Droplets, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { useApiData } from '../../../hooks/useApiData';

export default function BloodSugarHistory() {
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();

  const { data, loading, error, reload: fetchVitals } = useApiData('/tracker/vitals', []);
  const readings = data.filter((reading) => reading.blood_sugar);
  const [showLogModal, setShowLogModal] = useState(false);
  const [bloodSugar, setBloodSugar] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLog = async (e) => {
    e.preventDefault();
    if (!bloodSugar) return;
    setSubmitting(true);
    try {
      const res = await authenticatedFetch('/tracker/vitals', {
        method: 'POST',
        body: JSON.stringify({
          blood_sugar: parseFloat(bloodSugar),
        }),
      });
      if (res.ok) {
        setShowLogModal(false);
        setBloodSugar('');
        fetchVitals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getGlucoseStatus = (val) => {
    if (val < 70) return { label: 'Low (Hypo)', badge: 'badge-warning' };
    if (val <= 99) return { label: 'Fasting Normal', badge: 'badge-success' };
    if (val <= 140) return { label: 'Post-Meal Normal', badge: 'badge-success' };
    if (val <= 199) return { label: 'Elevated (Pre-diabetic)', badge: 'badge-warning' };
    return { label: 'High (Hyperglycemic)', badge: 'badge-danger' };
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
            <h1 style={{ margin: 0 }}>Blood Glucose Log</h1>
            <span className="text-caption">Glycemic variability & metabolic monitoring</span>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowLogModal(true)}>
          <Plus size={15} /> Log Glucose
        </button>
      </div>

      {showLogModal && (
        <div
          className="card card-padding"
          style={{ maxWidth: '440px', margin: '0 auto', width: '100%' }}
        >
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Record Blood Glucose</h3>
          <form
            onSubmit={handleLog}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
          >
            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Glucose Level (mg/dL)
              </label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                placeholder="95.0"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                required
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
                {submitting ? 'Saving...' : 'Save Glucose'}
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
            Loading glucose records...
          </div>
        ) : readings.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <Droplets size={36} style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }} />
            <h4>No glucose readings recorded</h4>
            <p className="text-caption">Click 'Log Glucose' to record your first reading.</p>
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
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Blood Glucose</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Clinical Range</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                    Recorded At
                  </th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r, i) => {
                  const status = getGlucoseStatus(r.blood_sugar);
                  return (
                    <tr key={r.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td
                        style={{
                          padding: 'var(--space-3) var(--space-2)',
                          fontWeight: '700',
                          fontSize: '1rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {r.blood_sugar}{' '}
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 'normal',
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          mg/dL
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                        <span className={`badge ${status.badge}`}>{status.label}</span>
                      </td>
                      <td
                        style={{
                          padding: 'var(--space-3) var(--space-2)',
                          textAlign: 'right',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {r.date ? new Date(r.date).toLocaleString() : 'Recent'}
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
