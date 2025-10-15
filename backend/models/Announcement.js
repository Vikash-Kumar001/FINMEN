import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['general', 'urgent', 'event', 'holiday', 'exam', 'fee', 'meeting'],
    default: 'general',
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'parents', 'staff', 'specific_class'],
    default: 'all',
  },
  targetClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
  }],
  targetClassNames: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdByName: String,
  createdByRole: String,
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date,
  }],
  publishDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readAt: Date,
  }],
}, {
  timestamps: true,
});

// Indexes
announcementSchema.index({ tenantId: 1, targetAudience: 1, publishDate: -1 });
announcementSchema.index({ tenantId: 1, targetClasses: 1 });
announcementSchema.index({ tenantId: 1, isPinned: -1, publishDate: -1 });

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;

