import { AlertCircle, FileText, Pill, RefreshCw, User, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CallSession from '../../../components/CallSession';
import ClinicalNotes from '../../../components/ClinicalNotes';
import EPrescription from '../../../components/EPrescription';
import { useAuth } from '../../../context/useAuth';

export default function ConsultationWorkspace() {
  const { authenticatedFetch } = useAuth();
  const [searchParams] = useSearchParams();
  const urlApptId = searchParams.get('appointmentId');

  const [activeTab, setActiveTab] = useState('call'); // call, notes, prescription
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await authenticatedFetch('/doctors/appointments/today');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAppointments(data);
            if (urlApptId) {
              const matched = data.find((a) => a.id === urlApptId);
              setSelectedAppt(matched || data[0]);
            } else {
              setSelectedAppt(data[0]);
            }
          } else {
            // Also check general appointments if today's is empty
            const genRes = await authenticatedFetch('/psychiatrists/appointments');
            if (genRes.ok) {
              const genData = await genRes.json();
              if (Array.isArray(genData) && genData.length > 0) {
                setAppointments(genData);
                setSelectedAppt(
                  urlApptId ? genData.find((a) => a.id === urlApptId) || genData[0] : genData[0],
                );
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load doctor appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [authenticatedFetch, urlApptId]);

  if (loading) {
    return (
      <div className="card card-padding" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading clinical encounter workspace...</p>
      </div>
    );
  }

  if (!selectedAppt) {
    return (
      <div className="card card-padding" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div
          className="stat-icon"
          style={{ width: '48px', height: '48px', margin: '0 auto var(--space-4)' }}
        >
          <AlertCircle size={24} />
        </div>
        <h3>No Active Appointments in Queue</h3>
        <p className="text-caption" style={{ maxWidth: '400px', margin: '0 auto var(--space-4)' }}>
          No consultations are scheduled for you at this moment. You can configure available slots
          or wait for patient bookings.
        </p>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          <RefreshCw size={14} /> Refresh Queue
        </button>
      </div>
    );
  }

  const currentPatientName = selectedAppt.patient_name || selectedAppt.name || 'Patient';
  const currentPatientId = selectedAppt.patient_id || selectedAppt.user_id || selectedAppt.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Workspace Header */}
      <div
        className="card card-padding"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>
            Clinical Encounter
          </span>
          <h2 style={{ margin: 0 }}>Consultation Workspace</h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-1)',
            }}
          >
            <span className="badge badge-accent">
              <User size={12} /> Patient: {currentPatientName}
            </span>
            <span className="badge badge-success">
              {selectedAppt.time_slot || 'Encounter Live'}
            </span>
            {appointments.length > 1 && (
              <select
                className="form-input"
                style={{ padding: '2px 8px', fontSize: '0.75rem', height: '24px' }}
                value={selectedAppt.id}
                onChange={(e) => {
                  const found = appointments.find((a) => a.id === e.target.value);
                  if (found) setSelectedAppt(found);
                }}
              >
                {appointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.patient_name || a.name || 'Patient'} ({a.time_slot || a.date})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'call' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('call')}
          >
            <Video size={15} /> Video Call
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('notes')}
          >
            <FileText size={15} /> SOAP Notes
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'prescription' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('prescription')}
          >
            <Pill size={15} /> E-Prescription
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div>
        {activeTab === 'call' && (
          <div style={{ position: 'relative', minHeight: '520px' }}>
            <CallSession appointment={selectedAppt} isVideo={true} onClose={() => {}} />
          </div>
        )}

        {activeTab === 'notes' && (
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <ClinicalNotes appointmentId={selectedAppt.id} />
          </div>
        )}

        {activeTab === 'prescription' && (
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <EPrescription appointmentId={selectedAppt.id} patientId={currentPatientId} />
          </div>
        )}
      </div>
    </div>
  );
}
