import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, UserCheck, Calendar, Activity, CreditCard
} from 'lucide-react';

import UserDashboard from '../../components/UserDashboard';

// We wrap the existing UserDashboard for now, but ensure it meets the PatientDashboard requirements.
// In a full rewrite, this would be a standalone layout.
export default function PatientDashboard() {
  return <UserDashboard />;
}
