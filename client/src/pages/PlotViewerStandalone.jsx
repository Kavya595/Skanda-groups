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
  Info
} from 'lucide-react';
import { fetchPlots, fetchPlotStats, trackActivityEvent } from '../api/client';
import { getEnrichedPlots, LAYOUT_BOUNDS, statusColors } from '../visualizer/masterPlanData';
import Layout3DView from '../visualizer/Layout3DView';
import Layout2DView from '../visualizer/Layout2DView';
import PlotDrawer from '../components/PlotDrawer';
import EnquiryModal from '../components/EnquiryModal';

export default function PlotViewerStandalone({ settings }) {
  const [viewMode, setViewMode] = useState('3d'); // '3d' default per Plots99
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

  const containerRef = useRef(null);

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
        // Enrich backend plots with master plan GIS coordinates
        const enriched = getEnrichedPlots(plotsRes.plots);
        setPlots(enriched);
      } else {
        // Fallback to static master plan definitions
        setPlots(getEnrichedPlots());
      }

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.warn('Backend plots fetch failed, using authoritative local master plan:', err);
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

  const filteredPlotsCount = plots.filter(plot => {
    if (statusFilter !== 'all' && plot.status !== statusFilter) return false;
    if (facingFilter !== 'all' && !plot.facing.toLowerCase().includes(facingFilter.toLowerCase())) return false;
    if (searchTerm) {
      const s = searchTerm.trim().toLowerCase();
      const numMatch = String(plot.plotNumber) === s;
      const blockMatch = plot.block && plot.block.toLowerCase().includes(s);
      if (!numMatch && !blockMatch) return false;
    }
    return true;
  }).length;

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-slate-900 flex flex-col font-sans select-none"
    >
      {/* ========================================================== */}
      {/* 1. TOP FLOATING HUD HEADER (BRANDING, SEARCH, FILTERS)     */}
      {/* ========================================================== */}
      <header className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Project Branding & Official DTCP Approvals */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-xl pointer-events-auto flex items-center gap-3.5">
          <a
            href="/"
            className="flex items-center gap-2 group"
            title="Return to Skandha Group main website"
          >
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
              DTCP TLP NO. 87/2024/H &bull; TS RERA: PO2400009081 &bull; Kadthal
            </div>
          </div>
        </div>

        {/* Right: Search Plot # & Status Quick Filters */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/90 shadow-xl pointer-events-auto flex items-center gap-2.5">
          {/* Search Box */}
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

          {/* Quick Filter Badges */}
          <div className="hidden md:flex items-center gap-1.5 border-l border-slate-200 pl-2.5">
            <button
              onClick={() => toggleStatusFilter('available')}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'available'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Available ({stats?.available || 70})
            </button>

            <button
              onClick={() => toggleStatusFilter('reserved')}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'reserved'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Reserved ({stats?.reserved || 12})
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

      {/* ========================================================== */}
      {/* 2. RIGHT COMPACT CIRCULAR GLASS TOOLBAR (PLOTS99 CONTROLS) */}
      {/* ========================================================== */}
      <aside className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5 pointer-events-auto">
        {/* Fit to Layout */}
        <button
          onClick={() => setCameraPreset('overview')}
          className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200/90 text-slate-700 hover:text-brand-orange hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
          title="Fit Master Plan to Viewport"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Overhead / Top-down Angle */}
        <button
          onClick={() => setCameraPreset('topDown')}
          className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200/90 text-slate-700 hover:text-brand-orange hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
          title="Top-Down Orthographic View"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Measure Distance Tool */}
        <button
          onClick={() => {
            setIsMeasureMode(!isMeasureMode);
            setMeasurePoints([]);
          }}
          className={`w-11 h-11 rounded-full shadow-lg border transition-all duration-200 hover:scale-110 flex items-center justify-center ${
            isMeasureMode
              ? 'bg-brand-orange text-white border-orange-600 ring-2 ring-orange-400/50'
              : 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-brand-orange border-slate-200/90 hover:bg-white'
          }`}
          title="Measure Distance between Plots (Click any 2 points)"
        >
          <Ruler className="w-4 h-4" />
        </button>

        {/* Toggle Vehicles / Motion */}
        <button
          onClick={() => setAnimateVehicles(!animateVehicles)}
          className={`w-11 h-11 rounded-full shadow-lg border transition-all duration-200 hover:scale-110 flex items-center justify-center ${
            animateVehicles
              ? 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-brand-orange border-slate-200/90'
              : 'bg-slate-200 text-slate-400 border-slate-300'
          }`}
          title={animateVehicles ? 'Pause Moving Vehicles' : 'Resume Moving Vehicles'}
        >
          <Car className="w-4 h-4" />
        </button>

        {/* Fullscreen Mode */}
        <button
          onClick={handleToggleFullscreen}
          className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200/90 text-slate-700 hover:text-brand-orange hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </aside>

      {/* ========================================================== */}
      {/* 3. MAIN DOMINANT MAP (3D R3F OR 2D SVG MASTER PLAN)        */}
      {/* ========================================================== */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-semibold tracking-wide">
                Rendering Alekhya's Brundavan Master Plan...
              </div>
              <div className="text-xs text-slate-400">
                DTCP TLP NO. 87/2024/H &bull; 96 Approved Plots
              </div>
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
      </main>

      {/* ========================================================== */}
      {/* 4. BOTTOM LEFT FLOATING INVENTORY LEGEND (LIVE DB COUNTS)  */}
      {/* ========================================================== */}
      <div className="absolute bottom-14 sm:bottom-4 left-4 z-30 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-2xl space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between gap-3">
            <span>Layout Availability</span>
            <span className="text-slate-400">Total: {stats?.total || 96} Plots</span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 text-xs font-semibold">
            {/* Available */}
            <button
              onClick={() => toggleStatusFilter('available')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                statusFilter === 'available'
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400/40'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Available ({stats?.available || 70})</span>
            </button>

            {/* Reserved */}
            <button
              onClick={() => toggleStatusFilter('reserved')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                statusFilter === 'reserved'
                  ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-400/40'
                  : 'bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Reserved ({stats?.reserved || 12})</span>
            </button>

            {/* Sold Out */}
            <button
              onClick={() => toggleStatusFilter('sold')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                statusFilter === 'sold'
                  ? 'bg-rose-100 border-rose-500 text-rose-900 ring-2 ring-rose-400/40'
                  : 'bg-rose-50/70 border-rose-200 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Sold Out ({stats?.sold || 12})</span>
            </button>

            {/* Park Space */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50/70 border border-green-200 text-green-800">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
              <span>Park (Ac. 0.758)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 5. BOTTOM RIGHT 2D/3D PILL SWITCHER                       */}
      {/* ========================================================== */}
      <div className="absolute bottom-14 sm:bottom-4 right-4 z-30 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-2xl flex items-center gap-1">
          <button
            onClick={() => handleViewModeToggle('3d')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-brand-orange" />
            <span>3D Interactive</span>
          </button>

          <button
            onClick={() => handleViewModeToggle('2d')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === '2d'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>2D Master Plan</span>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 6. UNOBTRUSIVE BOTTOM STRIP                               */}
      {/* ========================================================== */}
      <footer className="h-9 bg-slate-900/95 backdrop-blur-xs border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 z-20">
        <div className="flex items-center gap-3">
          <span>Skandha Group &bull; Alekhya's Brundavan, Kadthal</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-500">
            DTCP: TLP NO. 87/2024/H &bull; TS RERA: PO2400009081
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Marketing Website</span>
          </a>
        </div>
      </footer>

      {/* ========================================================== */}
      {/* 7. PLOT DETAIL DRAWER (DESKTOP) & BOTTOM SHEET (MOBILE)    */}
      {/* ========================================================== */}
      <PlotDrawer
        plot={selectedPlot}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEnquire={(p) => {
          setIsDrawerOpen(false);
          setIsEnquiryOpen(true);
        }}
      />

      {/* ========================================================== */}
      {/* 8. VERIFIED ENQUIRY MODAL (WITH WHATSAPP HANDOFF)         */}
      {/* ========================================================== */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefilledPlot={selectedPlot}
      />
    </div>
  );
}
