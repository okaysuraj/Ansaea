import { ArrowLeft, CheckCircle2, Pill, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DrugInteractionWarning() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 style={{ margin: 0 }}>Drug Interaction Screening</h1>
          <span className="text-caption">
            Automated clinical pharmacology & contraindication checks
          </span>
        </div>
      </div>

      <div
        className="card card-padding"
        style={{
          borderLeft: '4px solid var(--status-warning)',
          background: 'var(--status-warning-subtle)',
          color: '#7C4A03',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <ShieldAlert
            size={24}
            style={{ color: 'var(--status-warning)', flexShrink: 0, marginTop: '2px' }}
          />
          <div>
            <h3 style={{ margin: '0 0 var(--space-1)', color: '#7C4A03' }}>
              Potential Moderate Interaction Detected
            </h3>
            <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.5 }}>
              Combining <strong>Aspirin</strong> with <strong>Warfarin</strong> significantly
              elevates systemic bleeding risks due to synergistic anti-platelet and anticoagulant
              actions.
            </p>
          </div>
        </div>
      </div>

      <div className="card card-padding">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Clinical Guidance & Recommendation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="card card-padding-sm" style={{ background: 'var(--surface-0)' }}>
            <h4
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-1)',
              }}
            >
              <Pill size={16} style={{ color: 'var(--accent)' }} /> Action Required Prior to
              Dispensing
            </h4>
            <p className="text-caption" style={{ margin: 0 }}>
              Consult the prescribing physician to determine whether INR monitoring should be
              intensified or if an alternative non-interacting analgesia (e.g., Acetaminophen) is
              appropriate.
            </p>
          </div>

          <div className="card card-padding-sm" style={{ background: 'var(--surface-0)' }}>
            <h4
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-1)',
              }}
            >
              <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} /> Patient
              Counseling Advisory
            </h4>
            <p className="text-caption" style={{ margin: 0 }}>
              Advise the patient to monitor for unusual bruising, bleeding gums, or dark stools, and
              to report any adverse events immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
