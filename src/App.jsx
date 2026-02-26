import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout';
import { LandingPage, DashboardPage, BountiesPage, EmergencyPage, SettingsPage } from './pages';
import { AuthProvider } from './lib/AuthContext';
import './index.css';

/**
 * Radius - Emergency Dispatch Platform
 * Main application with routing
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page - No shell */}
          <Route path="/" element={<LandingPage />} />

          {/* App routes - With shell */}
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bounties" element={<BountiesPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
