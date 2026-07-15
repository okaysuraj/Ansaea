import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Activity, CheckCircle, XCircle, FileText, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  
  const [approvals, setApprovals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [hipaaEnabled, setHipaaEnabled] = useState(true);
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [stats, setStats] = useState({ uptime: "99.99%", active_users: 0 });

  const { authenticatedFetch } = useAuth();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, logRes, statRes, setRes] = await Promise.all([
          authenticatedFetch('/admin/approvals'),
          authenticatedFetch('/admin/audit-logs'),
          authenticatedFetch('/admin/system-health'),
          authenticatedFetch('/admin/settings')
        ]);
        
        if (appRes.ok) setApprovals(await appRes.json());
        if (logRes.ok) setAuditLogs(await logRes.json());
        if (statRes.ok) setStats(await statRes.json());
        if (setRes.ok) {
          const settings = await setRes.json();
          setHipaaEnabled(settings.hipaa_mode);
          setGdprEnabled(settings.gdpr_mode);
        }
      } catch (e) {
        console.error("Admin fetch error", e);
      }
    };
    fetchData();
  }, [authenticatedFetch]);

  const handleApprove = async (id) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    try {
      await authenticatedFetch(`/admin/approvals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'approved' })
      });
      // Refresh audit logs
      const logRes = await authenticatedFetch('/admin/audit-logs');
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch(e) {}
  };

  const handleReject = async (id) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    try {
      await authenticatedFetch(`/admin/approvals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'rejected' })
      });
      const logRes = await authenticatedFetch('/admin/audit-logs');
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch(e) {}
  };

  const toggleHipaa = async () => {
    const newVal = !hipaaEnabled;
    setHipaaEnabled(newVal);
    await authenticatedFetch('/admin/settings/hipaa_mode', { method: 'PATCH', body: JSON.stringify({ setting_value: newVal }) });
    const logRes = await authenticatedFetch('/admin/audit-logs');
    if (logRes.ok) setAuditLogs(await logRes.json());
  };

  const toggleGdpr = async () => {
    const newVal = !gdprEnabled;
    setGdprEnabled(newVal);
    await authenticatedFetch('/admin/settings/gdpr_mode', { method: 'PATCH', body: JSON.stringify({ setting_value: newVal }) });
    const logRes = await authenticatedFetch('/admin/audit-logs');
    if (logRes.ok) setAuditLogs(await logRes.json());
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
        
        <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> System Health</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-color)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span>API Uptime</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>{stats.uptime}</span>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-color)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Active Users</span>
                <span style={{ fontWeight: 'bold' }}>{stats.active_users}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldAlert size={18} /> Compliance & Privacy</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-color)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>HIPAA Mode</strong><br/>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Strict audit & anonymization</span>
                </div>
                <button onClick={toggleHipaa} style={{ background: 'none', border: 'none', color: hipaaEnabled ? 'var(--color-success)' : 'var(--text-muted)', cursor: 'pointer' }}>
                  {hipaaEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-color)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>GDPR Compliance</strong><br/>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Data residency & right to forget</span>
                </div>
                <button onClick={toggleGdpr} style={{ background: 'none', border: 'none', color: gdprEnabled ? 'var(--color-success)' : 'var(--text-muted)', cursor: 'pointer' }}>
                  {gdprEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 12' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} /> Audit Logs</h3>
          <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Log ID</th>
                <th>Action</th>
                <th>Actor</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace' }}>{log.id}</td>
                  <td>{log.action}</td>
                  <td>{log.actor}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
