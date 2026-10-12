import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, MapPin, ArrowRight, Mail } from 'lucide-react';
import Logo from './Logo';
import GetInTouchModal from './GetInTouchModal';
import { COMPANY_CONFIG } from '../config/company';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  // Handle scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for open-get-in-touch events from anywhere in the app
  useEffect(() => {
    const handleOpenModal = () => setIsInquiryModalOpen(true);
    window.addEventListener('open-get-in-touch', handleOpenModal);
    return () => window.removeEventListener('open-get-in-touch', handleOpenModal);
  }, []);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white transition-all duration-300">
      {/* Top Corporate Mini-Bar (Purely corporate Skandha Groups info) */}
      <div className="bg-[#202124] text-[#E5E7EB] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-6 lg:px-8 border-b border-[#374151]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 text-gray-300 truncate">
            <span className="inline-flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F58220] flex-shrink-0" />
              <span className="truncate">Hastinapuram, Hyderabad</span>
            </span>
            <span className="hidden md:inline-block text-gray-500">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#F58220] animate-pulse"></span>
              <span>Skandha Groups &bull; Real Estate & Infrastructure</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <a 
              href={`mailto:${COMPANY_CONFIG.contact.email}`}
              className="inline-flex items-center gap-1 sm:gap-1.5 hover:text-[#F58220] transition-colors text-[11px] sm:text-xs"
              title="Email Skandha Groups"
            >
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F58220]" />
              <span className="hidden sm:inline">{COMPANY_CONFIG.contact.email}</span>
              <span className="sm:hidden">Email</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md border-b border-[#E5E7EB]' : 'border-b border-[#E5E7EB]/80'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-md text-sm font-semibold transition-all duration-200 relative ${
                      isActive
                        ? 'text-[#F58220] bg-[#FFF5EC]'
                        : 'text-[#202124] hover:text-[#F58220] hover:bg-gray-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Right Action Button */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsInquiryModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-[#F58220] hover:bg-[#E07016] shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F58220] cursor-pointer"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-md text-[#202124] hover:text-[#F58220] hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] cursor-pointer"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'text-[#F58220] bg-[#FFF5EC] font-semibold'
                        : 'text-[#202124] hover:text-[#F58220] hover:bg-gray-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsInquiryModalOpen(true);
                  }}
                  className="w-full text-center py-3 px-4 rounded-md font-semibold text-white bg-[#F58220] hover:bg-[#E07016] shadow transition-colors cursor-pointer"
                >
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Interactive Get in Touch Modal Form */}
      <GetInTouchModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </header>
  );
}
