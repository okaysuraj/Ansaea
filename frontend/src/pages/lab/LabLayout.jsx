import { Activity, ClipboardList, FlaskConical, LayoutDashboard } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';

const navItems = [
  { path: '/lab/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/lab/tests', label: 'Test Catalog', icon: FlaskConical },
  { path: '/lab/reports', label: 'Lab Reports', icon: ClipboardList },
  { path: '/lab/quality', label: 'Quality Control', icon: Activity },
];

export default function LabLayout() {
  return <PortalLayout navItems={navItems} sectionLabel="Laboratory" avatarFallback="LB" />;
}
