import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  adminEmail: { type: String, required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: { type: String },
  changes: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { bufferCommands: false });

export default mongoose.model('AuditLog', auditLogSchema);
