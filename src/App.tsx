import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SplashScreen } from './components/SplashScreen';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { TermsView } from './views/TermsView';
import { PrivacyView } from './views/PrivacyView';
import { HelpView } from './views/HelpView';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          {loading ? (
            <SplashScreen onComplete={() => setLoading(false)} />
          ) : (
            <Routes>
              <Route path="/login" element={<LoginView />} />
              <Route path="/register" element={<RegisterView />} />
              <Route path="/terms" element={<TermsView />} />
              <Route path="/privacy" element={<PrivacyView />} />
              <Route path="/help" element={<HelpView />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              {/* Futuras rutas: /dashboard, /profile, etc. */}
            </Routes>
          )}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
