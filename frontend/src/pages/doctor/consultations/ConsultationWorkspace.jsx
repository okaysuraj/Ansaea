import React, { useState } from 'react';
import { Video, FileText, Pill, User } from 'lucide-react';
import CallSession from '../../components/CallSession';
import ClinicalNotes from '../../components/ClinicalNotes';
import EPrescription from '../../components/EPrescription';

export default function ConsultationWorkspace() {
  const [activeTab, setActiveTab] = useState('call'); // call, notes, prescription

  // Mock appointment for workspace
  const mockAppt = {
    id: 'mock-1',
    user_id: 'patient-1',
    patient_name: 'John Doe',
    session_type: 'video'
  };

  return (
    <div className="main-content" style={{ marginLeft: 0, padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Workspace Header */}
      <div style={{ padding: '1.5rem 2rem', background: '#fff', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="dashboard-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Clinical Workspace</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <User size={14} /> Patient: {mockAppt.patient_name} • Session Active
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={`btn-submit ${activeTab === 'call' ? '' : 'outline'}`} 
            style={{ marginTop: 0, width: 'auto', padding: '0.5rem 1rem', background: activeTab === 'call' ? '#000' : 'transparent', color: activeTab === 'call' ? '#fff' : '#000', border: '1px solid #000' }}
            onClick={() => setActiveTab('call')}
          >
            <Video size={16} style={{ marginRight: '0.5rem' }}/> Telemetry
          </button>
          <button 
            className={`btn-submit ${activeTab === 'notes' ? '' : 'outline'}`} 
            style={{ marginTop: 0, width: 'auto', padding: '0.5rem 1rem', background: activeTab === 'notes' ? '#000' : 'transparent', color: activeTab === 'notes' ? '#fff' : '#000', border: '1px solid #000' }}
            onClick={() => setActiveTab('notes')}
          >
            <FileText size={16} style={{ marginRight: '0.5rem' }}/> SOAP Notes
          </button>
          <button 
            className={`btn-submit ${activeTab === 'prescription' ? '' : 'outline'}`} 
            style={{ marginTop: 0, width: 'auto', padding: '0.5rem 1rem', background: activeTab === 'prescription' ? '#000' : 'transparent', color: activeTab === 'prescription' ? '#fff' : '#000', border: '1px solid #000' }}
            onClick={() => setActiveTab('prescription')}
          >
            <Pill size={16} style={{ marginRight: '0.5rem' }}/> Rx
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-main)', overflowY: 'auto' }}>
        {activeTab === 'call' && (
          <div style={{ position: 'relative', height: '100%', minHeight: '600px', borderRadius: '16px', overflow: 'hidden' }}>
             <CallSession appointment={mockAppt} isVideo={true} onClose={() => {}} />
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <ClinicalNotes appointmentId={mockAppt.id} />
          </div>
        )}

        {activeTab === 'prescription' && (
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <EPrescription appointmentId={mockAppt.id} patientId={mockAppt.user_id} />
          </div>
        )}
      </div>

    </div>
  );
}
