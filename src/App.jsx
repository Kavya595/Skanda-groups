import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageMeta from './components/PageMeta';
import { PlotProvider } from './context/PlotContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ProjectMapPage from './pages/ProjectMapPage';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function AppContent() {
  const location = useLocation();
  const isFullMapRoute = location.pathname === '/projects/alekya/map';

  if (isFullMapRoute) {
    return (
      <Routes>
        <Route path="/projects/alekya/map" element={<ProjectMapPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#202124] antialiased selection:bg-[#F58220]/20 selection:text-[#F58220]">
      {/* Shared Corporate Sticky Navbar */}
      <Navbar />

      {/* Dynamic Route Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/alekya" element={<ProjectDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Shared Corporate Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PlotProvider>
        <ScrollToTop />
        <PageMeta />
        <AppContent />
      </PlotProvider>
    </BrowserRouter>
  );
}
