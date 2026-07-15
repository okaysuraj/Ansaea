import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LayoutDashboard, Users, CreditCard, Settings, Activity, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Platform Overview', icon: LayoutDashboard },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/billing', label: 'Finances & Billing', icon: CreditCard },
    { path: '/admin/analytics', label: 'System Analytics', icon: Activity },
    { path: '/admin/settings', label: 'Platform Settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="sidebar" style={{ borderRightColor: 'rgba(239, 68, 68, 0.2)' }}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} />
          <span>Ansaea Admin</span>
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
            <div className="user-avatar" style={{ background: '#ef4444' }}>{user?.username?.substring(0, 2).toUpperCase() || 'AD'}</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user?.username}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="nav-item" style={{ background: 'transparent', border: 'none', width: '100%', color: 'var(--color-danger)', gap: '1rem', marginTop: '0.5rem' }}>
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
