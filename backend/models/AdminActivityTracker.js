import mongoose from 'mongoose';

const adminActivityTrackerSchema = new mongoose.Schema(
  {
    // Activity identification
    activityType: {
      type: String,
      enum: ['communication', 'transaction', 'engagement', 'login', 'analytics_view', 'administrative', 'system'],
      required: true,
      index: true
    },
    
    // Cross-platform tracking
    sourceDashboard: {
      type: String,
      enum: ['student', 'parent', 'teacher', 'school_admin', 'csr', 'admin'],
      required: true
    },
    
    targetDashboard: {
      type: String,
      enum: ['student', 'parent', 'teacher', 'school_admin', 'csr', 'admin'],
    },
    
    // Participants (for communications and interactions)
    participants: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: String,
      name: String
    }],
    
    // Primary user who initiated the activity
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    userName: String,
    userRole: String,
    
    // Communication tracking
    communicationType: {
      type: String,
      enum: ['message', 'announcement', 'notification', 'feedback', 'report']
    },
    communicationData: {
      subject: String,
      message: String,
      priority: String,
      readStatus: Boolean,
      attachments: [String],
      metadata: mongoose.Schema.Types.Mixed
    },
    
    // Transaction tracking
    transactionData: {
      amount: Number,
      currency: String,
      type: String,
      status: String,
      gateway: String,
      transactionId: String
    },
    
    // Engagement tracking
    engagementData: {
      page: String,
      action: String,
      duration: Number, // in seconds
      metadata: mongoose.Schema.Types.Mixed
    },
    
    // System/administrative tracking
    systemData: {
      eventName: String,
      action: String,
      targetType: String,
      targetId: String,
      metadata: mongoose.Schema.Types.Mixed
    },
    
    // Real-time indicators
    isRealTime: {
      type: Boolean,
      default: false,
      index: true
    },
    
    // Context information
    sessionId: String,
    ipAddress: String,
    userAgent: String,
    
    // Geographic data (optional)
    geo: {
      country: String,
      region: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    
    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    // Timestamps
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    
    // Tracking data retention (TTL index for auto-deletion after 90 days)
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for efficient queries
adminActivityTrackerSchema.index({ activityType: 1, timestamp: -1 });
adminActivityTrackerSchema.index({ sourceDashboard: 1, targetDashboard: 1, timestamp: -1 });
adminActivityTrackerSchema.index({ userId: 1, timestamp: -1 });
adminActivityTrackerSchema.index({ 'participants.userId': 1, timestamp: -1 });
adminActivityTrackerSchema.index({ timestamp: -1 });

// TTL index for automatic deletion of old documents
adminActivityTrackerSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to log an activity
adminActivityTrackerSchema.statics.logActivity = async function(activityData) {
  try {
    const activity = await this.create(activityData);
    return activity;
  } catch (error) {
    console.error('Error logging admin activity:', error);
    return null;
  }
};

// Static method to get activity statistics
adminActivityTrackerSchema.statics.getActivityStats = async function(filters = {}) {
  const { startDate, endDate, activityType, sourceDashboard, userId } = filters;
  
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.timestamp = {};
    if (startDate) matchStage.timestamp.$gte = new Date(startDate);
    if (endDate) matchStage.timestamp.$lte = new Date(endDate);
  }
  if (activityType) matchStage.activityType = activityType;
  if (sourceDashboard) matchStage.sourceDashboard = sourceDashboard;
  if (userId) matchStage.userId = new mongoose.Types.ObjectId(userId);
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          activityType: '$activityType',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        activityType: '$_id.activityType',
        date: '$_id.date',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        _id: 0
      }
    },
    { $sort: { date: -1, activityType: 1 } }
  ]);
  
  return stats;
};

const AdminActivityTracker = mongoose.model('AdminActivityTracker', adminActivityTrackerSchema);

export default AdminActivityTracker;

