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
  HelpCircle,
  Check
} from 'lucide-react';
import { fetchPlots, fetchPlotStats, trackActivityEvent } from '../api/client';
import { getEnrichedPlots, LAYOUT_BOUNDS, statusColors } from '../visualizer/masterPlanData';
import Layout3DView from '../visualizer/Layout3DView';
import Layout2DView from '../visualizer/Layout2DView';
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
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Tools & State
  const [cameraPreset, setCameraPreset] = useState('overview');
  const [animateVehicles, setAnimateVehicles] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMeasureMode, setIsMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);

  // Dynamic facing distribution calculation for Property Insights (Photo 3)
  const facingCounts = React.useMemo(() => {
    const counts = { N: 0, NE: 0, E: 0, SE: 0, S: 0, SW: 0, W: 0, NW: 0 };
    plots.forEach(p => {
      const f = (p.facing || '').toLowerCase();
      if (f.includes('north-east') || f.includes('northeast')) counts.NE++;
      else if (f.includes('north-west') || f.includes('northwest')) counts.NW++;
      else if (f.includes('south-east') || f.includes('southeast')) counts.SE++;
      else if (f.includes('south-west') || f.includes('southwest')) counts.SW++;
      else if (f.includes('north')) counts.N++;
      else if (f.includes('south')) counts.S++;
      else if (f.includes('west')) counts.W++;
      else counts.E++;
    });
    return counts;
  }, [plots]);

  // Inventory breakdown percentages for Property Insights Pie Chart (Photo 3)
  const inventoryBreakdown = React.useMemo(() => {
    const total = plots.length || 96;
    const avail = plots.filter(p => p.status === 'available').length || 81;
    const sold = plots.filter(p => p.status === 'sold').length || 8;
    const res = plots.filter(p => p.status === 'reserved').length || 7;
    return {
      total,
      available: avail,
      sold,
      reserved: res,
      availPct: Math.round((avail / total) * 100),
      soldPct: Math.round((sold / total) * 100),
      resPct: Math.round((res / total) * 100)
    };
  }, [plots]);

  // Interactive Plot Sizer Form (NO hardcoded costs mentioned directly!)
  const [calcPlotArea, setCalcPlotArea] = useState(202);
  const [calcFacingPref, setCalcFacingPref] = useState('East');
  const [calcVillaType, setCalcVillaType] = useState('Duplex');

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

      let loadedPlots = [];
      if (plotsRes.success && plotsRes.plots) {
        loadedPlots = getEnrichedPlots(plotsRes.plots);
      } else {
        loadedPlots = getEnrichedPlots();
      }
      setPlots(loadedPlots);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      // Check URL query parameter for shared plot (User requirement: "each plot is sharable")
      const searchParams = new URLSearchParams(window.location.search);
      const targetPlotNum = searchParams.get('plot');
      if (targetPlotNum) {
        const found = loadedPlots.find(p => String(p.plotNumber) === String(targetPlotNum));
        if (found) {
          setSelectedPlot(found);
        }
      }
    } catch (err) {
      console.warn('Backend plots fetch failed, using authoritative master plan:', err);
      const fallbackPlots = getEnrichedPlots();
      setPlots(fallbackPlots);

      const searchParams = new URLSearchParams(window.location.search);
      const targetPlotNum = searchParams.get('plot');
      if (targetPlotNum) {
        const found = fallbackPlots.find(p => String(p.plotNumber) === String(targetPlotNum));
        if (found) {
          setSelectedPlot(found);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlot = (plot) => {
    setSelectedPlot(plot);
    trackActivityEvent('plot_viewed', plot.plotNumber, {
      status: plot.status,
      facing: plot.facing
    });
  };

  const handleShareCurrentPlot = (plot) => {
    const target = plot || selectedPlot;
    if (!target) return;
    const shareUrl = `${window.location.origin}/plots?plot=${target.plotNumber}`;
    if (navigator.share) {
      navigator.share({
        title: `Alekhya's Brundavan - Plot #${target.plotNumber}`,
        text: `Inspect Plot #${target.plotNumber} (${target.areaSqYds} sq.yds, ${target.facing} facing) in Alekhya's Brundavan at Kadthal.`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
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

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* ========================================================== */}
      {/* 1. TOP INTERACTIVE MASTER PLAN MAP (76VH HEIGHT)           */}
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

        {/* Floating Upper-Right Quick Plot Card (Small Tab matching Photo 4) */}
        {selectedPlot && (
          <div className="absolute top-16 right-3 sm:right-6 z-30 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-4 sm:p-5 animate-fadeIn pointer-events-auto">
            {/* Top Header matching Photo 4 */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedPlot.status === 'sold'
                    ? 'bg-[#F89898]'
                    : selectedPlot.status === 'reserved'
                    ? 'bg-[#FBE38E]'
                    : 'bg-[#68D391]'
                }`} />
                <span className="font-bold text-slate-900 text-base">
                  {selectedPlot.plotNumber}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {selectedPlot.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedPlot(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key-Value Details matching Photo 4 */}
            <div className="py-3.5 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Facing</span>
                <strong className="text-slate-900 font-bold">{selectedPlot.facing}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Area</span>
                <strong className="text-slate-900 font-bold">{selectedPlot.areaSqYds}.00 yd²</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Dimensions</span>
                <strong className="text-slate-900 font-bold">{selectedPlot.dimensions}</strong>
              </div>
            </div>

            {/* Actions Grid matching Photo 4 */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-800 font-semibold text-center border border-emerald-200 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Vasthu</span>
              </div>
              <button
                onClick={() => handleShareCurrentPlot(selectedPlot)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedShare ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <a
                href="https://maps.google.com/?q=Maisigandi+Temple+Kadthal"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-orange" />
                <span>Directions</span>
              </a>
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="p-2 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-[11px] text-white font-bold text-center transition-colors shadow-xs"
              >
                Enquire Plot
              </button>
            </div>
          </div>
        )}

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
            <button onClick={() => scrollToSection('sec-insights')} className="hover:text-brand-orange transition-colors">
              Insights
            </button>
            <button onClick={() => scrollToSection('sec-stats')} className="hover:text-brand-orange transition-colors">
              Stats
            </button>
            <button onClick={() => scrollToSection('sec-landmarks')} className="hover:text-brand-orange transition-colors">
              Nearby
            </button>
            <button onClick={() => setIsEnquiryOpen(true)} className="hover:text-brand-orange transition-colors">
              Contact
            </button>
          </div>

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
              onClick={() => handleShareCurrentPlot(selectedPlot || plots[0])}
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
                By <strong>Skandha Group</strong>. A DTCP-approved, 100% Vasthu-compliant residential plotted layout adjoining Srisailam Highway, situated 1 minute from Maisigandi Temple and minutes from the upcoming Mucherla Future City &amp; Hyderabad Pharma City.
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
              <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">Available for Booking</div>
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
      {/* 4. PROPERTY INSIGHTS & STATS (MATCHING PHOTO 3)            */}
      {/* ========================================================== */}
      <section id="sec-insights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Property Insights
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Detailed breakdown of orientations, availability, and area distributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Facing Distribution (Photo 3) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  <Compass className="w-3.5 h-3.5" />
                  <span>ANALYSIS</span>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mt-1">Facing Distribution</h4>
                <p className="text-xs text-slate-500 mt-0.5">Units oriented across cardinal directions</p>
              </div>

              {/* 8-Point Cardinal Compass Radar (Photo 3) */}
              <div className="relative w-56 h-56 mx-auto my-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-slate-200" />
                <div className="absolute inset-8 rounded-full border border-dashed border-slate-200" />
                <div className="absolute inset-16 rounded-full border border-slate-200/70" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500" />

                {/* Dashed axes */}
                <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-200" />
                <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 border-l border-dashed border-slate-200" />

                {/* North */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400">N</span>
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mt-0.5">
                    {facingCounts.N || 8}
                  </span>
                </div>

                {/* North-East */}
                <div className="absolute top-6 right-6 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400">NE</span>
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mt-0.5">
                    {facingCounts.NE || 6}
                  </span>
                </div>

                {/* East */}
                <div className="absolute top-1/2 right-1 -translate-y-1/2 flex items-center gap-1">
                  <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs">
                    {facingCounts.E || 44}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">E</span>
                </div>

                {/* South-East */}
                <div className="absolute bottom-6 right-6 flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mb-0.5">
                    {facingCounts.SE || 4}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">SE</span>
                </div>

                {/* South */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mb-0.5">
                    {facingCounts.S || 6}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">S</span>
                </div>

                {/* South-West */}
                <div className="absolute bottom-6 left-6 flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mb-0.5">
                    {facingCounts.SW || 4}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">SW</span>
                </div>

                {/* West */}
                <div className="absolute top-1/2 left-1 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-400">W</span>
                  <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs">
                    {facingCounts.W || 38}
                  </span>
                </div>

                {/* North-West */}
                <div className="absolute top-6 left-6 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400">NW</span>
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mt-0.5">
                    {facingCounts.NW || 6}
                  </span>
                </div>
              </div>

              <div className="text-center text-xs font-semibold text-emerald-700 bg-emerald-50/60 py-2 rounded-xl border border-emerald-100">
                +12 Multi-Facing &amp; Corner Units
              </div>
            </div>

            {/* Card 2: Inventory Status (Photo 3) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  <Layers className="w-3.5 h-3.5" />
                  <span>STOCK</span>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mt-1">Inventory Status</h4>
                <p className="text-xs text-slate-500 mt-0.5">Visual breakdown of unit availability</p>
              </div>

              {/* Pie / Donut Chart */}
              <div className="w-44 h-44 mx-auto my-6 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#68D391"
                    strokeWidth="24"
                    strokeDasharray={`${inventoryBreakdown.availPct * 2.38} 238`}
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#FC8181"
                    strokeWidth="24"
                    strokeDasharray={`${inventoryBreakdown.soldPct * 2.38} 238`}
                    strokeDashoffset={`-${inventoryBreakdown.availPct * 2.38}`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#F6E05E"
                    strokeWidth="24"
                    strokeDasharray={`${inventoryBreakdown.resPct * 2.38} 238`}
                    strokeDashoffset={`-${(inventoryBreakdown.availPct + inventoryBreakdown.soldPct) * 2.38}`}
                  />
                </svg>
              </div>

              {/* Legend below matching Photo 3 */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#68D391]" />
                  <span>Available {inventoryBreakdown.availPct}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#FC8181]" />
                  <span>Sold {inventoryBreakdown.soldPct}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#F6E05E]" />
                  <span>Reserved {inventoryBreakdown.resPct}%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Project Scale (Photo 3) */}
            <div id="sec-stats" className="bg-[#044E46] text-white p-7 rounded-3xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Project Scale
                </div>
                <div className="mt-5">
                  <div className="text-xs text-emerald-200">Total Units</div>
                  <div className="text-5xl font-extrabold mt-1">96</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-emerald-600/50 my-6">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">Total Area</div>
                  <div className="text-xl font-bold mt-1">24,200.00 yd²</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">In Acres</div>
                  <div className="text-xl font-bold mt-1">10.50 ac</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Kadthal, Srisailam Highway</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 6. PLOT SIZER & CUSTOM VILLA PLANNER (NO DIRECT COSTS)     */}
      {/* ========================================================== */}
      <section id="sec-sizer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                <Calculator className="w-3.5 h-3.5" />
                <span>Villa Footprint Planner</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
                Custom Villa Configuration &amp; Bank Assistance
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Select your preferred plot size, facing direction, and villa layout to receive official legal documentation and pre-approved bank loan options.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <span className="text-xs text-slate-400">Direct Developer Terms</span>
              <div className="text-base font-bold text-emerald-400">Pre-Approved Bank Loans</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Sliders Form */}
            <div className="space-y-5 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Target Plot Size:</span>
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
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Preferred Facing Orientation:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['East', 'West', 'North-East'].map((face) => (
                    <button
                      key={face}
                      type="button"
                      onClick={() => setCalcFacingPref(face)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        calcFacingPref === face
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {face} Facing
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Planned Villa Construction:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Duplex Villa', 'Triplex Luxury', 'Custom Estate'].map((vType) => (
                    <button
                      key={vType}
                      type="button"
                      onClick={() => setCalcVillaType(vType)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        calcVillaType === vType
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {vType}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Configured Summary */}
            <div className="bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/15 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="text-xs text-slate-300">Configured Footprint</div>
                  <div className="text-xl font-bold text-white mt-1">
                    {calcPlotArea} Sq.Yds
                  </div>
                  <div className="text-[11px] text-amber-400 mt-0.5 font-medium">
                    {calcFacingPref} Facing &bull; 100% Vasthu
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-300">Bank Loan Eligibility</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    Up to 75%
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    SBI, HDFC, ICICI Approved
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl space-y-1">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Official Developer Terms
                </div>
                <div className="text-sm font-semibold text-white">
                  Spot Registration with Clear Title Guarantee
                </div>
                <div className="text-[11px] text-slate-300 leading-tight">
                  Transparent terms direct from Skandha Group. Official rate cards and payment schedules provided upon consultation.
                </div>
              </div>

              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg"
              >
                Request Official Pricing Breakdown &amp; Loan Details
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
      {/* BOTTOM FOOTER                                              */}
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

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefilledPlot={selectedPlot}
      />
    </div>
  );
}
