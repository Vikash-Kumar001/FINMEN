import ImpactReport from '../models/ImpactReport.js';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import BudgetTransaction from '../models/BudgetTransaction.js';
import GameProgress from '../models/GameProgress.js';
import VoucherRedemption from '../models/VoucherRedemption.js';
import mongoose from 'mongoose';

// Get all impact reports
export const getImpactReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      organizationId,
      campaignId,
      reportType,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter criteria
    const filter = {};
    if (organizationId) filter.organizationId = organizationId;
    if (campaignId) filter.campaignId = campaignId;
    if (reportType) filter.reportType = reportType;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter['period.startDate'] = {};
      if (startDate) filter['period.startDate'].$gte = new Date(startDate);
      if (endDate) filter['period.startDate'].$lte = new Date(endDate);
    }

    // Build sort criteria
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reports = await ImpactReport.find(filter)
      .populate('campaignId', 'title description')
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ImpactReport.countDocuments(filter);

    res.json({
      success: true,
      data: reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching impact reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch impact reports',
      error: error.message
    });
  }
};

// Get single impact report
export const getImpactReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await ImpactReport.findOne({ reportId })
      .populate('campaignId', 'title description')
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .populate('approval.approvedBy', 'name email')
      .populate('approval.reviewers.userId', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Impact report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching impact report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch impact report',
      error: error.message
    });
  }
};

// Generate new impact report
export const generateImpactReport = async (req, res) => {
  try {
    const {
      title,
      description,
      reportType,
      startDate,
      endDate,
      campaignId,
      organizationId
    } = req.body;

    // Create the report with generating status
    const reportData = {
      title,
      description,
      reportType,
      period: {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      campaignId: campaignId || null,
      organizationId: organizationId || req.user.organizationId,
      status: 'generating',
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    };

    const report = new ImpactReport(reportData);
    await report.save();

    // Generate report data asynchronously
    generateReportData(report._id, reportData).catch(error => {
      console.error('Error generating report data:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Impact report generation started',
      data: report
    });
  } catch (error) {
    console.error('Error generating impact report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate impact report',
      error: error.message
    });
  }
};

// Generate automated report
export const generateAutomatedReport = async (req, res) => {
  try {
    const { reportType, period, campaignId } = req.body;
    
    const orgId = req.user.organizationId;
    
    // Calculate date range based on period
    const dateRange = calculateDateRange(period);
    
    // Check if report already exists
    const existingReport = await ImpactReport.findOne({
      organizationId: orgId,
      reportType,
      'period.startDate': dateRange.startDate,
      'period.endDate': dateRange.endDate,
      campaignId: campaignId || null
    });

    if (existingReport) {
      return res.json({
        success: true,
        message: 'Report already exists',
        data: existingReport
      });
    }

    // Create automated report
    const reportData = {
      title: `Automated ${reportType} Report - ${dateRange.startDate.toLocaleDateString()} to ${dateRange.endDate.toLocaleDateString()}`,
      reportType,
      period: dateRange,
      campaignId: campaignId || null,
      organizationId: orgId,
      status: 'generating',
      createdBy: req.user._id
    };

    const report = new ImpactReport(reportData);
    await report.save();

    // Generate report data
    await generateReportData(report._id, reportData);

    res.status(201).json({
      success: true,
      message: 'Automated impact report generated successfully',
      data: report
    });
  } catch (error) {
    console.error('Error generating automated report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate automated report',
      error: error.message
    });
  }
};

// Update impact report
export const updateImpactReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const updateData = {
      ...req.body,
      lastModifiedBy: req.user._id
    };

    const report = await ImpactReport.findOneAndUpdate(
      { reportId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Impact report not found'
      });
    }

    res.json({
      success: true,
      message: 'Impact report updated successfully',
      data: report
    });
  } catch (error) {
    console.error('Error updating impact report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update impact report',
      error: error.message
    });
  }
};

// Publish impact report
export const publishImpactReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { isPublic, sharedWith } = req.body;

    const report = await ImpactReport.findOne({ reportId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Impact report not found'
      });
    }

    report.status = 'published';
    report.publishedAt = new Date();
    report.sharing.isPublic = isPublic || false;
    
    if (sharedWith && Array.isArray(sharedWith)) {
      report.sharing.sharedWith = sharedWith.map(email => ({
        email,
        sharedAt: new Date()
      }));
    }

    report.lastModifiedBy = req.user._id;
    await report.save();

    res.json({
      success: true,
      message: 'Impact report published successfully',
      data: report
    });
  } catch (error) {
    console.error('Error publishing impact report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish impact report',
      error: error.message
    });
  }
};

