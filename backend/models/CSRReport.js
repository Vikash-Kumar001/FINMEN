import mongoose from 'mongoose';

const csrReportSchema = new mongoose.Schema({
  // Report Identification
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  reportType: {
    type: String,
    enum: ['quarterly', 'annual', 'campaign', 'custom', 'impact'],
    required: true
  },
  reportName: {
    type: String,
    required: true
  },
  
  // Organization and Campaign Reference
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  organizationName: String,
  campaignIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }],
  
  // Report Period
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    quarter: String, // Q1, Q2, Q3, Q4
    year: Number
  },
  
  // Report Metrics
  metrics: {
    // Schools and Students
    schoolsReached: {
      totalSchools: Number,
      activeSchools: Number,
      schoolsByRegion: [{
        region: String,
        count: Number,
        percentage: Number
      }],
      schoolsByType: [{
        type: String, // government, private, aided
        count: Number,
        percentage: Number
      }]
    },
    
    studentsReached: {
      totalStudents: Number,
      activeStudents: Number,
      studentsByGrade: [{
        grade: String,
        count: Number,
        percentage: Number
      }],
      studentsByGender: [{
        gender: String,
        count: Number,
        percentage: Number
      }]
    },
    
    // Completion Rates
    completionRates: {
      overallCompletionRate: Number,
      completionByCampaign: [{
        campaignId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Campaign'
        },
        campaignName: String,
        totalParticipants: Number,
        completedParticipants: Number,
        completionRate: Number
      }],
      completionByGrade: [{
        grade: String,
        completionRate: Number,
        totalStudents: Number
      }],
      completionBySchool: [{
        schoolId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Organization'
        },
        schoolName: String,
        completionRate: Number,
        totalStudents: Number
      }]
    },
    
    // Learning Improvements
    learningImprovements: {
      averageImprovement: Number,
      improvementsByPillar: [{
        pillar: String, // financial_literacy, mental_health, values, ai_skills
        baselineScore: Number,
        finalScore: Number,
        improvement: Number,
        improvementPercentage: Number,
        studentsAssessed: Number
      }],
      improvementsByGrade: [{
        grade: String,
        averageImprovement: Number,
        studentsAssessed: Number
      }],
      improvementsBySchool: [{
        schoolId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Organization'
        },
        schoolName: String,
        averageImprovement: Number,
        studentsAssessed: Number
      }]
    },
    
    // Certificates
    certificates: {
      totalIssued: Number,
      certificatesByType: [{
        type: String, // completion, achievement, excellence
        count: Number,
        percentage: Number
      }],
      certificatesByModule: [{
        module: String,
        count: Number,
        percentage: Number
      }],
      certificatesByGrade: [{
        grade: String,
        count: Number,
        percentage: Number
      }],
      pendingCertificates: Number
    },
    
    // Financial Metrics
    financialMetrics: {
      totalSpend: Number,
      spendPerStudent: Number,
      spendByCategory: [{
        category: String,
        amount: Number,
        percentage: Number
      }],
      healCoinsDistributed: Number,
      healCoinsPerStudent: Number,
      budgetUtilization: Number,
      costPerCompletion: Number
    },
    
    // Engagement Metrics
    engagementMetrics: {
      averageEngagementScore: Number,
      averageSessionDuration: Number,
      averageSessionsPerStudent: Number,
      returnRate: Number,
      dropoutRate: Number,
      satisfactionScore: Number
    }
  },
  
  // NEP Competency Mapping
  nepMapping: {
    totalCompetencies: Number,
    competenciesCovered: Number,
    coveragePercentage: Number,
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
  
  // Report Content
  content: {
    executiveSummary: String,
    keyHighlights: [String],
    challenges: [String],
    recommendations: [String],
    nextSteps: [String],
    testimonials: [{
      quote: String,
      author: String,
      role: String,
      school: String
    }]
  },
  
  // Visualizations and Charts
  visualizations: {
    charts: [{
      type: String, // bar, pie, line, donut
      title: String,
      data: mongoose.Schema.Types.Mixed,
      config: mongoose.Schema.Types.Mixed
    }],
    images: [{
      type: String, // chart, photo, infographic
      url: String,
      caption: String,
      order: Number
    }]
  },
  
  // Branding and Styling
  branding: {
    logoUrl: String,
    primaryColor: String,
    secondaryColor: String,
    fontFamily: String,
    customCss: String,
    headerTemplate: String,
    footerTemplate: String
  },
  
  // Report Status and Processing
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'failed', 'archived'],
    default: 'draft'
  },
  generatedAt: Date,
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // File Information
  files: {
    pdfUrl: String,
    pdfSize: Number,
    excelUrl: String,
    excelSize: Number,
    generatedAt: Date
  },
  
  // Sharing and Distribution
  sharing: {
    isPublic: {
      type: Boolean,
      default: false
    },
    sharedWith: [{
      email: String,
      role: String,
      sharedAt: Date,
      accessLevel: {
        type: String,
        enum: ['view', 'download', 'edit'],
        default: 'view'
      }
    }],
    downloadCount: {
      type: Number,
      default: 0
    },
    lastDownloadedAt: Date
  },
  
  // Approval and Review
  approval: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'under_review'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    reviewComments: String,
    approvedAt: Date
  },
  
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
    changes: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Indexes for better performance
