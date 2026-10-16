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
  Navigation,
  Sun,
  Moon,
  Layers,
  Home,
  Download
} from 'lucide-react';
import { fetchPublicSettings, fetchPlotStats, fetchGallery, trackActivityEvent } from '../api/client';
import EnquiryModal from '../components/EnquiryModal';
import Lightbox from '../components/Lightbox';
import SpecialLandmarkView from '../components/SpecialLandmarkView';
import SectionNavPill from '../components/SectionNavPill';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import CountUp from '../components/CountUp';

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [activeFaqCategory, setActiveFaqCategory] = useState('All');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);

  // Luxury Villa Concepts State
  const [activeVillaConfig, setActiveVillaConfig] = useState('183');

  // Twilight Architectural Lighting Showcase State
  const [activeLightingIndex, setActiveLightingIndex] = useState(0);

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

  // Villa Concepts Data
  const villaConfigs = {
    '183': {
      sqYards: '183 Sq.Yards',
      dimension: "33' x 50'",
      builtUp: '2,450 Sq.Ft Built-Up Area',
      type: '3-BHK Contemporary Villa',
      highlights: [
        'East / West Facing Vasthu Alignment',
        'Double-height formal living & dining',
        'Private landscaped rear garden terrace',
        'Dedicated covered car parking portico'
      ],
      desc: 'The ideal balance of elegance and functional living, designed with abundant natural sunlight, cross-ventilation, and private green sanctuary spaces.'
    },
    '240': {
      sqYards: '240 Sq.Yards',
      dimension: "36' x 60'",
      builtUp: '3,200 Sq.Ft Built-Up Area',
      type: '4-BHK Executive Courtyard Villa',
      highlights: [
        'Central open-to-sky internal courtyard',
        'Expansive master suite with walk-in wardrobe',
        'Private rooftop lounge with slatted pergola',
        'Twin covered vehicle parking with electric charging'
      ],
      desc: 'An architectural statement featuring expansive glass facades, double-height volumes, and seamless integration between indoor living and manicured outdoor lawns.'
    },
    '350': {
      sqYards: '350+ Sq.Yards',
      dimension: "45' x 70' / Corner",
      builtUp: '4,500+ Sq.Ft Built-Up Area',
      type: '5-BHK Grand Signature Estate',
      highlights: [
        'Prime corner plot with dual road access',
        'Private infinity-edge garden plunge pool',
        'Family entertainment lounge & home theater',
        'Grand entrance foyer with travertine stone accents'
      ],
      desc: 'Uncompromising luxury on prime corner plots. Designed for generational prosperity, exceptional privacy, and grand entertaining in Kadthal.'
    }
  };

  // Twilight Ambiance & Lighting Showcase Data
  const lightingScenes = [
    {
      title: 'Villa Twilight Ambiance & Warm Glow',
      category: 'Architectural Lighting',
      tag: 'Warm Amber Accents',
      image: '/assets/villa_twilight_lighting.jpg',
      badge: 'Bespoke Residential Lighting',
      desc: 'Recessed warm orange ceiling coves, exterior travertine uplighting, and glowing floor-to-ceiling glass create a serene, welcoming dusk ambiance.'
    },
    {
      title: 'Illuminated 40ft Internal Avenues',
      category: 'Boulevard Lighting',
      tag: 'Solar-Assisted Warm LEDs',
      image: '/assets/avenue_lighting.jpg',
      badge: 'Designer Curved Street Lamps',
      desc: 'Wide 40-foot blacktop avenues lined with designer curved light posts casting a warm amber glow over smooth asphalt roads and uplighted palm trees.'
    },
    {
      title: 'Resort Pool Pavilion & Evening Waterscape',
      category: 'Amenities Illumination',
      tag: 'Underwater Golden Glow',
      image: '/assets/pool_lighting.jpg',
      badge: 'Lush Garden Lighting',
      desc: 'Submerged pool illumination paired with warm amber pergola lights and ash-grey stone sun deck create an enchanting evening retreat for families.'
    }
  ];

  // Authentic On-Site Photo Developments
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
    { title: 'Avenue Street Lighting', desc: 'Warm amber illuminated street fixtures across all internal avenues.', icon: Lightbulb },
    { title: 'Avenue Plantation', desc: 'Lush avenue trees and greenery bordering all road curbs.', icon: Trees },
    { title: '2 Years Maintenance', desc: 'Complimentary security & comprehensive site maintenance for 2 years.', icon: ShieldCheck }
  ];

  const faqs = [
    {
      category: 'Legal & Approvals',
      q: "Is this venture approved by DTCP and registered under TS RERA?",
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
    <div className="pb-20 overflow-hidden bg-white relative">
      {/* Modern In-Page Sticky Section Navigation Pill */}
      <SectionNavPill />

      {/* ========================================================== */}
      {/* 1. ELEGANT SIDE-BY-SIDE HERO SECTION                      */}
      {/* ========================================================== */}
      <section className="relative bg-gradient-to-b from-orange-50/40 via-white to-slate-50/60 pt-4 pb-12 sm:pt-6 sm:pb-16 lg:py-16 border-b border-slate-100 overflow-hidden">
        {/* Subtle Ambient Backing Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Text & Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Regulatory Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>DTCP Approved TLP NO. 87/2024/H &bull; TS RERA PO2400009081</span>
              </div>

              {/* Headline - User requirement: "and i dont want to hithlight alekya brundavan name dont use it as heading" */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.12] text-slate-900">
                Locate Yourself At The Most <span className="text-brand-orange">Desirable Place</span>.
              </h1>

              {/* Sub-headline / Content */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                Skandha Group offers 96 vastu-compliant residential villa plots adjoining Srisailam Highway (NH 765), just 1 minute to historic Maisigandi Temple and minutes from the booming Mucherla Future City &amp; Pharma City corridor.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="/assets/skandha_brochure.pdf"
                  download="Skandha_Group_Kadthal_Brochure.pdf"
                  className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold shadow-xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98]"
                  title="Download Official Project Brochure PDF"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Brochure</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsEnquiryOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-sm sm:text-base font-bold shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span>Schedule Site Visit</span>
                </button>

                <Link
                  to="/plots"
                  className="inline-flex items-center justify-center gap-1.5 text-slate-700 hover:text-brand-orange font-bold text-sm px-3 py-3.5 rounded-xl transition-colors"
                >
                  <span>Explore Plots</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Key Highlights Grid */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-orange-300 transition-colors">
                  <div className="font-serif font-extrabold text-2xl text-brand-orange">
                    <CountUp end={96} duration={1500} />
                  </div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">Surveyed Plots</div>
                  <div className="text-slate-500 text-[11px]">DTCP Approved</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="font-serif font-extrabold text-2xl text-emerald-600">
                    <CountUp end={10.5} decimals={1} suffix=" Ac" duration={1700} />
                  </div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">Gated Layout</div>
                  <div className="text-slate-500 text-[11px]">Ac. 0.758 Park</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-300 transition-colors">
                  <div className="font-serif font-extrabold text-2xl text-amber-600">
                    <CountUp end={40} suffix="' & 33'" duration={1600} />
                  </div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">Wide BT Roads</div>
                  <div className="text-slate-500 text-[11px]">Smooth Asphalt</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-orange-300 transition-colors">
                  <div className="font-serif font-extrabold text-2xl text-brand-orange">
                    <CountUp end={100} suffix="%" duration={1400} />
                  </div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">Vasthu Compliant</div>
                  <div className="text-slate-500 text-[11px]">Spot Registration</div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Image Only (5 cols) - User explicitly instructed: "i dont want text on hero section image", "keep text and image a side", "dont use 3d layout in hero section" */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                <img
                  src="/assets/hero_cover.jpg"
                  alt="Plotted Community at Kadthal, Srisailam Highway"
                  className="w-full h-[360px] sm:h-[450px] lg:h-[500px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Subtle Clean Bottom Location Bar (Not covering the image faces) */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-2xl border border-slate-700/60 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                    <span className="text-xs font-bold truncate">Kadthal, Srisailam Highway (NH 765)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 shrink-0 ml-2">
                    1 Min to Temple
                  </span>
                </div>
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

      {/* Main Content Sections Wrapper with Spacing */}
      <div className="space-y-24 mt-20 sm:mt-24">

      {/* ========================================================== */}
      {/* 3. EDITORIAL QUOTATION & BRAND PHILOSOPHY                  */}
      {/* ========================================================== */}
      <section id="overview" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <ScrollReveal direction="up">
          <TiltCard
            maxTilt={4}
            className="relative bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 rounded-3xl p-8 sm:p-14 border border-orange-200/60 shadow-sm text-center group"
          >
            <Quote className="w-12 h-12 text-brand-orange/20 mx-auto mb-4 group-hover:scale-110 group-hover:text-brand-orange/30 transition-all duration-300" />
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
          </TiltCard>
        </ScrollReveal>
      </section>

      {/* ========================================================== */}
      {/* 4. BESPOKE VILLA CONCEPTS & ARCHITECTURAL SPLENDOR (NEW)    */}
      {/* ========================================================== */}
      <section id="villas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <ScrollReveal direction="up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold uppercase tracking-wider text-brand-orange">
                <Home className="w-3.5 h-3.5" />
                <span>Architectural Vision &bull; Bespoke Villas</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                Craft Your Signature Villa Sanctuary
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                Our gated venture offers surveyed residential villa plots engineered for bespoke contemporary homes with crisp white architecture, warm teakwood pergolas, light ash-grey travertine stone terraces, and lush private gardens.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
              {Object.keys(villaConfigs).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveVillaConfig(key)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeVillaConfig === key
                      ? 'bg-white text-brand-orange shadow-xs scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {villaConfigs[key].sqYards}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Villa Showcase Card */}
        <ScrollReveal direction="up" delay={150}>
          <TiltCard
            maxTilt={5}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/70 rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Left: High-End Villa Daylight Photography */}
            <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white">
              <img
                src="/assets/luxury_villa_day.jpg"
                alt="Bespoke Contemporary Luxury Villa at Skandha Group Kadthal"
                className="w-full h-[360px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Daylight Villa Concept</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow border border-slate-200">
                <span>{villaConfigs[activeVillaConfig].builtUp}</span>
              </div>
            </div>

            {/* Right: Villa Specifications & Architectural Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-orange bg-orange-100/70 px-3 py-1 rounded-md">
                  {villaConfigs[activeVillaConfig].dimension} Dimension
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  {villaConfigs[activeVillaConfig].type}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {villaConfigs[activeVillaConfig].desc}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Architectural Highlights:
                </div>
                <ul className="space-y-2.5">
                  {villaConfigs[activeVillaConfig].highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="btn-shimmer bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5"
                >
                  Request Villa Floorplans
                </button>
                <Link
                  to="/project"
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold px-5 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  View Plot Grid Matrix
                </Link>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>
      </section>


      {/* ========================================================== */}
      {/* 5. TWILIGHT AMBIANCE & CURATED LIGHTING SHOWCASE (NEW)      */}
      {/* ========================================================== */}
      <section id="lighting" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold uppercase tracking-wider text-amber-700">
                <Moon className="w-3.5 h-3.5" />
                <span>Evening Illumination &bull; Curated Lighting</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                Atmospheric Evening Ambiance
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                Experience the tranquility of dusk across our landscaped avenues. Designed with energy-efficient warm amber lighting fixtures, illuminated tree avenues, and glowing private outdoor terraces that elevate evening living.
              </p>
            </div>

            {/* Interactive Scene Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
              {lightingScenes.map((scene, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLightingIndex(idx)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeLightingIndex === idx
                      ? 'bg-white text-brand-orange shadow-xs scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Scene {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Big Spotlight Card */}
        <ScrollReveal direction="up" delay={120}>
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 group">
            <div className="relative h-[380px] sm:h-[520px] overflow-hidden">
              <img
                src={lightingScenes[activeLightingIndex].image}
                alt={lightingScenes[activeLightingIndex].title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Subtle Twilight Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
                <span className="bg-orange-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl shadow-xs">
                  {lightingScenes[activeLightingIndex].badge}
                </span>
                <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-medium px-3 py-1 rounded-xl border border-white/20">
                  {lightingScenes[activeLightingIndex].tag}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
                <div className="max-w-2xl space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-widest text-orange-400">
                    {lightingScenes[activeLightingIndex].category}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold">
                    {lightingScenes[activeLightingIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {lightingScenes[activeLightingIndex].desc}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPhotoModal(lightingScenes[activeLightingIndex])}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105 shrink-0 flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge View</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Quick Cards Grid for Direct Navigation */}
        <ScrollReveal direction="up" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lightingScenes.map((scene, idx) => {
              const isActive = activeLightingIndex === idx;
              return (
                <TiltCard
                  key={idx}
                  maxTilt={5}
                  onClick={() => setActiveLightingIndex(idx)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-4 ${
                    isActive
                      ? 'bg-orange-50/80 border-brand-orange shadow-md ring-1 ring-orange-500/30 scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <img
                    src={scene.image}
                    alt={scene.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 shadow-xs"
                  />
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                      {scene.badge}
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {scene.title}
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </ScrollReveal>
      </section>


      {/* ========================================================== */}
      {/* 6. ON-SITE INFRASTRUCTURE & REAL PHOTO GALLERY SHOWCASE    */}
      {/* ========================================================== */}
      <section id="developments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-2 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
                On-Site Reality &bull; Verified Construction
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                Project Amenities &amp; Infrastructure
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-light leading-relaxed">
                Authentic on-site development photography highlighting genuine completed avenues, landscaped park reserves, water utilities, and gated security portals.
              </p>
            </div>

            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="btn-shimmer inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-all hover:-translate-y-0.5 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Escorted Site Tour</span>
            </button>
          </div>
        </ScrollReveal>

        {/* 8 Photo Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {onSiteDevelopments.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 60} direction="up">
              <TiltCard
                maxTilt={6}
                onClick={() => setSelectedPhotoModal(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col cursor-pointer h-full"
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
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ========================================================== */}
      {/* 7. COMPLETE 12 AMENITIES GRID                              */}
      {/* ========================================================== */}
      <section id="amenities" className="bg-slate-50/80 border-y border-slate-200/70 py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-100/70 px-3.5 py-1 rounded-full">
                Sanctioned Standards
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Master Plan Features &amp; Infrastructure
              </h2>
              <p className="text-sm text-slate-600">
                Built to high DTCP regulatory benchmarks ensuring long-term liveability and generational asset protection.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {amenities.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <ScrollReveal key={idx} delay={(idx % 4) * 70} direction="up">
                  <TiltCard
                    maxTilt={5}
                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-orange-200 transition-all duration-200 space-y-3 group h-full"
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
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 8. SPECIAL LANDMARK & LOCATION HIGHLIGHTS EXPLORER         */}
      {/* ========================================================== */}
      <section id="landmarks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <ScrollReveal direction="up">
          <SpecialLandmarkView />
        </ScrollReveal>
      </section>

      {/* ========================================================== */}
      {/* 9. COMPREHENSIVE INTERACTIVE FAQ ACCORDION                 */}
      {/* ========================================================== */}
      <section id="faqs" className="bg-slate-50/80 py-16 border-y border-slate-200/80 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <ScrollReveal direction="up">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Everything You Need to Know
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Transparent answers regarding DTCP &amp; TS RERA approvals, plot dimensions, bank financing, and Kadthal location advantages.
              </p>
            </div>
          </ScrollReveal>

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
          <ScrollReveal direction="up" delay={80}>
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
          </ScrollReveal>

          {/* Still Have Questions Card */}
          <ScrollReveal direction="up" delay={120}>
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
                className="btn-shimmer bg-brand-orange hover:bg-brand-orange-dark text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
              >
                Ask Skandha Advisory
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 10. VIP PRIVATE SITE VISIT INVITATION                      */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden group">
            <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-200 bg-white/20 px-3 py-1 rounded-full">
                Complimentary Daily Site Tours
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Experience Our Kadthal Venture In Person
              </h2>
              <p className="text-sm sm:text-base text-orange-100 leading-relaxed font-light">
                Walk the wide blacktop avenues, inspect the landscaped Ac. 0.758 park, and experience the serenity of Kadthal just 1 minute from Maisigandi Temple.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="btn-shimmer bg-white hover:bg-orange-50 text-brand-orange font-bold px-8 py-4 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Private Escorted Visit</span>
                </button>
                <Link
                  to="/contact"
                  className="bg-orange-950/40 hover:bg-orange-950/60 border border-white/30 text-white font-bold px-7 py-4 rounded-xl text-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Route &amp; Driving Map</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
      </div>

      {/* On-Site Development / Lighting Photo Detail Modal */}
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
                  Skandha Group Lifestyle Feature
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
