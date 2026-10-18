import { Bell, Calendar, CheckCircle2, FileText, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useApiData } from '../../hooks/useApiData';

export default function NotificationsCenter() {
  const { authenticatedFetch } = useAuth();

  const {
    data: notifications,
    loading,
    error,
    setData: setNotifications,
  } = useApiData('/notifications', []);

  const handleMarkAllRead = async () => {
    try {
      const res = await authenticatedFetch('/notifications/read-all', { method: 'PUT' });
      if (res.ok) {
        setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      }
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
      case 'urgent':
        return ShieldAlert;
      case 'lab':
      case 'report':
        return FileText;
      case 'appointment':
        return Calendar;
      default:
        return Bell;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
        <div>
          <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>
            System Activity
          </span>
          <h1>Notifications Center</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Clinical triage alerts, report deliveries, and scheduling confirmations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <span className={`badge ${unreadCount > 0 ? 'badge-accent' : 'badge-neutral'}`}>
            {unreadCount} Unread
          </span>
          {unreadCount > 0 && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
              <CheckCircle2 size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="card card-padding">
        {loading ? (
          <div
            style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <div
              className="stat-icon"
              style={{ width: '48px', height: '48px', margin: '0 auto var(--space-3)' }}
            >
              <Bell size={20} />
            </div>
            <h4>All caught up!</h4>
            <p className="text-caption">
              No pending alerts, report notifications, or appointment updates right now.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {notifications.map((notif) => {
              const Icon = getIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-4)',
                    background: notif.is_read ? 'var(--surface-0)' : 'var(--surface-2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    className="stat-icon"
                    style={{ width: '40px', height: '40px', flexShrink: 0 }}
                  >
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-1)',
                        flexWrap: 'wrap',
                        gap: 'var(--space-2)',
                      }}
                    >
                      <h4 style={{ margin: 0, fontSize: '0.9375rem' }}>{notif.title}</h4>
                      <span className="text-caption">
                        {notif.created_at ? new Date(notif.created_at).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                    <p
                      className="text-caption"
                      style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}
                    >
                      {notif.message || notif.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
