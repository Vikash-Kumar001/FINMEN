import CSRKPI from '../models/CSRKPI.js';
import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import VoucherRedemption from '../models/VoucherRedemption.js';
import GameProgress from '../models/GameProgress.js';
import Wallet from '../models/Wallet.js';
import NEPCompetency from '../models/NEPCompetency.js';
import mongoose from 'mongoose';
import csrKPICalculationService from '../services/csrKPICalculationService.js';

// Get comprehensive CSR KPIs
export const getCSRKPIs = async (req, res) => {
  try {
    console.log('getCSRKPIs called with:', req.query);
    console.log('User:', req.user);
    
    const { period = 'month', region = 'all', organizationId, forceRefresh = false } = req.query;
    
    const filters = {
      period,
      region,
      organizationId: organizationId || req.user?.organizationId || '507f1f77bcf86cd799439011',
      forceRefresh: forceRefresh === 'true'
    };

    console.log('Filters:', filters);

    // Use the calculation service to get comprehensive KPIs
    const kpiData = await csrKPICalculationService.calculateAllKPIs(filters);

    // Skip database save for now (using mock service)
    // let csrKPI = await CSRKPI.findOneAndUpdate(
    //   {
    //     organizationId: filters.organizationId,
    //     'period.type': period
    //   },
    //   {
    //     ...kpiData,
    //     lastUpdatedBy: req.user?._id
    //   },
    //   {
    //     upsert: true,
    //     new: true,
    //     runValidators: true
    //   }
    // );

    res.json({
      success: true,
      data: kpiData,
      lastUpdated: new Date(),
      calculatedAt: kpiData.calculatedAt
    });
  } catch (error) {
    console.error('Error fetching CSR KPIs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch CSR KPIs',
      error: error.message 
    });
  }
};

// Calculate fresh KPIs from raw data
const calculateFreshKPIs = async (period, region, organizationId) => {
  const dateRange = calculateDateRange(period);
  
  // Build base query with filters
  const baseQuery = { 
    createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate } 
  };
  
  if (region !== 'all') {
    baseQuery.city = region;
  }
  
  if (organizationId) {
    baseQuery.organizationId = organizationId;
  }

  // 1. Schools & Students Reached (Coverage)
  const students = await User.find({ ...baseQuery, role: 'student' });
  const schools = [...new Set(students.map(s => s.institution).filter(Boolean))];
  
  // Get regional breakdown
  const regionalBreakdown = await User.aggregate([
    { $match: { ...baseQuery, role: 'student', city: { $exists: true } } },
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // 2. Campaign Completion Rate
  const campaigns = await Challenge.find({ 
    ...baseQuery,
    type: 'campaign'
  });
  
  const campaignCompletionData = await Promise.all(campaigns.map(async (campaign) => {
    const participants = await User.find({ 
      role: 'student',
      'challenges.challengeId': campaign._id 
    });
    
    const completedParticipants = participants.filter(p => 
      p.challenges.find(c => c.challengeId.toString() === campaign._id.toString())?.status === 'completed'
    );
    
    return {
      campaignId: campaign._id,
      campaignName: campaign.title,
      totalParticipants: participants.length,
      completedParticipants: completedParticipants.length,
      completionRate: participants.length > 0 ? (completedParticipants.length / participants.length) * 100 : 0,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      targetAudience: campaign.targetAudience || 'All Students',
      objectives: campaign.objectives || [],
      status: campaign.status || 'active'
    };
  }));

  // 3. Engagement Lift vs Baseline
  const engagementMetrics = await calculateEngagementMetrics(baseQuery, dateRange);

  // 4. Budget Spent (Rewards & Admin Fees)
  const budgetMetrics = await calculateBudgetMetrics(baseQuery, dateRange);

  // 5. Certificates Issued & NEP Competencies
  const certificatesData = await calculateCertificatesData(baseQuery, dateRange);
  const nepCompetenciesData = await calculateNEPCompetenciesData(baseQuery);

  // Create comprehensive KPI record
  const csrKPI = new CSRKPI({
    schoolsReached: {
      totalSchools: schools.length,
      activeSchools: schools.length, // Simplified - in real scenario, check activity
      schoolsByRegion: regionalBreakdown.map(r => ({
        region: r._id,
        count: 1, // Simplified - would need to count unique schools per region
        lastUpdated: new Date()
      }))
    },
    
    studentsReached: {
      totalStudents: students.length,
      activeStudents: students.length, // Simplified
      studentsByRegion: regionalBreakdown.map(r => ({
        region: r._id,
        count: r.count,
        lastUpdated: new Date()
      })),
      studentsByGrade: [] // Would need grade data from students
    },

    campaigns: campaignCompletionData,
    engagementMetrics,
    budgetMetrics,
    certificates: certificatesData,
    nepCompetencies: nepCompetenciesData,
    
    period: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      type: period
    },
    
    organizationId,
    createdBy: req.user?._id
  });

  return await csrKPI.save();
};

