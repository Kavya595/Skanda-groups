import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Mail,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Phone,
  FileText,
  Download,
  Instagram,
  Youtube
} from 'lucide-react';
import EnquiryModal from './EnquiryModal';

export default function Navbar({ settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [brochureDropdownOpen, setBrochureDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setBrochureDropdownOpen(false);
    setAboutDropdownOpen(false);
  }, [location.pathname]);

  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';

  const instagramUrl = (settings && settings.socialLinks && settings.socialLinks.instagram && !settings.socialLinks.instagram.endsWith('/skandhagroup'))
    ? settings.socialLinks.instagram
    : 'https://www.instagram.com/_skandhagroups_/';

  const youtubeUrl = (settings && settings.socialLinks && settings.socialLinks.youtube && !settings.socialLinks.youtube.endsWith('/@skandhagroup'))
    ? settings.socialLinks.youtube
    : 'https://www.youtube.com/@SkandhaGroups-hyd';

  return (
    <>
      <header className="relative z-50">
        {/* JB Infra Reference Top Bar: Dark Navy with White Icons and Square Social Buttons */}
        <div className="bg-[#071326] text-white text-xs py-2 px-4 border-b border-[#0d223f]">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
            {/* Callback Button & Email on Left */}
            <div className="flex items-center gap-6 text-xs text-white">
              <button
                type="button"
                onClick={() => setIsEnquiryModalOpen(true)}
                className="hover:text-brand-orange transition-colors inline-flex items-center gap-2 font-medium"
              >
                <Phone className="w-3.5 h-3.5 fill-white text-white" />
                <span>Request Site Desk Callback</span>
              </button>
              <a
                href={`mailto:${email}`}
                className="hover:text-brand-orange transition-colors inline-flex items-center gap-2 font-medium"
              >
                <Mail className="w-3.5 h-3.5 fill-white text-white" />
                <span>{email}</span>
              </a>
            </div>

            {/* Social Icon Squares on Right (Instagram, YouTube & Admin) */}
            <div className="flex items-center gap-1.5">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-sm bg-[#262626] hover:opacity-90 text-white flex items-center justify-center transition-opacity"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-sm bg-[#cd201f] hover:opacity-90 text-white flex items-center justify-center transition-opacity"
                title="YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5 fill-white" />
              </a>

              <Link
                to="/admin/login"
                className="ml-3 text-[11px] font-semibold text-slate-300 hover:text-emerald-400 inline-flex items-center gap-1 bg-[#102340] px-2 py-0.5 rounded-sm border border-slate-700"
                title="Admin Staff Portal"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* JB Infra Reference Main Header: Solid Pure Black Background */}
        <div className="bg-[#000000] border-b border-black py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Logo on Left */}
            <Link to="/" className="flex items-center gap-3 shrink-0" title="Skandha Group">
              <img
                src="/assets/skandha_logo_white.svg"
                alt="Skandha Group"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {/* Home */}
              <Link
                to="/"
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  location.pathname === '/' ? 'text-brand-orange' : 'text-white hover:text-brand-orange'
                }`}
              >
                Home
              </Link>

              {/* About Us Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <Link
                  to="/about"
                  className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
                    location.pathname === '/about' ? 'text-brand-orange' : 'text-white hover:text-brand-orange'
                  }`}
                >
                  <span>About Us</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </Link>

                {aboutDropdownOpen && (
                  <div className="absolute top-full left-0 pt-2 w-52 z-50 animate-fadeIn">
                    <div className="bg-[#12141a] border border-slate-800 rounded-sm shadow-2xl py-2">
                      <Link
                        to="/about"
                        className="block px-4 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-brand-orange transition-colors"
                      >
                        About Skandha Group
                      </Link>
                      <a
                        href="/#amenities"
                        className="block px-4 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-brand-orange transition-colors"
                      >
                        Infrastructure &amp; Parks
                      </a>
                      <a
                        href="/#testimonials"
                        className="block px-4 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-brand-orange transition-colors"
                      >
                        Client Testimonials
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Overview (Direct Link - Single Project) */}
              <Link
                to="/project"
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  location.pathname === '/project' ? 'text-brand-orange' : 'text-white hover:text-brand-orange'
                }`}
              >
                Project Overview
              </Link>

              {/* Gallery */}
              <Link
                to="/gallery"
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  location.pathname === '/gallery' ? 'text-brand-orange' : 'text-white hover:text-brand-orange'
                }`}
              >
                Gallery
              </Link>

              {/* Brochures Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setBrochureDropdownOpen(true)}
                onMouseLeave={() => setBrochureDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="text-sm font-semibold tracking-wide text-white hover:text-brand-orange flex items-center gap-1.5 transition-colors"
                >
                  <span>Brochures</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                {brochureDropdownOpen && (
                  <div className="absolute top-full left-0 pt-2 w-56 z-50 animate-fadeIn">
                    <div className="bg-[#12141a] border border-slate-800 rounded-sm shadow-2xl py-2">
                      <a
                        href="/assets/skandha_brochure.pdf"
                        download="Skandha_Group_Kadthal_Brochure.pdf"
                        className="px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-brand-orange flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Project Brochure</span>
                        </span>
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="/assets/skandha_flyer.pdf"
                        download="Skandha_Group_Kadthal_Flyer.pdf"
                        className="px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-brand-orange flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Project Flyer</span>
                        </span>
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              <Link
                to="/contact"
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  location.pathname === '/contact' ? 'text-brand-orange' : 'text-white hover:text-brand-orange'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Button: Exact JB Infra "PLOT AVAILABILITY" */}
            <div className="hidden sm:flex items-center">
              <a
                href="/plots"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-sm shadow-md transition-all active:scale-95"
              >
                PLOT AVAILABILITY
              </a>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center gap-3">
              <a
                href="/plots"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-orange text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm"
              >
                Plots
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="p-2 text-white hover:text-brand-orange transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Off-Canvas Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0d0f14] border-b border-slate-800 px-5 py-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 text-white">
            <div className="flex flex-col space-y-1">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Project Overview', path: '/project' },
                { label: 'Site Gallery', path: '/gallery' },
                { label: 'Contact & Map', path: '/contact' }
              ].map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-sm text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-brand-orange text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                );
              })}

              {/* Mobile Brochure Download Links */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Project Downloads
                </div>
                <a
                  href="/assets/skandha_brochure.pdf"
                  download="Skandha_Group_Kadthal_Brochure.pdf"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs text-slate-300 hover:text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-orange" />
                    <span>Download Project Brochure (PDF)</span>
                  </span>
                  <Download className="w-4 h-4 text-slate-500" />
                </a>
                <a
                  href="/assets/skandha_flyer.pdf"
                  download="Skandha_Group_Kadthal_Flyer.pdf"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs text-slate-300 hover:text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-orange" />
                    <span>Download Project Flyer (PDF)</span>
                  </span>
                  <Download className="w-4 h-4 text-slate-500" />
                </a>
              </div>

              {/* Dedicated Plot Availability Link */}
              <a
                href="/plots"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-wider bg-brand-orange hover:bg-brand-orange-dark text-white flex items-center justify-between shadow-md"
              >
                <span>Interactive Plot Availability (2D/3D)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-sm text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Staff Portal</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </>
  );
}
