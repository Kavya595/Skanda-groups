import ActivityEvent from '../models/ActivityEvent.js';
import { Parser } from 'json2csv';

const ALLOWLISTED_EVENTS = [
  'layout_opened',
  'view_mode_toggled',
  'plot_viewed',
  'filter_applied',
  'search_performed',
  'enquiry_started',
  'enquiry_submitted',
  'brochure_downloaded'
];

export async function ingestEvent(req, res) {
  try {
    const { eventType, plotNumber, metadata } = req.body;

    if (!eventType || !ALLOWLISTED_EVENTS.includes(eventType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid or unallowed eventType. Must be one of: ${ALLOWLISTED_EVENTS.join(', ')}`
      });
    }

    // Strip any potential PII from metadata to maintain privacy compliance
    const sanitizedMeta = {};
    if (metadata && typeof metadata === 'object') {
      const allowedKeys = ['viewMode', 'filter', 'searchTerm', 'source', 'deviceType'];
      for (const k of allowedKeys) {
        if (metadata[k] !== undefined) sanitizedMeta[k] = metadata[k];
      }
    }

    const event = await ActivityEvent.create({
      eventType,
      plotNumber: plotNumber ? Number(plotNumber) : undefined,
      metadata: sanitizedMeta,
      userAgent: req.headers['user-agent'] ? req.headers['user-agent'].slice(0, 100) : undefined
    });

    return res.status(201).json({
      success: true,
      eventId: event._id
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getAnalyticsSummary(req, res) {
  try {
    const totalEvents = await ActivityEvent.countDocuments();

    // Counts by eventType
    const eventsByType = await ActivityEvent.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Top viewed plots
    const topPlots = await ActivityEvent.aggregate([
      { $match: { eventType: 'plot_viewed', plotNumber: { $exists: true, $ne: null } } },
      { $group: { _id: '$plotNumber', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Recent 50 events stream
    const recentEvents = await ActivityEvent.find()
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      success: true,
      summary: {
        totalEvents,
        eventsByType,
        topPlots,
        recentEvents
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function exportWebsiteVisitsCsv(req, res) {
  try {
    const events = await ActivityEvent.find().sort({ createdAt: -1 }).limit(5000);
    const formatted = events.map(e => ({
      'Activity / User Action': (e.eventType || '').replace(/_/g, ' ').toUpperCase(),
      'Plot Interacted': e.plotNumber ? `Plot #${e.plotNumber}` : 'General / Whole Layout',
      'Interaction Details': JSON.stringify(e.metadata || {}),
      'Device / Browser UserAgent': (e.userAgent || 'Unknown').replace(/\r?\n|\r/g, ' '),
      'Visit Date & Time': e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '',
      'Event Record ID': e._id.toString()
    }));

    const fields = [
      'Activity / User Action',
      'Plot Interacted',
      'Visit Date & Time',
      'Interaction Details',
      'Device / Browser UserAgent',
      'Event Record ID'
    ];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(formatted);

    res.header('Content-Type', 'text/csv');
    res.attachment('skandha_website_visits_analytics.csv');
    return res.send(csv);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

