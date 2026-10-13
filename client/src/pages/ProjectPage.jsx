import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  Car,
  Trees,
  Droplets,
  Building,
  Sparkles,
  Calendar,
  Quote,
  Maximize2,
  ArrowRight,
  Eye,
  Layers,
  MapPin
} from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';

export default function ProjectPage() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isBlueprintZoomed, setIsBlueprintZoomed] = useState(false);

  const marqueeItems = [
    'DTCP SANCTIONED TLP NO. 87/2024/H',
    'TS RERA REGISTERED PO2400009081',
    '100% VASTHU COMPLIANT ALIGNMENT',
    '40 FT & 33 FT BLACKTOP ROADS',
    '10.50 ACRES GATED ESTATE',
    '96 NUMBERED VILLA PLOTS',
    'AC. 0.758 CENTRAL GREEN PARK',
    'IMMEDIATE SPOT REGISTRATION',
    '2 YEARS FREE MAINTENANCE'
  ];

  const vasthuTiers = [
    { type: 'North-East & North-West Corners', tier: 'Prime Corner Tier', notes: 'Premier dual-road frontage with peak morning solar energy alignment' },
    { type: 'South-East & South-West Corners', tier: 'Auspicious Corner Tier', notes: 'Distinct corner orientation ensuring unhindered airflow and expansive frontage' },
    { type: 'East Facing Plots', tier: 'Standard Vasthu Tier', notes: 'Direct morning sunrise alignment per ancient traditional Vasthu shastra' },
    { type: 'North Facing Plots', tier: 'Standard Vasthu Tier', notes: 'Prosperity orientation alignment favored for serene residential living' },
    { type: '40 Feet Boulevard Frontage', tier: 'Arterial Boulevard Tier', notes: 'Direct access along wide central avenues with dedicated pedestrian curbs' }
  ];

  const infrastructurePillars = [
    {
      title: 'Arterial Road Circulation',
      desc: '60ft wide northern arterial connection linking eastward to Maisigandi Temple and NH 765, alongside an internal grid of 40ft and 33ft heavy-duty blacktop B.T. roads with paver curbs.',
      image: '/assets/site_bt_roads.jpg',
      stat: "60', 40' & 33' B.T Roads"
    },
    {
      title: 'Ac. 0.758 Landscaped Central Park',
      desc: 'Reserved open green breathing zone featuring lush lawn turf, flowering shade trees, children recreational play equipment, and an encircling morning fitness walking trail.',
      image: '/assets/site_landscape_park.jpg',
      stat: 'Ac. 0.758 Cents Reserve'
    },
    {
      title: 'Water & Potable Infrastructure',
      desc: 'Dedicated high-capacity overhead storage reservoir connected to an underground distribution grid supplying round-the-clock potable water to every individual plot boundary.',
      image: '/assets/site_overhead_tank.jpg',
      stat: 'Overhead Reservoir Network'
    },
    {
      title: 'Underground Drainage & Modern Grid',
      desc: 'Complete underground sanitary and rainwater drainage lines designed to eliminate standing water, paired with electrical cabling and LED street illumination.',
      image: '/assets/site_drainage_system.jpg',
      stat: 'Full Subsurface Grid'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* ========================================================== */}
      {/* 1. EDITORIAL LUXURY HERO SECTION                           */}
      {/* ========================================================== */}
      <section className="relative min-h-[55vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/site_aerial_view.jpg"
            alt="Alekhya's Brundavan Aerial Perspective"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/70 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-orange-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DTCP Approved TLP NO. 87/2024/H &bull; TS RERA PO2400009081</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            Project Blueprint &amp; Sanctioned Standards
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed max-w-2xl">
            An authentically verified 10.50-acre gated residential plotted enclave at Kadthal, engineered to the highest DTCP statutory standards with 96 villa plots and 100% Vasthu harmony.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Private Consultation</span>
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-6 py-3.5 rounded-xl transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>View Route &amp; Driving Directions</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 2. INFINITE SPECIFICATION MARQUEE                          */}
      {/* ========================================================== */}
      <div className="bg-slate-900 py-3.5 border-y border-slate-800 overflow-hidden shadow-inner">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-300">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 shrink-0">
              <span className="text-orange-400">&#10022;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. ARCHITECTURAL QUOTATION BANNER                          */}
      {/* ========================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50/50 rounded-3xl p-8 sm:p-12 border border-orange-200/60 shadow-sm text-center space-y-4">
          <Quote className="w-10 h-10 text-brand-orange/30 mx-auto" />
          <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-slate-900 leading-snug">
            &ldquo;Every dimension, avenue width, and plot boundary in Alekhya's Brundavan has been mathematically aligned to sacred Vasthu geometry and authenticated under statutory DTCP sanction.&rdquo;
          </blockquote>
          <div className="font-bold text-xs uppercase tracking-widest text-brand-orange">
            Engineering &bull; Authenticity &bull; Clear Title
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 4. OFFICIAL LAYOUT BLUEPRINT SHOWCASE (BROCHURE PAGE 2)    */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Official Sanctioned Layout
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Sanctioned Master Plan &bull; TLP NO. 87/2024/H
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
                Challampally / Alekhya's Brundavanam Layout Plan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Visualizing all 96 numbered plots, internal 40' &amp; 33' roads, Ac. 0.758 park, and adjoining Srisailam Highway frontage.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBlueprintZoomed(true)}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5 text-brand-orange" />
                <span>Zoom Official Blueprint</span>
              </button>
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <span>Request Plot Details</span>
              </button>
            </div>
          </div>

          {/* Blueprint Graphic Frame */}
          <div
            onClick={() => setIsBlueprintZoomed(true)}
            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 cursor-zoom-in group p-3"
          >
            <img
              src="/assets/layout_plan_hd.png"
              alt="Alekhya's Brundavan Sanctioned Master Layout Plan"
              className="w-full h-auto max-h-[580px] object-contain rounded-xl mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow flex items-center gap-1.5 pointer-events-none">
              <Eye className="w-3.5 h-3.5 text-brand-orange" />
              <span>Click to enlarge official layout blueprint</span>
            </div>
          </div>

          {/* Verification Stamps Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src="/assets/dtcp_approved_stamp.jpg"
                alt="DTCP Approved Stamp"
                className="w-14 h-14 object-contain"
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Sanction Authority</div>
                <div className="text-base font-extrabold text-slate-900">DTCP Approved Layout</div>
                <div className="text-xs font-semibold text-brand-orange">TLP NO. 87/2024/H</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src="/assets/ts_rera_stamp.jpg"
                alt="TS RERA Registration Stamp"
                className="w-14 h-14 object-contain"
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Regulatory Compliance</div>
                <div className="text-base font-extrabold text-slate-900">TS RERA Registered</div>
                <div className="text-xs font-semibold text-brand-orange">PO2400009081</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 5. INFRASTRUCTURE PILLARS WITH REAL SITE PHOTOS            */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
            Physical Infrastructure
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Engineered To Endure For Generations
          </h2>
          <p className="text-sm text-slate-600">
            Alekhya's Brundavan combines heavy-duty civil engineering with sustainable greenery and pristine community utilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {infrastructurePillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                  {pillar.stat}
                </div>
              </div>

              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================== */}
      {/* 6. VASTHU ORIENTATION & PLOT FACING MATRIX                 */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Vasthu Geometry &bull; 100% Orientation Harmony
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Plot Facing &amp; Orientation Hierarchy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Every plot in the venture is surveyed strictly to 100% Vasthu principles. Preferences for corner positions, morning East frontage, and wide boulevard avenues are scheduled as below:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Plot Facing / Position</th>
                  <th className="px-6 py-4">Classification Tier</th>
                  <th className="px-6 py-4">Vasthu Advantage &amp; Specifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {vasthuTiers.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{row.type}</td>
                    <td className="px-6 py-4 font-bold text-brand-orange">{row.tier}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 7. PRIVATE SITE TOUR INVITATION                            */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-8 sm:p-14 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-200 bg-white/20 px-3 py-1 rounded-full">
              Escorted Site Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Tour The Development With A Skandha Advisor
            </h2>
            <p className="text-sm text-orange-100 leading-relaxed font-light">
              Inspect plot demarcations, examine the registered DTCP boundary markers, and experience the thriving Kadthal corridor firsthand.
            </p>
          </div>

          <button
            onClick={() => setIsEnquiryOpen(true)}
            className="bg-white hover:bg-orange-50 text-brand-orange font-bold px-8 py-4 rounded-xl text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Private Site Visit</span>
          </button>
        </div>
      </section>

      {/* Zoom Modal for Blueprint Layout */}
      {isBlueprintZoomed && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsBlueprintZoomed(false)}
        >
          <div
            className="relative max-w-6xl max-h-[92vh] bg-white rounded-3xl p-4 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsBlueprintZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full shadow transition-colors"
            >
              &times;
            </button>
            <img
              src="/assets/layout_plan_hd.png"
              alt="Alekhya's Brundavan Master Layout Plan Full Size"
              className="max-h-[85vh] w-auto object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
}
