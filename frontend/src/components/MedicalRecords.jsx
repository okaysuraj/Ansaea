import React, { useState, useEffect } from 'react';
import { FileText, Upload, Download, FileImage, File } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MedicalRecords() {
  const { authenticatedFetch } = useAuth();
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const res = await authenticatedFetch('/api/tracker/records');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [authenticatedFetch]);

  const handleUpload = async () => {
    try {
      await authenticatedFetch('/api/tracker/records', {
        method: 'POST',
        body: JSON.stringify({
          title: 'CBC Blood Test',
          record_type: 'Lab Report',
          file_url: 'https://example.com/report.pdf'
        })
      });
      fetchRecords(); // Refresh
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Lab Report': return <FileText className="text-blue-500" />;
      case 'Scan': return <FileImage className="text-primary" />;
      default: return <File className="text-green-500" />;
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Medical Records</h3>
        <button onClick={handleUpload} className="auth-submit-btn" style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Upload size={16} /> Upload Demo Record
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>No medical records uploaded yet.</div>
        ) : records.map(record => (
          <div key={record.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               {getIcon(record.record_type)}
               <div>
                 <div style={{ fontWeight: '500' }}>{record.title}</div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                   {record.record_type} • {new Date(record.date).toLocaleDateString()}
                 </div>
               </div>
            </div>
            <button className="icon-btn" title="Download">
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
