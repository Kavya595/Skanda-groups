import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Maximize2,
  Building,
  Sparkles,
  Car,
  Plane,
  Layers,
  FileText,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

export default function SpecialLandmarkView() {
  const [activeTab, setActiveTab] = useState('route'); // 'route' or 'layout'
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const landmarks = [
    {
      id: 'site',
      name: "Skandha Venture (SITE)",
      category: 'site',
      distance: 'Adjoining Highway',
      road: "100' Proposed Road & Srisailam Highway",
      desc: '10.50-Acre DTCP approved plotted community in Kadthal. 96 surveyed villa plots with 100% Vasthu compliance.',
      color: 'bg-brand-orange text-white'
    },
    {
      id: 'maisigandi',
      name: 'Maisigandi Maha Maisamma Temple',
      category: 'heritage',
      distance: '1 Min Drive',
      road: "60'-0\" Proposed Arterial Road",
      desc: 'Famous spiritual pilgrimage temple adjoining the northern boundary of the layout plan.',
      color: 'bg-amber-500 text-white'
    },
    {
      id: 'highway',
      name: 'Srisailam Highway (NH 765)',
      category: 'highway',
      distance: '2 Min Drive',
      road: '4-Lane Arterial Highway',
      desc: 'Fast-speed arterial connection directly linking Kadthal to Hyderabad Outer Ring Road (ORR) and the Airport.',
      color: 'bg-blue-600 text-white'
    },
    {
      id: 'futurecity',
      name: '200 Feet Futurecity Road & Zone',
      category: 'highway',
      distance: '8 Min Drive',
      road: "200' Wide Expressway",
      desc: 'Direct arterial link connecting Srisailam Highway to the upcoming Mucherla Future City & AI Hub.',
      color: 'bg-purple-600 text-white'
    },
    {
      id: 'pharma_dr_reddys',
      name: "Dr. Reddy's Laboratories",
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: "330' Road & Srisailam Highway",
      desc: 'Global pharmaceutical giant manufacturing facility located along the 330ft corridor.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_bharat_biotech',
      name: 'Bharat Biotech',
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: "100' Road & Srisailam Highway",
      desc: 'Pioneering global biotechnology innovator situated in immediate proximity to the layout SITE.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_hetero',
      name: 'Hetero Drugs',
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: "100' Road Corridor",
      desc: 'Prominent pharmaceutical campus in the South Hyderabad life sciences cluster.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_msn',
      name: 'MSN Laboratories',
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: "100' Approach Road",
      desc: 'Leading active pharmaceutical research and production campus near the site.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_laurus',
      name: 'Laurus Labs',
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: "100' Approach Road",
      desc: 'Major research and development facility located in the high-tech life sciences corridor.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_aurobindo',
      name: 'Aurobindo Pharma',
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: "330' Master Plan Road",
      desc: 'Key global supplier of specialty formulations situated neighboring Kadthal.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_gland',
      name: 'Gland Pharma',
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: "330' Master Plan Road",
      desc: 'Injectable biopharmaceutical campus positioned along the southern industrial corridor.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_granules',
      name: 'Granules India',
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: "100' Approach Road",
      desc: 'Eco-conscious life sciences industrial node neighboring the project.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pyramid',
      name: 'Maheshwara Maha Pyramid',
      category: 'heritage',
      distance: 'Short Drive',
      road: 'Pyramid Road',
      desc: 'World-renowned high-energy meditation center in Kadthal.',
      color: 'bg-amber-600 text-white'
    },
    {
      id: 'kadthal_town',
      name: 'Kadthal Town & Municipality',
      category: 'heritage',
      distance: '3 Min Drive',
      road: 'Srisailam Highway (NH 765)',
      desc: 'Established town center with administrative offices, schools, banks, and daily retail.',
      color: 'bg-blue-500 text-white'
    },
    {
      id: 'orr_exit_14',
      name: 'Outer Ring Road (ORR Exit 14)',
      category: 'highway',
      distance: '15 Min Drive',
      road: 'ORR Inter-change & Wonderla',
      desc: 'Strategic high-speed loop expressway connection to Gachibowli, Financial District, and Hitec City.',
      color: 'bg-blue-700 text-white'
    },
    {
      id: 'airport',
      name: 'RGIA Shamshabad Airport',
      category: 'highway',
      distance: '20 Min Drive',
      road: 'Srisailam Highway & ORR',
      desc: 'International flight terminal via smooth, signal-free multi-lane highway connection.',
      color: 'bg-blue-800 text-white'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Landmarks (16)' },
    { id: 'pharma', label: 'Global Pharma Giants (8)' },
    { id: 'highway', label: 'Highways & Corridors (5)' },
    { id: 'heritage', label: 'Spiritual & Civic Hubs (3)' }
  ];

  const filteredLandmarks = activeCategory === 'all'
    ? landmarks
    : landmarks.filter(l => l.category === activeCategory || l.category === 'site');

  const currentModalImage = activeTab === 'route'
    ? '/assets/route_map_hd.png'
    : '/assets/layout_plan_hd.png';

  const currentModalTitle = activeTab === 'route'
    ? 'Strategic Highway & Transit Corridor Map'
    : 'DTCP Sanctioned Master Layout Plan (TLP NO. 87/2024/H)';

  return (
    <div className="bg-[#0c0f17] rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-sm space-y-8 text-white">
      {/* Top Header & Special Mode Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Strategic Corridor &bull; Master Blueprint
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/80">
              TLP NO. 87/2024/H
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            Location Highlights &amp; Landmark Corridor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Interactive visual examination of Srisailam Highway, the upcoming Mucherla Future City corridor, and major pharmaceutical campuses.
          </p>
        </div>

        {/* Special 2-View Mode Switcher */}
        <div className="bg-[#121622] p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap items-center border border-slate-700 shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('route')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'route'
                ? 'bg-brand-orange text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Corridor Route Map</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'layout'
                ? 'bg-brand-orange text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Master Layout Blueprint</span>
          </button>
        </div>
      </div>

      {/* Main Special View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: High-Resolution Graphic Display with Zoom (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onClick={() => setIsZoomModalOpen(true)}
            className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#07090e] cursor-zoom-in group p-3 shadow-xs hover:shadow-lg transition-all"
          >
            <img
              src={currentModalImage}
              alt={currentModalTitle}
              className="w-full h-auto max-h-[580px] object-contain rounded-xl mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute bottom-6 right-6 bg-[#0c0f17]/90 text-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-bold shadow flex items-center gap-1.5 pointer-events-none">
              <Maximize2 className="w-3.5 h-3.5 text-brand-orange" />
              <span>Click image to zoom full resolution</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Source: Sanctioned Layout TLP NO. 87/2024/H &amp; Verified Highway Survey</span>
            <button
              onClick={() => setIsZoomModalOpen(true)}
              className="text-brand-orange font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Inspect Full Resolution</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Landmark Matrix & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                  activeCategory === cat.id
                    ? 'bg-brand-orange text-white shadow-xs'
                    : 'bg-[#121622] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Landmark Spotlight Card */}
          {selectedLandmark && (
            <div className="p-4 bg-orange-950/40 border border-orange-800/60 rounded-2xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Landmark Spotlight
                </span>
                <span className="text-xs font-extrabold bg-[#121622] text-white px-2 py-0.5 rounded border border-orange-800/60">
                  {selectedLandmark.distance}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-white">
                {selectedLandmark.name}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedLandmark.desc}
              </p>
              <div className="pt-1 text-[11px] text-slate-400 font-medium">
                <strong>Approach Route:</strong> {selectedLandmark.road}
              </div>
            </div>
          )}

          {/* Scrollable Landmark Cards List */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredLandmarks.map(item => {
              const isSelected = selectedLandmark?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedLandmark(item)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#182030] text-white border-brand-orange shadow-md'
                      : 'bg-[#0e121a] hover:bg-[#141a26] border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-brand-orange text-white' : 'bg-orange-500/10 text-brand-orange border border-orange-500/20'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {item.name}
                      </div>
                      <div className={`text-[11px] leading-tight mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {item.road}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                    isSelected
                      ? 'bg-brand-orange text-white'
                      : 'bg-slate-800/80 text-brand-orange border border-slate-700/50'
                  }`}>
                    {item.distance}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Corridor Verified Highlights Ribbon */}
      <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#121622] p-5 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <CheckCircle2 className="w-4 h-4 text-brand-orange" />
            <span>Strategic Location Highlights</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              <span><strong>Just 1 min drive</strong> to Maisigandi Temple</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              <span><strong>Just 2 min drive</strong> to Srisailam Highway - NH 765</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              <span><strong>Near Kadthal Town</strong> &amp; Municipality</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              <span><strong>Close to Future City</strong> &amp; Life Sciences Development Zone</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#121622] p-5 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Connectivity &amp; Major Investments</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Good connectivity to <strong>Kandukur - Maheshwaram Industrial Belt</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Close to <strong>Maheshwara Maha Pyramid</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Major Pharma: <strong>Dr. Reddy's, Aurobindo, Hetero, Laurus, MSN, Gland</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Direct access to Hyderabad via <strong>Srisailam Highway &amp; ORR Exit 14</strong></span>
            </li>
          </ul>
        </div>
      </div>

      {/* Full-Screen Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] bg-[#0c0f17] border border-slate-800 rounded-3xl p-4 shadow-2xl overflow-hidden space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-serif font-bold text-white text-lg">
                {currentModalTitle}
              </h3>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={currentModalImage}
              alt={currentModalTitle}
              className="max-h-[80vh] w-auto object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
