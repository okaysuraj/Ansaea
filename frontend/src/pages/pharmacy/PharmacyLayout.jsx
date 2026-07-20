import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Pill, Package, FileText, LogOut } from 'lucide-react';

export default function PharmacyLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/pharmacy/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/pharmacy/orders', label: 'Order Fulfillment', icon: Pill },
    { path: '/pharmacy/inventory', label: 'Inventory', icon: Package },
    { path: '/pharmacy/invoices', label: 'Invoices', icon: FileText }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="sidebar" style={{ borderRightColor: 'rgba(34, 197, 94, 0.2)' }}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} />
          <span>Ansaea Pharmacy</span>
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
            <div className="user-avatar" style={{ background: '#16a34a' }}>{user?.username?.substring(0, 2).toUpperCase() || 'PH'}</div>
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
