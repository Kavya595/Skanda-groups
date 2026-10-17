import React from 'react';
import { X, PhoneCall, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Exact Plot Dimension Specifications from Sanctioned DTCP Blueprint
 */
export const PLOT_SPECS = {
  // Block 1 (North)
  29: { sqYards: 264, topDim: "50'-1\"", leftDim: "48'", rightDim: "47'" },
  30: { sqYards: 183, leftDim: "33'", rightDim: "33'" },
  31: { sqYards: 183, leftDim: "33'", rightDim: "33'" },
  32: { sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'" },
  25: { sqYards: 259, topDim: "50'-1\"", leftDim: "46'-3\"", rightDim: "33'" },
  26: { sqYards: 183, leftDim: "33'", rightDim: "33'" },
  27: { sqYards: 183, leftDim: "33'", rightDim: "33'" },
  28: { sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'" },

  // Block 2 (North)
  24: { sqYards: 249, topDim: "50'-1\"", leftDim: "45'-3\"", rightDim: "44'-3\"" },
  23: { sqYards: 183, leftDim: "33'", rightDim: "33'" },
  22: { sqYards: 183, leftDim: "33'", rightDim: "33'" },
  21: { sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'" },
  17: { sqYards: 242, topDim: "50'-1\"", leftDim: "43'", rightDim: "33'" },
  18: { sqYards: 183, leftDim: "33'", rightDim: "33'" },
  19: { sqYards: 183, leftDim: "33'", rightDim: "33'" },
  20: { sqYards: 306, leftDim: "55'", rightDim: "55'", bottomDim: "50'" },

  // Block 3 (North)
  16: { sqYards: 256, topDim: "55'-1\"", leftDim: "42'-6\"", rightDim: "41'-3\"" },
  15: { sqYards: 202, leftDim: "33'", rightDim: "33'" },
  14: { sqYards: 202, leftDim: "33'", rightDim: "33'" },
  13: { sqYards: 336, leftDim: "55'", rightDim: "55'", bottomDim: "55'" },
  9:  { sqYards: 248, topDim: "55'-1\"", leftDim: "39'-9\"", rightDim: "33'" },
  10: { sqYards: 202, leftDim: "33'", rightDim: "33'" },
  11: { sqYards: 202, leftDim: "33'", rightDim: "33'" },
  12: { sqYards: 336, leftDim: "55'", rightDim: "55'", bottomDim: "55'" },

  // Block 4 (North)
  8: { sqYards: 237, topDim: "55'-1\"", leftDim: "39'-3\"", rightDim: "38'-3\"" },
  7: { sqYards: 202, leftDim: "33'", rightDim: "33'" },
  6: { sqYards: 202, leftDim: "33'", rightDim: "33'" },
  5: { sqYards: 336, leftDim: "55'", rightDim: "55'", bottomDim: "55'" },
  1: { sqYards: 246, topDim: "58'-3\"", leftDim: "37'-3\"", rightDim: "33'" },
  2: { sqYards: 219, rightDim: "33'", bottomDim: "59'-3\"" },
  3: { sqYards: 223, rightDim: "33'", bottomDim: "60'-3\"" },
  4: { sqYards: 380, rightDim: "55'", bottomDim: "61'-3\"" },

  // Left Strip (South)
  33: { sqYards: 362, topDim: "58'-9\"", rightDim: "55'" },
  34: { sqYards: 220, topDim: "59'-9\"", rightDim: "33'" },
  35: { sqYards: 222, topDim: "60'-3\"", rightDim: "33'" },
  36: { sqYards: 393, topDim: "60'-9\"", rightDim: "60'-9\"" },

  // Block 5 (South)
  41: { sqYards: 336, topDim: "55'", leftDim: "55'" },
  40: { sqYards: 202, leftDim: "33'" },
  39: { sqYards: 202, leftDim: "33'" },
  38: { sqYards: 202, leftDim: "33'" },
  37: { sqYards: 309, leftDim: "42'-9\"", bottomDim: "58'-3\"" },
  42: { sqYards: 336, topDim: "55'", rightDim: "55'" },
  43: { sqYards: 202, rightDim: "33'" },
  44: { sqYards: 202, rightDim: "33'" },
  45: { sqYards: 202, rightDim: "33'" },
  46: { sqYards: 403, rightDim: "73'-9\"" },

  // Block 6 (South)
  52: { sqYards: 306, topDim: "50'", leftDim: "55'" },
  51: { sqYards: 183, leftDim: "33'" },
  50: { sqYards: 183, leftDim: "33'" },
  49: { sqYards: 183, leftDim: "33'" },
  48: { sqYards: 183, leftDim: "33'" },
  47: { sqYards: 306, leftDim: "50'" },
  53: { sqYards: 306, topDim: "50'", rightDim: "55'" },
  54: { sqYards: 183, rightDim: "33'" },
  55: { sqYards: 183, rightDim: "33'" },
  56: { sqYards: 183, rightDim: "33'" },
  57: { sqYards: 183, rightDim: "33'" },
  58: { sqYards: 314, rightDim: "56'-9\"" },

  // Block 7 (South)
  64: { sqYards: 306, topDim: "50'", leftDim: "55'" },
  63: { sqYards: 183, leftDim: "33'" },
  62: { sqYards: 183, leftDim: "33'" },
  61: { sqYards: 183, leftDim: "33'" },
  60: { sqYards: 183, leftDim: "33'" },
  59: { sqYards: 313, leftDim: "56'-3\"" },
  65: { sqYards: 306, topDim: "50'", rightDim: "55'" },
  66: { sqYards: 183, rightDim: "33'" },
  67: { sqYards: 183, rightDim: "33'" },
  68: { sqYards: 183, rightDim: "33'" },
  69: { sqYards: 183, rightDim: "33'" },
  70: { sqYards: 314, rightDim: "56'-6\"" },

  // Block 8 (South)
  76: { sqYards: 336, topDim: "55'", leftDim: "55'" },
  75: { sqYards: 202, leftDim: "33'" },
  74: { sqYards: 202, leftDim: "33'" },
  73: { sqYards: 202, leftDim: "33'" },
  72: { sqYards: 202, leftDim: "33'" },
  71: { sqYards: 364, leftDim: "56'-9\"", rightDim: "63'" },
  77: { sqYards: 336, topDim: "55'", rightDim: "55'" },
  78: { sqYards: 202, rightDim: "33'" },
  79: { sqYards: 202, rightDim: "33'" },
  80: { sqYards: 202, rightDim: "33'" },
  81: { sqYards: 202, rightDim: "33'" },
  82: { sqYards: 405, rightDim: "59'-6\"" },

  // Block 9 (Highway East)
  89: { sqYards: 336, topDim: "55'", leftDim: "55'" },
  88: { sqYards: 202, leftDim: "33'" },
  87: { sqYards: 202, leftDim: "33'" },
  86: { sqYards: 202, leftDim: "33'" },
  85: { sqYards: 202, leftDim: "33'" },
  84: { sqYards: 202, leftDim: "33'" },
  83: { sqYards: 295, leftDim: "40'-6\"", bottomDim: "60'-6\"" },
  90: { sqYards: 395, topDim: "64'", rightDim: "55'", bottomDim: "52'-6\"" },
  91: { sqYards: 241, rightDim: "33'", bottomDim: "53'-1\"" },
  92: { sqYards: 245, rightDim: "33'", bottomDim: "53'-10\"" },
  93: { sqYards: 248, rightDim: "33'", bottomDim: "54'-6\"" },
  94: { sqYards: 251, rightDim: "33'", bottomDim: "55'-3\"" },
  95: { sqYards: 254, rightDim: "33'", bottomDim: "55'-10\"" },
  96: { sqYards: 372, rightDim: "55'-3\"", bottomDim: "65'-3\"" }
};

/**
 * PlotSpecificationsModal
 * Exact replica of the dark theme specification card from user reference media_1791875506927_fd159ece.png
 */
export default function PlotSpecificationsModal({ plot, onClose, onEnquire }) {
  if (!plot) return null;

  const spec = PLOT_SPECS[plot.number] || {};
  const sqYards = plot.sqYards || spec.sqYards || 202;
  const sqFeet = sqYards * 9;
  const price = sqYards * 12500;

  // Format plot size / dimensions
  let plotDimensions = plot.dimensions || '';
  if (!plotDimensions && (spec.topDim || spec.leftDim)) {
    plotDimensions = `${spec.topDim || "33'"} × ${spec.leftDim || "55'"} FT`;
  }
  if (!plotDimensions) {
    plotDimensions = "33' × 55' FT";
  }

  const isAvailable = plot.status === 'available';
  const isBooked = plot.status === 'booked';
  const isSold = plot.status === 'sold';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[420px] bg-[#0c1427]/98 backdrop-blur-xl rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-left relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Plot #${plot.number} Specifications`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-700/60">
          <div>
            <h3 className="text-xl font-black text-white tracking-wide font-sans">
              Plot Specifications
            </h3>
            <p className="text-xs font-mono font-bold text-sky-400 mt-1 uppercase tracking-wider">
              PLOT CODE: SKANDHA-PLT-{plot.number}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-600/50 shadow-sm"
            aria-label="Close specifications dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status & Template Badges */}
        <div className="flex items-center gap-2.5 my-3.5">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700">
            <span className={`w-2.5 h-2.5 rounded-full ${
              isAvailable ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' :
              isBooked ? 'bg-[#2563eb] shadow-[0_0_8px_#2563eb]' : 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]'
            }`} />
            <span className={`text-xs font-black uppercase tracking-wider ${
              isAvailable ? 'text-emerald-400' :
              isBooked ? 'text-blue-400' : 'text-red-400'
            }`}>
              {plot.status}
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
            RESIDENTIAL
          </span>
        </div>

        {/* Specifications Grid */}
        <div className="space-y-3 py-2 text-sm border-t border-b border-slate-700/60 my-3">
          {/* Row 1: Plot ID & Plot Size */}
          <div className="grid grid-cols-2 gap-4 pb-2.5 border-b border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Plot ID</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {plot.number}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Plot Size</span>
              <span className="text-base font-extrabold text-white mt-0.5 block font-mono">
                {plotDimensions}
              </span>
            </div>
          </div>

          {/* Row 2: Area Size & Facing */}
          <div className="grid grid-cols-2 gap-4 pb-2.5 border-b border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Area Size</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {sqFeet.toLocaleString()} SQ FT
              </span>
              <span className="text-[11px] text-slate-400 block">({sqYards} Sq.Yds)</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Facing</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {plot.facing || 'East'}
              </span>
            </div>
          </div>

          {/* Row 3: Road Width & DTCP Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Road Width</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {plot.roadWidth || "33 FT"}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Approval</span>
              <span className="text-xs font-extrabold text-amber-400 mt-1 block">
                DTCP &amp; TS RERA
              </span>
            </div>
          </div>
        </div>

        {/* Price Highlight */}
        <div className="flex items-center justify-between py-2 pt-1">
          <span className="text-sm font-bold text-slate-300">Price</span>
          <span className="text-xl font-black text-[#10b981] tracking-tight">
            Rs. {price.toLocaleString()}
          </span>
        </div>

        {/* CTA Button */}
        <div className="mt-4 pt-2">
          {isAvailable ? (
            <button
              type="button"
              onClick={() => {
                if (onEnquire) onEnquire(plot);
              }}
              className="w-full py-3 px-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer text-center text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enquire &amp; Book Plot</span>
            </button>
          ) : isBooked ? (
            <button
              type="button"
              onClick={() => {
                if (onEnquire) onEnquire(plot);
              }}
              className="w-full py-3 px-4 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-950/40 transition-all cursor-pointer text-center text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Waitlist / Inquire Booked Plot</span>
            </button>
          ) : (
            <div className="w-full py-3 px-4 rounded-xl font-bold text-slate-400 bg-slate-800/80 border border-slate-700 text-center text-xs uppercase tracking-wider">
              Plot Registered &amp; Sold Out Deed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
