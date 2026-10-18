import { BarChart3, Calendar, Moon, ShieldAlert, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { useApiData } from '../hooks/useApiData';

const CustomMoodTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="card card-padding-sm"
        style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
      >
        <p className="text-caption" style={{ marginBottom: '2px' }}>
          {label}
        </p>
        <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.875rem' }}>
          {payload[0].payload.mood_type.charAt(0).toUpperCase() +
            payload[0].payload.mood_type.slice(1)}
          : {payload[0].value}/10
        </p>
      </div>
    );
  }
  return null;
};

const CustomCorrelationTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="card card-padding-sm"
        style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
      >
        <p className="text-caption" style={{ marginBottom: '2px' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              color: entry.color,
              fontWeight: 700,
              fontSize: '0.875rem',
              marginBottom: '1px',
            }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { data: stats, loading: isLoading, error } = useApiData('/tracker/mood/stats');

  if (isLoading) {
    return (
      <div
        className="card card-padding flex items-center justify-center"
        style={{ minHeight: '200px' }}
      >
        <p className="text-caption">Loading analytics...</p>
      </div>
    );
  }

  if (error || !stats || stats.mood_history.length === 0) {
    return (
      <div
        className="card card-padding text-center"
        style={{ padding: 'var(--space-10) var(--space-6)' }}
      >
        <div className="empty-state-icon" style={{ margin: '0 auto var(--space-4)' }}>
          <BarChart3 size={28} />
        </div>
        <h3 style={{ marginBottom: 'var(--space-2)' }}>No data yet</h3>
        <p className="text-caption" style={{ maxWidth: '400px', margin: '0 auto' }}>
          Log your mood and sleep in the check-in panel. Your wellness trends will appear here.
        </p>
      </div>
    );
  }

  const { mood_history, average_mood, average_sleep, average_stress, sleep_vs_mood } = stats;

  return (
    <div className="flex flex-col gap-4">
      {/* Stat Cards */}
      <div className="bento-grid bento-grid-4">
        <div className="card stat-card">
          <div className="stat-icon mood">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value">{average_mood}</div>
            <div className="stat-label">Avg Mood</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon sleep">
            <Moon size={20} />
          </div>
          <div>
            <div className="stat-value">{average_sleep}h</div>
            <div className="stat-label">Avg Sleep</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon stress">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="stat-value">{average_stress}</div>
            <div className="stat-label">Avg Stress</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon habits">
            <Calendar size={20} />
          </div>
          <div>
            <div className="stat-value">{mood_history.length}</div>
            <div className="stat-label">Days Tracked</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bento-grid bento-grid-2">
        {/* Mood Chart */}
        <div className="card card-padding">
          <h4 style={{ marginBottom: 'var(--space-1)' }}>Mood Over Time</h4>
          <span className="text-caption">Your recent mood trajectory</span>

          <div style={{ width: '100%', height: 220, marginTop: 'var(--space-4)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mood_history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DD" vertical={false} />
                <XAxis dataKey="date" stroke="#9C9C96" fontSize={11} tickMargin={8} />
                <YAxis domain={[1, 10]} stroke="#9C9C96" fontSize={11} />
                <RechartsTooltip content={<CustomMoodTooltip />} />
                <Area
                  type="monotone"
                  dataKey="mood_rating"
                  stroke="#2D6A4F"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMood)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep vs Stress Chart */}
        <div className="card card-padding">
          <h4 style={{ marginBottom: 'var(--space-1)' }}>Sleep vs. Stress</h4>
          <span className="text-caption">How rest impacts your stress levels</span>

          <div style={{ width: '100%', height: 220, marginTop: 'var(--space-4)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={sleep_vs_mood}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DD" vertical={false} />
                <XAxis dataKey="date" stroke="#9C9C96" fontSize={11} tickMargin={8} />
                <YAxis yAxisId="left" domain={[0, 12]} stroke="#9C9C96" fontSize={11} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[1, 10]}
                  stroke="#9C9C96"
                  fontSize={11}
                />
                <RechartsTooltip content={<CustomCorrelationTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="sleep_hours"
                  name="Sleep (hrs)"
                  fill="#457B9D"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="stress_level"
                  name="Stress"
                  stroke="#C1292E"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
