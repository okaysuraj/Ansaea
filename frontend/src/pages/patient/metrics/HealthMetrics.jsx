import Analytics from '../../../components/Analytics';
import VitalsTracker from '../../../components/VitalsTracker';

export default function HealthMetrics() {
  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Health Metrics & Vitals</h1>
      </div>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <Analytics />
        <VitalsTracker />
      </div>
    </div>
  );
}
