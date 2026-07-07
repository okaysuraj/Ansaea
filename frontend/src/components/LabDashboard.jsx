import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FlaskConical, ClipboardList, Upload, FileText, CheckCircle } from 'lucide-react';

export default function LabDashboard() {
  const { user, logout } = useAuth();
  const [tests, setTests] = useState([
    { id: 'LAB-5091', patient: 'Alice Brown', test: 'Complete Blood Count', status: 'pending', date: 'Today, 8:30 AM' },
    { id: 'LAB-5092', patient: 'John Doe', test: 'Lipid Profile', status: 'sample_collected', date: 'Today, 9:00 AM' }
  ]);

  const handleCollect = (id) => {
    setTests(tests.map(t => t.id === id ? { ...t, status: 'sample_collected' } : t));
  };

  const handleUpload = (id) => {
    setTests(tests.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  return (
    <div className="dashboard-container" style={{ padding: '2rem' }}>
      <header className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FlaskConical size={28} className="text-primary" />
          <h1 style={{ margin: 0 }}>Lab & Diagnostics Portal</h1>
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
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ClipboardList size={18} /> Pending Test Requests</h3>
          <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Req ID</th>
                <th>Patient</th>
                <th>Test</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>{test.id}</td>
                  <td>{test.patient}</td>
                  <td>{test.test}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      backgroundColor: test.status === 'pending' ? 'rgba(239, 68, 68, 0.1)' : test.status === 'sample_collected' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: test.status === 'pending' ? 'var(--color-danger)' : test.status === 'sample_collected' ? 'var(--color-warning)' : 'var(--color-success)'
                    }}>
                      {test.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {test.status === 'pending' && (
                      <button className="btn-secondary" onClick={() => handleCollect(test.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Mark Collected</button>
                    )}
                    {test.status === 'sample_collected' && (
                      <button className="btn-submit" onClick={() => handleUpload(test.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}><Upload size={12}/> Upload Report</button>
                    )}
                    {test.status === 'completed' && (
                      <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}><CheckCircle size={14} /> Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} /> Recent Uploads</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-color)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>MRI Scan</strong><br/>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bob Williams</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>Delivered</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
