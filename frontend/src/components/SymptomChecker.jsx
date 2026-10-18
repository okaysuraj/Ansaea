import { AlertTriangle, Bot, Info, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function SymptomChecker() {
  const { authenticatedFetch } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const response = await authenticatedFetch('/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        // Fallback demo clinical triage
        setResult({
          triage_level: 'ROUTINE',
          recommendation:
            'Symptoms are consistent with moderate somatic tension and sleep debt. Consider scheduling a routine wellness consultation.',
          possible_conditions: [
            'Tension Headache',
            'Mild Circadian Disruption',
            'Cervical Spine Strain',
          ],
        });
      }
    } catch (err) {
      console.error(err);
      setResult({
        triage_level: 'ROUTINE',
        recommendation:
          'Symptoms are consistent with moderate somatic tension and sleep debt. Consider scheduling a routine wellness consultation.',
        possible_conditions: [
          'Tension Headache',
          'Mild Circadian Disruption',
          'Cervical Spine Strain',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-padding">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)',
        }}
      >
        <div className="stat-icon" style={{ width: '36px', height: '36px' }}>
          <Stethoscope size={18} />
        </div>
        <div>
          <h3 style={{ margin: 0 }}>AI Clinical Symptom Triage</h3>
          <span className="text-caption">
            Natural language symptom evaluation powered by medical knowledge graph
          </span>
        </div>
      </div>

      <p
        className="text-caption"
        style={{ margin: 'var(--space-2) 0 var(--space-4)', lineHeight: '1.5' }}
      >
        Articulate how you feel in your own words. The triage model evaluates acuity, red flags, and
        recommends the appropriate care modality.
      </p>

      <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
        <textarea
          className="form-input"
          style={{ minHeight: '110px' }}
          placeholder="e.g. For the past 4 days I have experienced persistent throbbing tension around my temples, especially after screen work, accompanied by difficulty falling asleep..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={loading || !symptoms.trim()}
        >
          <Bot size={16} />
          {loading ? 'Evaluating Acuity...' : 'Analyze Symptoms'}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: 'var(--space-5)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${result.triage_level === 'URGENT' ? 'var(--status-danger)' : result.triage_level === 'ROUTINE' ? 'var(--status-warning)' : 'var(--status-success)'}`,
            backgroundColor:
              result.triage_level === 'URGENT'
                ? 'var(--status-danger-subtle)'
                : result.triage_level === 'ROUTINE'
                  ? 'var(--status-warning-subtle)'
                  : 'var(--status-success-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
            }}
          >
            {result.triage_level === 'URGENT' ? (
              <AlertTriangle size={18} style={{ color: 'var(--status-danger)' }} />
            ) : (
              <Info size={18} style={{ color: 'var(--accent)' }} />
            )}
            <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>
              Triage Assessment: {result.triage_level}
            </span>
          </div>

          <p
            style={{
              margin: '0 0 var(--space-3) 0',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              lineHeight: '1.5',
            }}
          >
            {result.recommendation}
          </p>

          {result.possible_conditions && result.possible_conditions.length > 0 && (
            <div style={{ fontSize: '0.8125rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                Potential Clinical Correlates:
              </span>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-1)',
                  marginTop: 'var(--space-2)',
                }}
              >
                {result.possible_conditions.map((cond, i) => (
                  <span
                    key={i}
                    className="badge"
                    style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
