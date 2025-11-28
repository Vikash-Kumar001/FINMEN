import mongoose from 'mongoose';

const subscriptionExpirationNotificationSchema = new mongoose.Schema({
  // Subscription reference
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
    index: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  },

  // Notification details
  notificationType: {
    type: String,
    enum: [
      'pre_expiration_90',
      'pre_expiration_60',
      'pre_expiration_30',
      'pre_expiration_14',
      'pre_expiration_7',
      'pre_expiration_3',
      'pre_expiration_1',
      'expiration_day',
      'post_expiration_1',
      'post_expiration_3',
      'post_expiration_7',
      'post_expiration_14',
      'post_expiration_30',
    ],
    required: true,
    index: true,
  },
  
  daysUntilExpiration: {
    type: Number,
    required: true,
  },
  
  expirationDate: {
    type: Date,
    required: true,
  },

  // Recipients
  sentToAdmins: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    email: String,
    name: String,
    sentAt: Date,
    delivered: Boolean,
    opened: Boolean,
    openedAt: Date,
  }],
  
  sentToTeachers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    email: String,
    name: String,
    sentAt: Date,
    delivered: Boolean,
  }],

  // Notification channels
  channels: [{
    type: String,
    enum: ['email', 'in_app', 'sms'],
    required: true,
  }],

  // Status
  status: {
    type: String,
    enum: ['pending', 'sending', 'sent', 'failed', 'cancelled'],
    default: 'pending',
    index: true,
  },

  // Delivery tracking
  sentAt: Date,
  completedAt: Date,
  failedAt: Date,
  failureReason: String,

  // Retry logic
  retryCount: {
    type: Number,
    default: 0,
  },
  maxRetries: {
    type: Number,
    default: 3,
  },

  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
subscriptionExpirationNotificationSchema.index({ subscriptionId: 1, notificationType: 1, status: 1 });
subscriptionExpirationNotificationSchema.index({ orgId: 1, status: 1 });
subscriptionExpirationNotificationSchema.index({ expirationDate: 1, status: 1 });
subscriptionExpirationNotificationSchema.index({ createdAt: 1 });

const SubscriptionExpirationNotification = mongoose.model(
  'SubscriptionExpirationNotification',
  subscriptionExpirationNotificationSchema
);

export default SubscriptionExpirationNotification;

