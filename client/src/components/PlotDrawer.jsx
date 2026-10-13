import React from 'react';
import { X, CheckCircle2, AlertCircle, Compass, Shield, Tag, Info } from 'lucide-react';
import { statusColors } from '../visualizer/layoutData';

export default function PlotDrawer({ plot, isOpen, onClose, onEnquire }) {
  if (!isOpen || !plot) return null;

  const statusMeta = statusColors[plot.status] || statusColors.available;
  const isAvailable = plot.status === 'available';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Plot Specification
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${statusMeta.badge}`}>
                  {statusMeta.label}
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                Plot #{plot.plotNumber}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              aria-label="Close plot drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-100">
                <div className="text-xs font-semibold text-slate-500">Area (Sq. Yards)</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {plot.areaSqYds} <span className="text-xs font-normal text-slate-600">Sq.Yds</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  &asymp; {plot.areaSqFt || plot.areaSqYds * 9} Sq.Ft
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Facing Direction</div>
                <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-brand-orange" />
                  <span>{plot.facing}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  100% Vasthu Compliant
                </div>
              </div>
            </div>

            {/* Dimensional Specifications */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Source Dimensions (Brochure Plan)
              </h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-slate-500">Dimensions:</div>
                <div className="font-semibold text-slate-900 text-right">{plot.dimensions}</div>

                <div className="text-slate-500">Road Width:</div>
                <div className="font-semibold text-slate-900 text-right">{plot.roadWidth || "33'-0\""}</div>

                <div className="text-slate-500">Corner Plot:</div>
                <div className="font-semibold text-slate-900 text-right">
                  {plot.isCorner ? (
                    <span className="text-brand-orange font-bold">Yes (Corner Premium)</span>
                  ) : (
                    'Standard Regular'
                  )}
                </div>

                <div className="text-slate-500">Approval Status:</div>
                <div className="font-semibold text-emerald-700 text-right">DTCP Approved</div>
              </div>
            </div>

            {/* Extra Charges Breakdown (Brochure Page 2 Table) */}
            {plot.extraChargesBreakdown && plot.extraChargesBreakdown.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  <span>Extra Charges Applicable</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {plot.extraChargesBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>{item.label}</span>
                      <strong className="text-amber-900">+ Rs. {item.rate}/- per Sq.Yd</strong>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-amber-200 flex justify-between font-bold text-amber-950">
                    <span>Total Extra Charge:</span>
                    <span>Rs. {plot.extraChargesPerSqYd}/- per Sq.Yd</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Transparency Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-brand-orange" />
                <span>Price & Availability Notice</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Base price per sq.yd is indicative and subject to executive confirmation. To prevent outdated claims, spot registration pricing, payment schedules, and exact legal documentation are provided upon direct enquiry.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-slate-100 bg-white space-y-3">
            <button
              onClick={() => onEnquire(plot)}
              disabled={plot.status === 'sold'}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-sm shadow transition-all duration-200"
            >
              {plot.status === 'sold' ? (
                <span>Plot Already Sold Out</span>
              ) : (
                <span>Enquire for Plot #{plot.plotNumber}</span>
              )}
            </button>
            <div className="text-[11px] text-center text-slate-400">
              DTCP TLP NO. 87/2024/H | TS RERA PO2400009081
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
