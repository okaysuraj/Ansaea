import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Moon, ShieldAlert, Calendar } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ComposedChart, Bar, Line, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function Analytics() {
  const { authenticatedFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authenticatedFetch('/tracker/mood/stats');
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      } else {
        setError('Could not fetch analytics statistics');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Calculating neurological statistics...</div>;
  }

  if (error || !stats || stats.mood_history.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <BarChart3 size={48} style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }} />
        <h3>Awaiting Neuro-Data Logs</h3>
        <p style={{ maxWidth: '440px', margin: '0.5rem auto 0', fontSize: '0.9rem' }}>
          Please log your mood and sleep in the check-in panel. Once you save at least one check-in, detailed wellness trends will populate here!
        </p>
      </div>
    );
  }

  const { mood_history, average_mood, average_sleep, average_stress, sleep_vs_mood } = stats;

  const CustomMoodTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '10px', border: '1px solid var(--border-glass)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>{label}</p>
          <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
            {payload[0].payload.mood_type.charAt(0).toUpperCase() + payload[0].payload.mood_type.slice(1)}: {payload[0].value} / 10
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomCorrelationTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '10px', border: '1px solid var(--border-glass)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2px' }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Level Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon mood">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value text-primary">{average_mood}</div>
            <div className="stat-label">Avg Mood Score</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon sleep">
            <Moon size={24} />
          </div>
          <div>
            <div className="stat-value text-primary">{average_sleep}h</div>
            <div className="stat-label">Avg Sleep Duration</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon stress">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="stat-value text-primary">{average_stress}</div>
            <div className="stat-label">Avg Stress Index</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon habits">
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-value text-primary">{mood_history.length}</div>
            <div className="stat-label">Days Tracked</div>
          </div>
        </div>

      </div>

      {/* Grid of Interactive Charts via Recharts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
        
        {/* Mood Area Chart */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Mood Trajectory Over Time</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Advanced visualization of mental vibrancy</span>
          
          <div style={{ width: '100%', height: 250, marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mood_history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickMargin={10} />
                <YAxis domain={[1, 10]} stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <RechartsTooltip content={<CustomMoodTooltip />} />
                <Area type="monotone" dataKey="mood_rating" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep vs Stress Correlation Chart */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Sleep vs. Stress Correlation</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Analysis of rest impacts on stress indices</span>
          
          <div style={{ width: '100%', height: 250, marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={sleep_vs_mood} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickMargin={10} />
                <YAxis yAxisId="left" domain={[0, 12]} stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" domain={[1, 10]} stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <RechartsTooltip content={<CustomCorrelationTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="sleep_hours" name="Sleep (Hours)" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="stress_level" name="Stress (1-10)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
