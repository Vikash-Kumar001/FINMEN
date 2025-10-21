import mongoose from 'mongoose';

const campaignApprovalSchema = new mongoose.Schema({
  // Campaign Reference
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  
  // School Information
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  schoolName: String,
  schoolType: {
    type: String,
    enum: ['government', 'private', 'aided', 'municipal'],
    required: true
  },
  
  // Approval Details
  approvalType: {
    type: String,
    enum: ['pilot', 'full_rollout', 'renewal'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired', 'cancelled'],
    default: 'pending'
  },
  
  // School Admin Information
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  schoolAdmin: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    phone: String,
    designation: String
  },
  
  // Approval Workflow
  approvalWorkflow: {
    steps: [{
      stepName: String,
      stepOrder: Number,
      status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'skipped'],
        default: 'pending'
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      completedAt: Date,
      comments: String,
      attachments: [{
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now }
      }]
    }],
    currentStep: {
      type: Number,
      default: 0
    },
    totalSteps: {
      type: Number,
      default: 0
    }
  },
  
  // Campaign Details for Approval
  campaignDetails: {
    title: String,
    description: String,
    objectives: [String],
    targetStudents: Number,
    duration: Number, // in days
    startDate: Date,
    endDate: Date,
    budgetAllocation: Number,
    healCoinsAllocation: Number,
    requirements: [String],
    deliverables: [String]
  },
  
  // School Readiness Assessment
  schoolReadiness: {
    infrastructure: {
      hasInternet: Boolean,
      hasComputers: Boolean,
      hasProjector: Boolean,
      hasAudioSystem: Boolean,
      computerCount: Number,
      internetSpeed: String
    },
    staff: {
      principalApproval: Boolean,
      teacherSupport: Number, // count of supporting teachers
      itSupport: Boolean,
      coordinatorAssigned: Boolean,
      coordinatorName: String,
      coordinatorContact: String
    },
    students: {
      targetGradeLevels: [String],
      estimatedParticipation: Number,
      parentConsent: Boolean,
      specialNeeds: Boolean,
      specialNeedsCount: Number
    },
    logistics: {
      preferredTiming: String,
      availableDays: [String],
      spaceAvailable: Boolean,
      spaceCapacity: Number,
      securityArrangements: Boolean
    }
  },
  
  // Approval Decision
  decision: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String,
    conditions: [String], // Any conditions for approval
    validityPeriod: Number, // in days
    expiresAt: Date
  },
  
  // Pilot Results (if applicable)
  pilotResults: {
    isPilotCompleted: {
      type: Boolean,
      default: false
    },
    pilotStartDate: Date,
    pilotEndDate: Date,
    pilotDuration: Number, // in days
    pilotParticipants: Number,
    pilotMetrics: {
      participationRate: Number,
      completionRate: Number,
      engagementScore: Number,
      satisfactionScore: Number,
      technicalIssues: Number,
      dropoutRate: Number
    },
    feedback: {
      schoolAdmin: String,
      teachers: String,
      students: String,
      parents: String
    },
    recommendations: [String],
    lessonsLearned: [String],
    scalabilityAssessment: {
      canScale: Boolean,
      challenges: [String],
      requirements: [String],
      estimatedCapacity: Number
    }
  },
  
  // Communication
  communications: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'notification', 'call', 'meeting']
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound']
    },
    subject: String,
    message: String,
    sentAt: Date,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent'
    }
  }],
  
  // Notifications
  notifications: [{
    type: String,
    message: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    sentTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    sentAt: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Audit Trail
  auditTrail: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
  }],
  
  // Metadata
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
campaignApprovalSchema.index({ campaignId: 1, schoolId: 1 });
campaignApprovalSchema.index({ status: 1, approvalType: 1 });
campaignApprovalSchema.index({ schoolId: 1, status: 1 });
campaignApprovalSchema.index({ organizationId: 1, createdAt: -1 });
campaignApprovalSchema.index({ 'decision.expiresAt': 1 });

// Pre-save middleware to set expiration date
campaignApprovalSchema.pre('save', function(next) {
  if (this.decision.approvedAt && this.decision.validityPeriod && !this.decision.expiresAt) {
    this.decision.expiresAt = new Date(this.decision.approvedAt.getTime() + (this.decision.validityPeriod * 24 * 60 * 60 * 1000));
  }
  next();
});

// Virtual for approval progress percentage
campaignApprovalSchema.virtual('approvalProgress').get(function() {
  if (this.approvalWorkflow.totalSteps === 0) return 0;
  return Math.round((this.approvalWorkflow.currentStep / this.approvalWorkflow.totalSteps) * 100);
});

// Virtual for days until expiration
campaignApprovalSchema.virtual('daysUntilExpiration').get(function() {
  if (!this.decision.expiresAt) return null;
  const now = new Date();
  const diffTime = this.decision.expiresAt - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to add audit entry
campaignApprovalSchema.methods.addAuditEntry = function(action, performedBy, details, oldValue, newValue) {
  this.auditTrail.push({
    action,
    performedBy,
    details,
    oldValue,
    newValue
  });
};

// Method to update approval workflow
campaignApprovalSchema.methods.updateWorkflow = function(stepIndex, status, comments, assignedTo) {
  if (this.approvalWorkflow.steps[stepIndex]) {
    this.approvalWorkflow.steps[stepIndex].status = status;
    this.approvalWorkflow.steps[stepIndex].comments = comments;
    this.approvalWorkflow.steps[stepIndex].assignedTo = assignedTo;
    
    if (status === 'completed') {
      this.approvalWorkflow.steps[stepIndex].completedAt = new Date();
      this.approvalWorkflow.currentStep = stepIndex + 1;
    }
  }
};

// Method to check if approval is expired
campaignApprovalSchema.methods.isExpired = function() {
  if (!this.decision.expiresAt) return false;
  return new Date() > this.decision.expiresAt;
};

const CampaignApproval = mongoose.model('CampaignApproval', campaignApprovalSchema);

export default CampaignApproval;