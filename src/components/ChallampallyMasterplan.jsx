import React from 'react';
import { Trees } from 'lucide-react';

/**
 * ChallampallyMasterplan
 * Pixel-accurate, authentic DTCP masterplan rendering of CHALLAMPALLY / ALEKYA BRUNDAVANAM
 * Derived directly from the official sanctioned layout drawing (Plots 1 to 96).
 * 
 * Features:
 * - Every plot features exact boundary dimensions on its perimeter.
 * - Center circular badge displays Plot Number and Square Yards.
 * - Dynamic color coding: Green (#10b981) for Available, Blue (#2563eb) for Booked, Red (#ef4444) for Sold.
 * - Clicking any plot triggers onSelectPlot to inspect complete plot details.
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
    className = "h-[46px]",
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

    // Color configurations: Available (Green), Booked (Blue), Sold (Red)
    let fillBg = '#dcfce7'; // Soft emerald
    let borderColor = '#16a34a';
    let circleBg = '#10b981';
    let circleBorder = '#047857';
    let textColor = '#065f46';
    let numColor = '#ffffff';

    if (plot.status === 'booked') {
      fillBg = '#dbeafe'; // Soft blue
      borderColor = '#2563eb';
      circleBg = '#2563eb';
      circleBorder = '#1d4ed8';
      textColor = '#1e40af';
      numColor = '#ffffff';
    } else if (plot.status === 'sold') {
      fillBg = '#fee2e2'; // Soft red
      borderColor = '#dc2626';
      circleBg = '#ef4444';
      circleBorder = '#b91c1c';
      textColor = '#991b1b';
      numColor = '#ffffff';
    }

    const opacity = isMatched ? 1 : 0.25;

    return (
      <button
        key={number}
        type="button"
        onClick={() => onSelectPlot(plot)}
        style={{
          backgroundColor: fillBg,
          borderColor: isSelected ? '#F58220' : borderColor,
          opacity,
          ...extraStyle
        }}
        className={`relative border flex flex-col items-center justify-center p-0.5 select-none transition-all duration-150 cursor-pointer group ${className} ${
          isSelected 
            ? 'ring-3 ring-[#F58220] ring-offset-2 ring-offset-black z-30 scale-105 shadow-xl' 
            : 'hover:scale-102 hover:z-20 hover:shadow-md'
        }`}
        title={`Plot #${number} • ${sqYards} Sq.Yds (${plot.status.toUpperCase()})`}
      >
        {/* Top Dimension */}
        {topDim && (
          <span className="absolute top-0.5 inset-x-0 text-[8px] font-mono font-bold leading-none text-center text-gray-800 pointer-events-none truncate px-0.5">
            {topDim}
          </span>
        )}

        {/* Left Dimension */}
        {leftDim && (
          <span className="absolute left-0.5 inset-y-0 flex items-center text-[7.5px] font-mono font-bold leading-none text-gray-800 pointer-events-none">
            {leftDim}
          </span>
        )}

        {/* Center Circular Badge (Plot Number on top, Square Yards on bottom) */}
        <div 
          style={{
            backgroundColor: circleBg,
            borderColor: circleBorder
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex flex-col items-center justify-center shadow-xs z-10 transition-transform group-hover:scale-110"
        >
          <span 
            style={{ color: numColor }}
            className="text-[10px] sm:text-[11px] font-black leading-none drop-shadow-xs"
          >
            {number}
          </span>
          <span 
            style={{ color: numColor }}
            className="text-[7px] sm:text-[8px] font-bold leading-none opacity-95"
          >
            {sqYards}
          </span>
        </div>

        {/* Right Dimension */}
        {rightDim && (
          <span className="absolute right-0.5 inset-y-0 flex items-center text-[7.5px] font-mono font-bold leading-none text-gray-800 pointer-events-none">
            {rightDim}
          </span>
        )}

        {/* Bottom Dimension */}
        {bottomDim && (
          <span className="absolute bottom-0.5 inset-x-0 text-[8px] font-mono font-bold leading-none text-center text-gray-800 pointer-events-none truncate px-0.5">
            {bottomDim}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-[1160px] bg-[#0c0d10] border-4 border-[#1f2937] rounded-3xl p-5 shadow-2xl relative text-left text-white select-none">
      
      {/* 1. TOP TITLE BANNER (Exact text from drawing: CHALLAMPALLY / ALEKYA BRUNDAVANAM) */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#F58220] animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-sans">
            CHALLAMPALLY / ALEKYA BRUNDAVANAM
          </h2>
        </div>
        <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-3.5 py-1 rounded-xl text-xs font-black tracking-widest uppercase">
          PROP. 60'-0" WIDE ROAD
        </div>
      </div>

      {/* 2. TOP BLOCKS ROW (Open Park + Blocks 1, 2, 3, 4) */}
      <div className="flex gap-2.5 items-stretch mb-3">
        
        {/* PARK AREA (SITE RESERVED FOR OPEN SPACE) */}
        <div className="w-[276px] bg-gradient-to-b from-[#122818] via-[#1a3821] to-[#0d1d12] border-2 border-emerald-500 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />

          {/* Top dimension: 209'-9" */}
          <div className="relative z-10 text-center text-[10px] font-mono font-extrabold text-emerald-300 drop-shadow">
            209'-9"
          </div>

          {/* Center Park Content */}
          <div className="relative z-10 text-center py-2 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/80 text-[10px] font-black text-emerald-300 uppercase tracking-wider shadow">
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              <span>SITE RESERVED FOR OPEN SPACE</span>
            </div>
            <div className="text-sm font-black text-white drop-shadow-md">
              (PARK)
            </div>
            <div className="text-xs font-black text-emerald-400 drop-shadow">
              Landscaped Park
            </div>
            <div className="text-[9px] text-gray-300">
              Children's Play Park, Green Lawns & Jogging Track
            </div>
          </div>

          {/* Bottom & Side dimensions: 201'-6" & 169'-3" */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono font-extrabold text-emerald-300 pt-1 border-t border-emerald-500/40">
            <span>201'-6"</span>
            <span>169'-3"</span>
          </div>
        </div>

        {/* Vertical B.T. Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-gray-400 font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 1: Left (29..32) | Right (25..28) */}
        <div className="w-[156px] flex gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm">
          {/* West Column: Plots 29, 30, 31, 32 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 29, sqYards: 264, topDim: "50'-1\"", leftDim: "48'", rightDim: "47'", className: "h-[48px]" })}
            {renderPlot({ number: 30, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 31, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 32, sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'", className: "h-[50px]" })}
          </div>
          {/* East Column: Plots 25, 26, 27, 28 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 25, sqYards: 259, topDim: "50'-1\"", leftDim: "46'-3\"", rightDim: "33'", className: "h-[48px]" })}
            {renderPlot({ number: 26, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 27, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 28, sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'", className: "h-[50px]" })}
          </div>
        </div>

        {/* Vertical B.T. Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-gray-400 font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 2: Left (24..21) | Right (17..20) */}
        <div className="w-[156px] flex gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm">
          {/* West Column: Plots 24, 23, 22, 21 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 24, sqYards: 249, topDim: "50'-1\"", leftDim: "45'-3\"", rightDim: "44'-3\"", className: "h-[48px]" })}
            {renderPlot({ number: 23, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 22, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 21, sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'", className: "h-[50px]" })}
          </div>
          {/* East Column: Plots 17, 18, 19, 20 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 17, sqYards: 242, topDim: "50'-1\"", leftDim: "43'", rightDim: "33'", className: "h-[48px]" })}
            {renderPlot({ number: 18, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 19, sqYards: 183, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 20, sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'", className: "h-[50px]" })}
          </div>
        </div>

        {/* Vertical B.T. Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-gray-400 font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 3: Left (16..13) | Right (9..12) */}
        <div className="w-[156px] flex gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm">
          {/* West Column: Plots 16, 15, 14, 13 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 16, sqYards: 256, topDim: "55'-1\"", leftDim: "42'-6\"", rightDim: "41'-3\"", className: "h-[48px]" })}
            {renderPlot({ number: 15, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 14, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 13, sqYards: 336, leftDim: "55'", rightDim: "55'", bottomDim: "55'", className: "h-[50px]" })}
          </div>
          {/* East Column: Plots 9, 10, 11, 12 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 9, sqYards: 248, topDim: "55'-1\"", leftDim: "39'-9\"", rightDim: "33'", className: "h-[48px]" })}
            {renderPlot({ number: 10, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 11, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 12, sqYards: 336, leftDim: "55'", rightDim: "55'", bottomDim: "55'", className: "h-[50px]" })}
          </div>
        </div>

        {/* Vertical B.T. Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-gray-400 font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 4: Left (8..5) | Right (1..4) */}
        <div className="w-[156px] flex gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm">
          {/* West Column: Plots 8, 7, 6, 5 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 8, sqYards: 237, topDim: "55'-1\"", leftDim: "39'-3\"", rightDim: "38'-3\"", className: "h-[48px]" })}
            {renderPlot({ number: 7, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 6, sqYards: 202, leftDim: "33'", rightDim: "33'", className: "h-[40px]" })}
            {renderPlot({ number: 5, sqYards: 336, leftDim: "55'", rightDim: "55'", bottomDim: "55'", className: "h-[50px]" })}
          </div>
          {/* East Column: Plots 1, 2, 3, 4 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 1, sqYards: 246, topDim: "58'-3\"", leftDim: "37'-3\"", rightDim: "33'", className: "h-[48px]" })}
            {renderPlot({ number: 2, sqYards: 219, rightDim: "33'", bottomDim: "59'-3\"", className: "h-[40px]" })}
            {renderPlot({ number: 3, sqYards: 223, rightDim: "33'", bottomDim: "60'-3\"", className: "h-[40px]" })}
            {renderPlot({ number: 4, sqYards: 380, rightDim: "55'", bottomDim: "61'-3\"", className: "h-[50px]" })}
          </div>
        </div>

        {/* Far Right Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-amber-400 font-mono font-bold uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

      </div>

      {/* 3. CENTRAL HORIZONTAL ROAD (PROPOSED 33'-0" WIDE ROAD) */}
      <div className="bg-[#14161f] border-y-2 border-gray-700 py-2.5 px-6 mb-3 flex items-center justify-between text-xs font-mono font-black tracking-widest text-gray-200">
        <span>PROPOSED 33'-0" WIDE ROAD</span>
        <span className="text-[#F58220]">CENTRAL AVENUE</span>
        <span>PROPOSED 33'-0" WIDE ROAD</span>
      </div>

      {/* 4. BOTTOM BLOCKS ROW (Strip + Blocks 5, 6, 7, 8, 9) */}
      <div className="flex gap-2.5 items-stretch">
        
        {/* LEFT STRIP: Plots 33, 34, 35, 36 */}
        <div className="w-[78px] flex flex-col gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm">
          {renderPlot({ number: 33, sqYards: 362, topDim: "58'-9\"", rightDim: "55'", className: "h-[48px]" })}
          {renderPlot({ number: 34, sqYards: 220, topDim: "59'-9\"", rightDim: "33'", className: "h-[36px]" })}
          {renderPlot({ number: 35, sqYards: 222, topDim: "60'-3\"", rightDim: "33'", className: "h-[36px]" })}
          {renderPlot({ number: 36, sqYards: 393, topDim: "60'-9\"", rightDim: "60'-9\"", className: "h-[54px]" })}
        </div>

        {/* Vertical B.T. Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-gray-400 font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 5: Left (41..37) | Right (42..46) */}
        <div className="w-[156px] flex flex-col justify-between">
          <div className="flex gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm">
            {/* West Column: Plots 41, 40, 39, 38, 37 */}
            <div className="flex-1 flex flex-col gap-1">
              {renderPlot({ number: 41, sqYards: 336, topDim: "55'", leftDim: "55'", className: "h-[42px]" })}
              {renderPlot({ number: 40, sqYards: 202, leftDim: "33'", className: "h-[32px]" })}
              {renderPlot({ number: 39, sqYards: 202, leftDim: "33'", className: "h-[32px]" })}
              {renderPlot({ number: 38, sqYards: 202, leftDim: "33'", className: "h-[32px]" })}
              {renderPlot({ number: 37, sqYards: 309, leftDim: "42'-9\"", bottomDim: "58'-3\"", className: "h-[46px]" })}
            </div>
            {/* East Column: Plots 42, 43, 44, 45, 46 */}
            <div className="flex-1 flex flex-col gap-1">
              {renderPlot({ number: 42, sqYards: 336, topDim: "55'", rightDim: "55'", className: "h-[42px]" })}
              {renderPlot({ number: 43, sqYards: 202, rightDim: "33'", className: "h-[32px]" })}
              {renderPlot({ number: 44, sqYards: 202, rightDim: "33'", className: "h-[32px]" })}
              {renderPlot({ number: 45, sqYards: 202, rightDim: "33'", className: "h-[32px]" })}
              {renderPlot({ number: 46, sqYards: 403, rightDim: "73'-9\"", className: "h-[46px]" })}
            </div>
          </div>
          <div className="text-center text-xs font-bold text-gray-500 py-1.5">
            4th Phase
          </div>
        </div>

        {/* Vertical B.T. Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-gray-400 font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 6: Left (52..47) | Right (53..58) */}
        <div className="w-[156px] flex gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm self-start">
          {/* West Column: Plots 52, 51, 50, 49, 48, 47 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 52, sqYards: 306, topDim: "50'", leftDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 51, sqYards: 183, leftDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 50, sqYards: 183, leftDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 49, sqYards: 183, leftDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 48, sqYards: 183, leftDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 47, sqYards: 306, leftDim: "50'", className: "h-[38px]" })}
          </div>
          {/* East Column: Plots 53, 54, 55, 56, 57, 58 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 53, sqYards: 306, topDim: "50'", rightDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 54, sqYards: 183, rightDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 55, sqYards: 183, rightDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 56, sqYards: 183, rightDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 57, sqYards: 183, rightDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 58, sqYards: 314, rightDim: "56'-9\"", className: "h-[38px]" })}
          </div>
        </div>

        {/* Vertical B.T. Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-gray-400 font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 7: Left (64..59) | Right (65..70) */}
        <div className="w-[156px] flex gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm self-start">
          {/* West Column: Plots 64, 63, 62, 61, 60, 59 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 64, sqYards: 306, topDim: "50'", leftDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 63, sqYards: 183, leftDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 62, sqYards: 183, leftDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 61, sqYards: 183, leftDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 60, sqYards: 183, leftDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 59, sqYards: 313, leftDim: "56'-3\"", className: "h-[38px]" })}
          </div>
          {/* East Column: Plots 65, 66, 67, 68, 69, 70 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 65, sqYards: 306, topDim: "50'", rightDim: "55'", className: "h-[38px]" })}
            {renderPlot({ number: 66, sqYards: 183, rightDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 67, sqYards: 183, rightDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 68, sqYards: 183, rightDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 69, sqYards: 183, rightDim: "33'", className: "h-[30px]" })}
            {renderPlot({ number: 70, sqYards: 314, rightDim: "56'-6\"", className: "h-[38px]" })}
          </div>
        </div>

        {/* Vertical B.T. Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-gray-400 font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 8: Left (76..71) | Right (77..82) */}
        <div className="w-[156px] flex flex-col justify-between">
          <div className="flex gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm">
            {/* West Column: Plots 76, 75, 74, 73, 72, 71 */}
            <div className="flex-1 flex flex-col gap-1">
              {renderPlot({ number: 76, sqYards: 336, topDim: "55'", leftDim: "55'", className: "h-[38px]" })}
              {renderPlot({ number: 75, sqYards: 202, leftDim: "33'", className: "h-[30px]" })}
              {renderPlot({ number: 74, sqYards: 202, leftDim: "33'", className: "h-[30px]" })}
              {renderPlot({ number: 73, sqYards: 202, leftDim: "33'", className: "h-[30px]" })}
              {renderPlot({ number: 72, sqYards: 202, leftDim: "33'", className: "h-[30px]" })}
              {renderPlot({ number: 71, sqYards: 364, leftDim: "56'-9\"", rightDim: "63'", className: "h-[38px]" })}
            </div>
            {/* East Column: Plots 77, 78, 79, 80, 81, 82 */}
            <div className="flex-1 flex flex-col gap-1">
              {renderPlot({ number: 77, sqYards: 336, topDim: "55'", rightDim: "55'", className: "h-[38px]" })}
              {renderPlot({ number: 78, sqYards: 202, rightDim: "33'", className: "h-[30px]" })}
              {renderPlot({ number: 79, sqYards: 202, rightDim: "33'", className: "h-[30px]" })}
              {renderPlot({ number: 80, sqYards: 202, rightDim: "33'", className: "h-[30px]" })}
              {renderPlot({ number: 81, sqYards: 202, rightDim: "33'", className: "h-[30px]" })}
              {renderPlot({ number: 82, sqYards: 405, rightDim: "59'-6\"", className: "h-[38px]" })}
            </div>
          </div>
          <div className="text-center text-xs font-bold text-gray-500 py-1.5">
            4th Phase
          </div>
        </div>

        {/* Vertical B.T. Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-gray-400 font-mono uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

        {/* BLOCK 9: Left (89..83) | Right (90..96) */}
        <div className="w-[156px] flex gap-1 bg-[#14161d] p-1.5 rounded-2xl border border-gray-800 shadow-sm self-start">
          {/* West Column: Plots 89, 88, 87, 86, 85, 84, 83 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 89, sqYards: 336, topDim: "55'", leftDim: "55'", className: "h-[34px]" })}
            {renderPlot({ number: 88, sqYards: 202, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 87, sqYards: 202, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 86, sqYards: 202, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 85, sqYards: 202, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 84, sqYards: 202, leftDim: "33'", className: "h-[28px]" })}
            {renderPlot({ number: 83, sqYards: 295, leftDim: "40'-6\"", bottomDim: "60'-6\"", className: "h-[36px]" })}
          </div>
          {/* East Column: Plots 90, 91, 92, 93, 94, 95, 96 */}
          <div className="flex-1 flex flex-col gap-1">
            {renderPlot({ number: 90, sqYards: 395, topDim: "64'", rightDim: "55'", bottomDim: "52'-6\"", className: "h-[34px]" })}
            {renderPlot({ number: 91, sqYards: 241, rightDim: "33'", bottomDim: "53'-1\"", className: "h-[28px]" })}
            {renderPlot({ number: 92, sqYards: 245, rightDim: "33'", bottomDim: "53'-10\"", className: "h-[28px]" })}
            {renderPlot({ number: 93, sqYards: 248, rightDim: "33'", bottomDim: "54'-6\"", className: "h-[28px]" })}
            {renderPlot({ number: 94, sqYards: 251, rightDim: "33'", bottomDim: "55'-3\"", className: "h-[28px]" })}
            {renderPlot({ number: 95, sqYards: 254, rightDim: "33'", bottomDim: "55'-10\"", className: "h-[28px]" })}
            {renderPlot({ number: 96, sqYards: 372, rightDim: "55'-3\"", bottomDim: "65'-3\"", className: "h-[36px]" })}
          </div>
        </div>

        {/* Far Right Road */}
        <div className="w-[34px] bg-[#1a1c23] rounded-xl flex items-center justify-center border border-gray-800 shadow-inner">
          <span className="rotate-90 text-[8px] tracking-widest text-amber-400 font-mono font-bold uppercase whitespace-nowrap">
            PROP. 33'-0" WIDE ROAD
          </span>
        </div>

      </div>

      {/* 5. FOOTER STATUTORY CLEARANCE BAR */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-amber-400 font-bold border border-gray-700">
            DTCP Approved: TLP NO. 87/2024/H
          </span>
          <span>TS RERA: PO2400009081 @ KADTHAL</span>
        </div>
        <div className="text-emerald-400 font-bold">
          100% Vasthu Compliant &bull; North & East Facing Villa Plots
        </div>
      </div>

    </div>
  );
}
