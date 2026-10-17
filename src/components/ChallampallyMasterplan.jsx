import React from 'react';

/**
 * ChallampallyMasterplan
 * Authentic, pixel-perfect DTCP masterplan rendering of CHALLAMPALLY / SKANDHA GRAND VALLEY
 * Derived directly from the official sanctioned layout drawing (Plots 1 to 96).
 * 
 * Features:
 * - Dynamic Status Colors: Available (Emerald Green #22c55e), Booked (Royal Blue #2563eb), Sold (Crimson Red #ef4444).
 * - Exact Architectural Grid Alignment: Every vertical road aligns in a straight line through the central horizontal road.
 * - Center circular badge: Crisp white circle with 1px black border, bold Plot Number on top, divider, and Sq.Yards on bottom.
 * - Corner plots (32, 28, 21, 20) with authentic diagonal architectural hatching.
 * - Authentic Playground Park area with official dimensions (209'-9", 169'-3", 201'-6") and rounded corner.
 * - Perimeter boundary dimensions labeled along all plot perimeters in crisp monospace black.
 * - Slanted southern boundary with authentic "4th Phase" at bottom-left.
 * - Full interactive click handling to select and inspect any plot.
 */
export default function ChallampallyMasterplan({ 
  plotLookup = {}, 
  onSelectPlot = () => {}, 
  selectedPlotId = null,
  isPlotHighlighted = () => true 
}) {

  // Helper to render individual plot box with exact perimeter dimensions and center badge
  const renderPlot = ({
    number,
    sqYards,
    topDim = null,
    bottomDim = null,
    leftDim = null,
    rightDim = null,
    isHatched = false,
    className = "h-[44px]",
    extraStyle = {}
  }) => {
    const plot = plotLookup[number] || {
      id: number,
      number,
      sqYards,
      status: 'available',
      facing: 'East',
      dimensions: `${topDim || '33\''} × ${leftDim || '50\''}`,
      roadWidth: "33' B.T. Road"
    };

    const isSelected = selectedPlotId === plot.id || selectedPlotId === plot.number;
    const isMatched = isPlotHighlighted(plot);

    // Existing Status Colors: Available (Green #22c55e), Booked (Blue #2563eb), Sold (Red #ef4444)
    let baseColor = '#22c55e'; // Available (Green)
    if (plot.status === 'booked') {
      baseColor = '#2563eb'; // Booked (Blue)
    } else if (plot.status === 'sold') {
      baseColor = '#ef4444'; // Sold (Red)
    }

    const fillBg = isHatched 
      ? `repeating-linear-gradient(45deg, ${baseColor}, ${baseColor} 5px, rgba(0,0,0,0.18) 5px, rgba(0,0,0,0.18) 7px)`
      : baseColor;

    const opacity = isMatched ? 1 : 0.25;

    return (
      <button
        key={number}
        type="button"
        onClick={() => onSelectPlot(plot)}
        style={{
          background: fillBg,
          borderColor: isSelected ? '#F58220' : '#000000',
          opacity,
          ...extraStyle
        }}
        className={`relative border border-black flex flex-col items-center justify-center p-0.5 select-none transition-all duration-150 cursor-pointer group ${className} ${
          isSelected 
            ? 'ring-3 ring-[#F58220] ring-offset-2 ring-offset-black z-30 scale-105 shadow-xl' 
            : 'hover:scale-102 hover:z-20 hover:shadow-md'
        }`}
        title={`Plot #${number} • ${sqYards} Sq.Yds (${plot.status.toUpperCase()})`}
      >
        {/* Top Dimension */}
        {topDim && (
          <span 
            className="absolute top-0.5 inset-x-0 text-[7.5px] font-mono font-bold leading-none text-center pointer-events-none truncate px-0.5 text-black"
          >
            {topDim}
          </span>
        )}

        {/* Left Dimension */}
        {leftDim && (
          <span 
            className="absolute left-0.5 inset-y-0 flex items-center text-[7px] font-mono font-bold leading-none pointer-events-none text-black"
          >
            {leftDim}
          </span>
        )}

        {/* Center Circular Badge (Plot Number on top, horizontal line, Square Yards on bottom) */}
        <div 
          className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white border border-black flex flex-col items-center justify-center z-10 transition-transform group-hover:scale-110 overflow-hidden px-0.5 shadow-xs"
        >
          <span className="text-[9.5px] sm:text-[10px] font-black leading-none text-black text-center">
            {number}
          </span>
          <div className="w-full h-[0.75px] bg-black my-[0.5px]" />
          <span className="text-[7.5px] sm:text-[8px] font-extrabold leading-none text-black text-center">
            {sqYards}
          </span>
        </div>

        {/* Right Dimension */}
        {rightDim && (
          <span 
            className="absolute right-0.5 inset-y-0 flex items-center text-[7px] font-mono font-bold leading-none pointer-events-none text-black"
          >
            {rightDim}
          </span>
        )}

        {/* Bottom Dimension */}
        {bottomDim && (
          <span 
            className="absolute bottom-0.5 inset-x-0 text-[7.5px] font-mono font-bold leading-none text-center pointer-events-none truncate px-0.5 text-black"
          >
            {bottomDim}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="inline-flex flex-col select-none relative text-left text-gray-900 bg-white p-3 rounded-xl shadow-2xl border border-gray-300">
      
      {/* =========================================================================
          1. TOP BLOCKS ROW (Park + Blocks 1, 2, 3, 4 + Continuous Roads)
         ========================================================================= */}
      <div className="flex items-stretch bg-[#1e1e1e]">
        
        {/* PARK AREA (SITE RESERVED FOR OPEN SPACE - Authentic Playground Image) */}
        <div className="w-[258px] h-[174px] border border-black relative overflow-hidden bg-emerald-950 flex-shrink-0 rounded-bl-3xl shadow-inner">
          <img 
            src="/images/masterplan-park.png" 
            alt="Site Reserved for Open Space (Park) Ac.0.758 cents" 
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>

        {/* Road 1: PROP. 33'-0" WIDE ROAD (Aligns with Bottom Road 1) */}
        <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border-x border-black/40">
          <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 1: Left (Plots 29..32) | Right (Plots 25..28) */}
        <div className="w-[128px] flex bg-[#1e1e1e] flex-shrink-0">
          {/* West Column: Plots 29, 30, 31, 32 */}
          <div className="w-[64px] flex flex-col">
            {renderPlot({ number: 29, sqYards: 264, topDim: "50'-1\"", leftDim: "48'", rightDim: "47'", bottomDim: "50'", className: "h-[46px]" })}
            {renderPlot({ number: 30, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 31, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 32, sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'", isHatched: true, className: "h-[52px]" })}
          </div>
          {/* East Column: Plots 25, 26, 27, 28 */}
          <div className="w-[64px] flex flex-col">
            {renderPlot({ number: 25, sqYards: 259, topDim: "50'-1\"", rightDim: "46'-3\"", bottomDim: "50'", className: "h-[46px]" })}
            {renderPlot({ number: 26, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 27, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 28, sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'", isHatched: true, className: "h-[52px]" })}
          </div>
        </div>

        {/* Road 2: PROP. 33'-0" WIDE ROAD (Aligns with Bottom Road 2) */}
        <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border-x border-black/40">
          <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 2: Left (Plots 24..21) | Right (Plots 17..20) */}
        <div className="w-[128px] flex bg-[#1e1e1e] flex-shrink-0">
          {/* West Column: Plots 24, 23, 22, 21 */}
          <div className="w-[64px] flex flex-col">
            {renderPlot({ number: 24, sqYards: 249, topDim: "50'-1\"", leftDim: "45'-3\"", rightDim: "44'-3\"", bottomDim: "50'", className: "h-[46px]" })}
            {renderPlot({ number: 23, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 22, sqYards: 183, leftDim: "33'", rightDim: "33'", isHatched: true, className: "h-[38px]" })}
            {renderPlot({ number: 21, sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'", isHatched: true, className: "h-[52px]" })}
          </div>
          {/* East Column: Plots 17, 18, 19, 20 */}
          <div className="w-[64px] flex flex-col">
            {renderPlot({ number: 17, sqYards: 242, topDim: "50'-1\"", rightDim: "43'", bottomDim: "50'", className: "h-[46px]" })}
            {renderPlot({ number: 18, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 19, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 20, sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'", isHatched: true, className: "h-[52px]" })}
          </div>
        </div>

        {/* Road 3: PROP. 33'-0" WIDE ROAD (Aligns with Bottom Road 3) */}
        <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border-x border-black/40">
          <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 3: Left (Plots 16..13) | Right (Plots 9..12) */}
        <div className="w-[140px] flex bg-[#1e1e1e] flex-shrink-0">
          {/* West Column: Plots 16, 15, 14, 13 */}
          <div className="w-[70px] flex flex-col">
            {renderPlot({ number: 16, sqYards: 256, topDim: "55'-1\"", leftDim: "42'-6\"", rightDim: "41'-3\"", bottomDim: "55'", className: "h-[46px]" })}
            {renderPlot({ number: 15, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 14, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 13, sqYards: 336, leftDim: "55'", rightDim: "55'", bottomDim: "55'", className: "h-[52px]" })}
          </div>
          {/* East Column: Plots 9, 10, 11, 12 */}
          <div className="w-[70px] flex flex-col">
            {renderPlot({ number: 9, sqYards: 248, topDim: "55'-1\"", rightDim: "39'-9\"", bottomDim: "55'", className: "h-[46px]" })}
            {renderPlot({ number: 10, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 11, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 12, sqYards: 336, leftDim: "55'", rightDim: "55'", bottomDim: "55'", className: "h-[52px]" })}
          </div>
        </div>

        {/* Road 4: PROP. 33'-0" WIDE ROAD (Aligns with Bottom Road 4) */}
        <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border-x border-black/40">
          <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 4: Left (Plots 8..5) | Right (Plots 1..4) */}
        <div className="w-[152px] flex bg-[#1e1e1e] flex-shrink-0">
          {/* West Column: Plots 8, 7, 6, 5 */}
          <div className="w-[70px] flex flex-col">
            {renderPlot({ number: 8, sqYards: 237, topDim: "55'-1\"", leftDim: "39'-3\"", rightDim: "38'-3\"", bottomDim: "55'", className: "h-[46px]" })}
            {renderPlot({ number: 7, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 6, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[38px]" })}
            {renderPlot({ number: 5, sqYards: 336, leftDim: "55'", rightDim: "55'", bottomDim: "55'", className: "h-[52px]" })}
          </div>
          {/* East Column: Plots 1, 2, 3, 4 */}
          <div className="w-[82px] flex flex-col">
            {renderPlot({ number: 1, sqYards: 246, topDim: "58'-3\"", rightDim: "37'-3\"", bottomDim: "59'-3\"", className: "h-[46px]" })}
            {renderPlot({ number: 2, sqYards: 219, rightDim: "33'", bottomDim: "59'-3\"", className: "h-[38px]" })}
            {renderPlot({ number: 3, sqYards: 223, rightDim: "33'", bottomDim: "60'-3\"", className: "h-[38px]" })}
            {renderPlot({ number: 4, sqYards: 380, rightDim: "55'", bottomDim: "61'-3\"", className: "h-[52px]" })}
          </div>
        </div>

        {/* Road 5: Far Right Road */}
        <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border-l border-black/40">
          <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

      </div>

      {/* =========================================================================
          2. CENTRAL HORIZONTAL ROAD (PROPOSED 33'-0" WIDE ROAD)
         ========================================================================= */}
      <div className="h-[32px] bg-[#1e1e1e] flex items-center justify-around px-12 text-[10.5px] font-mono font-bold tracking-[0.25em] text-white select-none border-y border-black">
        <span>PROPOSED 33'-0" WIDE ROAD</span>
        <span>PROPOSED 33'-0" WIDE ROAD</span>
        <span>PROPOSED 33'-0" WIDE ROAD</span>
      </div>

      {/* =========================================================================
          3. BOTTOM BLOCKS ROW (Strip + Blocks 5, 6, 7, 8, 9)
         ========================================================================= */}
      <div className="flex items-start bg-transparent">
        
        {/* COLUMN 1 BOTTOM: Left Strip (Plots 33-36) + Road + Block 5 (Plots 37-46) = Exact 258px width! */}
        <div className="w-[258px] flex items-start flex-shrink-0">
          
          {/* Left Strip: Plots 33, 34, 35, 36 */}
          <div className="w-[80px] flex flex-col flex-shrink-0">
            {renderPlot({ number: 33, sqYards: 362, topDim: "58'-9\"", rightDim: "55'", className: "h-[44px]" })}
            {renderPlot({ number: 34, sqYards: 220, topDim: "59'-9\"", rightDim: "33'", className: "h-[34px]" })}
            {renderPlot({ number: 35, sqYards: 222, topDim: "60'-3\"", rightDim: "33'", className: "h-[34px]" })}
            {renderPlot({ 
              number: 36, 
              sqYards: 393, 
              topDim: "60'-9\"", 
              rightDim: "66'-9\"", 
              className: "h-[52px]",
              extraStyle: { clipPath: "polygon(0 0, 100% 0, 100% 82%, 0 100%)" }
            })}
            {/* 4th Phase Light Blue Strip under Plot 36 */}
            <div className="bg-[#cde8f6] border border-[#93c5fd] text-slate-800 font-sans font-extrabold text-[10px] text-center py-2.5 px-1 mt-1 shadow-xs">
              4th Phase
            </div>
          </div>

          {/* Vertical 33' B.T. Road (Between Strip and Block 5) */}
          <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 self-stretch min-h-[220px] border-x border-black/40">
            <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
              PROP. 33'-0" WIDE ROAD
            </span>
          </div>

          {/* BLOCK 5: West (Plots 41..37) | East (Plots 42..46) */}
          <div className="w-[146px] flex flex-col flex-shrink-0">
            <div className="flex">
              {/* West Column: Plots 41, 40, 39, 38, 37 */}
              <div className="w-[70px] flex flex-col">
                {renderPlot({ number: 41, sqYards: 336, topDim: "55'", leftDim: "55'", className: "h-[42px]" })}
                {renderPlot({ number: 40, sqYards: 202, leftDim: "33'", className: "h-[30px]" })}
                {renderPlot({ number: 39, sqYards: 202, leftDim: "33'", className: "h-[30px]" })}
                {renderPlot({ number: 38, sqYards: 202, leftDim: "33'", className: "h-[30px]" })}
                {renderPlot({ number: 37, sqYards: 309, leftDim: "42'-9\"", bottomDim: "58'-3\"", className: "h-[44px]" })}
              </div>
              {/* East Column: Plots 42, 43, 44, 45, 46 */}
              <div className="w-[76px] flex flex-col">
                {renderPlot({ number: 42, sqYards: 336, topDim: "55'", rightDim: "55'", className: "h-[42px]" })}
                {renderPlot({ number: 43, sqYards: 202, rightDim: "33'", className: "h-[30px]" })}
                {renderPlot({ number: 44, sqYards: 202, rightDim: "33'", className: "h-[30px]" })}
                {renderPlot({ number: 45, sqYards: 202, rightDim: "33'", className: "h-[30px]" })}
                {renderPlot({ number: 46, sqYards: 403, rightDim: "73'-9\"", className: "h-[58px]" })}
              </div>
            </div>
            {/* Slanted 4th Phase Area under Block 5 */}
            <div className="bg-slate-50 text-slate-700 font-sans font-black text-[10px] text-center py-2 px-1 mt-1 border-t border-slate-300">
              4th Phase
            </div>
          </div>

        </div>

        {/* Road 1 Bottom: PROPOSED 33'-0" WIDE ROAD (Aligns with Top Road 1) */}
        <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 self-stretch min-h-[220px] border-x border-black/40">
          <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
            PROPOSED 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 6: West (Plots 52..47) | East (Plots 53..58) = Exact 128px width! */}
        <div className="w-[128px] flex flex-shrink-0">
          {/* West Column: Plots 52, 51, 50, 49, 48, 47 */}
          <div className="w-[64px] flex flex-col">
            {renderPlot({ number: 52, sqYards: 306, topDim: "50'", leftDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 51, sqYards: 183, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 50, sqYards: 183, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 49, sqYards: 183, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 48, sqYards: 183, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 47, sqYards: 306, leftDim: "50'", className: "h-[40px]" })}
          </div>
          {/* East Column: Plots 53, 54, 55, 56, 57, 58 */}
          <div className="w-[64px] flex flex-col">
            {renderPlot({ number: 53, sqYards: 306, topDim: "50'", rightDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 54, sqYards: 183, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 55, sqYards: 183, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 56, sqYards: 183, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 57, sqYards: 183, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 58, sqYards: 314, rightDim: "56'-9\"", bottomDim: "56'-9\"", className: "h-[40px]" })}
          </div>
        </div>

        {/* Road 2 Bottom: PROPOSED 33'-0" WIDE ROAD (Aligns with Top Road 2) */}
        <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 self-stretch min-h-[220px] border-x border-black/40">
          <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
            PROPOSED 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 7: West (Plots 64..59) | East (Plots 65..70) = Exact 128px width! */}
        <div className="w-[128px] flex flex-shrink-0">
          {/* West Column: Plots 64, 63, 62, 61, 60, 59 */}
          <div className="w-[64px] flex flex-col">
            {renderPlot({ number: 64, sqYards: 306, topDim: "50'", leftDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 63, sqYards: 183, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 62, sqYards: 183, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 61, sqYards: 183, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 60, sqYards: 183, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 59, sqYards: 313, leftDim: "56'-3\"", bottomDim: "56'-3\"", className: "h-[42px]" })}
          </div>
          {/* East Column: Plots 65, 66, 67, 68, 69, 70 */}
          <div className="w-[64px] flex flex-col">
            {renderPlot({ number: 65, sqYards: 306, topDim: "50'", rightDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 66, sqYards: 183, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 67, sqYards: 183, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 68, sqYards: 183, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 69, sqYards: 183, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 70, sqYards: 314, rightDim: "56'-6\"", bottomDim: "56'-6\"", className: "h-[42px]" })}
          </div>
        </div>

        {/* Road 3 Bottom: PROPOSED 33'-0" WIDE ROAD (Aligns with Top Road 3) */}
        <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 self-stretch min-h-[220px] border-x border-black/40">
          <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
            PROPOSED 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 8: West (Plots 76..71) | East (Plots 77..82) = Exact 140px width! */}
        <div className="w-[140px] flex flex-shrink-0">
          {/* West Column: Plots 76, 75, 74, 73, 72, 71 */}
          <div className="w-[70px] flex flex-col">
            {renderPlot({ number: 76, sqYards: 336, topDim: "55'", leftDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 75, sqYards: 202, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 74, sqYards: 202, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 73, sqYards: 202, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 72, sqYards: 202, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 71, sqYards: 364, leftDim: "56'-9\"", rightDim: "63'", className: "h-[44px]" })}
          </div>
          {/* East Column: Plots 77, 78, 79, 80, 81, 82 */}
          <div className="w-[70px] flex flex-col">
            {renderPlot({ number: 77, sqYards: 336, topDim: "55'", rightDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 78, sqYards: 202, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 79, sqYards: 202, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 80, sqYards: 202, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 81, sqYards: 202, rightDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 82, sqYards: 405, rightDim: "59'-6\"", className: "h-[48px]" })}
          </div>
        </div>

        {/* Road 4 Bottom: PROPOSED 33'-0" WIDE ROAD (Aligns with Top Road 4) */}
        <div className="w-[32px] bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 self-stretch min-h-[220px] border-x border-black/40">
          <span className="rotate-90 text-[7.5px] tracking-widest text-white font-mono font-bold uppercase whitespace-nowrap">
            PROPOSED 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 9: West (Plots 89..83) | East (Plots 90..96) = Exact 152px width! */}
        <div className="w-[152px] flex flex-shrink-0">
          {/* West Column: Plots 89, 88, 87, 86, 85, 84, 83 */}
          <div className="w-[70px] flex flex-col">
            {renderPlot({ number: 89, sqYards: 336, topDim: "55'", leftDim: "55'", className: "h-[34px]" })}
            {renderPlot({ number: 88, sqYards: 202, leftDim: "33'", className: "h-[26px]" })}
            {renderPlot({ number: 87, sqYards: 202, leftDim: "33'", className: "h-[26px]" })}
            {renderPlot({ number: 86, sqYards: 202, leftDim: "33'", className: "h-[26px]" })}
            {renderPlot({ number: 85, sqYards: 202, leftDim: "33'", className: "h-[26px]" })}
            {renderPlot({ number: 84, sqYards: 202, leftDim: "33'", className: "h-[26px]" })}
            {renderPlot({ number: 83, sqYards: 295, leftDim: "40'-6\"", topDim: "48'", bottomDim: "60'-6\"", className: "h-[38px]" })}
          </div>
          {/* East Column: Plots 90, 91, 92, 93, 94, 95, 96 */}
          <div className="w-[82px] flex flex-col">
            {renderPlot({ number: 90, sqYards: 395, topDim: "64'", rightDim: "55'", bottomDim: "52'-6\"", className: "h-[34px]" })}
            {renderPlot({ number: 91, sqYards: 241, rightDim: "33'", bottomDim: "53'-1\"", className: "h-[26px]" })}
            {renderPlot({ number: 92, sqYards: 245, rightDim: "33'", bottomDim: "53'-10\"", className: "h-[26px]" })}
            {renderPlot({ number: 93, sqYards: 248, rightDim: "33'", bottomDim: "54'-6\"", className: "h-[26px]" })}
            {renderPlot({ number: 94, sqYards: 251, rightDim: "33'", bottomDim: "55'-3\"", className: "h-[26px]" })}
            {renderPlot({ number: 95, sqYards: 254, rightDim: "33'", bottomDim: "55'-10\"", className: "h-[26px]" })}
            {renderPlot({ number: 96, sqYards: 372, leftDim: "48'", rightDim: "55'-3\"", bottomDim: "65'-3\"", className: "h-[38px]" })}
          </div>
        </div>

        {/* Road 5 Bottom: Far Right Road */}
        <div className="w-[32px] bg-[#1e1e1e] flex flex-col items-center justify-around py-4 flex-shrink-0 self-stretch min-h-[220px] border-l border-black/40">
          <span className="rotate-90 text-[7px] tracking-wider text-white font-mono uppercase whitespace-nowrap">
            NG 33'-0" WIDE ROAD
          </span>
          <span className="rotate-90 text-[7px] tracking-wider text-white font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

      </div>

    </div>
  );
}
