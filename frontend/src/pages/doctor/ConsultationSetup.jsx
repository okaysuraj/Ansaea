import React from 'react';
import { Video, Settings } from 'lucide-react';

export default function ConsultationSetup() {
  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Consultation Setup</h1>
      </div>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Telemedicine Configuration</h3>
            <p style={{ color: 'var(--text-muted)' }}>Configure your camera, microphone, and waiting room settings.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="habit-row" style={{ cursor: 'pointer' }}>
            <span>Test Camera & Microphone</span>
            <Settings size={18} />
          </div>
          <div className="habit-row" style={{ cursor: 'pointer' }}>
            <span>Waiting Room Preferences</span>
            <Settings size={18} />
          </div>
          <div className="habit-row" style={{ cursor: 'pointer' }}>
            <span>Digital Prescription Template</span>
            <Settings size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
