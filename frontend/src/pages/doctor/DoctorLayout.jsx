import {
  Bell,
  Calendar,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';

const navItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/doctor/schedule', label: 'Schedule', icon: Calendar },
  { path: '/doctor/patients', label: 'Patients', icon: Users },
  { path: '/doctor/consultation-setup', label: 'Consultation', icon: Video },
  { path: '/doctor/workspace', label: 'Workspace', icon: FileText },
  { path: '/doctor/messages', label: 'Messages', icon: MessageSquare },
  { path: '/doctor/notifications', label: 'Notifications', icon: Bell },
  { path: '/doctor/profile', label: 'Profile', icon: UserCheck },
  { path: '/doctor/settings', label: 'Settings', icon: Settings },
];

export default function DoctorLayout() {
  return <PortalLayout navItems={navItems} avatarFallback="Dr" />;
}
