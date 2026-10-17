import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Search, 
  X, 
  Box, 
  Trees, 
  Compass, 
  Check, 
  Filter, 
  ArrowLeft, 
  Share2, 
  Lock, 
  Sparkles, 
  Info,
  Navigation,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlotContext } from '../context/PlotContext';
import PlotMap3D from './PlotMap3D';
import PlotLayoutMap from './PlotLayoutMap';
import PlotSpecificationsModal from './PlotSpecificationsModal';
import GetInTouchModal from './GetInTouchModal';

export default function NextoraLayoutViewer({ 
  isFullscreen = false, 
  onClose = null, 
  showBackButton = false 
}) {
  const { plots, stats, projects } = usePlotContext();
  const rawProject = projects?.[0];
  const currentProject = {
    name: (rawProject?.name && !rawProject.name.includes('Alekya')) ? rawProject.name : 'Skandha Grand Valley',
    dtcpNo: rawProject?.dtcpNo || 'TLP NO. 87/2024/H',
    reraNo: rawProject?.reraNo || 'PO2400009081',
    location: rawProject?.location || 'Kadthal, Srisailam Highway'
  };

  // View state: 'map' (GIS Map View) or '3d' (3D Isometric Map)
  const [viewMode, setViewMode] = useState('map');

  // Search & Filter Drawer State (Nextora style)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState('0'); // '0'=all, '1'=plotNo, '2'=status, '3'=facing
  const [searchPlotNo, setSearchPlotNo] = useState('');
  const [filterStatus, setFilterStatus] = useState('0'); // '0'=all, '1'=available, '2'=booked, '3'=sold
  const [filterFacing, setFilterFacing] = useState('0'); // '0'=all, '1'=East, '2'=West, '3'=Corner
  const [minSqYards, setMinSqYards] = useState('');
  const [maxSqYards, setMaxSqYards] = useState('');

  // Active filter criteria applied to map
  const [appliedFilters, setAppliedFilters] = useState({
    plotNo: '',
    status: 'all',
    facing: 'all',
    minArea: '',
    maxArea: ''
  });

  // Selected Plot & Popup State
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [isGetInTouchOpen, setIsGetInTouchOpen] = useState(false);
  const [inquiryPlot, setInquiryPlot] = useState(null);

  // Map Pan & Zoom Triggers
  const [mapZoomTrigger, setMapZoomTrigger] = useState(null);
  const [mapResetTrigger, setMapResetTrigger] = useState(0);
  const [leafletZoomLevel, setLeafletZoomLevel] = useState(18);
  const [mapLayer, setMapLayer] = useState('osm'); // 'osm' | 'satellite'

  const handleLeafletZoomChange = useCallback((z) => {
    setLeafletZoomLevel(z);
  }, []);

  const containerRef = useRef(null);
  const mapSurfaceRef = useRef(null);

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
      facing: facingVal,
      minArea: minSqYards.trim() ? Number(minSqYards) : '',
      maxArea: maxSqYards.trim() ? Number(maxSqYards) : ''
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
    setMinSqYards('');
    setMaxSqYards('');
    setSearchType('0');
    setAppliedFilters({
      plotNo: '',
      status: 'all',
      facing: 'all',
      minArea: '',
      maxArea: ''
    });
  };

  // Reset Map View (Zoom & Pan)
  const handleResetMap = () => {
    setMapResetTrigger(prev => prev + 1);
    setSelectedPlot(null);
  };

  // Handle Zoom In / Zoom Out (Purely controls zoom in each view independently)
  const handleZoom = (delta) => {
    setMapZoomTrigger(delta > 0 ? 'in' : 'out');
    setTimeout(() => setMapZoomTrigger(null), 100);
  };

  // Plot matching filter check
  const isPlotHighlighted = useCallback((plot) => {
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
    const sq = Number(plot.sqYards) || 0;
    if (appliedFilters.minArea && sq < appliedFilters.minArea) {
      return false;
    }
    if (appliedFilters.maxArea && sq > appliedFilters.maxArea) {
      return false;
    }
    return true;
  }, [appliedFilters]);

  // Live count of matching plots
  const matchedPlotCount = useMemo(() => {
    return plots.filter(p => isPlotHighlighted(p)).length;
  }, [plots, isPlotHighlighted]);

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
              {currentProject.name || 'Skandha Grand Valley'}
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
          <div className="inline-flex items-center gap-1.5 font-bold text-gray-800">
            <span className="w-3 h-3 rounded-full shadow-xs bg-[#008532]" />
            <span>Plots Available:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 font-black text-emerald-950">
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

          {/* Map View & 3D View Switcher */}
          <div className="pt-1 mt-1 border-t border-gray-200 flex flex-col gap-1">
            {/* GIS Map View */}
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#F58220] text-white font-bold shadow-sm' 
                  : 'text-gray-600 hover:bg-orange-50 hover:text-[#F58220]'
              }`}
              title="GIS Map View (Interactive OpenStreetMap)"
            >
              <MapPin className="w-4 h-4" />
            </button>

            {/* 3D Map View */}
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                viewMode === '3d' 
                  ? 'bg-[#F58220] text-white font-bold shadow-sm' 
                  : 'text-gray-600 hover:bg-orange-50 hover:text-[#F58220]'
              }`}
              title="3D Map View (Isometric Layout on Kadthal GIS Map Terrain)"
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
            {viewMode === 'map' ? `z${Math.round(leafletZoomLevel)}` : '3D'}
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

            {/* Min & Max Plot Area (Sq.Yards) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Min Area (Yds)
                </label>
                <input
                  type="number"
                  value={minSqYards}
                  onChange={(e) => setMinSqYards(e.target.value)}
                  placeholder="e.g. 183"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#0066cc] shadow-xs text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Max Area (Yds)
                </label>
                <input
                  type="number"
                  value={maxSqYards}
                  onChange={(e) => setMaxSqYards(e.target.value)}
                  placeholder="e.g. 350"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#0066cc] shadow-xs text-xs"
                />
              </div>
            </div>

            {/* Matched Count Indicator */}
            <div className="py-1 px-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-bold text-[11px] flex items-center justify-between">
              <span>Matching Plots:</span>
              <span className="font-black px-1.5 py-0.5 rounded bg-white text-blue-700 shadow-xs">
                {matchedPlotCount} / {plots.length}
              </span>
            </div>

            {/* Action Buttons: Apply & Reset */}
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
          4. MAIN INTERACTIVE LAYOUT SURFACE (GIS MAP VIEW OR 3D MAP STUDIO)
         ========================================================================= */}
      <main 
        ref={mapSurfaceRef}
        className={`flex-1 relative overflow-hidden ${
          viewMode === 'map' ? 'bg-slate-900' : 'bg-slate-950'
        }`}
      >

        {viewMode === 'map' ? (
          <PlotLayoutMap
            plotsData={plots}
            onSelectPlot={(p) => setSelectedPlot(p)}
            selectedPlot={selectedPlot}
            appliedFilters={appliedFilters}
            showRightToolbar={false}
            externalZoomTrigger={mapZoomTrigger}
            externalResetTrigger={mapResetTrigger}
            onZoomChange={handleLeafletZoomChange}
            mapLayer={mapLayer}
            onMapLayerChange={setMapLayer}
            onSwitchTo3D={() => setViewMode('3d')}
            onEnquire={(p) => {
              setInquiryPlot(p);
              setSelectedPlot(null);
              setIsGetInTouchOpen(true);
            }}
            onBook={(p) => {
              setInquiryPlot(p);
              setSelectedPlot(null);
              setIsGetInTouchOpen(true);
            }}
          />
        ) : (
          <div className="w-full h-full relative">
            <PlotMap3D
              plots={plots}
              onSelectPlot={(p) => setSelectedPlot(p)}
              selectedPlotId={selectedPlot?.id}
              appliedFilters={appliedFilters}
              externalZoomTrigger={mapZoomTrigger}
              externalResetTrigger={mapResetTrigger}
              currentMapLayer={mapLayer}
              onMapLayerChange={setMapLayer}
            />
          </div>
        )}

        {/* =========================================================================
            5. NEXTORAMAPS INTERACTIVE PLOT SPECIFICATIONS MODAL
            Only rendered in 3D view (In map view, the clean Leaflet popup is used)
           ========================================================================= */}
        {selectedPlot && viewMode === '3d' && (
          <PlotSpecificationsModal
            plot={selectedPlot}
            onClose={() => setSelectedPlot(null)}
            onEnquire={(p) => {
              setInquiryPlot(p);
              setSelectedPlot(null);
              setIsGetInTouchOpen(true);
            }}
          />
        )}

        {/* Interactive Get In Touch Modal Form */}
        <GetInTouchModal
          isOpen={isGetInTouchOpen}
          onClose={() => {
            setIsGetInTouchOpen(false);
            setInquiryPlot(null);
          }}
          initialPlot={inquiryPlot}
        />

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
