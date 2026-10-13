import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Mail,
  Send,
  CheckCircle,
  MessageCircle,
  ShieldCheck,
  Navigation,
  Compass,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { submitLead, fetchPlots, trackActivityEvent } from '../api/client';
import Layout2DView from '../visualizer/Layout2DView';
import { getEnrichedPlots } from '../visualizer/masterPlanData';

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

  // Interactive Map State
  const [plots, setPlots] = useState(() => getEnrichedPlots());
  const [selectedPlot, setSelectedPlot] = useState(null);

  useEffect(() => {
    fetchPlots({ all: 'true' })
      .then(res => {
        if (res.success && res.plots) {
          setPlots(getEnrichedPlots(res.plots));
        }
      })
      .catch(err => {
        console.warn('Using enriched plots fallback:', err);
      });
  }, []);

  const handleSelectPlotOnMap = (plot) => {
    setSelectedPlot(plot);
    if (plot) {
      setFormData(prev => ({
        ...prev,
        message: prev.message && !prev.message.includes('Plot #')
          ? `${prev.message}\nInterested in Plot #${plot.plotNumber} (${plot.facing} Facing, ${plot.areaSqYds} Sq.Yards).`
          : `I am interested in Plot #${plot.plotNumber} (${plot.facing} Facing, ${plot.areaSqYds} Sq.Yards). Please share availability, layout demarcations, and spot registration details.`
      }));
    }
  };

  const officeAddress = (settings && settings.officeAddress) || '# 8-7-91/17/1, 4th Floor Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana -500079';
  const email = (settings && settings.contactEmail) || 'contact@skandhagroup.com';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900 leading-tight">
          Connect With Skandha Group
        </h1>
        <p className="text-base text-slate-600 font-light">
          Have questions about plot dimensions, spot registration dates, or scheduling a personalized site visit to Alekhya's Brundavan, Kadthal? Submit your enquiry below or interact directly with the layout map.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          {result ? (
            <div className="py-10 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Enquiry Successfully Logged!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for your interest in Alekhya's Brundavan. Our verified sales advisor will get in touch with you shortly.
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
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-slate-900">
                  Verified Enquiry Form
                </h2>
                {selectedPlot && (
                  <span className="text-xs bg-orange-50 text-brand-orange border border-orange-200 px-2.5 py-1 rounded-lg font-bold">
                    Plot #{selectedPlot.plotNumber} Selected
                  </span>
                )}
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
                  Message / Plot Requirements
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your preferred plot size (e.g. 183 or 202 sq.yds), preferred facing, or requested site visit date..."
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
                  I give consent to Skandha Group to contact me regarding Alekhya's Brundavan project availability, verified pricing, and spot registration details.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow hover:shadow-md transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Recording enquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Official Enquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Office Details & Location Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Corporate Office Information
            </h3>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
                <div>
                  <strong className="block text-slate-900">Skandha Group Headquarters:</strong>
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
                  <strong className="block text-slate-900">Statutory Clearances:</strong>
                  <span>DTCP: TLP NO. 87/2024/H | TS RERA: PO2400009081</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
              <strong>Office Visiting Hours:</strong> Monday through Saturday, 9:30 AM to 6:30 PM. Site visits to Kadthal are organized daily with prior appointment.
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Maisigandi+Temple+Kadthal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-3 px-4 rounded-xl text-xs shadow-xs transition-all"
              >
                <Navigation className="w-4 h-4 text-brand-orange" />
                <span>Get Driving Directions to Kadthal Site</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Master Plan Layout Map Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Interactive Master Plan
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Adjoining Srisailam Highway (NH 765), Kadthal
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Alekhya's Brundavan — Layout &amp; Location Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pan, zoom, or click any plot on the interactive master plan to inspect details and auto-fill your enquiry form.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://maps.google.com/?q=Maisigandi+Temple+Kadthal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-brand-orange" />
              <span>Get Site Directions</span>
            </a>
            <a
              href="/plots"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Full 3D / 2D Explorer</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* Selected plot details bar if user clicked a plot */}
        {selectedPlot && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-900 text-sm bg-white px-2.5 py-1 rounded-lg border border-orange-200">
                Plot #{selectedPlot.plotNumber}
              </span>
              <span className="text-slate-700">
                Facing: <strong>{selectedPlot.facing}</strong>
              </span>
              <span className="text-slate-700">
                Area: <strong>{selectedPlot.areaSqYds} Sq.Yards</strong>
              </span>
              <span className="text-slate-700">
                Dimensions: <strong>{selectedPlot.dimensions}</strong>
              </span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                100% Vasthu Compliant
              </span>
            </div>
            <button
              onClick={() => setSelectedPlot(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Interactive 2D Map Container */}
        <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 bg-[#E8F2E6]">
          <Layout2DView
            plots={plots}
            selectedPlot={selectedPlot}
            onSelectPlot={handleSelectPlotOnMap}
            filterStatus="all"
            filterFacing="all"
            searchTerm=""
          />
        </div>
      </section>
    </div>
  );
}
