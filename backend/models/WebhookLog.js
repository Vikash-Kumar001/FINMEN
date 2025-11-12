import mongoose from 'mongoose';

const webhookLogSchema = new mongoose.Schema({
  // Webhook Identification
  webhookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Webhook',
    index: true
  },
  webhookUrl: {
    type: String,
    required: true
  },
  
  // Event Details
  eventType: {
    type: String,
    required: true,
    index: true
  },
  eventName: {
    type: String,
    required: true
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Delivery Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed', 'retrying'],
    default: 'pending',
    index: true
  },
  
  // Delivery Attempts
  attempts: [{
    attemptNumber: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    statusCode: Number,
    responseBody: String,
    errorMessage: String,
    responseTime: Number
  }],
  totalAttempts: {
    type: Number,
    default: 0
  },
  
  // HTTP Details
  httpMethod: {
    type: String,
    default: 'POST'
  },
  headers: mongoose.Schema.Types.Mixed,
  signature: String, // Webhook signature for verification
  
  // Response
  responseCode: Number,
  responseBody: String,
  responseHeaders: mongoose.Schema.Types.Mixed,
  
  // Timing
  sentAt: Date,
  deliveredAt: Date,
  failedAt: Date,
  
  // Retry Configuration
  maxRetries: {
    type: Number,
    default: 3
  },
  retryAfter: Date,
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  tenantId: String,
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
webhookLogSchema.index({ webhookId: 1, createdAt: -1 });
webhookLogSchema.index({ status: 1, createdAt: -1 });
webhookLogSchema.index({ eventType: 1, createdAt: -1 });
webhookLogSchema.index({ organizationId: 1, createdAt: -1 });

const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema);
export default WebhookLog;

