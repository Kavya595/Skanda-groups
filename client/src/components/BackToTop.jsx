import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollSpy';

export default function BackToTop() {
  const { scrollProgress, isScrolled } = useScrollProgress();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-500 transform ${
        isScrolled
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-8 opacity-0 scale-75 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="group relative w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-950 backdrop-blur-md text-white flex items-center justify-center shadow-xl hover:shadow-orange-500/20 border border-slate-700/80 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
      >
        {/* SVG Circular Progress Gauge */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-slate-800/60"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-brand-orange transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        {/* Center Arrow with Hover Spring */}
        <ArrowUp className="w-4 h-4 text-slate-200 group-hover:text-brand-orange group-hover:-translate-y-0.5 transition-all duration-300 relative z-10" />

        {/* Micro-Tooltip */}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Top ({Math.round(scrollProgress)}%)
        </span>
      </button>
    </div>
  );
}
