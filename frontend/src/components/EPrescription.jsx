import React, { useState } from 'react';
import { Pill, Plus, Trash2, Send } from 'lucide-react';

export default function EPrescription({ patientId, appointmentId }) {
  const [medications, setMedications] = useState([
    { id: 1, name: '', dosage: '', frequency: '', duration: '' }
  ]);

  const handleAdd = () => {
    setMedications([...medications, { id: Date.now(), name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleRemove = (id) => {
    if (medications.length === 1) return;
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleChange = (id, field, value) => {
    setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Pill size={20} className="text-secondary" /> E-Prescription
        </h3>
        <button onClick={handleAdd} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
          <Plus size={14} /> Add Medicine
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {medications.map((med, index) => (
          <div key={med.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: 'bold', marginRight: '0.5rem', color: 'var(--text-muted)' }}>{index + 1}.</span>
            <input 
              className="auth-input" 
              style={{ flex: '2', minWidth: '150px' }} 
              placeholder="Medicine Name (e.g. Paracetamol)" 
              value={med.name}
              onChange={(e) => handleChange(med.id, 'name', e.target.value)}
            />
            <input 
              className="auth-input" 
              style={{ flex: '1', minWidth: '80px' }} 
              placeholder="Dosage (500mg)" 
              value={med.dosage}
              onChange={(e) => handleChange(med.id, 'dosage', e.target.value)}
            />
            <input 
              className="auth-input" 
              style={{ flex: '1', minWidth: '80px' }} 
              placeholder="Freq (1-0-1)" 
              value={med.frequency}
              onChange={(e) => handleChange(med.id, 'frequency', e.target.value)}
            />
            <input 
              className="auth-input" 
              style={{ flex: '1', minWidth: '80px' }} 
              placeholder="Duration (5 days)" 
              value={med.duration}
              onChange={(e) => handleChange(med.id, 'duration', e.target.value)}
            />
            <button 
              onClick={() => handleRemove(med.id)} 
              className="icon-btn" 
              style={{ color: 'var(--color-danger)', padding: '0.5rem' }}
              disabled={medications.length === 1}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.9rem' }}>Special Instructions</label>
          <textarea 
            className="auth-input" 
            style={{ width: '100%', minHeight: '60px', resize: 'vertical' }}
            placeholder="Take after meals..."
          />
        </div>

        <button className="auth-submit-btn" style={{ alignSelf: 'flex-end', width: 'auto', padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Send size={16} /> Send to Patient
        </button>
      </div>
    </div>
  );
}
