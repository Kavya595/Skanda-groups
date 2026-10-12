import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import GalleryGrid from '../components/GalleryGrid';
import CallToAction from '../components/CallToAction';
import { 
  ShieldCheck, 
  Compass, 
  Trees, 
  Clock, 
  Building2, 
  ArrowRight,
  Award,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

function StandardCard({ item, stepNumber }) {
  const IconComp = item.icon;
  return (
    <div className="w-[270px] sm:w-[340px] md:w-[360px] flex-shrink-0 bg-white hover:bg-[#F58220] rounded-2xl p-5 sm:p-6 md:p-7 border border-[#E5E7EB] hover:border-[#F58220] shadow-xs hover:shadow-2xl transition-all duration-300 text-left hover:-translate-y-2 group select-none flex flex-col justify-between cursor-pointer">
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFF5EC] text-[#F58220] group-hover:bg-white group-hover:text-[#F58220] flex items-center justify-center transition-all duration-300 shadow-xs group-hover:scale-110">
            <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-white/90 transition-colors">
            {stepNumber}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[#202124] group-hover:text-white mb-2 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#6B7280] group-hover:text-white/95 leading-relaxed transition-colors">
          {item.desc}
        </p>
      </div>
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-gray-100 group-hover:border-white/20 flex items-center justify-between text-[11px] font-semibold text-[#F58220] group-hover:text-white transition-colors">
        <span>Verified Standard</span>
        <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}

export default function Home() {
  const capabilities = [
    {
      icon: ShieldCheck,
      title: "Statutory Sanctions & Clear Titles",
      desc: "Every development by Skandha Groups complies with strict regulatory town planning guidelines, layout sanctions, and verified undisputed legal titles."
    },
    {
      icon: Compass,
      title: "100% Vasthu-Compliant Planning",
      desc: "Thoughtfully oriented residential parcels and internal road grids engineered meticulously according to authentic Vasthu principles."
    },
    {
      icon: Building2,
      title: "Engineered Civic Infrastructure",
      desc: "Wide blacktop (B.T.) roads, deep underground drainage networks, overhead water reservoirs, and modern aesthetic street lighting."
    },
    {
      icon: Trees,
      title: "Green Parks & Avenue Plantation",
      desc: "Dedicated open green zones, children's adventure playgrounds, walking tracks, and systematic avenue tree plantation."
    },
    {
      icon: Clock,
      title: "Immediate Spot Registration",
      desc: "Direct and transparent registration protocols with zero delays once you select your preferred parcel orientation and dimensions."
    },
    {
      icon: Award,
      title: "2-Year Complimentary Maintenance",
      desc: "Round-the-clock security personnel, compound perimeter fencing, and full civic infrastructure upkeep provided post-handover."
    }
  ];

  // First 3 cards (move left to right) and next 3 cards (move right to left)
  const firstThreeStandards = capabilities.slice(0, 3);
  const nextThreeStandards = capabilities.slice(3, 6);
  // Duplicate sets for seamless infinite loop on any screen resolution
  const row1Cards = [...firstThreeStandards, ...firstThreeStandards];
  const row2Cards = [...nextThreeStandards, ...nextThreeStandards];

  const whyChooseUs = [
    {
      num: "01",
      title: "Strategic High-Growth Corridors",
      description: "We identify and develop land parcels in premier expansion zones characterized by major infrastructure, expressways, and economic hubs."
    },
    {
      num: "02",
      title: "Uncompromising Legal Diligence",
      description: "Our legal and planning teams conduct comprehensive due diligence to ensure every plot comes with 100% clear titles and hassle-free ownership."
    },
    {
      num: "03",
      title: "High-Standard Civil Engineering",
      description: "From durable blacktop roads to underground drainage and dedicated overhead water tanks, we build communities that last for generations."
    },
    {
      num: "04",
      title: "Steady Long-Term Appreciation",
      description: "Investing with Skandha Groups ensures strong capital appreciation whether you plan to build a custom villa or secure family wealth."
    }
  ];

  const statMetrics = [
    { value: "100%", label: "Clear Titles Guaranteed", icon: ShieldCheck },
    { value: "100%", label: "Vasthu Compliant Layouts", icon: Compass },
    { value: "40' & 33'", label: "Wide B.T. Roads Network", icon: Layers },
    { value: "2 Years", label: "Complimentary Maintenance", icon: Award }
  ];

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Animated Metrics & Performance Bar */}
      <section className="bg-[#202124] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {statMetrics.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-gray-800/40 border border-gray-700/50 hover:border-[#F58220]/50 transition-all duration-300 transform hover:-translate-y-1 text-center sm:text-left"
              >
                <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2 text-[#F58220]">
                  <Icon className="w-5 h-5" />
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
                    {stat.value}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Company Introduction Band */}
      <section className="py-20 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column with High-Resolution Image & Floating Badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-xl bg-gray-50 group">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85"
                  alt="Skandha Groups Masterplanned Communities"
                  className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="p-6 bg-white border-t border-gray-100 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F58220] uppercase">
                    <Sparkles className="w-4 h-4 text-[#F58220]" />
                    <span>The Skandha Promise</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#202124] mt-1">
                    "Locate yourself at the most desirable place"
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                    Providing peaceful, legally secure real estate foundations for forward-thinking homeowners and investors.
                  </p>
                </div>
              </div>
            </div>

            {/* Typography Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                  About Skandha Groups
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] mt-1 tracking-tight">
                  Crafting Masterplanned Communities Across High-Growth Corridors
                </h2>
              </div>

              <p className="text-base text-[#6B7280] leading-relaxed">
                <strong className="text-[#202124]">Skandha Groups</strong> is a premier real estate and infrastructure development enterprise headquartered in Hastinapuram, Hyderabad. We specialize in developing legally flawless, sanctioned gated layout communities that seamlessly balance modern urban infrastructure with serene natural surroundings.
              </p>

              <p className="text-base text-[#6B7280] leading-relaxed">
                With a steadfast commitment to transparent documentation, prompt spot registrations, and robust engineering, Skandha Groups is the trusted partner for families and investors seeking secure, value-appreciating land ownership.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#F58220] hover:text-[#E07016] transition-colors"
                >
                  <span>Learn more about our corporate vision & leadership</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Business Capabilities & Development Standards */}
      <section className="py-20 bg-[#F7F7F7] border-b border-[#E5E7EB] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
              Our Development Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] mt-2">
              Engineered for Enduring Community Value
            </h2>
            <p className="text-base text-[#6B7280] mt-3">
              We adhere to strict engineering, ecological, and legal protocols to guarantee every project delivers lifetime appreciation and hassle-free ownership.
            </p>
          </div>
        </div>

        {/* Dual Direction Marquee Rows */}
        <div className="w-full space-y-6">
          {/* Row 1: First 3 cards moving Left to Right */}
          <div className="relative w-full overflow-hidden py-1">
            {/* Gradient edge masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 md:w-28 bg-gradient-to-r from-[#F7F7F7] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 md:w-28 bg-gradient-to-l from-[#F7F7F7] to-transparent z-10" />

            {/* Marquee Track: Left to Right */}
            <div className="flex w-max animate-marquee-ltr hover:[animation-play-state:paused]">
              <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
                {row1Cards.map((item, idx) => (
                  <StandardCard key={`r1-a-${idx}`} item={item} stepNumber={`0${(idx % 3) + 1}`} />
                ))}
              </div>
              <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6" aria-hidden="true">
                {row1Cards.map((item, idx) => (
                  <StandardCard key={`r1-b-${idx}`} item={item} stepNumber={`0${(idx % 3) + 1}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Next 3 cards moving Right to Left */}
          <div className="relative w-full overflow-hidden py-1">
            {/* Gradient edge masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 md:w-28 bg-gradient-to-r from-[#F7F7F7] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 md:w-28 bg-gradient-to-l from-[#F7F7F7] to-transparent z-10" />

            {/* Marquee Track: Right to Left */}
            <div className="flex w-max animate-marquee-rtl hover:[animation-play-state:paused]">
              <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
                {row2Cards.map((item, idx) => (
                  <StandardCard key={`r2-a-${idx}`} item={item} stepNumber={`0${(idx % 3) + 4}`} />
                ))}
              </div>
              <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6" aria-hidden="true">
                {row2Cards.map((item, idx) => (
                  <StandardCard key={`r2-b-${idx}`} item={item} stepNumber={`0${(idx % 3) + 4}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Strategic Advantages */}
      <section className="py-20 bg-[#202124] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                Strategic Advantages
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Why Discerning Buyers Choose Skandha Groups
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Investing in land requires trust, legal certainty, and strategic foresight. Skandha Groups combines all three to deliver secure investments in prime growth corridors.
              </p>

              <div className="pt-2">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#F58220] hover:bg-[#E07016] text-white shadow-lg transition-colors cursor-pointer"
                >
                  <span>Explore Our Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyChooseUs.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gray-800/60 border border-gray-700/60 text-left hover:border-[#F58220]/50 transition-colors transform hover:-translate-y-1 duration-200"
                >
                  <span className="text-2xl font-extrabold text-[#F58220] block mb-2 font-mono">
                    {item.num}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 7. Curated Media Gallery Preview (Crystal Clear Images) */}
      <section className="py-20 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                Visual Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] mt-1">
                Architectural Elevations & Community Landscapes
              </h2>
              <p className="text-sm text-[#6B7280] mt-2 max-w-xl">
                Explore high-definition imagery of our architectural concepts, parks, avenue plantations, and infrastructure.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#F58220] hover:text-[#E07016] transition-colors"
              >
                <span>Browse Full Gallery (12 High-Res Photos)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <GalleryGrid initialLimit={6} showFilters={false} />
        </div>
      </section>

      {/* 8. Call To Action Band */}
      <CallToAction 
        title="Ready to Build Your Legacy with Skandha Groups?"
        subtitle="Schedule a consultation with our senior advisory team at our Hastinapuram corporate office."
      />
    </div>
  );
}
