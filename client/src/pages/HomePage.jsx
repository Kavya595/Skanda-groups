import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  MapPin,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Building,
  Trees,
  Car,
  Droplets,
  Lightbulb,
  Sparkles,
  Calendar,
  ExternalLink,
  Quote,
  Maximize2,
  Navigation
} from 'lucide-react';
import { fetchPublicSettings, fetchPlotStats, fetchGallery, trackActivityEvent } from '../api/client';
import EnquiryModal from '../components/EnquiryModal';
import Lightbox from '../components/Lightbox';

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [activeFaqCategory, setActiveFaqCategory] = useState('All');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);

  useEffect(() => {
    trackActivityEvent('layout_opened', null, { source: 'homepage' });
    fetchPublicSettings().then(res => res.success && setSettings(res.settings)).catch(console.error);
    fetchPlotStats().then(res => res.success && setStats(res.stats)).catch(console.error);
    fetchGallery().then(res => res.success && setGallery(res.items.slice(0, 6))).catch(console.error);
  }, []);

  const marqueeItems = [
    'DTCP SANCTIONED TLP NO. 87/2024/H',
    'TS RERA REGISTERED PO2400009081',
    '100% VASTHU COMPLIANT ORIENTATION',
    '40 FT & 33 FT BLACKTOP ROADS',
    '1 MINUTE TO MAISIGANDI TEMPLE',
    '10.50 ACRES GATED COMMUNITY',
    'AC. 0.758 CENTS LANDSCAPED PARK',
    'SPOT REGISTRATION WITH CLEAR TITLE',
    'PRE-APPROVED BANK LOANS UP TO 75%',
    'UNDERGROUND SANITARY DRAINAGE',
    '2 YEARS COMPLIMENTARY MAINTENANCE',
    'MUCHERLA FUTURE CITY CORRIDOR'
  ];

  // Authentic On-Site Photo Developments from Brochure Page 3
  const onSiteDevelopments = [
    {
      title: 'Grand Entrance Arch & Security',
      category: 'Gated Security',
      desc: 'Architectural entry portal with 24/7 security cabin and boundary wall fencing.',
      image: '/assets/site_entrance_arch.jpg',
      tag: 'Completed Feature'
    },
    {
      title: 'Ac. 0.758 Landscaped Central Park',
      category: 'Green Reserve',
      desc: 'Lush open green park with manicured lawns, flowering trees, and recreational walkways.',
      image: '/assets/site_landscape_park.jpg',
      tag: 'Ac. 0.758 Cents'
    },
    {
      title: '40ft & 33ft Wide Blacktop B.T. Roads',
      category: 'Circulation Grid',
      desc: 'Heavy-duty asphalt avenues bordered with concrete curbs and pedestrian walkway avenues.',
      image: '/assets/site_bt_roads.jpg',
      tag: 'Wide Road Grid'
    },
    {
      title: 'Dedicated Overhead Water Tank',
      category: 'Water Utility',
      desc: 'High-capacity overhead reservoir providing reliable, uninterrupted potable water network.',
      image: '/assets/site_overhead_tank.jpg',
      tag: 'Water Infrastructure'
    },
    {
      title: 'Lush Avenue Tree Plantation',
      category: 'Avenue Planting',
      desc: 'Extensive flowering shade trees lining every internal avenue curb for ecological beauty.',
      image: '/assets/site_avenue_plantation.jpg',
      tag: 'Eco Landscaping'
    },
    {
      title: "Children's Recreation & Jogging Track",
      category: 'Lifestyle',
      desc: 'Dedicated safe play zone with modern equipment and paved morning fitness path.',
      image: '/assets/site_children_park.jpg',
      tag: 'Family Recreation'
    },
    {
      title: 'Modern Underground Drainage Network',
      category: 'Sanitary Grid',
      desc: 'Subsurface sanitary drainage system engineered to prevent waterlogging and maintain hygiene.',
      image: '/assets/site_drainage_system.jpg',
      tag: 'Underground Grid'
    },
    {
      title: 'Historic Maisigandi Temple Precinct',
      category: 'Sacred Proximity',
      desc: 'Just a 1-minute drive from the layout along the proposed 60ft master arterial avenue.',
      image: '/assets/maisigandi_temple.jpg',
      tag: '1 Min Proximity'
    }
  ];

  const amenities = [
    { title: 'DTCP Approved Layout', desc: 'TLP No. 87/2024/H legally approved residential layout.', icon: ShieldCheck },
    { title: '100% Vasthu Compliant', desc: 'Carefully engineered plot alignments with clear Vasthu titles.', icon: Compass },
    { title: "40' & 33' B.T Roads", desc: "Wide asphalt blacktop internal avenues with pedestrian curbs.", icon: Car },
    { title: 'Spot Registration', desc: 'Ready for immediate spot registration with clear title deed.', icon: CheckCircle2 },
    { title: '24 Hours Security', desc: 'Grand entrance arch with 24/7 security cabin and boundary fencing.', icon: Building },
    { title: 'Underground Drainage', desc: 'Modern sanitary underground drainage system throughout layout.', icon: Droplets },
    { title: 'Overhead Water Tank', desc: 'Dedicated water storage tank ensuring round-the-clock water supply.', icon: Droplets },
    { title: 'Landscaped Parks', desc: 'Ac. 0.758 cents reserved green space with lush plantings.', icon: Trees },
    { title: 'Jogging Track & Play Area', desc: 'Paved jogging trail and dedicated children activity zone.', icon: Sparkles },
    { title: 'Unique Street Lights', desc: 'Illuminated LED street fixtures across all internal roads.', icon: Lightbulb },
    { title: 'Avenue Plantation', desc: 'Lush avenue trees and greenery bordering all road curbs.', icon: Trees },
    { title: '2 Years Maintenance', desc: 'Complimentary security & comprehensive site maintenance for 2 years.', icon: ShieldCheck }
  ];

  const locations = [
    { claim: 'Maisigandi Temple', time: '1 min drive', desc: 'Right along the proposed 60ft arterial layout road' },
    { claim: 'Srisailam Highway (NH 765)', time: '2 min drive', desc: 'Direct adjoining arterial access to Hyderabad' },
    { claim: 'Kadthal Town & Municipality', time: '3 min drive', desc: 'Established administrative town with retail & schools' },
    { claim: 'Future City & Life Sciences Hub', time: '10 min drive', desc: 'Telangana mega economic and pharma development corridor' },
    { claim: 'Kandukur - Maheshwaram Industrial Belt', time: '12 min drive', desc: 'Proximity to high-value IT, aerospace & industrial zones' },
    { claim: 'Major Pharma Investments', time: 'Corridor', desc: "Dr. Reddy's, Aurobindo, Hetero, Laurus Labs, MSN & Gland Pharma" }
  ];

  const faqs = [
    {
      category: 'Legal & Approvals',
      q: "Is Alekhya's Brundavan approved by DTCP and registered under TS RERA?",
      a: "Yes. The venture is officially sanctioned by the Directorate of Town and Country Planning (DTCP) under layout permit TLP NO. 87/2024/H and registered with the Telangana State Real Estate Regulatory Authority (TS RERA) under registration PO2400009081. All 96 plots hold 100% clear legal title, guaranteeing instant spot registration without encumbrance."
    },
    {
      category: 'Plots & Vasthu',
      q: "What plot dimensions and orientations are available in the project?",
      a: "The project features 96 surveyed residential villa plots ranging from 183 Sq.Yards up to 672 Sq.Yards (1,647 to 6,048 Sq.Ft). The entire layout has been engineered in strict adherence to 100% Vasthu principles, with East-facing and West-facing plot alignments as well as auspicious corner locations."
    },
    {
      category: 'Bank Loans',
      q: "Are housing and plotted development bank loans pre-approved for this venture?",
      a: "Yes. Due to full statutory DTCP clearances and RERA certification, pre-approved bank loans up to 70% to 75% are available through leading banks including State Bank of India (SBI), HDFC Bank, and ICICI Bank. Our dedicated customer team assists buyers with seamless loan sanction paperwork."
    },
    {
      category: 'Infrastructure',
      q: "What on-site infrastructure and amenities are being developed?",
      a: "The venture features a proposed 60'-0\" wide arterial road connecting directly toward Maisigandi Temple, 33'-0\" wide internal blacktop avenues, comprehensive underground sanitary drainage, overhead water storage tank, electrical lines with dedicated street lights, an Ac. 0.758 landscaped children's park with jogging pathways, boundary wall with 24/7 security cabin, and 2 full years of complimentary site maintenance."
    },
    {
      category: 'Location & Growth',
      q: "Where is the venture situated and how is connectivity to Hyderabad?",
      a: "The layout directly adjoins the 4-lane Srisailam Highway (NH 765) in Kadthal, just a 1-minute drive to the famous Maisigandi Maisamma Temple. It offers direct signal-free access to Hyderabad via Outer Ring Road (Exit 14) and Rajiv Gandhi International Airport (Shamshabad)."
    },
    {
      category: 'Location & Growth',
      q: "What is the economic growth driver in the Kadthal corridor?",
      a: "Kadthal is situated at the center of South Hyderabad's mega economic expansion, neighboring the upcoming Mucherla Future City (Life Sciences, AI City & Skills University), the massive Hyderabad Pharma City corridor, and the proposed Regional Ring Road (RRR), driving rapid long-term land appreciation."
    },
    {
      category: 'Site Visits',
      q: "How can I schedule a physical site visit or select a plot?",
      a: "Skandha Group organizes daily guided site visits directly to the Kadthal project. You can submit an online enquiry, or chat with our verified advisors on WhatsApp to schedule a complimentary visit with comfortable cab pickup."
    }
  ];

  const faqCategories = ['All', 'Legal & Approvals', 'Plots & Vasthu', 'Infrastructure', 'Bank Loans', 'Location & Growth'];

  const filteredFaqs = activeFaqCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeFaqCategory);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* ========================================================== */}
      {/* 1. CINEMATIC SUPREME HERO SECTION                          */}
      {/* ========================================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Background Visual with Subtle Motion */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero_cover.jpg"
            alt="Alekhya's Brundavan Villa Layout"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
          />
          {/* Accessible Luxury Gradient Overlays (Warm tones, no black panel) */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-white">
          <div className="max-w-3xl space-y-6">
            {/* Regulatory Approval Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-orange-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DTCP Approved TLP NO. 87/2024/H &bull; TS RERA PO2400009081</span>
            </div>

            {/* Supreme Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-md">
              Locate Yourself At The Most <span className="text-orange-400">Desirable Place</span>.
            </h1>

            {/* Sub-headline / Concise Positioning */}
            <p className="text-lg sm:text-xl text-slate-200 font-light leading-relaxed max-w-2xl drop-shadow">
              <strong>Alekhya's Brundavan</strong> at Kadthal by <strong>Skandha Group</strong>. Premium residential villa plots adjoining Srisailam Highway (NH 765), just 1 minute to Maisigandi Temple and minutes from the booming Mucherla Future City corridor.
            </p>

            {/* Supreme Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Private Site Visit</span>
              </button>

              <Link
                to="/project"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white px-7 py-4 rounded-2xl text-base font-semibold shadow-md transition-all duration-300"
              >
                <span>Project Specifications</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Highlights Grid */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div>
                <div className="text-white font-bold text-lg">96 Plots</div>
                <div className="text-slate-400">Numbered &amp; Surveyed</div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">Ac. 0.758 Cts</div>
                <div className="text-slate-400">Central Landscaped Park</div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">60', 40' &amp; 33'</div>
                <div className="text-slate-400">Wide Blacktop Roads</div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">100% Vasthu</div>
                <div className="text-slate-400">Spot Registration Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 2. INFINITE SUPREME LUXURY MARQUEE RIBBON                  */}
      {/* ========================================================== */}
      <div className="bg-slate-900 py-4.5 border-y border-slate-800 overflow-hidden shadow-inner">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-300">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 shrink-0">
              <span className="text-orange-400">&#10022;</span>
              <span className="hover:text-white transition-colors">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. EDITORIAL QUOTATION & BRAND PHILOSOPHY                  */}
      {/* ========================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50/40 rounded-3xl p-8 sm:p-14 border border-orange-200/60 shadow-sm text-center">
          <Quote className="w-12 h-12 text-brand-orange/20 mx-auto mb-4" />
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900 leading-snug tracking-tight">
            &ldquo;A harmonious plotted sanctuary where authentic Vasthu precision meets the future economic powerhouse of South Hyderabad.&rdquo;
          </blockquote>
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="font-bold text-sm tracking-wider uppercase text-brand-orange">
              Skandha Group Development Pledge
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Kadthal Mandal &bull; 100% Clear Title &bull; Immediate Spot Registration
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 4. ON-SITE INFRASTRUCTURE & REAL PHOTO GALLERY SHOWCASE    */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
              On-Site Reality &bull; Verified Photos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Project Amenities &amp; Infrastructure
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Authentic on-site development photography directly from the Alekhya's Brundavan project brochure, showcasing genuine roads, parkland, and security infrastructure.
            </p>
          </div>

          <button
            onClick={() => setIsEnquiryOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Escorted Site Tour</span>
          </button>
        </div>

        {/* 8 Photo Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {onSiteDevelopments.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhotoModal(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                  {item.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 text-brand-orange text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {item.tag}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 text-xs font-semibold text-brand-orange flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Development</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================== */}
      {/* 5. COMPLETE 12 AMENITIES GRID                              */}
      {/* ========================================================== */}
      <section className="bg-slate-50/80 border-y border-slate-200/70 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-100/70 px-3.5 py-1 rounded-full">
              Brochure Specifications
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Master Plan Features &amp; Standards
            </h2>
            <p className="text-sm text-slate-600">
              Built to high DTCP regulatory benchmarks ensuring long-term liveability and generational asset protection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {amenities.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-orange-200 transition-all duration-200 space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-brand-orange text-brand-orange group-hover:text-white flex items-center justify-center transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 6. STRATEGIC LOCATION & FLYER ROUTE MAP                    */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location Corridor &bull; Kadthal</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Seamless Transit to Hyderabad &amp; Future City
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Alekhya's Brundavan enjoys direct frontage along Srisailam Highway (NH 765), providing immediate access to Maisigandi Temple and fast commutes to Rajiv Gandhi International Airport.
            </p>

            <div className="space-y-3 pt-2">
              {locations.map((loc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{loc.claim}</div>
                    <div className="text-[11px] text-slate-500">{loc.desc}</div>
                  </div>
                  <span className="text-xs font-bold text-brand-orange bg-white px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
                    {loc.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>View Google Map &amp; Directions</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-3 space-y-3">
              <img
                src="/assets/route_map.jpg"
                alt="Alekhya's Brundavan Location and Route Map"
                className="w-full h-auto max-h-[500px] object-contain rounded-2xl bg-slate-50"
              />
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <span>Route via Srisailam Highway (NH 765) &amp; ORR Exit 14</span>
                <span className="font-semibold text-brand-orange">Official Flyer Map</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 7. COMPREHENSIVE INTERACTIVE FAQ ACCORDION                 */}
      {/* ========================================================== */}
      <section className="bg-slate-50/80 py-16 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Everything You Need to Know
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Transparent answers regarding DTCP &amp; TS RERA approvals, plot dimensions, bank financing, and Kadthal location advantages for Alekhya's Brundavan.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {faqCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveFaqCategory(cat);
                  setOpenFaqIndex(0);
                }}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                  activeFaqCategory === cat
                    ? 'bg-brand-orange text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-brand-orange/40 shadow-sm ring-1 ring-orange-500/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 sm:px-6 py-4.5 text-left flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0" />
                      <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.q}
                      </span>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-orange-50 text-brand-orange rotate-180'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still Have Questions Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Have a specific query about an individual plot number?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our sales desk provides instant clarity on plot boundaries, current availability, and bank eligibility.
              </p>
            </div>
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
            >
              Ask Skandha Advisory
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 8. VIP PRIVATE SITE VISIT INVITATION                       */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-200 bg-white/20 px-3 py-1 rounded-full">
              Complimentary Daily Site Tours
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Experience Alekhya's Brundavan In Person
            </h2>
            <p className="text-sm sm:text-base text-orange-100 leading-relaxed font-light">
              Walk the wide blacktop avenues, inspect the landscaped Ac. 0.758 park, and experience the serenity of Kadthal just 1 minute from Maisigandi Temple.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="bg-white hover:bg-orange-50 text-brand-orange font-bold px-8 py-4 rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Private Escorted Visit</span>
              </button>
              <Link
                to="/contact"
                className="bg-orange-950/40 hover:bg-orange-950/60 border border-white/30 text-white font-bold px-7 py-4 rounded-xl text-sm transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Route &amp; Driving Map</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* On-Site Development Photo Detail Modal */}
      {selectedPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-4 right-4 z-10 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full shadow transition-colors"
            >
              &times;
            </button>
            <img
              src={selectedPhotoModal.image}
              alt={selectedPhotoModal.title}
              className="w-full max-h-[60vh] object-cover rounded-2xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                  {selectedPhotoModal.category}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Alekhya's Brundavan On-Site Reality
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                {selectedPhotoModal.title}
              </h3>
              <p className="text-sm text-slate-600">
                {selectedPhotoModal.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />

      {/* Lightbox */}
      <Lightbox
        items={gallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(prev => (prev > 0 ? prev - 1 : gallery.length - 1))}
        onNext={() => setLightboxIndex(prev => (prev < gallery.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
}
