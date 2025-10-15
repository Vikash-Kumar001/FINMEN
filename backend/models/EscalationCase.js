import mongoose from 'mongoose';

const escalationCaseSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  
  // Case details
  caseId: {
    type: String,
    required: true,
    unique: true,
  },
  chainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EscalationChain',
    required: true,
  },
  
  // Student involved
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  campusId: String,
  
  // Trigger
  triggerType: String,
  triggerDescription: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  
  // Current escalation state
  currentLevel: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated', 'cancelled'],
    default: 'active',
  },
  
  // Timeline
  escalationHistory: [{
    level: Number,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedAt: Date,
    acknowledgedAt: Date,
    responseTime: Number, // minutes
    action: String,
    notes: String,
    escalatedToNext: Boolean,
  }],
  
  // Resolution
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedAt: Date,
  resolutionNotes: String,
  resolutionTime: Number, // minutes from creation
  
  // Notifications sent
  notificationsSent: [{
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    method: String,
    sentAt: Date,
    acknowledged: Boolean,
    acknowledgedAt: Date,
  }],
  
  // Related data
  relatedWellbeingFlagId: mongoose.Schema.Types.ObjectId,
  relatedAssignmentId: mongoose.Schema.Types.ObjectId,
  
}, {
  timestamps: true,
});

escalationCaseSchema.index({ tenantId: 1, status: 1 });
escalationCaseSchema.index({ studentId: 1, status: 1 });

// Generate unique case ID
escalationCaseSchema.pre('save', function(next) {
  if (!this.caseId) {
    this.caseId = `ESC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

const EscalationCase = mongoose.model('EscalationCase', escalationCaseSchema);
export default EscalationCase;

