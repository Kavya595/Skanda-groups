import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass
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

  // Animated 2D Cars positions (User requirement: "and 2d view also cars we can see")
  const [carPositions, setCarPositions] = useState({
    hwySouth: 150,
    hwyNorth: 550,
    road60: 300,
    roadMid: 200,
    roadV1: 250
  });

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setCarPositions(prev => ({
        hwySouth: prev.hwySouth > 720 ? 40 : prev.hwySouth + 1.2,
        hwyNorth: prev.hwyNorth < 40 ? 720 : prev.hwyNorth - 1.1,
        road60: prev.road60 > 1100 ? 50 : prev.road60 + 1.0,
        roadMid: prev.roadMid > 950 ? 80 : prev.roadMid + 0.8,
        roadV1: prev.roadV1 > 700 ? 50 : prev.roadV1 + 0.7
      }));
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

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
      className="relative w-full h-full bg-[#DFEFE0] overflow-hidden select-none cursor-grab active:cursor-grabbing"
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
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">2D Master Plan</div>
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
          className="w-full h-full max-w-[1400px] max-h-[850px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle GIS Map Land Texture */}
          <rect x="0" y="0" width="1200" height="780" fill="#DFEFE0" />

          {/* Site Boundary Compound Surface */}
          <rect
            x="35"
            y="30"
            width="1120"
            height="710"
            fill="#D5E8CE"
            stroke="#94C383"
            strokeWidth="2"
            rx="8"
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
                <rect
                  x={xMin}
                  y={yMin}
                  width={w}
                  height={h}
                  fill={isHighway ? '#1E232A' : '#262A30'}
                />

                {isHighway && (
                  <line
                    x1={xMin + w / 2}
                    y1={yMin}
                    x2={xMin + w / 2}
                    y2={yMax}
                    stroke="#FBBF24"
                    strokeWidth="2.5"
                  />
                )}

                {isArterial && (
                  <line
                    x1={xMin}
                    y1={yMin + h / 2}
                    x2={xMax}
                    y2={yMin + h / 2}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeDasharray="10 6"
                  />
                )}
              </g>
            );
          })}

          {/* Moving 2D Vehicles on Roads (User requirement: "and 2d view also cars we can see") */}
          {/* Car 1: Highway Southbound (White) */}
          <g transform={`translate(1048, ${carPositions.hwySouth})`}>
            <rect x="-5" y="-10" width="10" height="20" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
            <rect x="-4" y="-3" width="8" height="9" rx="1.5" fill="#1E293B" />
          </g>

          {/* Car 2: Highway Northbound (Red) */}
          <g transform={`translate(1062, ${carPositions.hwyNorth})`}>
            <rect x="-5" y="-10" width="10" height="20" rx="3" fill="#EF4444" stroke="#0F172A" strokeWidth="1" />
            <rect x="-4" y="-6" width="8" height="9" rx="1.5" fill="#1E293B" />
          </g>

          {/* Car 3: 60ft Arterial Road Eastbound (Blue) */}
          <g transform={`translate(${carPositions.road60}, 62)`}>
            <rect x="-10" y="-5" width="20" height="10" rx="3" fill="#2563EB" stroke="#0F172A" strokeWidth="1" />
            <rect x="-3" y="-4" width="9" height="8" rx="1.5" fill="#1E293B" />
          </g>

          {/* Car 4: Internal 33' Mid Road Eastbound (Yellow) */}
          <g transform={`translate(${carPositions.roadMid}, 332)`}>
            <rect x="-9" y="-4.5" width="18" height="9" rx="2.5" fill="#FBBF24" stroke="#0F172A" strokeWidth="1" />
            <rect x="-2" y="-3.5" width="8" height="7" rx="1.5" fill="#1E293B" />
          </g>

          {/* Car 5: Internal 33' Vertical Road V1 Southbound (Silver) */}
          <g transform={`translate(375, ${carPositions.roadV1})`}>
            <rect x="-4.5" y="-9" width="9" height="18" rx="2.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
            <rect x="-3.5" y="-2" width="7" height="8" rx="1.5" fill="#1E293B" />
          </g>

          {/* Road Typography */}
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

          {/* Reserved Open Park (Ac. 0.758 cents) - matching Screenshot 1 with sprinkled flower blossoms */}
          <g>
            <rect
              x={(parkData.polygon[0][0] + 95) * 6.0}
              y={(parkData.polygon[0][1] + 58) * 5.6}
              width={parkData.width * 6.0}
              height={parkData.depth * 5.6}
              fill="#84CC16"
              stroke="#4D7C0F"
              strokeWidth="2.5"
              rx="6"
            />
            {/* Jogging Track Loop */}
            <circle
              cx={(parkData.center[0] + 95) * 6.0}
              cy={(parkData.center[1] + 58) * 5.6}
              r={parkData.width * 1.8}
              fill="none"
              stroke="#D97706"
              strokeWidth="3.5"
              strokeDasharray="5 4"
              opacity="0.8"
            />

            {/* Sprinkled Daisy & Orange Flower Blossoms (matching Screenshot 1) */}
            {[
              [-60, -50, '#FFFFFF'],
              [40, -60, '#FB923C'],
              [-20, -25, '#FFFFFF'],
              [50, 30, '#FFFFFF'],
              [-45, 45, '#FB923C'],
              [15, 55, '#FFFFFF'],
              [-70, 15, '#FFFFFF'],
              [65, -15, '#FB923C'],
              [-35, -65, '#FFFFFF'],
              [25, -35, '#FFFFFF'],
              [-15, 60, '#FB923C'],
              [55, 65, '#FFFFFF']
            ].map(([dx, dy, col], idx) => {
              const fx = (parkData.center[0] + 95) * 6.0 + dx;
              const fy = (parkData.center[1] + 58) * 5.6 + dy;
              return (
                <g key={`flower-${idx}`}>
                  <circle cx={fx} cy={fy} r="3.2" fill={col} />
                  <circle cx={fx} cy={fy} r="1.4" fill="#FBBF24" />
                </g>
              );
            })}

            {/* "Park" Label in Center (matching Screenshot 1) */}
            <text
              x={(parkData.center[0] + 95) * 6.0}
              y={(parkData.center[1] + 58) * 5.6 - 4}
              fill="#14532D"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              fontStyle="italic"
            >
              Park
            </text>
            <text
              x={(parkData.center[0] + 95) * 6.0}
              y={(parkData.center[1] + 58) * 5.6 + 14}
              fill="#166534"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              Ac. 0.758 Cents
            </text>
          </g>

          {/* Master Plots (Flat tiles, zero gaps, prominent bold numbers) */}
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
                opacity={isDimmed ? 0.3 : 1}
              >
                {/* Plot Flat Surface */}
                <rect
                  x={p0x}
                  y={p0y}
                  width={w}
                  height={h}
                  fill={isSelected ? '#F15A24' : isHovered ? '#FB923C' : meta.bg}
                  stroke={isSelected ? '#FFFFFF' : '#FFFFFF'}
                  strokeWidth={isSelected ? 3 : 1.2}
                />

                {/* When Selected: Center Circular Badge matching Photo 4 */}
                {isSelected ? (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={Math.min(w, h) * 0.38}
                      fill="#FFFFFF"
                      stroke="#94A3B8"
                      strokeWidth="1.2"
                    />
                    <line
                      x1={cx - Math.min(w, h) * 0.3}
                      y1={cy}
                      x2={cx + Math.min(w, h) * 0.3}
                      y2={cy}
                      stroke="#CBD5E1"
                      strokeWidth="1"
                    />
                    <text
                      x={cx}
                      y={cy - 3}
                      fill="#0F172A"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {plot.plotNumber}
                    </text>
                    <text
                      x={cx}
                      y={cy + 10}
                      fill="#64748B"
                      fontSize="7.5"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {plot.areaSqYds} yd²
                    </text>
                  </g>
                ) : (
                  <text
                    x={cx}
                    y={cy + 4.5}
                    fill={plot.status === 'sold' ? '#7F1D1D' : '#1E293B'}
                    fontSize={Math.min(w, h) * 0.34 > 13 ? 13 : Math.max(Math.min(w, h) * 0.3, 10.5)}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {plot.plotNumber}
                  </text>
                )}

                {/* Area Label on Zoom (Screenshot 2: 183.33 yd²) when unselected */}
                {!isSelected && scale > 1.25 && (
                  <text
                    x={cx}
                    y={cy + 17}
                    fill="#0F172A"
                    fontSize="8.5"
                    fontWeight="semibold"
                    textAnchor="middle"
                    opacity="0.9"
                  >
                    {plot.areaSqYds} yd²
                  </text>
                )}

                {/* Edge Dimensions when selected or hovered (Screenshot 2 & 4) */}
                {(isSelected || (isHovered && scale > 1.2)) && (
                  <g>
                    {/* Top dimension */}
                    <text x={cx} y={p0y + 9} fill={isSelected ? '#FFFFFF' : '#0F172A'} fontSize="8" fontWeight="bold" textAnchor="middle">
                      {plot.dimensions?.split('x')[0]?.trim()}
                    </text>
                    {/* Bottom dimension */}
                    <text x={cx} y={p0y + h - 3} fill={isSelected ? '#FFFFFF' : '#0F172A'} fontSize="8" fontWeight="bold" textAnchor="middle">
                      {plot.dimensions?.split('x')[0]?.trim()}
                    </text>
                    {/* Left dimension */}
                    <text x={p0x + 8} y={cy + 3} fill={isSelected ? '#FFFFFF' : '#0F172A'} fontSize="8" fontWeight="bold" textAnchor="middle">
                      {plot.dimensions?.split('x')[1]?.trim()}
                    </text>
                    {/* Right dimension */}
                    <text x={p0x + w - 8} y={cy + 3} fill={isSelected ? '#FFFFFF' : '#0F172A'} fontSize="8" fontWeight="bold" textAnchor="middle">
                      {plot.dimensions?.split('x')[1]?.trim()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* OpenStreetMap Attribution Watermark */}
      <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded">
        &copy; OpenStreetMap contributors &bull; DTCP TLP NO. 87/2024/H
      </div>
    </div>
  );
}
