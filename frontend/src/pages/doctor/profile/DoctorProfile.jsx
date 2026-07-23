import React from 'react';
import { UserCheck, Award, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DoctorProfile() {
  const { user } = useAuth();
  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Professional Profile</h1>
      </div>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '16px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
            {user?.username?.substring(0,2).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user?.username}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18}/> Licensed Psychiatrist
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Biography</h3>
            <textarea className="form-input" rows="5" placeholder="Write a brief bio..." defaultValue="Dedicated healthcare professional with 10+ years of experience in clinical psychiatry." />
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Session Pricing</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <DollarSign size={20} color="var(--color-primary)" />
              <input type="number" className="form-input" defaultValue={150} style={{ width: '120px' }} />
              <span>/ session</span>
            </div>
          </div>
        </div>
        <button className="btn-primary-auth" style={{ marginTop: '2rem', maxWidth: '200px' }}>Save Profile</button>
      </div>
    </div>
  );
}
