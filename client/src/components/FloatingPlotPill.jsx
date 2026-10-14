import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowUpRight, Sparkles } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollSpy';

export default function FloatingPlotPill() {
  const { isScrolled } = useScrollProgress();

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-500 transform ${
        isScrolled
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-6 opacity-0 pointer-events-none'
      }`}
    >
      <Link
        to="/plots"
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-950 backdrop-blur-xl border border-orange-500/30 hover:border-orange-500 shadow-[0_8px_25px_rgba(241,90,36,0.25)] text-white text-xs font-bold transition-all duration-300 hover:scale-105"
      >
        {/* Pulsing Radar Ring Indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>

        <span className="flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5 text-orange-400 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">Explore 3D Master Plan</span>
        </span>

        <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-brand-orange text-white flex items-center justify-center transition-colors">
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </Link>
    </div>
  );
}
