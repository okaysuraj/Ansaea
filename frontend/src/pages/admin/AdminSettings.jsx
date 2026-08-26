import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Bell, Lock, Database, Save, Check } from 'lucide-react';

export default function AdminSettings() {
  const { authenticatedFetch } = useAuth();
  const [settings, setSettings] = useState({
    hipaa_mode: true,
    gdpr_mode: true,
    maintenance_mode: false,
    email_notifications: true,
    session_timeout_minutes: 30,
    rate_limit_rpm: 120
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await authenticatedFetch('/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    fetchSettings();
  }, [authenticatedFetch]);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authenticatedFetch('/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', color: 'var(--text-primary, #fff)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings size={28} /> System Settings & Compliance
        </h2>
        <p style={{ color: 'var(--text-muted, #888)', marginTop: '0.25rem' }}>
          Manage global application parameters, security compliance, and platform toggles.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Compliance & Security */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Shield size={20} color="#10b981" /> Compliance & Security Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 500 }}>HIPAA Compliance Mode</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888)' }}>Enforces PHI audit logging, automatic encryption, and session invalidation</div>
              </div>
              <input
                type="checkbox"
                checked={settings.hipaa_mode}
                onChange={() => handleToggle('hipaa_mode')}
                style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
              />
            </label>

            <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: 0 }} />

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 500 }}>GDPR / Privacy Shield Mode</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888)' }}>Requires consent prompts and data deletion request handling</div>
              </div>
              <input
                type="checkbox"
                checked={settings.gdpr_mode}
                onChange={() => handleToggle('gdpr_mode')}
                style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
              />
            </label>
          </div>
        </div>

        {/* Platform Status */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Lock size={20} color="#6366f1" /> Operational Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 500 }}>Maintenance Mode</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888)' }}>Temporarily restrict non-admin access to the application</div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={() => handleToggle('maintenance_mode')}
                style={{ width: '20px', height: '20px', accentColor: '#ef4444' }}
              />
            </label>

            <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: 0 }} />

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 500 }}>Global Email Notifications</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888)' }}>Send automated transactional and reminder emails</div>
              </div>
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={() => handleToggle('email_notifications')}
                style={{ width: '20px', height: '20px', accentColor: '#6366f1' }}
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {saved ? <Check size={18} /> : <Save size={18} />}
            {saved ? 'Settings Saved' : 'Save Changes'}
          </button>
          {saved && <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Configuration updated successfully!</span>}
        </div>
      </form>
    </div>
  );
}
