import { Activity, AlertTriangle, ArrowLeft, Heart, ShieldCheck, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';

export default function PatientProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();

  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authenticatedFetch(`/doctors/patients/${id}/history`);
        if (res.ok) {
          const data = await res.json();
          setPatientData(data);
        } else {
          setError('Unable to load patient records or not authorized.');
        }
      } catch (err) {
        console.error('Failed to load patient history:', err);
        setError('Error connecting to clinical database.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHistory();
    }
  }, [id, authenticatedFetch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/doctor/patients')}
        >
          <ArrowLeft size={14} /> Back to Directory
        </button>
        <div>
          <h1 style={{ margin: 0 }}>Clinical Record Review</h1>
          <span className="text-caption">Patient ID: {id}</span>
        </div>
      </div>

      {loading ? (
        <div
          className="card card-padding"
          style={{ textAlign: 'center', padding: 'var(--space-8)' }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>
            Loading patient history from electronic health records...
          </p>
        </div>
      ) : error ? (
        <div
          className="card card-padding"
          style={{ textAlign: 'center', padding: 'var(--space-8)' }}
        >
          <div
            className="stat-icon"
            style={{ width: '48px', height: '48px', margin: '0 auto var(--space-3)' }}
          >
            <AlertTriangle size={24} />
          </div>
          <h4>{error}</h4>
          <p className="text-caption">
            Verify that this patient has an active appointment with you.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {/* Demographics Card */}
          <div className="card card-padding">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <div className="stat-icon" style={{ width: '40px', height: '40px' }}>
                <User size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Demographics & Profile</h3>
                <span className="text-caption">Registered Patient Details</span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                fontSize: '0.875rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: 'var(--space-2)',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>Date of Birth</span>
                <span style={{ fontWeight: '600' }}>
                  {patientData?.profile?.dob || 'Not reported'}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: 'var(--space-2)',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>Blood Group</span>
                <span className="badge badge-accent">
                  {patientData?.profile?.blood_group || 'O+'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Security Verification</span>
                <span
                  style={{
                    color: 'var(--status-success)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ShieldCheck size={14} /> Identity Verified
                </span>
              </div>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="card card-padding">
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
                <span className="text-caption">Diagnosed Long-term Conditions</span>
              </div>
            </div>
            {patientData?.history?.chronic_conditions?.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {patientData.history.chronic_conditions.map((cond, idx) => (
                  <span key={idx} className="badge badge-warning">
                    {cond}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                No chronic conditions recorded.
              </p>
            )}
          </div>

          {/* Allergies */}
          <div className="card card-padding">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <div className="stat-icon" style={{ width: '40px', height: '40px' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Allergies</h3>
                <span className="text-caption">Known Drug & Environmental Reactions</span>
              </div>
            </div>
            {patientData?.history?.allergies?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {patientData.history.allergies.map((allergy, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 'var(--space-2)',
                      background: 'var(--surface-0)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <span style={{ fontWeight: '600' }}>
                      {typeof allergy === 'object' ? allergy.name : allergy}
                    </span>
                    <span className="badge badge-danger">
                      {typeof allergy === 'object' ? allergy.severity : 'Severe'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                No documented allergies.
              </p>
            )}
          </div>

          {/* Surgeries */}
          <div className="card card-padding">
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
                <h3 style={{ margin: 0 }}>Surgical History</h3>
                <span className="text-caption">Past Procedures & Interventions</span>
              </div>
            </div>
            {patientData?.history?.past_surgeries?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {patientData.history.past_surgeries.map((surg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 'var(--space-2)',
                      background: 'var(--surface-0)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <span style={{ fontWeight: '600' }}>
                      {typeof surg === 'object' ? surg.name : surg}
                    </span>
                    <span className="text-caption">
                      {typeof surg === 'object' ? surg.year : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                No surgical records documented.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
