import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FlaskConical, ClipboardList, Upload, FileText, CheckCircle, Clock } from 'lucide-react';

export default function LabDashboard() {
  const { user, logout } = useAuth();
  const [tests, setTests] = useState([]);

  const { authenticatedFetch } = useAuth();
  
  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await authenticatedFetch('/lab/requests');
        if (res.ok) {
          const data = await res.json();
          setTests(data.map(t => ({
             id: t.id.substring(0, 8),
             patient: t.patient_id,
             test: t.test_names.join(', '),
             status: t.status,
             date: new Date(t.created_at).toLocaleDateString()
          })));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchRequests();
  }, [authenticatedFetch]);
  
  const handleCollect = async (id) => {
    setTests(tests.map(t => t.id === id ? { ...t, status: 'sample_collected' } : t));
    try {
      await authenticatedFetch(`/lab/requests/${id}/status?status=sample_collected`, { method: 'PATCH' });
    } catch(e) {}
  };

  const handleUpload = async (id) => {
    setTests(tests.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    try {
      await authenticatedFetch(`/lab/requests/${id}/status?status=completed`, { method: 'PATCH' });
    } catch(e) {}
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

        <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> Turnaround Time (TAT)</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-color)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Average TAT</strong><br/>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 7 days</span>
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>4.2 hrs</span>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-color)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>SLA Breaches</strong><br/>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TAT &gt; 24hrs</span>
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>2</span>
              </div>
            </div>
          </div>
          
          <div>
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
        </div>
      </main>
    </div>
  );
}
