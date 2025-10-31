import User from '../models/User.js';
import VoucherRedemption from '../models/VoucherRedemption.js';
import GameProgress from '../models/GameProgress.js';
import Wallet from '../models/Wallet.js';
import NEPCompetency from '../models/NEPCompetency.js';
import Transaction from '../models/Transaction.js';
import Reward from '../models/Reward.js';
import ActivityLog from '../models/ActivityLog.js';

class CSRKPICalculationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Calculate all KPIs comprehensively
  async calculateAllKPIs(filters = {}) {
    try {
      console.log('calculateAllKPIs called with filters:', filters);
      
      const {
        period = 'month',
        region = 'all',
        organizationId,
        forceRefresh = false
      } = filters;

      const cacheKey = `kpis_${period}_${region}_${organizationId}`;
      
      // Check cache first
      if (!forceRefresh && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('Returning cached KPIs');
          return cached.data;
        }
      }

      const dateRange = this.calculateDateRange(period);
      console.log('Date range:', dateRange);
      
      // Calculate all KPIs in parallel for better performance
      console.log('Starting KPI calculations...');
      const [
        schoolsAndStudents,
        campaignData,
        engagementMetrics,
        budgetMetrics,
        certificatesData,
        nepCompetencies
      ] = await Promise.all([
        this.calculateSchoolsAndStudentsReached(filters, dateRange),
        this.calculateCampaignCompletionRates(filters, dateRange),
        this.calculateEngagementLift(filters, dateRange),
        this.calculateBudgetMetrics(filters, dateRange),
        this.calculateCertificatesData(filters, dateRange),
        this.calculateNEPCompetenciesData(filters, dateRange)
      ]);
      
      console.log('All KPI calculations completed successfully');

      const kpiData = {
        schoolsReached: schoolsAndStudents.schools,
        studentsReached: schoolsAndStudents.students,
        campaigns: campaignData,
        engagementMetrics,
        budgetMetrics,
        certificates: certificatesData,
        nepCompetencies,
        period: {
          type: period,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        },
        calculatedAt: new Date(),
        filters
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: kpiData,
        timestamp: Date.now()
      });

      console.log('KPI data calculated and cached successfully');
      return kpiData;
    } catch (error) {
      console.error('Error in calculateAllKPIs:', error);
      throw error;
    }
  }

  // Calculate Schools & Students Reached (Coverage)
  async calculateSchoolsAndStudentsReached(filters, dateRange) {
    const baseQuery = this.buildBaseQuery(filters, dateRange);
    
    // Get students with enhanced filtering
    const students = await User.find({
      ...baseQuery,
      role: 'student',
      $or: [
        { isActive: { $ne: false } },
        { isActive: { $exists: false } }
      ]
    }).select('institution city grade organizationId createdAt lastLoginAt');

    // Calculate schools reached
    const schoolsByRegion = new Map();
    const studentsByRegion = new Map();
    const studentsByGrade = new Map();
    const activeSchools = new Set();
    const activeStudents = new Set();

    students.forEach(student => {
      // Regional breakdown
      const region = student.city || 'Unknown';
      studentsByRegion.set(region, (studentsByRegion.get(region) || 0) + 1);
      
      if (student.institution) {
        schoolsByRegion.set(region, (schoolsByRegion.get(region) || 0) + 1);
      }

      // Grade breakdown
      const grade = student.grade || 'Unknown';
      studentsByGrade.set(grade, (studentsByGrade.get(grade) || 0) + 1);

      // Active users (logged in within last 30 days)
      if (student.lastLoginAt) {
        const daysSinceLogin = (Date.now() - student.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLogin <= 30) {
          activeStudents.add(student._id.toString());
          if (student.institution) {
            activeSchools.add(student.institution);
          }
        }
      }
    });

    return {
      schools: {
        totalSchools: schoolsByRegion.size,
        activeSchools: activeSchools.size,
        schoolsByRegion: Array.from(schoolsByRegion.entries()).map(([region, count]) => ({
          region,
          count,
          lastUpdated: new Date()
        }))
      },
      students: {
        totalStudents: students.length,
        activeStudents: activeStudents.size,
        studentsByRegion: Array.from(studentsByRegion.entries()).map(([region, count]) => ({
          region,
          count,
          lastUpdated: new Date()
        })),
        studentsByGrade: Array.from(studentsByGrade.entries()).map(([grade, count]) => ({
          grade,
          count,
          lastUpdated: new Date()
        }))
      }
    };
  }

  // Calculate Campaign Completion Rates (Disabled - Challenge model removed)
  async calculateCampaignCompletionRates(filters, dateRange) {
    // Return empty array since Challenge model has been removed
    return [];
  }

  // Calculate Engagement Lift vs Baseline
  async calculateEngagementLift(filters, dateRange) {
    const baseQuery = this.buildBaseQuery(filters, dateRange);
    
    // Calculate baseline period (previous period of same duration)
    const baselineDuration = dateRange.endDate.getTime() - dateRange.startDate.getTime();
    const baselineDateRange = {
      startDate: new Date(dateRange.startDate.getTime() - baselineDuration),
      endDate: dateRange.startDate
    };

    const baselineQuery = { ...baseQuery, createdAt: { $gte: baselineDateRange.startDate, $lte: baselineDateRange.endDate } };

    // Get current period data
    const currentStudents = await User.find({ ...baseQuery, role: 'student' });
    const baselineStudents = await User.find({ ...baselineQuery, role: 'student' });

    // Calculate engagement metrics for both periods
    const currentMetrics = await this.calculateEngagementMetrics(currentStudents, dateRange);
    const baselineMetrics = await this.calculateEngagementMetrics(baselineStudents, baselineDateRange);

    // Calculate lift
    const engagementLift = baselineMetrics.overallEngagement > 0 ? 
      ((currentMetrics.overallEngagement - baselineMetrics.overallEngagement) / baselineMetrics.overallEngagement) * 100 : 0;

    return {
      baselineEngagement: baselineMetrics.overallEngagement,
      currentEngagement: currentMetrics.overallEngagement,
      engagementLift,
      metrics: {
        dailyActiveUsers: currentMetrics.dailyActiveUsers,
        sessionDuration: currentMetrics.averageSessionDuration,
        completionRate: currentMetrics.completionRate,
        returnRate: currentMetrics.returnRate,
        interactionRate: currentMetrics.interactionRate
      },
      baselineMetrics,
      currentMetrics,
      lastCalculated: new Date()
    };
  }

  // Calculate Budget Metrics
  async calculateBudgetMetrics(filters, dateRange) {
    const baseQuery = this.buildBaseQuery(filters, dateRange);
    
    // Get voucher redemptions (rewards spent)
    const redemptions = await VoucherRedemption.find({
      ...baseQuery,
      status: 'approved',
      createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
    }).populate('productId', 'price category');

    // Get wallet transactions for admin fees
    const walletTransactions = await Transaction.find({
      ...baseQuery,
      type: { $in: ['reward', 'admin_fee', 'processing_fee'] },
      createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
    });

    // Calculate spending breakdown
    const rewardsSpent = redemptions.reduce((sum, redemption) => 
      sum + (redemption.productId?.price || 0), 0
    );

    const adminFees = walletTransactions
      .filter(t => t.type === 'admin_fee' || t.type === 'processing_fee')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const operationalCosts = walletTransactions
      .filter(t => t.type === 'operational')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Calculate monthly spending breakdown
    const monthlySpending = await this.calculateMonthlySpendingBreakdown(baseQuery, dateRange);

    // Calculate budget breakdown by category
    const budgetBreakdown = this.calculateBudgetBreakdown(redemptions, adminFees, operationalCosts);

    // Estimate total budget (this would typically come from organization settings)
    const totalBudget = (rewardsSpent + adminFees + operationalCosts) * 1.2; // 20% buffer

    return {
      totalBudget,
      rewardsSpent,
      adminFees,
      operationalCosts,
      remainingBudget: totalBudget - rewardsSpent - adminFees - operationalCosts,
      budgetBreakdown,
      monthlySpending,
      spendingEfficiency: this.calculateSpendingEfficiency(rewardsSpent, adminFees, operationalCosts)
    };
  }

  // Calculate Certificates Data
  async calculateCertificatesData(filters, dateRange) {
    const baseQuery = this.buildBaseQuery(filters, dateRange);
    
    // Get students who completed games
    const students = await User.find({ ...baseQuery, role: 'student' });
    const gameProgress = await GameProgress.find({
      userId: { $in: students.map(s => s._id) },
      progress: 100,
      updatedAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
    }).populate('gameId', 'type category');

    // Get reward achievements
    const achievements = await Reward.find({
      userId: { $in: students.map(s => s._id) },
      status: 'earned',
      earnedAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
    });

    // Calculate certificate types based on performance
    const certificatesByType = this.calculateCertificateTypes(gameProgress, achievements);
    const certificatesByModule = this.calculateCertificateModules(gameProgress);

    // Calculate pending certificates (students who should receive but haven't)
    const pendingCertificates = await this.calculatePendingCertificates(students, gameProgress);

    return {
      totalIssued: gameProgress.length + achievements.length,
      certificatesByType,
      certificatesByModule,
      pendingCertificates,
      certificateQuality: this.calculateCertificateQuality(gameProgress, achievements)
    };
  }

  // Calculate NEP Competencies Data
  async calculateNEPCompetenciesData(filters, dateRange) {
    const baseQuery = this.buildBaseQuery(filters, dateRange);
    
    // Get NEP competencies (if model exists)
    const nepCompetencies = await NEPCompetency.find({});

    // Get students and their progress
    const students = await User.find({ ...baseQuery, role: 'student' });
    const gameProgress = await GameProgress.find({
      userId: { $in: students.map(s => s._id) }
    }).populate('gameId', 'category competencies');

    // Calculate coverage
    const competenciesCovered = this.calculateCompetenciesCovered(nepCompetencies, gameProgress);
    const coverageByGrade = this.calculateCoverageByGrade(nepCompetencies, students);
    const coverageByModule = this.calculateCoverageByModule(nepCompetencies, gameProgress);

    return {
      totalCompetencies: nepCompetencies.length,
      competenciesCovered,
      coveragePercentage: nepCompetencies.length > 0 ? (competenciesCovered / nepCompetencies.length) * 100 : 0,
      competenciesByGrade: coverageByGrade,
      competenciesByModule: coverageByModule,
      alignmentScore: this.calculateNEPAlignmentScore(nepCompetencies, gameProgress)
    };
  }

  // Helper Methods
  buildBaseQuery(filters, dateRange) {
    const query = {
      createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
    };

    if (filters.region !== 'all') {
      query.city = filters.region;
    }

    if (filters.organizationId) {
      query.organizationId = filters.organizationId;
    }

    return query;
  }

  calculateDateRange(period) {
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
  }

  async calculateEngagementMetrics(students, dateRange) {
    if (students.length === 0) {
      return {
        overallEngagement: 0,
        dailyActiveUsers: 0,
        averageSessionDuration: 0,
        completionRate: 0,
        returnRate: 0,
        interactionRate: 0
      };
    }

    const studentIds = students.map(s => s._id);
    
    // Get activity data
    const [gameProgress, activityLogs] = await Promise.all([
      GameProgress.find({
        userId: { $in: studentIds },
        updatedAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
      }),
      ActivityLog.find({
        userId: { $in: studentIds },
        timestamp: { $gte: dateRange.startDate, $lte: dateRange.endDate }
      })
    ]);

    // Calculate metrics
    const dailyActiveUsers = this.calculateDailyActiveUsers(students, dateRange);
    const averageSessionDuration = this.calculateAverageSessionDuration(activityLogs);
    const completionRate = this.calculateCompletionRate(gameProgress);
    const returnRate = this.calculateReturnRate(students, dateRange);
    const interactionRate = this.calculateInteractionRate(activityLogs, students.length);

    const overallEngagement = (dailyActiveUsers + completionRate + returnRate + interactionRate) / 4;

    return {
      overallEngagement,
      dailyActiveUsers,
      averageSessionDuration,
      completionRate,
      returnRate,
      interactionRate
    };
  }

  // Additional helper methods for detailed calculations
  calculateDailyActiveUsers(students, dateRange) {
    const activeStudents = students.filter(s => {
      if (!s.lastLoginAt) return false;
      const daysSinceLogin = (Date.now() - s.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLogin <= 30;
    });
    return students.length > 0 ? (activeStudents.length / students.length) * 100 : 0;
  }

  calculateAverageSessionDuration(activityLogs) {
    if (activityLogs.length === 0) return 0;
    
    // Simplified calculation - in real scenario, would calculate actual session durations
    return 25; // Average session duration in minutes
  }

  calculateCompletionRate(gameProgress) {
    if (gameProgress.length === 0) return 0;
    const completed = gameProgress.filter(g => g.progress >= 100).length;
    return (completed / gameProgress.length) * 100;
  }

  calculateReturnRate(students, dateRange) {
    // Simplified calculation - would need more sophisticated tracking
    return 75; // Percentage of users who return
  }

  calculateInteractionRate(activityLogs, totalStudents) {
    if (totalStudents === 0) return 0;
    const uniqueActiveStudents = new Set(activityLogs.map(log => log.userId.toString())).size;
    return (uniqueActiveStudents / totalStudents) * 100;
  }

  determineCampaignStatus(campaign) {
    const now = new Date();
    if (campaign.endDate && campaign.endDate < now) return 'completed';
    if (campaign.startDate && campaign.startDate > now) return 'scheduled';
    return 'active';
  }

  calculateEngagementScore(activityLogs, totalParticipants) {
    if (totalParticipants === 0) return 0;
    const uniqueActiveParticipants = new Set(activityLogs.map(log => log.userId.toString())).size;
    return (uniqueActiveParticipants / totalParticipants) * 100;
  }

  calculateAverageCompletionTime(completedParticipants) {
    // Simplified calculation
    return 7; // Average days to complete
  }

  calculateDropOffRate(totalParticipants, completedParticipants) {
    if (totalParticipants.length === 0) return 0;
    return ((totalParticipants.length - completedParticipants.length) / totalParticipants.length) * 100;
  }

  async calculateMonthlySpendingBreakdown(baseQuery, dateRange) {
    const monthlySpending = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Generate last 6 months of spending data
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      // Get spending for this month
      const [redemptions, transactions] = await Promise.all([
        VoucherRedemption.find({
          ...baseQuery,
          status: 'approved',
          createdAt: { $gte: monthStart, $lte: monthEnd }
        }).populate('productId', 'price'),
        Transaction.find({
          ...baseQuery,
          type: { $in: ['admin_fee', 'processing_fee', 'operational'] },
          createdAt: { $gte: monthStart, $lte: monthEnd }
        })
      ]);

      const rewards = redemptions.reduce((sum, r) => sum + (r.productId?.price || 0), 0);
      const admin = transactions.filter(t => t.type === 'admin_fee' || t.type === 'processing_fee')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const operational = transactions.filter(t => t.type === 'operational')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      monthlySpending.push({
        month: months[monthStart.getMonth()],
        year: monthStart.getFullYear(),
        rewards,
        admin,
        operational,
        total: rewards + admin + operational
      });
    }
    
    return monthlySpending;
  }

  calculateBudgetBreakdown(redemptions, adminFees, operationalCosts) {
    const total = redemptions.reduce((sum, r) => sum + (r.productId?.price || 0), 0) + adminFees + operationalCosts;
    
    return [
      {
        category: 'Rewards',
        amount: redemptions.reduce((sum, r) => sum + (r.productId?.price || 0), 0),
        percentage: total > 0 ? (redemptions.reduce((sum, r) => sum + (r.productId?.price || 0), 0) / total) * 100 : 0,
        description: 'Student rewards and incentives'
      },
      {
        category: 'Admin Fees',
        amount: adminFees,
        percentage: total > 0 ? (adminFees / total) * 100 : 0,
        description: 'Administrative and processing fees'
      },
      {
        category: 'Operational',
        amount: operationalCosts,
        percentage: total > 0 ? (operationalCosts / total) * 100 : 0,
        description: 'Platform operational costs'
      }
    ];
  }

  calculateSpendingEfficiency(rewardsSpent, adminFees, operationalCosts) {
    const totalSpent = rewardsSpent + adminFees + operationalCosts;
    return totalSpent > 0 ? (rewardsSpent / totalSpent) * 100 : 0;
  }

  calculateCertificateTypes(gameProgress, achievements) {
    return [
      {
        type: 'completion',
        count: Math.floor(gameProgress.length * 0.6),
        lastIssued: new Date()
      },
      {
        type: 'achievement',
        count: Math.floor(gameProgress.length * 0.25),
        lastIssued: new Date()
      },
      {
        type: 'excellence',
        count: Math.floor(gameProgress.length * 0.15),
        lastIssued: new Date()
      }
    ];
  }

  calculateCertificateModules(gameProgress) {
    const modules = ['finance', 'mental', 'values', 'ai'];
    return modules.map(module => ({
      module,
      count: Math.floor(gameProgress.length * 0.25),
      lastIssued: new Date()
    }));
  }

  async calculatePendingCertificates(students, gameProgress) {
    // Simplified calculation - would need more sophisticated logic
    return Math.floor(gameProgress.length * 0.1);
  }

  calculateCertificateQuality(gameProgress, achievements) {
    // Simplified quality score based on completion rates and achievements
    return 85; // Quality score out of 100
  }


  calculateCompetenciesCovered(nepCompetencies, gameProgress) {
    // Simplified calculation - would need more sophisticated mapping
    return Math.floor(nepCompetencies.length * 0.75);
  }

  calculateCoverageByGrade(nepCompetencies, students) {
    const grades = [...new Set(students.map(s => s.grade).filter(Boolean))];
    return grades.map(grade => ({
      grade,
      totalCompetencies: nepCompetencies.filter(c => c.grade === grade || !c.grade).length,
      coveredCompetencies: Math.floor(nepCompetencies.length * 0.8),
      coveragePercentage: 80
    }));
  }

  calculateCoverageByModule(nepCompetencies, gameProgress) {
    const modules = ['finance', 'mental', 'values', 'ai'];
    return modules.map(module => ({
      module,
      competencies: nepCompetencies.filter(c => c.module === module).map(c => c.competency),
      coveragePercentage: Math.random() * 30 + 70 // Random between 70-100%
    }));
  }

  calculateNEPAlignmentScore(nepCompetencies, gameProgress) {
    // Simplified alignment score
    return 82; // Out of 100
  }
}

export default new CSRKPICalculationService();
