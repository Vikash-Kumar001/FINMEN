import CSRReport from '../models/CSRReport.js';
import Campaign from '../models/Campaign.js';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import GameProgress from '../models/GameProgress.js';
import VoucherRedemption from '../models/VoucherRedemption.js';
import Wallet from '../models/Wallet.js';
import SpendLedger from '../models/SpendLedger.js';
import mongoose from 'mongoose';
import pdfReportGenerator from '../services/pdfReportGenerator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate CSR Report
export const generateCSRReport = async (req, res) => {
  try {
    const {
      reportType,
      reportName,
      startDate,
      endDate,
      campaignIds,
      branding,
      includeTestimonials
    } = req.body;

    // Validate required fields
    if (!reportType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Report type, start date, and end date are required'
      });
    }

    // Calculate report metrics
    const metrics = await calculateReportMetrics(req.user?.organizationId || '507f1f77bcf86cd799439011', startDate, endDate, campaignIds);
    
    // Generate NEP mapping
    const nepMapping = await calculateNEPMapping(req.user?.organizationId || '507f1f77bcf86cd799439011', startDate, endDate, campaignIds);
    
    // Generate content
    const content = await generateReportContent(metrics, nepMapping, includeTestimonials);
    
    // Create report record
    const report = new CSRReport({
      reportType,
      reportName: reportName || `${reportType} CSR Report`,
      organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011',
      organizationName: req.user.organization?.name || 'CSR Organization',
      campaignIds: campaignIds || [],
      period: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        year: new Date(startDate).getFullYear(),
        quarter: getQuarter(new Date(startDate))
      },
      metrics,
      nepMapping,
      content,
      branding: branding || {},
      generatedBy: req.user._id,
      status: 'generating'
    });

    await report.save();

    // Generate PDF asynchronously
    generatePDFAsync(report._id);

    res.json({
      success: true,
      message: 'CSR report generation started',
      data: {
        reportId: report.reportId,
        reportName: report.reportName,
        status: report.status,
        estimatedCompletionTime: '2-3 minutes'
      }
    });
  } catch (error) {
    console.error('Error generating CSR report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate CSR report',
      error: error.message
    });
  }
};

// Get CSR Reports
export const getCSRReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      reportType,
      startDate,
      endDate,
      status
    } = req.query;

    const filter = {
      organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011'
    };

    if (reportType) filter.reportType = reportType;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter['period.startDate'] = {};
      if (startDate) filter['period.startDate'].$gte = new Date(startDate);
      if (endDate) filter['period.startDate'].$lte = new Date(endDate);
    }

    const reports = await CSRReport.find(filter)
      .populate('generatedBy', 'name email')
      .populate('campaignIds', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CSRReport.countDocuments(filter);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching CSR reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CSR reports',
      error: error.message
    });
  }
};

// Get CSR Report by ID
export const getCSRReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await CSRReport.findOne({ reportId })
      .populate('generatedBy', 'name email')
      .populate('campaignIds', 'title description')
      .populate('organizationId', 'name');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching CSR report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CSR report',
      error: error.message
    });
  }
};

// Download CSR Report PDF
export const downloadCSRReportPDF = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await CSRReport.findOne({ reportId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (!report.files.pdfUrl) {
      return res.status(400).json({
        success: false,
        message: 'PDF not yet generated. Please try again in a few minutes.'
      });
    }

    // Update download count
    report.sharing.downloadCount += 1;
    report.sharing.lastDownloadedAt = new Date();
    await report.save();

    // Stream the PDF file
    const filePath = path.join(__dirname, '..', 'uploads', 'reports', report.files.pdfUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.reportId}.pdf"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading CSR report PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download CSR report PDF',
      error: error.message
    });
  }
};

// Get Report Status
export const getReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await CSRReport.findOne({ reportId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: {
        reportId: report.reportId,
        status: report.status,
        generatedAt: report.generatedAt,
        files: report.files,
        progress: getReportProgress(report.status)
      }
    });
  } catch (error) {
    console.error('Error fetching report status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report status',
      error: error.message
    });
  }
};

