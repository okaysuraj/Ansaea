import { BrainCircuit, Wind } from 'lucide-react';
import { useState } from 'react';
import BreathingExercise from '../../../components/BreathingExercise';
import CBTDiary from '../../../components/CBTDiary';
import MoodSelector from '../../../components/MoodSelector';
import SelfCareTracker from '../../../components/SelfCareTracker';

export default function MentalHealthTrackers() {
  const [activeTab, setActiveTab] = useState('breathing');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>
          Mind & Neurological Wellness
        </span>
        <h1>Mental Health Trackers</h1>
        <p style={{ marginTop: 'var(--space-1)' }}>
          Integrated self-monitoring tools for somatic regulation and cognitive reframing.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        <MoodSelector onLogSuccess={() => {}} />
        <SelfCareTracker />
      </div>

      <div className="card card-padding">
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('breathing')}
            className={`btn ${activeTab === 'breathing' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Wind size={15} /> Guided Breathing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cbt')}
            className={`btn ${activeTab === 'cbt' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BrainCircuit size={15} /> Cognitive Reframer
          </button>
        </div>

        {activeTab === 'breathing' ? <BreathingExercise /> : <CBTDiary />}
      </div>
    </div>
  );
}
