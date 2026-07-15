import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assume we could update role via API here
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedRole) return;
    setLoading(true);
    // In a real app, we would make an API call here to update the user's role
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="auth-premium-wrapper">
      <div className="auth-premium-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h1 className="auth-title">Choose your experience</h1>
          <p className="auth-subtitle">How will you be using Ansaea?</p>
        </div>

        <div className="role-grid">
          <div 
            className={`role-card ${selectedRole === 'patient' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('patient')}
          >
            <div className="role-icon">
              <User size={40} />
            </div>
            <h3>Patient</h3>
            <p>I want to book consultations, track my health, and order medicines.</p>
          </div>
          
          <div 
            className={`role-card ${selectedRole === 'doctor' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('doctor')}
          >
            <div className="role-icon">
              <Stethoscope size={40} />
            </div>
            <h3>Doctor</h3>
            <p>I want to manage my practice, consult with patients, and write prescriptions.</p>
          </div>
        </div>

        <button 
          className="btn-primary-auth" 
          onClick={handleContinue} 
          disabled={!selectedRole || loading}
          style={{ marginTop: '2.5rem' }}
        >
          {loading ? 'Setting up...' : 'Continue to Dashboard'}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .role-card {
          border: 2px solid #e5e5e5;
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: #fff;
        }
        .role-card:hover {
          border-color: #a3a3a3;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .role-card.selected {
          border-color: #000;
          background: #fafafa;
          box-shadow: 0 0 0 1px #000;
        }
        .role-icon {
          width: 80px; height: 80px;
          margin: 0 auto 1.5rem;
          background: #f0f2f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          transition: all 0.3s;
        }
        .role-card.selected .role-icon {
          background: #000;
          color: #fff;
        }
        .role-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #111;
        }
        .role-card p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
        }
      `}} />
    </div>
  );
}
