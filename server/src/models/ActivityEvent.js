import mongoose from 'mongoose';

const activityEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'layout_opened',
      'view_mode_toggled',
      'plot_viewed',
      'filter_applied',
      'search_performed',
      'enquiry_started',
      'enquiry_submitted',
      'brochure_downloaded'
    ],
    index: true
  },
  plotNumber: { type: Number, index: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  userAgent: { type: String }
}, { timestamps: true });

export default mongoose.model('ActivityEvent', activityEventSchema);
