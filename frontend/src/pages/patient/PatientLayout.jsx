import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, UserCheck, Calendar, Search, LogOut, FileText, Activity, BrainCircuit, MessageSquare, Bell } from 'lucide-react';

export default function PatientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/patient/find-doctors', label: 'Find Doctors', icon: Search },
    { path: '/patient/appointments', label: 'My Appointments', icon: Calendar },
    { path: '/patient/health-metrics', label: 'Health Metrics', icon: Activity },
    { path: '/patient/mental-health', label: 'Mental Health', icon: BrainCircuit },
    { path: '/patient/records', label: 'Medical Records', icon: FileText },
    { path: '/patient/messages', label: 'Messages', icon: MessageSquare },
    { path: '/patient/notifications', label: 'Notifications', icon: Bell },
    { path: '/patient/profile', label: 'Profile & Billing', icon: UserCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} />
          <span>Ansaea Patient</span>
        </div>

        <ul className="nav-links">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  <Icon size={18} /> {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="nav-footer">
          <div className="user-profile">
            <div className="user-avatar">{user?.username?.substring(0, 2).toUpperCase() || 'U'}</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user?.username}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{ background: 'transparent', border: 'none', width: '100%', color: 'var(--color-danger)', gap: '1rem', marginTop: '0.5rem' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </nav>

      <div style={{ flex: 1, marginLeft: '280px', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
}
