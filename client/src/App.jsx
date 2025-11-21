import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import CommunityGuidelines from './pages/legal/CommunityGuidelines';
import ContactUs from './pages/support/ContactUs';
import SafetyCenter from './pages/support/SafetyCenter';
import AboutUs from './pages/general/AboutUs';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Tracking from './components/Tracking';
import LegalLayout from './layouts/LegalLayout';
import { AuthProvider } from './context/AuthContext';
import UserDashboard from './pages/user/UserDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Tracking />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Legal Routes */}
          <Route path="/legal/terms" element={<LegalLayout title="Terms of Service"><TermsOfService /></LegalLayout>} />
          <Route path="/legal/privacy" element={<LegalLayout title="Privacy Policy"><PrivacyPolicy /></LegalLayout>} />
          <Route path="/legal/cookies" element={<LegalLayout title="Cookie Policy"><CookiePolicy /></LegalLayout>} />
          <Route path="/legal/guidelines" element={<LegalLayout title="Community Guidelines"><CommunityGuidelines /></LegalLayout>} />

          {/* Support Routes */}
          <Route path="/support/contact" element={<LegalLayout title="Contact Us"><ContactUs /></LegalLayout>} />
          <Route path="/support/safety" element={<LegalLayout title="Safety Center"><SafetyCenter /></LegalLayout>} />

          {/* General Routes */}
          <Route path="/about" element={<LegalLayout title="About Us"><AboutUs /></LegalLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </AuthProvider>
    </Router >
  );
}

export default App;
