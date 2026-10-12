import React from 'react';
import GalleryGrid from '../components/GalleryGrid';
import CallToAction from '../components/CallToAction';
import { Camera } from 'lucide-react';

export default function Gallery() {
  return (
    <div className="bg-white">
      {/* 1. Page Hero Banner */}
      <section className="bg-gradient-to-b from-[#FFF5EC] to-white py-16 lg:py-20 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F58220]/30 text-xs font-bold text-[#F58220] uppercase tracking-wider mb-4 shadow-sm">
            <Camera className="w-4 h-4 text-[#F58220]" />
            <span>Architectural & Development Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#202124] tracking-tight leading-tight">
            Visual Portfolio of Skandha Living
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] mt-4 leading-relaxed">
            High-definition visual portfolio highlighting our luxury villa architectural concepts, landscaped open parks, children's recreational areas, wide blacktop boulevards, and community infrastructure.
          </p>
        </div>
      </section>

      {/* 2. Interactive Responsive Gallery Grid with 12 Crisp High-Res Images */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid showFilters={true} />
        </div>
      </section>

      {/* 3. Call To Action */}
      <CallToAction 
        title="Experience Skandha Groups Communities"
        subtitle="Speak with our relationship managers at our Hastinapuram office to learn more about our development standards and scheduled site trips."
      />
    </div>
  );
}
