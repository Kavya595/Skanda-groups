import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Send,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Navigation,
  Compass,
  Clock,
  Car,
  Plane,
  Building,
  Sparkles,
  ExternalLink,
  Map as MapIcon,
  Maximize2,
  PhoneCall,
  Calendar,
  X
} from 'lucide-react';
import { submitLead, trackActivityEvent } from '../api/client';

export default function ContactPage({ settings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContactMethod: 'whatsapp',
    message: '',
    consent: true,
    hp_website: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [activeMapView, setActiveMapView] = useState('google'); // 'google' or 'flyer'
  const [isFlyerZoomed, setIsFlyerZoomed] = useState(false);

  const officeAddress = (settings && settings.officeAddress) || '# 8-7-91/17/1, 4th Floor Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana -500079';
  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';
  const reraNo = (settings && settings.reraNumber) || 'PO2400009081';
  const dtcpNo = (settings && settings.dtcpNumber) || 'TLP NO. 87/2024/H';

  const connectivityHighlights = [
    { title: 'Maisigandi Temple', duration: '1 Min Drive', desc: 'Direct access via proposed 60ft arterial layout road', icon: Sparkles },
    { title: 'Srisailam Highway (NH 765)', duration: '2 Min Drive', desc: '4-lane high-speed corridor connecting directly to Hyderabad', icon: Car },
    { title: 'Kadthal Town & Municipality', duration: '3 Min Drive', desc: 'Established administrative hub with schools, banking & retail', icon: Building },
    { title: 'Mucherla Future City & AI Hub', duration: '10 Min Drive', desc: 'Telangana mega economic corridor & Life Sciences development zone', icon: Building },
    { title: 'ORR Exit 14 & Wonderla', duration: '15 Min Drive', desc: 'Outer Ring Road arterial junction for rapid city transit', icon: Navigation },
    { title: 'RGIA Shamshabad Airport', duration: '20 Min Drive', desc: 'Direct signal-free connectivity via Srisailam Highway & ORR', icon: Plane }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await submitLead(formData);
      if (res.success) {
        setResult(res);
        trackActivityEvent('enquiry_submitted', null, { source: 'contact_page' });
        if (res.whatsappUrl) {
          try {
            window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
          } catch {
            // Fallback if browser blocks automatic popups
          }
        }
      } else {
        setError(res.error || 'Failed to submit enquiry');
      }
    } catch (err) {
      setError(err.message || 'Error sending enquiry');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (result && result.whatsappUrl) {
      window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-[#000000] text-slate-100 space-y-16 pb-20">
      {/* ========================================================== */}
      {/* 1. HERO SECTION                                            */}
      {/* ========================================================== */}
      <section className="relative bg-gradient-to-b from-[#07090e] via-[#0b0e14] to-[#000000] py-16 sm:py-20 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-brand-orange/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
            <span className="h-px w-8 bg-brand-orange/40" />
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            LOCATION &amp; CONTACT
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            <span className="h-px w-8 bg-brand-orange/40" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Locate Our Kadthal Project
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Situated adjoining Srisailam Highway (NH 765) at Kadthal, right in the high-growth orbit of Mucherla Future City. Connect with Skandha Group advisors or schedule a guided site tour.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs text-slate-300">
            <a
              href="https://wa.me/919100031199?text=Hi%2C%20I%20am%20interested%20in%20visiting%20Skandha%20Group%20plots%20at%20Kadthal."
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors inline-flex items-center gap-2 font-medium"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Sales Desk</span>
            </a>
            <span>&bull;</span>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-orange" />
              <span>{email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 2. CONNECTIVITY METRICS RIBBON                             */}
      {/* ========================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {connectivityHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#0c0f17] p-4 rounded-2xl border border-slate-800 shadow-xs hover:border-brand-orange/40 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-brand-orange flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white leading-snug line-clamp-1">
                  {item.title}
                </div>
                <div className="text-sm font-extrabold text-brand-orange mt-0.5">
                  {item.duration}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-tight line-clamp-2">
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. LOCATION MAP & APPROACH ROUTES                          */}
      {/* ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0c0f17] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                OFFICIAL CONNECTIVITY
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Project Location &amp; Approach Routes
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Switch between the live interactive Google Map and the official approach plan showing proximity to ORR Exit 14 and Maisigandi Temple.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* View Switcher Tabs */}
              <div className="bg-[#121622] p-1 rounded-xl flex items-center border border-slate-700">
                <button
                  onClick={() => setActiveMapView('google')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeMapView === 'google'
                      ? 'bg-brand-orange text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Google Map</span>
                </button>
                <button
                  onClick={() => setActiveMapView('flyer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeMapView === 'flyer'
                      ? 'bg-brand-orange text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Official Route Map</span>
                </button>
              </div>

              {activeMapView === 'flyer' && (
                <button
                  onClick={() => setIsFlyerZoomed(true)}
                  className="inline-flex items-center gap-1.5 bg-[#141824] hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Zoom Map</span>
                </button>
              )}

              <a
                href="https://maps.google.com/?q=Maisigandi+Temple+Kadthal+Telangana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Driving Directions</span>
              </a>
            </div>
          </div>

          {/* Map Viewer Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#07090e] min-h-[420px]">
            {activeMapView === 'google' ? (
              <iframe
                title="Google Maps Location"
                src="https://maps.google.com/maps?q=Kadthal%20Maisigandi%20Temple%20Telangana&t=m&z=12&output=embed&iwloc=near"
                className="w-full h-[450px] border-0"
                loading="lazy"
              />
            ) : (
              <div
                onClick={() => setIsFlyerZoomed(true)}
                className="cursor-zoom-in relative group p-4 flex items-center justify-center bg-[#07090e]"
              >
                <img
                  src="/assets/flyer_page_2_location_map.png"
                  alt="Official Flyer Location Route Map"
                  className="w-full max-h-[500px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                />
                <div className="absolute bottom-4 right-4 bg-[#0c0f17]/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-bold shadow flex items-center gap-1.5 pointer-events-none">
                  <Maximize2 className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Click to enlarge map</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 4. OFFICE DETAILS & ENQUIRY FORM                            */}
      {/* ========================================================== */}
      <section id="contact-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Office Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                <span className="h-px w-6 bg-brand-orange/40" />
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                OFFICE LOCATIONS
                <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
                <span className="h-px w-6 bg-brand-orange/40" />
              </div>
              <h2 className="font-serif text-3xl font-extrabold text-white leading-tight">
                Corporate Office &amp; Site Desk
              </h2>
            </div>

            {/* Head Office Card */}
            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-slate-800 shadow-sm space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-orange flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span>Corporate Headquarters</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="leading-relaxed">{officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-brand-orange">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="https://wa.me/919100031199?text=Hi%2C%20I%20am%20interested%20in%20Skandha%20Group%20plots%20at%20Kadthal."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct WhatsApp Channel</span>
                </a>
              </div>
            </div>

            {/* Site Office Card */}
            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-slate-800 shadow-sm space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Project Site Office &bull; Kadthal</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adjoining Srisailam Highway (NH 765), Kadthal Mandal, Ranga Reddy District, Telangana - 509358 (1 Min from Maisigandi Temple).
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-orange">
                <Clock className="w-3.5 h-3.5" />
                <span>Open 7 Days a Week: 9:30 AM &ndash; 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7 bg-[#0c0f17] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                <span>Enquire or Book Visit</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Connect With Skandha Group
              </h3>
              <p className="text-xs text-slate-400">
                Submit your enquiry. Our official advisory desk will confirm your scheduled visit and provide full plot pricing via WhatsApp.
              </p>
            </div>

            {result ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Enquiry Confirmed!</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you! Your details have been securely logged. Our dedicated relationship manager will reach out shortly.
                </p>
                {result.whatsappUrl && (
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Chat Directly</span>
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-5">
                {error && (
                  <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
                    {error}
                  </div>
                )}

                <input
                  type="text"
                  name="hp_website"
                  value={formData.hp_website}
                  onChange={e => setFormData({ ...formData, hp_website: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Full Name <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-[#121622] border border-slate-700 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Phone Number <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 rounded-xl bg-[#121622] border border-slate-700 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#121622] border border-slate-700 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Preferred Communication Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                      { id: 'call', label: 'Phone Call', icon: PhoneCall },
                      { id: 'email', label: 'Email', icon: Mail }
                    ].map(method => {
                      const Icon = method.icon;
                      const isSelected = formData.preferredContactMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, preferredContactMethod: method.id })}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                            isSelected
                              ? 'bg-orange-500/20 border-brand-orange text-brand-orange font-bold'
                              : 'bg-[#121622] border-slate-700 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Message or Plot Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Let us know what plot dimensions, orientations, or visit dates you prefer..."
                    className="w-full px-4 py-3 rounded-xl bg-[#121622] border border-slate-700 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enquiry &bull; Connect on WhatsApp</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center pt-1">
                  DTCP: {dtcpNo} &bull; TS RERA: {reraNo}. Instant spot registration with clear legal titles.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Route Map Zoom Modal */}
      {isFlyerZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsFlyerZoomed(false)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] bg-[#0c0f17] border border-slate-800 rounded-3xl p-4 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFlyerZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full shadow transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/assets/flyer_page_2_location_map.png"
              alt="Official Location Map Full View"
              className="max-h-[85vh] w-auto object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