csrReportSchema.index({ organizationId: 1, createdAt: -1 });
// reportId already has unique: true in field definition, no need for explicit index
csrReportSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
csrReportSchema.index({ status: 1, 'approval.status': 1 });
csrReportSchema.index({ reportType: 1, 'period.year': 1 });

// Pre-save middleware to generate report ID
csrReportSchema.pre('save', function(next) {
  if (this.isNew && !this.reportId) {
    const year = this.period.year || new Date().getFullYear();
    const quarter = this.period.quarter || 'Q1';
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.reportId = `CSR-${year}-${quarter}-${sequence}`;
  }
  next();
});

// Virtual for report duration in days
csrReportSchema.virtual('durationDays').get(function() {
  return Math.ceil((this.period.endDate - this.period.startDate) / (1000 * 60 * 60 * 24));
});

// Virtual for report title
csrReportSchema.virtual('reportTitle').get(function() {
  const year = this.period.year || new Date().getFullYear();
  const quarter = this.period.quarter || '';
  return `${this.reportName} - ${year} ${quarter}`.trim();
});

// Method to calculate key metrics
csrReportSchema.methods.calculateKeyMetrics = function() {
  const metrics = this.metrics;
  
  return {
    totalImpact: {
      schools: metrics.schoolsReached.totalSchools,
      students: metrics.studentsReached.totalStudents,
      completionRate: metrics.completionRates.overallCompletionRate,
      averageImprovement: metrics.learningImprovements.averageImprovement,
      certificatesIssued: metrics.certificates.totalIssued,
      spendPerStudent: metrics.financialMetrics.spendPerStudent
    },
    efficiency: {
      costPerCompletion: metrics.financialMetrics.costPerCompletion,
      budgetUtilization: metrics.financialMetrics.budgetUtilization,
      engagementScore: metrics.engagementMetrics.averageEngagementScore
    },
    quality: {
      satisfactionScore: metrics.engagementMetrics.satisfactionScore,
      returnRate: metrics.engagementMetrics.returnRate,
      dropoutRate: metrics.engagementMetrics.dropoutRate
    }
  };
};

// Method to generate executive summary
csrReportSchema.methods.generateExecutiveSummary = function() {
  const keyMetrics = this.calculateKeyMetrics();
  
  return `This CSR report covers ${keyMetrics.totalImpact.schools} schools and ${keyMetrics.totalImpact.students} students ` +
         `with a ${keyMetrics.totalImpact.completionRate}% completion rate. ` +
         `Students showed an average improvement of ${keyMetrics.totalImpact.averageImprovement}% ` +
         `across targeted learning pillars, with ${keyMetrics.totalImpact.certificatesIssued} certificates issued. ` +
         `The program achieved a cost efficiency of ₹${keyMetrics.totalImpact.spendPerStudent} per student.`;
};

const CSRReport = mongoose.model('CSRReport', csrReportSchema);

export default CSRReport;
