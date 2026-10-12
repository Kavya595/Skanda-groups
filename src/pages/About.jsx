import React from 'react';
import CallToAction from '../components/CallToAction';
import { COMPANY_CONFIG } from '../config/company';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  HeartHandshake, 
  Award, 
  MapPin
} from 'lucide-react';

export default function About() {
  const coreValues = [
    {
      title: "Integrity & Statutory Compliance",
      desc: "We build on clear foundations. Every development under Skandha Groups strictly complies with sanctioned town planning frameworks and undisputed legal titles.",
      icon: ShieldCheck
    },
    {
      title: "100% Vasthu Alignment",
      desc: "We honor timeless architectural wisdom. All residential layouts are planned in strict adherence to authentic Vasthu principles for harmony and peace.",
      icon: Target
    },
    {
      title: "Transparency & Instant Registration",
      desc: "Zero hidden conditions, verified clear titles, and prompt spot registration upon agreement ensure complete client peace of mind.",
      icon: Award
    },
    {
      title: "Customer-Centric Care & Maintenance",
      desc: "Our relationship continues well after plot registration. We provide two full years of complimentary security, layout maintenance, and civic upkeep.",
      icon: HeartHandshake
    }
  ];

  return (
    <div className="bg-white">
      {/* 1. About Hero Section */}
      <section className="bg-gradient-to-b from-[#FFF5EC] to-white py-16 lg:py-24 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white border border-[#F58220]/30 text-xs font-bold text-[#F58220] uppercase tracking-wider mb-4 shadow-sm">
            Corporate Profile & Philosophy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#202124] tracking-tight leading-tight">
            Building Trust. Creating Lasting Value for Generations.
          </h1>
          <p className="text-lg text-[#6B7280] mt-4 leading-relaxed">
            Headquartered in Hastinapuram, Hyderabad, Skandha Groups is dedicated to developing world-class, legally clear residential communities that balance modern infrastructure with natural serenity.
          </p>
        </div>
      </section>

      {/* 2. Company Overview & Background */}
      <section className="py-20 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                Our Background & Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] leading-tight">
                Rooted in Trust, Driven by Visionary Development
              </h2>
              <p className="text-base text-[#6B7280] leading-relaxed">
                Skandha Groups was founded on the fundamental principle that real estate investment must be safe, legally transparent, and located in pathways of genuine economic growth.
              </p>
              <p className="text-base text-[#6B7280] leading-relaxed">
                As Telangana’s capital expands along premier expressways and regional industrial hubs, Skandha Groups identifies high-potential land parcels, executes rigorous legal due diligence, secures comprehensive statutory sanctions, and creates self-sustaining residential layouts with wide blacktop roads, underground drainage, and lush green parks.
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F58220] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 leading-relaxed">
                  <strong>Corporate Headquarters:</strong> {COMPANY_CONFIG.address.full}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85"
                  alt="Skandha Groups Corporate Development Standards"
                  className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <div className="text-xs uppercase font-semibold text-orange-300">Development Philosophy</div>
                  <div className="text-lg font-bold">Planned for Today, Valued for Generations</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="py-20 bg-[#F7F7F7] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="bg-white hover:bg-[#F58220] rounded-3xl p-8 sm:p-10 border border-[#E5E7EB] hover:border-[#F58220] shadow-sm hover:shadow-2xl transition-all duration-300 text-left hover:-translate-y-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF5EC] text-[#F58220] group-hover:bg-white group-hover:text-[#F58220] flex items-center justify-center mb-6 transition-all duration-300 shadow-sm group-hover:scale-110">
                <Target className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F58220] group-hover:text-white/90 transition-colors">
                Our Mission
              </span>
              <h3 className="text-2xl font-bold text-[#202124] group-hover:text-white mt-1 mb-4 transition-colors">
                Transparent Land Ownership for Every Family
              </h3>
              <p className="text-sm text-[#6B7280] group-hover:text-white/95 leading-relaxed transition-colors">
                To provide families and investors with 100% legally clear, Vasthu-compliant, and fully sanctioned residential layouts in high-growth corridors. We strive to make the land buying process stress-free through immediate spot registration, complete statutory transparency, and long-term community maintenance.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white hover:bg-[#F58220] rounded-3xl p-8 sm:p-10 border border-[#E5E7EB] hover:border-[#F58220] shadow-sm hover:shadow-2xl transition-all duration-300 text-left hover:-translate-y-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF5EC] text-[#F58220] group-hover:bg-white group-hover:text-[#F58220] flex items-center justify-center mb-6 transition-all duration-300 shadow-sm group-hover:scale-110">
                <Eye className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F58220] group-hover:text-white/90 transition-colors">
                Our Vision
              </span>
              <h3 className="text-2xl font-bold text-[#202124] group-hover:text-white mt-1 mb-4 transition-colors">
                Setting the Benchmark for Plotted Communities
              </h3>
              <p className="text-sm text-[#6B7280] group-hover:text-white/95 leading-relaxed transition-colors">
                To become Telangana’s most trusted real estate enterprise, recognized for delivering top-tier civil infrastructure, eco-conscious green spaces, and high-appreciation plotted ventures along Hyderabad's growth corridors.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="py-20 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
            The Cornerstones of Our Business
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202124] mt-1 mb-12">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-white hover:bg-[#F58220] border border-[#E5E7EB] hover:border-[#F58220] text-left transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFF5EC] text-[#F58220] group-hover:bg-white group-hover:text-[#F58220] flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#202124] group-hover:text-white mb-2 transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] group-hover:text-white/95 leading-relaxed transition-colors">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Call to Action */}
      <CallToAction 
        title="Experience the Skandha Difference" 
        subtitle="Contact our Hastinapuram office today to schedule a personal corporate consultation or project inquiry."
      />
    </div>
  );
}
