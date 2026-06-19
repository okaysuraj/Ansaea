import React, { useState, useEffect } from 'react';
import { CheckSquare, Heart, RefreshCw, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_HABITS = [
  "Mindful Meditation (10m)",
  "Reading a Book (15m)",
  "Digital Screen Break (1h)",
  "Drinking 8 Glasses of Water",
  "Outdoor Walk / Stretch",
  "CBT Gratitude Entry"
];

export default function SelfCareTracker() {
  const { authenticatedFetch } = useAuth();
  const [habitsList, setHabitsList] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchTodayHabits = async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Fetch habits logs
      const response = await authenticatedFetch('/tracker/habits');
      const data = await response.json();
      
      if (response.ok) {
        // Find today's entry
        const todayLog = data.find(log => log.date === todayStr);
        
        let loadedHabits = DEFAULT_HABITS.map(h => ({ name: h, completed: false }));
        
        if (todayLog) {
          // Merge checked status
          loadedHabits = DEFAULT_HABITS.map(h => {
            const found = todayLog.habits.find(th => th.name === h);
            return { name: h, completed: found ? found.completed : false };
          });
        }
        
        setHabitsList(loadedHabits);
        
        // Calculate streak
        calculateStreak(data);
      } else {
        setError('Could not download self-care logs');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with database');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (logs) => {
    if (!logs || logs.length === 0) {
      setStreakCount(0);
      return;
    }
    
    // Sort logs by date descending
    const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    let checkDate = new Date();
    
    // To check consecutive days starting from today or yesterday
    for (let i = 0; i < sorted.length; i++) {
      const logDateStr = sorted[i].date;
      const logDate = new Date(logDateStr);
      
      // Calculate diff in days between checkDate and logDate
      const diffTime = Math.abs(checkDate - logDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Count habits completed in this log
      const completedCount = sorted[i].habits.filter(h => h.completed).length;
      
      if (completedCount > 0) {
        // Active habit completions
        streak++;
        checkDate = logDate;
      } else {
        break; // Streak broken
      }
    }
    setStreakCount(streak);
  };

  useEffect(() => {
    fetchTodayHabits();
  }, []);

  useEffect(() => {
    if (habitsList.length === 0) return;
    const completed = habitsList.filter(h => h.completed).length;
    const rate = Math.round((completed / habitsList.length) * 100);
    setCompletionRate(rate);
  }, [habitsList]);

  const toggleHabit = async (habitName) => {
    const updated = habitsList.map(h => {
      if (h.name === habitName) {
        return { ...h, completed: !h.completed };
      }
      return h;
    });
    
    setHabitsList(updated);

    try {
      await authenticatedFetch('/tracker/habits', {
        method: 'POST',
        body: JSON.stringify({
          date: todayStr,
          habits: updated
        })
      });
      
      // Re-fetch to compute streaks updated in the backend log histories
      const response = await authenticatedFetch('/tracker/habits');
      const data = await response.json();
      if (response.ok) {
        calculateStreak(data);
      }
    } catch (err) {
      console.log('Failed to save habit state:', err);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Heart style={{ color: 'var(--color-secondary)' }} />
        <h3>Daily Self-Care Tracker</h3>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Self-care isn't a luxury; it's a practice. Check off your daily mindfulness accomplishments.
      </p>

      {error && (
        <div className="glass-panel" style={{ padding: '0.75rem', marginBottom: '1rem', borderColor: 'var(--color-danger)', fontSize: '0.85rem', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      {/* Streak Dashboard Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(168, 85, 247, 0.04)' }}>
          <Trophy style={{ color: 'var(--color-secondary)' }} size={32} />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--color-secondary)' }}>
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Continuous Streak</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(16, 185, 129, 0.04)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--color-success)' }}>
            {completionRate}%
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Today's Goal</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress Rate</div>
          </div>
        </div>
      </div>

      {/* Habits Checklist Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Syncing habits...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {habitsList.map((habit) => (
            <div
              key={habit.name}
              onClick={() => toggleHabit(habit.name)}
              className="habit-row"
              style={{
                cursor: 'pointer',
                borderColor: habit.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-glass)',
                background: habit.completed ? 'rgba(16, 185, 129, 0.03)' : 'rgba(255, 255, 255, 0.01)'
              }}
            >
              <span style={{
                fontSize: '0.95rem',
                fontWeight: '500',
                textDecoration: habit.completed ? 'line-through' : 'none',
                color: habit.completed ? 'var(--text-dim)' : 'var(--text-primary)'
              }}>
                {habit.name}
              </span>
              <div className={`habit-checkbox ${habit.completed ? 'checked' : ''}`}>
                {habit.completed && <CheckSquare size={16} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