// Calculate engagement metrics
const calculateEngagementMetrics = async (baseQuery, dateRange) => {
  // Get baseline engagement (previous period)
  const baselineDateRange = {
    startDate: new Date(dateRange.startDate.getTime() - (dateRange.endDate.getTime() - dateRange.startDate.getTime())),
    endDate: dateRange.startDate
  };

  const baselineQuery = { ...baseQuery, createdAt: { $gte: baselineDateRange.startDate, $lte: baselineDateRange.endDate } };
  
  // Current period engagement
  const currentStudents = await User.find({ ...baseQuery, role: 'student' });
  const baselineStudents = await User.find({ ...baselineQuery, role: 'student' });
  
  // Get game progress for engagement calculation
  const currentGameProgress = await GameProgress.find({
    userId: { $in: currentStudents.map(s => s._id) },
    updatedAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
  });
  
  const baselineGameProgress = await GameProgress.find({
    userId: { $in: baselineStudents.map(s => s._id) },
    updatedAt: { $gte: baselineDateRange.startDate, $lte: baselineDateRange.endDate }
  });

  // Calculate engagement metrics
  const currentEngagement = currentStudents.length > 0 ? 
    (currentGameProgress.length / currentStudents.length) * 100 : 0;
  const baselineEngagement = baselineStudents.length > 0 ? 
    (baselineGameProgress.length / baselineStudents.length) * 100 : 0;

  return {
    baselineEngagement,
    currentEngagement,
    engagementLift: baselineEngagement > 0 ? ((currentEngagement - baselineEngagement) / baselineEngagement) * 100 : 0,
    metrics: {
      dailyActiveUsers: currentStudents.length,
      sessionDuration: 25, // Average session duration in minutes
      completionRate: currentGameProgress.length > 0 ? 
        (currentGameProgress.filter(g => g.progress >= 100).length / currentGameProgress.length) * 100 : 0,
      returnRate: 75, // Percentage of users who return
      interactionRate: 85 // Percentage of users who interact with content
    },
    lastCalculated: new Date()
  };
};

// Calculate budget metrics
const calculateBudgetMetrics = async (baseQuery, dateRange) => {
  // Get voucher redemptions (rewards spent)
  const redemptions = await VoucherRedemption.find({
    ...baseQuery,
    status: 'approved',
    createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
  }).populate('productId', 'price');

  const rewardsSpent = redemptions.reduce((sum, redemption) => 
    sum + (redemption.productId?.price || 0), 0
  );

  // Calculate admin fees (simplified - 10% of rewards spent)
  const adminFees = rewardsSpent * 0.1;
  
  // Calculate operational costs (simplified)
  const operationalCosts = rewardsSpent * 0.05;

  // Get monthly spending breakdown
  const monthlySpending = await calculateMonthlySpending(baseQuery, dateRange);

  return {
    totalBudget: rewardsSpent + adminFees + operationalCosts + 1000000, // Add buffer
    rewardsSpent,
    adminFees,
    operationalCosts,
    remainingBudget: 0, // Will be calculated in pre-save
    budgetBreakdown: [
      { category: 'Rewards', amount: rewardsSpent, percentage: 0, description: 'Student rewards and incentives' },
      { category: 'Admin Fees', amount: adminFees, percentage: 0, description: 'Administrative and processing fees' },
      { category: 'Operational', amount: operationalCosts, percentage: 0, description: 'Platform operational costs' }
    ],
    monthlySpending
  };
};

