import React, { useState } from 'react';
import { FileText, Upload, Download, FileImage, File } from 'lucide-react';

export default function MedicalRecords() {
  const [records, setRecords] = useState([
    { id: 1, title: 'Complete Blood Count', type: 'Lab Report', date: 'May 15, 2026', doctor: 'Dr. Smith', icon: <FileText className="text-blue-500" /> },
    { id: 2, title: 'Chest X-Ray', type: 'Scan', date: 'April 10, 2026', doctor: 'Dr. Jones', icon: <FileImage className="text-primary" /> },
    { id: 3, title: 'Lisinopril 10mg', type: 'Prescription', date: 'Jan 5, 2026', doctor: 'Dr. Smith', icon: <File className="text-green-500" /> },
  ]);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Medical Records</h3>
        <button className="auth-submit-btn" style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Upload size={16} /> Upload Record
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {records.map(record => (
          <div key={record.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               {record.icon}
               <div>
                 <div style={{ fontWeight: '500' }}>{record.title}</div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{record.type} • {record.date} • {record.doctor}</div>
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
