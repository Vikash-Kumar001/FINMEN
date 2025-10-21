import mongoose from 'mongoose';

const csrKPISchema = new mongoose.Schema({
  // Schools & Students Reached (Coverage)
  schoolsReached: {
    totalSchools: { type: Number, default: 0 },
    activeSchools: { type: Number, default: 0 },
    schoolsByRegion: [{
      region: String,
      count: Number,
      lastUpdated: { type: Date, default: Date.now }
    }]
  },
  
  studentsReached: {
    totalStudents: { type: Number, default: 0 },
    activeStudents: { type: Number, default: 0 },
    studentsByGrade: [{
      grade: String,
      count: Number,
      lastUpdated: { type: Date, default: Date.now }
    }],
    studentsByRegion: [{
      region: String,
      count: Number,
      lastUpdated: { type: Date, default: Date.now }
    }]
  },

  // Campaign Completion Rate
  campaigns: [{
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    campaignName: String,
    totalParticipants: { type: Number, default: 0 },
    completedParticipants: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    targetAudience: String,
    objectives: [String],
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' }
  }],

  // Engagement Lift vs Baseline
  engagementMetrics: {
    baselineEngagement: { type: Number, default: 0 }, // Pre-campaign engagement
    currentEngagement: { type: Number, default: 0 },  // Current engagement
    engagementLift: { type: Number, default: 0 },     // Calculated lift
    metrics: {
      dailyActiveUsers: { type: Number, default: 0 },
      sessionDuration: { type: Number, default: 0 }, // Average in minutes
      completionRate: { type: Number, default: 0 },
      returnRate: { type: Number, default: 0 },
      interactionRate: { type: Number, default: 0 }
    },
    lastCalculated: { type: Date, default: Date.now }
  },

  // Budget Spent (Rewards & Admin Fees)
  budgetMetrics: {
    totalBudget: { type: Number, default: 0 },
    rewardsSpent: { type: Number, default: 0 },
    adminFees: { type: Number, default: 0 },
    operationalCosts: { type: Number, default: 0 },
    remainingBudget: { type: Number, default: 0 },
    budgetBreakdown: [{
      category: String,
      amount: Number,
      percentage: Number,
      description: String
    }],
    monthlySpending: [{
      month: String,
      year: Number,
      rewards: Number,
      admin: Number,
      operational: Number,
      total: Number
    }]
  },

  // Certificates Issued & NEP Competencies
  certificates: {
    totalIssued: { type: Number, default: 0 },
    certificatesByType: [{
      type: String, // 'completion', 'achievement', 'excellence'
      count: Number,
      lastIssued: Date
    }],
    certificatesByModule: [{
      module: String, // 'finance', 'mental', 'values', 'ai'
      count: Number,
      lastIssued: Date
    }],
    pendingCertificates: { type: Number, default: 0 }
  },

  nepCompetencies: {
    totalCompetencies: { type: Number, default: 0 },
    competenciesCovered: { type: Number, default: 0 },
    coveragePercentage: { type: Number, default: 0 },
    competenciesByGrade: [{
      grade: String,
      totalCompetencies: Number,
      coveredCompetencies: Number,
      coveragePercentage: Number
    }],
    competenciesByModule: [{
      module: String,
      competencies: [String],
      coveragePercentage: Number
    }]
  },

  // Overall KPI Summary
  kpiSummary: {
    overallScore: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    trends: {
      coverage: { type: Number, default: 0 }, // Month-over-month change
      engagement: { type: Number, default: 0 },
      budget: { type: Number, default: 0 },
      certificates: { type: Number, default: 0 }
    }
  },

  // Metadata
  period: {
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    type: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'yearly'], default: 'monthly' }
  },

  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  
  // Audit trail
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
}, {
  timestamps: true
});

// Indexes for better performance
csrKPISchema.index({ organizationId: 1, 'period.type': 1, 'period.startDate': 1 });
csrKPISchema.index({ createdAt: -1 });

// Virtual for calculating engagement lift
csrKPISchema.virtual('calculatedEngagementLift').get(function() {
  if (this.engagementMetrics.baselineEngagement > 0) {
    return ((this.engagementMetrics.currentEngagement - this.engagementMetrics.baselineEngagement) / 
            this.engagementMetrics.baselineEngagement) * 100;
  }
  return 0;
});

// Pre-save middleware to calculate derived values
csrKPISchema.pre('save', function(next) {
  // Calculate engagement lift
  this.engagementMetrics.engagementLift = this.calculatedEngagementLift;
  
  // Calculate remaining budget
  this.budgetMetrics.remainingBudget = this.budgetMetrics.totalBudget - 
    this.budgetMetrics.rewardsSpent - 
    this.budgetMetrics.adminFees - 
    this.budgetMetrics.operationalCosts;
  
  // Calculate NEP coverage percentage
  if (this.nepCompetencies.totalCompetencies > 0) {
    this.nepCompetencies.coveragePercentage = 
      (this.nepCompetencies.competenciesCovered / this.nepCompetencies.totalCompetencies) * 100;
  }
  
  next();
});

const CSRKPI = mongoose.model('CSRKPI', csrKPISchema);

export default CSRKPI;
