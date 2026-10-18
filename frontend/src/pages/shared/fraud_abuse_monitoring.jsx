import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

const FraudAbuseMonitoring = () => {
  const { authenticatedFetch } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await authenticatedFetch('/admin/fraud-alerts');
        if (res.ok) setAlerts(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [authenticatedFetch]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="main-content" style={{ padding: '2rem 10%', marginLeft: 0 }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <ShieldAlert size={28} /> Fraud & Abuse Monitoring
        </h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Admin Dashboard for monitoring suspicious activities, fake accounts, and prescription
          abuse.
        </p>

        {alerts.length === 0 ? (
          <div
            style={{
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--color-success)',
              borderRadius: '8px',
            }}
          >
            No recent fraudulent activity detected.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: '1rem',
                  background: 'var(--surface-color)',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${alert.severity === 'high' ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <AlertTriangle
                  color={alert.severity === 'high' ? 'var(--color-danger)' : 'var(--color-warning)'}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{alert.type}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    User: {alert.user_id}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>Status: {alert.status}</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudAbuseMonitoring;
