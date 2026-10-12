import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { COMPANY_CONFIG } from '../config/company';

export default function CallToAction({
  title = "Ready to Build Your Legacy with Skandha Groups?",
  subtitle = "Connect with our advisory team at our Hastinapuram corporate office to discuss our development standards, upcoming corridors, and site visit schedules.",
  badge = "Skandha Groups Corporate Advisory"
}) {
  return (
    <section className="bg-gradient-to-br from-[#F58220] via-[#EA7412] to-[#D25E06] text-white py-18 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-inner">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 rounded-full bg-black/15 blur-3xl pointer-events-none" />
      
      {/* Geometric subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/15 text-white border border-white/25 text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-xs">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>{badge}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
          {title}
        </h2>

        <p className="text-base sm:text-lg text-orange-50 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-[#202124] bg-white hover:bg-orange-50 shadow-2xl hover:shadow-white/20 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer text-center"
          >
            <span>Schedule a Consultation</span>
            <ArrowRight className="w-5 h-5 text-[#F58220]" />
          </Link>

          <Link
            to="/projects"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-white bg-black/20 hover:bg-black/30 border border-white/30 backdrop-blur-sm transition-all duration-200 cursor-pointer text-center"
          >
            <span>Explore Masterplans &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
