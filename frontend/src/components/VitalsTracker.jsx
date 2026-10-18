import { Activity, Droplets, Heart, Plus, Thermometer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';

export default function VitalsTracker() {
  const navigate = useNavigate();
  const { data: vitals, error } = useApiData('/tracker/vitals', []);
  const latestVitals = vitals[0];

  const displayVitals = [
    {
      id: 1,
      type: 'Blood Pressure',
      value: latestVitals?.blood_pressure ?? '?',
      unit: 'mmHg',
      icon: <Heart size={16} />,
    },
    {
      id: 2,
      type: 'Resting Heart Rate',
      value: latestVitals?.heart_rate ?? '?',
      unit: 'bpm',
      icon: <Activity size={16} />,
    },
    {
      id: 3,
      type: 'Oxygen Saturation',
      value: latestVitals?.spo2 ?? '?',
      unit: '%',
      icon: <Droplets size={16} />,
    },
    {
      id: 4,
      type: 'Body Temperature',
      value: latestVitals?.temperature ?? '?',
      unit: '°F',
      icon: <Thermometer size={16} />,
    },
  ];

  return (
    <div className="card card-padding">
      {error && <p role="alert">{error}</p>}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Biometric Vitals Stream</h3>
          <span className="text-caption">Continuous physiological telemetry</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/patient/health-metrics')}
          className="btn btn-secondary btn-sm"
        >
          <Plus size={14} /> Log Vitals
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {displayVitals.map((vital) => (
          <div key={vital.id} className="stat-card" style={{ padding: 'var(--space-4)' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <span className="stat-label">{vital.type}</span>
              <span className="stat-icon" style={{ width: '28px', height: '28px' }}>
                {vital.icon}
              </span>
            </div>
            <div
              className="stat-value text-mono"
              style={{ fontSize: '1.5rem', marginTop: 'var(--space-2)' }}
            >
              {vital.value}{' '}
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-tertiary)',
                  fontWeight: 'normal',
                }}
              >
                {vital.unit}
              </span>
            </div>
            <div
              className="stat-change"
              style={{ color: 'var(--status-success)', marginTop: 'var(--space-1)' }}
            >
              Normal range
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
