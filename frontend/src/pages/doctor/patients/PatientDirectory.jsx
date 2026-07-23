import React from 'react';
import { Users, Search } from 'lucide-react';

export default function PatientDirectory() {
  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Patient Directory</h1>
      </div>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-dim)' }} />
            <input type="text" className="form-input" placeholder="Search patients by name or ID..." style={{ paddingLeft: '3rem' }} />
          </div>
        </div>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <p>You have no active patients in your directory.</p>
        </div>
      </div>
    </div>
  );
}
