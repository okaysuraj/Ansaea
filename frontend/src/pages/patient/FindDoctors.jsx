import React from 'react';
import PsychiatristDirectory from '../../components/PsychiatristDirectory';

export default function FindDoctors() {
  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Find & Book Specialists</h1>
      </div>
      <PsychiatristDirectory />
    </div>
  );
}
