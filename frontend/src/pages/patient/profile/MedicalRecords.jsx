import React from 'react';
import MedicalRecordsComp from '../../../components/MedicalRecords';

export default function MedicalRecords() {
  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Medical Records & Timeline</h1>
      </div>
      <MedicalRecordsComp />
    </div>
  );
}
