import ActivityEvent from '../models/ActivityEvent.js';
import Lead from '../models/Lead.js';
import { Parser } from 'json2csv';

const ALLOWLISTED_EVENTS = [
  'layout_opened',
  'view_mode_toggled',
  'plot_viewed',
  'filter_applied',
  'search_performed',
  'enquiry_started',
  'enquiry_submitted',
  'brochure_downloaded',
  'page_viewed',
  'contact_clicked',
  'callback_requested',
  'plot_drawer_opened'
];

export async function ingestEvent(req, res) {
  try {
    const {
      eventType,
      plotNumber,
      customerName,
      customerPhone,
      customerEmail,
      page,
      actionDetails,
      metadata
    } = req.body;

    if (!eventType || !ALLOWLISTED_EVENTS.includes(eventType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid or unallowed eventType. Must be one of: ${ALLOWLISTED_EVENTS.join(', ')}`
      });
    }

    // Extract user contact info if available in top-level or metadata
    const name = customerName || metadata?.customerName || '';
    const phone = customerPhone || metadata?.customerPhone || metadata?.phone || '';
    const email = customerEmail || metadata?.customerEmail || metadata?.email || '';
    const visitedPage = page || metadata?.page || '';
    const details = actionDetails || metadata?.actionDetails || metadata?.label || '';

    const sanitizedMeta = {};
    if (metadata && typeof metadata === 'object') {
      const allowedKeys = [
        'viewMode', 'filter', 'searchTerm', 'source', 'deviceType',
        'facing', 'areaSqYds', 'price', 'preferredMethod', 'channel',
        'title', 'actionDetails'
      ];
      for (const k of allowedKeys) {
        if (metadata[k] !== undefined) sanitizedMeta[k] = metadata[k];
      }
    }

    const event = await ActivityEvent.create({
      eventType,
      plotNumber: plotNumber ? Number(plotNumber) : undefined,
      customerName: name ? String(name).slice(0, 100) : '',
      customerPhone: phone ? String(phone).slice(0, 30) : '',
      customerEmail: email ? String(email).slice(0, 100) : '',
      page: visitedPage ? String(visitedPage).slice(0, 100) : '',
      actionDetails: details ? String(details).slice(0, 200) : '',
      metadata: sanitizedMeta,
      userAgent: req.headers['user-agent'] ? req.headers['user-agent'].slice(0, 150) : undefined
    });

    // If contact phone/email is present and it is an action of interest, ensure a lead exists
    if ((phone || email) && (eventType === 'enquiry_submitted' || eventType === 'callback_requested' || eventType === 'brochure_downloaded')) {
      try {
        const query = phone ? { phone } : { email };
        const existingLead = await Lead.findOne(query);
        if (!existingLead && (name || phone || email)) {
          await Lead.create({
            name: name || 'Interested Website Visitor',
            phone: phone || '',
            email: email || `${phone || 'visitor'}@lead.skandhagroup.com`,
            plotNumber: plotNumber ? Number(plotNumber) : undefined,
            message: `Captured via ${eventType.replace(/_/g, ' ')} on page: ${visitedPage || 'Layout'}`,
            source: 'Website Interaction Tracker',
            consent: true,
            status: 'new'
          });
        }
      } catch (leadErr) {
        console.debug('Optional lead capture error in ingestEvent:', leadErr.message);
      }
    }

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
      'Visitor Name': e.customerName || 'Anonymous',
      'Visitor Phone': e.customerPhone || 'Not Provided',
      'Visitor Email': e.customerEmail || 'Not Provided',
      'Page / Section': e.page || 'Layout Viewer',
      'Action Details': e.actionDetails || JSON.stringify(e.metadata || {}),
      'Device / Browser UserAgent': (e.userAgent || 'Unknown').replace(/\r?\n|\r/g, ' '),
      'Visit Date & Time': e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '',
      'Event Record ID': e._id.toString()
    }));

    const fields = [
      'Activity / User Action',
      'Plot Interacted',
      'Visitor Name',
      'Visitor Phone',
      'Visitor Email',
      'Page / Section',
      'Action Details',
      'Visit Date & Time',
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

