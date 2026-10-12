import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Rotate3d, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Trees, 
  Eye, 
  Compass, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { STATUS_CONFIG } from '../data/plotData';

export default function PlotMap3D({ plots, onSelectPlot, selectedPlotId }) {
  const [zoomLevel, setZoomLevel] = useState(0.95);
  const [pitch, setPitch] = useState(55); // rotateX
  const [yaw, setYaw] = useState(-30);   // rotateZ
  const [filterStatus, setFilterStatus] = useState('all');
  const [hoveredPlot, setHoveredPlot] = useState(null);

  // Group plots into map
  const plotMap = useMemo(() => {
    const map = {};
    plots.forEach(p => {
      map[p.number] = p;
    });
    return map;
  }, [plots]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: plots.length,
      available: plots.filter(p => p.status === 'available').length,
      booked: plots.filter(p => p.status === 'booked').length,
      sold: plots.filter(p => p.status === 'sold').length,
    };
  }, [plots]);

  // Camera presets
  const setPreset = (preset) => {
    if (preset === 'isometric') {
      setPitch(55);
      setYaw(-30);
      setZoomLevel(0.95);
    } else if (preset === 'street') {
      setPitch(68);
      setYaw(-18);
      setZoomLevel(1.15);
    } else if (preset === 'top') {
      setPitch(30);
      setYaw(0);
      setZoomLevel(0.9);
    }
  };

  // Render a 3D extruded plot parcel
  const renderPlot3D = (plotNumber, customStyle = {}) => {
    const plot = plotMap[plotNumber];
    if (!plot) return null;

    if (filterStatus !== 'all' && plot.status !== filterStatus) return null;

    const isSelected = selectedPlotId === plot.id || selectedPlotId === plot.number;
    const isHovered = hoveredPlot?.number === plot.number;

    // Colors: Green (Available), Blue (Booked), Red (Sold)
    let topColor = '#10b981'; // Green
    let sideColor = '#047857';
    let borderColor = '#059669';

    if (plot.status === 'booked') {
      topColor = '#3b82f6'; // Blue
      sideColor = '#1d4ed8';
      borderColor = '#2563eb';
    } else if (plot.status === 'sold') {
      topColor = '#ef4444'; // Red
      sideColor = '#b91c1c';
      borderColor = '#dc2626';
    }

    const elevation = isSelected ? 22 : (isHovered ? 16 : 8);

    return (
      <button
        key={plot.number}
        type="button"
        onClick={() => onSelectPlot(plot)}
        onMouseEnter={() => setHoveredPlot(plot)}
        onMouseLeave={() => setHoveredPlot(null)}
        style={{
          transform: `translateZ(${elevation}px)`,
          backgroundColor: topColor,
          borderColor: isSelected ? '#F58220' : borderColor,
          boxShadow: isHovered || isSelected 
            ? `0 ${elevation + 8}px 25px rgba(0,0,0,0.6), 0 0 15px ${topColor}` 
            : `0 ${elevation}px 10px rgba(0,0,0,0.4)`,
          ...customStyle
        }}
        className={`relative flex flex-col items-center justify-center p-1 rounded-sm border transition-all duration-200 cursor-pointer select-none group
          ${isSelected ? 'ring-4 ring-[#F58220] ring-offset-2 z-40' : 'hover:z-30'}
        `}
        title={`Plot #${plot.number} (${plot.status}) - ${plot.sqYards} Sq.Yds`}
      >
        {/* 3D extrusion faux side shadow */}
        <div 
          className="absolute inset-x-0 -bottom-1 h-1.5 rounded-b-sm pointer-events-none opacity-80"
          style={{ backgroundColor: sideColor }}
        />

        {/* Plot Number in Circle badge */}
        <div className="w-5 h-5 rounded-full bg-white text-gray-900 border border-black/20 flex items-center justify-center font-black text-[9px] shadow-sm">
          {plot.number}
        </div>

        {/* Square Yards */}
        <span className="text-[8px] font-bold text-white drop-shadow mt-0.5 whitespace-nowrap">
          {plot.sqYards} yds
        </span>

        {/* 3D Pin Beacon when selected */}
        {isSelected && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce pointer-events-none z-50">
            <span className="px-2 py-0.5 rounded-full bg-[#F58220] text-white text-[9px] font-black shadow-lg">
              #{plot.number}
            </span>
            <div className="w-1.5 h-1.5 bg-[#F58220] rotate-45 -mt-0.5" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* 1. 3D Camera Controls Toolbar */}
      <div className="bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4">
        
        {/* 3D Camera Presets */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F58220] mr-2">
            <Box className="w-4 h-4 text-[#F58220]" />
            <span>3D Layout Studio</span>
          </div>

          <button
            type="button"
            onClick={() => setPreset('isometric')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            Isometric Angle
          </button>
          <button
            type="button"
            onClick={() => setPreset('street')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer hidden sm:block"
          >
            Street Perspective
          </button>
          <button
            type="button"
            onClick={() => setPreset('top')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            Bird's Eye 3D
          </button>
        </div>

        {/* Angle Sliders & Zoom */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>Tilt: {pitch}°</span>
            <input 
              type="range" 
              min="20" 
              max="75" 
              value={pitch} 
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-20 accent-[#F58220] cursor-pointer" 
            />
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>Rotate: {yaw}°</span>
            <input 
              type="range" 
              min="-60" 
              max="20" 
              value={yaw} 
              onChange={(e) => setYaw(Number(e.target.value))}
              className="w-20 accent-[#F58220] cursor-pointer" 
            />
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold px-1.5 text-slate-300">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(1.8, prev + 0.15))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreset('isometric')}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer border-l border-slate-700 ml-0.5"
              title="Reset 3D"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive 3D Perspective Stage */}
      <div 
        className="relative overflow-hidden p-6 sm:p-12 bg-gradient-to-b from-slate-950 via-slate-900 to-black flex justify-center items-center min-h-[580px] sm:min-h-[660px]"
        style={{ perspective: '1400px' }}
      >
        {/* Subtle 3D background ambient grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* 3D Transforming World Stage */}
        <div
          style={{
            transform: `scale(${zoomLevel}) rotateX(${pitch}deg) rotateZ(${yaw}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s ease-out'
          }}
          className="relative bg-slate-900 border-4 border-slate-800 rounded-3xl p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] w-[1040px]"
        >
          {/* 3D Elevation Ground Shadow */}
          <div 
            style={{ transform: 'translateZ(-15px)' }}
            className="absolute inset-0 bg-black/60 blur-xl rounded-3xl pointer-events-none"
          />

          {/* Top 60ft Roadway Strip */}
          <div 
            style={{ transform: 'translateZ(2px)' }}
            className="bg-neutral-800 border-2 border-neutral-700 rounded-xl py-3 px-6 mb-5 flex items-center justify-between text-xs text-neutral-300 font-bold uppercase tracking-wider shadow-inner"
          >
            <span>Arterial 60'-0" Wide Roadway</span>
            <span className="text-orange-400 font-extrabold">➔ To Maisigandi Maisamma Temple</span>
          </div>

          {/* TOP SECTION: 3D Park + Blocks 1, 2, 3, 4 */}
          <div className="flex gap-4 mb-5" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* 3D Elevated Park */}
            <div 
              style={{ transform: 'translateZ(12px)' }}
              className="w-[210px] bg-gradient-to-br from-emerald-900 to-emerald-950 border-2 border-emerald-500/80 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
                <Trees className="w-5 h-5 text-emerald-400" />
                <span>Reserved Park</span>
              </div>

              {/* 3D Trees Visual */}
              <div className="my-4 flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600/60 border border-emerald-400 flex items-center justify-center shadow-lg animate-pulse-subtle">
                  🌲
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/60 border border-emerald-300 flex items-center justify-center shadow-lg">
                  🌳
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-600/60 border border-emerald-400 flex items-center justify-center shadow-lg">
                  🌲
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs font-bold text-white block">Landscaped Park</span>
                <span className="text-[9px] text-emerald-300">Vasthu Compliant Green Zone</span>
              </div>
            </div>

            {/* 3D Road Channel */}
            <div style={{ transform: 'translateZ(1px)' }} className="w-[40px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono">33' ROAD</span>
            </div>

            {/* Block 1 */}
            <div style={{ transformStyle: 'preserve-3d' }} className="flex gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(29, { height: '52px' })}
                {renderPlot3D(30, { height: '42px' })}
                {renderPlot3D(31, { height: '42px' })}
                {renderPlot3D(32, { height: '56px' })}
              </div>
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(25, { height: '52px' })}
                {renderPlot3D(26, { height: '42px' })}
                {renderPlot3D(27, { height: '42px' })}
                {renderPlot3D(28, { height: '56px' })}
              </div>
            </div>

            {/* 3D Road Channel */}
            <div style={{ transform: 'translateZ(1px)' }} className="w-[40px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono">33' ROAD</span>
            </div>

            {/* Block 2 */}
            <div style={{ transformStyle: 'preserve-3d' }} className="flex gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(24, { height: '52px' })}
                {renderPlot3D(23, { height: '42px' })}
                {renderPlot3D(22, { height: '42px' })}
                {renderPlot3D(21, { height: '56px' })}
              </div>
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(17, { height: '52px' })}
                {renderPlot3D(18, { height: '42px' })}
                {renderPlot3D(19, { height: '42px' })}
                {renderPlot3D(20, { height: '56px' })}
              </div>
            </div>

            {/* 3D Road Channel */}
            <div style={{ transform: 'translateZ(1px)' }} className="w-[40px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono">33' ROAD</span>
            </div>

            {/* Block 3 */}
            <div style={{ transformStyle: 'preserve-3d' }} className="flex gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(16, { height: '52px' })}
                {renderPlot3D(15, { height: '42px' })}
                {renderPlot3D(14, { height: '42px' })}
                {renderPlot3D(13, { height: '56px' })}
              </div>
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(9, { height: '52px' })}
                {renderPlot3D(10, { height: '42px' })}
                {renderPlot3D(11, { height: '42px' })}
                {renderPlot3D(12, { height: '56px' })}
              </div>
            </div>

            {/* 3D Road Channel */}
            <div style={{ transform: 'translateZ(1px)' }} className="w-[40px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono">33' ROAD</span>
            </div>

            {/* Block 4 */}
            <div style={{ transformStyle: 'preserve-3d' }} className="flex gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(8, { height: '52px' })}
                {renderPlot3D(7, { height: '42px' })}
                {renderPlot3D(6, { height: '42px' })}
                {renderPlot3D(5, { height: '56px' })}
              </div>
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(1, { height: '52px' })}
                {renderPlot3D(2, { height: '42px' })}
                {renderPlot3D(3, { height: '42px' })}
                {renderPlot3D(4, { height: '56px' })}
              </div>
            </div>

            {/* Highway Edge */}
            <div style={{ transform: 'translateZ(2px)' }} className="w-[50px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-orange-400 font-bold whitespace-nowrap">
                HIGHWAY
              </span>
            </div>
          </div>

          {/* Central Horizontal 3D Road */}
          <div 
            style={{ transform: 'translateZ(1px)' }}
            className="bg-neutral-800 border-y-2 border-neutral-700 py-2.5 px-6 mb-5 flex items-center justify-between text-xs text-neutral-400 font-mono"
          >
            <span>⮜ CENTRAL 33'-0" B.T. AVENUE ⮞</span>
            <span className="text-orange-400 font-bold">100% VASTHU MASTERPLAN</span>
          </div>

          {/* BOTTOM SECTION: Blocks 5 to 9 */}
          <div className="flex gap-4" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* Frontage Strip: 33-36 */}
            <div style={{ transformStyle: 'preserve-3d' }} className="w-[80px] flex flex-col gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              {renderPlot3D(33, { height: '54px' })}
              {renderPlot3D(34, { height: '42px' })}
              {renderPlot3D(35, { height: '42px' })}
              {renderPlot3D(36, { height: '62px' })}
            </div>

            {/* Road Channel */}
            <div style={{ transform: 'translateZ(1px)' }} className="w-[40px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono">33' ROAD</span>
            </div>

            {/* Block 5 */}
            <div style={{ transformStyle: 'preserve-3d' }} className="flex gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(41, { height: '52px' })}
                {renderPlot3D(40, { height: '38px' })}
                {renderPlot3D(39, { height: '38px' })}
                {renderPlot3D(38, { height: '38px' })}
                {renderPlot3D(37, { height: '54px' })}
              </div>
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(42, { height: '52px' })}
                {renderPlot3D(43, { height: '38px' })}
                {renderPlot3D(44, { height: '38px' })}
                {renderPlot3D(45, { height: '38px' })}
                {renderPlot3D(46, { height: '54px' })}
              </div>
            </div>

            {/* Road Channel */}
            <div style={{ transform: 'translateZ(1px)' }} className="w-[40px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono">33' ROAD</span>
            </div>

            {/* Block 6 */}
            <div style={{ transformStyle: 'preserve-3d' }} className="flex gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(52, { height: '48px' })}
                {renderPlot3D(51, { height: '34px' })}
                {renderPlot3D(50, { height: '34px' })}
                {renderPlot3D(49, { height: '34px' })}
                {renderPlot3D(48, { height: '34px' })}
                {renderPlot3D(47, { height: '48px' })}
              </div>
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(53, { height: '48px' })}
                {renderPlot3D(54, { height: '34px' })}
                {renderPlot3D(55, { height: '34px' })}
                {renderPlot3D(56, { height: '34px' })}
                {renderPlot3D(57, { height: '34px' })}
                {renderPlot3D(58, { height: '48px' })}
              </div>
            </div>

            {/* Road Channel */}
            <div style={{ transform: 'translateZ(1px)' }} className="w-[40px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono">33' ROAD</span>
            </div>

            {/* Block 7 */}
            <div style={{ transformStyle: 'preserve-3d' }} className="flex gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(64, { height: '48px' })}
                {renderPlot3D(63, { height: '34px' })}
                {renderPlot3D(62, { height: '34px' })}
                {renderPlot3D(61, { height: '34px' })}
                {renderPlot3D(60, { height: '34px' })}
                {renderPlot3D(59, { height: '48px' })}
              </div>
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(65, { height: '48px' })}
                {renderPlot3D(66, { height: '34px' })}
                {renderPlot3D(67, { height: '34px' })}
                {renderPlot3D(68, { height: '34px' })}
                {renderPlot3D(69, { height: '34px' })}
                {renderPlot3D(70, { height: '48px' })}
              </div>
            </div>

            {/* Road Channel */}
            <div style={{ transform: 'translateZ(1px)' }} className="w-[40px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono">33' ROAD</span>
            </div>

            {/* Block 8 */}
            <div style={{ transformStyle: 'preserve-3d' }} className="flex gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(76, { height: '48px' })}
                {renderPlot3D(75, { height: '34px' })}
                {renderPlot3D(74, { height: '34px' })}
                {renderPlot3D(73, { height: '34px' })}
                {renderPlot3D(72, { height: '34px' })}
                {renderPlot3D(71, { height: '48px' })}
              </div>
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(77, { height: '48px' })}
                {renderPlot3D(78, { height: '34px' })}
                {renderPlot3D(79, { height: '34px' })}
                {renderPlot3D(80, { height: '34px' })}
                {renderPlot3D(81, { height: '34px' })}
                {renderPlot3D(82, { height: '48px' })}
              </div>
            </div>

            {/* Road Channel */}
            <div style={{ transform: 'translateZ(1px)' }} className="w-[40px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-neutral-400 font-mono">33' ROAD</span>
            </div>

            {/* Block 9 (Highway Frontage) */}
            <div style={{ transformStyle: 'preserve-3d' }} className="flex gap-1.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(89, { height: '44px' })}
                {renderPlot3D(88, { height: '32px' })}
                {renderPlot3D(87, { height: '32px' })}
                {renderPlot3D(86, { height: '32px' })}
                {renderPlot3D(85, { height: '32px' })}
                {renderPlot3D(84, { height: '32px' })}
                {renderPlot3D(83, { height: '44px' })}
              </div>
              <div className="flex flex-col gap-1.5 w-[76px]" style={{ transformStyle: 'preserve-3d' }}>
                {renderPlot3D(90, { height: '44px' })}
                {renderPlot3D(91, { height: '32px' })}
                {renderPlot3D(92, { height: '32px' })}
                {renderPlot3D(93, { height: '32px' })}
                {renderPlot3D(94, { height: '32px' })}
                {renderPlot3D(95, { height: '32px' })}
                {renderPlot3D(96, { height: '44px' })}
              </div>
            </div>

            {/* Srisailam Highway */}
            <div style={{ transform: 'translateZ(2px)' }} className="w-[50px] bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="rotate-90 text-[8px] tracking-widest text-orange-400 font-bold whitespace-nowrap">
                SRISAILAM HIGHWAY
              </span>
            </div>
          </div>

        </div>

        {/* Hover Floating 3D Inspector Card */}
        {hoveredPlot && (
          <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl text-left pointer-events-none z-50 max-w-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-base font-extrabold text-white">Plot #{hoveredPlot.number}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                hoveredPlot.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                hoveredPlot.status === 'booked' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}>
                {hoveredPlot.status}
              </span>
            </div>
            <div className="text-xs space-y-1 text-slate-300">
              <div><strong className="text-white">Dimensions:</strong> {hoveredPlot.dimensions}</div>
              <div><strong className="text-white">Total Area:</strong> {hoveredPlot.sqYards} Sq. Yards</div>
              <div><strong className="text-white">Facing:</strong> {hoveredPlot.facing}</div>
            </div>
            <div className="mt-2 text-[10px] text-orange-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>Click to view booking & details</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
