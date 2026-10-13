import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Mail,
  Award,
  CheckCircle,
  HeartHandshake,
  Quote,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';

export default function AboutPage({ settings }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const officeAddress = (settings && settings.officeAddress) || '# 8-7-91/17/1, 4th Floor Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana -500079';
  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';

  const pillars = [
    {
      title: '100% Clear Titles & Transparency',
      desc: 'Every layout undertaken by Skandha Group undergoes thorough legal scrutiny, ensuring completely clean title deeds, survey clearance, and hassle-free spot registrations.',
      icon: ShieldCheck
    },
    {
      title: 'Approved Regulatory Compliance',
      desc: 'Strict adherence to DTCP, HMDA, and TS RERA statutory guidelines guarantees peace of mind, high bank-loan eligibility, and legally secured land ownership.',
      icon: Award
    },
    {
      title: 'Strategic High-Growth Corridors',
      desc: 'Our projects are located along expanding highway corridors, life science hubs, and industrial belts to ensure maximum capital appreciation for investors and homeowners.',
      icon: CheckCircle
    },
    {
      title: 'Customer-First Execution',
      desc: 'From initial site visit to spot registration and long-term layout maintenance, we ensure seamless service and dedicated post-purchase support.',
      icon: HeartHandshake
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          About Skandha Group
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900 leading-tight">
          Building Trust Through Legal Precision &amp; Prime Locations
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
          <strong>Skandha Group</strong> is a trusted real-estate development firm based in Hyderabad, specializing in DTCP and RERA approved plotted layouts along Telangana's premier development corridors.
        </p>
      </div>

      {/* Editorial Quotation Banner */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50/50 rounded-3xl p-8 sm:p-12 border border-orange-200/60 shadow-sm text-center space-y-4">
        <Quote className="w-10 h-10 text-brand-orange/30 mx-auto" />
        <blockquote className="font-serif text-xl sm:text-2xl font-normal text-slate-900 leading-snug max-w-3xl mx-auto">
          &ldquo;Our mission is to empower families and investors with freehold land assets of unquestionable legal pedigree, enduring Vasthu harmony, and exceptional locational foresight.&rdquo;
        </blockquote>
        <div className="font-bold text-xs uppercase tracking-widest text-brand-orange">
          Skandha Group &bull; Corporate Governance
        </div>
      </section>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 leading-snug">
            Our Vision: Alekhya's Brundavan at Kadthal
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            With <strong>Alekhya's Brundavan</strong>, our vision was clear: to craft a peaceful, green plotted community that balances serene residential living with the unprecedented economic growth of the Srisailam Highway / Future City corridor.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Surrounded by historic landmarks like Maisigandi Temple and connected to Hyderabad's upcoming Life Sciences &amp; Pharma belts, Alekhya's Brundavan delivers an ideal foundation for constructing a custom dream villa or creating an enduring intergenerational asset.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Connect With Leadership Advisory</span>
            </button>
            <Link
              to="/project"
              className="text-xs font-bold text-slate-700 hover:text-brand-orange flex items-center gap-1 transition-colors"
            >
              <span>Explore Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Corporate Headquarters Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6">
          <img
            src="/assets/skandha_logo.svg"
            alt="Skandha Group Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Corporate Headquarters
            </h3>
            <div className="flex items-start gap-3 text-sm text-slate-700">
              <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div className="leading-relaxed">{officeAddress}</div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Mail className="w-5 h-5 text-brand-orange shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-brand-orange font-semibold underline">
                {email}
              </a>
            </div>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-orange-950 leading-relaxed">
            <strong>Spot Registration Promise:</strong> Transparent documentation with on-site boundary pegs, clear Vasthu alignments, and spot registration upon full agreement.
          </div>
        </div>
      </div>

      {/* Core Pillars Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Four Foundational Pillars
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Why Discerning Buyers Choose Skandha Group
          </h2>
          <p className="text-sm text-slate-500">
            Our unwavering commitment to legal rigor, transparent pricing, and prompt infrastructure execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-200 hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
}
