import { FileText, LayoutDashboard, Package, Pill } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';

const navItems = [
  { path: '/pharmacy/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/pharmacy/orders', label: 'Orders', icon: Pill },
  { path: '/pharmacy/inventory', label: 'Inventory', icon: Package },
  { path: '/pharmacy/invoices', label: 'Invoices', icon: FileText },
];

export default function PharmacyLayout() {
  return <PortalLayout navItems={navItems} sectionLabel="Pharmacy" avatarFallback="PH" />;
}
