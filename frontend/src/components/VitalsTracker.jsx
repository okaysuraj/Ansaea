import React, { useState } from 'react';
import { Activity, Heart, Thermometer, Droplet, Plus } from 'lucide-react';

export default function VitalsTracker() {
  const [vitals, setVitals] = useState([
    { id: 1, type: 'Blood Pressure', value: '120/80', unit: 'mmHg', date: 'Today, 8:00 AM', icon: <Heart className="text-red-500" /> },
    { id: 2, type: 'Heart Rate', value: '72', unit: 'bpm', date: 'Today, 8:00 AM', icon: <Activity className="text-primary" /> },
    { id: 3, type: 'SpO2', value: '98', unit: '%', date: 'Today, 8:00 AM', icon: <Droplet className="text-blue-500" /> },
    { id: 4, type: 'Temperature', value: '98.6', unit: '°F', date: 'Yesterday, 8:00 PM', icon: <Thermometer className="text-orange-500" /> },
  ]);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Vitals Tracking</h3>
        <button className="auth-submit-btn" style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Plus size={16} /> Log Vitals
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {vitals.map(vital => (
          <div key={vital.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '50%' }}>
              {vital.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{vital.type}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{vital.value} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{vital.unit}</span></div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{vital.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
