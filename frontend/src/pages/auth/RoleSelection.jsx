import { Stethoscope, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedRole) return;
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 className="auth-title">How will you use Ansaea?</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>
            Select your role to personalize your experience
          </p>
        </div>

        <div className="role-grid">
          <div
            className={`role-card ${selectedRole === 'patient' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('patient')}
          >
            <div className="role-card-icon">
              <User size={24} />
            </div>
            <div className="role-card-title">Patient</div>
            <p className="role-card-description">
              Book consultations, track health metrics, and manage prescriptions.
            </p>
          </div>

          <div
            className={`role-card ${selectedRole === 'doctor' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('doctor')}
          >
            <div className="role-card-icon">
              <Stethoscope size={24} />
            </div>
            <div className="role-card-title">Doctor</div>
            <p className="role-card-description">
              Manage your practice, consult patients, and write prescriptions.
            </p>
          </div>
        </div>

        <button
          className="btn-primary-auth"
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          style={{ marginTop: 'var(--space-6)' }}
        >
          {loading ? 'Setting up...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
