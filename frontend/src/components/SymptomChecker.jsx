import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, AlertTriangle, Info, Bot } from 'lucide-react';

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
        body: JSON.stringify({ symptoms })
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Stethoscope size={20} className="text-primary" /> Smart Symptom Checker
        </h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Describe how you are feeling in your own words. Our AI will analyze your symptoms and recommend the best next steps.
      </p>

      <textarea 
        className="auth-input"
        style={{ width: '100%', minHeight: '100px', resize: 'vertical', marginBottom: '1rem' }}
        placeholder="e.g. I've had a headache for 3 days and I feel slightly nauseous in the mornings..."
        value={symptoms}
        onChange={e => setSymptoms(e.target.value)}
      />

      <button className="auth-submit-btn" onClick={handleAnalyze} disabled={loading || !symptoms.trim()} style={{ width: 'auto', padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {loading ? <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span> : <Bot size={16} />}
        Analyze Symptoms
      </button>

      {result && (
        <div style={{ marginTop: '1.5rem', padding: '1.25rem', borderRadius: '8px', border: `1px solid ${result.triage_level === 'URGENT' ? 'var(--color-danger)' : result.triage_level === 'ROUTINE' ? 'var(--color-warning)' : 'var(--color-success)'}`, backgroundColor: 'var(--surface-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: result.triage_level === 'URGENT' ? 'var(--color-danger)' : result.triage_level === 'ROUTINE' ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: 'bold' }}>
            {result.triage_level === 'URGENT' ? <AlertTriangle size={18} /> : <Info size={18} />}
            Triage Level: {result.triage_level}
          </div>
          <p style={{ margin: '0 0 1rem 0' }}>{result.recommendation}</p>
          
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Possible Indications:</span>
            <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
              {result.possible_conditions.map((cond, i) => (
                <li key={i}>{cond}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
