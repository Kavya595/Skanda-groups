/**
 * Centralized Corporate Configuration for Skandha Groups
 * 
 * Represents the parent company: Skandha Groups.
 * Note: Project-specific details (such as Alekya) are kept strictly in src/data/projects.js.
 */

export const COMPANY_CONFIG = {
  name: "Skandha Groups",
  legalName: "Skandha Groups Real Estate & Infrastructure Developers",
  shortName: "Skandha Groups",
  tagline: "Building Trust. Creating Lasting Value.",
  subTagline: "Pioneering thoughtfully planned, legally secure residential communities.",
  
  // Registered Corporate Office
  address: {
    doorNo: "# 8-7-91/17/1, 4th Floor",
    building: "Bata Building, Beside Naveena Hospital",
    street: "Main Road, Hastinapuram",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500079",
    full: "# 8-7-91/17/1, 4th Floor, Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana - 500079",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3809.112999464619!2d78.5362947!3d17.3421251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba23a6338bdfb%3A0x6b10070bc0e914df!2sHastinapuram%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  },

  // Contact Information
  contact: {
    phone: "",
    phoneDisplay: "",
    email: "info@skandhagroups.com",
    salesEmail: "sales@skandhagroups.com",
    workingHours: "Monday - Saturday: 9:30 AM – 6:30 PM (Sunday Consultations by Appointment)",
  },

  // WhatsApp Configuration
  whatsApp: {
    businessNumber: "",
    inquiryMessage: "Hello Skandha Groups, I would like to know more about your company and developments.",
    projectInquiryMessage: (projectName) => 
      `Hello Skandha Groups, I would like to know more about your project: ${projectName}. Please share details, layout plan, and pricing.`,
  },

  // Backend Integration Configuration for Contact Form
  backendApi: {
    contactEndpoint: "", // Configure Formspree or custom REST API endpoint
    isLiveConfigured: false,
  },

  // Corporate Social Links
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  }
};

/**
 * Checks if the WhatsApp business number is configured with a real phone number
 */
export function isWhatsAppConfigured() {
  const num = COMPANY_CONFIG.whatsApp.businessNumber;
  return Boolean(
    num && 
    num !== "REPLACE_WITH_BUSINESS_NUMBER" && 
    /^\d{10,14}$/.test(num.replace(/[^0-9]/g, ""))
  );
}

/**
 * Generates a clean wa.me URL or null if unconfigured
 */
export function getWhatsAppUrl(customMessage = null) {
  if (!isWhatsAppConfigured()) return null;
  const cleanNumber = COMPANY_CONFIG.whatsApp.businessNumber.replace(/[^0-9]/g, "");
  const message = customMessage || COMPANY_CONFIG.whatsApp.inquiryMessage;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
