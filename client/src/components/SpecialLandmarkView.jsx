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
  ChevronRight
} from 'lucide-react';

export default function SpecialLandmarkView() {
  const [activeTab, setActiveTab] = useState('route'); // 'route', 'layout', 'brochure'
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const landmarks = [
    {
      id: 'site',
      name: "Alekhya's Brundavan (SITE)",
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
      road: 'Srisailam Highway East Flank',
      desc: 'Major pharmaceutical innovation hub neighboring the development belt.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_aurobindo',
      name: 'Aurobindo Pharma',
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: 'Srisailam Highway Flank',
      desc: 'Major pharma powerhouse situated south along the Srisailam Highway stretch.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_gland',
      name: 'Gland Pharma',
      category: 'pharma',
      distance: 'Pharma Corridor',
      road: "330' Road Link",
      desc: 'Leading injectable pharmaceutical manufacturing facility in the corridor.',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'pharma_green',
      name: 'Green Pharma City',
      category: 'pharma',
      distance: 'Corridor Node',
      road: 'Pyramid Road & Srisailam Highway',
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
    : activeTab === 'layout'
    ? '/assets/layout_plan_hd.png'
    : '/assets/brochure_page3_hd.png';

  const currentModalTitle = activeTab === 'route'
    ? 'Official Flyer Route & Connectivity Map'
    : activeTab === 'layout'
    ? 'Challampally / Alekhya Brundavan Master Layout Plan'
    : 'Brochure Page 3: Location & Project Highlights';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
      {/* Top Header & Special Mode Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Special Visual View &bull; Brochure Page 3
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Verified Map
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            Location Highlights &amp; Landmark Corridor
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Interactive visual examination of Srisailam Highway, the upcoming Mucherla Future City corridor, and major pharmaceutical campuses.
          </p>
        </div>

        {/* Special 3-View Mode Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap items-center border border-slate-200 shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('route')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'route'
                ? 'bg-white text-brand-orange shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Corridor Route Map</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'layout'
                ? 'bg-white text-brand-orange shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Master Layout Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('brochure')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'brochure'
                ? 'bg-white text-brand-orange shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Brochure Page 3</span>
          </button>
        </div>
      </div>

      {/* Main Special View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: High-Resolution Graphic Display with Zoom (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onClick={() => setIsZoomModalOpen(true)}
            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 cursor-zoom-in group p-3 shadow-xs hover:shadow-lg transition-all"
          >
            <img
              src={currentModalImage}
              alt={currentModalTitle}
              className="w-full h-auto max-h-[580px] object-contain rounded-xl mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow flex items-center gap-1.5 pointer-events-none">
              <Maximize2 className="w-3.5 h-3.5 text-brand-orange" />
              <span>Click image to zoom full resolution</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Source: Official Skandha Group Alekhya's Brundavan Brochure</span>
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
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Landmark Spotlight Card */}
          {selectedLandmark && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Landmark Spotlight
                </span>
                <span className="text-xs font-extrabold bg-white text-slate-900 px-2 py-0.5 rounded border border-orange-200">
                  {selectedLandmark.distance}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-slate-900">
                {selectedLandmark.name}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedLandmark.desc}
              </p>
              <div className="pt-1 text-[11px] text-slate-500 font-medium">
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
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-orange-50 text-brand-orange'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {item.name}
                      </div>
                      <div className={`text-[11px] leading-tight mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {item.road}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-brand-orange'
                  }`}>
                    {item.distance}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Brochure Page 3 Verified Highlights Ribbon */}
      <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <CheckCircle2 className="w-4 h-4 text-brand-orange" />
            <span>Brochure Location Highlights</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
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

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Connectivity &amp; Major Investments</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Good connectivity to <strong>Kandukur - Maheshwaram Industrial Belt</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Close to <strong>Maheshwara Maha Pyramid</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Major Pharma: <strong>Dr. Reddy's, Aurobindo, Hetero, Laurus, MSN, Gland</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Direct access to Hyderabad via <strong>Srisailam Highway &amp; ORR Exit 14</strong></span>
            </li>
          </ul>
        </div>
      </div>

      {/* Full-Screen Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] bg-white rounded-3xl p-4 shadow-2xl overflow-hidden space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                {currentModalTitle}
              </h3>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-full transition-colors"
              >
                &times;
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
