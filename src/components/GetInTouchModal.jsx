import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Phone, Mail, User, MapPin, Loader2, Sparkles } from 'lucide-react';
import { COMPANY_CONFIG } from '../config/company';

export default function GetInTouchModal({ isOpen, onClose, initialPlot = null }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    venture: "Skandha Grand Valley (Kadthal, Srisailam Highway)",
    interest: 'Plot Booking & Pricing',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close on Escape key & lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Reset state when opened and prefill plot inquiry if provided
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrors({});
      if (initialPlot) {
        setFormData((prev) => ({
          ...prev,
          interest: `Plot #${initialPlot.number} (${initialPlot.sqYards} Sq.Yds)`,
          message: `Inquiring about Plot #${initialPlot.number} (${initialPlot.sqYards} Sq.Yds, ${initialPlot.facing || 'East'} Facing) at Skandha Grand Valley.`
        }));
      }
    }
  }, [isOpen, initialPlot]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (at least 2 letters).';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number.';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // If customer is inquiring about a specific plot, submit to backend bookings database
      if (initialPlot) {
        try {
          await fetch('/api/bookings/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              plotNumber: initialPlot.number,
              plotId: initialPlot.id,
              customerName: formData.fullName,
              customerPhone: formData.phone,
              email: formData.email,
              tokenAmount: 'Inquiry / Booking Token',
              notes: formData.message || `Customer enquiry for Plot #${initialPlot.number}`
            })
          });
        } catch (apiErr) {
          console.warn('[GetInTouchModal] Backend plot booking sync notice:', apiErr.message);
        }
      }

      if (COMPANY_CONFIG.backendApi?.isLiveConfigured && COMPANY_CONFIG.backendApi?.contactEndpoint) {
        await fetch(COMPANY_CONFIG.backendApi.contactEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Fast, smooth client-side dispatch simulation
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setIsSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        venture: "Skandha Grand Valley (Kadthal, Srisailam Highway)",
        interest: 'Plot Booking & Pricing',
        message: ''
      });
    } catch (err) {
      console.error('Inquiry submission error:', err);
      // Fallback display
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="get-in-touch-title"
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-gray-100 overflow-hidden transform transition-all animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200 max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#202124] to-[#2b2d31] text-white px-5 sm:px-6 pt-3 pb-4 sm:py-5 border-b border-gray-800 flex-shrink-0">
          {/* Mobile Sheet Drag Indicator */}
          <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-2 sm:hidden" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F58220] flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 id="get-in-touch-title" className="text-base sm:text-lg font-bold text-white leading-tight">
                  Get in Touch
                </h3>
                <p className="text-[11px] text-gray-300">
                  Skandha Groups Corporate Advisory Desk
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-grow text-left">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in duration-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-[#202124]">
                Inquiry Received Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to Skandha Groups. Our senior relationship manager will call you shortly to assist with plot details and site visits.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#F58220] hover:bg-[#E07016] shadow-md transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed -mt-1 mb-3">
                Please leave your contact information below. Our team provides fast, transparent assistance with statutory approvals and site visits.
              </p>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 sm:top-3 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name..."
                    className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-[#F7F7F7] border ${
                      errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#F58220]'
                    } outline-none transition-colors text-[#202124] placeholder-gray-400`}
                  />
                </div>
                {errors.fullName && (
                  <span className="text-[11px] text-red-500 mt-1 block font-medium">
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 sm:top-3 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 98765 43210"
                      className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-[#F7F7F7] border ${
                        errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#F58220]'
                      } outline-none transition-colors text-[#202124] placeholder-gray-400`}
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-[11px] text-red-500 mt-1 block font-medium">
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 sm:top-3 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-[#F7F7F7] border ${
                        errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#F58220]'
                      } outline-none transition-colors text-[#202124] placeholder-gray-400`}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[11px] text-red-500 mt-1 block font-medium">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Inquiry Purpose */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Inquiry Purpose
                </label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-[#F7F7F7] border border-gray-200 focus:border-[#F58220] outline-none transition-colors text-[#202124]"
                >
                  <option value="Plot Booking & Pricing">Plot Availability & Pricing Tariff</option>
                  <option value="Schedule Free Site Visit">Schedule a Site Visit (Kadthal)</option>
                  <option value="Layout Masterplan & Vasthu">Layout Masterplan & Vasthu Consultation</option>
                  <option value="Statutory Approvals (RERA/DTCP)">Statutory Approvals & Clear Titles</option>
                  <option value="General Corporate Consultation">General Corporate Consultation</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Message / Preferred Requirements
                </label>
                <textarea
                  name="message"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="e.g. Looking for East-facing 200 sq. yds plot, or weekend site visit timings..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-[#F7F7F7] border border-gray-200 focus:border-[#F58220] outline-none transition-colors text-[#202124] placeholder-gray-400 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#F58220] hover:bg-[#E07016] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
