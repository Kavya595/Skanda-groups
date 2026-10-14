import React from 'react';
import { Home, Moon, Sparkles, MapPin, HelpCircle, Layers } from 'lucide-react';
import { useScrollProgress, useScrollSpy } from '../hooks/useScrollSpy';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'villas', label: 'Villa Concepts', icon: Layers },
  { id: 'lighting', label: 'Twilight Lighting', icon: Moon },
  { id: 'amenities', label: 'Amenities', icon: Sparkles },
  { id: 'landmarks', label: 'Location & Map', icon: MapPin },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle }
];

export default function SectionNavPill() {
  const { isScrolled } = useScrollProgress();
  const sectionIds = SECTIONS.map(s => s.id);
  const activeSection = useScrollSpy(sectionIds, 200);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 max-w-[95vw] sm:max-w-max ${
        isScrolled
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <nav
        aria-label="Section Quick Jump Navigation"
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-x-auto no-scrollbar"
      >
        {SECTIONS.map((section) => {
          const IconComp = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-400'}`} />
              <span className="hidden sm:inline">{section.label}</span>
              <span className="sm:hidden">{section.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
