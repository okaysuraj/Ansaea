import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

// Layouts (Loaded immediately for instant chrome/shell rendering)
import AdminLayout from './pages/admin/AdminLayout';
import DoctorLayout from './pages/doctor/DoctorLayout';
import LabLayout from './pages/lab/LabLayout';
import PatientLayout from './pages/patient/PatientLayout';
import PharmacyLayout from './pages/pharmacy/PharmacyLayout';

// Auth Pages (Lazy Loaded)
const SplashScreen = lazy(() => import('./pages/auth/SplashScreen'));
const AppIntroduction = lazy(() => import('./pages/auth/AppIntroduction'));
const LoginScreen = lazy(() => import('./pages/auth/LoginScreen'));
const RegisterScreen = lazy(() => import('./pages/auth/RegisterScreen'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const OtpVerification = lazy(() => import('./pages/auth/OtpVerification'));
const RoleSelection = lazy(() => import('./pages/auth/RoleSelection'));

// Patient Pages (Lazy Loaded)
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));
const FindDoctors = lazy(() => import('./pages/patient/appointments/FindDoctors'));
const MyAppointments = lazy(() => import('./pages/patient/appointments/MyAppointments'));
const PatientProfile = lazy(() => import('./pages/patient/profile/PatientProfile'));
const EditProfile = lazy(() => import('./pages/patient/profile/EditProfile'));
const MedicalHistorySetup = lazy(() => import('./pages/patient/profile/MedicalHistorySetup'));
const BloodPressureHistory = lazy(() => import('./pages/patient/metrics/BloodPressureHistory'));
const BloodSugarHistory = lazy(() => import('./pages/patient/metrics/BloodSugarHistory'));
const WeightBmiTracker = lazy(() => import('./pages/patient/metrics/WeightBmiTracker'));
const SleepTracker = lazy(() => import('./pages/patient/metrics/SleepTracker'));
const StressTracker = lazy(() => import('./pages/patient/metrics/StressTracker'));
const BookingSuccess = lazy(() => import('./pages/patient/appointments/BookingSuccess'));
const MedicalRecords = lazy(() => import('./pages/patient/profile/MedicalRecords'));
const HealthMetrics = lazy(() => import('./pages/patient/metrics/HealthMetrics'));
const MentalHealthTrackers = lazy(() => import('./pages/patient/metrics/MentalHealthTrackers'));
const DailyMoodCheckIn = lazy(() => import('./pages/patient/metrics/DailyMoodCheckIn'));

// Doctor Pages (Lazy Loaded)
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const DoctorProfile = lazy(() => import('./pages/doctor/profile/DoctorProfile'));
const SlotManagement = lazy(() => import('./pages/doctor/appointments/SlotManagement'));
const PatientDirectory = lazy(() => import('./pages/doctor/patients/PatientDirectory'));
const ConsultationSetup = lazy(() => import('./pages/doctor/consultations/ConsultationSetup'));
const ConsultationWorkspace = lazy(
  () => import('./pages/doctor/consultations/ConsultationWorkspace'),
);
const PatientProfileView = lazy(() => import('./pages/doctor/patients/PatientProfileView'));
const SettingsHome = lazy(() => import('./pages/doctor/settings/SettingsHome'));

// Shared & Enterprise Pages (Lazy Loaded)
const MessagesInbox = lazy(() => import('./pages/shared/MessagesInbox'));
const NotificationsCenter = lazy(() => import('./pages/shared/NotificationsCenter'));
const NotificationSettings = lazy(() => import('./pages/shared/NotificationSettings'));
const BillingInvoices = lazy(() => import('./pages/shared/BillingInvoices'));
const EarningsOverview = lazy(() => import('./pages/shared/EarningsOverview'));
const EmergencyContacts = lazy(() => import('./pages/shared/emergency_contacts'));
const LanguageAccessibility = lazy(() => import('./pages/shared/language_accessibility'));
const DisputeResolution = lazy(() => import('./pages/shared/dispute_resolution'));
const FraudAbuseMonitoring = lazy(() => import('./pages/shared/fraud_abuse_monitoring'));
const SampleCollectionTracking = lazy(() => import('./pages/shared/SampleCollectionTracking'));
const OCRPreviewTagging = lazy(() => import('./pages/shared/ocr_preview_tagging'));
const DrugInteractionWarning = lazy(() => import('./pages/shared/DrugInteractionWarning'));

