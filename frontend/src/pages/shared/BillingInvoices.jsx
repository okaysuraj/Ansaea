import { CheckCircle, Clock, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

export default function BillingInvoices() {
  const { authenticatedFetch } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await authenticatedFetch('/billing/invoices');
        if (res.ok) {
          setInvoices(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [authenticatedFetch]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading invoices...</div>;
  }

  return (
    <div className="main-content" style={{ padding: '2rem 10%', marginLeft: 0 }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <CreditCard size={28} /> Billing & Invoices
        </h1>
      </div>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
            >
              <th style={{ padding: '1rem 0' }}>Date</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0' }}>{inv.date}</td>
                  <td style={{ fontWeight: 'bold' }}>{inv.amount}</td>
                  <td>{inv.type}</td>
                  <td
                    style={{
                      color:
                        inv.status === 'Success' ? 'var(--color-success)' : 'var(--color-warning)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {inv.status === 'Success' ? <CheckCircle size={16} /> : <Clock size={16} />}
                      {inv.status}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
