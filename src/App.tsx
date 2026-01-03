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
import { DashboardView } from './views/DashboardView';

function App() {
  const [splashLoading, setSplashLoading] = useState(true);
  const { user, isApproved, loading: authLoading } = useAuth();

  if (splashLoading || authLoading) {
    return <SplashScreen onComplete={() => setSplashLoading(false)} loading={authLoading} />;
  }

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={
          user ? (isApproved ? <Navigate to="/dashboard" replace /> : <Navigate to="/waiting-approval" replace />) : <LoginView />
        } />
        <Route path="/register" element={
          user ? (isApproved ? <Navigate to="/dashboard" replace /> : <Navigate to="/waiting-approval" replace />) : <RegisterView />
        } />
        <Route path="/terms" element={<TermsView />} />
        <Route path="/privacy" element={<PrivacyView />} />
        <Route path="/help" element={<HelpView />} />

        {/* Ruta de Espera de Aprobación */}
        <Route path="/waiting-approval" element={
          user ? (!isApproved ? <WaitingApprovalView /> : <Navigate to="/dashboard" replace />) : <Navigate to="/login" replace />
        } />

        {/* Rutas Privadas (Protegidas) */}
        <Route path="/dashboard" element={
          user ? (isApproved ? <DashboardView /> : <Navigate to="/waiting-approval" replace />) : <Navigate to="/login" replace />
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App
