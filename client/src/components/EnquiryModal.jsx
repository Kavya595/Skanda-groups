import React, { useState } from 'react';
import { X, CheckCircle, Send, MessageCircle } from 'lucide-react';
import { submitLead, trackActivityEvent } from '../api/client';

export default function EnquiryModal({ isOpen, onClose, prefilledPlot }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContactMethod: 'whatsapp',
    message: prefilledPlot ? `Inquiring about Plot #${prefilledPlot.plotNumber} (${prefilledPlot.areaSqYds} sq.yds, ${prefilledPlot.facing} facing).` : '',
    consent: true,
    hp_website: '' // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        plotNumber: prefilledPlot ? prefilledPlot.plotNumber : undefined
      };

      const res = await submitLead(payload);
      if (res.success) {
        setSuccessResult(res);
        trackActivityEvent('enquiry_submitted', prefilledPlot?.plotNumber, {
          preferredMethod: formData.preferredContactMethod
        });
      } else {
        setError(res.error || 'Failed to submit enquiry');
      }
    } catch (err) {
      setError(err.message || 'Error sending request. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (successResult && successResult.whatsappUrl) {
      window.open(successResult.whatsappUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {prefilledPlot ? `Enquire for Plot #${prefilledPlot.plotNumber}` : "Enquire with Skandha Group"}
            </h3>
            <p className="text-xs text-slate-500">
              Direct consultation from official Skandha Group sales advisors
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {successResult ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Enquiry Confirmed!</h4>
              <p className="text-sm text-slate-600 mt-2">
                Thank you! Your verified details have been securely logged into our system. Our team will contact you shortly.
              </p>
            </div>

            {successResult.whatsappUrl && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left space-y-3">
                <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Instant Connection Available
                </div>
                <p className="text-xs text-slate-700">
                  Would you like to connect directly via WhatsApp to receive layout brochures, pricing breakdown, and site visit schedules instantly?
                </p>
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Continue on WhatsApp</span>
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
            >
              Done / Close Window
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Honeypot field (hidden from genuine users) */}
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

            {prefilledPlot && (
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3 text-xs text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
                <div>
                  <span className="text-slate-500">Selected Plot:</span>{' '}
                  <strong className="text-brand-orange">#{prefilledPlot.plotNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Area:</span>{' '}
                  <strong>{prefilledPlot.areaSqYds} Sq.Yds</strong>
                </div>
                <div>
                  <span className="text-slate-500">Facing:</span>{' '}
                  <strong>{prefilledPlot.facing}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Dimensions:</span>{' '}
                  <strong>{prefilledPlot.dimensions}</strong>
                </div>
              </div>
            )}

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
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="ramesh@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Contact
                </label>
                <select
                  value={formData.preferredContactMethod}
                  onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="whatsapp">WhatsApp Consultation</option>
                  <option value="email">Email Detailed Brochure</option>
                  <option value="phone">Direct Phone Call</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message or Specific Questions
              </label>
              <textarea
                rows="3"
                placeholder="Ask about site visit, registration process, or payment schedules..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="consentCheck"
                required
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-1 rounded text-brand-orange focus:ring-orange-500 border-slate-300"
              />
              <label htmlFor="consentCheck" className="text-xs text-slate-600 leading-snug">
                I authorize Skandha Group to contact me regarding project details, verified DTCP approvals, and site availability.
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-6 rounded-lg text-sm shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting verified lead...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Verified Enquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
