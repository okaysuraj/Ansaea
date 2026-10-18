import {
  Activity,
  CheckCircle,
  Lock,
  Server,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Users,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

export default function AdminDashboard() {
  const { authenticatedFetch } = useAuth();
  const [error, setError] = useState('');

  const [approvals, setApprovals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [hipaaEnabled, setHipaaEnabled] = useState(true);
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [stats, setStats] = useState({ uptime: '99.99%', active_users: 142 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, logRes, statRes, setRes] = await Promise.all([
          authenticatedFetch('/admin/approvals'),
          authenticatedFetch('/admin/audit-logs'),
          authenticatedFetch('/admin/system-health'),
          authenticatedFetch('/admin/settings'),
        ]);

        if (appRes.ok) setApprovals(await appRes.json());
        if (logRes.ok) setAuditLogs(await logRes.json());
        if (statRes.ok) setStats(await statRes.json());
        if (setRes.ok) {
          const settings = await setRes.json();
          if (settings.hipaa_mode !== undefined) setHipaaEnabled(settings.hipaa_mode);
          if (settings.gdpr_mode !== undefined) setGdprEnabled(settings.gdpr_mode);
        }
      } catch (e) {
        console.error('Admin fetch error', e);
        setError(e.message || 'Unable to load data.');
      }
    };
    fetchData();
  }, [authenticatedFetch]);

  const handleApprove = async (id) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: 'approved' } : a)));
    try {
      await authenticatedFetch(`/admin/approvals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'approved' }),
      });
      const logRes = await authenticatedFetch('/admin/audit-logs');
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch (error) {
      setError(error.message || 'Unable to save changes.');
    }
  };

  const handleReject = async (id) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
    try {
      await authenticatedFetch(`/admin/approvals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'rejected' }),
      });
      const logRes = await authenticatedFetch('/admin/audit-logs');
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch (error) {
      setError(error.message || 'Unable to save changes.');
    }
  };

  const toggleHipaa = async () => {
    const newVal = !hipaaEnabled;
    setHipaaEnabled(newVal);
    try {
      await authenticatedFetch('/admin/settings/hipaa_mode', {
        method: 'PATCH',
        body: JSON.stringify({ setting_value: newVal }),
      });
      const logRes = await authenticatedFetch('/admin/audit-logs');
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch (error) {
      setError(error.message || 'Unable to save changes.');
    }
  };

  const toggleGdpr = async () => {
    const newVal = !gdprEnabled;
    setGdprEnabled(newVal);
    try {
      await authenticatedFetch('/admin/settings/gdpr_mode', {
        method: 'PATCH',
        body: JSON.stringify({ setting_value: newVal }),
      });
      const logRes = await authenticatedFetch('/admin/audit-logs');
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch (error) {
      setError(error.message || 'Unable to save changes.');
    }
  };

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {error && <p role="alert">{error}</p>}
      {/* Header section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>
            System Administration
          </span>
          <h1>Platform Operations & Compliance</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Oversee clinical verification queues, security protocols, and real-time audit journals.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="badge badge-success">
            <ShieldCheck size={13} /> Encrypted Enclave
          </span>
          <span className="badge badge-accent">Role: SuperAdmin</span>
        </div>
      </div>

      {/* Bento Stat Grid */}
      <div className="bento-grid bento-grid-3">
        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">Pending Verifications</span>
            <span className="stat-icon">
              <Users size={16} />
            </span>
          </div>
          <div className="stat-value">{pendingCount}</div>
          <div
            className="stat-change"
            style={{ color: pendingCount > 0 ? 'var(--status-warning)' : 'var(--status-success)' }}
          >
            {pendingCount > 0 ? 'Action required in queue' : 'All clinician credentials cleared'}
          </div>
        </div>

        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">System Uptime</span>
            <span className="stat-icon">
              <Activity size={16} />
            </span>
          </div>
          <div className="stat-value">{stats.uptime}</div>
          <div className="stat-change" style={{ color: 'var(--status-success)' }}>
            Zero SLA breaches past 30 days
          </div>
        </div>

        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">Active Users</span>
            <span className="stat-icon">
              <Server size={16} />
            </span>
          </div>
          <div className="stat-value">{stats.active_users}</div>
          <div className="stat-change" style={{ color: 'var(--text-tertiary)' }}>
            Across web & clinical nodes
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}
      >
        {/* Approvals Queue */}
        <div className="card card-padding" style={{ gridColumn: 'span 8' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div>
              <h3>Clinician Verification Queue</h3>
              <p className="text-caption">Medical license review and credential verification</p>
            </div>
            <span className="badge badge-accent">{approvals.length} total entries</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr
                  style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-tertiary)' }}
                >
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Doctor
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Specialty
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    License ID
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Status
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-3) var(--space-2)',
                      fontWeight: '600',
                      textAlign: 'right',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {doc.name}
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {doc.specialty}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span className="text-mono" style={{ fontSize: '0.8125rem' }}>
                        {doc.license}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span
                        className={`badge ${doc.status === 'approved' ? 'badge-success' : doc.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}
                      >
                        {doc.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                      {doc.status === 'pending' ? (
                        <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleApprove(doc.id)}
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleReject(doc.id)}
                            style={{ color: 'var(--status-danger)' }}
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-caption" style={{ color: 'var(--text-tertiary)' }}>
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance and Controls */}
        <div
          style={{
            gridColumn: 'span 4',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          <div className="card card-padding">
            <h4 style={{ marginBottom: 'var(--space-2)' }}>Compliance & Privacy Controls</h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              Statutory data governance and cryptography switches
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* HIPAA Toggle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3)',
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>HIPAA Enforcement</div>
                  <div className="text-caption">Field-level PHI encryption & anonymization</div>
                </div>
                <button
                  type="button"
                  onClick={toggleHipaa}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: hipaaEnabled ? 'var(--accent)' : 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title="Toggle HIPAA"
                >
                  {hipaaEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>

              {/* GDPR Toggle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3)',
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>GDPR Protocol</div>
                  <div className="text-caption">User consent tracking & right to erase</div>
                </div>
                <button
                  type="button"
                  onClick={toggleGdpr}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: gdprEnabled ? 'var(--accent)' : 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title="Toggle GDPR"
                >
                  {gdprEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>
            </div>
          </div>

          <div className="card card-padding" style={{ background: 'var(--surface-2)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
              <Lock size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Zero-Trust Audit Logs</div>
                <div className="text-caption" style={{ marginTop: 'var(--space-1)' }}>
                  All administrative mutations and approval approvals are cryptographically signed
                  with immutable hash chains.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="card card-padding" style={{ gridColumn: 'span 12' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div>
              <h3>System Security & Audit Journal</h3>
              <p className="text-caption">
                Chronological trail of administrative actions and access attempts
              </p>
            </div>
            <span className="badge badge-accent">Live Stream</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr
                  style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-tertiary)' }}
                >
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Event ID
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Action Code
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Actor Identity
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-3) var(--space-2)',
                      fontWeight: '600',
                      textAlign: 'right',
                    }}
                  >
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span className="text-mono" style={{ fontSize: '0.8125rem' }}>
                        {log.id}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span className="badge badge-accent">{log.action}</span>
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {log.actor}
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        color: 'var(--text-tertiary)',
                        textAlign: 'right',
                      }}
                    >
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
