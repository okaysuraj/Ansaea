import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Activity, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  
  const [approvals, setApprovals] = useState([
    { id: 'DOC-901', name: 'Dr. Sarah Connor', specialty: 'Cardiology', license: 'MED192837', status: 'pending' },
    { id: 'DOC-902', name: 'Dr. Kyle Reese', specialty: 'Neurology', license: 'MED918273', status: 'pending' }
  ]);

  const handleApprove = (id) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  };

  const handleReject = (id) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  };

  return (
    <div className="dashboard-container" style={{ padding: '2rem' }}>
      <header className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldAlert size={28} className="text-primary" />
          <h1 style={{ margin: 0 }}>Super Admin & Ops</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {user?.username}</span>
          <button onClick={logout} className="auth-submit-btn" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-main" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        <div className="card" style={{ gridColumn: 'span 8' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> Doctor Approvals Queue</h3>
          <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Doctor</th>
                <th>Specialty</th>
                <th>License</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{doc.name}</td>
                  <td>{doc.specialty}</td>
                  <td style={{ fontFamily: 'monospace' }}>{doc.license}</td>
                  <td>
                    {doc.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-submit" onClick={() => handleApprove(doc.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={12}/> Approve</button>
                        <button className="btn-secondary" onClick={() => handleReject(doc.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}><XCircle size={12}/> Reject</button>
                      </div>
                    ) : (
                      <span style={{ color: doc.status === 'approved' ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: '500', fontSize: '0.8rem' }}>
                        {doc.status.toUpperCase()}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> System Health</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-color)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span>API Uptime</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>99.99%</span>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-color)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Active Users Today</span>
              <span style={{ fontWeight: 'bold' }}>1,245</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
