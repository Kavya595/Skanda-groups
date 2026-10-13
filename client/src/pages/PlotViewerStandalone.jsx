import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Box,
  Layers,
  Search,
  RotateCcw,
  Maximize2,
  Minimize2,
  Ruler,
  Car,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  X,
  Info,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall,
  Share2,
  Navigation,
  ChevronDown,
  Building,
  Trees,
  Droplets,
  Lightbulb,
  Award,
  Calculator,
  ChevronRight,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { fetchPlots, fetchPlotStats, trackActivityEvent } from '../api/client';
import { getEnrichedPlots, LAYOUT_BOUNDS, statusColors } from '../visualizer/masterPlanData';
import Layout3DView from '../visualizer/Layout3DView';
import Layout2DView from '../visualizer/Layout2DView';
import PlotDrawer from '../components/PlotDrawer';
import EnquiryModal from '../components/EnquiryModal';

// Curated Nearby Landmarks matching Plots99 Screenshot 5
const nearbyLandmarks = [
  {
    name: 'Maisigandi Maisamma Temple',
    category: 'SPIRITUAL LANDMARK',
    distance: '0.8 km',
    time: '1 min',
    icon: Sparkles,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    name: 'Srisailam Highway (NH 765)',
    category: 'NATIONAL HIGHWAY',
    distance: 'Direct Frontage',
    time: '0 min',
    icon: Navigation,
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    name: 'Upcoming Mucherla Future City & AI City',
    category: 'ECONOMIC HUB',
    distance: '14.2 km',
    time: '12m 30s',
    icon: Building,
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  {
    name: 'Hyderabad Pharma City & Life Sciences SEZ',
    category: 'INDUSTRIAL CORRIDOR',
    distance: '18.5 km',
    time: '15m 45s',
    icon: Building,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    name: 'Regional Ring Road (RRR) Kadthal Junction',
    category: 'EXPRESSWAY',
    distance: '12.4 km',
    time: '10m 20s',
    icon: Navigation,
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  {
    name: 'Kandukur & Maheshwaram Aerospace Park',
    category: 'TECH & DEFENCE',
    distance: '24.1 km',
    time: '20m 10s',
    icon: Building,
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200'
  },
  {
    name: 'RVM Institute of Medical Sciences & Hospital',
    category: 'HEALTHCARE',
    distance: '21.8 km',
    time: '18m 40s',
    icon: Droplets,
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  {
    name: 'Bhashyam Blooms International School',
    category: 'EDUCATION',
    distance: '16.2 km',
    time: '14m 15s',
    icon: Award,
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200'
  },
  {
    name: 'Rajiv Gandhi International Airport (RGIA)',
    category: 'INTERNATIONAL AIRPORT',
    distance: '38.5 km',
    time: '32m 00s',
    icon: Navigation,
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  {
    name: 'Wonderla Amusement Park',
    category: 'RECREATION',
    distance: '31.2 km',
    time: '26m 30s',
    icon: Sparkles,
    badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  },
  {
    name: 'Foxconn Manufacturing & Kongara Kalan Hub',
    category: 'ELECTRONICS SEZ',
    distance: '26.7 km',
    time: '22m 45s',
    icon: Building,
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200'
  },
  {
    name: 'Outer Ring Road (ORR) Exit 14 Tukkuguda',
    category: 'HIGHWAY INTERCHANGE',
    distance: '34.0 km',
    time: '28m 15s',
    icon: Navigation,
    badgeColor: 'bg-violet-50 text-violet-800 border-violet-200'
  }
];

// Luxury Infrastructure Highlights
const luxuryAmenities = [
  {
    title: "60' & 33' Blacktop Asphalt Roads",
    desc: 'Wide, heavy-duty blacktop internal arterial roads with curbed stormwater drainage and road markings.',
    image: '/assets/site_bt_roads.jpg'
  },
  {
    title: 'Ac. 0.758 Cents Landscaped Park',
    desc: 'Dedicated open green space with manicured grass lawns, ornamental flora, and seating gazebos.',
    image: '/assets/site_landscape_park.jpg'
  },
  {
    title: 'Children’s Play Arena & Jogging Track',
    desc: 'Safe, rubberized play equipment for kids and a continuous jogging track surrounded by lush palm trees.',
    image: '/assets/site_children_park.jpg'
  },
  {
    title: 'Royal Palm Avenue Landscaping',
    desc: 'Hundreds of planted royal palms line every boulevard and layout boundary, providing shade and fresh air.',
    image: '/assets/site_avenue_plantation.jpg'
  },
  {
    title: '24/7 Overhead Water Storage Tank',
    desc: 'Dedicated high-capacity overhead reservoir supplying pressurized, continuous water to every plot.',
    image: '/assets/site_overhead_tank.jpg'
  },
  {
    title: 'Modern Underground Drainage Network',
    desc: 'Full-fledged underground drainage and rainwater harvesting pits for zero waterlogging.',
    image: '/assets/site_drainage_system.jpg'
  }
];

// Interactive FAQs
const faqItems = [
  {
    q: "Is Alekhya's Brundavan fully DTCP and TS RERA approved?",
    a: "Yes. The layout is officially approved under DTCP TLP NO. 87/2024/H and registered under TS RERA PO2400009081 with 100% clear legal titles and instant spot registration clearance."
  },
  {
    q: "What are the plot dimensions and area ranges available?",
    a: "Standard residential plots range from 183 Sq.Yds (33' x 50') to 202 Sq.Yds (33' x 55'), 241 Sq.Yds (37' x 58'), 264 Sq.Yds, and up to 672 Sq.Yds for premium highway-facing corner plots."
  },
  {
    q: "Are bank loans available for purchasing plots here?",
    a: "Yes. Due to clean DTCP approvals and title clearance, bank loans of up to 70% to 75% are pre-sanctioned through major banks including SBI, HDFC, ICICI, and Union Bank."
  },
  {
    q: "How does the Mucherla Future City & Pharma City impact capital appreciation?",
    a: "Located directly along the Srisailam Highway (NH-765) growth corridor, Alekhya's Brundavan is just 12-15 minutes from the designated 19,000-acre Pharma City and the upcoming AI-driven Mucherla Future City, offering substantial high-yield capital growth."
  }
];

export default function PlotViewerStandalone({ settings }) {
  const [viewMode, setViewMode] = useState('3d');
  const [plots, setPlots] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('all');
  const [facingFilter, setFacingFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Plot & Modals
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Tools & State
  const [cameraPreset, setCameraPreset] = useState('overview');
  const [animateVehicles, setAnimateVehicles] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMeasureMode, setIsMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);

  // Active FAQ accordion
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Investment Calculator state
  const [calcPlotArea, setCalcPlotArea] = useState(202);
  const [calcRatePerYd, setCalcRatePerYd] = useState(12500);
  const [calcDownPaymentPercent, setCalcDownPaymentPercent] = useState(25);
  const [calcTenureYears, setCalcTenureYears] = useState(10);

  const containerRef = useRef(null);
  const mapSectionRef = useRef(null);

  useEffect(() => {
    trackActivityEvent('layout_opened', null, { viewMode, standalone: true });
    loadLayoutData();
  }, []);

  const loadLayoutData = async () => {
    setLoading(true);
    try {
      const [plotsRes, statsRes] = await Promise.all([
        fetchPlots({ all: 'true' }),
        fetchPlotStats()
      ]);

      if (plotsRes.success && plotsRes.plots) {
        const enriched = getEnrichedPlots(plotsRes.plots);
        setPlots(enriched);
      } else {
        setPlots(getEnrichedPlots());
      }

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.warn('Backend plots fetch failed, using authoritative master plan:', err);
      setPlots(getEnrichedPlots());
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlot = (plot) => {
    setSelectedPlot(plot);
    setIsDrawerOpen(true);
    trackActivityEvent('plot_viewed', plot.plotNumber, {
      status: plot.status,
      facing: plot.facing
    });
  };

  const handleViewModeToggle = (mode) => {
    setViewMode(mode);
    trackActivityEvent('view_mode_toggled', null, { viewMode: mode });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  const handleMeasurePoint = (pt) => {
    setMeasurePoints(prev => {
      if (prev.length >= 2) return [pt];
      return [...prev, pt];
    });
  };

  const toggleStatusFilter = (status) => {
    setStatusFilter(prev => prev === status ? 'all' : status);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculator computations
  const totalCost = calcPlotArea * calcRatePerYd;
  const downPayment = Math.round(totalCost * (calcDownPaymentPercent / 100));
  const loanAmount = totalCost - downPayment;
  const monthlyRate = 0.0875 / 12; // 8.75% per annum
  const totalMonths = calcTenureYears * 12;
  const monthlyEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  // Estimated 5-year capital value at conservative 18% annual growth
  const projectedFiveYearValue = Math.round(totalCost * Math.pow(1 + 0.18, 5));

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* ========================================================== */}
      {/* 1. TOP INTERACTIVE MASTER PLAN MAP (75VH HEIGHT)           */}
      {/* ========================================================== */}
      <section
        ref={mapSectionRef}
        className="relative w-full h-[76vh] min-h-[540px] bg-[#DFEFE0] overflow-hidden select-none border-b border-slate-200"
      >
        {/* Floating Top Header (Branding & Search) */}
        <header className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-xl pointer-events-auto flex items-center gap-3.5">
            <a href="/" className="flex items-center gap-2 group" title="Return to Skandha Group main website">
              <img
                src="/assets/skandha_logo.svg"
                alt="Skandha Group"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </a>

            <div className="border-l border-slate-200 pl-3">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base text-slate-900 leading-tight">
                  Alekhya's Brundavan
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-50 text-brand-orange border border-orange-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Master Plan
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                DTCP: TLP NO. 87/2024/H &bull; TS RERA: PO2400009081 &bull; Kadthal
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/90 shadow-xl pointer-events-auto flex items-center gap-2.5">
            <div className="relative w-44 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Plot # (e.g. 24)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="hidden md:flex items-center gap-1.5 border-l border-slate-200 pl-2.5">
              <button
                onClick={() => toggleStatusFilter('available')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'available'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Available ({stats?.available || 81})
              </button>

              <button
                onClick={() => toggleStatusFilter('reserved')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'reserved'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Reserved ({stats?.reserved || 7})
              </button>

              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="text-[11px] text-slate-500 hover:text-brand-orange underline font-medium px-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Floating Right Circular Toolbar */}
        <aside className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5 pointer-events-auto">
          <button
            onClick={() => setCameraPreset('overview')}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200/90 text-slate-700 hover:text-brand-orange hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
            title="Fit Master Plan to Viewport"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCameraPreset('topDown')}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200/90 text-slate-700 hover:text-brand-orange hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
            title="Top-Down Orthographic View"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsMeasureMode(!isMeasureMode);
              setMeasurePoints([]);
            }}
            className={`w-10 h-10 rounded-full shadow-lg border transition-all duration-200 hover:scale-110 flex items-center justify-center ${
              isMeasureMode
                ? 'bg-brand-orange text-white border-orange-600 ring-2 ring-orange-400/50'
                : 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-brand-orange border-slate-200/90 hover:bg-white'
            }`}
            title="Measure Distance between Plots (Click any 2 points)"
          >
            <Ruler className="w-4 h-4" />
          </button>

          <button
            onClick={() => setAnimateVehicles(!animateVehicles)}
            className={`w-10 h-10 rounded-full shadow-lg border transition-all duration-200 hover:scale-110 flex items-center justify-center ${
              animateVehicles
                ? 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-brand-orange border-slate-200/90'
                : 'bg-slate-200 text-slate-400 border-slate-300'
            }`}
            title={animateVehicles ? 'Pause Moving Vehicles' : 'Resume Moving Vehicles'}
          >
            <Car className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200/90 text-slate-700 hover:text-brand-orange hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </aside>

        {/* Map Canvas (3D or 2D) */}
        <div className="w-full h-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-[#DFEFE0]">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-xs font-semibold text-slate-700">Loading master plan...</div>
              </div>
            </div>
          ) : viewMode === '3d' ? (
            <Layout3DView
              plots={plots}
              selectedPlot={selectedPlot}
              onSelectPlot={handleSelectPlot}
              cameraPreset={cameraPreset}
              animateVehicles={animateVehicles}
              isMeasureMode={isMeasureMode}
              measurePoints={measurePoints}
              onMeasurePoint={handleMeasurePoint}
            />
          ) : (
            <Layout2DView
              plots={plots}
              selectedPlot={selectedPlot}
              onSelectPlot={handleSelectPlot}
              filterStatus={statusFilter}
              filterFacing={facingFilter}
              searchTerm={searchTerm}
            />
          )}
        </div>

        {/* Bottom Left Floating Legend (Plots99 Exact Structure) */}
        <div className="absolute bottom-4 left-4 z-30 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                onClick={() => toggleStatusFilter('sold')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F89898]/30 border border-[#F89898] text-[#7F1D1D] hover:bg-[#F89898]/50 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#F89898]" />
                <span>{stats?.sold || 7} SOLD</span>
              </button>

              <button
                onClick={() => toggleStatusFilter('reserved')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FBE38E]/40 border border-[#EAB308] text-[#78350F] hover:bg-[#FBE38E]/60 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBE38E]" />
                <span>{stats?.reserved || 7} RESERVED</span>
              </button>

              <button
                onClick={() => toggleStatusFilter('available')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#9BD89E]/40 border border-[#6BBF6F] text-[#064E3B] hover:bg-[#9BD89E]/60 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#9BD89E]" />
                <span>{stats?.available || 81} AVAILABLE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Right 2D/3D Pill */}
        <div className="absolute bottom-4 right-4 z-30 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/90 shadow-2xl flex items-center gap-1">
            <button
              onClick={() => handleViewModeToggle('2d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === '2d'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D
            </button>
            <button
              onClick={() => handleViewModeToggle('3d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 2. STICKY SUB-NAV BAR (MATCHING PLOTS99 SCREENSHOT 1 & 2)  */}
      {/* ========================================================== */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-3 overflow-x-auto no-scrollbar">
          {/* Quick Jump Links */}
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 shrink-0">
            <button
              onClick={() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-brand-orange font-bold flex items-center gap-1 hover:text-brand-orange-dark transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Interactive Map</span>
            </button>
            <button onClick={() => scrollToSection('sec-overview')} className="hover:text-brand-orange transition-colors">
              Overview
            </button>
            <button onClick={() => scrollToSection('sec-landmarks')} className="hover:text-brand-orange transition-colors">
              Nearby Landmarks
            </button>
            <button onClick={() => scrollToSection('sec-amenities')} className="hover:text-brand-orange transition-colors">
              Infrastructure
            </button>
            <button onClick={() => scrollToSection('sec-calculator')} className="hover:text-brand-orange transition-colors">
              ROI & EMI
            </button>
            <button onClick={() => scrollToSection('sec-approvals')} className="hover:text-brand-orange transition-colors">
              Approvals
            </button>
            <button onClick={() => scrollToSection('sec-faqs')} className="hover:text-brand-orange transition-colors">
              FAQs
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask Advisor</span>
            </button>

            <a
              href="https://maps.google.com/?q=Maisigandi+Temple+Kadthal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Directions</span>
            </a>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Alekhya's Brundavan by Skandha Group",
                    text: 'Explore interactive 2D & 3D plot master plan at Kadthal, Srisailam Highway.',
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Master Plan link copied to clipboard!');
                }
              }}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              title="Share Layout"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================== */}
      {/* 3. PROJECT BANNER & VITAL STATS STRIP                      */}
      {/* ========================================================== */}
      <section id="sec-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Plotted Villa Development
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Kadthal, Srisailam Highway (NH 765)
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-2">
                Alekhya's Brundavan
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                By <strong>Skandha Group</strong>. A DTCP-approved, 100% Vasthu-compliant residential plotted layout adjoining Srisailam Highway, situated 1 minute from Maisigandi Temple and minutes from the upcoming Mucherla Future City & Hyderabad Pharma City.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow transition-all"
              >
                <span>Enquire Plot Availability</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Spec Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">Total Plotted Units</div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">96 Plots</div>
              <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">81 Available for Booking</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">Plot Sizes Range</div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">183 - 672</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Sq. Yards (1,647 - 6,048 Sq.Ft)</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">Statutory Clearances</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">DTCP &amp; TS RERA</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">TLP NO. 87/2024/H</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">Open Space Park</div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">Ac. 0.758</div>
              <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">Landscaped Children's Park</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 4. NEARBY LANDMARKS & CONNECTIVITY (MATCHING SCREENSHOT 5) */}
      {/* ========================================================== */}
      <section id="sec-landmarks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Strategic Location</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Nearby Landmarks &amp; Connectivity
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Key locations, drive times, and growth infrastructure surrounding Alekhya's Brundavan at Kadthal.
              </p>
            </div>
          </div>

          {/* Clean Rounded Card Grid (Screenshot 5 Replica) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyLandmarks.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.category}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-brand-orange transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.distance}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.time}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 5. INFRASTRUCTURE & LUXURY AMENITIES SHOWCASE               */}
      {/* ========================================================== */}
      <section id="sec-amenities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              World-Class Plotted Infrastructure
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Engineered for Enduring Capital Value &amp; Villa Living
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Constructed to stringent DTCP guidelines with underground utilities, wide roads, and continuous landscaping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {luxuryAmenities.map((amenity, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:shadow-md transition-all duration-200 group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={amenity.image}
                    alt={amenity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-brand-orange transition-colors">
                    {amenity.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {amenity.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 6. INTERACTIVE ROI & EMI INVESTMENT CALCULATOR             */}
      {/* ========================================================== */}
      <section id="sec-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                <Calculator className="w-3.5 h-3.5" />
                <span>Financial Planner</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
                Interactive Plot Investment &amp; EMI Calculator
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Simulate your plot purchase, bank loan EMI, and project capital appreciation driven by the Future City corridor.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <span className="text-xs text-slate-400">Indicative Base Rate</span>
              <div className="text-xl font-bold text-amber-400">₹12,500 / Sq.Yd</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Sliders Form */}
            <div className="space-y-5 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Plot Size:</span>
                  <span className="text-amber-400 font-bold">{calcPlotArea} Sq.Yds (≈ {calcPlotArea * 9} Sq.Ft)</span>
                </div>
                <input
                  type="range"
                  min="183"
                  max="400"
                  step="19"
                  value={calcPlotArea}
                  onChange={(e) => setCalcPlotArea(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>183 Sq.Yds (Standard)</span>
                  <span>202 Sq.Yds</span>
                  <span>264 Sq.Yds</span>
                  <span>400 Sq.Yds (Corner)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Down Payment:</span>
                  <span className="text-amber-400 font-bold">{calcDownPaymentPercent}% (₹{downPayment.toLocaleString('en-IN')})</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="50"
                  step="5"
                  value={calcDownPaymentPercent}
                  onChange={(e) => setCalcDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Bank Loan Tenure:</span>
                  <span className="text-amber-400 font-bold">{calcTenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="1"
                  value={calcTenureYears}
                  onChange={(e) => setCalcTenureYears(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/15 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="text-xs text-slate-300">Total Plot Value</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    ₹{totalCost.toLocaleString('en-IN')}/-
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-300">Monthly Bank EMI</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    ₹{monthlyEmi.toLocaleString('en-IN')}/mo
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl space-y-1">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Projected 5-Year Capital Growth
                </div>
                <div className="text-xl font-bold text-white">
                  ₹{projectiveValueFormatted(projectedFiveYearValue)}
                </div>
                <div className="text-[11px] text-slate-300 leading-tight">
                  Estimated based on historical Srisailam Highway 18% annual growth with Mucherla Future City development.
                </div>
              </div>

              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg"
              >
                Apply for Pre-Approved Bank Loan &amp; Rate Sheet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 7. STATUTORY CLEARANCES & APPROVALS                        */}
      {/* ========================================================== */}
      <section id="sec-approvals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Legal Certainty</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            DTCP Approved &amp; TS RERA Registered
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Clear title ownership with instant spot registration. Pre-approved for housing and plotted development bank loans.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                DTCP Sanction Order
              </div>
              <div className="text-lg font-bold text-slate-900">
                TLP NO. 87/2024/H
              </div>
              <p className="text-xs text-slate-600">
                Directorate of Town and Country Planning official sanctioned layout approval.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                TS RERA Registration
              </div>
              <div className="text-lg font-bold text-slate-900">
                PO2400009081
              </div>
              <p className="text-xs text-slate-600">
                Telangana Real Estate Regulatory Authority registered project compliance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Title &amp; Bank Clearances
              </div>
              <div className="text-lg font-bold text-slate-900">
                100% Clear Title
              </div>
              <p className="text-xs text-slate-600">
                Direct spot registration with loan sanction options across SBI, HDFC, and ICICI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 8. INTERACTIVE FAQ ACCORDION                                */}
      {/* ========================================================== */}
      <section id="sec-faqs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <HelpCircle className="w-4 h-4" />
            <span>Buyer Due Diligence</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3 pt-2">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-brand-orange' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 9. BOTTOM FOOTER                                           */}
      {/* ========================================================== */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/skandha_logo_white.svg"
              alt="Skandha Group"
              className="h-10 w-auto object-contain"
            />
            <div className="border-l border-slate-700 pl-3">
              <div className="text-white font-serif font-bold text-base">Alekhya's Brundavan</div>
              <div className="text-xs text-slate-400">Kadthal &bull; DTCP TLP NO. 87/2024/H &bull; TS RERA PO2400009081</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <a href="/" className="hover:text-brand-orange transition-colors">Main Website</a>
            <a href="/project" className="hover:text-brand-orange transition-colors">Project Specifications</a>
            <a href="/gallery" className="hover:text-brand-orange transition-colors">Site Development Photos</a>
            <a href="/contact" className="hover:text-brand-orange transition-colors">Contact Office</a>
          </div>
        </div>
      </footer>

      {/* Specification Drawer / Bottom Sheet */}
      <PlotDrawer
        plot={selectedPlot}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEnquire={(p) => {
          setIsDrawerOpen(false);
          setIsEnquiryOpen(true);
        }}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefilledPlot={selectedPlot}
      />
    </div>
  );
}

function projectiveValueFormatted(num) {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Crores`;
  }
  return `₹${(num / 100000).toFixed(2)} Lakhs`;
}