// Admin Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));

// Lab Pages (Lazy Loaded)
const LabDashboard = lazy(() => import('./pages/lab/LabDashboard'));

// Pharmacy Pages (Lazy Loaded)
const PharmacyDashboard = lazy(() => import('./pages/pharmacy/PharmacyDashboard'));

function RouteLoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '60vh',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--space-3)',
        color: 'var(--text-secondary)',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          border: '2.5px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.7s cubic-bezier(0.23, 1, 0.32, 1) infinite',
        }}
      />
      <span style={{ fontSize: '0.875rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
        Loading experience...
      </span>
    </div>
  );
}

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
      <div
        style={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--surface-0)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '600' }}>Loading Ansaea...</h3>
      </div>
    );
  }

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Auth Flows */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/intro" element={<AppIntroduction />} />
        <Route path="/login" element={user ? <RoleRouter /> : <LoginScreen />} />
        <Route path="/register" element={user ? <RoleRouter /> : <RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route
          path="/role-selection"
          element={user ? <RoleSelection /> : <Navigate to="/login" />}
        />

        {/* Role Director */}
        <Route path="/dashboard" element={<RoleRouter />} />

        {/* Patient Portal */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['patient', 'user']}>
              <PatientLayout />
            </ProtectedRoute>
          }
        >
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
          <Route path="billing" element={<BillingInvoices />} />
          <Route path="emergency-contacts" element={<EmergencyContacts />} />
          <Route path="accessibility" element={<LanguageAccessibility />} />
          <Route path="drug-interactions" element={<DrugInteractionWarning />} />
        </Route>

        {/* Doctor Portal */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="schedule" element={<SlotManagement />} />
          <Route path="patients" element={<PatientDirectory />} />
          <Route path="patients/:id" element={<PatientProfileView />} />
          <Route path="consultation-setup" element={<ConsultationSetup />} />
          <Route path="workspace" element={<ConsultationWorkspace />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="settings" element={<SettingsHome />} />
          <Route path="earnings" element={<EarningsOverview />} />
          <Route path="ocr-preview" element={<OCRPreviewTagging />} />
          <Route path="accessibility" element={<LanguageAccessibility />} />
          <Route path="messages" element={<MessagesInbox />} />
          <Route path="notifications" element={<NotificationsCenter />} />
          <Route path="notification-settings" element={<NotificationSettings />} />
          <Route path="drug-interactions" element={<DrugInteractionWarning />} />
        </Route>

        {/* Admin Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="billing" element={<BillingInvoices />} />
          <Route path="disputes" element={<DisputeResolution />} />
          <Route path="fraud-monitoring" element={<FraudAbuseMonitoring />} />
        </Route>

        {/* Lab Portal */}
        <Route
          path="/lab"
          element={
            <ProtectedRoute allowedRoles={['lab']}>
              <LabLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<LabDashboard />} />
          <Route path="tests" element={<LabDashboard />} />
          <Route path="reports" element={<LabDashboard />} />
          <Route path="quality" element={<LabDashboard />} />
          <Route path="sample-tracking" element={<SampleCollectionTracking />} />
          <Route path="ocr-preview" element={<OCRPreviewTagging />} />
        </Route>

        {/* Pharmacy Portal */}
        <Route
          path="/pharmacy"
          element={
            <ProtectedRoute allowedRoles={['pharmacy']}>
              <PharmacyLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PharmacyDashboard />} />
          <Route path="orders" element={<PharmacyDashboard />} />
          <Route path="inventory" element={<PharmacyDashboard />} />
          <Route path="invoices" element={<PharmacyDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
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
