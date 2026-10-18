import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Heart,
  Plus,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';

export default function MedicalHistorySetup() {
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [conditions, setConditions] = useState([]);
  const [surgeries, setSurgeries] = useState([{ name: '', year: '' }]);
  const [allergies, setAllergies] = useState([{ name: '', severity: 'Mild' }]);

  const conditionOptions = [
    { name: 'Hypertension', desc: 'Elevated arterial blood pressure' },
    { name: 'Type 2 Diabetes', desc: 'Insulin resistance & metabolic dysregulation' },
    { name: 'Asthma / COPD', desc: 'Chronic airway constriction' },
    { name: 'Thyroid Disorder', desc: 'Hypo or hyperthyroid endocrinopathy' },
    { name: 'Clinical Depression', desc: 'Affective mood disorder' },
    { name: 'Generalized Anxiety', desc: 'Autonomic nervous hyperarousal' },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authenticatedFetch('/patients/medical-history');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.chronic_conditions)) setConditions(data.chronic_conditions);
          if (Array.isArray(data.past_surgeries) && data.past_surgeries.length > 0)
            setSurgeries(data.past_surgeries);
          if (Array.isArray(data.allergies) && data.allergies.length > 0)
            setAllergies(data.allergies);
        }
      } catch (err) {
        console.error('Failed to load medical history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [authenticatedFetch]);

  const toggleCondition = (name) => {
    if (conditions.includes(name)) {
      setConditions(conditions.filter((c) => c !== name));
    } else {
      setConditions([...conditions, name]);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const cleanSurgeries = surgeries.filter((s) => s.name.trim() !== '');
      const cleanAllergies = allergies.filter((a) => a.name.trim() !== '');
      const res = await authenticatedFetch('/patients/medical-history', {
        method: 'PUT',
        body: JSON.stringify({
          chronic_conditions: conditions,
          past_surgeries: cleanSurgeries,
          allergies: cleanAllergies,
        }),
      });
      if (res.ok) {
        setMessage({
          type: 'success',
          text: 'Medical history successfully recorded in your electronic chart!',
        });
        setTimeout(() => navigate('/patient/profile'), 1200);
      } else {
        setMessage({ type: 'error', text: 'Failed to record medical history.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error saving history.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/patient/profile')}
        >
          <ArrowLeft size={14} /> Back to Profile
        </button>
        <div>
          <h1 style={{ margin: 0 }}>Medical History Wizard</h1>
          <span className="text-caption">
            Step {currentStep} of 3:{' '}
            {currentStep === 1
              ? 'Chronic Conditions'
              : currentStep === 2
                ? 'Past Surgeries'
                : 'Known Allergies'}
          </span>
        </div>
      </div>

      {/* Wizard Progress Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '999px',
              background: currentStep >= step ? 'var(--primary)' : 'var(--border)',
            }}
          />
        ))}
      </div>

      {message && (
        <div
          className={`card card-padding ${message.type === 'success' ? 'badge-success' : 'badge-danger'}`}
          style={{ color: 'var(--text-primary)' }}
        >
          {message.text}
        </div>
      )}

      <div className="card card-padding">
        {loading ? (
          <div
            style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            Loading existing clinical history...
          </div>
        ) : (
          <div>
            {/* Step 1: Chronic Conditions */}
            {currentStep === 1 && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <div className="stat-icon" style={{ width: '40px', height: '40px' }}>
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>Chronic Conditions</h3>
                    <span className="text-caption">Select any diagnosed conditions you manage</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-6)',
                  }}
                >
                  {conditionOptions.map((cond) => {
                    const isSelected = conditions.includes(cond.name);
                    return (
                      <div
                        key={cond.name}
                        onClick={() => toggleCondition(cond.name)}
                        style={{
                          padding: 'var(--space-3)',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                          background: isSelected ? 'var(--surface-2)' : 'var(--surface-0)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{cond.name}</div>
                          <div className="text-caption">{cond.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Next: Past Surgeries <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Past Surgeries */}
            {currentStep === 2 && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <div className="stat-icon" style={{ width: '40px', height: '40px' }}>
                    <Heart size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>Surgical Procedures</h3>
                    <span className="text-caption">
                      Document any major surgeries or interventions
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {surgeries.map((surg, index) => (
                    <div
                      key={index}
                      style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Procedure name (e.g. Appendectomy)"
                        value={surg.name}
                        onChange={(e) => {
                          const updated = [...surgeries];
                          updated[index].name = e.target.value;
                          setSurgeries(updated);
                        }}
                        style={{ flex: 2 }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Year (e.g. 2021)"
                        value={surg.year}
                        onChange={(e) => {
                          const updated = [...surgeries];
                          updated[index].year = e.target.value;
                          setSurgeries(updated);
                        }}
                        style={{ flex: 1 }}
                      />
                      {surgeries.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSurgeries(surgeries.filter((_, i) => i !== index))}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSurgeries([...surgeries, { name: '', year: '' }])}
                  style={{ marginBottom: 'var(--space-6)' }}
                >
                  <Plus size={14} /> Add Another Surgery
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(3)}
                  >
                    Next: Known Allergies <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Known Allergies */}
            {currentStep === 3 && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <div className="stat-icon" style={{ width: '40px', height: '40px' }}>
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>Known Allergies</h3>
                    <span className="text-caption">
                      Medications, foods, or environmental hypersensitivities
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {allergies.map((allergy, index) => (
                    <div
                      key={index}
                      style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Allergen (e.g. Penicillin, Peanuts)"
                        value={allergy.name}
                        onChange={(e) => {
                          const updated = [...allergies];
                          updated[index].name = e.target.value;
                          setAllergies(updated);
                        }}
                        style={{ flex: 2 }}
                      />
                      <select
                        className="form-input"
                        value={allergy.severity}
                        onChange={(e) => {
                          const updated = [...allergies];
                          updated[index].severity = e.target.value;
                          setAllergies(updated);
                        }}
                        style={{ flex: 1 }}
                      >
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe / Anaphylactic">Severe</option>
                      </select>
                      {allergies.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setAllergies(allergies.filter((_, i) => i !== index))}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setAllergies([...allergies, { name: '', severity: 'Mild' }])}
                  style={{ marginBottom: 'var(--space-6)' }}
                >
                  <Plus size={14} /> Add Another Allergen
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveAll}
                    disabled={saving}
                  >
                    <CheckCircle size={15} />{' '}
                    {saving ? 'Recording in EHR...' : 'Complete & Save Medical Record'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
