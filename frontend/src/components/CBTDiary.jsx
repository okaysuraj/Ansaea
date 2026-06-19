import React, { useState, useEffect } from 'react';
import { Shield, BrainCircuit, ArrowRight, ArrowLeft, Trash2, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COGNITIVE_DISTORTIONS = [
  { name: 'All-or-Nothing', desc: 'Viewing things in black-and-white. "If I\'m not perfect, I failed."' },
  { name: 'Catastrophizing', desc: 'Exaggerating consequences. "This mistake will ruin my entire career."' },
  { name: 'Mind Reading', desc: 'Arbitrarily concluding that others are thinking negatively of you.' },
  { name: 'Emotional Reasoning', desc: 'Assuming your feelings reflect reality. "I feel stupid, so I must be stupid."' },
  { name: 'Overgeneralizing', desc: 'Drawing broad conclusions from a single event. "Nothing ever goes right for me."' },
  { name: 'Personalization', desc: 'Blaming yourself for events outside of your direct control.' }
];

export default function CBTDiary() {
  const { authenticatedFetch } = useAuth();
  const [step, setStep] = useState(1);
  
  // CBT Log Form State
  const [situation, setSituation] = useState('');
  const [negativeThoughts, setNegativeThoughts] = useState('');
  const [selectedDistortions, setSelectedDistortions] = useState([]);
  const [rationalThoughts, setRationalThoughts] = useState('');
  
  const [cbtLogs, setCbtLogs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logsLoading, setLogsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchCBTLogs = async () => {
    setLogsLoading(true);
    try {
      const response = await authenticatedFetch('/tracker/cbt');
      const data = await response.json();
      if (response.ok) {
        setCbtLogs(data);
      }
    } catch (err) {
      console.log('Error downloading CBT logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchCBTLogs();
  }, []);

  const toggleDistortion = (distortionName) => {
    setSelectedDistortions((prev) =>
      prev.includes(distortionName)
        ? prev.filter((d) => d !== distortionName)
        : [...prev, distortionName]
    );
  };

  const handleNextStep = () => {
    if (step === 1 && !situation.trim()) return;
    if (step === 2 && !negativeThoughts.trim()) return;
    if (step === 3 && selectedDistortions.length === 0) return;
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rationalThoughts.trim()) return;
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await authenticatedFetch('/tracker/cbt', {
        method: 'POST',
        body: JSON.stringify({
          situation,
          negative_thoughts: negativeThoughts,
          distortions: selectedDistortions,
          rational_thoughts: rationalThoughts,
          date: todayStr
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('Your cognitive reframe has been saved successfully.');
        setSituation('');
        setNegativeThoughts('');
        setSelectedDistortions([]);
        setRationalThoughts('');
        setStep(1);
        fetchCBTLogs();
      } else {
        setMessage(data.detail || 'Failed to submit CBT logs');
      }
    } catch (err) {
      setMessage(err.message || 'Error connecting to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (logId) => {
    if (!confirm('Are you sure you want to delete this CBT entry?')) return;
    try {
      const response = await authenticatedFetch(`/tracker/cbt/${logId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchCBTLogs();
      }
    } catch (err) {
      console.log('Error deleting CBT entry:', err);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      {/* Interactive Step-by-Step Form Card */}
      <div className="glass-panel cbt-step-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <BrainCircuit style={{ color: 'var(--color-secondary)' }} />
          <h3>CBT Cognitive Reframing Diary</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Step {step} of 4</span>
        </div>

        {/* Step node markers */}
        <div className="cbt-steps-tracker">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`cbt-step-node ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
            >
              {num}
            </div>
          ))}
        </div>

        {message && (
          <div
            className="glass-panel"
            style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              borderColor: 'var(--color-success)',
              background: 'rgba(16, 185, 129, 0.05)',
              fontSize: '0.9rem',
              textAlign: 'center',
              color: 'var(--color-success)'
            }}
          >
            {message}
          </div>
        )}

        {/* Step 1: The Situation */}
        {step === 1 && (
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Describe the Situation</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              What event triggered your emotional distress? Be objective. Stick to facts. (Who, what, where).
            </p>
            <textarea
              className="form-input"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., 'My manager emailed me requesting a private alignment meeting at the end of the day with no subject line...'"
              rows="5"
              style={{ resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!situation.trim()}
                className="btn-submit"
                style={{ width: 'auto', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Negative Thoughts */}
        {step === 2 && (
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Automatic Negative Thoughts (ANTs)</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              What thoughts automatically rushed into your head? What are you telling yourself about this situation?
            </p>
            <textarea
              className="form-input"
              value={negativeThoughts}
              onChange={(e) => setNegativeThoughts(e.target.value)}
              placeholder="e.g., 'I am definitely getting fired. I must have made a massive error. Everyone will know I failed.'"
              rows="5"
              style={{ resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={handlePrevStep}
                className="form-input"
                style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!negativeThoughts.trim()}
                className="btn-submit"
                style={{ width: 'auto', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Identify Cognitive Distortions */}
        {step === 3 && (
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Identify Cognitive Distortions</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Select the toxic mental patterns present in those thoughts. Click to toggle selection.
            </p>
            
            <div className="distortion-grid">
              {COGNITIVE_DISTORTIONS.map((d) => {
                const isSelected = selectedDistortions.includes(d.name);
                return (
                  <div
                    key={d.name}
                    onClick={() => toggleDistortion(d.name)}
                    className={`distortion-pill ${isSelected ? 'selected' : ''}`}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{d.name}</div>
                    <div style={{ fontSize: '0.7rem', color: isSelected ? '#e9d5ff' : 'var(--text-dim)' }}>{d.desc}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={handlePrevStep}
                className="form-input"
                style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={selectedDistortions.length === 0}
                className="btn-submit"
                style={{ width: 'auto', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Rational Reframe */}
        {step === 4 && (
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Rational Reframe</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Challenge those negative distortions. Write a balanced, objective, compassionate alternative perspective.
            </p>
            <textarea
              className="form-input"
              value={rationalThoughts}
              onChange={(e) => setRationalThoughts(e.target.value)}
              placeholder="e.g., 'My manager has requested regular touchpoints before. She could just want to review next week's schedule or ask for a project update. Speculating on worst-case scenarios is catastrophizing. I will attend and find out.'"
              rows="5"
              style={{ resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={handlePrevStep}
                className="form-input"
                style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !rationalThoughts.trim()}
                className="btn-submit"
                style={{
                  width: 'auto',
                  padding: '0.75rem 2.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
                  marginTop: 0
                }}
              >
                <Sparkles size={16} /> Reframe Complete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History of CBT diaries */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Recent Thought Reframing Logs</h4>
        
        {logsLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Retrieving history...</div>
        ) : cbtLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Shield size={32} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.9rem' }}>No thought records present. Cognitive reframing trains your mind to reject anxiety spirals.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cbtLogs.map((log) => (
              <div key={log.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
                <button
                  onClick={() => handleDelete(log.id)}
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                >
                  <Trash2 size={16} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Calendar size={14} />
                  <span>{log.date}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {/* Left Column: Negative */}
                  <div style={{ background: 'rgba(239, 68, 68, 0.02)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--color-danger)' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-danger)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Negative Scenario & Thoughts
                    </strong>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: '500' }}>"{log.situation}"</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>ANTs: "{log.negative_thoughts}"</div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
                      {log.distortions.map((d) => (
                        <span key={d} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.08)', color: '#fca5a5' }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Positive Reframe */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.02)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--color-success)' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-success)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Rational Reframed Thoughts
                    </strong>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.4' }}>
                      "{log.rational_thoughts}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