// Share Report
export const shareReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { email, role, accessLevel = 'view' } = req.body;

    const report = await CSRReport.findOne({ reportId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Add to shared with list
    report.sharing.sharedWith.push({
      email,
      role,
      sharedAt: new Date(),
      accessLevel
    });

    await report.save();

    res.json({
      success: true,
      message: 'Report shared successfully',
      data: {
        sharedWith: report.sharing.sharedWith
      }
    });
  } catch (error) {
    console.error('Error sharing report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share report',
      error: error.message
    });
  }
};

// Helper Functions

// Calculate report metrics
async function calculateReportMetrics(organizationId, startDate, endDate, campaignIds) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get campaigns
  const campaigns = campaignIds && campaignIds.length > 0 
    ? await Campaign.find({ _id: { $in: campaignIds } })
    : await Campaign.find({ organizationId, createdAt: { $gte: start, $lte: end } });

  // Calculate schools and students reached
  const schoolsReached = await calculateSchoolsReached(organizationId, start, end, campaigns);
  const studentsReached = await calculateStudentsReached(organizationId, start, end, campaigns);
  
  // Calculate completion rates
  const completionRates = await calculateCompletionRates(organizationId, start, end, campaigns);
  
  // Calculate learning improvements
  const learningImprovements = await calculateLearningImprovements(organizationId, start, end, campaigns);
  
  // Calculate certificates
  const certificates = await calculateCertificates(organizationId, start, end, campaigns);
  
  // Calculate financial metrics
  const financialMetrics = await calculateFinancialMetrics(organizationId, start, end, campaigns);
  
  // Calculate engagement metrics
  const engagementMetrics = await calculateEngagementMetrics(organizationId, start, end, campaigns);

  return {
    schoolsReached,
    studentsReached,
    completionRates,
    learningImprovements,
    certificates,
    financialMetrics,
    engagementMetrics
  };
}

// Calculate schools reached
async function calculateSchoolsReached(organizationId, start, end, campaigns) {
  // Mock implementation - replace with actual data queries
  return {
    totalSchools: 45,
    activeSchools: 38,
    schoolsByRegion: [
      { region: 'Delhi', count: 15, percentage: 33.3 },
      { region: 'Mumbai', count: 10, percentage: 22.2 },
      { region: 'Bangalore', count: 20, percentage: 44.4 }
    ],
    schoolsByType: [
      { type: 'government', count: 25, percentage: 55.6 },
      { type: 'private', count: 15, percentage: 33.3 },
      { type: 'aided', count: 5, percentage: 11.1 }
    ]
  };
}

// Calculate students reached
async function calculateStudentsReached(organizationId, start, end, campaigns) {
  // Mock implementation - replace with actual data queries
  return {
    totalStudents: 1250,
    activeStudents: 980,
    studentsByGrade: [
      { grade: '6', count: 300, percentage: 24.0 },
      { grade: '7', count: 400, percentage: 32.0 },
      { grade: '8', count: 550, percentage: 44.0 }
    ],
    studentsByGender: [
      { gender: 'male', count: 650, percentage: 52.0 },
      { gender: 'female', count: 600, percentage: 48.0 }
    ]
  };
}

// Calculate completion rates
async function calculateCompletionRates(organizationId, start, end, campaigns) {
  // Mock implementation - replace with actual data queries
  return {
    overallCompletionRate: 78.4,
    completionByCampaign: campaigns.map(campaign => ({
      campaignId: campaign._id,
      campaignName: campaign.title,
      totalParticipants: Math.floor(Math.random() * 200) + 100,
      completedParticipants: Math.floor(Math.random() * 150) + 80,
      completionRate: Math.floor(Math.random() * 30) + 70
    })),
    completionByGrade: [
      { grade: '6', completionRate: 75.2, totalStudents: 300 },
      { grade: '7', completionRate: 80.1, totalStudents: 400 },
      { grade: '8', completionRate: 79.8, totalStudents: 550 }
    ],
    completionBySchool: [
      { schoolId: 'school1', schoolName: 'Delhi Public School', completionRate: 85.2, totalStudents: 150 },
      { schoolId: 'school2', schoolName: 'Mumbai High School', completionRate: 72.1, totalStudents: 200 }
    ]
  };
}

