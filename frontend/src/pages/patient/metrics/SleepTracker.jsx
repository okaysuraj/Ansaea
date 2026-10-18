import { ArrowLeft, Moon, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { useApiData } from '../../../hooks/useApiData';

export default function SleepTracker() {
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();

  const { data, loading, error, reload: fetchLogs } = useApiData('/tracker/mood', []);
  const logs = data.filter((reading) => reading.sleep_hours != null);
  const [showModal, setShowModal] = useState(false);
  const [sleepHours, setSleepHours] = useState('7.5');
  const [sleepDate, setSleepDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleLog = async (e) => {
    e.preventDefault();
    if (!sleepHours) return;
    setSubmitting(true);
    try {
      const res = await authenticatedFetch('/tracker/mood', {
        method: 'POST',
        body: JSON.stringify({
          sleep_hours: parseFloat(sleepHours),
          date: sleepDate,
          mood_rating: 7,
          mood_type: 'rested',
          journal_entry: `Recorded ${sleepHours} hours of sleep`,
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
            <h1 style={{ margin: 0 }}>Sleep Duration & Architecture</h1>
            <span className="text-caption">Circadian rhythm tracking & restorative rest</span>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Log Sleep
        </button>
      </div>

      {showModal && (
        <div
          className="card card-padding"
          style={{ maxWidth: '440px', margin: '0 auto', width: '100%' }}
        >
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Log Sleep Window</h3>
          <form
            onSubmit={handleLog}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
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
                value={sleepDate}
                onChange={(e) => setSleepDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Sleep Duration (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="24"
                className="form-input"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
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
                {submitting ? 'Saving...' : 'Save Sleep Record'}
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
            Loading sleep records...
          </div>
        ) : logs.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <Moon size={36} style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }} />
            <h4>No sleep records logged</h4>
            <p className="text-caption">
              Click 'Log Sleep' above to start tracking your nightly rest duration.
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
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Duration</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Rest Score</th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
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
                      {log.sleep_hours}{' '}
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 'normal',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        hrs
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span className="badge badge-accent">
                        {log.sleep_hours >= 7 && log.sleep_hours <= 9
                          ? 'Optimal Sleep'
                          : log.sleep_hours < 7
                            ? 'Sleep Deficit'
                            : 'Excessive Rest'}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        textAlign: 'right',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Synchronized
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
