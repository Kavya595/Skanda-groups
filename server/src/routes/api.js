import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { loginLimiter, leadSubmissionLimiter, analyticsLimiter } from '../middleware/rateLimiter.js';
import { validateLeadSubmission, validatePlotInput } from '../middleware/validator.js';

import * as authCtrl from '../controllers/authController.js';
import * as plotCtrl from '../controllers/plotController.js';
import * as leadCtrl from '../controllers/leadController.js';
import * as analyticsCtrl from '../controllers/analyticsController.js';
import * as settingsCtrl from '../controllers/settingsController.js';
import * as galleryCtrl from '../controllers/galleryController.js';
import * as auditCtrl from '../controllers/auditController.js';

const router = express.Router();

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================

// Settings & Project Metadata
router.get('/settings', settingsCtrl.getPublicSettings);

// Gallery
router.get('/gallery', galleryCtrl.getPublicGallery);

// Plots (Master plan & visualizer)
router.get('/plots', plotCtrl.getPlots);
router.get('/plots/stats', plotCtrl.getPlotStats);
router.get('/plots/:plotNumber', plotCtrl.getPlotDetail);

// Clean Watermark-Free OpenStreetMap Tile Proxy (Zero API Key, CORS-enabled matching 2D View)
router.get('/tiles/:z/:x/:y.png', async (req, res) => {
  const { z, x, y } = req.params;
  try {
    const osmUrl = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    const response = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'SkandhaGroup-AlekhyasBrundavan/1.0 (info@skandhagroup.com)'
      }
    });
    if (!response.ok) {
      return res.status(response.status).send('Tile error');
    }
    const buffer = await response.arrayBuffer();
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800, immutable',
      'Access-Control-Allow-Origin': '*'
    });
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send('Tile fetch error');
  }
});

// Leads & Enquiry Capture
router.post('/leads', leadSubmissionLimiter, validateLeadSubmission, leadCtrl.submitLead);

// Analytics ingestion
router.post('/analytics/events', analyticsLimiter, analyticsCtrl.ingestEvent);

// Admin Auth (Public Login & One-time bootstrap)
router.post('/auth/bootstrap', authCtrl.bootstrapAdmin);
router.post('/auth/login', loginLimiter, authCtrl.login);
router.post('/auth/logout', authCtrl.logout);

// ==========================================
// 2. PROTECTED ADMIN ROUTES (Require Auth)
// ==========================================
router.use('/admin', authenticate);
router.get('/auth/me', authenticate, authCtrl.getMe);
router.post('/auth/change-password', authenticate, authCtrl.changePassword);

// Admin Site Settings
router.get('/admin/settings', settingsCtrl.getAdminSettings);
router.put('/admin/settings', settingsCtrl.updateSettings);

// Admin Plots CRUD & Inventory Management
router.get('/admin/plots', plotCtrl.getPlots);
router.post('/admin/plots', validatePlotInput, plotCtrl.createPlot);
router.put('/admin/plots/:plotNumber', plotCtrl.updatePlot);
router.patch('/admin/plots/:plotNumber/status', plotCtrl.updatePlotStatus);
router.delete('/admin/plots/:plotNumber', plotCtrl.deletePlot);
router.get('/admin/plots/export/csv', plotCtrl.exportPlotsCsv);
router.post('/admin/plots/import/csv', plotCtrl.importPlotsCsv);

// Admin Leads CRM
router.get('/admin/leads', leadCtrl.getLeads);
router.patch('/admin/leads/:id/status', leadCtrl.updateLeadStatus);
router.post('/admin/leads/:id/notes', leadCtrl.addFollowUpNote);
router.delete('/admin/leads/:id', leadCtrl.deleteLead);
router.get('/admin/leads/export/csv', leadCtrl.exportLeadsCsv);

// Admin Analytics & Activity
router.get('/admin/analytics/summary', analyticsCtrl.getAnalyticsSummary);

// Admin Gallery Management
router.get('/admin/gallery', galleryCtrl.getAdminGallery);
router.post('/admin/gallery', galleryCtrl.createGalleryItem);
router.put('/admin/gallery/:id', galleryCtrl.updateGalleryItem);
router.delete('/admin/gallery/:id', galleryCtrl.deleteGalleryItem);

// Admin Audit Logs
router.get('/admin/audit-logs', auditCtrl.getAuditLogs);

export default router;
