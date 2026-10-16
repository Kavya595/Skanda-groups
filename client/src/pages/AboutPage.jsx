import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Mail,
  Award,
  CheckCircle,
  HeartHandshake,
  Calendar,
  Sparkles,
  ArrowRight,
  PhoneCall,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';

export default function AboutPage({ settings }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const officeAddress = (settings && settings.officeAddress) || '# 8-7-91/17/1, 4th Floor Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana -500079';
  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';
  const reraNo = (settings && settings.reraNumber) || 'PO2400009081';
  const dtcpNo = (settings && settings.dtcpNumber) || 'TLP NO. 87/2024/H';

  const pillars = [
    {
      title: '100% Clear Titles & Transparency',
      desc: 'Every layout undertaken by Skandha Group undergoes thorough legal scrutiny, ensuring completely clean title deeds, survey clearance, and hassle-free spot registrations.',
      icon: ShieldCheck
    },
    {
      title: 'Approved Regulatory Compliance',
      desc: 'Strict adherence to DTCP and TS RERA statutory guidelines guarantees peace of mind, high bank-loan eligibility, and legally secured land ownership.',
      icon: Award
    },
    {
      title: 'Strategic High-Growth Corridors',
      desc: 'Our venture is situated along expanding highway corridors, life science hubs, and industrial belts to ensure maximum capital appreciation for investors and homeowners.',
      icon: CheckCircle
    },
    {
      title: 'Customer-First Execution',
      desc: 'From initial site visit to spot registration and long-term layout maintenance, we ensure seamless service and dedicated post-purchase support.',
      icon: HeartHandshake
    }
  ];

  return (
    <div className="bg-[#000000] text-slate-100 space-y-20 pb-20">
      {/* ========================================================== */}
      {/* 1. HERO SECTION                                            */}
      {/* ========================================================== */}
      <section className="relative bg-gradient-to-b from-[#07090e] via-[#0b0e14] to-[#000000] py-16 sm:py-20 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full bg-brand-orange/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
            <span className="h-px w-8 bg-brand-orange/40" />
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            ABOUT US
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            <span className="h-px w-8 bg-brand-orange/40" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Building Trust Through Legal Precision &amp; Prime Locations
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            <strong className="text-white">Skandha Group</strong> is a trusted real-estate development firm based in Hyderabad, specializing in DTCP and RERA approved plotted layouts along Telangana's premier development corridors.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-emerald-950/80 text-emerald-400 rounded-md border border-emerald-800/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              DTCP Sanctioned: {dtcpNo}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-[#121622] text-slate-300 rounded-md border border-slate-700">
              TS RERA Registered: {reraNo}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 2. 2-COLUMN ABOUT US SECTION                               */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Feature Visual with Enlarge Trigger */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 group">
              <img
                src="/assets/site_entrance_arch.jpg"
                alt="Skandha Group Grand Entrance Arch & Security Portal"
                className="w-full h-[380px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 bg-[#0c0f17]/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700">
                Gated Venture &bull; 24/7 Security
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-brand-orange/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-brand-orange transition-all duration-300 group-hover:shadow-orange-500/50"
                aria-label="Enlarge View"
              >
                <Maximize2 className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <span className="font-bold">Kadthal Venture:</span> Directly adjoining NH 765 Srisailam Highway, 1 minute to Maisigandi Temple.
              </div>
            </div>
          </div>

          {/* Right: Narrative Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                OUR VISION
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                <span className="h-px w-6 bg-brand-orange/40" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                We Provide The Beauty of Your Home
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              With <strong className="text-white">Skandha Group</strong>, our vision is to craft peaceful, legally safeguarded plotted communities that harmoniously blend serene residential living with the unprecedented economic growth of Hyderabad's southern development corridor.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Surrounded by historic landmarks like Maisigandi Temple and connected to Hyderabad's upcoming Life Sciences &amp; Mucherla Future City belts, our venture delivers an ideal foundation for constructing a custom dream villa or creating an enduring intergenerational family asset.
            </p>

            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-brand-orange" />
                <span>100% Vasthu Compliant East &amp; West Facing Orientations</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-brand-orange" />
                <span>Complete Statutory Clearances &amp; Instant Spot Registration</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-brand-orange" />
                <span>Direct Signal-Free Access to Hyderabad via NH 765 &amp; ORR Exit 14</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-md hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Advisory Consultation</span>
              </button>
              <Link
                to="/project"
                className="inline-flex items-center gap-2 bg-[#121622] hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-lg transition-all"
              >
                <span>Project Specifications</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 3. FOUR FOUNDATIONAL PILLARS                                */}
      {/* ========================================================== */}
      <section className="bg-[#07090e] py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
              <span className="h-px w-8 bg-brand-orange/40" />
              <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
              CORE VALUES
              <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
              <span className="h-px w-8 bg-brand-orange/40" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Why Discerning Buyers Choose Skandha Group
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Our unwavering commitment to legal rigor, transparent pricing, and prompt infrastructure execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0c0f17] p-7 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-orange/40 transition-all duration-300 flex items-start gap-5 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-brand-orange flex items-center justify-center shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 4. CORPORATE HEADQUARTERS & CONTACT SECTION                */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Head Office Card */}
          <div className="p-8 rounded-3xl bg-[#0c0f17] border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/skandha_logo_white.svg"
                alt="Skandha Group"
                className="h-10 w-auto object-contain"
              />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              Corporate Headquarters
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="leading-relaxed">{officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-brand-orange font-semibold text-slate-200">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEnquiryOpen(true)}
                  className="inline-flex items-center gap-2 text-brand-orange hover:text-white font-semibold transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Request Site Desk Callback</span>
                </button>
              </div>
            </div>
            <div className="p-4 bg-orange-950/40 border border-orange-800/60 rounded-xl text-xs text-orange-200 leading-relaxed">
              <strong>Spot Registration Commitment:</strong> Transparent documentation with on-site surveyed boundary pegs, clear Vasthu alignments, and spot registration.
            </div>
          </div>

          {/* Project Site Card */}
          <div className="p-8 rounded-3xl bg-[#0c0f17] border border-slate-800 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-800/80">
              <MapPin className="w-3.5 h-3.5" />
              <span>Project Site Office</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              Kadthal Venture &bull; Srisailam Highway
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Adjoining 4-lane NH 765 Srisailam Highway, Kadthal Mandal, Ranga Reddy District, Telangana - 509358. Just 1 minute drive from Maisigandi Temple.
            </p>
            <div className="p-4 bg-[#121622] border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white">Daily Guided Site Tours:</div>
              <p>Complimentary escorted site visits available daily with cab pickup from Hyderabad.</p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Guided Site Tour</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#0c0f17] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full shadow transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/assets/site_entrance_arch.jpg"
              alt="Entrance Arch"
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
}
