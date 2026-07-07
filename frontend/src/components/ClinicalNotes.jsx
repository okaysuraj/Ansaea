import React, { useState } from 'react';
import { FileSignature, Save, Clock, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ClinicalNotes({ patientId, appointmentId }) {
  const { authenticatedFetch } = useAuth();
  const [note, setNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    // Save logic
    console.log('Saved note:', note);
  };

  const generateAIAssistedNote = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch('/ai/generate-note', {
        method: 'POST',
        body: JSON.stringify({ transcript: "Placeholder transcript from visit..." })
      });
      if (response.ok) {
        const data = await response.json();
        setNote({
          subjective: data.subjective,
          objective: data.objective,
          assessment: data.assessment,
          plan: data.plan
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileSignature size={20} className="text-primary" /> SOAP Notes
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={14} /> Last saved 2m ago
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.9rem' }}>Subjective</label>
          <textarea 
            className="auth-input" 
            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
            placeholder="Patient's chief complaint and history..."
            value={note.subjective}
            onChange={(e) => setNote({...note, subjective: e.target.value})}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.9rem' }}>Objective</label>
          <textarea 
            className="auth-input" 
            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
            placeholder="Physical exam findings, vitals..."
            value={note.objective}
            onChange={(e) => setNote({...note, objective: e.target.value})}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.9rem' }}>Assessment</label>
          <textarea 
            className="auth-input" 
            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
            placeholder="Diagnosis, differential diagnosis..."
            value={note.assessment}
            onChange={(e) => setNote({...note, assessment: e.target.value})}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.9rem' }}>Plan</label>
          <textarea 
            className="auth-input" 
            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
            placeholder="Treatment plan, follow-up, medications..."
            value={note.plan}
            onChange={(e) => setNote({...note, plan: e.target.value})}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn-secondary" onClick={generateAIAssistedNote} disabled={loading} style={{ width: 'auto', padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
             {loading ? <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span> : <Bot size={16} />}
             Auto-Generate from Transcript
          </button>
          <button className="auth-submit-btn" onClick={handleSave} style={{ width: 'auto', padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Save size={16} /> Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
