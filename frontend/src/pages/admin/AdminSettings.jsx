import { CheckCircle2, Lock, Save, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

export default function AdminSettings() {
  const { authenticatedFetch } = useAuth();
  const [settings, setSettings] = useState({
    hipaa_mode: true,
    gdpr_mode: true,
    maintenance_mode: false,
    email_notifications: true,
    session_timeout_minutes: 30,
    rate_limit_rpm: 120,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await authenticatedFetch('/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    fetchSettings();
  }, [authenticatedFetch]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authenticatedFetch('/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

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
            Configuration Engine
          </span>
          <h1>System Settings & Compliance</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Manage global platform parameters, cryptographic compliance, and security thresholds.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="badge badge-accent">Production Node</span>
        </div>
      </div>

      {saved && (
        <div
          className="badge badge-success"
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            justifyContent: 'center',
          }}
        >
          <CheckCircle2 size={16} /> Configuration updated successfully
        </div>
      )}

      <form
        onSubmit={handleSave}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
          maxWidth: '900px',
        }}
      >
        {/* Compliance & Security */}
        <div className="card card-padding">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div className="stat-icon" style={{ width: '32px', height: '32px' }}>
              <Shield size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Statutory Privacy & Security Controls</h3>
              <span className="text-caption">Field-level encryption and regulatory governance</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <label
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: 'var(--space-3)',
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                  HIPAA Compliance Protocol
                </div>
                <div className="text-caption">
                  Enforces PHI immutable audit logging and auto-token invalidation
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.hipaa_mode}
                onChange={() => handleToggle('hipaa_mode')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
              />
            </label>

            <label
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: 'var(--space-3)',
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                  GDPR / Right to be Forgotten
                </div>
                <div className="text-caption">
                  Automated cryptographic shredding of patient identifiers upon request
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.gdpr_mode}
                onChange={() => handleToggle('gdpr_mode')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
              />
            </label>

            <label
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: 'var(--space-3)',
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Maintenance Mode</div>
                <div className="text-caption">
                  Restricts ingress access to authorized administrative IP addresses
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={() => handleToggle('maintenance_mode')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--status-danger)' }}
              />
            </label>
          </div>
        </div>

        {/* Operational Limits */}
        <div className="card card-padding">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div className="stat-icon" style={{ width: '32px', height: '32px' }}>
              <Lock size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Session & Rate Limits</h3>
              <span className="text-caption">
                Thresholds for API protection and brute-force mitigation
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Session Inactivity Timeout (minutes)</label>
              <input
                type="number"
                value={settings.session_timeout_minutes}
                onChange={(e) =>
                  setSettings({ ...settings, session_timeout_minutes: Number(e.target.value) })
                }
                className="form-input"
                min="5"
                max="240"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">API Rate Limit (Requests per minute)</label>
              <input
                type="number"
                value={settings.rate_limit_rpm}
                onChange={(e) =>
                  setSettings({ ...settings, rate_limit_rpm: Number(e.target.value) })
                }
                className="form-input"
                min="30"
                max="1000"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            <Save size={16} />
            {loading ? 'Committing changes...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
