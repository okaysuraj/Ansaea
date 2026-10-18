import { BarChart3, CreditCard, LayoutDashboard, Settings, Users } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';

const navItems = [
  { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/billing', label: 'Billing', icon: CreditCard },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  return <PortalLayout navItems={navItems} sectionLabel="Admin" avatarFallback="AD" />;
}
