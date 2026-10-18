import { CheckCircle2, Pill, Plus, Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function EPrescription({ patientId, appointmentId }) {
  const { authenticatedFetch } = useAuth();
  const [medications, setMedications] = useState([
    { id: 1, name: '', dosage: '', frequency: '', duration: '' },
  ]);
  const [instructions, setInstructions] = useState('');
  const [sentStatus, setSentStatus] = useState('');

  useEffect(() => {
    if (!appointmentId) return;
    const fetchPresc = async () => {
      try {
        const res = await authenticatedFetch(`/api/doctors/prescriptions/${appointmentId}`);
        if (res.ok) {
          const d = await res.json();
          if (d.data?.medications && d.data.medications.length > 0) {
            setMedications(d.data.medications.map((m, i) => ({ id: i + 1, ...m })));
            setInstructions(d.data.instructions || '');
          }
        }
      } catch (error) {
        setSentStatus(error.message || 'Unable to load the prescription.');
      }
    };
    fetchPresc();
  }, [appointmentId, authenticatedFetch]);

  const handleAdd = () => {
    setMedications([
      ...medications,
      { id: Date.now(), name: '', dosage: '', frequency: '', duration: '' },
    ]);
  };

  const handleRemove = (id) => {
    if (medications.length === 1) return;
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleChange = (id, field, value) => {
    setMedications(medications.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSave = async () => {
    try {
      const res = await authenticatedFetch(
        `/api/doctors/prescriptions/${appointmentId || 'draft'}?patient_id=${patientId || '00000000-0000-0000-0000-000000000000'}`,
        {
          method: 'POST',
          body: JSON.stringify({ medications, instructions }),
        },
      );
      if (!res.ok) throw new Error('Unable to save the prescription.');
      setSentStatus('Prescription transmitted to pharmacy network');
      setTimeout(() => setSentStatus(''), 4000);
    } catch (e) {
      console.error(e);
      setSentStatus(e.message || 'Unable to save the prescription.');
      setTimeout(() => setSentStatus(''), 4000);
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
            <Pill size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>E-Prescription Dispenser</h3>
            <span className="text-caption">
              Digital Rx connected to verified pharmacy fulfillment
            </span>
          </div>
        </div>

        <button type="button" onClick={handleAdd} className="btn btn-secondary btn-sm">
          <Plus size={14} /> Add Medicine
        </button>
      </div>

      {sentStatus && (
        <div
          className="badge badge-success"
          style={{
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            marginBottom: 'var(--space-4)',
            justifyContent: 'center',
          }}
        >
          <CheckCircle2 size={14} /> {sentStatus}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {medications.map((med, index) => (
          <div
            key={med.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 2fr 1fr 1fr 1fr auto',
              gap: 'var(--space-2)',
              alignItems: 'center',
              padding: 'var(--space-3)',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          >
            <span
              className="text-mono"
              style={{
                color: 'var(--text-tertiary)',
                fontWeight: '600',
                padding: '0 var(--space-1)',
              }}
            >
              {index + 1}.
            </span>
            <input
              className="form-input"
              placeholder="Medicine Name (e.g. Sertraline)"
              value={med.name}
              onChange={(e) => handleChange(med.id, 'name', e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Dosage (50mg)"
              value={med.dosage}
              onChange={(e) => handleChange(med.id, 'dosage', e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Freq (1-0-0)"
              value={med.frequency}
              onChange={(e) => handleChange(med.id, 'frequency', e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Duration (30d)"
              value={med.duration}
              onChange={(e) => handleChange(med.id, 'duration', e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemove(med.id)}
              className="btn btn-ghost btn-icon"
              style={{ color: 'var(--status-danger)' }}
              disabled={medications.length === 1}
              title="Remove medication"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <div className="form-group" style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>
          <label className="form-label" style={{ fontWeight: '600' }}>
            Special Instructions / Precautions
          </label>
          <textarea
            className="form-input"
            style={{ minHeight: '72px' }}
            placeholder="e.g. Take with morning meal. Avoid abrupt cessation. Follow up liver function profile."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
          <button type="button" onClick={handleSave} className="btn btn-primary">
            <Send size={15} /> Sign & Transmit Rx
          </button>
        </div>
      </div>
    </div>
  );
}
