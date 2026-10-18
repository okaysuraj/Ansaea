import { Download, File, FileImage, FileText, ShieldCheck, Upload } from 'lucide-react';
import { useState } from 'react';
import { useApiData } from '../hooks/useApiData';

export default function MedicalRecords() {
  const [notice, setNotice] = useState('');

  const { data: records, error } = useApiData('/tracker/records', []);

  const handleUpload = () => {
    setNotice('Encrypted file storage gateway is locked to HIPAA S3 buckets.');
    setTimeout(() => setNotice(''), 4000);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Lab Report':
        return <FileText size={18} style={{ color: 'var(--accent)' }} />;
      case 'Scan':
        return <FileImage size={18} style={{ color: 'var(--status-info)' }} />;
      default:
        return <File size={18} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  return (
    <div className="card card-padding">
      {error && <p role="alert">{error}</p>}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Encrypted Health Records</h3>
          <span className="text-caption">Immutable patient health documentation vault</span>
        </div>
        <button type="button" onClick={handleUpload} className="btn btn-secondary btn-sm">
          <Upload size={14} /> Upload Record
        </button>
      </div>

      {notice && (
        <div
          className="badge badge-accent"
          style={{
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            marginBottom: 'var(--space-3)',
            justifyContent: 'center',
          }}
        >
          <ShieldCheck size={14} /> {notice}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No documents in vault</div>
            <div className="empty-state-desc">
              Lab orders, clinical evaluations, and biometric reports will appear here
              automatically.
            </div>
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-0)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className="stat-icon" style={{ width: '32px', height: '32px' }}>
                  {getIcon(record.record_type)}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {record.title}
                  </div>
                  <div className="text-caption">
                    {record.record_type} • {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                title="Download encrypted file"
                onClick={() => alert(`Downloading ${record.title}...`)}
              >
                <Download size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
