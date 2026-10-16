import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  ShieldCheck,
  ExternalLink,
  Instagram,
  Youtube,
  MessageCircle,
  ChevronRight,
  Download,
  FileText
} from 'lucide-react';

export default function Footer({ settings }) {
  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';
  const officeAddress = (settings && settings.officeAddress) || '# 8-7-91/17/1, 4th Floor Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana -500079';
  const reraNo = (settings && settings.reraNumber) || 'PO2400009081';
  const dtcpNo = (settings && settings.dtcpNumber) || 'TLP NO. 87/2024/H';

  const siteAddress = 'Adjoining Srisailam Highway (NH 765), Kadthal Mandal, Ranga Reddy District, Telangana - 509358 (1 Min from Historic Maisigandi Temple)';

  const instagramUrl = (settings && settings.socialLinks && settings.socialLinks.instagram && !settings.socialLinks.instagram.endsWith('/skandhagroup'))
    ? settings.socialLinks.instagram
    : 'https://www.instagram.com/_skandhagroups_/';

  const youtubeUrl = (settings && settings.socialLinks && settings.socialLinks.youtube && !settings.socialLinks.youtube.endsWith('/@skandhagroup'))
    ? settings.socialLinks.youtube
    : 'https://www.youtube.com/@SkandhaGroups-hyd';

  const whatsappUrl = 'https://wa.me/919100031199?text=Hi%2C%20I%20am%20interested%20in%20Skandha%20Group%20plots%20at%20Kadthal.';

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: instagramUrl, hoverColor: 'hover:text-[#E4405F]' },
    { name: 'YouTube', icon: Youtube, href: youtubeUrl, hoverColor: 'hover:text-[#FF0000]' },
    { name: 'WhatsApp', icon: MessageCircle, href: whatsappUrl, hoverColor: 'hover:text-[#25D366]' }
  ];

  return (
    <footer className="bg-[#0b0e14] border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">
          {/* Column 1: Brand & Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/assets/skandha_logo_white.svg"
                alt="Skandha Group Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Discover premium plotted developments in serene, well-connected locations. 10.50-Acre landmark DTCP sanctioned &amp; TS RERA registered community in Kadthal, adjoining Srisailam Highway (NH 765).
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-brand-orange text-slate-200 transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 text-slate-200 transition-colors font-medium"
                >
                  Direct WhatsApp Sales Desk
                </a>
              </div>
            </div>

            {/* Circular Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-full bg-[#181c26] border border-slate-700/80 text-slate-300 flex items-center justify-center transition-all duration-200 hover:text-white hover:scale-105 ${item.hoverColor}`}
                    aria-label={item.name}
                    title={item.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* DTCP & RERA Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 bg-emerald-950/70 text-emerald-400 rounded-md border border-emerald-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                DTCP: {dtcpNo}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-[#181c26] text-slate-300 rounded-md border border-slate-700">
                RERA: {reraNo}
              </span>
            </div>
          </div>

          {/* Column 2: Head Office (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-brand-orange pl-2.5">
              Head Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="leading-relaxed">{officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-brand-orange text-slate-200 transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Site / Branch Office (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-brand-orange pl-2.5">
              Site / Project Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="leading-relaxed">{siteAddress}</span>
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                Adjoining 4-lane NH 765 Srisailam Highway. Daily guided site tours available with cab service.
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:text-white transition-colors"
                >
                  <span>View Driving Directions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Links & Brochures (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-brand-orange pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/" className="hover:text-brand-orange transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-brand-orange" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-orange transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-brand-orange" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/project" className="hover:text-brand-orange transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-brand-orange" />
                  <span>Project Overview</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-brand-orange transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-brand-orange" />
                  <span>Site Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-orange transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-brand-orange" />
                  <span>Contact &amp; Map</span>
                </Link>
              </li>
              <li>
                <a
                  href="/plots"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange font-bold text-orange-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-brand-orange" />
                  <span>Plot Availability (2D/3D)</span>
                </a>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                  <span>Admin Staff Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Legal */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Skandha Group. All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms &amp; Conditions</span>
            <span>&bull;</span>
            <span className="text-slate-400">DTCP: {dtcpNo}</span>
            <span>&bull;</span>
            <span className="text-slate-400">TS RERA: {reraNo}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
