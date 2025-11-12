import mongoose from 'mongoose';

const communicationDeliveryLogSchema = new mongoose.Schema({
  // Message Reference
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunicationMessage',
    required: true,
    index: true
  },
  
  // Recipient
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipientEmail: String,
  recipientPhone: String,
  recipientName: String,
  recipientRole: String,
  
  // Channel & Delivery
  channel: {
    type: String,
    enum: ['email', 'sms', 'push', 'in_app'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced'],
    default: 'pending',
    index: true
  },
  
  // Provider Details
  provider: String, // e.g., 'sendgrid', 'twilio', 'firebase'
  providerMessageId: String,
  providerResponse: mongoose.Schema.Types.Mixed,
  
  // Timestamps
  sentAt: Date,
  deliveredAt: Date,
  openedAt: Date,
  clickedAt: Date,
  failedAt: Date,
  
  // Error Details
  errorMessage: String,
  errorCode: String,
  retryCount: {
    type: Number,
    default: 0
  },
  
  // Engagement Tracking
  openedCount: {
    type: Number,
    default: 0
  },
  clickedLinks: [String],
  clickedCount: {
    type: Number,
    default: 0
  },
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  tenantId: String
}, {
  timestamps: true
});

// Indexes
communicationDeliveryLogSchema.index({ messageId: 1, recipientId: 1 });
communicationDeliveryLogSchema.index({ status: 1, channel: 1 });
communicationDeliveryLogSchema.index({ createdAt: -1 });

const CommunicationDeliveryLog = mongoose.model('CommunicationDeliveryLog', communicationDeliveryLogSchema);
export default CommunicationDeliveryLog;

