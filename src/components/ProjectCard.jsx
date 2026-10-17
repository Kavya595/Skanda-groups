import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Download, ArrowRight, Grid3X3, Check } from 'lucide-react';

export default function ProjectCard({ project, onViewPlots }) {
  return (
    <article className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group max-w-2xl mx-auto text-left">
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={project.coverImage}
          alt={project.projectFullName || project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold shadow-md bg-[#F58220] text-white">
            {project.badge}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold shadow-md bg-black/60 text-white backdrop-blur-sm border border-white/20">
            DTCP: {project.dtcpNo}
          </span>
        </div>

        {/* Bottom Image Inset */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
          <span className="inline-flex items-center gap-1.5 drop-shadow font-medium">
            <MapPin className="w-4 h-4 text-[#F58220]" />
            <span>{project.location}</span>
          </span>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                Active Residential Venture
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#202124] group-hover:text-[#F58220] transition-colors mt-0.5">
                {(!project.name || project.name.includes('Alekya')) ? 'Skandha Grand Valley' : project.name}
              </h3>
              <p className="text-sm text-gray-500 font-semibold">
                {(!project.projectFullName || project.projectFullName.includes('Alekya')) ? 'Skandha Grand Valley' : project.projectFullName} &bull; {(!project.subTitle || project.subTitle.includes('Alekya')) ? 'Challampally, Kadthal' : project.subTitle}
              </p>
            </div>
            {project.brochureUrl && (
              <a
                href={project.brochureUrl}
                download
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#F58220] bg-orange-50 hover:orange-100 transition-colors"
                title="Download Official Brochure"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Brochure PDF</span>
              </a>
            )}
          </div>

          <p className="text-sm text-[#6B7280] mt-4 leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Key Layout Features */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-[#202124]">
            <div className="bg-[#F7F7F7] p-3 rounded-xl border border-gray-100">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">RERA Number</span>
              <span className="font-extrabold text-[#202124] truncate block mt-0.5">{project.reraNo}</span>
            </div>
            <div className="bg-[#F7F7F7] p-3 rounded-xl border border-gray-100">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Road Widths</span>
              <span className="font-extrabold text-[#202124] block mt-0.5">60', 40' & 33' B.T.</span>
            </div>
            <div className="bg-[#F7F7F7] p-3 rounded-xl border border-gray-100 col-span-2 sm:col-span-1">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Vasthu Compliance</span>
              <span className="font-extrabold text-[#202124] block mt-0.5">100% Vasthu</span>
            </div>
          </div>

          {/* Quick Highlight Checks */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
            {project.projectHighlights?.slice(0, 4).map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#F58220] flex-shrink-0" />
                <span className="truncate">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TWO PRIMARY ACTION BUTTONS (As requested by user) */}
        <div className="pt-6 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Button 1: View Project -> Opens in new page with all highlights */}
          <Link
            to="/projects/alekya"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#F58220] hover:bg-[#E07016] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-center cursor-pointer"
          >
            <span>View Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Button 2: View Plots -> Directly opens Nextora-style interactive layout map */}
          <Link
            to="/projects/alekya/map"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-[#202124] bg-gray-100 hover:bg-[#F58220] hover:text-white border border-gray-200 shadow-sm hover:shadow transition-all duration-200 text-center cursor-pointer group"
          >
            <Grid3X3 className="w-4 h-4 text-[#F58220] group-hover:text-white transition-colors" />
            <span>View Plots</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
