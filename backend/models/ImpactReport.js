import mongoose from 'mongoose';

const impactReportSchema = new mongoose.Schema({
  // Report Basic Information
  reportId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String },
  
  // Report Type and Period
  reportType: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly', 'annual', 'campaign', 'custom'],
    required: true
  },
  
  // Time Period
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    year: Number,
    quarter: Number,
    month: Number,
    week: Number
  },
  
  // Report Context
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  
  // Report Status
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'published', 'archived'],
    default: 'draft'
  },
  
  // Report Metrics and Data
  metrics: {
    // Coverage Metrics
    coverage: {
      schoolsReached: { type: Number, default: 0 },
      studentsReached: { type: Number, default: 0 },
      teachersInvolved: { type: Number, default: 0 },
      regionsCovered: { type: Number, default: 0 },
      gradeLevels: [String]
    },
    
    // Engagement Metrics
    engagement: {
      totalParticipants: { type: Number, default: 0 },
      activeParticipants: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
      averageSessionTime: { type: Number, default: 0 },
      returnRate: { type: Number, default: 0 },
      engagementScore: { type: Number, default: 0 }
    },
    
    // Learning Outcomes
    learningOutcomes: {
      knowledgeImprovement: { type: Number, default: 0 },
      skillDevelopment: { type: Number, default: 0 },
      behaviorChange: { type: Number, default: 0 },
      satisfactionScore: { type: Number, default: 0 },
      competencyCoverage: { type: Number, default: 0 }
    },
    
    // Financial Metrics
    financial: {
      totalBudget: { type: Number, default: 0 },
      spentBudget: { type: Number, default: 0 },
      remainingBudget: { type: Number, default: 0 },
      healCoinsFunded: { type: Number, default: 0 },
      healCoinsSpent: { type: Number, default: 0 },
      costPerStudent: { type: Number, default: 0 },
      roi: { type: Number, default: 0 }
    },
    
    // Impact Metrics
    impact: {
      certificatesIssued: { type: Number, default: 0 },
      awardsGiven: { type: Number, default: 0 },
      testimonials: { type: Number, default: 0 },
      caseStudies: { type: Number, default: 0 },
      socialMediaReach: { type: Number, default: 0 }
    }
  },
  
  // Detailed Data and Insights
  insights: {
    keyFindings: [String],
    trends: [String],
    challenges: [String],
    opportunities: [String],
    recommendations: [String],
    successStories: [String]
  },
  
  // Visual Data for Charts and Graphs
  chartData: {
    engagementTrend: [{
      date: Date,
      participants: Number,
      completions: Number,
      engagement: Number
    }],
    regionalDistribution: [{
      region: String,
      students: Number,
      schools: Number,
      impact: Number
    }],
    budgetBreakdown: [{
      category: String,
      amount: Number,
      percentage: Number
    }],
    competencyProgress: [{
      competency: String,
      baseline: Number,
      current: Number,
      improvement: Number
    }]
  },
  
  // Report Files and Attachments
  attachments: [{
    type: { type: String, enum: ['pdf', 'excel', 'powerpoint', 'image', 'video', 'document'] },
    filename: String,
    url: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Report Generation and Publishing
  generatedAt: Date,
  publishedAt: Date,
  archivedAt: Date,
  
  // Sharing and Distribution
  sharing: {
    isPublic: { type: Boolean, default: false },
    sharedWith: [{
      email: String,
      role: String,
      sharedAt: { type: Date, default: Date.now() }
    }],
    publicUrl: String,
    downloadCount: { type: Number, default: 0 }
  },
  
  // Approval and Review
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
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Tags and Categories
  tags: [String],
  categories: [String],
  
  // Version Control
  version: { type: Number, default: 1 },
  previousVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'ImpactReport' },
  
  // Notifications
  notifications: [{
    type: String,
    message: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
  }]

}, {
  timestamps: true
});

// Indexes for better performance
impactReportSchema.index({ organizationId: 1, createdAt: -1 });
impactReportSchema.index({ campaignId: 1, reportType: 1 });
impactReportSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
impactReportSchema.index({ status: 1, generatedAt: -1 });

// Pre-save middleware to generate report ID
impactReportSchema.pre('save', async function(next) {
  if (!this.reportId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 9);
    this.reportId = `RPT_${timestamp}_${random}`.toUpperCase();
  }
  
  // Set period details
  if (this.period.startDate) {
    this.period.year = this.period.startDate.getFullYear();
    this.period.month = this.period.startDate.getMonth() + 1;
    
    // Calculate quarter
    this.period.quarter = Math.ceil(this.period.month / 3);
    
    // Calculate week (simplified)
    const startOfYear = new Date(this.period.year, 0, 1);
    const diffTime = this.period.startDate - startOfYear;
    this.period.week = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }
  
  next();
});

// Virtual for report duration in days
impactReportSchema.virtual('duration').get(function() {
  if (this.period.startDate && this.period.endDate) {
    return Math.ceil((this.period.endDate - this.period.startDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Static method to generate automated report
impactReportSchema.statics.generateAutomatedReport = async function(organizationId, reportType, period) {
  // This would contain logic to automatically generate reports
  // based on existing data and metrics
  const reportData = {
    organizationId,
    reportType,
    period,
    status: 'generating',
    generatedAt: new Date()
  };
  
  return await this.create(reportData);
};

// Instance method to export report
impactReportSchema.methods.exportReport = function(format = 'json') {
  const exportData = {
    reportId: this.reportId,
    title: this.title,
    reportType: this.reportType,
    period: this.period,
    metrics: this.metrics,
    insights: this.insights,
    generatedAt: this.generatedAt,
    exportedAt: new Date()
  };
  
  return exportData;
};

const ImpactReport = mongoose.model('ImpactReport', impactReportSchema);

export default ImpactReport;