// Calculate certificates data
const calculateCertificatesData = async (baseQuery, dateRange) => {
  // Get students who completed challenges/games (simplified certificate logic)
  const students = await User.find({ ...baseQuery, role: 'student' });
  const gameProgress = await GameProgress.find({
    userId: { $in: students.map(s => s._id) },
    progress: 100,
    updatedAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
  });

  // Simulate certificate types
  const certificatesByType = [
    { type: 'completion', count: Math.floor(gameProgress.length * 0.7), lastIssued: new Date() },
    { type: 'achievement', count: Math.floor(gameProgress.length * 0.2), lastIssued: new Date() },
    { type: 'excellence', count: Math.floor(gameProgress.length * 0.1), lastIssued: new Date() }
  ];

  return {
    totalIssued: gameProgress.length,
    certificatesByType,
    certificatesByModule: [
      { module: 'finance', count: Math.floor(gameProgress.length * 0.3), lastIssued: new Date() },
      { module: 'mental', count: Math.floor(gameProgress.length * 0.3), lastIssued: new Date() },
      { module: 'values', count: Math.floor(gameProgress.length * 0.2), lastIssued: new Date() },
      { module: 'ai', count: Math.floor(gameProgress.length * 0.2), lastIssued: new Date() }
    ],
    pendingCertificates: Math.floor(gameProgress.length * 0.1)
  };
};

// Calculate NEP competencies data
const calculateNEPCompetenciesData = async (baseQuery) => {
  // Get NEP competencies (if model exists)
  let nepCompetencies = [];
  try {
    nepCompetencies = await NEPCompetency.find({});
  } catch (error) {
    // If NEPCompetency model doesn't exist, create mock data
    nepCompetencies = [
      { competency: 'Financial Literacy', grade: '6-8', module: 'finance' },
      { competency: 'Digital Literacy', grade: '6-8', module: 'ai' },
      { competency: 'Emotional Intelligence', grade: '6-8', module: 'mental' },
      { competency: 'Ethical Values', grade: '6-8', module: 'values' }
    ];
  }

  return {
    totalCompetencies: nepCompetencies.length,
    competenciesCovered: Math.floor(nepCompetencies.length * 0.75),
    coveragePercentage: 0, // Will be calculated in pre-save
    competenciesByGrade: [
      { grade: '6-8', totalCompetencies: nepCompetencies.length, coveredCompetencies: Math.floor(nepCompetencies.length * 0.8), coveragePercentage: 80 }
    ],
    competenciesByModule: [
      { module: 'finance', competencies: ['Financial Literacy'], coveragePercentage: 85 },
      { module: 'mental', competencies: ['Emotional Intelligence'], coveragePercentage: 80 },
      { module: 'values', competencies: ['Ethical Values'], coveragePercentage: 75 },
      { module: 'ai', competencies: ['Digital Literacy'], coveragePercentage: 70 }
    ]
  };
};

