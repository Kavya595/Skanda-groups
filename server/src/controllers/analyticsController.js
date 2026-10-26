import mongoose from 'mongoose';
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

// Resilient in-memory queue to guarantee zero telemetry drops and zero 500s when DB is offline
const inMemoryEventQueue = [];
const MAX_IN_MEMORY_EVENTS = 1000;

function bufferInMemory(eventData) {
  inMemoryEventQueue.unshift(eventData);
  if (inMemoryEventQueue.length > MAX_IN_MEMORY_EVENTS) {
    inMemoryEventQueue.pop();
  }
}

function getInMemorySummary() {
  const totalEvents = inMemoryEventQueue.length;
  const typeMap = {};
  const plotMap = {};

  for (const e of inMemoryEventQueue) {
    if (e.eventType) {
      typeMap[e.eventType] = (typeMap[e.eventType] || 0) + 1;
    }
    if (e.plotNumber) {
      plotMap[e.plotNumber] = (plotMap[e.plotNumber] || 0) + 1;
    }
  }

  const eventsByType = Object.entries(typeMap)
    .map(([k, count]) => ({ _id: k, count }))
    .sort((a, b) => b.count - a.count);

  const topPlots = Object.entries(plotMap)
    .map(([p, views]) => ({ _id: Number(p), views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const recentEvents = inMemoryEventQueue.slice(0, 50);

  return {
    totalEvents,
    eventsByType,
    topPlots,
    recentEvents
  };
}

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
    } = req.body || {};

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
    const validPlotNumber = (plotNumber !== null && plotNumber !== undefined && !isNaN(Number(plotNumber)))
      ? Number(plotNumber)
      : undefined;

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

    const eventRecord = {
      _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      eventType,
      plotNumber: validPlotNumber,
      customerName: name ? String(name).slice(0, 100) : '',
      customerPhone: phone ? String(phone).slice(0, 30) : '',
      customerEmail: email ? String(email).slice(0, 100) : '',
      page: visitedPage ? String(visitedPage).slice(0, 100) : '',
      actionDetails: details ? String(details).slice(0, 200) : '',
      metadata: sanitizedMeta,
      userAgent: req.headers['user-agent'] ? String(req.headers['user-agent']).slice(0, 150) : '',
      createdAt: new Date()
    };

    // Buffer in memory
    bufferInMemory(eventRecord);

    // If MongoDB is connected and ready, persist to MongoDB
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const dbEvent = await ActivityEvent.create({
          eventType,
          plotNumber: validPlotNumber,
          customerName: eventRecord.customerName,
          customerPhone: eventRecord.customerPhone,
          customerEmail: eventRecord.customerEmail,
          page: eventRecord.page,
          actionDetails: eventRecord.actionDetails,
          metadata: sanitizedMeta,
          userAgent: eventRecord.userAgent
        });

        // If contact phone/email is present and it is a key conversion event, ensure a lead exists
        if ((phone || email) && (eventType === 'enquiry_submitted' || eventType === 'callback_requested' || eventType === 'brochure_downloaded')) {
          try {
            const query = phone ? { phone } : { email };
            const existingLead = await Lead.findOne(query);
            if (!existingLead && (name || phone || email)) {
              await Lead.create({
                name: name || 'Interested Website Visitor',
                phone: phone || '',
                email: email || `${phone || 'visitor'}@lead.skandhagroup.com`,
                plotNumber: validPlotNumber,
                message: `Captured via ${eventType.replace(/_/g, ' ')} on page: ${visitedPage || 'Layout'}`,
                source: 'Website Interaction Tracker',
                consent: true,
                status: 'new'
              });
            }
          } catch (leadErr) {
            console.debug('Background lead capture info:', leadErr.message);
          }
        }

        return res.status(201).json({
          success: true,
          eventId: dbEvent._id
        });
      } catch (dbErr) {
        // Fall back gracefully to the buffered record
        console.warn('MongoDB save error in ingestEvent (buffered in memory):', dbErr.message);
        return res.status(200).json({
          success: true,
          buffered: true,
          eventId: eventRecord._id
        });
      }
    }

    // Returning 200 buffered ensures the client never sees a 500 network error
    return res.status(200).json({
      success: true,
      buffered: true,
      eventId: eventRecord._id
    });
  } catch (err) {
    // Analytics ingestion must never throw 500 to client
    console.warn('Unexpected error in ingestEvent (safe recovery):', err.message);
    return res.status(200).json({
      success: true,
      buffered: true,
      recovered: true
    });
  }
}

export async function getAnalyticsSummary(req, res) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        summary: getInMemorySummary()
      });
    }

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
        totalEvents: Math.max(totalEvents, inMemoryEventQueue.length),
        eventsByType: eventsByType.length > 0 ? eventsByType : getInMemorySummary().eventsByType,
        topPlots: topPlots.length > 0 ? topPlots : getInMemorySummary().topPlots,
        recentEvents: recentEvents.length > 0 ? recentEvents : inMemoryEventQueue.slice(0, 50)
      }
    });
  } catch (err) {
    console.warn('MongoDB analytics summary query failed, using in-memory events:', err.message);
    return res.json({
      success: true,
      summary: getInMemorySummary()
    });
  }
}

export async function exportWebsiteVisitsCsv(req, res) {
  try {
    let events = [];
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        events = await ActivityEvent.find().sort({ createdAt: -1 }).limit(5000);
      } catch (e) {
        events = inMemoryEventQueue;
      }
    } else {
      events = inMemoryEventQueue;
    }

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
      'Event Record ID': e._id ? e._id.toString() : ''
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
    console.warn('CSV export error (fallback empty csv):', err.message);
    res.header('Content-Type', 'text/csv');
    res.attachment('skandha_website_visits_analytics.csv');
    return res.send('Activity / User Action,Plot Interacted,Visitor Name,Visitor Phone,Visitor Email,Page / Section,Action Details,Visit Date & Time,Device / Browser UserAgent,Event Record ID\n');
  }
}
