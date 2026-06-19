import React, { useState } from 'react';
import { Smile, Moon, Droplets, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MOODS = [
  { type: 'happy', emoji: '😊', label: 'Happy', color: '#10b981' },
  { type: 'calm', emoji: '😌', label: 'Calm', color: '#0ea5e9' },
  { type: 'energetic', emoji: '⚡', label: 'Active', color: '#f59e0b' },
  { type: 'stressed', emoji: '😫', label: 'Stressed', color: '#ec4899' },
  { type: 'anxious', emoji: '🥺', label: 'Anxious', color: '#8b5cf6' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: '#3b82f6' },
  { type: 'angry', emoji: '😡', label: 'Angry', color: '#ef4444' }
];

const JOURNAL_PROMPTS = [
  "What are three small things you are grateful for today?",
  "Describe a moment today that made you feel peaceful or happy.",
  "What is currently heavy on your mind, and how can you release it?",
  "What did you learn about yourself through today's challenges?"
];

export default function MoodSelector({ onLogSuccess }) {
  const { authenticatedFetch } = useAuth();
  const [selectedMood, setSelectedMood] = useState('calm');
  const [moodRating, setMoodRating] = useState(7);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [waterIntake, setWaterIntake] = useState(4);
  const [stressLevel, setStressLevel] = useState(4);
  const [journalEntry, setJournalEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handlePromptSelect = (prompt) => {
    setJournalEntry((prev) => prev ? prev + '\n\n' + prompt : prompt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await authenticatedFetch('/tracker/mood', {
        method: 'POST',
        body: JSON.stringify({
          mood_rating: Number(moodRating),
          mood_type: selectedMood,
          journal_entry: journalEntry,
          sleep_hours: Number(sleepHours),
          water_intake: Number(waterIntake),
          stress_level: Number(stressLevel),
          date: todayStr
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('Your mind log has been captured securely.');
        if (onLogSuccess) onLogSuccess();
      } else {
        setMessage(data.detail || 'Failed to submit logs');
      }
    } catch (err) {
      setMessage(err.message || 'An error occurred connecting to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Sparkles style={{ color: 'var(--color-primary)' }} />
        <h3>Daily Mind Check-in</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{todayStr}</span>
      </div>

      {message && (
        <div
          className="glass-panel"
          style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderColor: message.includes('captured') ? 'var(--color-success)' : 'var(--color-danger)',
            background: message.includes('captured') ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}
        >
          {message}
        </div>
      )}

      {/* Mood Selector Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <span className="form-label">How is your core energy right now?</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
          {MOODS.map((m) => (
            <div
              key={m.type}
              onClick={() => setSelectedMood(m.type)}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 0',
                cursor: 'pointer',
                borderColor: selectedMood === m.type ? m.color : 'transparent',
                background: selectedMood === m.type ? `${m.color}15` : 'rgba(255, 255, 255, 0.01)',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>{m.emoji}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '500', color: selectedMood === m.type ? m.color : 'var(--text-muted)' }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Slider */}
      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span className="form-label" style={{ margin: 0 }}>Mood Intensity</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-primary)' }}>{moodRating} / 10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={moodRating}
          onChange={(e) => setMoodRating(e.target.value)}
          style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', outline: 'none', appearance: 'none', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
          <span>Flat / Heavy</span>
          <span>Radiant / Peaceful</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Sleep Counter */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Moon size={16} style={{ color: 'var(--color-info)' }} />
            <span className="form-label" style={{ margin: 0 }}>Sleep Log</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => setSleepHours(Math.max(0, Number(e.target.value)))}
              className="form-input"
              style={{ width: '80px', padding: '0.5rem' }}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hours</span>
          </div>
        </div>

        {/* Water Counter */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Droplets size={16} style={{ color: 'var(--color-success)' }} />
            <span className="form-label" style={{ margin: 0 }}>Hydration</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
              className="form-input"
              style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              -
            </button>
            <span style={{ fontSize: '1rem', fontWeight: '600', width: '30px', textAlign: 'center' }}>{waterIntake}</span>
            <button
              type="button"
              onClick={() => setWaterIntake(waterIntake + 1)}
              className="form-input"
              style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              +
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>Glasses</span>
          </div>
        </div>
      </div>

      {/* Stress Slider */}
      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={16} style={{ color: 'var(--color-danger)' }} />
            <span className="form-label" style={{ margin: 0 }}>Stress Load</span>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-danger)' }}>{stressLevel} / 10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={stressLevel}
          onChange={(e) => setStressLevel(e.target.value)}
          style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', outline: 'none', appearance: 'none', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
          <span>Tranquil</span>
          <span>Overwhelming</span>
        </div>
      </div>

      {/* Journal Area */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <BookOpen size={16} style={{ color: 'var(--color-secondary)' }} />
          <span className="form-label" style={{ margin: 0 }}>Mind Flow Journal</span>
        </div>
        
        {/* Prompts list */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          {JOURNAL_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptSelect(p)}
              className="glass-panel"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)'
              }}
            >
              Prompt {idx + 1}
            </button>
          ))}
        </div>

        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="form-input"
          placeholder="Unload any thoughts, feelings, or obstacles you've navigated today. Writing them down clears subconscious static..."
          rows="4"
          style={{ resize: 'none' }}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-submit" style={{ marginTop: 0 }}>
        {isSubmitting ? 'Securing Check-in...' : 'Lock in Today\'s Ansaea'}
      </button>
    </form>
  );
}
