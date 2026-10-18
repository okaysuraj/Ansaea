import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/** Shared navigation shell; each role supplies its own links and label. */
export default function PortalLayout({ navItems, sectionLabel, avatarFallback = 'U' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-container">
      <button
        className="mobile-nav-toggle"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Toggle navigation"
        aria-expanded={sidebarOpen}
        aria-controls="portal-navigation"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {sidebarOpen && (
        <div className="sidebar-overlay open" onClick={() => setSidebarOpen(false)} />
      )}

      <nav id="portal-navigation" className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Ansaea" />
          <span>Ansaea</span>
        </div>
        {sectionLabel && <div className="sidebar-section-label">{sectionLabel}</div>}

        <ul className="nav-links">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path.endsWith('/dashboard')}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} /> {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.username?.slice(0, 2).toUpperCase() || avatarFallback}
            </div>
            <div>
              <div className="user-name">{user?.username}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{ color: 'var(--status-danger)' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </nav>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
