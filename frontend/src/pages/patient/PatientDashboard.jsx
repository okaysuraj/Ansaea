import { UserCheck } from 'lucide-react';
import { useState } from 'react';
import Analytics from '../../components/Analytics';
import MedicalRecords from '../../components/MedicalRecords';
import MoodSelector from '../../components/MoodSelector';
import SymptomChecker from '../../components/SymptomChecker';
import VitalsTracker from '../../components/VitalsTracker';
import { useAuth } from '../../context/useAuth';

function DashboardView() {
  const [refreshStats, setRefreshStats] = useState(0);
  return (
    <div className="flex flex-col gap-6">
      <div className="bento-grid bento-grid-2">
        <MoodSelector onLogSuccess={() => setRefreshStats((prev) => prev + 1)} />
        <Analytics key={refreshStats} />
      </div>
      <div className="bento-grid bento-grid-2">
        <VitalsTracker />
        <div className="flex flex-col gap-4">
          <SymptomChecker />
          <MedicalRecords />
        </div>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, {user?.username}</h1>
          <p className="dashboard-subtitle">Here is your health overview</p>
        </div>
        <div
          className="badge badge-success flex items-center gap-2"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
        >
          <UserCheck size={14} />
          Synced
        </div>
      </div>
      <DashboardView />
    </div>
  );
}
