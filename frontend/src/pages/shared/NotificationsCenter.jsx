import React from 'react';
import { Bell, ShieldAlert, FileText, Calendar } from 'lucide-react';

export default function NotificationsCenter() {
  const mockNotifications = [
    { id: 1, type: 'alert', title: 'Abnormal Vitals Detected', desc: 'Heart rate spiked above 120bpm during resting period.', time: '10 mins ago', icon: ShieldAlert, color: '#ef4444' },
    { id: 2, type: 'info', title: 'Lab Report Available', desc: 'Your comprehensive blood panel results have been uploaded.', time: '2 hours ago', icon: FileText, color: '#3b82f6' },
    { id: 3, type: 'success', title: 'Appointment Confirmed', desc: 'Your video consultation with Dr. Robert Chen is confirmed for tomorrow.', time: '1 day ago', icon: Calendar, color: '#22c55e' }
  ];

  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Notifications</h1>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockNotifications.map(notif => {
            const Icon = notif.icon;
            return (
              <div key={notif.id} style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${notif.color}15`, color: notif.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{notif.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{notif.time}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{notif.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
