import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  ShieldCheck,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  MessageCircle
} from 'lucide-react';

export default function Footer({ settings }) {
  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';
  const officeAddress = (settings && settings.officeAddress) || '# 8-7-91/17/1, 4th Floor Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana -500079';
  const reraNo = (settings && settings.reraNumber) || 'PO2400009081';
  const dtcpNo = (settings && settings.dtcpNumber) || 'TLP NO. 87/2024/H';

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', hoverColor: 'hover:text-[#1877F2]' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', hoverColor: 'hover:text-[#E4405F]' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com', hoverColor: 'hover:text-[#FF0000]' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', hoverColor: 'hover:text-[#0A66C2]' },
    { name: 'X / Twitter', icon: Twitter, href: 'https://twitter.com', hoverColor: 'hover:text-white' },
    { name: 'WhatsApp', icon: MessageCircle, href: 'https://wa.me/919949501513', hoverColor: 'hover:text-[#25D366]' }
  ];

  return (
    <footer className="bg-[#1f2329] border-t border-[#313642] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Brand & Statutory Credentials (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <Link to="/" className="inline-block">
              <img
                src="/assets/skandha_logo_white.svg"
                alt="Skandha Group"
                className="h-11 w-auto object-contain"
              />
            </Link>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                Alekhya's Brundavan
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                10.50-Acre landmark DTCP sanctioned &amp; TS RERA registered plotted community in Kadthal, adjoining Srisailam Highway (NH 765) and 1 minute to Maisigandi Temple.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 bg-emerald-950/80 text-emerald-400 rounded-md border border-emerald-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                DTCP: {dtcpNo}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-[#2a2f38] text-slate-300 rounded-md border border-[#3b414f]">
                RERA: {reraNo}
              </span>
            </div>
          </div>

          {/* Clean Quick Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-brand-orange pl-2.5">
              Explore Project
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/" className="hover:text-brand-orange transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/project" className="hover:text-brand-orange transition-colors">
                  Project Specifications
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-brand-orange transition-colors">
                  Site Progress Photos
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-orange transition-colors">
                  About Skandha Group
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-orange transition-colors">
                  Location Map &amp; Enquiry
                </Link>
              </li>
              <li>
                <a
                  href="/plots"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange font-semibold text-orange-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Plot Availability (2D/3D)</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
            </ul>
          </div>

          {/* Corporate Contact & Social Media (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-brand-orange pl-2.5">
              Connect With Us
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-brand-orange text-slate-200 transition-colors">
                  {email}
                </a>
              </div>
            </div>

            {/* Social Media Icons Strip */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Follow Skandha Group
              </div>
              <div className="flex items-center gap-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-8 h-8 rounded-lg bg-[#2a2f38] border border-[#3b414f] text-slate-400 flex items-center justify-center transition-all duration-200 hover:bg-[#343a46] hover:scale-105 ${item.hoverColor}`}
                      aria-label={item.name}
                      title={item.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Row */}
        <div className="mt-10 pt-5 border-t border-[#2e333e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Skandha Group. All Rights Reserved.
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>DTCP: {dtcpNo}</span>
            <span>&bull;</span>
            <span>TS RERA: {reraNo}</span>
            <span>&bull;</span>
            <span>Kadthal, Srisailam Highway</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
