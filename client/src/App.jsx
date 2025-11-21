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
import LegalLayout from './layouts/LegalLayout';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

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

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
