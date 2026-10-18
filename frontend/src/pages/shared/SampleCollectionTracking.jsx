import { Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

export default function SampleCollectionTracking() {
  const { authenticatedFetch } = useAuth();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await authenticatedFetch('/lab/sample-tracking');
        if (res.ok) {
          const data = await res.json();
          if (data) setTracking(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [authenticatedFetch]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="main-content" style={{ padding: '2rem 10%', marginLeft: 0 }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <Truck size={28} color="var(--color-primary)" /> Sample Collection Tracking
        </h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
        {!tracking ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            No active sample collections found.
          </div>
        ) : (
          <div>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current Status</div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--color-primary)',
                marginBottom: '1.5rem',
              }}
            >
              {tracking.status}
            </div>

            <div
              style={{
                display: 'grid',
                gap: '1rem',
                background: 'var(--surface-color)',
                padding: '1.5rem',
                borderRadius: '8px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Tests: </span>
                <span style={{ fontWeight: 'bold' }}>{tracking.test_names.join(', ')}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Arrival: </span>
                <span style={{ fontWeight: 'bold' }}>{tracking.eta}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Agent: </span>
                <span style={{ fontWeight: 'bold' }}>{tracking.agent}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
