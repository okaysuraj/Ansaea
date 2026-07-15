import React from 'react';
import { Settings, Shield, Bell, CreditCard } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Platform Settings</h1>
      </div>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="habit-row" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Shield size={18} /> Role Permissions Setup</div>
            <Settings size={18} color="var(--text-muted)" />
          </div>
          <div className="habit-row" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Bell size={18} /> Global Notification Rules</div>
            <Settings size={18} color="var(--text-muted)" />
          </div>
          <div className="habit-row" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CreditCard size={18} /> Payment Gateway Config</div>
            <Settings size={18} color="var(--text-muted)" />
          </div>
        </div>
      </div>
    </div>
  );
}
