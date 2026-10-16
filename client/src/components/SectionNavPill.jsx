import React from 'react';
import { Home, Moon, Sparkles, MapPin, HelpCircle, Layers, Star, Calendar } from 'lucide-react';
import { useScrollProgress, useScrollSpy } from '../hooks/useScrollSpy';

const SECTIONS = [
  { id: 'projects', label: 'Prime Projects', icon: Layers },
  { id: 'about', label: 'About Us', icon: Home },
  { id: 'villas', label: 'Villas', icon: Sparkles },
  { id: 'lighting', label: 'Lighting', icon: Moon },
  { id: 'developments', label: 'On-Site Photos', icon: Sparkles },
  { id: 'amenities', label: 'Amenities', icon: Sparkles },
  { id: 'landmarks', label: 'Location Map', icon: MapPin },
  { id: 'testimonials', label: 'Reviews', icon: Star },
  { id: 'contact', label: 'Visit Office', icon: Calendar }
];

export default function SectionNavPill() {
  const { isScrolled } = useScrollProgress();
  const sectionIds = SECTIONS.map(s => s.id);
  const activeSection = useScrollSpy(sectionIds, 200);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 max-w-[95vw] sm:max-w-max ${
        isScrolled
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <nav
        aria-label="Section Quick Jump Navigation"
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-[#11141c]/90 hover:bg-[#11141c]/98 backdrop-blur-xl border border-slate-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-x-auto no-scrollbar"
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
                  ? 'bg-brand-orange text-white shadow-md shadow-orange-950/50 scale-105'
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