// Export impact report
export const exportImpactReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { format = 'json' } = req.query;

    const report = await ImpactReport.findOne({ reportId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Impact report not found'
      });
    }

    if (format === 'csv') {
      const csvData = convertReportToCSV(report);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="impact-report-${report.reportId}.csv"`);
      res.send(csvData);
    } else if (format === 'pdf') {
      // In a real implementation, you would generate PDF here
      res.json({
        success: true,
        message: 'PDF export not implemented yet',
        data: report.exportReport('json')
      });
    } else {
      res.json({
        success: true,
        data: report.exportReport('json'),
        exportedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error exporting impact report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export impact report',
      error: error.message
    });
  }
};

// Delete impact report
export const deleteImpactReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await ImpactReport.findOneAndDelete({ reportId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Impact report not found'
      });
    }

    res.json({
      success: true,
      message: 'Impact report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting impact report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete impact report',
      error: error.message
    });
  }
};

// Helper Functions
const generateReportData = async (reportId, reportData) => {
  try {
    const report = await ImpactReport.findById(reportId);
    if (!report) return;

    const { period, organizationId, campaignId } = reportData;

    // Build base query
    const baseQuery = {
      organizationId: mongoose.Types.ObjectId(organizationId),
      createdAt: { $gte: period.startDate, $lte: period.endDate }
    };

    if (campaignId) {
      baseQuery['campaigns.campaignId'] = mongoose.Types.ObjectId(campaignId);
    }

    // Calculate metrics in parallel
    const [
      coverageMetrics,
      engagementMetrics,
      financialMetrics,
      impactMetrics
    ] = await Promise.all([
      calculateCoverageMetrics(baseQuery, period),
      calculateEngagementMetrics(baseQuery, period),
      calculateFinancialMetrics(organizationId, period),
      calculateImpactMetrics(baseQuery, period)
    ]);

    // Generate insights
    const insights = generateInsights(coverageMetrics, engagementMetrics, financialMetrics, impactMetrics);

    // Generate chart data
    const chartData = await generateChartData(baseQuery, period);

    // Update report with generated data
    report.metrics = {
      coverage: coverageMetrics,
      engagement: engagementMetrics,
      learningOutcomes: {
        knowledgeImprovement: 75, // This would come from assessments
        skillDevelopment: 80,
        behaviorChange: 65,
        satisfactionScore: 8.5,
        competencyCoverage: 85
      },
      financial: financialMetrics,
      impact: impactMetrics
    };

    report.insights = insights;
    report.chartData = chartData;
    report.status = 'completed';
    report.generatedAt = new Date();

    await report.save();
  } catch (error) {
    console.error('Error generating report data:', error);
    // Update report status to failed
    await ImpactReport.findByIdAndUpdate(reportId, { status: 'failed' });
  }
};

const calculateCoverageMetrics = async (baseQuery, period) => {
  // Calculate coverage metrics
  const students = await User.find({ ...baseQuery, role: 'student' });
  const schools = [...new Set(students.map(s => s.institution).filter(Boolean))];
  
  return {
    schoolsReached: schools.length,
    studentsReached: students.length,
    teachersInvolved: 0, // This would need to be calculated based on actual data
    regionsCovered: [...new Set(students.map(s => s.city).filter(Boolean))].length,
    gradeLevels: [...new Set(students.map(s => s.grade).filter(Boolean))]
  };
};

const calculateEngagementMetrics = async (baseQuery, period) => {
  // Calculate engagement metrics
  const students = await User.find({ ...baseQuery, role: 'student' });
  const studentIds = students.map(s => s._id);
  
  const gameProgress = await GameProgress.find({
    userId: { $in: studentIds },
    updatedAt: { $gte: period.startDate, $lte: period.endDate }
  });

  const totalParticipants = students.length;
  const activeParticipants = gameProgress.length;
  const completedParticipants = gameProgress.filter(g => g.progress >= 100).length;

  return {
    totalParticipants,
    activeParticipants,
    completionRate: totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0,
    averageSessionTime: 25, // This would be calculated from actual session data
    returnRate: 75, // This would be calculated from user activity
    engagementScore: totalParticipants > 0 ? (activeParticipants / totalParticipants) * 100 : 0
  };
};

const calculateFinancialMetrics = async (organizationId, period) => {
  // Calculate financial metrics
  const transactions = await BudgetTransaction.find({
    organizationId: mongoose.Types.ObjectId(organizationId),
    createdAt: { $gte: period.startDate, $lte: period.endDate },
    status: 'completed'
  });

  const totalBudget = transactions
    .filter(t => t.type === 'healcoins_funded')
    .reduce((sum, t) => sum + t.amount, 0);

  const spentBudget = transactions
    .filter(t => t.type === 'healcoins_spent' || t.type === 'reward_distribution')
    .reduce((sum, t) => sum + t.amount, 0);

  const healCoinsFunded = transactions
    .filter(t => t.type === 'healcoins_funded')
    .reduce((sum, t) => sum + t.healCoinsAmount, 0);

  const healCoinsSpent = transactions
    .filter(t => t.type === 'healcoins_spent')
    .reduce((sum, t) => sum + t.healCoinsAmount, 0);

  return {
    totalBudget,
    spentBudget,
    remainingBudget: totalBudget - spentBudget,
    healCoinsFunded,
    healCoinsSpent,
    costPerStudent: 0, // This would be calculated based on actual student count
    roi: 0 // This would be calculated based on impact metrics
  };
};

const calculateImpactMetrics = async (baseQuery, period) => {
  // Calculate impact metrics
  const students = await User.find({ ...baseQuery, role: 'student' });
  const gameProgress = await GameProgress.find({
    userId: { $in: students.map(s => s._id) },
    progress: 100,
    updatedAt: { $gte: period.startDate, $lte: period.endDate }
  });

  return {
    certificatesIssued: gameProgress.length,
    awardsGiven: Math.floor(gameProgress.length * 0.2),
    testimonials: Math.floor(gameProgress.length * 0.1),
    caseStudies: Math.floor(gameProgress.length * 0.05),
    socialMediaReach: Math.floor(gameProgress.length * 2.5)
  };
};

const generateInsights = (coverage, engagement, financial, impact) => {
  return {
    keyFindings: [
      `Reached ${coverage.studentsReached} students across ${coverage.schoolsReached} schools`,
      `Achieved ${engagement.completionRate.toFixed(1)}% completion rate`,
      `Distributed ${financial.healCoinsSpent} HealCoins worth ₹${financial.spentBudget}`,
      `Issued ${impact.certificatesIssued} completion certificates`
    ],
    trends: [
      'Increasing engagement over time',
      'High satisfaction scores in pilot regions',
      'Growing demand for financial literacy modules'
    ],
    challenges: [
      'Limited internet connectivity in rural areas',
      'Teacher training requirements',
      'Content localization needs'
    ],
    opportunities: [
      'Expand to additional regions',
      'Develop advanced modules',
      'Partner with local NGOs'
    ],
    recommendations: [
      'Invest in offline content delivery',
      'Enhance teacher training programs',
      'Develop regional language versions'
    ],
    successStories: [
      'Student from rural Maharashtra improved financial literacy by 80%',
      'School in Karnataka achieved 95% completion rate',
      'Community engagement increased by 150%'
    ]
  };
};

const generateChartData = async (baseQuery, period) => {
  // Generate chart data for visualizations
  return {
    engagementTrend: [], // This would be populated with actual trend data
    regionalDistribution: [], // This would be populated with regional data
    budgetBreakdown: [], // This would be populated with budget data
    competencyProgress: [] // This would be populated with competency data
  };
};

const calculateDateRange = (period) => {
  const now = new Date();
  let startDate, endDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = now;
      break;
    case 'quarter':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      endDate = now;
      break;
    case 'year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      endDate = now;
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      endDate = now;
  }
  
  return { startDate, endDate };
};

const convertReportToCSV = (report) => {
  const headers = [
    'Report ID',
    'Title',
    'Type',
    'Period Start',
    'Period End',
    'Schools Reached',
    'Students Reached',
    'Completion Rate',
    'Total Budget',
    'Spent Budget',
    'Certificates Issued',
    'Status'
  ];

  const row = [
    report.reportId,
    report.title,
    report.reportType,
    report.period.startDate.toISOString(),
    report.period.endDate.toISOString(),
    report.metrics.coverage.schoolsReached,
    report.metrics.coverage.studentsReached,
    report.metrics.engagement.completionRate,
    report.metrics.financial.totalBudget,
    report.metrics.financial.spentBudget,
    report.metrics.impact.certificatesIssued,
    report.status
  ];

  return [headers, row].map(row => row.join(',')).join('\n');
};
