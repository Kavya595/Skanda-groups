import mongoose from 'mongoose';
import SiteSettings from '../models/SiteSettings.js';
import AuditLog from '../models/AuditLog.js';

const defaultPublicSettings = {
  companyName: 'Skandha Group',
  projectName: "Kadthal Venture",
  projectLocation: 'Kadthal, Srisailam Highway, Hyderabad',
  officeAddress: 'Kadthal Mandal, Ranga Reddy District, Telangana',
  contactEmail: 'contact@skandhagroup.com',
  dtcpNumber: 'TLP NO. 87/2024/H',
  reraNumber: 'P02400009081',
  heroVideoUrl: '',
  heroPosterUrl: '/assets/hero_cover.jpg',
  brochurePdfUrl: '',
  flyerPdfUrl: '',
  socialLinks: {},
  publicClaimsApproved: true,
  seo: {},
  whatsappAvailable: true
};

export async function getPublicSettings(req, res) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        settings: defaultPublicSettings
      });
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    // Return public safe view (no phone number text in public payload)
    return res.json({
      success: true,
      settings: {
        companyName: settings.companyName,
        projectName: settings.projectName,
        projectLocation: settings.projectLocation,
        officeAddress: settings.officeAddress,
        contactEmail: settings.contactEmail,
        dtcpNumber: settings.dtcpNumber,
        reraNumber: settings.reraNumber,
        heroVideoUrl: settings.heroVideoUrl,
        heroPosterUrl: settings.heroPosterUrl,
        brochurePdfUrl: settings.brochurePdfUrl,
        flyerPdfUrl: settings.flyerPdfUrl,
        socialLinks: settings.socialLinks,
        publicClaimsApproved: settings.publicClaimsApproved,
        seo: settings.seo,
        whatsappAvailable: true
      }
    });
  } catch (err) {
    return res.json({
      success: true,
      settings: defaultPublicSettings
    });
  }
}

export async function getAdminSettings(req, res) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return res.json({
      success: true,
      settings
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateSettings(req, res) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const before = settings.toObject();
    Object.assign(settings, req.body);
    await settings.save();

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'SETTINGS_UPDATED',
      resource: 'SiteSettings',
      resourceId: settings._id.toString(),
      changes: { before, after: settings },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: 'Site settings updated successfully.',
      settings
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
