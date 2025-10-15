import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  
  // Ticket details
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: [
      'trial_extension',
      'plan_upgrade',
      'technical_support',
      'billing_issue',
      'feature_request',
      'bug_report',
      'general_inquiry',
    ],
    required: true,
  },
  
  // Request details
  subject: {
    type: String,
    required: true,
  },
  description: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  
  // Trial extension specific
  trialExtensionDetails: {
    currentTrialEndDate: Date,
    requestedExtensionDays: Number,
    reason: String,
    currentUsage: {
      students: Number,
      teachers: Number,
      classes: Number,
    },
  },
  
  // Status
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed', 'rejected'],
    default: 'open',
  },
  
  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedAt: Date,
  
  // Creator
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creatorName: String,
  creatorEmail: String,
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    senderName: String,
    senderRole: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
    attachments: [{
      filename: String,
      url: String,
    }],
  }],
  
  // Resolution
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedAt: Date,
  resolution: String,
  resolutionTime: Number, // in hours
  
  // Approval (for trial extensions)
  approvalRequired: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  
  // Metadata
  tags: [String],
  relatedTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportTicket',
  }],
  
}, {
  timestamps: true,
});

// Indexes
supportTicketSchema.index({ tenantId: 1, status: 1 });
supportTicketSchema.index({ createdBy: 1, status: 1 });

// Generate ticket ID
supportTicketSchema.pre('save', function(next) {
  if (!this.ticketId) {
    this.ticketId = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export default SupportTicket;

