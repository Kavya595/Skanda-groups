import React, { useState, useEffect } from 'react';
import {
  Compass,
  Box,
  Layers,
  Search,
  Filter,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { fetchPlots, fetchPlotStats, trackActivityEvent } from '../api/client';
import Layout2DView from '../visualizer/Layout2DView';
import Layout3DView from '../visualizer/Layout3DView';
import PlotDrawer from '../components/PlotDrawer';
import EnquiryModal from '../components/EnquiryModal';
import { statusColors } from '../visualizer/layoutData';

export default function PlotAvailabilityPage() {
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
  const [plots, setPlots] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [facingFilter, setFacingFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Plot & Modals
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    trackActivityEvent('layout_opened', null, { viewMode });
    loadPlots();
    loadStats();
  }, []);

  const loadPlots = async () => {
    setLoading(true);
    try {
      const res = await fetchPlots({ all: 'true' });
      if (res.success && res.plots) {
        setPlots(res.plots);
      }
    } catch (err) {
      console.error('Failed to load plots:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetchPlotStats();
      if (res.success) setStats(res.stats);
    } catch (err) {}
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

  const filteredPlotsCount = plots.filter(plot => {
    if (statusFilter !== 'all' && plot.status !== statusFilter) return false;
    if (facingFilter !== 'all' && !plot.facing.toLowerCase().includes(facingFilter.toLowerCase())) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const numMatch = String(plot.plotNumber) === s;
      const blockMatch = plot.block && plot.block.toLowerCase().includes(s);
      if (!numMatch && !blockMatch) return false;
    }
    return true;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
              Interactive Master Plan
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              DTCP: TLP NO. 87/2024/H
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Plot Availability & Layout Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select any numbered plot to inspect survey dimensions, area (sq.yds), facing direction, and booking status.
          </p>
        </div>

        {/* 2D / 3D Switch Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto">
          <button
            onClick={() => handleViewModeToggle('2d')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              viewMode === '2d'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-brand-orange" />
            <span>2D Master Plan</span>
          </button>

          <button
            onClick={() => handleViewModeToggle('3d')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-4 h-4 text-emerald-600" />
            <span>3D Interactive Scene</span>
          </button>
        </div>
      </div>

      {/* Inventory Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Total Plots</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{stats?.total || 96}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
          <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">{stats?.available || 70}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs">
          <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Reserved</span>
          </div>
          <div className="text-xl font-bold text-amber-700 mt-0.5">{stats?.reserved || 12}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Sold Out</span>
          </div>
          <div className="text-xl font-bold text-slate-600 mt-0.5">{stats?.sold || 12}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-300 bg-zinc-50 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
            <span>Open Park Space</span>
          </div>
          <div className="text-base font-bold text-zinc-800 mt-0.5">Ac. 0.758 Cts</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search by plot number */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Plot # (e.g. 24)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Only</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Facing filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Facing:</span>
            <select
              value={facingFilter}
              onChange={(e) => setFacingFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="all">All Facings</option>
              <option value="East">East Facing</option>
              <option value="West">West Facing</option>
              <option value="North">North Facing</option>
              <option value="South">South Facing</option>
              <option value="North-East">North-East Corner</option>
              <option value="South-East">South-East Corner</option>
            </select>
          </div>

          {(statusFilter !== 'all' || facingFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setFacingFilter('all');
                setSearchTerm('');
              }}
              className="inline-flex items-center gap-1 text-xs text-brand-orange hover:underline font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredPlotsCount}</strong> of {plots.length} plots
        </div>
      </div>

      {/* Main Visualizer Container */}
      {loading ? (
        <div className="h-[600px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm font-semibold text-slate-600">Loading approved layout dataset...</div>
          </div>
        </div>
      ) : viewMode === '2d' ? (
        <Layout2DView
          plots={plots}
          selectedPlot={selectedPlot}
          onSelectPlot={handleSelectPlot}
          filterStatus={statusFilter}
          filterFacing={facingFilter}
          searchTerm={searchTerm}
        />
      ) : (
        <Layout3DView
          plots={plots}
          selectedPlot={selectedPlot}
          onSelectPlot={handleSelectPlot}
        />
      )}

      {/* Visual Color Legend Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-emerald-500 border border-emerald-600" />
            <span>Available Plot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-amber-400 border border-amber-500" />
            <span>Reserved Plot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-slate-300 border border-slate-400" />
            <span>Sold Out</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-zinc-600 border border-zinc-700" />
            <span>Blocked / Developer Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-300 border border-green-500" />
            <span>Reserved Open Park (Ac. 0.758 cents)</span>
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          Click any plot for dimensions & enquiry options
        </div>
      </div>

      {/* Right-side Plot Drawer */}
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
