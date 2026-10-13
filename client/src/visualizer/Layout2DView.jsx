import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Maximize2,
  Minimize2,
  Trees
} from 'lucide-react';
import {
  LAYOUT_BOUNDS,
  layoutRoads,
  parkData,
  statusColors
} from './masterPlanData';

export default function Layout2DView({
  plots,
  selectedPlot,
  onSelectPlot,
  filterStatus = 'all',
  filterFacing = 'all',
  searchTerm = ''
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const containerRef = useRef(null);

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.35, 3.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.35, 0.65));
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Center on selected plot if selection changes
  useEffect(() => {
    if (selectedPlot && selectedPlot.svgPolygon) {
      const [[x0, y0], [x1], [, y2]] = selectedPlot.svgPolygon;
      const plotCenterX = (x0 + x1) / 2;
      const plotCenterY = (y0 + y2) / 2;

      if (scale > 1.2) {
        setPosition({
          x: -(plotCenterX - 600) * (scale - 1),
          y: -(plotCenterY - 390) * (scale - 1)
        });
      }
    }
  }, [selectedPlot, scale]);

  // Pan controls
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setScale(prev => Math.min(Math.max(prev * zoomFactor, 0.65), 3.5));
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-full bg-[#EAF5E8] overflow-hidden select-none cursor-grab active:cursor-grabbing border border-slate-200"
    >
      {/* Zoom / Pan Controls Floating Pill */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/90 shadow-md">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          title="Reset Master Plan View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* North Compass Rose */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/90 shadow-md flex items-center gap-2">
        <Compass className="w-5 h-5 text-brand-orange animate-pulse" />
        <div className="text-left">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Master Plan</div>
          <div className="text-xs font-bold text-slate-900">True North</div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <svg
          viewBox="0 0 1200 780"
          className="w-full h-full max-w-[1400px] max-h-[850px] drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft shadow filter */}
            <filter id="plotShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
            </filter>
            <filter id="selectedGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F15A24" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Surrounding Natural Grass Terrain */}
          <rect x="0" y="0" width="1200" height="780" fill="#E2F0DE" />

          {/* Site Boundary Compound Plot */}
          <rect
            x="35"
            y="30"
            width="1120"
            height="710"
            fill="#D5E8CE"
            stroke="#94C383"
            strokeWidth="3"
            rx="12"
          />

          {/* Connected Asphalt Road Network */}
          {layoutRoads.map((road) => {
            const [p0, p1, p2, p3] = road.polygon;
            const xMin = (Math.min(p0[0], p1[0], p2[0], p3[0]) + 95) * 6.0;
            const xMax = (Math.max(p0[0], p1[0], p2[0], p3[0]) + 95) * 6.0;
            const yMin = (Math.min(p0[1], p1[1], p2[1], p3[1]) + 58) * 5.6;
            const yMax = (Math.max(p0[1], p1[1], p2[1], p3[1]) + 58) * 5.6;
            const w = xMax - xMin;
            const h = yMax - yMin;

            const isHighway = road.type === 'highway';
            const isArterial = road.type === 'arterial';

            return (
              <g key={road.id}>
                {/* Asphalt Bed */}
                <rect
                  x={xMin}
                  y={yMin}
                  width={w}
                  height={h}
                  fill={isHighway ? '#1E232A' : isArterial ? '#252A32' : '#2D323A'}
                />

                {/* Road Kerbs */}
                <rect
                  x={xMin}
                  y={yMin}
                  width={w}
                  height={h}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                />

                {/* Road Markings */}
                {isHighway && (
                  <line
                    x1={xMin + w / 2}
                    y1={yMin}
                    x2={xMin + w / 2}
                    y2={yMax}
                    stroke="#FBBF24"
                    strokeWidth="3"
                  />
                )}

                {isArterial && (
                  <line
                    x1={xMin}
                    y1={yMin + h / 2}
                    x2={xMax}
                    y2={yMin + h / 2}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeDasharray="12 8"
                  />
                )}
              </g>
            );
          })}

          {/* Road Name Typography */}
          <text
            x="580"
            y="65"
            fill="#F8FAFC"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="2"
          >
            PROPOSED 60'-0" WIDE ROAD (TO MAISIGANDI TEMPLE)
          </text>

          <text
            x="1055"
            y="400"
            fill="#FEF08A"
            fontSize="15"
            fontWeight="bold"
            textAnchor="middle"
            transform="rotate(90, 1055, 400)"
            letterSpacing="2"
          >
            SRISAILAM HIGHWAY (NH-765)
          </text>

          <text
            x="580"
            y="332"
            fill="#CBD5E1"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="1.5"
          >
            PROPOSED 33'-0" WIDE ROAD
          </text>

          {/* Reserved Open Park (Ac. 0.758 cents) */}
          <g>
            <rect
              x={(parkData.polygon[0][0] + 95) * 6.0}
              y={(parkData.polygon[0][1] + 58) * 5.6}
              width={parkData.width * 6.0}
              height={parkData.depth * 5.6}
              fill="#5EAB53"
              stroke="#3B7D31"
              strokeWidth="2"
              rx="6"
            />
            {/* Jogging Track Ring */}
            <circle
              cx={(parkData.center[0] + 95) * 6.0}
              cy={(parkData.center[1] + 58) * 5.6}
              r={parkData.width * 1.8}
              fill="none"
              stroke="#D97706"
              strokeWidth="4"
              strokeDasharray="6 4"
              opacity="0.85"
            />
            <text
              x={(parkData.center[0] + 95) * 6.0}
              y={(parkData.center[1] + 58) * 5.6 - 8}
              fill="#FFFFFF"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
            >
              OPEN SPACE PARK
            </text>
            <text
              x={(parkData.center[0] + 95) * 6.0}
              y={(parkData.center[1] + 58) * 5.6 + 12}
              fill="#FEF08A"
              fontSize="11"
              fontWeight="semibold"
              textAnchor="middle"
            >
              Ac. 0.758 Cents
            </text>
          </g>

          {/* Master Plots (All 96 Plots) */}
          {plots.map((plot) => {
            const isSelected = selectedPlot?.plotNumber === plot.plotNumber;
            const isHovered = hoveredPlot?.plotNumber === plot.plotNumber;
            const meta = statusColors[plot.status] || statusColors.available;

            const [[p0x, p0y], [p1x], [, p2y]] = plot.svgPolygon;
            const w = p1x - p0x;
            const h = p2y - p0y;
            const cx = p0x + w / 2;
            const cy = p0y + h / 2;

            // Check filters
            const matchesStatus = filterStatus === 'all' || plot.status === filterStatus;
            const matchesFacing = filterFacing === 'all' || plot.facing.toLowerCase().includes(filterFacing.toLowerCase());
            const matchesSearch = !searchTerm || String(plot.plotNumber) === searchTerm.trim();
            const isDimmed = !matchesStatus || !matchesFacing || !matchesSearch;

            return (
              <g
                key={plot.plotNumber}
                onClick={() => onSelectPlot(plot)}
                onMouseEnter={() => setHoveredPlot(plot)}
                onMouseLeave={() => setHoveredPlot(null)}
                className="cursor-pointer transition-opacity duration-150"
                opacity={isDimmed ? 0.35 : 1}
              >
                {/* Plot Surface */}
                <rect
                  x={p0x}
                  y={p0y}
                  width={w}
                  height={h}
                  fill={isSelected ? '#F15A24' : isHovered ? '#FB923C' : meta.bg}
                  stroke={isSelected ? '#FFFFFF' : '#1E293B'}
                  strokeWidth={isSelected ? 3 : 1.2}
                  filter={isSelected ? 'url(#selectedGlow)' : 'url(#plotShadow)'}
                  rx="2"
                />

                {/* Circular Number Badge */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={Math.min(w, h) * 0.32 > 10 ? 10 : Math.min(w, h) * 0.32}
                  fill={isSelected ? '#1E293B' : '#FFFFFF'}
                  stroke={isSelected ? '#FFFFFF' : '#0F172A'}
                  strokeWidth="1"
                />
                <text
                  x={cx}
                  y={cy + 3.5}
                  fill={isSelected ? '#FFFFFF' : '#0F172A'}
                  fontSize={Math.min(w, h) * 0.28 > 9.5 ? 9.5 : 8}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {plot.plotNumber}
                </text>

                {/* Area Label on Zoom */}
                {scale > 1.3 && (
                  <text
                    x={cx}
                    y={cy + 16}
                    fill="#FFFFFF"
                    fontSize="7.5"
                    fontWeight="semibold"
                    textAnchor="middle"
                    opacity="0.9"
                  >
                    {plot.areaSqYds} sq.yds
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
