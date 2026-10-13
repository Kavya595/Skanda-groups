import Lead from '../models/Lead.js';
import SiteSettings from '../models/SiteSettings.js';
import ActivityEvent from '../models/ActivityEvent.js';
import AuditLog from '../models/AuditLog.js';
import { Parser } from 'json2csv';

export async function submitLead(req, res) {
  try {
    const { name, email, phone, preferredContactMethod, plotNumber, message, consent } = req.body;

    // Duplicate submission protection: check if same email and plot was submitted in last 3 minutes
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    const existingRecent = await Lead.findOne({
      email: email.trim().toLowerCase(),
      plotNumber: plotNumber ? Number(plotNumber) : null,
      createdAt: { $gte: threeMinutesAgo }
    });

    let lead;
    if (existingRecent) {
      lead = existingRecent;
    } else {
      lead = await Lead.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        preferredContactMethod: preferredContactMethod || 'whatsapp',
        plotNumber: plotNumber ? Number(plotNumber) : undefined,
        message: message ? message.trim() : '',
        consent: Boolean(consent),
        status: 'new',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      // Log activity event
      await ActivityEvent.create({
        eventType: 'enquiry_submitted',
        plotNumber: plotNumber ? Number(plotNumber) : undefined,
        metadata: { leadId: lead._id, preferredContactMethod },
        userAgent: req.headers['user-agent']
      });
    }

    // Build the secure WhatsApp link without exposing raw destination number to marketing UI text
    const settings = await SiteSettings.findOne();
    const rawNumber = (settings && settings.whatsappNumber) ? settings.whatsappNumber : (process.env.DEFAULT_WHATSAPP_NUMBER || '919876543210');
    // Sanitize phone number (strip spaces, +, hyphens)
    const sanitizedNumber = rawNumber.replace(/[^\d]/g, '');

    let waMessage = `Hello Skandha Group! I am ${name.trim()}. I am interested in Alekhya's Brundavan, Kadthal.`;
    if (plotNumber) {
      waMessage += ` Specifically inquiring about Plot #${plotNumber}.`;
    }
    if (message && message.trim()) {
      waMessage += ` Note: "${message.trim()}".`;
    }
    waMessage += ` Please share pricing & DTCP layout details.`;

    const whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(waMessage)}`;

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received and verified by Skandha Group.',
      leadId: lead._id,
      whatsappUrl,
      preferredContactMethod: lead.preferredContactMethod
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getLeads(req, res) {
  try {
    const { status, search, plotNumber, page, limit } = req.query;
    const query = {};

    if (status) query.status = status;
    if (plotNumber) query.plotNumber = Number(plotNumber);
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Lead.countDocuments(query)
    ]);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      leads
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateLeadStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found.' });
    }

    const oldStatus = lead.status;
    if (status) lead.status = status;
    if (assignedTo) lead.assignedTo = assignedTo;
    await lead.save();

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'LEAD_STATUS_CHANGED',
      resource: 'Lead',
      resourceId: lead._id.toString(),
      changes: { from: oldStatus, to: status, assignedTo },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: 'Lead updated successfully.',
      lead
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function addFollowUpNote(req, res) {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, error: 'Note text is required.' });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found.' });
    }

    lead.followUpNotes.push({
      text: note.trim(),
      author: req.user.username,
      createdAt: new Date()
    });
    await lead.save();

    return res.json({
      success: true,
      message: 'Follow-up note added.',
      lead
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteLead(req, res) {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found.' });
    }

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'LEAD_DELETED',
      resource: 'Lead',
      resourceId: id,
      changes: { leadEmail: lead.email, name: lead.name },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: 'Lead removed per data retention policy.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function exportLeadsCsv(req, res) {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    const fields = ['_id', 'name', 'email', 'phone', 'preferredContactMethod', 'plotNumber', 'status', 'assignedTo', 'consent', 'createdAt'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment('alekhyas_brundavan_leads.csv');
    return res.send(csv);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
