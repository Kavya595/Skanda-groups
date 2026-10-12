import React from 'react';
import ContactForm from '../components/ContactForm';
import { COMPANY_CONFIG } from '../config/company';
import { 
  MapPin, 
  Mail, 
  Clock 
} from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-white">
      {/* 1. Contact Page Hero */}
      <section className="bg-gradient-to-b from-[#FFF5EC] to-white py-16 lg:py-20 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F58220]/30 text-xs font-bold text-[#F58220] uppercase tracking-wider mb-4 shadow-sm">
            <Mail className="w-4 h-4 text-[#F58220]" />
            <span>Direct Client Services & Corporate Desk</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#202124] tracking-tight leading-tight">
            Connect with Skandha Groups
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] mt-4 leading-relaxed">
            Have questions regarding our developments, statutory standards, or corporate consultations? Our advisory team is ready to assist you.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Section: Cards + Form */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Contact Details Cards & Location */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                  Get In Touch
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124] mt-1">
                  Visit Our Corporate Office
                </h2>
                <p className="text-sm text-[#6B7280] mt-2">
                  We welcome buyers and channel partners to our Hastinapuram headquarters for personalized consultations.
                </p>
              </div>

              {/* Office Address Card */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#F58220] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF5EC] text-[#F58220] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase text-[#202124] tracking-wider">
                      Registered Office
                    </h3>
                    <address className="not-italic text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                      {COMPANY_CONFIG.address.doorNo}, {COMPANY_CONFIG.address.building}<br />
                      {COMPANY_CONFIG.address.street}<br />
                      {COMPANY_CONFIG.address.city}, {COMPANY_CONFIG.address.state} - {COMPANY_CONFIG.address.pincode}
                    </address>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#F58220] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF5EC] text-[#F58220] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase text-[#202124] tracking-wider">
                      Email Inquiries
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1">
                      For corporate proposals, partnerships, and legal queries:
                    </p>
                    <a
                      href={`mailto:${COMPANY_CONFIG.contact.email}`}
                      className="inline-block mt-2 text-sm font-bold text-[#F58220] hover:underline"
                    >
                      {COMPANY_CONFIG.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="p-6 rounded-2xl bg-[#F7F7F7] border border-[#E5E7EB]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 text-[#202124] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-[#202124] tracking-wider">
                      Corporate Office Hours
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                      {COMPANY_CONFIG.contact.workingHours}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* 3. Office Map Locator Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-md bg-gray-100">
            <div className="p-6 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#202124]">
                  Corporate Office Location Map
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Hastinapuram,Hyderabad,Telangana"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#F58220] hover:underline"
              >
                Open in Google Maps &rarr;
              </a>
            </div>
            
            <div className="aspect-[21/9] sm:aspect-[21/7] w-full">
              <iframe
                title="Skandha Groups Office Location"
                src={COMPANY_CONFIG.address.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
