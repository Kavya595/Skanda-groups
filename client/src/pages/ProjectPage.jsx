import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Compass,
  Download,
  CheckCircle2,
  Car,
  Trees,
  Droplets,
  Building,
  Tag,
  ArrowRight
} from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';

export default function ProjectPage() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const chargesTable = [
    { type: 'N/E & N/W Corner', charge: 'Rs. 800/- per Sq.Yd', notes: 'North-East or North-West corner prime facing' },
    { type: 'S/E & S/W Corner', charge: 'Rs. 600/- per Sq.Yd', notes: 'South-East or South-West corner plot positions' },
    { type: 'East Face', charge: 'Rs. 500/- per Sq.Yd', notes: 'Prime morning sun alignment per Vasthu norms' },
    { type: 'North Face', charge: 'Rs. 500/- per Sq.Yd', notes: 'Auspicious North facing villa plot preference' },
    { type: '40 Feet Road Frontage', charge: 'Rs. 500/- per Sq.Yd', notes: 'Direct access along 40ft wide boulevard avenues' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Project Blueprint & Claims
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900 leading-tight">
          Alekhya's Brundavan, Kadthal
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
          An authentically DTCP & TS RERA approved residential plotted layout spanning 96 well-demarcated villa plots, grand landscaped parkland, and wide internal blacktop roads.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            DTCP Layout: TLP NO. 87/2024/H
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            TS RERA: PO2400009081
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">
            <Compass className="w-4 h-4" />
            100% Vasthu Compliant
          </span>
        </div>
      </div>

      {/* Official Stamps & Verification Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold text-slate-900">
            Approved Layout Authentication
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The layout plan for <strong>Alekhya's Brundavan</strong> (Challampally village, Kadthal Mandal) has been officially sanctioned by the Directorate of Town and Country Planning (DTCP) under permit <strong>TLP NO. 87/2024/H</strong>, and registered under Telangana State Real Estate Regulatory Authority (TS RERA) under registration <strong>PO2400009081</strong>.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/assets/alekhyas_brundavan_brochure.pdf"
              download
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Brochure</span>
            </a>
            <a
              href="/assets/alekhyas_brundavan_flyer.pdf"
              download
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-4 py-2.5 rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project Flyer</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-center space-y-2">
            <img
              src="/assets/dtcp_approved_stamp.jpg"
              alt="DTCP Approved Stamp"
              className="h-20 w-auto object-contain mx-auto"
            />
            <div className="text-xs font-bold text-slate-800">DTCP Approved</div>
            <div className="text-[11px] text-slate-500">TLP NO. 87/2024/H</div>
          </div>

          <div className="h-16 w-px bg-slate-200" />

          <div className="text-center space-y-2">
            <img
              src="/assets/ts_rera_stamp.jpg"
              alt="TS RERA Stamp"
              className="h-20 w-auto object-contain mx-auto"
            />
            <div className="text-xs font-bold text-slate-800">TS RERA Registered</div>
            <div className="text-[11px] text-slate-500">PO2400009081</div>
          </div>
        </div>
      </div>

      {/* Brochure Extra Charges Table */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Brochure Page 2 Pricing Structure
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">
            Extra Charges Schedule per Sq. Yard
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            As officially scheduled in the layout plan brochure, applicable on specific facing, corner, and road frontage parameters:
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-xs uppercase tracking-wider font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Plot Category / Frontage</th>
                <th className="px-6 py-4">Brochure Extra Charge</th>
                <th className="px-6 py-4">Specifications & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {chargesTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{row.type}</td>
                  <td className="px-6 py-4 font-extrabold text-brand-orange">{row.charge}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Road Network & Master Plan Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Infrastructure Design
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Arterial Road Network & Open Green Spaces
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The layout is planned with clear circulation hierarchy:
          </p>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <Car className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <span>
                <strong>Proposed 60'-0" Wide Road:</strong> North layout arterial connecting directly eastward towards Masigandi Temple and NH 765.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Car className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <span>
                <strong>Proposed 33'-0" Wide Internal Grid:</strong> Interconnected blacktop avenues between plot blocks for smooth, safe neighborhood mobility.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Trees className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Ac. 0.758 Cents Reserved Park Space:</strong> Dedicated north-west open green enclave with children's play equipment, jogging pathways, and lush tree plantations.
              </span>
            </li>
          </ul>

          <div className="pt-4">
            <Link
              to="/plots"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-3 rounded-lg text-sm transition-all"
            >
              <span>Explore Interactive 2D & 3D Master Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200">
          <img
            src="/assets/site_landscape_park.jpg"
            alt="Alekhya's Brundavan Park and Roads"
            className="w-full h-80 object-cover rounded-xl shadow-md"
          />
          <div className="mt-3 text-center text-xs font-medium text-slate-500">
            On-site Landscaped Park & Avenue Plantation
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
}
