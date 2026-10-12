import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import { COMPANY_CONFIG } from '../config/company';

const CURRENT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="bg-[#202124] text-white border-t border-gray-800">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Logo variant="white" size="lg" />
            <p className="text-sm text-gray-400 leading-relaxed">
              {COMPANY_CONFIG.tagline}
            </p>
            <p className="text-xs text-gray-400">
              {COMPANY_CONFIG.subTagline}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-[#F58220] pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-[#F58220] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" /> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F58220] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" /> About Company
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#F58220] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" /> Projects Portfolio
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#F58220] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" /> Architectural Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F58220] transition-colors inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" /> Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Standards */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-[#F58220] pl-2.5">
              Development Standards
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                <span>100% Clear Legal Titles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                <span>Statutory Sanctions (DTCP & TS RERA)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                <span>Vasthu-Compliant Orientations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                <span>Avenue Trees & Landscaped Parks</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                <span>Spot Registration Available</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Registered Office */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-[#F58220] pl-2.5">
              Corporate Office
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F58220] flex-shrink-0 mt-1" />
                <address className="not-italic text-xs leading-relaxed">
                  {COMPANY_CONFIG.address.doorNo},<br />
                  {COMPANY_CONFIG.address.building},<br />
                  {COMPANY_CONFIG.address.street},<br />
                  {COMPANY_CONFIG.address.city}, {COMPANY_CONFIG.address.state} - {COMPANY_CONFIG.address.pincode}
                </address>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Mail className="w-4 h-4 text-[#F58220] flex-shrink-0" />
                <a 
                  href={`mailto:${COMPANY_CONFIG.contact.email}`}
                  className="text-xs text-gray-300 hover:text-[#F58220] transition-colors"
                >
                  {COMPANY_CONFIG.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Digital Partner */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            &copy; {CURRENT_YEAR} {COMPANY_CONFIG.name}. All rights reserved.
          </div>
          <div>
            <a
              href="https://qwikdigitalsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#F58220] transition-colors inline-flex items-center gap-1.5 group"
            >
              <span className="text-gray-500">Designed & Developed by</span>
              <span className="font-semibold text-gray-300 group-hover:text-[#F58220] transition-colors underline decoration-transparent group-hover:decoration-[#F58220] underline-offset-2">
                Qwik Digital Solutions
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
