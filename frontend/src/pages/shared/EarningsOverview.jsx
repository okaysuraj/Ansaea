import { Activity, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

export default function EarningsOverview() {
  const { authenticatedFetch } = useAuth();
  const [earnings, setEarnings] = useState({ total_earnings: '$0.00', recent_transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await authenticatedFetch('/billing/earnings');
        if (res.ok) {
          setEarnings(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [authenticatedFetch]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading earnings...</div>;
  }

  return (
    <div className="main-content" style={{ padding: '2rem 10%', marginLeft: 0 }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <DollarSign size={28} /> Earnings Overview
        </h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Total Earnings</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {earnings.total_earnings}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
          >
            <Activity size={20} /> Recent Transactions
          </h3>

          {earnings.recent_transactions.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>No recent transactions.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {earnings.recent_transactions.map((txn, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--surface-color)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ color: 'var(--text-muted)' }}>{txn.date}</div>
                  <div style={{ fontWeight: 'bold' }}>{txn.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
