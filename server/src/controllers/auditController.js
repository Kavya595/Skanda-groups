import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog.js';

export async function getAuditLogs(req, res) {
  try {
    const { action, resource, page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 25;
    const skip = (pageNum - 1) * limitNum;

    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        total: 0,
        page: pageNum,
        totalPages: 1,
        logs: []
      });
    }

    const query = {};
    if (action) query.action = action;
    if (resource) query.resource = resource;

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
    console.warn('getAuditLogs fallback:', err.message);
    return res.json({
      success: true,
      total: 0,
      page: 1,
      totalPages: 1,
      logs: []
    });
  }
}
