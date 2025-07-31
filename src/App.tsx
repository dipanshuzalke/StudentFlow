import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { RegisterForm } from './components/auth/RegisterForm';
import { LoginForm } from './components/auth/LoginForm';
import AuroraHero from './components/AuroraHero';

function RegisterRoute() {
  const navigate = useNavigate();
  return <RegisterForm onToggleMode={() => navigate('/login')} />;
}

function LoginRoute() {
  const navigate = useNavigate();
  return <LoginForm onToggleMode={() => navigate('/register')} />;
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Only show Navbar if not on /home */}
      {location.pathname !== '/' && <Navbar />}
      <main>
        <Routes>
          <Route path="/register" element={<RegisterRoute />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/" element={<AuroraHero />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;