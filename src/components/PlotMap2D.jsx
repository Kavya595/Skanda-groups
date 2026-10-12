import React, { useState, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Filter, 
  Compass, 
  CheckCircle2, 
  Trees, 
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { STATUS_CONFIG } from '../data/plotData';

export default function PlotMap2D({ plots, onSelectPlot, selectedPlotId }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFacing, setFilterFacing] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPlot, setHoveredPlot] = useState(null);

  // Group plots into a lookup map by number
  const plotMap = useMemo(() => {
    const map = {};
    plots.forEach(p => {
      map[p.number] = p;
    });
    return map;
  }, [plots]);

  // Status counts
  const counts = useMemo(() => {
    return {
      all: plots.length,
      available: plots.filter(p => p.status === 'available').length,
      booked: plots.filter(p => p.status === 'booked').length,
      sold: plots.filter(p => p.status === 'sold').length,
    };
  }, [plots]);

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(Math.max(0.6, prev + delta), 2.2));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Helper to determine plot highlight
  const isPlotHighlighted = (plot) => {
    if (!plot) return false;
    if (searchQuery && plot.number.toString().includes(searchQuery.trim())) return true;
    if (filterStatus !== 'all' && plot.status !== filterStatus) return false;
    if (filterFacing !== 'all' && !plot.facing.toLowerCase().includes(filterFacing.toLowerCase())) return false;
    return true;
  };

  // Render an individual plot tile in the masterplan
  const renderPlotBox = (plotNumber, customStyle = {}) => {
    const plot = plotMap[plotNumber];
    if (!plot) return null;

    const isSelected = selectedPlotId === plot.id || selectedPlotId === plot.number;
    const isHovered = hoveredPlot?.number === plot.number;
    const isMatched = isPlotHighlighted(plot);

    // Status colors: Green (available), Blue (booked), Red (sold)
    let bgColor = '#10b981'; // Green
    let strokeColor = '#059669';
    let textColor = '#ffffff';

    if (plot.status === 'booked') {
      bgColor = '#3b82f6'; // Blue
      strokeColor = '#1d4ed8';
    } else if (plot.status === 'sold') {
      bgColor = '#ef4444'; // Red
      strokeColor = '#b91c1c';
    }

    const opacity = isMatched ? 1 : 0.25;

    return (
      <button
        key={plot.number}
        type="button"
        onClick={() => onSelectPlot(plot)}
        onMouseEnter={() => setHoveredPlot(plot)}
        onMouseLeave={() => setHoveredPlot(null)}
        style={{
          backgroundColor: bgColor,
          borderColor: isSelected ? '#F58220' : strokeColor,
          opacity: opacity,
          ...customStyle
        }}
        className={`relative flex flex-col items-center justify-center p-1 border rounded-sm transition-all duration-150 cursor-pointer text-left select-none group
          ${isSelected ? 'ring-4 ring-[#F58220] ring-offset-2 z-30 scale-105 shadow-xl' : 'hover:scale-102 hover:z-20 hover:shadow-lg'}
        `}
        title={`Plot #${plot.number} - ${plot.sqYards} Sq.Yds (${plot.status.toUpperCase()})`}
      >
        {/* Plot Number in Circle badge */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/95 text-gray-900 border border-black/20 flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-xs">
          {plot.number}
        </div>

        {/* Square Yards */}
        <span className="text-[8px] sm:text-[9px] font-bold tracking-tight text-white drop-shadow mt-0.5 whitespace-nowrap">
          {plot.sqYards} yds
        </span>

        {/* Dimension indicator */}
        <span className="text-[7px] text-white/90 font-medium hidden sm:block truncate max-w-[90%] leading-none mt-0.5">
          {plot.dimensions.split('×')[0]?.trim()}
        </span>

        {/* Corner Indicator Badge */}
        {plot.isCorner && (
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-300 ring-1 ring-black/40" title="Corner Plot" />
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* 1. Header Toolbar: Legend, Filters, and Zoom Controls */}
      <div className="bg-slate-800/90 backdrop-blur-md p-4 sm:p-5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4">
        
        {/* Status Counts Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'}`}
          >
            <span>All Plots</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-extrabold">{counts.all}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('available')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${filterStatus === 'available' ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-md' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Available (Green)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-600 text-white font-extrabold">{counts.available}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('booked')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${filterStatus === 'booked' ? 'bg-blue-500 text-white ring-2 ring-blue-300 shadow-md' : 'bg-blue-950/60 text-blue-400 border border-blue-800 hover:bg-blue-900/60'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>Booked (Blue)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600 text-white font-extrabold">{counts.booked}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('sold')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${filterStatus === 'sold' ? 'bg-red-500 text-white ring-2 ring-red-300 shadow-md' : 'bg-red-950/60 text-red-400 border border-red-800 hover:bg-red-900/60'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span>Sold (Red)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-extrabold">{counts.sold}</span>
          </button>
        </div>

        {/* Right: Quick Search and Zoom Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search by plot number */}
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find Plot #..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-700/80 border border-slate-600 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F58220]"
            />
          </div>

          {/* Orientation Filter */}
          <select
            value={filterFacing}
            onChange={(e) => setFilterFacing(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-700/80 border border-slate-600 text-xs text-white focus:outline-none focus:border-[#F58220] cursor-pointer"
          >
            <option value="all">All Facings</option>
            <option value="east">East Facing</option>
            <option value="west">West Facing</option>
            <option value="corner">Corner Plots</option>
          </select>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-700 rounded-xl p-0.5 border border-slate-600">
            <button
              type="button"
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold px-1.5 text-slate-300">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => handleZoom(0.15)}
              className="p-1.5 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white cursor-pointer border-l border-slate-600 ml-0.5"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Masterplan Canvas Container */}
      <div className="relative overflow-auto p-4 sm:p-8 bg-neutral-950 flex justify-center items-center min-h-[540px] sm:min-h-[620px] select-none">
        
        {/* Dynamic Zoom Transformation Wrapper */}
        <div 
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 ease-out"
        >
          {/* Main Layout Surface (Modeled after authentic DTCP Alekya Layout Drawing) */}
          <div className="w-[1020px] bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl relative">
            
            {/* Top Road Banner: Prop 60'-0" Wide Road to Masigandi Temple */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl py-2.5 px-4 mb-4 flex items-center justify-between text-xs text-neutral-300 font-bold uppercase tracking-wider">
              <span>Proposed 60'-0" Wide Arterial Road</span>
              <span className="flex items-center gap-1.5 text-orange-400">
                <span>To Maisigandi Maisamma Temple</span>
                <span>➔</span>
              </span>
            </div>

            {/* TOP BLOCK (Park + Blocks 1, 2, 3, 4) */}
            <div className="flex gap-3 mb-4">
              
              {/* Site Reserved for Open Space (Park) */}
              <div className="w-[210px] bg-emerald-950/70 border-2 border-dashed border-emerald-500/80 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
                  <Trees className="w-32 h-32 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider">
                  <Trees className="w-4 h-4 text-emerald-400" />
                  <span>Site Reserved for Park</span>
                </div>
                <div className="text-center py-4">
                  <span className="text-xs font-bold text-white block">Open Green Space</span>
                  <span className="text-[11px] font-extrabold text-emerald-300 block mt-0.5">Landscaped Park</span>
                  <span className="text-[9px] text-emerald-400/80 mt-1 block">Children's Play & Walking Track</span>
                </div>
                <div className="flex justify-between text-[8px] font-mono text-emerald-400/80 border-t border-emerald-900 pt-1">
                  <span>209'-9"</span>
                  <span>169'-3"</span>
                  <span>201'-6"</span>
                </div>
              </div>

              {/* Vertical B.T. Road */}
              <div className="w-[42px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono uppercase whitespace-nowrap">
                  33' B.T. ROAD
                </span>
              </div>

              {/* Block 1 (West: 29,30,31,32 | East: 25,26,27,28) */}
              <div className="flex gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                {/* West Column */}
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(29, { height: '52px' })}
                  {renderPlotBox(30, { height: '42px' })}
                  {renderPlotBox(31, { height: '42px' })}
                  {renderPlotBox(32, { height: '56px' })}
                </div>
                {/* East Column */}
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(25, { height: '52px' })}
                  {renderPlotBox(26, { height: '42px' })}
                  {renderPlotBox(27, { height: '42px' })}
                  {renderPlotBox(28, { height: '56px' })}
                </div>
              </div>

              {/* Vertical B.T. Road */}
              <div className="w-[42px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono uppercase whitespace-nowrap">
                  33' B.T. ROAD
                </span>
              </div>

              {/* Block 2 (West: 24,23,22,21 | East: 17,18,19,20) */}
              <div className="flex gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                {/* West Column */}
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(24, { height: '52px' })}
                  {renderPlotBox(23, { height: '42px' })}
                  {renderPlotBox(22, { height: '42px' })}
                  {renderPlotBox(21, { height: '56px' })}
                </div>
                {/* East Column */}
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(17, { height: '52px' })}
                  {renderPlotBox(18, { height: '42px' })}
                  {renderPlotBox(19, { height: '42px' })}
                  {renderPlotBox(20, { height: '56px' })}
                </div>
              </div>

              {/* Vertical B.T. Road */}
              <div className="w-[42px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono uppercase whitespace-nowrap">
                  33' B.T. ROAD
                </span>
              </div>

              {/* Block 3 (West: 16,15,14,13 | East: 9,10,11,12) */}
              <div className="flex gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                {/* West Column */}
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(16, { height: '52px' })}
                  {renderPlotBox(15, { height: '42px' })}
                  {renderPlotBox(14, { height: '42px' })}
                  {renderPlotBox(13, { height: '56px' })}
                </div>
                {/* East Column */}
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(9, { height: '52px' })}
                  {renderPlotBox(10, { height: '42px' })}
                  {renderPlotBox(11, { height: '42px' })}
                  {renderPlotBox(12, { height: '56px' })}
                </div>
              </div>

              {/* Vertical B.T. Road */}
              <div className="w-[42px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono uppercase whitespace-nowrap">
                  33' B.T. ROAD
                </span>
              </div>

              {/* Block 4 (West: 8,7,6,5 | East: 1,2,3,4) */}
              <div className="flex gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                {/* West Column */}
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(8, { height: '52px' })}
                  {renderPlotBox(7, { height: '42px' })}
                  {renderPlotBox(6, { height: '42px' })}
                  {renderPlotBox(5, { height: '56px' })}
                </div>
                {/* East Column */}
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(1, { height: '52px' })}
                  {renderPlotBox(2, { height: '42px' })}
                  {renderPlotBox(3, { height: '42px' })}
                  {renderPlotBox(4, { height: '56px' })}
                </div>
              </div>

              {/* Right Vertical Road: Highway Arterial */}
              <div className="w-[50px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-[#F58220] font-bold uppercase whitespace-nowrap">
                  SRISAILAM HIGHWAY
                </span>
              </div>
            </div>

            {/* CENTRAL HORIZONTAL CROSS ROAD: Proposed 33'-0" Wide Road */}
            <div className="bg-neutral-800 border-y border-neutral-700 py-2 px-6 mb-4 flex items-center justify-between text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
              <span>⮜ PROPOSED 33'-0" WIDE B.T. ROAD ⮞</span>
              <span>PROPOSED 33'-0" WIDE ROAD</span>
              <span>⮜ NH 765 ACCESS ⮞</span>
            </div>

            {/* BOTTOM BLOCK (Blocks 5, 6, 7, 8, 9 & Highway Strip) */}
            <div className="flex gap-3">
              
              {/* Leftmost highway frontage strip: Plots 33, 34, 35, 36 */}
              <div className="w-[80px] flex flex-col gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                {renderPlotBox(33, { height: '54px' })}
                {renderPlotBox(34, { height: '42px' })}
                {renderPlotBox(35, { height: '42px' })}
                {renderPlotBox(36, { height: '62px' })}
              </div>

              {/* Vertical B.T. Road */}
              <div className="w-[42px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono uppercase whitespace-nowrap">
                  33' B.T. ROAD
                </span>
              </div>

              {/* Block 5 (West: 41,40,39,38,37 | East: 42,43,44,45,46) */}
              <div className="flex gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(41, { height: '52px' })}
                  {renderPlotBox(40, { height: '38px' })}
                  {renderPlotBox(39, { height: '38px' })}
                  {renderPlotBox(38, { height: '38px' })}
                  {renderPlotBox(37, { height: '54px' })}
                </div>
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(42, { height: '52px' })}
                  {renderPlotBox(43, { height: '38px' })}
                  {renderPlotBox(44, { height: '38px' })}
                  {renderPlotBox(45, { height: '38px' })}
                  {renderPlotBox(46, { height: '54px' })}
                </div>
              </div>

              {/* Vertical B.T. Road */}
              <div className="w-[42px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono uppercase whitespace-nowrap">
                  33' B.T. ROAD
                </span>
              </div>

              {/* Block 6 (West: 52,51,50,49,48,47 | East: 53,54,55,56,57,58) */}
              <div className="flex gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(52, { height: '48px' })}
                  {renderPlotBox(51, { height: '34px' })}
                  {renderPlotBox(50, { height: '34px' })}
                  {renderPlotBox(49, { height: '34px' })}
                  {renderPlotBox(48, { height: '34px' })}
                  {renderPlotBox(47, { height: '48px' })}
                </div>
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(53, { height: '48px' })}
                  {renderPlotBox(54, { height: '34px' })}
                  {renderPlotBox(55, { height: '34px' })}
                  {renderPlotBox(56, { height: '34px' })}
                  {renderPlotBox(57, { height: '34px' })}
                  {renderPlotBox(58, { height: '48px' })}
                </div>
              </div>

              {/* Vertical B.T. Road */}
              <div className="w-[42px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono uppercase whitespace-nowrap">
                  33' B.T. ROAD
                </span>
              </div>

              {/* Block 7 (West: 64,63,62,61,60,59 | East: 65,66,67,68,69,70) */}
              <div className="flex gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(64, { height: '48px' })}
                  {renderPlotBox(63, { height: '34px' })}
                  {renderPlotBox(62, { height: '34px' })}
                  {renderPlotBox(61, { height: '34px' })}
                  {renderPlotBox(60, { height: '34px' })}
                  {renderPlotBox(59, { height: '48px' })}
                </div>
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(65, { height: '48px' })}
                  {renderPlotBox(66, { height: '34px' })}
                  {renderPlotBox(67, { height: '34px' })}
                  {renderPlotBox(68, { height: '34px' })}
                  {renderPlotBox(69, { height: '34px' })}
                  {renderPlotBox(70, { height: '48px' })}
                </div>
              </div>

              {/* Vertical B.T. Road */}
              <div className="w-[42px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono uppercase whitespace-nowrap">
                  33' B.T. ROAD
                </span>
              </div>

              {/* Block 8 (West: 76,75,74,73,72,71 | East: 77,78,79,80,81,82) */}
              <div className="flex gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(76, { height: '48px' })}
                  {renderPlotBox(75, { height: '34px' })}
                  {renderPlotBox(74, { height: '34px' })}
                  {renderPlotBox(73, { height: '34px' })}
                  {renderPlotBox(72, { height: '34px' })}
                  {renderPlotBox(71, { height: '48px' })}
                </div>
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(77, { height: '48px' })}
                  {renderPlotBox(78, { height: '34px' })}
                  {renderPlotBox(79, { height: '34px' })}
                  {renderPlotBox(80, { height: '34px' })}
                  {renderPlotBox(81, { height: '34px' })}
                  {renderPlotBox(82, { height: '48px' })}
                </div>
              </div>

              {/* Vertical B.T. Road */}
              <div className="w-[42px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono uppercase whitespace-nowrap">
                  33' B.T. ROAD
                </span>
              </div>

              {/* Block 9 (West: 89,88,87,86,85,84,83 | East: 90,91,92,93,94,95,96) */}
              <div className="flex gap-1.5 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700">
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(89, { height: '44px' })}
                  {renderPlotBox(88, { height: '32px' })}
                  {renderPlotBox(87, { height: '32px' })}
                  {renderPlotBox(86, { height: '32px' })}
                  {renderPlotBox(85, { height: '32px' })}
                  {renderPlotBox(84, { height: '32px' })}
                  {renderPlotBox(83, { height: '44px' })}
                </div>
                <div className="flex flex-col gap-1.5 w-[76px]">
                  {renderPlotBox(90, { height: '44px' })}
                  {renderPlotBox(91, { height: '32px' })}
                  {renderPlotBox(92, { height: '32px' })}
                  {renderPlotBox(93, { height: '32px' })}
                  {renderPlotBox(94, { height: '32px' })}
                  {renderPlotBox(95, { height: '32px' })}
                  {renderPlotBox(96, { height: '44px' })}
                </div>
              </div>

              {/* Right Vertical Road: Highway Arterial */}
              <div className="w-[50px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="rotate-90 text-[8px] tracking-widest text-[#F58220] font-bold uppercase whitespace-nowrap">
                  SRISAILAM HIGHWAY
                </span>
              </div>
            </div>

            {/* Bottom Footer Info & Vasthu Compass */}
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-bold text-orange-400 border border-slate-700">
                  DTCP TLP NO. 87/2024/H
                </span>
                <span className="text-[11px]">TS RERA: PO2400009081 @ KADTHAL</span>
              </div>

              {/* Vasthu Compass */}
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                <Compass className="w-4 h-4 text-orange-400 animate-spin-slow" />
                <span className="text-[10px] font-bold text-slate-200">100% VASTHU ALIGNED</span>
                <span className="text-[10px] text-emerald-400 font-extrabold ml-1">N ↑</span>
              </div>
            </div>

          </div>
        </div>

        {/* Hover / Active Plot Floating Inspector Tooltip */}
        {hoveredPlot && (
          <div className="absolute bottom-5 left-5 bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-2xl p-4 shadow-2xl text-left pointer-events-none z-40 max-w-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-sm font-extrabold text-white">Plot #{hoveredPlot.number}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                hoveredPlot.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                hoveredPlot.status === 'booked' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}>
                {hoveredPlot.status}
              </span>
            </div>
            <div className="text-xs space-y-1 text-slate-300">
              <div><strong className="text-white">Area:</strong> {hoveredPlot.sqYards} Sq. Yards</div>
              <div><strong className="text-white">Dimensions:</strong> {hoveredPlot.dimensions}</div>
              <div><strong className="text-white">Facing:</strong> {hoveredPlot.facing}</div>
              <div><strong className="text-white">Road:</strong> {hoveredPlot.roadWidth}</div>
            </div>
            <div className="mt-2 text-[10px] text-orange-400 font-bold">
              Click to view plot options or book
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
