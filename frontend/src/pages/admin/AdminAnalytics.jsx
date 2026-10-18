import Analytics from '../../components/Analytics';

export default function AdminAnalytics() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary, #fff)',
            marginBottom: '0.5rem',
          }}
        >
          Platform Analytics & System Insights
        </h2>
        <p style={{ color: 'var(--text-muted, #888)' }}>
          Real-time health telemetry, user trends, and platform metrics.
        </p>
      </div>
      <Analytics />
    </div>
  );
}
