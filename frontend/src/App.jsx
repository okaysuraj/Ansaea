import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages (Phase 1)
import SplashScreen from './pages/auth/SplashScreen';
import AppIntroduction from './pages/auth/AppIntroduction';
import LoginScreen from './pages/auth/LoginScreen';
import RegisterScreen from './pages/auth/RegisterScreen';
import ForgotPassword from './pages/auth/ForgotPassword';
import OtpVerification from './pages/auth/OtpVerification';
import RoleSelection from './pages/auth/RoleSelection';

// Patient Pages (Phase 2 & 5)
import PatientLayout from './pages/patient/PatientLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import FindDoctors from './pages/patient/FindDoctors';
import MyAppointments from './pages/patient/MyAppointments';
import PatientProfile from './pages/patient/PatientProfile';
import EditProfile from './pages/patient/EditProfile';
import MedicalHistorySetup from './pages/patient/MedicalHistorySetup';
import BloodPressureHistory from './pages/patient/BloodPressureHistory';
import BloodSugarHistory from './pages/patient/BloodSugarHistory';
import WeightBmiTracker from './pages/patient/WeightBmiTracker';
import SleepTracker from './pages/patient/SleepTracker';
import StressTracker from './pages/patient/StressTracker';
import BookingSuccess from './pages/patient/BookingSuccess';
import MedicalRecords from './pages/patient/MedicalRecords';
import HealthMetrics from './pages/patient/HealthMetrics';
import MentalHealthTrackers from './pages/patient/MentalHealthTrackers';
import DailyMoodCheckIn from './pages/patient/DailyMoodCheckIn';

// Doctor Pages (Phase 3 & 4)
import DoctorLayout from './pages/doctor/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import SlotManagement from './pages/doctor/SlotManagement';
import PatientDirectory from './pages/doctor/PatientDirectory';
import ConsultationSetup from './pages/doctor/ConsultationSetup';
import ConsultationWorkspace from './pages/doctor/ConsultationWorkspace';
import PatientProfileView from './pages/doctor/PatientProfileView';
import SettingsHome from './pages/doctor/SettingsHome';

// Shared Pages (Phase 4)
import MessagesInbox from './pages/shared/MessagesInbox';
import NotificationsCenter from './pages/shared/NotificationsCenter';
import NotificationSettings from './pages/shared/NotificationSettings';



// Admin Pages (Phase 7)
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Lab Pages (Phase 6)
import LabLayout from './pages/lab/LabLayout';
import LabDashboard from './pages/lab/LabDashboard';

// Pharmacy Pages (Phase 6)
import PharmacyLayout from './pages/pharmacy/PharmacyLayout';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }
  return children;
}

function RoleRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  if (user.role === 'lab') return <Navigate to="/lab/dashboard" />;
  if (user.role === 'pharmacy') return <Navigate to="/pharmacy/dashboard" />;
  
  return <Navigate to="/patient/dashboard" />;
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#fff' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Flows */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/intro" element={<AppIntroduction />} />
      <Route path="/login" element={user ? <RoleRouter /> : <LoginScreen />} />
      <Route path="/register" element={user ? <RoleRouter /> : <RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/role-selection" element={user ? <RoleSelection /> : <Navigate to="/login" />} />
      
      {/* Role Director */}
      <Route path="/dashboard" element={<RoleRouter />} />

      {/* Patient Portal */}
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient', 'user']}><PatientLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="find-doctors" element={<FindDoctors />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="booking-success" element={<BookingSuccess />} />
        <Route path="medical-history" element={<MedicalHistorySetup />} />
        <Route path="blood-pressure" element={<BloodPressureHistory />} />
        <Route path="blood-sugar" element={<BloodSugarHistory />} />
        <Route path="weight-bmi" element={<WeightBmiTracker />} />
        <Route path="sleep-tracker" element={<SleepTracker />} />
        <Route path="stress-tracker" element={<StressTracker />} />
        <Route path="records" element={<MedicalRecords />} />
        <Route path="health-metrics" element={<HealthMetrics />} />
        <Route path="mental-health" element={<MentalHealthTrackers />} />
        <Route path="mood-check-in" element={<DailyMoodCheckIn />} />
        <Route path="messages" element={<MessagesInbox />} />
        <Route path="notifications" element={<NotificationsCenter />} />
        <Route path="notification-settings" element={<NotificationSettings />} />
      </Route>

      {/* Doctor Portal */}
      <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="schedule" element={<SlotManagement />} />
        <Route path="patients" element={<PatientDirectory />} />
        <Route path="patients/:id" element={<PatientProfileView />} />
        <Route path="consultation-setup" element={<ConsultationSetup />} />
        <Route path="workspace" element={<ConsultationWorkspace />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="settings" element={<SettingsHome />} />
        <Route path="messages" element={<MessagesInbox />} />
        <Route path="notifications" element={<NotificationsCenter />} />
        <Route path="notification-settings" element={<NotificationSettings />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Placeholders for others */}
        <Route path="users" element={<AdminDashboard />} />
        <Route path="billing" element={<AdminDashboard />} />
      </Route>

      {/* Lab Portal */}
      <Route path="/lab" element={<ProtectedRoute allowedRoles={['lab']}><LabLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<LabDashboard />} />
        <Route path="tests" element={<LabDashboard />} />
        <Route path="reports" element={<LabDashboard />} />
        <Route path="quality" element={<LabDashboard />} />
      </Route>

      {/* Pharmacy Portal */}
      <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={['pharmacy']}><PharmacyLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<PharmacyDashboard />} />
        <Route path="orders" element={<PharmacyDashboard />} />
        <Route path="inventory" element={<PharmacyDashboard />} />
        <Route path="invoices" element={<PharmacyDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
