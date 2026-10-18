import {
  Activity,
  Bell,
  BrainCircuit,
  Calendar,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Search,
  UserCheck,
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';

const navItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patient/find-doctors', label: 'Find Doctors', icon: Search },
  { path: '/patient/appointments', label: 'Appointments', icon: Calendar },
  { path: '/patient/health-metrics', label: 'Health Metrics', icon: Activity },
  { path: '/patient/mental-health', label: 'Mental Health', icon: BrainCircuit },
  { path: '/patient/records', label: 'Records', icon: FileText },
  { path: '/patient/messages', label: 'Messages', icon: MessageSquare },
  { path: '/patient/notifications', label: 'Notifications', icon: Bell },
  { path: '/patient/profile', label: 'Profile', icon: UserCheck },
];

export default function PatientLayout() {
  return <PortalLayout navItems={navItems} />;
}
