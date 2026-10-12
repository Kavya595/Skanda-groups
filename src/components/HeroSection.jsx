import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2, Award, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white border-b border-[#E5E7EB]">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-white to-gray-50/50 pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#202124 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      {/* Animated glow orb */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#F58220]/10 blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Typography & Animated Accents */}
          <div className="lg:col-span-7 space-y-6 text-left animate-fade-in-up">
            {/* Trust Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5EC] border border-[#F58220]/30 text-xs font-bold text-[#F58220] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F58220] animate-spin" style={{ animationDuration: '6s' }} />
              <span>Premier Real Estate & Infrastructure Developers</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#202124] tracking-tight leading-[1.12]">
              Building Trust.{' '}
              <span className="text-[#F58220] block sm:inline">
                Creating Lasting Value.
              </span>
            </h1>

            {/* Supporting Corporate Copy */}
            <p className="text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-2xl font-normal">
              Skandha Groups crafts premium gated residential communities and plotted developments engineered with statutory approvals, authentic vasthu principles, and high-standard civic infrastructure.
            </p>

            {/* Trust Checkmarks with smooth hover */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#202124]">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50/50 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#F58220] flex-shrink-0" />
                <span className="font-semibold">100% Clear Titles</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50/50 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#F58220] flex-shrink-0" />
                <span className="font-semibold">Vasthu Compliant</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50/50 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#F58220] flex-shrink-0" />
                <span className="font-semibold">Spot Registration</span>
              </div>
            </div>

            {/* Primary & Secondary Call to Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white bg-[#F58220] hover:bg-[#E07016] shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <span>Explore Our Projects</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-[#202124] bg-white border border-[#E5E7EB] hover:border-[#F58220] hover:bg-[#FFF5EC]/30 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Contact Corporate Office</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase with Floating Animations */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual: Crisp High-Resolution Modern Architectural Villa */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 group">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                  alt="Skandha Groups Premium Architecture & Community Living"
                  className="w-full h-auto object-cover aspect-[4/3] sm:aspect-[1/1] group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Bottom Inset on Hero Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-300">
                    Skandha Development Standard
                  </span>
                  <h3 className="text-lg font-bold">Masterplanned Living Environments</h3>
                  <p className="text-xs text-gray-200">Engineered for long-term family value & appreciation</p>
                </div>
              </div>

              {/* Floating Top Badge with Float Animation */}
              <div className="absolute -top-3 sm:-top-4 right-1 sm:-right-4 bg-white/95 backdrop-blur-md py-2 px-3 sm:py-3 sm:px-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 sm:gap-3 animate-float">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FFF5EC] flex items-center justify-center text-[#F58220] flex-shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] sm:text-xs font-bold text-[#202124]">Statutory Sanctioned</div>
                  <div className="text-[9px] sm:text-[10px] text-[#6B7280]">Clear Legal Due Diligence</div>
                </div>
              </div>

              {/* Floating Bottom Inset Card with Reverse Float Animation */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-gray-100 max-w-[220px] animate-float-reverse">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#202124]">100% Vasthu</div>
                    <div className="text-[11px] text-[#6B7280]">Harmonious Layouts</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
