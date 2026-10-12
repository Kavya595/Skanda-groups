import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS_DATA } from '../data/projects';
import { usePlotContext } from '../context/PlotContext';
import PlotModal from '../components/PlotModal';
import { 
  ShieldCheck, 
  MapPin, 
  CheckCircle, 
  Download, 
  ArrowLeft, 
  Grid3X3, 
  Sparkles, 
  Compass,
  Layers,
  ExternalLink
} from 'lucide-react';

export default function ProjectDetail() {
  const { projects } = usePlotContext();
  const project = projects?.[0] || PROJECTS_DATA[0]; // Alekya
  const [showPlotModal, setShowPlotModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    plotType: 'East Facing Plot',
    notes: ''
  });

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email) return;
    setFormSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Breadcrumbs Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-500">
            <Link to="/" className="hover:text-[#F58220]">Home</Link>
            <span>/</span>
            <Link to="/projects" className="hover:text-[#F58220]">Projects</Link>
            <span>/</span>
            <span className="font-bold text-[#202124]">{project.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/projects/alekya/map"
              className="inline-flex items-center gap-1.5 font-bold text-[#0066cc] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Nextora-Style GIS Map</span>
            </Link>

            <Link 
              to="/projects"
              className="inline-flex items-center gap-1.5 font-bold text-[#F58220] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects Overview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Project Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden border-b border-[#E5E7EB]">
        {/* Full-bleed Vibrant Family Background Photo */}
        <img
          src="/images/hero-family.jpg"
          alt={project.projectFullName}
          className="absolute inset-0 w-full h-full object-cover object-[82%_center] sm:object-[86%_center] lg:object-right"
        />

        {/* Suitable high-contrast backdrop on the left */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#121316]/95 via-[#121316]/85 to-transparent sm:w-3/5 lg:w-1/2 pointer-events-none z-10" 
          aria-hidden="true" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 relative z-20 w-full">
          <div className="max-w-xl lg:max-w-2xl bg-[#121316]/85 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none p-6 sm:p-0 rounded-3xl sm:rounded-none border border-white/10 sm:border-none shadow-2xl sm:shadow-none space-y-5 text-left">
            {/* Statutory Clearances Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F58220] text-white shadow-md">
                {project.badge}
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-gray-100 border border-white/20 shadow-sm">
                DTCP: {project.dtcpNo}
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-gray-100 border border-white/20 shadow-sm">
                TS RERA: {project.reraNo}
              </span>
            </div>

            {/* Project Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                {project.name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-[#F58220] mt-1.5 drop-shadow-sm">
                {project.projectFullName} &bull; <span className="text-gray-300 font-medium text-lg">{project.subTitle}</span>
              </p>
            </div>

            {/* Location Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-[#F58220] flex-shrink-0" />
              <span className="font-semibold text-gray-200">{project.location}</span>
            </div>

            <p className="text-base text-gray-200 leading-relaxed font-normal drop-shadow-sm">
              {project.shortDescription}
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Primary: View Interactive Plots (Directly opens full-screen GIS Layout Map) */}
              <Link
                to="/projects/alekya/map"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#F58220] hover:bg-[#E07016] text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 text-center"
              >
                <Layers className="w-4 h-4 text-white" />
                <span>View Plots (2D & 3D Interactive Map)</span>
              </Link>

              {/* Official Brochure Download */}
              <a
                href={project.brochureUrl}
                download
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm shadow-md transition-all duration-200 text-center"
              >
                <Download className="w-4 h-4" />
                <span>Brochure (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Statutory Compliance Card Strip */}
      <section className="bg-white border-b border-[#E5E7EB] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#F58220] flex-shrink-0" />
            <div className="text-left">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Statutory Regulatory Clearances
              </span>
              <div className="text-sm font-extrabold text-[#202124]">
                TS RERA: <span className="text-[#F58220]">{project.reraNo}</span> &bull; DTCP Sanction: <span className="text-[#F58220]">{project.dtcpNo}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              100% Vasthu Compliant
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Immediate Spot Registration
            </span>
          </div>
        </div>
      </section>

      {/* 4. Specifications & Overview */}
      <section className="py-16 border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Overview & Specs */}
            <div className="lg:col-span-8 space-y-8 text-left">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                  Project Overview
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124] mt-1">
                  Alekya at Kadthal: Designed for Serene Living & Rapid Appreciation
                </h2>
                <p className="text-base text-[#6B7280] leading-relaxed mt-4">
                  {project.overview}
                </p>
              </div>

              {/* Project Highlights */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#F58220]" />
                  <h3 className="text-xl font-bold text-[#202124]">
                    Project Highlights & Infrastructure
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                  {project.projectHighlights?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#F58220] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Highlights */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#F58220]" />
                  <h3 className="text-xl font-bold text-[#202124]">
                    Strategic Location Highlights
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                  {project.locationHighlights?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Plot Orientations */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                      Masterplan Options
                    </span>
                    <h3 className="text-xl font-bold text-[#202124] mt-0.5">
                      Available Plot Orientations & Configurations
                    </h3>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-[#F58220] border border-orange-200">
                    Pricing on Request
                  </span>
                </div>
                
                <p className="text-xs text-[#6B7280] mb-5 leading-relaxed">
                  Alekya offers thoughtfully oriented villa parcels designed to maximize natural ventilation and natural sunlight as per authentic Vasthu principles:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  {project.plotOrientations?.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-[#F58220]/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-[#F58220] flex-shrink-0" />
                        <span className="font-bold text-[#202124] text-sm">{item.type}</span>
                      </div>
                      <p className="text-gray-600 text-xs mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Interactive GIS Callout */}
                <div className="mt-6 p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="font-extrabold text-blue-950 text-sm block">
                      Explore Nextora-Style Interactive GIS Masterplan
                    </span>
                    <span className="text-blue-800 mt-1 block">
                      Inspect all 96 plotted parcels in interactive 2D and 3D views with live green/blue/red availability colors.
                    </span>
                  </div>
                  <Link
                    to="/projects/alekya/map"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0066cc] hover:bg-[#0052a3] transition-colors shadow whitespace-nowrap"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Fullscreen Map</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* Right: Quick Action Sticky Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-28 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl space-y-6 text-left">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                    Direct Plot Inquiries
                  </span>
                  <h3 className="text-xl font-extrabold text-[#202124] mt-1">
                    Book Your Plot at Alekya
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                    Connect with our sales specialists for live plot availability and guided site visits.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                    <div className="font-bold">Inquiry Registered!</div>
                    <p>Thank you, {inquiryData.name}. Our advisory team will email you shortly at {inquiryData.email} with Alekya plot sheets.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#202124] mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={inquiryData.name}
                        onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                        placeholder="e.g. Anand Rao"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#F58220] outline-none text-base sm:text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#202124] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={inquiryData.email}
                        onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                        placeholder="e.g. anand@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#F58220] outline-none text-base sm:text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#202124] mb-1">Preferred Orientation</label>
                      <select
                        value={inquiryData.plotType}
                        onChange={(e) => setInquiryData({ ...inquiryData, plotType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#F58220] outline-none bg-white text-base sm:text-xs"
                      >
                        <option>East Facing Plot</option>
                        <option>West Facing Plot</option>
                        <option>North Facing Plot</option>
                        <option>Corner Plot (North-East / North-West)</option>
                        <option>40' Avenue / 60' Arterial Road Facing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#202124] mb-1">Questions / Notes</label>
                      <textarea
                        rows={3}
                        value={inquiryData.notes}
                        onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                        placeholder="Plot size in Sq. Yds or preferred visit date..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#F58220] outline-none text-base sm:text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-white bg-[#F58220] hover:bg-[#E07016] shadow-md transition-colors cursor-pointer"
                    >
                      Request Plot Availability
                    </button>
                  </form>
                )}

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <Link
                    to="/projects/alekya/map"
                    className="w-full py-3 rounded-xl font-bold text-xs bg-[#F58220] hover:bg-[#E07016] text-white transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <Layers className="w-4 h-4" />
                    <span>View Interactive 2D & 3D Plots</span>
                  </Link>

                  <a
                    href={project.brochureUrl}
                    download
                    className="w-full py-2 rounded-xl font-semibold text-xs text-center text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Download Official Brochure PDF
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Nextora-Style Interactive Plot Layout Modal */}
      <PlotModal 
        isOpen={showPlotModal} 
        onClose={() => setShowPlotModal(false)} 
        project={project} 
      />
    </div>
  );
}
