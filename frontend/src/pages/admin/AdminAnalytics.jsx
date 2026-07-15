import React from 'react';
import { Activity, Server, Users } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">System Analytics</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <Users size={32} style={{ margin: '0 auto 1rem', color: 'var(--color-primary)' }} />
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>14,203</div>
          <div style={{ color: 'var(--text-muted)' }}>Active Users</div>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <Activity size={32} style={{ margin: '0 auto 1rem', color: 'var(--color-success)' }} />
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>99.9%</div>
          <div style={{ color: 'var(--text-muted)' }}>Uptime (30d)</div>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <Server size={32} style={{ margin: '0 auto 1rem', color: 'var(--color-warning)' }} />
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>42ms</div>
          <div style={{ color: 'var(--text-muted)' }}>Avg Latency</div>
        </div>
      </div>
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        System Health Logs and detailed charts will render here.
      </div>
    </div>
  );
}
