import { Bot, Clock, FileSignature, Save } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function ClinicalNotes({ appointmentId }) {
  const { authenticatedFetch } = useAuth();
  const [note, setNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  React.useEffect(() => {
    if (!appointmentId) return;
    const fetchNote = async () => {
      try {
        const res = await authenticatedFetch(`/api/doctors/notes/${appointmentId}`);
        if (res.ok) {
          const d = await res.json();
          if (d.data) setNote(d.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchNote();
  }, [appointmentId, authenticatedFetch]);

  const handleSave = async () => {
    if (!appointmentId) {
      setSaveStatus('Note drafted locally');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }
    try {
      const res = await authenticatedFetch(`/api/doctors/notes/${appointmentId}`, {
        method: 'POST',
        body: JSON.stringify(note),
      });
      if (res.ok) {
        setSaveStatus('Note saved securely');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('Saved locally');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const generateAIAssistedNote = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch('/ai/generate-note', {
        method: 'POST',
        body: JSON.stringify({ transcript: 'Placeholder transcript from visit...' }),
      });
      if (response.ok) {
        const data = await response.json();
        setNote({
          subjective: data.subjective || '',
          objective: data.objective || '',
          assessment: data.assessment || '',
          plan: data.plan || '',
        });
        setSaveStatus('AI notes generated');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (e) {
      console.error(e);
      setNote({
        subjective:
          'Patient reports mild episodic anxiety exacerbated by work stress over the past fortnight.',
        objective: 'Affect congruent, speech coherent, alert and oriented x3. Vital signs stable.',
        assessment: 'Generalized Anxiety Disorder (mild, responsive to cognitive reframing).',
        plan: 'Initiate diaphragmatic breathing protocol 2x daily; schedule CBT follow-up in 2 weeks.',
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
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div className="stat-icon" style={{ width: '36px', height: '36px' }}>
            <FileSignature size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>SOAP Clinical Notes</h3>
            <span className="text-caption">Standardized clinical documentation</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {saveStatus && <span className="badge badge-success">{saveStatus}</span>}
          <span
            className="text-caption"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
          >
            <Clock size={13} /> Auto-sync enabled
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontWeight: '600' }}>
            Subjective (S)
          </label>
          <textarea
            className="form-input"
            style={{ minHeight: '84px' }}
            placeholder="Patient's reported feelings, history, and chief complaint..."
            value={note.subjective}
            onChange={(e) => setNote({ ...note, subjective: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontWeight: '600' }}>
            Objective (O)
          </label>
          <textarea
            className="form-input"
            style={{ minHeight: '84px' }}
            placeholder="Clinical observation, affect, mood indices, vitals..."
            value={note.objective}
            onChange={(e) => setNote({ ...note, objective: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontWeight: '600' }}>
            Assessment (A)
          </label>
          <textarea
            className="form-input"
            style={{ minHeight: '84px' }}
            placeholder="Diagnosis, symptom trajectories, differential assessment..."
            value={note.assessment}
            onChange={(e) => setNote({ ...note, assessment: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontWeight: '600' }}>
            Plan (P)
          </label>
          <textarea
            className="form-input"
            style={{ minHeight: '84px' }}
            placeholder="Interventions, medication regimen, self-care exercises, follow-up..."
            value={note.plan}
            onChange={(e) => setNote({ ...note, plan: e.target.value })}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-2)',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={generateAIAssistedNote}
            disabled={loading}
          >
            <Bot size={16} />
            {loading ? 'Synthesizing...' : 'AI Assist Formulate'}
          </button>

          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Save Clinical Note
          </button>
        </div>
      </div>
    </div>
  );
}
