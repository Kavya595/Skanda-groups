import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Mail,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import EnquiryModal from './EnquiryModal';

export default function Navbar({ settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Project Specs', path: '/project' },
    { label: 'Site Gallery', path: '/gallery' },
    { label: 'About Skandha', path: '/about' },
    { label: 'Contact & Map', path: '/contact' }
  ];

  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';
  const reraNo = (settings && settings.reraNumber) || 'PO2400009081';
  const dtcpNo = (settings && settings.dtcpNumber) || 'TLP NO. 87/2024/H';

  return (
    <>
      <header className="sticky top-0 z-50 transition-all duration-300">
        {/* Supreme Micro-Bar: Statutory Verification Ribbon */}
        <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DTCP: {dtcpNo} &bull; TS RERA: {reraNo}
              </span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-300 hidden md:inline">
                Srisailam Highway (NH 765), Kadthal &bull; 1 Min to Maisigandi Temple
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <a
                href={`mailto:${email}`}
                className="hover:text-brand-orange transition-colors hidden sm:inline-flex items-center gap-1 text-[11px]"
              >
                <Mail className="w-3 h-3 text-orange-400" />
                <span>{email}</span>
              </a>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-orange-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-400" />
                100% Vasthu Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Supreme Floating Architectural Navigation Island */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
          <div
            className={`rounded-2xl transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between ${
              isScrolled
                ? 'bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)]'
                : 'bg-white/90 backdrop-blur-md border border-slate-200/70 shadow-sm'
            }`}
          >
            {/* Brand Mark with Regal Architecture */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/assets/skandha_logo.svg"
                alt="Skandha Group Official Logo"
                className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="border-l border-slate-200 pl-3">
                <div className="font-serif font-extrabold text-base sm:text-lg leading-tight text-slate-900 group-hover:text-brand-orange transition-colors">
                  Alekhya's Brundavan
                </div>
                <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">
                  Kadthal &bull; Skandha Group
                </div>
              </div>
            </Link>

            {/* Supreme Nav Links: Floating Island Pills */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-brand-orange shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Discreet Dedicated Plot Availability Link */}
              <a
                href="/plots"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-all inline-flex items-center gap-1"
                title="Open Interactive 2D/3D Plot Viewer in New Window"
              >
                <span>Plot Availability</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </nav>

            {/* Action CTA Button */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Private Visit</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>

            {/* Mobile Menu Trigger Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="p-2 rounded-xl text-slate-700 hover:text-brand-orange hover:bg-slate-100 focus:outline-none transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Luxury Sheet Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mx-3 sm:mx-6 bg-white/98 backdrop-blur-2xl border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-orange-50 text-brand-orange font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}

              <a
                href="/plots"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-brand-orange hover:bg-orange-50 flex items-center justify-between"
              >
                <span>Interactive Plot Availability (2D/3D)</span>
                <ExternalLink className="w-4 h-4 text-brand-orange" />
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsEnquiryModalOpen(true);
                }}
                className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 rounded-xl text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Private Visit</span>
              </button>
              <div className="text-[11px] text-center text-slate-500 pt-1">
                DTCP: {dtcpNo} &bull; TS RERA: {reraNo}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Reusable Enquiry / Visit Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </>
  );
}
