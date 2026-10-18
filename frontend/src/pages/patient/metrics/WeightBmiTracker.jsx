import { ArrowLeft, Plus, Scale } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { useApiData } from '../../../hooks/useApiData';

export default function WeightBmiTracker() {
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();

  const { data, loading, error, reload: fetchVitals } = useApiData('/tracker/vitals', []);
  const readings = data.filter((reading) => reading.bmi);
  const [showModal, setShowModal] = useState(false);
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('175');
  const [submitting, setSubmitting] = useState(false);

  const handleLog = async (e) => {
    e.preventDefault();
    if (!weightKg || !heightCm) return;
    setSubmitting(true);
    try {
      const heightM = parseFloat(heightCm) / 100;
      const calcBmi = parseFloat((parseFloat(weightKg) / (heightM * heightM)).toFixed(1));
      const res = await authenticatedFetch('/tracker/vitals', {
        method: 'POST',
        body: JSON.stringify({
          bmi: calcBmi,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setWeightKg('');
        fetchVitals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', badge: 'badge-warning' };
    if (bmi <= 24.9) return { label: 'Normal Weight', badge: 'badge-success' };
    if (bmi <= 29.9) return { label: 'Overweight', badge: 'badge-warning' };
    return { label: 'Obese', badge: 'badge-danger' };
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
            <h1 style={{ margin: 0 }}>Weight & BMI History</h1>
            <span className="text-caption">Body composition & somatic calibration</span>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Log Weight & BMI
        </button>
      </div>

      {showModal && (
        <div
          className="card card-padding"
          style={{ maxWidth: '440px', margin: '0 auto', width: '100%' }}
        >
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Log Body Composition</h3>
          <form
            onSubmit={handleLog}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
          >
            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                placeholder="70.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Height (cm)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="175"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
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
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Calculating...' : 'Save BMI'}
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
            Loading BMI history...
          </div>
        ) : readings.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <Scale size={36} style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }} />
            <h4>No BMI records logged</h4>
            <p className="text-caption">
              Click 'Log Weight & BMI' above to begin tracking body composition.
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
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Calculated BMI</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Classification</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                    Recorded At
                  </th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r, i) => {
                  const cat = getBmiCategory(r.bmi);
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
                        {r.bmi}{' '}
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 'normal',
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          kg/m²
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
