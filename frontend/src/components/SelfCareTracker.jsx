import { Check, Heart, Sparkles, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useApiData } from '../hooks/useApiData';
import { readJson } from '../utils/api';

const DEFAULT_HABITS = [
  'Mindful Meditation (10m)',
  'Reading an Editorial / Book (15m)',
  'Digital Screen Break (1h)',
  'Hydration (8 Glasses of Water)',
  'Outdoor Walk & Sunlight Exposure',
  'CBT Gratitude Reflection',
];

// A streak may end yesterday while today's check-in is still incomplete.
function calculateStreak(logs, today) {
  const completedDates = new Set(
    logs.filter((log) => log.habits?.some((habit) => habit.completed)).map((log) => log.date),
  );
  const date = new Date(`${today}T00:00:00Z`);
  if (!completedDates.has(today)) date.setUTCDate(date.getUTCDate() - 1);
  let streak = 0;
  while (completedDates.has(date.toISOString().split('T')[0])) {
    streak++;
    date.setUTCDate(date.getUTCDate() - 1);
  }
  return streak;
}

export default function SelfCareTracker() {
  const { authenticatedFetch } = useAuth();
  const {
    data: logs,
    loading: isLoading,
    error: loadError,
    reload,
    setData,
  } = useApiData('/tracker/habits', []);
  const [saveError, setSaveError] = useState('');
  const error = saveError || loadError;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find((log) => log.date === todayStr);
  const habitsList = DEFAULT_HABITS.map((name) => ({
    name,
    completed: todayLog?.habits?.find((habit) => habit.name === name)?.completed ?? false,
  }));
  const completionRate = Math.round(
    (habitsList.filter((habit) => habit.completed).length / habitsList.length) * 100,
  );
  const streakCount = calculateStreak(logs, todayStr);

  const toggleHabit = async (habitName) => {
    const updated = habitsList.map((habit) =>
      habit.name === habitName ? { ...habit, completed: !habit.completed } : habit,
    );
    const previousLogs = logs;
    setSaveError('');
    setData([{ date: todayStr, habits: updated }, ...logs.filter((log) => log.date !== todayStr)]);
    try {
      await readJson(
        await authenticatedFetch('/tracker/habits', {
          method: 'POST',
          body: JSON.stringify({ date: todayStr, habits: updated }),
        }),
      );
      await reload();
    } catch (error) {
      setData(previousLogs);
      setSaveError(error.message);
    }
  };

  return (
    <div className="card card-padding" style={{ height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)',
        }}
      >
        <div className="stat-icon" style={{ width: '36px', height: '36px' }}>
          <Heart size={18} />
        </div>
        <div>
          <h3 style={{ margin: 0 }}>Daily Mindful Habits</h3>
          <span className="text-caption">
            Consistent routine behaviors build neurobiological resilience
          </span>
        </div>
      </div>

      {error && (
        <div
          className="badge badge-danger"
          style={{
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            margin: 'var(--space-3) 0',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {error}
        </div>
      )}

      {/* Streak Dashboard Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-4)',
          margin: 'var(--space-5) 0',
        }}
      >
        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">Daily Streak</span>
            <span className="stat-icon">
              <Trophy size={16} />
            </span>
          </div>
          <div className="stat-value">
            {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
          </div>
          <div className="stat-change" style={{ color: 'var(--accent)' }}>
            Active streak unbroken
          </div>
        </div>

        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">Today's Progress</span>
            <span className="stat-icon">
              <Sparkles size={16} />
            </span>
          </div>
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-change" style={{ color: 'var(--status-success)' }}>
            {habitsList.filter((h) => h.completed).length} of {habitsList.length} completed
          </div>
        </div>
      </div>

      {/* Habits Checklist */}
      {isLoading ? (
        <div className="empty-state">
          <div className="empty-state-title">Synchronizing habit journal...</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {habitsList.map((habit) => (
            <div
              key={habit.name}
              onClick={() => toggleHabit(habit.name)}
              disabled={isLoading}
              className="habit-row"
              style={{
                cursor: 'pointer',
                border: habit.completed ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: habit.completed ? 'var(--accent-subtle)' : 'var(--surface-0)',
              }}
            >
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: habit.completed ? '600' : '500',
                  textDecoration: habit.completed ? 'line-through' : 'none',
                  color: habit.completed ? 'var(--accent-text)' : 'var(--text-primary)',
                }}
              >
                {habit.name}
              </span>
              <div className={`habit-checkbox ${habit.completed ? 'checked' : ''}`}>
                {habit.completed && <Check size={14} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
