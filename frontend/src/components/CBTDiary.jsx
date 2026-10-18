import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useApiData } from '../hooks/useApiData';
import { readJson } from '../utils/api';

const COGNITIVE_DISTORTIONS = [
  {
    name: 'All-or-Nothing',
    desc: 'Viewing events in black-or-white extremes with no middle ground.',
  },
  {
    name: 'Catastrophizing',
    desc: 'Assuming the worst possible outcome will inevitably materialize.',
  },
  {
    name: 'Mind Reading',
    desc: 'Assuming you know others are judging or feeling negatively about you.',
  },
  {
    name: 'Emotional Reasoning',
    desc: 'Believing that because you feel insecure or inadequate, it must be true.',
  },
  {
    name: 'Overgeneralizing',
    desc: 'Treating a single setback as a continuous pattern of defeat.',
  },
  {
    name: 'Personalization',
    desc: 'Holding yourself responsible for factors outside your reasonable control.',
  },
];

export default function CBTDiary() {
  const { authenticatedFetch } = useAuth();
  const [step, setStep] = useState(1);

  // CBT Log Form State
  const [situation, setSituation] = useState('');
  const [negativeThoughts, setNegativeThoughts] = useState('');
  const [selectedDistortions, setSelectedDistortions] = useState([]);
  const [rationalThoughts, setRationalThoughts] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    data: cbtLogs,
    loading: logsLoading,
    error,
    reload: fetchCBTLogs,
  } = useApiData('/tracker/cbt', []);

  const toggleDistortion = (distortionName) => {
    setSelectedDistortions((prev) =>
      prev.includes(distortionName)
        ? prev.filter((d) => d !== distortionName)
        : [...prev, distortionName],
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation,
          negative_thoughts: negativeThoughts,
          distortions: selectedDistortions,
          rational_thoughts: rationalThoughts,
          date: todayStr,
        }),
      });

      await readJson(response);
      setMessage('Thought record reframed and synchronized.');
      setSituation('');
      setNegativeThoughts('');
      setSelectedDistortions([]);
      setRationalThoughts('');
      setStep(1);
      fetchCBTLogs();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(err.message || 'Unable to save the thought record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (logId) => {
    if (!confirm('Remove this CBT thought record?')) return;
    try {
      await readJson(
        await authenticatedFetch(`/tracker/cbt/${logId}`, {
          method: 'DELETE',
        }),
      );
      fetchCBTLogs();
    } catch (err) {
      setMessage(err.message || 'Unable to delete the thought record.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {error && <p role="alert">{error}</p>}
      {/* Interactive Step-by-Step Form Card */}
      <div className="card card-padding">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'var(--space-4)',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div className="stat-icon" style={{ width: '36px', height: '36px' }}>
              <BrainCircuit size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>CBT Thought Reframing Diary</h3>
              <span className="text-caption">
                Evidence-based cognitive restructuring to untangle automatic negative thoughts
              </span>
            </div>
          </div>
          <span className="badge badge-accent">Step {step} of 4</span>
        </div>

        {/* Step node markers */}
        <div className="cbt-steps-tracker">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`cbt-step-node ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
            >
              {step > num ? <CheckCircle2 size={16} /> : num}
            </div>
          ))}
        </div>

        {message && (
          <div
            className="badge badge-success"
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              marginBottom: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              justifyContent: 'center',
            }}
          >
            {message}
          </div>
        )}

        {/* Step 1: The Triggering Situation */}
        {step === 1 && (
          <div>
            <h4 style={{ marginBottom: 'var(--space-1)' }}>1. Describe the Triggering Event</h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              What objective event occurred? Stick to factual details without emotional
              interpretation (who, what, where).
            </p>
            <textarea
              className="form-input"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., 'My manager emailed requesting an alignment sync with no subject line or context.'"
              rows="4"
              style={{ resize: 'vertical' }}
            />
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}
            >
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!situation.trim()}
                className="btn btn-primary"
              >
                Next Step <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Automatic Negative Thoughts */}
        {step === 2 && (
          <div>
            <h4 style={{ marginBottom: 'var(--space-1)' }}>
              2. Automatic Negative Thoughts (ANTs)
            </h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              What instant, reflexive thoughts crossed your mind? What story did your inner critic
              tell you?
            </p>
            <textarea
              className="form-input"
              value={negativeThoughts}
              onChange={(e) => setNegativeThoughts(e.target.value)}
              placeholder="e.g., 'I must have made a critical blunder. My job security is on the line.'"
              rows="4"
              style={{ resize: 'vertical' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 'var(--space-4)',
              }}
            >
              <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                <ArrowLeft size={15} /> Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!negativeThoughts.trim()}
                className="btn btn-primary"
              >
                Identify Distortions <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Identify Cognitive Distortions */}
        {step === 3 && (
          <div>
            <h4 style={{ marginBottom: 'var(--space-1)' }}>3. Identify Cognitive Distortions</h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              Select which cognitive biases are coloring your thoughts. Tap any that apply.
            </p>

            <div className="distortion-grid">
              {COGNITIVE_DISTORTIONS.map((d) => {
                const isSelected = selectedDistortions.includes(d.name);
                return (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => toggleDistortion(d.name)}
                    className={`distortion-pill ${isSelected ? 'selected' : ''}`}
                  >
                    <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>
                      {d.name}
                    </div>
                    <div
                      className="text-caption"
                      style={{
                        color: isSelected ? 'inherit' : 'var(--text-tertiary)',
                        fontSize: '0.75rem',
                        lineHeight: '1.4',
                      }}
                    >
                      {d.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 'var(--space-4)',
              }}
            >
              <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                <ArrowLeft size={15} /> Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={selectedDistortions.length === 0}
                className="btn btn-primary"
              >
                Formulate Reframe <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Rational Reframe */}
        {step === 4 && (
          <div>
            <h4 style={{ marginBottom: 'var(--space-1)' }}>4. Formulate a Rational Reframe</h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              Challenge the distortion with evidence, compassion, and realistic balance. What is a
              more measured way to interpret this?
            </p>
            <textarea
              className="form-input"
              value={rationalThoughts}
              onChange={(e) => setRationalThoughts(e.target.value)}
              placeholder="e.g., 'A sync is standard company workflow. Speculating before I have data is mind-reading. I will ask politely for the agenda and attend calmly.'"
              rows="4"
              style={{ resize: 'vertical' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 'var(--space-4)',
              }}
            >
              <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                <ArrowLeft size={15} /> Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !rationalThoughts.trim()}
                className="btn btn-primary"
              >
                <Sparkles size={15} /> Save Thought Record
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History of CBT diaries */}
      <div className="card card-padding">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div>
            <h3>Thought Reframing Journal</h3>
            <p className="text-caption">
              Review past records to reinforce adaptive neural pathways
            </p>
          </div>
          <span className="badge badge-accent">{cbtLogs.length} records</span>
        </div>

        {logsLoading ? (
          <div className="empty-state">
            <div className="empty-state-title">Retrieving cognitive journal...</div>
          </div>
        ) : cbtLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BrainCircuit size={24} />
            </div>
            <div className="empty-state-title">No entries logged yet</div>
            <div className="empty-state-desc">
              Use the step-by-step tool above whenever you encounter an intrusive anxiety spiral or
              cognitive distortion.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {cbtLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-0)',
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleDelete(log.id)}
                  className="btn btn-ghost btn-icon"
                  style={{
                    position: 'absolute',
                    top: 'var(--space-3)',
                    right: 'var(--space-3)',
                    color: 'var(--text-tertiary)',
                  }}
                  title="Remove thought record"
                >
                  <Trash2 size={15} />
                </button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                    marginBottom: 'var(--space-3)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  <Calendar size={13} />
                  <span>{log.date}</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--space-4)',
                  }}
                >
                  {/* Left Column: Negative Scenario */}
                  <div
                    style={{
                      background: 'var(--status-danger-subtle)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid var(--status-danger)',
                    }}
                  >
                    <div
                      className="text-label"
                      style={{ color: 'var(--status-danger)', marginBottom: 'var(--space-2)' }}
                    >
                      Situation & Automatic Thoughts
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: 'var(--space-2)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      "{log.situation}"
                    </div>
                    <div
                      className="text-caption"
                      style={{ fontStyle: 'italic', marginBottom: 'var(--space-3)' }}
                    >
                      Negative script: "{log.negative_thoughts}"
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                      {log.distortions?.map((d) => (
                        <span key={d} className="badge badge-danger">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Rational Reframe */}
                  <div
                    style={{
                      background: 'var(--accent-subtle)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid var(--accent)',
                    }}
                  >
                    <div
                      className="text-label"
                      style={{ color: 'var(--accent)', marginBottom: 'var(--space-2)' }}
                    >
                      Rational Cognitive Reframe
                    </div>
                    <div
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: '500',
                        lineHeight: '1.5',
                        color: 'var(--text-primary)',
                      }}
                    >
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
