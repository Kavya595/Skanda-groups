import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import CallToAction from '../components/CallToAction';
import PlotModal from '../components/PlotModal';
import { usePlotContext } from '../context/PlotContext';
import { PROJECTS_DATA } from '../data/projects';
import { Building2 } from 'lucide-react';

export default function Projects() {
  const [showPlotModal, setShowPlotModal] = useState(false);
  const { projects } = usePlotContext();
  const alekyaProject = projects?.[0] || PROJECTS_DATA[0];

  return (
    <div className="bg-white">
      {/* 1. Page Hero Banner */}
      <section className="bg-gradient-to-b from-[#FFF5EC] to-white py-16 lg:py-20 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F58220]/30 text-xs font-bold text-[#F58220] uppercase tracking-wider mb-4 shadow-sm">
            <Building2 className="w-4 h-4 text-[#F58220]" />
            <span>Skandha Groups Residential Developments</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#202124] tracking-tight leading-tight">
            Our Flagship Project
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] mt-4 leading-relaxed">
            Discover our premier gated community plotted layout, engineered with complete statutory sanctions, vasthu-compliant masterplanning, and immediate spot registration.
          </p>
        </div>
      </section>

      {/* 2. Main Project Section: Featuring Alekya */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <ProjectCard
              project={alekyaProject}
              onViewPlots={() => setShowPlotModal(true)}
            />
          </div>
        </div>
      </section>

      {/* 3. Interactive 2D & 3D Plot Layout Viewer Modal */}
      <PlotModal 
        isOpen={showPlotModal} 
        onClose={() => setShowPlotModal(false)} 
        project={alekyaProject} 
      />

      {/* 4. Call to Action */}
      <CallToAction 
        title="Interested in Owning a Plot at Skandha Grand Valley?"
        subtitle="Schedule a complimentary site visit with our sales advisors. Free vehicle transport arranged from our Hastinapuram office."
      />
    </div>
  );
}
