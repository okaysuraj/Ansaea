import { BookOpen, Droplets, Moon, ShieldAlert, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';

const MOODS = [
  { type: 'happy', emoji: '😊', label: 'Happy', color: '#40916C' },
  { type: 'calm', emoji: '😌', label: 'Calm', color: '#457B9D' },
  { type: 'energetic', emoji: '⚡', label: 'Active', color: '#E09F3E' },
  { type: 'stressed', emoji: '😫', label: 'Stressed', color: '#C1292E' },
  { type: 'anxious', emoji: '🥺', label: 'Anxious', color: '#7B68AE' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: '#457B9D' },
  { type: 'angry', emoji: '😡', label: 'Angry', color: '#C1292E' },
];

const JOURNAL_PROMPTS = [
  'What are three small things you are grateful for today?',
  'Describe a moment today that made you feel peaceful or happy.',
  'What is currently heavy on your mind, and how can you release it?',
  "What did you learn about yourself through today's challenges?",
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
    setJournalEntry((prev) => (prev ? prev + '\n\n' + prompt : prompt));
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
          date: todayStr,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Your check-in has been saved.');
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
    <form onSubmit={handleSubmit} className="card card-padding" style={{ height: '100%' }}>
      <div className="flex items-center gap-3 mb-6">
        <Sparkles size={18} style={{ color: 'var(--accent)' }} />
        <h3>Daily Check-in</h3>
        <span className="text-caption" style={{ marginLeft: 'auto' }}>
          {todayStr}
        </span>
      </div>

      {message && (
        <div
          className={message.includes('saved') ? 'auth-success-banner' : 'auth-error-banner'}
          style={{ marginBottom: 'var(--space-4)' }}
        >
          {message}
        </div>
      )}

      {/* Mood Selector Grid */}
      <div className="mb-4">
        <span className="form-label">How are you feeling?</span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 1fr))',
            gap: '0.4rem',
            marginTop: 'var(--space-2)',
          }}
        >
          {MOODS.map((m) => (
            <div
              key={m.type}
              onClick={() => setSelectedMood(m.type)}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.6rem 0',
                cursor: 'pointer',
                borderColor: selectedMood === m.type ? m.color : 'var(--border)',
                background: selectedMood === m.type ? `${m.color}12` : 'var(--surface-1)',
                transition: 'all 200ms var(--ease-out)',
              }}
            >
              <span style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{m.emoji}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: selectedMood === m.type ? m.color : 'var(--text-tertiary)',
                }}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Slider */}
      <div className="form-group mb-4">
        <div className="flex justify-between mb-2">
          <span className="form-label" style={{ margin: 0 }}>
            Mood intensity
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>
            {moodRating}/10
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={moodRating}
          onChange={(e) => setMoodRating(e.target.value)}
          style={{
            width: '100%',
            height: '4px',
            background: 'var(--surface-3)',
            borderRadius: '2px',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            accentColor: 'var(--accent)',
          }}
        />
        <div className="flex justify-between text-caption mt-2" style={{ fontSize: '0.6875rem' }}>
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="bento-grid bento-grid-2 mb-4">
        {/* Sleep */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Moon size={14} style={{ color: 'var(--status-info)' }} />
            <span className="form-label" style={{ margin: 0 }}>
              Sleep
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => setSleepHours(Math.max(0, Number(e.target.value)))}
              className="form-input"
              style={{ width: '72px', padding: '0.5rem', textAlign: 'center' }}
            />
            <span className="text-caption">hours</span>
          </div>
        </div>

        {/* Water */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Droplets size={14} style={{ color: 'var(--status-success)' }} />
            <span className="form-label" style={{ margin: 0 }}>
              Hydration
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
              className="btn btn-secondary btn-icon btn-sm"
            >
              −
            </button>
            <span style={{ fontSize: '1rem', fontWeight: 600, width: '28px', textAlign: 'center' }}>
              {waterIntake}
            </span>
            <button
              type="button"
              onClick={() => setWaterIntake(waterIntake + 1)}
              className="btn btn-secondary btn-icon btn-sm"
            >
              +
            </button>
            <span className="text-caption">glasses</span>
          </div>
        </div>
      </div>

      {/* Stress Slider */}
      <div className="form-group mb-4">
        <div className="flex justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} style={{ color: 'var(--status-danger)' }} />
            <span className="form-label" style={{ margin: 0 }}>
              Stress level
            </span>
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--status-danger)' }}>
            {stressLevel}/10
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={stressLevel}
          onChange={(e) => setStressLevel(e.target.value)}
          style={{
            width: '100%',
            height: '4px',
            background: 'var(--surface-3)',
            borderRadius: '2px',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            accentColor: 'var(--status-danger)',
          }}
        />
        <div className="flex justify-between text-caption mt-2" style={{ fontSize: '0.6875rem' }}>
          <span>Calm</span>
          <span>Overwhelming</span>
        </div>
      </div>

      {/* Journal */}
      <div className="form-group mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} style={{ color: 'var(--accent)' }} />
          <span className="form-label" style={{ margin: 0 }}>
            Journal
          </span>
        </div>

        <div
          className="flex gap-2"
          style={{
            overflowX: 'auto',
            paddingBottom: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {JOURNAL_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptSelect(p)}
              className="btn btn-secondary btn-sm"
              style={{ whiteSpace: 'nowrap' }}
            >
              Prompt {idx + 1}
            </button>
          ))}
        </div>

        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="form-input"
          placeholder="Write about your day, thoughts, or anything on your mind..."
          rows="3"
          style={{ resize: 'none' }}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full">
        {isSubmitting ? 'Saving...' : 'Save check-in'}
      </button>
    </form>
  );
}
