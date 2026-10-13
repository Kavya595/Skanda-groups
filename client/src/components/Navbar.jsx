import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Compass, Menu, X, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Navbar({ settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Project', path: '/project' },
    { label: 'Plot Layout', path: '/plots' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';
  const reraNo = (settings && settings.reraNumber) || 'PO2400009081';
  const dtcpNo = (settings && settings.dtcpNumber) || 'TLP NO. 87/2024/H';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      {/* Slim Top Contact & Compliance Strip */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-1.5 text-xs text-slate-600 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              DTCP: {dtcpNo} | TS RERA: {reraNo}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">Location: Kadthal, Srisailam Highway (NH 765)</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-orange transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-brand-orange" />
              <span>{email}</span>
            </a>
            <span className="text-slate-400">|</span>
            <Link to="/admin" className="text-slate-500 hover:text-brand-orange transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Project Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <img
              src="/assets/skandha_logo.svg"
              alt="Skandha Group Official Logo"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="border-l border-slate-200 pl-3.5">
              <div className="font-serif font-bold text-lg leading-tight text-slate-900 group-hover:text-brand-orange transition-colors">
                Alekhya's Brundavan
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-emerald-700">
                Kadthal • DTCP Approved Plots
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors duration-200 relative py-2 ${
                    isActive
                      ? 'text-brand-orange font-bold'
                      : 'text-slate-700 hover:text-brand-orange'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Distinct Action Button: Plot Availability */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/plots"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Explore Plot Availability</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-slate-700 hover:text-brand-orange hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-base font-semibold ${
                  location.pathname === link.path
                    ? 'bg-orange-50 text-brand-orange'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-brand-orange'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/plots"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-brand-orange text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm"
            >
              Interactive Plot Availability (2D/3D)
            </Link>
            <div className="text-xs text-center text-slate-500 pt-1">
              DTCP: {dtcpNo} | TS RERA: {reraNo}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