// Calculate learning improvements
async function calculateLearningImprovements(organizationId, start, end, campaigns) {
  // Mock implementation - replace with actual data queries
  return {
    averageImprovement: 23.5,
    improvementsByPillar: [
      {
        pillar: 'financial_literacy',
        baselineScore: 65.2,
        finalScore: 78.9,
        improvement: 13.7,
        improvementPercentage: 21.0,
        studentsAssessed: 800
      },
      {
        pillar: 'mental_health',
        baselineScore: 58.1,
        finalScore: 72.3,
        improvement: 14.2,
        improvementPercentage: 24.4,
        studentsAssessed: 750
      },
      {
        pillar: 'values',
        baselineScore: 70.5,
        finalScore: 82.1,
        improvement: 11.6,
        improvementPercentage: 16.5,
        studentsAssessed: 900
      }
    ],
    improvementsByGrade: [
      { grade: '6', averageImprovement: 25.2, studentsAssessed: 300 },
      { grade: '7', averageImprovement: 22.8, studentsAssessed: 400 },
      { grade: '8', averageImprovement: 22.5, studentsAssessed: 550 }
    ],
    improvementsBySchool: [
      { schoolId: 'school1', schoolName: 'Delhi Public School', averageImprovement: 26.1, studentsAssessed: 150 },
      { schoolId: 'school2', schoolName: 'Mumbai High School', averageImprovement: 21.3, studentsAssessed: 200 }
    ]
  };
}

// Calculate certificates
async function calculateCertificates(organizationId, start, end, campaigns) {
  // Mock implementation - replace with actual data queries
  return {
    totalIssued: 1250,
    certificatesByType: [
      { type: 'completion', count: 800, percentage: 64.0 },
      { type: 'achievement', count: 300, percentage: 24.0 },
      { type: 'excellence', count: 150, percentage: 12.0 }
    ],
    certificatesByModule: [
      { module: 'finance', count: 400, percentage: 32.0 },
      { module: 'mental', count: 350, percentage: 28.0 },
      { module: 'values', count: 250, percentage: 20.0 },
      { module: 'ai', count: 250, percentage: 20.0 }
    ],
    certificatesByGrade: [
      { grade: '6', count: 300, percentage: 24.0 },
      { grade: '7', count: 400, percentage: 32.0 },
      { grade: '8', count: 550, percentage: 44.0 }
    ],
    pendingCertificates: 120
  };
}

// Calculate financial metrics
async function calculateFinancialMetrics(organizationId, start, end, campaigns) {
  // Get spend data from ledger
  const spendData = await SpendLedger.aggregate([
    {
      $match: {
        organizationId: new mongoose.Types.ObjectId(organizationId),
        createdAt: { $gte: start, $lte: end },
        direction: 'outbound'
      }
    },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        totalHealCoins: { $sum: '$healCoinsAmount' }
      }
    }
  ]);

  const totalSpend = spendData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalHealCoins = spendData.reduce((sum, item) => sum + item.totalHealCoins, 0);
  const totalStudents = 1250; // From students reached calculation

  return {
    totalSpend,
    spendPerStudent: Math.round(totalSpend / totalStudents),
    spendByCategory: spendData.map(item => ({
      category: item._id,
      amount: item.totalAmount,
      percentage: Math.round((item.totalAmount / totalSpend) * 100)
    })),
    healCoinsDistributed: totalHealCoins,
    healCoinsPerStudent: Math.round(totalHealCoins / totalStudents),
    budgetUtilization: 85.2,
    costPerCompletion: Math.round(totalSpend / 980) // Based on completed students
  };
}

// Calculate engagement metrics
async function calculateEngagementMetrics(organizationId, start, end, campaigns) {
  // Mock implementation - replace with actual data queries
  return {
    averageEngagementScore: 8.2,
    averageSessionDuration: 28.5,
    averageSessionsPerStudent: 12.3,
    returnRate: 78.5,
    dropoutRate: 21.5,
    satisfactionScore: 8.7
  };
}

// Calculate NEP mapping
async function calculateNEPMapping(organizationId, start, end, campaigns) {
  // Mock implementation - replace with actual NEP competency mapping
  return {
    totalCompetencies: 24,
    competenciesCovered: 18,
    coveragePercentage: 75.0,
    competenciesByGrade: [
      { grade: '6-8', totalCompetencies: 24, coveredCompetencies: 18, coveragePercentage: 75.0 }
    ],
    competenciesByModule: [
      { module: 'finance', competencies: ['Financial Literacy', 'Budgeting'], coveragePercentage: 80.0 },
      { module: 'mental', competencies: ['Emotional Intelligence', 'Stress Management'], coveragePercentage: 70.0 },
      { module: 'values', competencies: ['Ethical Reasoning', 'Social Responsibility'], coveragePercentage: 75.0 }
    ]
  };
}

