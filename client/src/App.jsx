import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { fetchPublicSettings } from './api/client';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';

// Public Marketing Pages
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Standalone Master Plan Plot Viewer (Completely Separate App Experience)
import PlotViewerStandalone from './pages/PlotViewerStandalone';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPlots from './pages/admin/AdminPlots';
import AdminLeads from './pages/admin/AdminLeads';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminGallery from './pages/admin/AdminGallery';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

// Protected Admin Route Guard
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Public Marketing Website Wrapper (With Main Navbar and Footer)
function PublicLayout({ settings }) {
  const location = useLocation();

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white relative selection:bg-orange-100 selection:text-orange-900">
      <ScrollProgress />
      <Navbar settings={settings} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage settings={settings} />} />
          <Route path="/contact" element={<ContactPage settings={settings} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer settings={settings} />
      <BackToTop />
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchPublicSettings()
      .then(res => res.success && setSettings(res.settings))
      .catch(console.error);
  }, []);

  // Detect whether viewer is deployed at standalone subdomain e.g. plots.skandhagroup.com
  const isPlotsSubdomain = typeof window !== 'undefined' && (
    window.location.hostname.startsWith('plots.') ||
    window.location.search.includes('standalone=true')
  );

  return (
    <AuthProvider>
      <Routes>
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="plots" element={<AdminPlots />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="audit" element={<AdminAuditLogs />} />
        </Route>

        {/* Standalone Plot Viewer Route - NO Marketing Navbar, NO Hero, NO Footer */}
        <Route path="/plots" element={<PlotViewerStandalone settings={settings} />} />

        {/* If hosted on plots.skandhagroup.com subdomain, root '/' serves standalone viewer */}
        {isPlotsSubdomain ? (
          <Route path="/" element={<PlotViewerStandalone settings={settings} />} />
        ) : null}

        {/* Public Marketing Website */}
        <Route path="/*" element={<PublicLayout settings={settings} />} />
      </Routes>
    </AuthProvider>
  );
}
