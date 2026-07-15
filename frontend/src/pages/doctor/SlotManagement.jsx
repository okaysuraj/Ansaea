import React from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';

export default function SlotManagement() {
  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Schedule & Slots</h1>
      </div>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3>Manage Availability</h3>
          <button className="btn-primary-auth" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
            <Plus size={18} /> Add Slots
          </button>
        </div>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Calendar size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <p>No slots configured for this week. Click 'Add Slots' to define your working hours.</p>
        </div>
      </div>
    </div>
  );
}