// Generate report content
async function generateReportContent(metrics, nepMapping, includeTestimonials) {
  const keyHighlights = [
    `Reached ${metrics.schoolsReached.totalSchools} schools across multiple regions`,
    `Impacted ${metrics.studentsReached.totalStudents} students with ${metrics.completionRates.overallCompletionRate}% completion rate`,
    `Achieved ${metrics.learningImprovements.averageImprovement}% average improvement in learning outcomes`,
    `Issued ${metrics.certificates.totalIssued} certificates across various modules`,
    `Maintained cost efficiency of ₹${metrics.financialMetrics.spendPerStudent} per student`
  ];

  const recommendations = [
    'Expand program to additional schools in underserved regions',
    'Implement advanced analytics for better learning outcome tracking',
    'Develop specialized modules for different grade levels',
    'Establish partnerships with local NGOs for wider reach',
    'Create parent engagement programs to improve retention'
  ];

  const nextSteps = [
    'Launch Q2 2024 expansion to 20 new schools',
    'Implement AI-powered personalized learning paths',
    'Develop mobile app for better student engagement',
    'Establish alumni network for mentorship programs',
    'Create impact measurement dashboard for real-time tracking'
  ];

  const testimonials = includeTestimonials ? [
    {
      quote: 'The program has transformed our students\' understanding of financial literacy. We\'ve seen remarkable improvements in their decision-making skills.',
      author: 'Dr. Priya Sharma',
      role: 'Principal',
      school: 'Delhi Public School'
    },
    {
      quote: 'Our students are now more confident and aware of mental health. The program has created a positive learning environment.',
      author: 'Mr. Rajesh Kumar',
      role: 'Vice Principal',
      school: 'Mumbai High School'
    }
  ] : [];

  return {
    executiveSummary: `This comprehensive CSR report demonstrates significant impact across ${metrics.schoolsReached.totalSchools} schools and ${metrics.studentsReached.totalStudents} students. The program achieved a ${metrics.completionRates.overallCompletionRate}% completion rate with an average learning improvement of ${metrics.learningImprovements.averageImprovement}%. A total of ${metrics.certificates.totalIssued} certificates were issued, maintaining cost efficiency at ₹${metrics.financialMetrics.spendPerStudent} per student.`,
    keyHighlights,
    challenges: [
      'Limited internet connectivity in rural schools',
      'Varying levels of teacher training and support',
      'Student attendance during peak agricultural seasons',
      'Language barriers in multilingual regions'
    ],
    recommendations,
    nextSteps,
    testimonials
  };
}

// Generate PDF asynchronously
async function generatePDFAsync(reportId) {
  try {
    const report = await CSRReport.findById(reportId);
    if (!report) return;

    // Generate PDF
    const pdfBuffer = await pdfReportGenerator.generateCSRReport(report, {
      branding: report.branding
    });

    // Save PDF to file
    const uploadsDir = path.join(__dirname, '..', 'uploads', 'reports');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${report.reportId}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    
    fs.writeFileSync(filePath, pdfBuffer);

    // Update report with file information
    report.files = {
      pdfUrl: fileName,
      pdfSize: pdfBuffer.length,
      generatedAt: new Date()
    };
    report.status = 'completed';
    report.generatedAt = new Date();

    await report.save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Update report status to failed
    const report = await CSRReport.findById(reportId);
    if (report) {
      report.status = 'failed';
      await report.save();
    }
  }
}

// Helper functions
function getQuarter(date) {
  const month = date.getMonth() + 1;
  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
}

function getReportProgress(status) {
  switch (status) {
    case 'draft': return 0;
    case 'generating': return 50;
    case 'completed': return 100;
    case 'failed': return 0;
    default: return 0;
  }
}

export default {
  generateCSRReport,
  getCSRReports,
  getCSRReportById,
  downloadCSRReportPDF,
  getReportStatus,
  shareReport
};
