import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Download,
  Building,
  Trees,
  Car,
  Droplets,
  Lightbulb,
  Sparkles,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import { fetchPublicSettings, fetchPlotStats, fetchGallery, trackActivityEvent } from '../api/client';
import EnquiryModal from '../components/EnquiryModal';
import Lightbox from '../components/Lightbox';

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    trackActivityEvent('layout_opened', null, { source: 'homepage' });
    fetchPublicSettings().then(res => res.success && setSettings(res.settings)).catch(console.error);
    fetchPlotStats().then(res => res.success && setStats(res.stats)).catch(console.error);
    fetchGallery().then(res => res.success && setGallery(res.items.slice(0, 6))).catch(console.error);
  }, []);

  const amenities = [
    { title: 'DTCP Approved Layout', desc: 'TLP No. 87/2024/H legally approved residential layout.', icon: ShieldCheck },
    { title: '100% Vasthu Compliant', desc: 'Carefully engineered plot alignments with clear Vasthu titles.', icon: Compass },
    { title: "40' & 33' B.T Roads", desc: "Wide asphalt blacktop internal avenues with pedestrian curbs.", icon: Car },
    { title: 'Spot Registration', desc: 'Ready for immediate spot registration with clear title deed.', icon: CheckCircle2 },
    { title: '24 Hours Security', desc: 'Grand entrance arch with 24/7 security cabin and boundary fencing.', icon: Building },
    { title: 'Underground Drainage', desc: 'Modern sanitary underground drainage system throughout layout.', icon: Droplets },
    { title: 'Overhead Water Tank', desc: 'Dedicated water storage tank ensuring round-the-clock water supply.', icon: Droplets },
    { title: 'Landscaped Parks', desc: 'Ac. 0.758 cents reserved green space with lush plantings.', icon: Trees },
    { title: 'Jogging Track & Play Area', desc: 'Paved jogging trail and dedicated children activity zone.', icon: Sparkles },
    { title: 'Unique Street Lights', desc: 'Illuminated LED street fixtures across all internal roads.', icon: Lightbulb },
    { title: 'Avenue Plantation', desc: 'Lush avenue trees and greenery bordering all road curbs.', icon: Trees },
    { title: '2 Years Maintenance', desc: 'Complimentary security & comprehensive site maintenance for 2 years.', icon: ShieldCheck }
  ];

  const locations = [
    { claim: 'Maisigandi Temple', time: '1 min drive', desc: 'Right along the proposed 60ft arterial layout road' },
    { claim: 'Srisailam Highway (NH 765)', time: '2 min drive', desc: 'Direct adjoining arterial access to Hyderabad' },
    { claim: 'Kadthal Town & Municipality', time: '3 min drive', desc: 'Established administrative town with retail & schools' },
    { claim: 'Future City & Life Sciences Hub', time: 'Short drive', desc: 'Telangana mega economic and pharma development corridor' },
    { claim: 'Kandukur - Maheshwaram Industrial Belt', time: 'Quick access', desc: 'Proximity to high-value IT, aerospace & industrial zones' },
    { claim: 'Major Pharma Investments', time: 'Pharma Corridor', desc: "Dr. Reddy's, Aurobindo, Hetero, Laurus Labs, MSN & Gland Pharma" }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Background Image / Video Poster Fallback */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero_cover.jpg"
            alt="Alekhya's Brundavan Villa Layout"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
          />
          {/* Accessible Multi-layer Warm Gradient Overlay (Never black panel) */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <div className="max-w-3xl space-y-6">
            {/* Regulatory Approval Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold tracking-wide text-orange-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DTCP Approved TLP NO. 87/2024/H | TS RERA PO2400009081</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              Locate Yourself At The Most <span className="text-orange-400">Desirable Place</span>.
            </h1>

            {/* Sub-headline / Concise Positioning */}
            <p className="text-lg sm:text-xl text-slate-200 font-light leading-relaxed max-w-2xl drop-shadow">
              <strong>Alekhya's Brundavan</strong> at Kadthal by <strong>Skandha Group</strong>. Premium residential villa plots adjoining Srisailam Highway (NH 765), just 1 minute to Maisigandi Temple and minutes from the booming Future City zone.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="/plots"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white px-7 py-3.5 rounded-xl text-base font-bold shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
              >
                <Compass className="w-5 h-5" />
                <span>Explore Interactive Plots (2D / 3D)</span>
                <ExternalLink className="w-4 h-4 text-white/80" />
              </a>

              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-slate-900 px-6 py-3.5 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <span>Request Price & Brochure</span>
              </button>

              <a
                href="/assets/alekhyas_brundavan_brochure.pdf"
                download="Alekhyas_Brundavan_Brochure.pdf"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white px-4 py-3 text-sm font-semibold transition-colors"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Brochure (PDF)</span>
              </a>
            </div>

            {/* Highlights Bar */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div>
                <div className="text-white font-bold text-base">96 Plots</div>
                <div>Numbered & Surveyed</div>
              </div>
              <div>
                <div className="text-white font-bold text-base">Ac. 0.758 Cts</div>
                <div>Reserved Open Park</div>
              </div>
              <div>
                <div className="text-white font-bold text-base">60', 40' & 33'</div>
                <div>Wide B.T. Roads</div>
              </div>
              <div>
                <div className="text-white font-bold text-base">100% Vasthu</div>
                <div>Spot Registration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="pt-2 lg:pt-0">
            <div className="text-3xl font-extrabold text-brand-orange">
              {stats?.total || 96}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Total Approved Plots
            </div>
          </div>
          <div className="pt-2 lg:pt-0">
            <div className="text-3xl font-extrabold text-emerald-600">
              {stats?.available || 70}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Plots Available for Booking
            </div>
          </div>
          <div className="pt-2 lg:pt-0">
            <div className="text-3xl font-extrabold text-slate-800">
              100%
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Clear Title & Vasthu
            </div>
          </div>
          <div className="pt-2 lg:pt-0">
            <div className="text-3xl font-extrabold text-amber-600">
              1 Min
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Drive to Maisigandi Temple
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview & Brochure Claims */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <span>Verified Project Overview</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-snug">
              A Serene Gated Community Plotted Paradise in Kadthal
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              <strong>Alekhya's Brundavan</strong> by Skandha Group is strategically situated at Kadthal along the prominent Srisailam Highway (NH 765). Built to DTCP approval standard (TLP NO. 87/2024/H), this master-planned plotted layout offers 96 premium residential villa plots with seamless road connectivity, modern amenities, and peaceful natural surroundings.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">
                  <strong>Arterial 60ft Road Access:</strong> Connecting straight towards Maisigandi Temple with adjoining service roads.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">
                  <strong>Grand Open Green Spaces:</strong> Ac. 0.758 cents exclusively dedicated to landscaped parks, jogging trail, and play zones.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">
                  <strong>Immediate Spot Registration:</strong> Clear documentation with hassle-free spot registration availability.
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <a
                href="/plots"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-3 rounded-lg text-sm transition-all shadow-sm"
              >
                <span>Select Your Plot Online</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                to="/project"
                className="text-sm font-semibold text-slate-700 hover:text-brand-orange transition-colors"
              >
                View Detailed Specifications &rarr;
              </Link>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white p-2">
              <img
                src="/assets/site_entrance_arch.jpg"
                alt="Alekhya Brundavan Grand Entrance Arch"
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Grand Entrance Arch & Fencing</h4>
                    <p className="text-xs text-slate-500">Alekhya's Brundavan On-site Development</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Active On-Site
                  </span>
                </div>
              </div>
            </div>

            {/* Corner Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg border border-slate-200 p-4 hidden sm:block max-w-xs">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/dtcp_approved_stamp.jpg"
                  alt="Approved DTCP Layout"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">DTCP Layout Approved</div>
                  <div className="text-[11px] text-slate-500">TLP No. 87/2024/H</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Amenities Grid */}
      <section className="bg-slate-50/70 border-y border-slate-200/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-100/70 px-3 py-1 rounded-full">
              Brochure-Verified Features
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Thoughtfully Engineered Amenities
            </h2>
            <p className="text-sm text-slate-600">
              Every amenity in Alekhya's Brundavan is purpose-built to deliver enduring lifestyle quality, superior infrastructure, and high property appreciation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {amenities.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-orange-200 transition-all duration-200 space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-brand-orange text-brand-orange group-hover:text-white flex items-center justify-center transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strategic Location Highlights & Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <MapPin className="w-3.5 h-3.5" />
              <span>Prime Connectivity</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Location Highlights & Growth Corridors
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Kadthal is evolving as one of Southern Hyderabad's most preferred residential and investment corridors along the 4-lane Srisailam National Highway (NH 765).
            </p>

            <div className="space-y-3.5 pt-2">
              {locations.map((loc, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-orange-200 transition-colors"
                >
                  <div className="pr-4">
                    <div className="text-sm font-bold text-slate-900">{loc.claim}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{loc.desc}</div>
                  </div>
                  <span className="text-xs font-extrabold text-brand-orange shrink-0 bg-orange-50 px-2.5 py-1 rounded-lg">
                    {loc.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-3 space-y-3">
              <img
                src="/assets/route_map.jpg"
                alt="Alekhya's Brundavan Location and Route Map"
                className="w-full h-auto max-h-[500px] object-contain rounded-xl bg-slate-50"
              />
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <span>Direct Route via Srisailam Highway (NH 765) & Exit 14</span>
                <span className="font-semibold text-brand-orange">Brochure Source Map</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Gallery Preview */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Site Developments
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 mt-2">
                On-Site Progress Photos
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:underline"
            >
              <span>View All Gallery Photos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, idx) => (
              <div
                key={item._id || idx}
                onClick={() => setLightboxIndex(idx)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-white text-sm font-bold">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-200 bg-white/20 px-3 py-1 rounded-full">
              Limited Plots Remaining
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Ready to Secure Your Plot in Alekhya's Brundavan?
            </h2>
            <p className="text-sm sm:text-base text-orange-100 leading-relaxed font-light">
              Explore the interactive 2D master plan and 3D preview, select your preferred facing and plot number, and connect directly with our sales advisors for verified spot registration details.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/plots"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-orange-50 text-brand-orange font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Check Plot Availability Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="bg-orange-950/40 hover:bg-orange-950/60 border border-white/30 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all"
              >
                Schedule Site Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />

      {/* Lightbox */}
      <Lightbox
        items={gallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(prev => (prev > 0 ? prev - 1 : gallery.length - 1))}
        onNext={() => setLightboxIndex(prev => (prev < gallery.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
}
