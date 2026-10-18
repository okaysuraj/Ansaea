import { MessageSquare, Search, ShieldCheck, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import ChatSession from '../../components/ChatSession';
import { useAuth } from '../../context/useAuth';

export default function MessagesInbox() {
  const { authenticatedFetch, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await authenticatedFetch('/chat/conversations');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setConversations(data);
          } else {
            // Also check appointments for any valid chat sessions
            const apptRes = await authenticatedFetch('/psychiatrists/appointments');
            if (apptRes.ok) {
              const appts = await apptRes.json();
              if (Array.isArray(appts)) {
                setConversations(
                  appts.map((a) => ({
                    appointment_id: a.id,
                    name: user?.role === 'doctor' ? a.patient_name || 'Patient' : a.doctor_name,
                    role: user?.role === 'doctor' ? 'Patient' : a.doctor_specialty || 'Clinician',
                    last_message: `${a.session_type.toUpperCase()} Consultation (${a.date} ${a.time_slot})`,
                    time: a.date,
                    unread: 0,
                  })),
                );
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [authenticatedFetch, user]);

  if (activeChat) {
    const appointmentObj = {
      id: activeChat.appointment_id,
      doctor_name: activeChat.name,
      doctor_specialty: activeChat.role,
      session_type: 'chat',
    };
    return <ChatSession appointment={appointmentObj} onBack={() => setActiveChat(null)} />;
  }

  const filtered = conversations.filter(
    (c) =>
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.role || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            Encrypted Communications
          </span>
          <h1>Clinical Messages Inbox</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Confidential patient-clinician direct messaging with automated E2E encryption.
          </p>
        </div>
        <span className="badge badge-success">
          <ShieldCheck size={13} /> Signal Protocol Active
        </span>
      </div>

      <div className="card" style={{ display: 'flex', height: '68vh', overflow: 'hidden' }}>
        {/* Sidebar list */}
        <div
          style={{
            width: '320px',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface-0)',
          }}
        >
          <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div
                style={{
                  padding: 'var(--space-4)',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                Loading conversations...
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  padding: 'var(--space-6)',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <p style={{ fontSize: '0.875rem' }}>No conversations yet.</p>
                <span className="text-caption">
                  Book a consultation or start an encounter to initiate encrypted chat.
                </span>
              </div>
            ) : (
              filtered.map((chat) => (
                <div
                  key={chat.appointment_id}
                  onClick={() => setActiveChat(chat)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    className="stat-icon"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-avatar)',
                      flexShrink: 0,
                    }}
                  >
                    <UserCheck size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {chat.name}
                    </div>
                    <div className="text-caption truncate">{chat.role}</div>
                    <div
                      className="text-caption"
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '0.75rem',
                        marginTop: '2px',
                      }}
                    >
                      {chat.last_message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Empty state / Prompt */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface-1)',
            padding: 'var(--space-6)',
          }}
        >
          <div
            className="stat-icon"
            style={{ width: '56px', height: '56px', marginBottom: 'var(--space-4)' }}
          >
            <MessageSquare size={24} />
          </div>
          <h3 style={{ marginBottom: 'var(--space-1)' }}>Select a conversation</h3>
          <p className="text-caption" style={{ maxWidth: '320px', textAlign: 'center' }}>
            Choose a clinical dialogue from the left panel to resume end-to-end encrypted messaging.
          </p>
        </div>
      </div>
    </div>
  );
}
