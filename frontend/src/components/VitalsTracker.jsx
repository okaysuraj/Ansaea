import React, { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Droplet, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VitalsTracker() {
  const { authenticatedFetch } = useAuth();
  const [latestVitals, setLatestVitals] = useState(null);

  const fetchVitals = async () => {
    try {
      const res = await authenticatedFetch('/api/tracker/vitals');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setLatestVitals(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [authenticatedFetch]);

  const handleLogVitals = async () => {
    try {
      await authenticatedFetch('/api/tracker/vitals', {
        method: 'POST',
        body: JSON.stringify({
          blood_pressure: '120/80',
          heart_rate: Math.floor(Math.random() * (90 - 60 + 1)) + 60,
          spo2: 98,
          temperature: 98.6
        })
      });
      fetchVitals(); // Refresh
    } catch (e) {
      console.error(e);
    }
  };

  const displayVitals = [
    { id: 1, type: 'Blood Pressure', value: latestVitals?.blood_pressure || '--', unit: 'mmHg', icon: <Heart className="text-red-500" /> },
    { id: 2, type: 'Heart Rate', value: latestVitals?.heart_rate || '--', unit: 'bpm', icon: <Activity className="text-primary" /> },
    { id: 3, type: 'SpO2', value: latestVitals?.spo2 || '--', unit: '%', icon: <Droplet className="text-blue-500" /> },
    { id: 4, type: 'Temperature', value: latestVitals?.temperature || '--', unit: '°F', icon: <Thermometer className="text-orange-500" /> },
  ];

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Vitals Tracking</h3>
        <button onClick={handleLogVitals} className="auth-submit-btn" style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Plus size={16} /> Log Demo Vitals
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {displayVitals.map(vital => (
          <div key={vital.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '50%' }}>
              {vital.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{vital.type}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{vital.value} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{vital.unit}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
