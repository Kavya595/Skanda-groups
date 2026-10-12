import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { X, Check, Download, MapPin, ShieldCheck } from 'lucide-react';
import { COMPANY_CONFIG } from '../config/company';

export default function ProjectGrid({ projects, showFilter = true }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Active / Booking Open', 'Upcoming Pipeline'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.status === activeCategory);

  return (
    <div>
      {/* Category Filter Pills */}
      {showFilter && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#F58220] text-white shadow-md'
                  : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200 hover:text-[#202124]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelectDetails={(p) => setSelectedProject(p)}
          />
        ))}
      </div>

      {/* Comprehensive Project Detail Drawer/Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 my-8">
            {/* Header Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition-colors cursor-pointer"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Hero Banner */}
            <div className="relative aspect-[16/8] sm:aspect-[21/9] bg-gray-900 overflow-hidden">
              <img
                src={selectedProject.coverImage}
                alt={selectedProject.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F58220] text-white mb-2 inline-block">
                  {selectedProject.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold">{selectedProject.name}</h3>
                <p className="text-sm text-gray-200 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-[#F58220]" />
                  <span>{selectedProject.location}</span>
                </p>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Statutory Approvals strip */}
              <div className="bg-[#FFF5EC] border border-[#F58220]/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#F58220] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-gray-600 uppercase">Statutory Compliance</div>
                    <div className="text-sm font-extrabold text-[#202124]">
                      RERA: {selectedProject.reraNo} &bull; DTCP: {selectedProject.dtcpNo}
                    </div>
                  </div>
                </div>
                {selectedProject.brochureUrl && (
                  <a
                    href={selectedProject.brochureUrl}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07016] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Brochure</span>
                  </a>
                )}
              </div>

              {/* Overview */}
              <div>
                <h4 className="text-lg font-bold text-[#202124] mb-2">Project Overview</h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {selectedProject.overview}
                </p>
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-lg font-bold text-[#202124] mb-3">Layout & Technical Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(selectedProject.specs || {}).map(([key, val]) => (
                    <div key={key} className="p-3 bg-[#F7F7F7] rounded-xl border border-gray-100">
                      <span className="text-gray-500 uppercase font-semibold text-[10px] block">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-gray-900 font-bold mt-0.5 block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location & Project Highlights in Two Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Highlights */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-[#F58220]">
                    Location Highlights
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {selectedProject.locationHighlights?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#F58220] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Project Highlights */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-[#F58220]">
                    Infrastructure & Amenities
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {selectedProject.projectHighlights?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#F58220] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Plot Orientations (NO CONFIDENTIAL TARIFFS) */}
              {selectedProject.plotOrientations && selectedProject.plotOrientations.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-[#202124] uppercase tracking-wider">
                      Available Plot Orientations
                    </h4>
                    <span className="text-[11px] font-bold text-[#F58220]">
                      Pricing on Request
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedProject.plotOrientations.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="font-bold text-[#202124]">{item.type}</div>
                        <p className="text-gray-600 text-[11px] mt-0.5">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  Have questions about plot availability or spot registration?
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    to="/contact"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-[#F58220] hover:bg-[#E07016] shadow"
                  >
                    <span>Inquire with Advisory Team</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
