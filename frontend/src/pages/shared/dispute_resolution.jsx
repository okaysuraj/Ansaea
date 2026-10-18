import { Send, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useApiData } from '../../hooks/useApiData';

const DisputeResolution = () => {
  const { authenticatedFetch } = useAuth();
  const [subject, setSubject] = useState('');
  const [ticketText, setTicketText] = useState('');
  const {
    data: tickets,
    loading,
    error,
    reload: fetchTickets,
  } = useApiData('/support/tickets', []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authenticatedFetch('/support/tickets', {
        method: 'POST',
        body: JSON.stringify({
          subject,
          description: ticketText,
          category: 'other',
          priority: 'medium',
        }),
      });
      if (res.ok) {
        alert('Dispute submitted! We will contact you soon.');
        setSubject('');
        setTicketText('');
        fetchTickets();
      }
    } catch {
      alert('Failed to submit dispute');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="main-content" style={{ padding: '2rem 10%', marginLeft: 0 }}>
      {error && <p role="alert">{error}</p>}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <ShieldAlert size={28} /> Dispute Resolution
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>File a New Ticket</h3>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-color)',
              }}
              placeholder="Subject..."
              required
            />
            <textarea
              value={ticketText}
              onChange={(e) => setTicketText(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-color)',
                minHeight: '120px',
              }}
              placeholder="Describe your dispute in detail..."
              required
            />
            <button
              type="submit"
              className="action-btn primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Send size={18} /> Submit Dispute
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Your Tickets</h3>
          {tickets.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>No tickets found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tickets.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '1rem',
                    background: 'var(--surface-color)',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--color-primary)',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.subject}</div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {t.description}
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}
                  >
                    <span style={{ color: 'var(--color-primary)' }}>Status: {t.status}</span>
                    <span>{t.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputeResolution;