// Calculate monthly spending breakdown
const calculateMonthlySpending = async (baseQuery, dateRange) => {
  const monthlySpending = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Generate last 6 months of spending data
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentYear - (i > currentMonth ? 1 : 0);
    
    // Simplified calculation - in real scenario, get actual spending data
    const baseAmount = Math.random() * 100000;
    
    monthlySpending.push({
      month: months[monthIndex],
      year,
      rewards: baseAmount * 0.7,
      admin: baseAmount * 0.1,
      operational: baseAmount * 0.05,
      total: baseAmount
    });
  }
  
  return monthlySpending;
};

// Helper function to calculate date range
const calculateDateRange = (period) => {
  const now = new Date();
  let startDate, endDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
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
    default: // month
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = now;
  }
  
  return { startDate, endDate };
};

// Get KPI trends over time
export const getKPITrends = async (req, res) => {
  try {
    const { metric, period = 'month', organizationId } = req.query;
    
    const trends = await CSRKPI.find({
      organizationId: organizationId || req.user?.organizationId || '507f1f77bcf86cd799439011',
      'period.type': period
    }).sort({ 'period.startDate': 1 });

    res.json({
      success: true,
      data: trends,
      metric
    });
  } catch (error) {
    console.error('Error fetching KPI trends:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch KPI trends',
      error: error.message 
    });
  }
};

// Refresh KPIs (recalculate from scratch)
export const refreshKPIs = async (req, res) => {
  try {
    const { period = 'month', region = 'all', organizationId } = req.body;
    
    const filters = {
      period,
      region,
      organizationId: organizationId || req.user?.organizationId,
      forceRefresh: true
    };

    // Delete existing KPI record to force recalculation
    await CSRKPI.findOneAndDelete({
      organizationId: filters.organizationId,
      'period.type': period
    });
    
    // Calculate fresh KPIs using the calculation service
    const kpiData = await csrKPICalculationService.calculateAllKPIs(filters);

    // Save the fresh KPIs
    const freshKPIs = new CSRKPI({
      ...kpiData,
      createdBy: req.user?._id,
      lastUpdatedBy: req.user?._id
    });

    await freshKPIs.save();
    
    res.json({
      success: true,
      message: 'KPIs refreshed successfully',
      data: freshKPIs,
      calculatedAt: kpiData.calculatedAt
    });
  } catch (error) {
    console.error('Error refreshing KPIs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to refresh KPIs',
      error: error.message 
    });
  }
};

// Export KPIs data
export const exportKPIs = async (req, res) => {
  try {
    const { format = 'json', period = 'month', organizationId } = req.query;
    
    const kpis = await CSRKPI.findOne({
      organizationId: organizationId || req.user?.organizationId || '507f1f77bcf86cd799439011',
      'period.type': period
    });

    if (!kpis) {
      return res.status(404).json({ 
        success: false, 
        message: 'No KPI data found for the specified period' 
      });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertKPIsToCSV(kpis);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="csr-kpis-${period}.csv"`);
      res.send(csvData);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: kpis,
        exportedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error exporting KPIs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to export KPIs',
      error: error.message 
    });
  }
};

// Convert KPIs to CSV format
const convertKPIsToCSV = (kpis) => {
  const headers = [
    'Metric', 'Value', 'Period', 'Last Updated'
  ];
  
  const rows = [
    ['Schools Reached', kpis.schoolsReached.totalSchools, kpis.period.type, kpis.updatedAt],
    ['Students Reached', kpis.studentsReached.totalStudents, kpis.period.type, kpis.updatedAt],
    ['Engagement Lift', `${kpis.engagementMetrics.engagementLift.toFixed(2)}%`, kpis.period.type, kpis.updatedAt],
    ['Budget Spent', kpis.budgetMetrics.rewardsSpent + kpis.budgetMetrics.adminFees, kpis.period.type, kpis.updatedAt],
    ['Certificates Issued', kpis.certificates.totalIssued, kpis.period.type, kpis.updatedAt],
    ['NEP Coverage', `${kpis.nepCompetencies.coveragePercentage.toFixed(2)}%`, kpis.period.type, kpis.updatedAt]
  ];
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};
