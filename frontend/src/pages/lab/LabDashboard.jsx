import { CheckCircle, Clock, FlaskConical, Microscope, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

export default function LabDashboard() {
  const { authenticatedFetch } = useAuth();
  const [error, setError] = useState('');
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await authenticatedFetch('/lab/requests');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTests(
              data.map((t) => ({
                id: t.id || 'REQ-01',
                displayId: t.id ? t.id.substring(0, 8) : 'REQ-01',
                patient: t.patient_id
                  ? `Patient #${t.patient_id.substring(0, 6)}`
                  : 'Patient #8391',
                test: Array.isArray(t.test_names)
                  ? t.test_names.join(', ')
                  : 'Metabolic Panel & Cortisol',
                status: t.status || 'pending',
                date: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Today',
              })),
            );
          }
        }
      } catch (e) {
        console.error(e);
        setError(e.message || 'Unable to load data.');
      }
    };
    fetchRequests();
  }, [authenticatedFetch]);

  const handleCollect = async (id) => {
    setTests(tests.map((t) => (t.id === id ? { ...t, status: 'sample_collected' } : t)));
    try {
      await authenticatedFetch(`/lab/requests/${id}/status?status=sample_collected`, {
        method: 'PATCH',
      });
    } catch (error) {
      setError(error.message || 'Unable to save changes.');
    }
  };

  const handleUpload = async (id) => {
    setTests(tests.map((t) => (t.id === id ? { ...t, status: 'completed' } : t)));
    try {
      await authenticatedFetch(`/lab/requests/${id}/status?status=completed`, { method: 'PATCH' });
    } catch (error) {
      setError(error.message || 'Unable to save changes.');
    }
  };

  const pendingCount = tests.filter((t) => t.status === 'pending').length;
  const inProgressCount = tests.filter((t) => t.status === 'sample_collected').length;

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
            Diagnostics & Pathology
          </span>
          <h1>Laboratory Portal</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Manage requisition queues, specimen intake, and diagnostic report publishing.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="badge badge-success">
            <FlaskConical size={13} /> CLIA Certified Lab
          </span>
        </div>
      </div>

      {/* Bento Stat Grid */}
      <div className="bento-grid bento-grid-3">
        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">Pending Intake</span>
            <span className="stat-icon">
              <Clock size={16} />
            </span>
          </div>
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-change" style={{ color: 'var(--status-warning)' }}>
            Requires specimen draw
          </div>
        </div>

        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">Analyzing Samples</span>
            <span className="stat-icon">
              <Microscope size={16} />
            </span>
          </div>
          <div className="stat-value">{inProgressCount}</div>
          <div className="stat-change" style={{ color: 'var(--accent)' }}>
            Under automated assay
          </div>
        </div>

        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">Average TAT</span>
            <span className="stat-icon">
              <CheckCircle size={16} />
            </span>
          </div>
          <div className="stat-value">4.2h</div>
          <div className="stat-change" style={{ color: 'var(--status-success)' }}>
            Well within 24h SLA limit
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}
      >
        {/* Test Requests Table */}
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
              <h3>Diagnostics Requisitions</h3>
              <p className="text-caption">
                Doctor-ordered blood panels, toxicology, and metabolic testing
              </p>
            </div>
            <span className="badge badge-accent">{tests.length} requests</span>
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
                    Req ID
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Patient
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Ordered Tests
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span className="text-mono" style={{ fontSize: '0.8125rem' }}>
                        {test.displayId || test.id}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {test.patient}
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {test.test}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span
                        className={`badge ${test.status === 'pending' ? 'badge-danger' : test.status === 'sample_collected' ? 'badge-warning' : 'badge-success'}`}
                      >
                        {test.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                      {test.status === 'pending' && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleCollect(test.id)}
                        >
                          Mark Collected
                        </button>
                      )}
                      {test.status === 'sample_collected' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpload(test.id)}
                        >
                          <Upload size={13} /> Upload Report
                        </button>
                      )}
                      {test.status === 'completed' && (
                        <span
                          style={{
                            color: 'var(--status-success)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                          }}
                        >
                          <CheckCircle size={14} /> Delivered
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lab Metrics and Recent Files */}
        <div
          style={{
            gridColumn: 'span 4',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          <div className="card card-padding">
            <h4 style={{ marginBottom: 'var(--space-2)' }}>Quality Assurance & TAT</h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              Turnaround telemetry over past 7 days
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div
                style={{
                  padding: 'var(--space-3)',
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Average Turnaround</div>
                  <div className="text-caption">Sample draw to PDF report</div>
                </div>
                <span className="text-mono" style={{ fontWeight: '700', color: 'var(--accent)' }}>
                  4.2 hrs
                </span>
              </div>

              <div
                style={{
                  padding: 'var(--space-3)',
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>SLA Breaches</div>
                  <div className="text-caption">Turnaround &gt; 24 hours</div>
                </div>
                <span
                  className="text-mono"
                  style={{ fontWeight: '700', color: 'var(--status-success)' }}
                >
                  0
                </span>
              </div>
            </div>
          </div>

          <div className="card card-padding">
            <h4 style={{ marginBottom: 'var(--space-2)' }}>Recent Diagnostic Deliveries</h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              Dispatched to attending psychiatrists
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-2) 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.8125rem' }}>
                    Neurotransmitter Panel
                  </div>
                  <div className="text-caption">Patient #9921 • Sent via HL7/FHIR</div>
                </div>
                <span className="badge badge-success">Delivered</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-2) 0',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.8125rem' }}>
                    Comprehensive Metabolic
                  </div>
                  <div className="text-caption">Patient #7743 • PDF attached</div>
                </div>
                <span className="badge badge-success">Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
