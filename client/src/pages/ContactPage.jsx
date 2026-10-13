import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Send,
  CheckCircle,
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
  Maximize2
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Editorial Luxury Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold uppercase tracking-wider text-brand-orange">
          <MapPin className="w-3.5 h-3.5" />
          <span>Strategic Location &bull; Kadthal Corridor</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900 tracking-tight leading-tight">
          Locate Alekhya's Brundavan
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
          Situated adjoining Srisailam Highway (NH 765) at Kadthal, right in the high-growth orbit of Mucherla Future City. Connect with Skandha Group advisors or schedule a guided site tour.
        </p>
      </div>

      {/* Connectivity Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {connectivityHighlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-200 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                {item.title}
              </div>
              <div className="text-sm font-extrabold text-brand-orange mt-0.5">
                {item.duration}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 leading-tight line-clamp-2">
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section: Comprehensive Location Map Showcase */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Official Connectivity &bull; Kadthal
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Adjoining NH 765 Srisailam Highway
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Project Location &amp; Approach Routes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Switch between the live interactive Google Map and the official Flyer Route Map showing proximity to ORR Exit 14 and Pharma City.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setActiveMapView('google')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMapView === 'google'
                    ? 'bg-white text-brand-orange shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Google Map</span>
              </button>
              <button
                onClick={() => setActiveMapView('flyer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMapView === 'flyer'
                    ? 'bg-white text-brand-orange shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Flyer Route Map</span>
              </button>
            </div>

            <a
              href="https://maps.google.com/?q=Maisigandi+Temple+Kadthal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* Map Display Frame */}
        <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
          {activeMapView === 'google' ? (
            <div className="w-full h-full relative">
              <iframe
                title="Alekhya's Brundavan Location on Google Maps"
                src="https://maps.google.com/maps?q=Maisigandi+Maha+Maisamma+Temple+Kadthal+Telangana&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg text-xs font-medium text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Site Coordinates: 17.0985&deg; N, 78.5085&deg; E &bull; Kadthal Mandal</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-950/5 relative overflow-hidden group">
              <img
                src="/assets/route_map_hd.png"
                alt="Alekhya's Brundavan Official Flyer Location & Route Map"
                className="max-h-full max-w-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
                onClick={() => setIsFlyerZoomed(true)}
              />
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow flex items-center gap-1.5 pointer-events-none">
                <Maximize2 className="w-3.5 h-3.5 text-brand-orange" />
                <span>Click image to zoom route map</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form & Corporate Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          {result ? (
            <div className="py-10 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Enquiry Successfully Logged!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for connecting with Skandha Group. A dedicated sales advisor will contact you with full site documentation and scheduling options.
              </p>

              {result.whatsappUrl && (
                <div className="pt-4 max-w-md mx-auto">
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Continue Dialogue On WhatsApp</span>
                  </button>
                  <p className="text-xs text-slate-400 mt-2">
                    Connect immediately with dedicated project coordinators on WhatsApp
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  Request Information &bull; Site Visit Booking
                </h2>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Direct Skandha Advisory
                </span>
              </div>

              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="hp_website"
                  tabIndex="-1"
                  autoComplete="off"
                  value={formData.hp_website}
                  onChange={(e) => setFormData({ ...formData, hp_website: e.target.value })}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Murthy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="anand@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9848012345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Communication
                  </label>
                  <select
                    value={formData.preferredContactMethod}
                    onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="email">Detailed Email</option>
                    <option value="phone">Direct Phone Call</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Site Visit Preference
                </label>
                <textarea
                  rows="4"
                  placeholder="Please let us know your preferred plot size (e.g. 183 to 300 sq.yds), preferred facing, or requested date for a complimentary guided site tour..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="contactConsent"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 rounded text-brand-orange focus:ring-orange-500 border-slate-300"
                />
                <label htmlFor="contactConsent" className="text-xs text-slate-600 leading-snug">
                  I give consent to Skandha Group to contact me regarding Alekhya's Brundavan project specifications and spot registration details.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow hover:shadow-md transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Transmitting inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Official Enquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Corporate Office & Statutory Credentials */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Corporate Headquarters
            </h3>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
                <div>
                  <strong className="block text-slate-900">Skandha Group Registered Office:</strong>
                  <span className="leading-relaxed">{officeAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
                <div>
                  <strong className="block text-slate-900">Direct Inquiries Email:</strong>
                  <a href={`mailto:${email}`} className="text-brand-orange hover:underline">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <strong className="block text-slate-900">Statutory Approvals:</strong>
                  <span>DTCP: {dtcpNo} &bull; TS RERA: {reraNo}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
              <strong>Office Working Hours:</strong> Monday through Saturday, 9:30 AM to 6:30 PM. Daily escorted site visits to Kadthal are available with prior appointment.
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal for Flyer Route Map */}
      {isFlyerZoomed && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsFlyerZoomed(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-white rounded-3xl p-3 shadow-2xl overflow-hidden">
            <button
              onClick={() => setIsFlyerZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full shadow transition-colors"
            >
              &times;
            </button>
            <img
              src="/assets/route_map_hd.png"
              alt="Alekhya's Brundavan Full Route Map"
              className="max-h-[85vh] w-auto object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
