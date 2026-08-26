import React, { useState } from 'react';
import { Wind, BrainCircuit } from 'lucide-react';
import MoodSelector from '../../../components/MoodSelector';
import SelfCareTracker from '../../../components/SelfCareTracker';
import BreathingExercise from '../../../components/BreathingExercise';
import CBTDiary from '../../../components/CBTDiary';

export default function MentalHealthTrackers() {
  const [activeTab, setActiveTab] = useState('breathing');

  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Mental Health Trackers</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <MoodSelector onLogSuccess={() => {}} />
        <SelfCareTracker />
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('breathing')}
            className="glass-panel"
            style={{
              padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '600',
              borderColor: activeTab === 'breathing' ? 'var(--color-success)' : 'transparent',
              color: activeTab === 'breathing' ? 'var(--color-success)' : 'var(--text-muted)',
              background: activeTab === 'breathing' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <Wind size={16} /> Ambient Breathing
          </button>
          <button
            onClick={() => setActiveTab('cbt')}
            className="glass-panel"
            style={{
              padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '600',
              borderColor: activeTab === 'cbt' ? 'var(--color-secondary)' : 'transparent',
              color: activeTab === 'cbt' ? 'var(--color-secondary)' : 'var(--text-muted)',
              background: activeTab === 'cbt' ? 'rgba(168, 85, 247, 0.05)' : 'rgba(255,255,255,0.01)',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <BrainCircuit size={16} /> Cognitive Reframer
          </button>
        </div>
        {activeTab === 'breathing' ? <BreathingExercise /> : <CBTDiary />}
      </div>
    </div>
  );
}
