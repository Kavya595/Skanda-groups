import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Compass, TreePine, Info } from 'lucide-react';
import { parkData, layoutRoads, statusColors } from './layoutData';

export default function Layout2DView({
  plots,
  selectedPlot,
  onSelectPlot,
  filterStatus,
  filterFacing,
  searchTerm
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const containerRef = useRef(null);

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.6));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag pan controls
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only primary button
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

  // Determine if a plot matches the active filters
  const matchesFilter = (plot) => {
    if (filterStatus && filterStatus !== 'all' && plot.status !== filterStatus) return false;
    if (filterFacing && filterFacing !== 'all' && !plot.facing.toLowerCase().includes(filterFacing.toLowerCase())) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const numMatch = String(plot.plotNumber) === s;
      const blockMatch = plot.block && plot.block.toLowerCase().includes(s);
      if (!numMatch && !blockMatch) return false;
    }
    return true;
  };

  return (
    <div className="relative w-full h-[650px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none">
      {/* Floating View Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/95 backdrop-blur-sm p-1.5 rounded-xl shadow-md border border-slate-200">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          title="Reset View"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          aria-label="Reset View"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Orientation Badge (Compass Rose) */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-extrabold text-red-600">N</span>
          <Compass className="w-6 h-6 text-slate-700" />
          <span className="text-[10px] font-bold text-slate-400">S</span>
        </div>
        <div className="text-xs">
          <div className="font-bold text-slate-800">Master Plan View</div>
          <div className="text-[11px] text-slate-500">TLP NO. 87/2024/H</div>
        </div>
      </div>

      {/* Hover Info Tooltip */}
      {hoveredPlot && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-900/90 text-white text-xs px-3 py-2 rounded-lg shadow-xl backdrop-blur-sm transform -translate-x-1/2 -translate-y-full mb-2"
          style={{
            left: hoveredPlot.bounds.x + hoveredPlot.bounds.width / 2 + position.x,
            top: hoveredPlot.bounds.y + position.y - 10
          }}
        >
          <div className="font-bold text-amber-300">Plot #{hoveredPlot.plotNumber}</div>
          <div>Area: {hoveredPlot.areaSqYds} Sq.Yds</div>
          <div>Facing: {hoveredPlot.facing}</div>
          <div className="capitalize text-emerald-300 font-semibold">{hoveredPlot.status}</div>
        </div>
      )}

      {/* SVG Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      >
        <svg
          viewBox="0 0 1100 720"
          className="w-full h-full"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          {/* Background Canvas */}
          <rect x="0" y="0" width="1100" height="720" fill="#F8FAFC" />

          {/* Boundaries & External References */}
          {/* Top: 60ft Road to Maisigandi Temple */}
          <rect x="20" y="20" width="960" height="45" fill="#475569" rx="4" />
          <text x="450" y="47" fill="#F8FAFC" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            PROPOSED 60'-0" WIDE ROAD ────────► TO MASIGANDI TEMPLE
          </text>

          {/* East: Srisailam Highway */}
          <rect x="990" y="20" width="85" height="670" fill="#334155" rx="4" />
          <text
            x="1035"
            y="355"
            fill="#F8FAFC"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="2"
            transform="rotate(90 1035 355)"
          >
            SRISAILAM HIGHWAY (NH 765)
          </text>

          {/* East: Highway 33ft Service Road */}
          <rect x="940" y="20" width="40" height="670" fill="#64748B" opacity="0.9" />
          <text
            x="960"
            y="355"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
            transform="rotate(90 960 355)"
          >
            PROP. 33'-0" WIDE ROAD
          </text>

          {/* Middle: Horizontal 33ft Road */}
          <rect x="20" y="275" width="920" height="40" fill="#64748B" rx="3" opacity="0.9" />
          <text x="460" y="299" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            PROPOSED 33'-0" WIDE ROAD
          </text>

          {/* Bottom Boundary: 4th Phase */}
          <rect x="20" y="675" width="960" height="30" fill="#E2E8F0" rx="3" />
          <text x="490" y="694" fill="#64748B" fontSize="12" fontWeight="bold" textAnchor="middle">
            4th Phase Development
          </text>

          {/* Vertical Internal 33ft Roads */}
          <rect x="135" y="315" width="40" height="360" fill="#64748B" opacity="0.85" />
          <rect x="370" y="65" width="38" height="610" fill="#64748B" opacity="0.85" />
          <rect x="525" y="65" width="38" height="610" fill="#64748B" opacity="0.85" />
          <rect x="685" y="65" width="38" height="610" fill="#64748B" opacity="0.85" />
          <rect x="835" y="65" width="38" height="610" fill="#64748B" opacity="0.85" />

          {/* Road Direction/Labels */}
          <text x="389" y="180" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle" transform="rotate(90 389 180)">PROP. 33' ROAD</text>
          <text x="544" y="180" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle" transform="rotate(90 544 180)">PROP. 33' ROAD</text>
          <text x="704" y="180" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle" transform="rotate(90 704 180)">PROP. 33' ROAD</text>
          <text x="854" y="180" fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle" transform="rotate(90 854 180)">PROP. 33' ROAD</text>

          {/* Reserved Open Space / Park (Ac. 0.758 cents) */}
          <g>
            <rect
              x={parkData.bounds.x}
              y={parkData.bounds.y}
              width={parkData.bounds.width}
              height={parkData.bounds.height}
              fill="#86EFAC"
              stroke="#22C55E"
              strokeWidth="2"
              rx="6"
            />
            {/* Park Internal Pathway & Decor */}
            <circle cx="150" cy="170" r="30" fill="#BBF7D0" stroke="#4ADE80" strokeWidth="1.5" />
            <circle cx="150" cy="170" r="10" fill="#38BDF8" opacity="0.8" />
            <text x="150" y="130" fill="#14532D" fontSize="11" fontWeight="bold" textAnchor="middle">
              SITE RESERVED FOR OPEN SPACE
            </text>
            <text x="150" y="145" fill="#15803D" fontSize="12" fontWeight="extrabold" textAnchor="middle">
              (PARK)
            </text>
            <text x="150" y="195" fill="#166534" fontSize="10" fontWeight="bold" textAnchor="middle">
              Ac. 0.758 cents
            </text>
            <text x="150" y="210" fill="#14532D" fontSize="8" textAnchor="middle">
              209'-9" x 169'-3" x 201'-6"
            </text>
          </g>

          {/* Render 96 Plots */}
          {plots.map(plot => {
            if (!plot.bounds) return null;
            const { x, y, width: w, height: h } = plot.bounds;
            const isSelected = selectedPlot && selectedPlot.plotNumber === plot.plotNumber;
            const isHovered = hoveredPlot && hoveredPlot.plotNumber === plot.plotNumber;
            const matches = matchesFilter(plot);

            const meta = statusColors[plot.status] || statusColors.available;
            // Yellow base with status indication matching Brochure Page 2
            const fillColor = isSelected
              ? '#FB923C' // Vibrant Orange for selected
              : matches
                ? plot.status === 'sold'
                  ? '#CBD5E1'
                  : plot.status === 'reserved'
                    ? '#FDE68A'
                    : plot.status === 'blocked'
                      ? '#94A3B8'
                      : '#FEF08A' // Warm sunny yellow matching brochure plots
                : '#F1F5F9';

            const strokeColor = isSelected
              ? '#EA580C'
              : isHovered
                ? '#F97316'
                : meta.border || '#CA8A04';

            const opacity = matches ? 1 : 0.25;

            return (
              <g
                key={plot.plotNumber}
                onClick={() => onSelectPlot(plot)}
                onMouseEnter={() => setHoveredPlot(plot)}
                onMouseLeave={() => setHoveredPlot(null)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPlot(plot);
                  }
                }}
                className="plot-polygon focus:outline-none"
                style={{ opacity, transition: 'all 0.2s ease' }}
              >
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                  rx="2"
                />

                {/* Plot Number Label */}
                <text
                  x={x + w / 2}
                  y={y + h / 2 - 2}
                  fill="#1E293B"
                  fontSize={w < 48 ? '9' : '11'}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {plot.plotNumber}
                </text>

                {/* Area Label (Sq.Yds) */}
                <text
                  x={x + w / 2}
                  y={y + h / 2 + 10}
                  fill="#475569"
                  fontSize={w < 48 ? '7' : '8'}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {plot.areaSqYds}
                </text>

                {/* Status Dot / Indicator */}
                <circle
                  cx={x + w - 5}
                  cy={y + 5}
                  r="3"
                  fill={meta.bg}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
