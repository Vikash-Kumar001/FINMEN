import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  
  // Event identification
  eventName: {
    type: String,
    required: true,
    index: true,
    // Examples: 'school.overview.view', 'school.approval.action', 'school.template.create'
  },
  eventCategory: {
    type: String,
    enum: ['view', 'action', 'create', 'update', 'delete', 'export', 'system'],
    default: 'action',
  },
  
  // User who triggered the event
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: String,
  userRole: String,
  userEmail: String,
  
  // Event context
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Examples:
    // { school_id, campus_id }
    // { admin_id, assignment_id, action }
    // { template_id, created_by }
  },
  
  // Session information
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  
  // Geographic data (optional)
  geo: {
    country: String,
    region: String,
    city: String,
  },
  
  // Performance metrics (optional)
  performance: {
    loadTime: Number, // milliseconds
    responseTime: Number,
  },
  
  // Status
  status: {
    type: String,
    enum: ['success', 'error', 'pending'],
    default: 'success',
  },
  errorMessage: String,
  
  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  
}, {
  timestamps: true,
  // Enable TTL for auto-deletion of old events (optional)
  // expires: 7776000, // 90 days in seconds
});

// Compound indexes for efficient queries
analyticsEventSchema.index({ tenantId: 1, eventName: 1, timestamp: -1 });
analyticsEventSchema.index({ tenantId: 1, userId: 1, timestamp: -1 });
analyticsEventSchema.index({ tenantId: 1, eventCategory: 1, timestamp: -1 });
analyticsEventSchema.index({ timestamp: -1 });

// Static method to log an event
analyticsEventSchema.statics.logEvent = async function(eventData) {
  try {
    const event = await this.create(eventData);
    return event;
  } catch (error) {
    console.error('Error logging analytics event:', error);
    // Don't throw error - analytics should not break app flow
    return null;
  }
};

// Static method to get event statistics
analyticsEventSchema.statics.getEventStats = async function(filters = {}) {
  const { tenantId, eventName, startDate, endDate, userId } = filters;
  
  const matchStage = { tenantId };
  if (eventName) matchStage.eventName = eventName;
  if (userId) matchStage.userId = new mongoose.Types.ObjectId(userId);
  if (startDate || endDate) {
    matchStage.timestamp = {};
    if (startDate) matchStage.timestamp.$gte = new Date(startDate);
    if (endDate) matchStage.timestamp.$lte = new Date(endDate);
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          eventName: '$eventName',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        },
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
      },
    },
    {
      $project: {
        eventName: '$_id.eventName',
        date: '$_id.date',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        _id: 0,
      },
    },
    { $sort: { date: -1, eventName: 1 } },
  ]);
  
  return stats;
};

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
export default AnalyticsEvent;

