import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MoodSelector from '../../../components/MoodSelector';

export default function DailyMoodCheckIn() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: '680px',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/patient/mental-health')}
        >
          <ArrowLeft size={14} /> Back to Mental Health
        </button>
        <div>
          <h1 style={{ margin: 0 }}>Daily Mood Check-In</h1>
          <span className="text-caption">
            Log affective valency, emotional correlates, and somatic context
          </span>
        </div>
      </div>

      <MoodSelector onMoodLogged={() => navigate('/patient/mental-health')} />
    </div>
  );
}
