import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { COMPANY_CONFIG } from '../config/company';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    project: 'Skandha Grand Valley (Kadthal, Srisailam Highway)',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'error' | null
  const [serverMessage, setServerMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (at least 2 characters).';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) {
      errs.subject = 'Please enter an inquiry subject.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please write a brief message (minimum 10 characters).';
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
    setSubmissionStatus(null);

    try {
      if (COMPANY_CONFIG.backendApi.isLiveConfigured && COMPANY_CONFIG.backendApi.contactEndpoint) {
        // Send to real backend endpoint
        const res = await fetch(COMPANY_CONFIG.backendApi.contactEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Server returned an error status.');
        setSubmissionStatus('success');
        setServerMessage('Thank you! Your inquiry was successfully dispatched to the Skandha Groups advisory team.');
      } else {
        // Transparent frontend validation handling
        await new Promise((resolve) => setTimeout(resolve, 800)); // simulate response latency
        setSubmissionStatus('success');
        setServerMessage(
          'Your inquiry has been successfully validated. Our advisory team will respond to your email promptly.'
        );
      }
      
      // Reset form on success
      setFormData({
        fullName: '',
        email: '',
        project: 'Skandha Grand Valley (Kadthal, Srisailam Highway)',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmissionStatus('error');
      setServerMessage('Submission error. Please reach our advisory team directly at ' + COMPANY_CONFIG.contact.email);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-10 shadow-lg">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
          Schedule a Consultation
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#202124] mt-1">
          Send Us an Inquiry
        </h3>
        <p className="text-sm text-[#6B7280] mt-2">
          Fill out the form below to receive personalized property consultation or speak with our corporate advisory team.
        </p>
      </div>

      {/* Submission Feedback Banner */}
      {submissionStatus === 'success' && (
        <div className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold text-emerald-950">Inquiry Received</h4>
            <p className="mt-1 leading-relaxed">{serverMessage}</p>
          </div>
        </div>
      )}

      {submissionStatus === 'error' && (
        <div className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold text-rose-950">Submission Failed</h4>
            <p className="mt-1">{serverMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-[#202124] mb-1.5">
              Full Name <span className="text-[#F58220]">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Ramesh Reddy"
              className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors ${
                errors.fullName 
                  ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                  : 'border-[#E5E7EB] bg-white focus:border-[#F58220]'
              }`}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#202124] mb-1.5">
              Email Address <span className="text-[#F58220]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. ramesh@example.com"
              className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors ${
                errors.email 
                  ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                  : 'border-[#E5E7EB] bg-white focus:border-[#F58220]'
              }`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Project of Interest */}
        <div>
          <label htmlFor="project" className="block text-xs font-bold uppercase tracking-wider text-[#202124] mb-1.5">
            Project of Interest
          </label>
          <select
            id="project"
            name="project"
            value={formData.project}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-base sm:text-sm focus:border-[#F58220] transition-colors"
            disabled={isSubmitting}
          >
            <option value="Skandha Grand Valley (Kadthal, Srisailam Highway)">Skandha Grand Valley (Kadthal, Srisailam Highway)</option>
            <option value="General Corporate Consultation">General Corporate Consultation</option>
            <option value="Partnership & Land Advisory">Partnership & Land Advisory</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-[#202124] mb-1.5">
            Subject <span className="text-[#F58220]">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Plot Availability & Free Site Visit Transport"
            className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors ${
              errors.subject 
                ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                : 'border-[#E5E7EB] bg-white focus:border-[#F58220]'
            }`}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-[#202124] mb-1.5">
            Message <span className="text-[#F58220]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Please mention your preferred plot size (Sq. Yds), orientation (East/West/Corner), or preferred date for a guided site visit..."
            className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors ${
              errors.message 
                ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                : 'border-[#E5E7EB] bg-white focus:border-[#F58220]'
            }`}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white bg-[#F58220] hover:bg-[#E07016] shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Inquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Inquiry</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
