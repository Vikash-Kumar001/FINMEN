import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  // Basic Campaign Information
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  
  // Campaign Details
  type: { 
    type: String, 
    enum: ['wellness', 'financial_literacy', 'values_education', 'ai_skills', 'general'],
    default: 'general'
  },
  category: { type: String, required: true },
  
  // Campaign Scope
  scope: {
    targetAudience: { 
      type: String, 
      enum: ['all_students', 'specific_grades', 'specific_schools', 'specific_regions'],
      default: 'all_students'
    },
    gradeLevels: [String],
    regions: [String],
    schools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }],
    maxParticipants: { type: Number, default: 1000 },
    minParticipants: { type: Number, default: 10 }
  },

  // Campaign Timeline
  timeline: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pilotStartDate: Date,
    pilotEndDate: Date,
    rolloutDate: Date,
    approvalDeadline: Date
  },

  // Campaign Status & Workflow
  status: {
    type: String,
    enum: ['draft', 'scope_defined', 'templates_selected', 'pending_approval', 'approved', 'pilot', 'rollout', 'active', 'completed', 'paused', 'cancelled'],
    default: 'draft'
  },
  workflowStage: {
    type: String,
    enum: ['scope', 'templates', 'approval', 'pilot', 'rollout', 'active', 'completed'],
    default: 'scope'
  },

  // Campaign Content & Templates
  templates: [{
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    templateName: String,
    category: String,
    weight: { type: Number, default: 1 }, // How much this template contributes to campaign
    isRequired: { type: Boolean, default: false }
  }],

  // Objectives & Success Metrics
  objectives: [String],
  successMetrics: {
    engagementRate: { type: Number, default: 0 }, // Target percentage
    completionRate: { type: Number, default: 0 }, // Target percentage
    satisfactionScore: { type: Number, default: 0 }, // Target score out of 10
    knowledgeGain: { type: Number, default: 0 }, // Target percentage improvement
    behaviorChange: { type: Number, default: 0 } // Target percentage
  },

  // Budget & Resources
  budget: {
    totalBudget: { type: Number, default: 0 },
    allocatedBudget: { type: Number, default: 0 },
    spentBudget: { type: Number, default: 0 },
    remainingBudget: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    budgetBreakdown: [{
      category: String,
      amount: Number,
      description: String
    }]
  },

  // HealCoins Integration
  healCoins: {
    totalFunded: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
    exchangeRate: { type: Number, default: 1 }, // HealCoins to currency ratio
    rewardStructure: {
      participation: { type: Number, default: 10 },
      completion: { type: Number, default: 50 },
      excellence: { type: Number, default: 100 }
    }
  },

  // Campaign Metrics (Real-time)
  metrics: {
    totalParticipants: { type: Number, default: 0 },
    activeParticipants: { type: Number, default: 0 },
    completedParticipants: { type: Number, default: 0 },
    dropoutRate: { type: Number, default: 0 },
    averageEngagementTime: { type: Number, default: 0 }, // in minutes
    averageCompletionTime: { type: Number, default: 0 }, // in days
    satisfactionScore: { type: Number, default: 0 },
    knowledgeImprovement: { type: Number, default: 0 }
  },

  // Approval & Review
  approval: {
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    approvalNotes: String,
    reviewers: [{ 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      comments: String,
      reviewedAt: Date
    }]
  },

  // Pilot Results
  pilotResults: {
    isPilotCompleted: { type: Boolean, default: false },
    pilotParticipants: { type: Number, default: 0 },
    pilotMetrics: {
      engagementRate: Number,
      completionRate: Number,
      satisfactionScore: Number,
      feedback: String
    },
    pilotRecommendations: String,
    adjustments: [String] // Changes made based on pilot
  },

  // Co-branding & Legal
  cobranding: {
    partnerName: String,
    partnerLogo: String,
    partnerWebsite: String,
    contractLink: String,
    agreementStatus: { 
      type: String, 
      enum: ['pending', 'signed', 'expired', 'terminated'],
      default: 'pending'
    },
    contractStartDate: Date,
    contractEndDate: Date,
    assets: [{
      type: { type: String, enum: ['logo', 'banner', 'document', 'video', 'other'] },
      url: String,
      name: String,
      description: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    legalCompliance: {
      isCompliant: { type: Boolean, default: false },
      complianceNotes: String,
      lastReviewed: Date,
      nextReview: Date
    }
  },

  // Impact & Reporting
  impactReports: [{
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'ImpactReport' },
    reportType: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'final'] },
    generatedAt: { type: Date, default: Date.now },
    metrics: mongoose.Schema.Types.Mixed,
    insights: String,
    recommendations: String
  }],

  // Metadata
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Tags and categorization
  tags: [String],
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  
  // Notifications and alerts
  notifications: [{
    type: String,
    message: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]

}, {
  timestamps: true
});

// Indexes for better performance
campaignSchema.index({ organizationId: 1, status: 1 });
campaignSchema.index({ 'timeline.startDate': 1, 'timeline.endDate': 1 });
campaignSchema.index({ createdBy: 1 });
campaignSchema.index({ status: 1, workflowStage: 1 });

// Virtual for campaign duration
campaignSchema.virtual('duration').get(function() {
  if (this.timeline.startDate && this.timeline.endDate) {
    return Math.ceil((this.timeline.endDate - this.timeline.startDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for completion percentage
campaignSchema.virtual('completionPercentage').get(function() {
  if (this.metrics.totalParticipants > 0) {
    return (this.metrics.completedParticipants / this.metrics.totalParticipants) * 100;
  }
  return 0;
});

// Pre-save middleware to calculate derived values
campaignSchema.pre('save', function(next) {
  // Calculate remaining budget
  this.budget.remainingBudget = this.budget.totalBudget - this.budget.spentBudget;
  
  // Calculate remaining HealCoins
  this.healCoins.remaining = this.healCoins.totalFunded - this.healCoins.spent;
  
  // Calculate dropout rate
  if (this.metrics.totalParticipants > 0) {
    this.metrics.dropoutRate = ((this.metrics.totalParticipants - this.metrics.activeParticipants) / this.metrics.totalParticipants) * 100;
  }
  
  next();
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
