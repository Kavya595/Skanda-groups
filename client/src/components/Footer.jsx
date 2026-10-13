import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, ShieldCheck, ExternalLink, Clock } from 'lucide-react';

export default function Footer({ settings }) {
  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';
  const officeAddress = (settings && settings.officeAddress) || '# 8-7-91/17/1, 4th Floor Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana -500079';
  const reraNo = (settings && settings.reraNumber) || 'PO2400009081';
  const dtcpNo = (settings && settings.dtcpNumber) || 'TLP NO. 87/2024/H';

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Positioning (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/assets/skandha_logo.svg"
                alt="Skandha Group"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              <strong>Alekhya's Brundavan</strong> is a landmark DTCP &amp; RERA approved residential plotted development in Kadthal, strategically situated along the booming Srisailam Highway (NH 765) growth corridor.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                DTCP Approved: {dtcpNo}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200">
                TS RERA: {reraNo}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              100% Vasthu Compliant &bull; Spot Registration &bull; Clear Legal Title
            </div>
          </div>

          {/* Quick Navigation (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-2 border-brand-orange pl-2.5">
              Explore Project
            </h4>
            <ul className="space-y-2.5 text-sm">
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
                <a
                  href="/plots"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange font-semibold text-brand-orange transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Interactive Plot Availability</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-brand-orange transition-colors">
                  Site Development Photos
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-orange transition-colors">
                  About Skandha Group
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-orange transition-colors">
                  Enquiry &amp; Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate Office Information (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-2 border-brand-orange pl-2.5">
              Corporate Office
            </h4>
            <div className="space-y-3.5 text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-1" />
                <span className="leading-snug">{officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-brand-orange underline">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-500 pt-1">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Working Hours: Monday – Saturday, 9:30 AM to 6:30 PM. Site visits organized daily.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-2">
          <p className="leading-relaxed">
            <strong>Regulatory &amp; Transparency Notice:</strong> All project highlights, layout arrangements, and location references (including Maisigandi Temple, Srisailam Highway NH 765, Kadthal town, and pharmaceutical company corridors) are directly sourced from the approved layout plan (TLP NO. 87/2024/H) and registered credentials. Availability is subject to administrative verification.
          </p>
          <div className="flex flex-wrap justify-between items-center gap-2 pt-2 text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} Skandha Group. All official trademarks and layout plans are property of Skandha Group.
            </div>
            <div>
              RERA Registration: {reraNo} &bull; Kadthal, Telangana
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
