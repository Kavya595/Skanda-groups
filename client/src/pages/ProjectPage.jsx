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
  MapPin,
  ExternalLink,
  ChevronRight,
  Download,
  X
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
    <div className="bg-[#000000] text-slate-100 space-y-20 pb-20">
      {/* ========================================================== */}
      {/* 1. HERO SECTION                                            */}
      {/* ========================================================== */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-[#07090e] via-[#0b0e14] to-[#000000] py-16 sm:py-20 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-brand-orange/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
            <span className="h-px w-8 bg-brand-orange/40" />
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            PROJECT BLUEPRINT
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            <span className="h-px w-8 bg-brand-orange/40" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Project Blueprint &amp; Sanctioned Standards
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            An authentically verified 10.50-acre gated residential plotted enclave at Kadthal, engineered to the highest DTCP statutory standards with 96 villa plots and 100% Vasthu harmony.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="/assets/skandha_brochure.pdf"
              download="Skandha_Group_Kadthal_Brochure.pdf"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Brochure</span>
            </a>

            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="inline-flex items-center gap-2 bg-[#121622] hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-all"
            >
              <Calendar className="w-4 h-4 text-brand-orange" />
              <span>Schedule Consultation</span>
            </button>
          </div>
        </div>
      </section>

      {/* Specification Marquee Ribbon */}
      <div className="bg-[#07090e] py-3.5 border-y border-slate-800 overflow-hidden shadow-inner">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-300">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 shrink-0">
              <span className="text-brand-orange">&#10022;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. OFFICIAL LAYOUT BLUEPRINT SHOWCASE                      */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-[#0c0f17] rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                OFFICIAL SANCTIONED LAYOUT
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
                Challampally / Kadthal Sanctioned Layout Plan
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Visualizing all 96 numbered plots, internal 40' &amp; 33' roads, Ac. 0.758 park, and adjoining Srisailam Highway frontage.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsBlueprintZoomed(true)}
                className="inline-flex items-center gap-2 bg-[#141824] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-700 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5 text-brand-orange" />
                <span>Zoom Official Blueprint</span>
              </button>

              <a
                href="/plots"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md transition-colors"
              >
                <span>Interactive Plots (2D/3D)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Blueprint Graphic Frame */}
          <div
            onClick={() => setIsBlueprintZoomed(true)}
            className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#07090e] cursor-zoom-in group p-4"
          >
            <img
              src="/assets/layout_plan_hd.png"
              alt="Sanctioned Master Layout Plan"
              className="w-full h-auto max-h-[580px] object-contain rounded-xl mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute bottom-6 right-6 bg-[#0c0f17]/90 text-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-bold shadow flex items-center gap-1.5 pointer-events-none">
              <Eye className="w-3.5 h-3.5 text-brand-orange" />
              <span>Click to enlarge official layout blueprint</span>
            </div>
          </div>

          {/* Verification Stamps Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#121622] border border-slate-800">
              <img
                src="/assets/dtcp_approved_stamp.jpg"
                alt="DTCP Approved Stamp"
                className="w-14 h-14 object-contain rounded-lg"
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Sanction Authority</div>
                <div className="text-base font-extrabold text-white">DTCP Approved Layout</div>
                <div className="text-xs font-semibold text-brand-orange">TLP NO. 87/2024/H</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#121622] border border-slate-800">
              <img
                src="/assets/ts_rera_stamp.jpg"
                alt="TS RERA Registration Stamp"
                className="w-14 h-14 object-contain rounded-lg"
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Regulatory Compliance</div>
                <div className="text-base font-extrabold text-white">TS RERA Registered</div>
                <div className="text-xs font-semibold text-brand-orange">PO2400009081</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 3. PHYSICAL INFRASTRUCTURE PILLARS                         */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
            <span className="h-px w-8 bg-brand-orange/40" />
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            PHYSICAL INFRASTRUCTURE
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            <span className="h-px w-8 bg-brand-orange/40" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            Engineered To Endure For Generations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            This gated community combines heavy-duty civil engineering with sustainable greenery and pristine community utilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {infrastructurePillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#0c0f17] rounded-3xl overflow-hidden border border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-orange/40 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                />
                <div className="absolute top-4 left-4 bg-[#0c0f17]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-md border border-slate-700">
                  {pillar.stat}
                </div>
              </div>

              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 font-light">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================== */}
      {/* 4. VASTHU ORIENTATION & PLOT FACING MATRIX                 */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-[#0c0f17] rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">
              <span className="h-px w-6 bg-brand-orange/40" />
              <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
              VASTHU GEOMETRY
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
              Plot Facing &amp; Orientation Hierarchy
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Every plot in the venture is surveyed strictly to 100% Vasthu principles. Preferences for corner positions, morning East frontage, and wide boulevard avenues are scheduled as below:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-xs">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#121622] text-xs uppercase tracking-wider font-bold text-slate-200 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Plot Facing / Position</th>
                  <th className="px-6 py-4">Classification Tier</th>
                  <th className="px-6 py-4">Vasthu Advantage &amp; Specifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-[#0c0f17]">
                {vasthuTiers.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#121622]/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{row.type}</td>
                    <td className="px-6 py-4 font-bold text-brand-orange">{row.tier}</td>
                    <td className="px-6 py-4 text-xs text-slate-300">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 5. OFFICIAL BROCHURE & VENTURE DOCUMENTATION               */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0c0f17] rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-slate-800 bg-[#07090e]">
              <img
                src="/assets/hero_cover.jpg"
                alt="Skandha Group Kadthal Brochure Document"
                className="w-full h-auto max-h-[380px] object-cover object-top rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none rounded-2xl" />
              <div className="absolute bottom-4 left-4 right-4 text-xs font-bold text-white flex items-center justify-between">
                <span className="bg-brand-orange px-3 py-1 rounded text-[11px] font-bold">
                  Official Document
                </span>
                <span className="text-slate-300">
                  Kadthal Plotted Community
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                VENTURE PORTFOLIO
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                Official Project Brochure &amp; Master Layout
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Explore the complete master blueprint, sanctioned plot dimension charts, Vasthu orientations, and comprehensive connectivity highlights directly from the official Skandha Group publication.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="/assets/skandha_brochure.pdf"
                  download="Skandha_Group_Kadthal_Brochure.pdf"
                  className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Project Brochure (PDF)</span>
                </a>
                <a
                  href="/assets/skandha_flyer.pdf"
                  download="Skandha_Group_Kadthal_Flyer.pdf"
                  className="inline-flex items-center gap-2 bg-[#141824] hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
                >
                  <Download className="w-4 h-4 text-brand-orange" />
                  <span>Download Project Flyer (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 6. PRIVATE SITE TOUR INVITATION                            */}
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
            className="bg-white hover:bg-orange-50 text-brand-orange font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Private Site Visit</span>
          </button>
        </div>
      </section>

      {/* Zoom Modal for Blueprint Layout */}
      {isBlueprintZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsBlueprintZoomed(false)}
        >
          <div
            className="relative max-w-6xl max-h-[92vh] bg-[#0c0f17] border border-slate-800 rounded-3xl p-4 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsBlueprintZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full shadow transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/assets/layout_plan_hd.png"
              alt="Master Layout Plan Full Size"
              className="max-h-[85vh] w-auto object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}

      {/* Reusable Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
}
