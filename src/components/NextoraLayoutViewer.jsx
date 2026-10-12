import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Search, 
  X, 
  Layers, 
  Box, 
  Trees, 
  Compass, 
  Check, 
  Filter, 
  ArrowLeft, 
  Share2, 
  Lock, 
  Sparkles, 
  Info 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlotContext } from '../context/PlotContext';
import PlotMap3D from './PlotMap3D';
import ChallampallyMasterplan from './ChallampallyMasterplan';

export default function NextoraLayoutViewer({ 
  isFullscreen = false, 
  onClose = null, 
  showBackButton = false 
}) {
  const { plots, stats, projects } = usePlotContext();
  const currentProject = projects?.[0] || {
    name: 'Alekya Brundavan',
    dtcpNo: 'TLP NO. 87/2024/H',
    reraNo: 'PO2400009081',
    location: 'Kadthal, Srisailam Highway'
  };

  // View state: '2d' or '3d'
  const [viewMode, setViewMode] = useState('2d');

  // Search & Filter Drawer State (Nextora style)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState('0'); // '0'=all, '1'=plotNo, '2'=status, '3'=facing
  const [searchPlotNo, setSearchPlotNo] = useState('');
  const [filterStatus, setFilterStatus] = useState('0'); // '0'=all, '1'=available, '2'=booked, '3'=sold
  const [filterFacing, setFilterFacing] = useState('0'); // '0'=all, '1'=East, '2'=West, '3'=Corner

  // Active filter criteria applied to map
  const [appliedFilters, setAppliedFilters] = useState({
    plotNo: '',
    status: 'all',
    facing: 'all'
  });

  // Selected Plot & Popup State (Nextora style #popup)
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);

  // Pan & Zoom Canvas State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Fullscreen container toggle
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      setIsNativeFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsNativeFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Responsive Auto-fit Zoom on Mount and Resize
  useEffect(() => {
    const calculateInitialZoom = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const zoomX = (width - 70) / 1200;
      const zoomY = (height - 120) / 720;
      const bestZoom = Math.min(zoomX, zoomY, 1);
      setZoomLevel(Math.max(0.30, Math.min(1.0, Number(bestZoom.toFixed(2)))));
    };
    calculateInitialZoom();
    window.addEventListener('resize', calculateInitialZoom);
    return () => window.removeEventListener('resize', calculateInitialZoom);
  }, []);

  // Quick lookup map for plots by plot number
  const plotLookup = useMemo(() => {
    const map = {};
    plots.forEach(p => {
      map[p.number] = p;
    });
    return map;
  }, [plots]);

  // Total square yards statistics (Booked Area vs Available Area)
  const areaStats = useMemo(() => {
    let totalSqYards = 0;
    let bookedSqYards = 0;
    let availableSqYards = 0;

    plots.forEach(p => {
      const sq = Number(p.sqYards) || 0;
      totalSqYards += sq;
      if (p.status === 'booked' || p.status === 'sold') {
        bookedSqYards += sq;
      } else {
        availableSqYards += sq;
      }
    });

    return {
      total: totalSqYards.toLocaleString(),
      booked: bookedSqYards.toLocaleString(),
      available: availableSqYards.toLocaleString()
    };
  }, [plots]);

  // Handle Apply Search Filter
  const handleApplyFilter = () => {
    let statusVal = 'all';
    if (filterStatus === '1') statusVal = 'available';
    else if (filterStatus === '2') statusVal = 'booked';
    else if (filterStatus === '3') statusVal = 'sold';

    let facingVal = 'all';
    if (filterFacing === '1') facingVal = 'East';
    else if (filterFacing === '2') facingVal = 'West';
    else if (filterFacing === '3') facingVal = 'Corner';

    setAppliedFilters({
      plotNo: searchPlotNo.trim(),
      status: statusVal,
      facing: facingVal
    });

    // Auto-select plot if exact plot number is typed
    if (searchPlotNo.trim()) {
      const targetPlot = plots.find(p => p.number.toString() === searchPlotNo.trim());
      if (targetPlot) {
        setSelectedPlot(targetPlot);
      }
    }
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    setSearchPlotNo('');
    setFilterStatus('0');
    setFilterFacing('0');
    setSearchType('0');
    setAppliedFilters({
      plotNo: '',
      status: 'all',
      facing: 'all'
    });
  };

  // Reset Map View (Zoom & Pan)
  const handleResetMap = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedPlot(null);
  };

  // Handle Mouse Pan
  const handleMouseDown = (e) => {
    // Only drag with left mouse button if not clicking a plot button or interactive form
    if (e.button !== 0) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Zoom In / Zoom Out
  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(Math.max(0.3, prev + delta), 2.5));
  };

  // Handle Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setZoomLevel(prev => Math.min(Math.max(0.3, prev + zoomFactor), 2.5));
  };

  // Plot matching filter check
  const isPlotHighlighted = (plot) => {
    if (!plot) return false;
    if (appliedFilters.plotNo && !plot.number.toString().includes(appliedFilters.plotNo)) {
      return false;
    }
    if (appliedFilters.status !== 'all' && plot.status !== appliedFilters.status) {
      return false;
    }
    if (appliedFilters.facing !== 'all') {
      if (appliedFilters.facing === 'Corner' && !plot.isCorner) return false;
      if (appliedFilters.facing !== 'Corner' && !plot.facing.toLowerCase().includes(appliedFilters.facing.toLowerCase())) {
        return false;
      }
    }
    return true;
  };

  // Handle Plot Click: open Nextora-style popup
  const handlePlotClick = (plot, e) => {
    e.stopPropagation();
    setSelectedPlot(plot);
  };

  // Render individual 2D Plot Polygon/Tile (Color-coded: Green = Available, Blue = Booked, Red = Sold)
  const renderPlotBox = (plotNumber, customStyle = {}) => {
    const plot = plotLookup[plotNumber];
    if (!plot) return null;

    const isSelected = selectedPlot?.id === plot.id || selectedPlot?.number === plot.number;
    const isMatched = isPlotHighlighted(plot);

    // Exact Nextora colors
    let bgColor = '#10b981'; // Green (Available)
    let borderColor = '#059669';
    let textColor = '#ffffff';

    if (plot.status === 'booked') {
      bgColor = '#2563eb'; // Blue (Booked)
      borderColor = '#1d4ed8';
    } else if (plot.status === 'sold') {
      bgColor = '#ef4444'; // Red (Sold)
      borderColor = '#b91c1c';
    }

    const opacity = isMatched ? 1 : 0.22;

    return (
      <button
        key={plot.number}
        type="button"
        onClick={(e) => handlePlotClick(plot, e)}
        style={{
          backgroundColor: bgColor,
          borderColor: isSelected ? '#F58220' : borderColor,
          opacity: opacity,
          ...customStyle
        }}
        className={`relative flex flex-col items-center justify-center p-1 border rounded transition-all duration-150 cursor-pointer text-left select-none group
          ${isSelected 
            ? 'ring-4 ring-[#F58220] ring-offset-2 ring-offset-slate-900 z-30 scale-105 shadow-xl' 
            : 'hover:scale-102 hover:z-20 hover:shadow-lg'
          }
        `}
        title={`Plot #${plot.number} • ${plot.sqYards} Sq.Yds (${plot.status.toUpperCase()})`}
      >
        {/* Plot Number in Bold Center Badge */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/95 text-gray-900 border border-black/20 flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-xs">
          {plot.number}
        </div>

        {/* Square Yards Metric */}
        <span className="text-[8px] sm:text-[9px] font-bold tracking-tight text-white drop-shadow mt-0.5 whitespace-nowrap">
          {plot.sqYards} yds
        </span>

        {/* Dimension indicator (North width) */}
        <span className="text-[7px] text-white/90 font-medium hidden sm:block truncate max-w-[90%] leading-none mt-0.5">
          {plot.dimensions.split('×')[0]?.trim()}
        </span>

        {/* Corner Indicator Badge */}
        {plot.isCorner && (
          <span 
            className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-300 ring-1 ring-black/40 shadow-xs" 
            title="Corner Plot" 
          />
        )}
      </button>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden flex flex-col bg-[#f4f7fb] text-gray-900 font-sans select-none ${
        isFullscreen ? 'h-screen' : 'h-[85vh] sm:h-[90vh] rounded-3xl border border-gray-300 shadow-2xl'
      }`}
    >
      {/* =========================================================================
          1. NEXTORAMAPS TOP STATUS HEADER BAR
          Styled after NextoraMaps .list-horizontal and stats row
         ========================================================================= */}
      <header className="bg-[#e6effa] border-b border-[#c8dcf0] px-3 sm:px-4 py-2 sm:py-2.5 z-20 shadow-xs flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs">
        
        {/* Left: Project Branding & Back Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showBackButton && (
            <Link 
              to="/projects/alekya"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white border border-[#b8d4f0] text-gray-700 hover:text-[#F58220] font-bold text-[11px] sm:text-xs shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-lg font-black text-[#F58220] tracking-tight uppercase">
              {currentProject.name || 'Alekya Brundavan'}
            </span>
            <span className="hidden md:inline-block text-[11px] text-gray-500 font-medium">
              &bull; DTCP: {currentProject.dtcpNo || 'TLP NO. 87/2024/H'}
            </span>
          </div>
        </div>

        {/* Center: Real-time Plot Availability Key & Statistics (Nextora Style) */}
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap text-[11px] sm:text-xs font-semibold text-gray-800">
          <div className="inline-flex items-center gap-1 font-bold">
            <span className="text-gray-600">Total:</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-white border border-[#b8d4f0] font-black text-gray-900 shadow-xs">
              {stats.total || plots.length}
            </span>
          </div>

          {/* Plots Available (Green) */}
          <div className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
            <span className="w-3 h-3 rounded-full bg-[#10b981] shadow-xs" />
            <span>Plots Available:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 font-black text-emerald-900">
              {stats.available}
            </span>
          </div>

          {/* Plots Booked (Blue) */}
          <div className="inline-flex items-center gap-1.5 font-bold text-blue-700">
            <span className="w-3 h-3 rounded-full bg-[#2563eb] shadow-xs" />
            <span>Plots Booked:</span>
            <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-300 font-black text-blue-900">
              {stats.booked}
            </span>
          </div>

          {/* Plots Sold (Red) */}
          <div className="inline-flex items-center gap-1.5 font-bold text-red-700">
            <span className="w-3 h-3 rounded-full bg-[#ef4444] shadow-xs" />
            <span>Plots Sold:</span>
            <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300 font-black text-red-900">
              {stats.sold}
            </span>
          </div>

          {/* Total Booked Area */}
          <div className="hidden lg:inline-flex items-center gap-1 text-[11px] text-gray-600">
            <span>Booked Area:</span>
            <strong className="text-gray-900 font-black">{areaStats.booked}</strong>
            <span>sqyds</span>
          </div>

          {/* Total Available Area */}
          <div className="hidden lg:inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <span>Available Area:</span>
            <strong className="text-emerald-900 font-black">{areaStats.available}</strong>
            <span>sqyds</span>
          </div>
        </div>

        {/* Right: Close button if modal */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 transition-colors cursor-pointer shadow-xs"
            aria-label="Close layout viewer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* =========================================================================
          2. FLOATING ACTION TOOLBAR (TOP RIGHT) - EXACT NEXTORAMAPS ICONS
          - Fullscreen toggle
          - Reset Map
          - Search / Filter Drawer toggle
          - 2D / 3D Mode switch
         ========================================================================= */}
      <aside 
        className="absolute top-14 right-4 z-30 flex flex-col items-center gap-2"
        aria-label="Map Controls Toolbar"
      >
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-gray-200/80 flex flex-col gap-1.5">
          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleNativeFullscreen}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 hover:text-[#0066cc] hover:bg-blue-50 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isNativeFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Reset Map Button */}
          <button
            type="button"
            onClick={handleResetMap}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 hover:text-[#0066cc] hover:bg-blue-50 transition-colors cursor-pointer"
            title="Reset Map Position & Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Search & Filter Drawer Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isSearchOpen || appliedFilters.plotNo || appliedFilters.status !== 'all' || appliedFilters.facing !== 'all'
                ? 'bg-[#0066cc] text-white shadow-sm' 
                : 'text-gray-700 hover:text-[#0066cc] hover:bg-blue-50'
            }`}
            title="Search & Filter Plots"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* 2D / 3D View Switcher */}
          <div className="pt-1 mt-1 border-t border-gray-200 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                viewMode === '2d' 
                  ? 'bg-[#F58220] text-white font-bold shadow-sm' 
                  : 'text-gray-600 hover:bg-orange-50 hover:text-[#F58220]'
              }`}
              title="2D Plan View"
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                viewMode === '3d' 
                  ? 'bg-[#F58220] text-white font-bold shadow-sm' 
                  : 'text-gray-600 hover:bg-orange-50 hover:text-[#F58220]'
              }`}
              title="3D Isometric Layout View"
            >
              <Box className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoom In & Out Float Buttons */}
        <div className="bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-gray-200/80 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => handleZoom(0.15)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 font-black text-sm cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <span className="text-[9px] font-bold text-center text-gray-500 py-0.5">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(-0.15)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 font-black text-sm cursor-pointer"
            title="Zoom Out"
          >
            &minus;
          </button>
        </div>
      </aside>

      {/* =========================================================================
          3. SLIDING SEARCH & FILTER DRAWER (NEXTORAMAPS #messages PANEL)
         ========================================================================= */}
      {isSearchOpen && (
        <div 
          className="absolute top-14 right-16 z-30 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-2xl p-4 animate-in slide-in-from-right-4 duration-200 text-left"
          role="dialog"
          aria-label="Plot Search & Filter"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#0066cc]" />
              <span>Search Plots</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-md cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Search Plot Number Input */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Plot Number
              </label>
              <input
                type="text"
                value={searchPlotNo}
                onChange={(e) => setSearchPlotNo(e.target.value)}
                placeholder="e.g. 24, 38, 92..."
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#0066cc] shadow-xs"
              />
            </div>

            {/* Select Status */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#0066cc] shadow-xs"
              >
                <option value="0">-- All Statuses --</option>
                <option value="1">Available (Green)</option>
                <option value="2">Booked (Blue)</option>
                <option value="3">Sold (Red)</option>
              </select>
            </div>

            {/* Select Facing */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Filter by Facing
              </label>
              <select
                value={filterFacing}
                onChange={(e) => setFilterFacing(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#0066cc] shadow-xs"
              >
                <option value="0">-- All Facings --</option>
                <option value="1">East Facing</option>
                <option value="2">West Facing</option>
                <option value="3">Corner Plots</option>
              </select>
            </div>

            {/* Action Buttons: Apply & Reset (Nextora style golden/amber buttons) */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyFilter}
                className="flex-1 py-2 rounded-xl font-bold text-white bg-[#c79147] hover:bg-[#b58039] shadow transition-colors cursor-pointer text-center"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleResetFilter}
                className="flex-1 py-2 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors cursor-pointer text-center"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. MAIN INTERACTIVE MAP SURFACE (2D CANVAS OR 3D STUDIO)
         ========================================================================= */}
      <main 
        className="flex-1 relative overflow-hidden bg-[#0a0c10] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {viewMode === '2d' ? (
          <div 
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
            className="w-full h-full flex items-center justify-center transition-transform duration-75 select-none py-10"
          >
            {/* Authentic CHALLAMPALLY / ALEKYA BRUNDAVANAM DTCP Masterplan Structure */}
            <ChallampallyMasterplan
              plotLookup={plotLookup}
              onSelectPlot={(p) => setSelectedPlot(p)}
              selectedPlotId={selectedPlot?.id}
              isPlotHighlighted={isPlotHighlighted}
            />
          </div>
        ) : (
          <div className="w-full h-full p-4 overflow-auto">
            <PlotMap3D
              plots={plots}
              onSelectPlot={(p) => setSelectedPlot(p)}
              selectedPlotId={selectedPlot?.id}
            />
          </div>
        )}

        {/* =========================================================================
            5. NEXTORAMAPS INTERACTIVE PLOT POPUP (#popup)
            Shows details when any plot is clicked
           ========================================================================= */}
        {selectedPlot && (
          <div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-[460px] bg-white rounded-3xl border border-gray-300 shadow-2xl p-5 text-left animate-in slide-in-from-bottom-3 duration-200"
            role="dialog"
            aria-label={`Plot #${selectedPlot.number} Details`}
          >
            {/* Popup Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shadow ${
                  selectedPlot.status === 'available' ? 'bg-[#10b981]' :
                  selectedPlot.status === 'booked' ? 'bg-[#2563eb]' : 'bg-[#ef4444]'
                }`}>
                  #{selectedPlot.number}
                </span>

                <div>
                  <h4 className="text-base font-extrabold text-gray-900 leading-tight">
                    Plot #{selectedPlot.number}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${
                      selectedPlot.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                      selectedPlot.status === 'booked' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedPlot.status}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {selectedPlot.facing} Facing
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPlot(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                aria-label="Close plot popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 py-3 text-xs border-b border-gray-100">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Total Area</span>
                <span className="text-sm font-black text-gray-900">{selectedPlot.sqYards}</span>
                <span className="text-[10px] text-gray-500 ml-0.5">Sq. Yds</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Dimensions</span>
                <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">
                  {selectedPlot.dimensions}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Road Access</span>
                <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">
                  {selectedPlot.roadWidth}
                </span>
              </div>
            </div>

            {/* Action Buttons for Booking */}
            <div className="pt-3 flex flex-wrap items-center gap-2">
              {selectedPlot.status === 'available' ? (
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#F58220] hover:bg-[#E07016] text-white shadow transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                  <span>Inquire About Plot #{selectedPlot.number}</span>
                </Link>
              ) : selectedPlot.status === 'booked' ? (
                <div className="w-full flex items-center justify-between p-2 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                  <span>Currently Booked &bull; Advance token registered</span>
                  <Link
                    to="/contact"
                    className="font-bold underline text-blue-800"
                  >
                    Inquire / Waitlist
                  </Link>
                </div>
              ) : (
                <div className="w-full p-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 font-semibold text-center">
                  Plot Registered & Sold Out Deed
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            6. NEXTORAMAPS BOTTOM-RIGHT BADGE
           ========================================================================= */}
        <div className="absolute bottom-2.5 right-3 z-20 bg-white/85 backdrop-blur-md px-3 py-1 rounded-lg border border-gray-300 text-[11px] font-bold text-gray-600 shadow-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F58220]" />
          <span>Interactive GIS Layout &bull; Skandha Groups</span>
          <span className="text-gray-400">|</span>
          <Link to="/admin" className="text-[#0066cc] hover:underline font-semibold flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            <span>Admin</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
