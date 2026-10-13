import AuditLog from '../models/AuditLog.js';

export async function getAuditLogs(req, res) {
  try {
    const { action, resource, page, limit } = req.query;
    const query = {};

    if (action) query.action = action;
    if (resource) query.resource = resource;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 25;
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      AuditLog.countDocuments(query)
    ]);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      logs
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
