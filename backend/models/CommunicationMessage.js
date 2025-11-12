import mongoose from 'mongoose';

const communicationMessageSchema = new mongoose.Schema({
  // Message Details
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['broadcast', 'reminder', 'notification', 'alert', 'announcement'],
    default: 'broadcast',
    index: true
  },
  
  // Recipients
  recipientType: {
    type: String,
    enum: ['all', 'students', 'teachers', 'parents', 'school_admins', 'custom'],
    required: true,
    index: true
  },
  recipientIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  recipientRoles: [{
    type: String,
    enum: ['student', 'parent', 'teacher', 'school_admin', 'admin']
  }],
  organizationIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }],
  
  // Channels
  channels: [{
    type: String,
    enum: ['email', 'sms', 'push', 'in_app'],
    required: true
  }],
  
  // Template
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunicationTemplate'
  },
  templateVariables: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Scheduling
  scheduledAt: Date,
  isScheduled: {
    type: Boolean,
    default: false
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Sender
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: String,
  senderEmail: String,
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  tenantId: String,
  
  // Status & Tracking
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'],
    default: 'draft',
    index: true
  },
  sentAt: Date,
  completedAt: Date,
  
  // Delivery Statistics
  stats: {
    totalRecipients: {
      type: Number,
      default: 0
    },
    emailsSent: {
      type: Number,
      default: 0
    },
    emailsDelivered: {
      type: Number,
      default: 0
    },
    emailsOpened: {
      type: Number,
      default: 0
    },
    emailsClicked: {
      type: Number,
      default: 0
    },
    smsSent: {
      type: Number,
      default: 0
    },
    smsDelivered: {
      type: Number,
      default: 0
    },
    pushSent: {
      type: Number,
      default: 0
    },
    pushDelivered: {
      type: Number,
      default: 0
    },
    pushOpened: {
      type: Number,
      default: 0
    },
    failures: {
      type: Number,
      default: 0
    }
  },
  
  // Priority & Urgency
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  // Attachments
  attachments: [{
    filename: String,
    url: String,
    type: String,
    size: Number
  }],
  
  // Reminder Configuration (if messageType is 'reminder')
  reminderConfig: {
    reminderType: {
      type: String,
      enum: ['fee', 'exam', 'attendance', 'assignment', 'event', 'other']
    },
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly']
    },
    interval: Number, // days/hours
    maxReminders: Number,
    reminderCount: {
      type: Number,
      default: 0
    },
    lastReminderSent: Date
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes
communicationMessageSchema.index({ status: 1, scheduledAt: 1 });
communicationMessageSchema.index({ sentBy: 1, createdAt: -1 });
communicationMessageSchema.index({ organizationId: 1, createdAt: -1 });
communicationMessageSchema.index({ messageType: 1, status: 1 });
communicationMessageSchema.index({ 'reminderConfig.reminderType': 1 });

const CommunicationMessage = mongoose.model('CommunicationMessage', communicationMessageSchema);
export default CommunicationMessage;

