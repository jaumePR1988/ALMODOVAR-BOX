import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SplashScreen } from './components/SplashScreen';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { TermsView } from './views/TermsView';
import { PrivacyView } from './views/PrivacyView';
import { HelpView } from './views/HelpView';
import { WaitingApprovalView } from './views/WaitingApprovalView';
import { useAuth } from './context/AuthContext';

import { ClientDashboardView } from './views/ClientDashboardView';
import { HomeView } from './views/dashboard/HomeView';
import { ScheduleView } from './views/dashboard/ScheduleView';
import { RetosView } from './views/RetosView';
import { NewsView } from './views/NewsView';
import { PerfilView } from './views/PerfilView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { NotificationsSettingsView } from './views/NotificationsSettingsView';
import { NotificationsView } from './views/NotificationsView';
import { CommunityChatView } from './views/CommunityChatView';
import { ClassDetailView } from './views/ClassDetailView';
import { EvolutionView } from './views/EvolutionView';

import { CoachDashboardView } from './views/CoachDashboardView';
import { CoachAddExerciseView } from './views/CoachAddExerciseView';
import CoachLibraryView from './views/CoachLibraryView';

function App() {
  const [splashLoading, setSplashLoading] = useState(true);
  const { user, isApproved, role, loading: authLoading } = useAuth();

  if (splashLoading || authLoading) {
    return <SplashScreen onComplete={() => setSplashLoading(false)} loading={authLoading} />;
  }

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas - Redirección Inteligente según Rol */}
        <Route path="/login" element={
          user ? (
            isApproved ? (
              role === 'coach' ? <Navigate to="/coach-dashboard" replace /> : <Navigate to="/dashboard" replace />
            ) : <Navigate to="/waiting-approval" replace />
          ) : <LoginView />
        } />
        <Route path="/register" element={
          user ? (
            isApproved ? (
              role === 'coach' ? <Navigate to="/coach-dashboard" replace /> : <Navigate to="/dashboard" replace />
            ) : <Navigate to="/waiting-approval" replace />
          ) : <RegisterView />
        } />
        <Route path="/terms" element={<TermsView />} />
        <Route path="/privacy" element={<PrivacyView />} />
        <Route path="/help" element={<HelpView />} />

        {/* Ruta de Espera de Aprobación */}
        <Route path="/waiting-approval" element={
          user ? (!isApproved ? <WaitingApprovalView /> : <Navigate to="/login" replace />) : <Navigate to="/login" replace />
        } />

        {/* Rutas Privadas: Coach Dashboard */}
        <Route path="/coach-dashboard" element={
          user ? (
            isApproved && role === 'coach' ? <CoachDashboardView /> : <Navigate to="/dashboard" replace />
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/coach/add-exercise" element={
          user ? (
            isApproved && role === 'coach' ? <CoachAddExerciseView /> : <Navigate to="/dashboard" replace />
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/coach/library" element={
          user ? (
            isApproved && role === 'coach' ? <CoachLibraryView /> : <Navigate to="/dashboard" replace />
          ) : <Navigate to="/login" replace />
        } />

        {/* Rutas Privadas: Client Dashboard */}
        <Route path="/dashboard" element={
          user ? (
            isApproved ? (
              role === 'coach' ? <Navigate to="/coach-dashboard" replace /> : <ClientDashboardView />
            ) : <Navigate to="/waiting-approval" replace />
          ) : <Navigate to="/login" replace />
        }>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeView />} />
          <Route path="schedule" element={<ScheduleView />} />
          <Route path="challenges" element={<RetosView />} />
          <Route path="news" element={<NewsView />} />
          <Route path="profile" element={<PerfilView />} />
          <Route path="settings" element={<ProfileSettingsView />} />
          <Route path="settings/notifications" element={<NotificationsSettingsView />} />
          <Route path="notifications" element={<NotificationsView />} />
          <Route path="chat" element={<CommunityChatView />} />
          <Route path="class-detail" element={<ClassDetailView />} />
          <Route path="profile/evolution" element={<EvolutionView />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App
