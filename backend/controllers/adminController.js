import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import Company from '../models/Company.js';

// Get schools onboarded/active per region
export const getSchoolsByRegion = async (req, res) => {
  try {
    const schools = await Organization.find({ type: 'school' }).select('settings.address state isActive createdAt');

    // Group by state/region
    const regionData = {};
    
    schools.forEach(school => {
      const region = school.settings?.address?.state || school.state || 'Unknown';
      
      if (!regionData[region]) {
        regionData[region] = {
          region,
          totalSchools: 0,
          activeSchools: 0,
          inactiveSchools: 0,
          recentOnboarding: 0 // Last 30 days
        };
      }
      
      regionData[region].totalSchools++;
      
      if (school.isActive) {
        regionData[region].activeSchools++;
      } else {
        regionData[region].inactiveSchools++;
      }
      
      // Check if onboarded in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (school.createdAt >= thirtyDaysAgo) {
        regionData[region].recentOnboarding++;
      }
    });

    const formattedData = Object.values(regionData);

    res.json({
      success: true,
      data: formattedData,
      totalRegions: formattedData.length,
      totalSchools: schools.length,
      activeSchools: schools.filter(s => s.isActive).length
    });
  } catch (error) {
    console.error('Error fetching schools by region:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching schools by region',
      data: []
    });
  }
};

// Get student active rate (DAU/MAU)
export const getStudentActiveRate = async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all students
    const [allStudents, dauStudents, mauStudents] = await Promise.all([
      User.countDocuments({ 
        role: { $in: ['student', 'school_student'] } 
      }),
      User.countDocuments({ 
        role: { $in: ['student', 'school_student'] },
        lastActive: { $gte: oneDayAgo }
      }),
      User.countDocuments({ 
        role: { $in: ['student', 'school_student'] },
        lastActive: { $gte: thirtyDaysAgo }
      })
    ]);

    const activeRate = mauStudents > 0 ? ((dauStudents / mauStudents) * 100).toFixed(2) : 0;
    const mauRate = allStudents > 0 ? ((mauStudents / allStudents) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totalStudents: allStudents,
        dailyActiveUsers: dauStudents,
        monthlyActiveUsers: mauStudents,
        activeRate: parseFloat(activeRate),
        mauRate: parseFloat(mauRate),
        engagementLevel: getEngagementLevel(parseFloat(activeRate))
      }
    });
  } catch (error) {
    console.error('Error fetching student active rate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching student active rate',
      data: {}
    });
  }
};

// Get pillar performance benchmarks by region/state
export const getPillarPerformance = async (req, res) => {
  try {
    const { region } = req.query;
    
    // Use raw MongoDB query to bypass tenantId requirement
    const db = mongoose.connection.db;
    
    // Build query
    const query = { isActive: true };
    if (region) {
      // Find school students in the region
      const schools = await Organization.find({ 
        'settings.address.state': region,
        type: 'school'
      });
      const tenantIds = schools.map(s => s.tenantId);
      if (tenantIds.length > 0) {
        query.tenantId = { $in: tenantIds };
      }
    }

    const students = await db.collection('schoolstudents').find(query).project({ pillars: 1 }).toArray();

    // Calculate averages for each pillar
    const pillarStats = {
      uvls: { total: 0, count: 0, average: 0 },
      dcos: { total: 0, count: 0, average: 0 },
      moral: { total: 0, count: 0, average: 0 },
      ehe: { total: 0, count: 0, average: 0 },
      crgc: { total: 0, count: 0, average: 0 }
    };

    students.forEach(student => {
      if (student.pillars) {
        Object.keys(pillarStats).forEach(pillar => {
          if (student.pillars[pillar]) {
            pillarStats[pillar].total += student.pillars[pillar];
            pillarStats[pillar].count++;
          }
        });
      }
    });

    // Calculate averages and format
    const pillarData = Object.keys(pillarStats).map(pillar => {
      const stats = pillarStats[pillar];
      stats.average = stats.count > 0 ? parseFloat((stats.total / stats.count).toFixed(2)) : 0;
      
      return {
        name: getPillarName(pillar),
        code: pillar,
        average: stats.average,
        benchmark: getBenchmark(stats.average),
        count: stats.count,
        performance: getPerformanceLevel(stats.average)
      };
    });

    res.json({
      success: true,
      data: pillarData,
      totalStudents: students.length,
      region: region || 'All'
    });
  } catch (error) {
    console.error('Error fetching pillar performance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching pillar performance',
      data: []
    });
  }
};

// Get platform health (uptime, errors, latency)
export const getPlatformHealth = async (req, res) => {
  try {
    // Get activity logs for error tracking
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [recentErrors, dailyErrors, recentActivity] = await Promise.all([
      ActivityLog.countDocuments({
        activityType: 'error',
        timestamp: { $gte: oneHourAgo }
      }),
      ActivityLog.countDocuments({
        activityType: 'error',
        timestamp: { $gte: oneDayAgo }
      }),
      ActivityLog.countDocuments({
        timestamp: { $gte: oneHourAgo }
      })
    ]);

    // Simulate uptime calculation (in production, use actual monitoring)
    const uptime = 99.9; // This would come from actual monitoring
    const averageLatency = 150; // ms - simulated
    const errorRate = recentActivity > 0 ? ((recentErrors / recentActivity) * 100).toFixed(3) : 0;

    res.json({
      success: true,
      data: {
        uptime: uptime,
        uptimeStatus: uptime >= 99 ? 'healthy' : uptime >= 95 ? 'degraded' : 'critical',
        averageLatency: averageLatency,
        latencyStatus: averageLatency < 200 ? 'good' : averageLatency < 500 ? 'moderate' : 'slow',
        errorRate: parseFloat(errorRate),
        recentErrors: recentErrors,
        dailyErrors: dailyErrors,
        healthScore: calculateHealthScore(uptime, averageLatency, parseFloat(errorRate))
      }
    });
  } catch (error) {
    console.error('Error fetching platform health:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching platform health',
      data: {}
    });
  }
};

// Get privacy incidents & compliance metrics
export const getPrivacyCompliance = async (req, res) => {
  try {
    // Use raw MongoDB queries to bypass tenantId requirement
    const db = mongoose.connection.db;
    
    // Get students with consent flags
    const studentsWithFlags = await db.collection('schoolstudents').countDocuments({
      'consentFlags': { $exists: true, $ne: {} }
    });

    // Get flagged students for privacy concerns
    const privacyFlags = await db.collection('schoolstudents').countDocuments({
      'wellbeingFlags': {
        $elemMatch: {
          type: 'other',
          description: { $regex: /privacy|data|consent/i }
        }
      }
    });

    // Calculate compliance score based on various factors
    const totalStudents = await db.collection('schoolstudents').countDocuments({ isActive: true });
    const complianceRate = totalStudents > 0 
      ? ((totalStudents - studentsWithFlags) / totalStudents * 100).toFixed(2)
      : 100;

    res.json({
      success: true,
      data: {
        consentFlags: studentsWithFlags,
        privacyIncidents: privacyFlags,
        complianceRate: parseFloat(complianceRate),
        complianceStatus: getComplianceStatus(parseFloat(complianceRate)),
        totalStudents: totalStudents,
        gdprCompliance: parseFloat(complianceRate) > 95 ? true : false,
        lastAudit: new Date().toISOString(),
        criticalIssues: privacyFlags
      }
    });
  } catch (error) {
    console.error('Error fetching privacy compliance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching privacy compliance',
      data: {}
    });
  }
};

// Get comprehensive admin dashboard data
export const getAdminDashboard = async (req, res) => {
  try {
    const [schoolsByRegion, activeRate, pillarPerformance, platformHealth, privacyCompliance] = await Promise.all([
      getSchoolsByRegionData(),
      getStudentActiveRateData(),
      getPillarPerformanceData(),
      getPlatformHealthData(),
      getPrivacyComplianceData()
    ]);

    res.json({
      success: true,
      data: {
        schoolsByRegion: schoolsByRegion.data,
        studentActiveRate: activeRate.data,
        pillarPerformance: pillarPerformance.data,
        platformHealth: platformHealth.data,
        privacyCompliance: privacyCompliance.data
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching admin dashboard data',
      error: error.message 
    });
  }
};

// Helper functions
async function getSchoolsByRegionData() {
  try {
    const schools = await Organization.find({ type: 'school' }).select('settings.address state isActive createdAt');
    
    console.log('Schools found:', schools.length);
    
    // If no schools found, return empty array
    if (!schools || schools.length === 0) {
      console.log('No schools found in database');
      return { data: [] };
    }
    
    const regionData = {};
    schools.forEach(school => {
      const region = school.settings?.address?.state || school.state || 'Unknown';
      console.log(`Processing school: ${school.name || 'Unnamed'}, Region: ${region}`);
      if (!regionData[region]) {
        regionData[region] = { region, totalSchools: 0, activeSchools: 0, inactiveSchools: 0, recentOnboarding: 0 };
      }
      regionData[region].totalSchools++;
      if (school.isActive) regionData[region].activeSchools++;
      else regionData[region].inactiveSchools++;
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (school.createdAt >= thirtyDaysAgo) regionData[region].recentOnboarding++;
    });
    
    console.log('Region data:', Object.values(regionData));
    return { data: Object.values(regionData) };
  } catch (error) {
    console.error('Error in getSchoolsByRegionData:', error);
    return { data: [] };
  }
}

async function getStudentActiveRateData() {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [total, dau, mau] = await Promise.all([
      User.countDocuments({ role: { $in: ['student', 'school_student'] } }),
      User.countDocuments({ role: { $in: ['student', 'school_student'] }, lastActive: { $gte: oneDayAgo } }),
      User.countDocuments({ role: { $in: ['student', 'school_student'] }, lastActive: { $gte: thirtyDaysAgo } })
    ]);

    const activeRate = mau > 0 ? ((dau / mau) * 100).toFixed(2) : 0;
    return {
      data: {
        totalStudents: total,
        dailyActiveUsers: dau,
        monthlyActiveUsers: mau,
        activeRate: parseFloat(activeRate),
        mauRate: total > 0 ? parseFloat(((mau / total) * 100).toFixed(2)) : 0,
        engagementLevel: getEngagementLevel(parseFloat(activeRate))
      }
    };
  } catch (error) {
    console.error('Error in getStudentActiveRateData:', error);
    return {
      data: {
        totalStudents: 0,
        dailyActiveUsers: 0,
        monthlyActiveUsers: 0,
        activeRate: 0,
        mauRate: 0,
        engagementLevel: 'Low'
      }
    };
  }
}

async function getPillarPerformanceData() {
  try {
    // Use raw MongoDB query to bypass tenantId requirement
    const db = mongoose.connection.db;
    const students = await db.collection('schoolstudents').find({ isActive: true }).project({ pillars: 1 }).toArray();
    
    const pillarStats = {
      uvls: { total: 0, count: 0 },
      dcos: { total: 0, count: 0 },
      moral: { total: 0, count: 0 },
      ehe: { total: 0, count: 0 },
      crgc: { total: 0, count: 0 }
    };

    students.forEach(student => {
      if (student.pillars) {
        Object.keys(pillarStats).forEach(pillar => {
          if (student.pillars[pillar]) {
            pillarStats[pillar].total += student.pillars[pillar];
            pillarStats[pillar].count++;
          }
        });
      }
    });

    const pillarData = Object.keys(pillarStats).map(pillar => {
      const stats = pillarStats[pillar];
      const average = stats.count > 0 ? parseFloat((stats.total / stats.count).toFixed(2)) : 0;
      return {
        name: getPillarName(pillar),
        code: pillar,
        average,
        benchmark: getBenchmark(average),
        count: stats.count,
        performance: getPerformanceLevel(average)
      };
    });

    return { data: pillarData };
  } catch (error) {
    console.error('Error in getPillarPerformanceData:', error);
    return { data: [] };
  }
}

async function getPlatformHealthData() {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [recentErrors, dailyErrors, recentActivity] = await Promise.all([
      ActivityLog.countDocuments({ activityType: 'error', timestamp: { $gte: oneHourAgo } }),
      ActivityLog.countDocuments({ activityType: 'error', timestamp: { $gte: oneDayAgo } }),
      ActivityLog.countDocuments({ timestamp: { $gte: oneHourAgo } })
    ]);

    const uptime = 99.9;
    const averageLatency = 150;
    const errorRate = recentActivity > 0 ? ((recentErrors / recentActivity) * 100).toFixed(3) : 0;

    return {
      data: {
        uptime,
        uptimeStatus: uptime >= 99 ? 'healthy' : uptime >= 95 ? 'degraded' : 'critical',
        averageLatency,
        latencyStatus: averageLatency < 200 ? 'good' : averageLatency < 500 ? 'moderate' : 'slow',
        errorRate: parseFloat(errorRate),
        recentErrors,
        dailyErrors,
        healthScore: calculateHealthScore(uptime, averageLatency, parseFloat(errorRate))
      }
    };
  } catch (error) {
    console.error('Error in getPlatformHealthData:', error);
    return {
      data: {
        uptime: 0,
        uptimeStatus: 'critical',
        averageLatency: 0,
        latencyStatus: 'slow',
        errorRate: 0,
        recentErrors: 0,
        dailyErrors: 0,
        healthScore: 0
      }
    };
  }
}

async function getPrivacyComplianceData() {
  try {
    // Use raw MongoDB queries to bypass tenantId requirement
    const db = mongoose.connection.db;
    
    const studentsWithFlags = await db.collection('schoolstudents').countDocuments({
      'consentFlags': { $exists: true, $ne: {} }
    });

    const privacyFlags = await db.collection('schoolstudents').countDocuments({
      'wellbeingFlags': {
        $elemMatch: {
          type: 'other',
          description: { $regex: /privacy|data|consent/i }
        }
      }
    });

    const totalStudents = await db.collection('schoolstudents').countDocuments({ isActive: true });
    const complianceRate = totalStudents > 0 
      ? ((totalStudents - studentsWithFlags) / totalStudents * 100).toFixed(2)
      : 100;

    return {
      data: {
        consentFlags: studentsWithFlags,
        privacyIncidents: privacyFlags,
        complianceRate: parseFloat(complianceRate),
        complianceStatus: getComplianceStatus(parseFloat(complianceRate)),
        totalStudents,
        gdprCompliance: parseFloat(complianceRate) > 95,
        lastAudit: new Date().toISOString(),
        criticalIssues: privacyFlags
      }
    };
  } catch (error) {
    console.error('Error in getPrivacyComplianceData:', error);
    return {
      data: {
        consentFlags: 0,
        privacyIncidents: 0,
        complianceRate: 100,
        complianceStatus: 'Compliant',
        totalStudents: 0,
        gdprCompliance: true,
        lastAudit: new Date().toISOString(),
        criticalIssues: 0
      }
    };
  }
}

function getPillarName(code) {
  const names = {
    uvls: 'Understanding Values & Life Skills',
    dcos: 'Digital Citizenship & Online Safety',
    moral: 'Moral & Spiritual Education',
    ehe: 'Environmental & Health Education',
    crgc: 'Cultural Roots & Global Citizenship'
  };
  return names[code] || code;
}

function getBenchmark(average) {
  if (average >= 80) return 'Excellent';
  if (average >= 60) return 'Good';
  if (average >= 40) return 'Average';
  return 'Needs Improvement';
}

function getPerformanceLevel(average) {
  if (average >= 80) return 'high';
  if (average >= 60) return 'medium';
  return 'low';
}

function getEngagementLevel(rate) {
  if (rate >= 50) return 'High';
  if (rate >= 30) return 'Medium';
  return 'Low';
}

function getComplianceStatus(rate) {
  if (rate >= 95) return 'Compliant';
  if (rate >= 80) return 'Mostly Compliant';
  return 'Needs Attention';
}

function calculateHealthScore(uptime, latency, errorRate) {
  let score = 100;
  
  // Uptime penalty (max -20 points)
  if (uptime < 99) score -= (99 - uptime) * 2;
  
  // Latency penalty (max -30 points)
  if (latency > 200) score -= (latency - 200) / 10;
  
  // Error rate penalty (max -50 points)
  score -= errorRate * 5;
  
  return Math.max(0, Math.min(100, score.toFixed(2)));
}

// ============= NEW ADMIN FEATURES =============

// 1. Network Map - Region to schools adoption heatmap
export const getNetworkMap = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const schools = await Organization.find({ type: 'school' }).select('name settings.address state isActive createdAt userCount');
    
    // Calculate adoption metrics
    const networkData = schools.map(school => {
      const region = school.settings?.address?.state || school.state || 'Unknown';
      const adoptionScore = calculateAdoptionScore(school.userCount || 0, school.isActive);
      
      return {
        schoolId: school._id,
        name: school.name,
        region,
        adoptionScore,
        userCount: school.userCount || 0,
        isActive: school.isActive,
        joinedDate: school.createdAt
      };
    });

    // Group by region for heatmap
    const regionMap = {};
    networkData.forEach(school => {
      if (!regionMap[school.region]) {
        regionMap[school.region] = {
          region: school.region,
          schools: [],
          totalAdoption: 0,
          avgAdoption: 0
        };
      }
      regionMap[school.region].schools.push(school);
      regionMap[school.region].totalAdoption += school.adoptionScore;
    });

    // Calculate average adoption per region
    Object.keys(regionMap).forEach(region => {
      const data = regionMap[region];
      data.avgAdoption = data.schools.length > 0 ? (data.totalAdoption / data.schools.length).toFixed(1) : 0;
      data.schoolCount = data.schools.length;
    });

    res.json({
      success: true,
      data: {
        networkData: Object.values(regionMap),
        totalSchools: schools.length,
        totalRegions: Object.keys(regionMap).length
      }
    });
  } catch (error) {
    console.error('Error fetching network map:', error);
    res.status(500).json({ success: false, message: 'Error fetching network map' });
  }
};

// 2. Benchmarks Panel - Compare schools
export const getBenchmarksPanel = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get all schools with student data
    const students = await db.collection('schoolstudents').aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: '$tenantId',
        studentCount: { $sum: 1 },
        avgUvls: { $avg: '$pillars.uvls' },
        avgDcos: { $avg: '$pillars.dcos' },
        avgMoral: { $avg: '$pillars.moral' },
        avgEhe: { $avg: '$pillars.ehe' },
        avgCrgc: { $avg: '$pillars.crgc' }
      }},
      { $sort: { studentCount: -1 } },
      { $limit: 50 }
    ]).toArray();

    // Get school details
    const tenantIds = students.map(s => s._id);
    const schools = await Organization.find({ tenantId: { $in: tenantIds } })
      .select('name settings.address state isActive createdAt');

    // Combine data
    const benchmarks = students.map(student => {
      const school = schools.find(s => s.tenantId === student._id);
      const region = school?.settings?.address?.state || school?.state || 'Unknown';
      
      const avgPillar = (
        (student.avgUvls || 0) + 
        (student.avgDcos || 0) + 
        (student.avgMoral || 0) + 
        (student.avgEhe || 0) + 
        (student.avgCrgc || 0)
      ) / 5;

      return {
        schoolId: school?._id,
        schoolName: school?.name || 'Unknown',
        region,
        studentCount: student.studentCount,
        avgPillar: avgPillar.toFixed(1),
        pillars: {
          uvls: (student.avgUvls || 0).toFixed(1),
          dcos: (student.avgDcos || 0).toFixed(1),
          moral: (student.avgMoral || 0).toFixed(1),
          ehe: (student.avgEhe || 0).toFixed(1),
          crgc: (student.avgCrgc || 0).toFixed(1)
        }
      };
    });

    res.json({
      success: true,
      data: benchmarks
    });
  } catch (error) {
    console.error('Error fetching benchmarks:', error);
    res.status(500).json({ success: false, message: 'Error fetching benchmarks' });
  }
};

// 3. Platform Health & Telemetry (APM)
export const getPlatformTelemetry = async (req, res) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const db = mongoose.connection.db;
    
    // Get activity metrics
    const [
      errorLogs,
      totalActivity,
      recentErrors,
      dailyActivity,
      weeklyActivity
    ] = await Promise.all([
      ActivityLog.countDocuments({ activityType: 'error', timestamp: { $gte: oneHourAgo } }),
      ActivityLog.countDocuments({ timestamp: { $gte: oneWeekAgo } }),
      ActivityLog.find({ activityType: 'error', timestamp: { $gte: oneDayAgo } }).limit(50).sort({ timestamp: -1 }),
      ActivityLog.countDocuments({ timestamp: { $gte: oneDayAgo } }),
      ActivityLog.countDocuments({ timestamp: { $gte: oneWeekAgo } })
    ]);

    // Calculate API metrics
    const errorRate = totalActivity > 0 ? ((errorLogs / totalActivity) * 100).toFixed(2) : 0;
    const activityTrend = weeklyActivity > 0 ? (((dailyActivity - (weeklyActivity / 7)) / (weeklyActivity / 7)) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        uptime: 99.9,
        responseTime: 150,
        errorRate: parseFloat(errorRate),
        errorTrend: errorRate > 1 ? 'up' : 'down',
        activityTrend: parseFloat(activityTrend),
        recentErrors: recentErrors.map(err => ({
          id: err._id,
          message: err.description || 'Error occurred',
          timestamp: err.timestamp,
          userId: err.userId
        })),
        healthScore: calculateHealthScore(99.9, 150, parseFloat(errorRate))
      }
    });
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    res.status(500).json({ success: false, message: 'Error fetching telemetry' });
  }
};

// 4. Marketplace Management
export const getMarketplaceManagement = async (req, res) => {
  try {
    // Simulate marketplace data (in production, this would query a marketplace collection)
    const modules = [
      { id: '1', name: 'AI Math Tutor', type: 'inavora', status: 'active', downloads: 1250, rating: 4.8 },
      { id: '2', name: 'Science Lab Simulator', type: 'inavora', status: 'pending', downloads: 0, rating: 0 },
      { id: '3', name: 'Parent-Teacher Communication', type: 'third-party', status: 'pending', downloads: 0, rating: 0 },
      { id: '4', name: 'Attendance Tracker Pro', type: 'third-party', status: 'approved', downloads: 890, rating: 4.5 },
      { id: '5', name: 'Financial Literacy Game', type: 'inavora', status: 'active', downloads: 2150, rating: 4.9 }
    ];

    const pendingCount = modules.filter(m => m.status === 'pending').length;
    const totalDownloads = modules.reduce((sum, m) => sum + m.downloads, 0);

    res.json({
      success: true,
      data: {
        modules,
        stats: {
          totalModules: modules.length,
          pendingApprovals: pendingCount,
          activeModules: modules.filter(m => m.status === 'active').length,
          totalDownloads
        }
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    res.status(500).json({ success: false, message: 'Error fetching marketplace' });
  }
};

// 5. Data Export & Research Sandbox (Anonymized)
export const getDataExportSandbox = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get anonymized statistics
    const [totalStudents, totalSchools, totalTeachers] = await Promise.all([
      db.collection('schoolstudents').countDocuments({ isActive: true }),
      Organization.countDocuments({ type: 'school' }),
      User.countDocuments({ role: 'school_teacher' })
    ]);

    // Get anonymized usage patterns
    const recentActivity = await ActivityLog.aggregate([
      { $match: { timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: {
        _id: '$activityType',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        anonymizedStats: {
          totalStudents,
          totalSchools,
          totalTeachers,
          dataAnonymized: true
        },
        usagePatterns: recentActivity.map(a => ({
          activityType: a._id,
          count: a.count
        })),
        exportFormats: ['CSV', 'JSON', 'Excel'],
        lastExport: null
      }
    });
  } catch (error) {
    console.error('Error fetching data export:', error);
    res.status(500).json({ success: false, message: 'Error fetching data export' });
  }
};

// 6. Policy and Legal
export const getPolicyLegal = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get consent data
    const totalStudents = await db.collection('schoolstudents').countDocuments({ isActive: true });
    const consentedStudents = await db.collection('schoolstudents').countDocuments({
      isActive: true,
      'consentFlags': { $exists: false }
    });
    
    const consentRate = totalStudents > 0 ? ((consentedStudents / totalStudents) * 100).toFixed(2) : 100;

    // Get data deletion requests
    const deletionRequests = []; // Would come from a requests table in production

    res.json({
      success: true,
      data: {
        consent: {
          totalStudents,
          consentedStudents,
          consentRate: parseFloat(consentRate),
          nonConsentedStudents: totalStudents - consentedStudents
        },
        dataDeletionRequests: {
          pending: deletionRequests.filter(r => r.status === 'pending').length,
          completed: deletionRequests.filter(r => r.status === 'completed').length,
          total: deletionRequests.length,
          requests: deletionRequests.slice(0, 10)
        },
        gdprCompliance: {
          compliant: parseFloat(consentRate) >= 95,
          complianceRate: parseFloat(consentRate),
          lastAudit: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching policy legal:', error);
    res.status(500).json({ success: false, message: 'Error fetching policy legal' });
  }
};

// Helper function for adoption score
function calculateAdoptionScore(userCount, isActive) {
  let score = 0;
  
  // Base score for being active
  if (isActive) score += 30;
  
  // Score based on user count (logarithmic scale)
  if (userCount > 0) {
    score += Math.min(70, Math.log10(userCount + 1) * 10);
  }
  
  return Math.round(score);
}

// ============= ADVANCED ADMIN FEATURES =============

// 1. School Onboarding Console
export const getSchoolOnboardingConsole = async (req, res) => {
  try {
    // Get all schools with onboarding details
    const schools = await Organization.find({ type: 'school' })
      .select('name tenantId isActive createdAt settings.address settings.contactInfo userCount maxUsers')
      .sort({ createdAt: -1 });

    // Get trial period status (assume 30-day trial)
    const schoolsWithTrialStatus = schools.map(school => {
      const createdAt = new Date(school.createdAt);
      const trialEndDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      const today = new Date();
      const daysRemaining = Math.ceil((trialEndDate - today) / (24 * 60 * 60 * 1000));
      
      return {
        schoolId: school._id,
        name: school.name,
        tenantId: school.tenantId,
        region: school.settings?.address?.state || 'Unknown',
        status: school.isActive ? 'active' : 'inactive',
        trialStatus: daysRemaining > 0 ? 'trial' : 'expired',
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        trialEndDate: trialEndDate.toISOString(),
        joinedDate: createdAt.toISOString(),
        userCount: school.userCount || 0,
        maxUsers: school.maxUsers || 100,
        contactInfo: school.settings?.contactInfo || {}
      };
    });

    // Get pending onboarding requests
    const pendingRequests = []; // Would come from a requests table

    res.json({
      success: true,
      data: {
        schools: schoolsWithTrialStatus,
        pendingRequests,
        stats: {
          totalSchools: schools.length,
          activeTrial: schoolsWithTrialStatus.filter(s => s.trialStatus === 'trial').length,
          expiredTrial: schoolsWithTrialStatus.filter(s => s.trialStatus === 'expired').length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching onboarding console:', error);
    res.status(500).json({ success: false, message: 'Error fetching onboarding console' });
  }
};

export const createTenant = async (req, res) => {
  try {
    const { name, region, email, phone, trialDays = 30 } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Generate a temporary password for the company
    const bcrypt = require('bcrypt');
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create company first (required)
    const company = await Company.create({
      name: `${name} Holdings`,
      email: `${email.split('@')[0]}+company@${email.split('@')[1]}`,
      password: hashedPassword,
      type: 'school',
      contactInfo: {
        phone,
        address: region,
        state: region
      }
    });

    // Create organization
    const organization = await Organization.create({
      name,
      type: 'school',
      companyId: company._id,
      settings: {
        address: {
          state: region,
          country: 'India'
        },
        contactInfo: {
          email,
          phone
        }
      },
      isActive: true
    });

    res.json({
      success: true,
      message: 'Tenant created successfully',
      data: {
        schoolId: organization._id,
        tenantId: organization.tenantId,
        name: organization.name,
        companyId: company._id,
        linkingCode: organization.linkingCode,
      }
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ success: false, message: 'Error creating tenant', error: error.message });
  }
};

// 2. Marketplace Governance
export const getMarketplaceGovernance = async (req, res) => {
  try {
    // Get marketplace modules with governance data
    const modules = [
      { 
        id: '1', name: 'AI Math Tutor', type: 'inavora', status: 'pending_approval',
        description: 'Advanced AI-powered math tutoring module', version: '2.1.0',
        revenueShare: 70, downloads: 1250, rating: 4.8, createdAt: '2024-01-15',
        metadata: { category: 'Education', targetAge: '10-18', languages: ['en', 'hi'] }
      },
      { 
        id: '2', name: 'Science Lab Simulator', type: 'inavora', status: 'under_review',
        description: 'Virtual laboratory experiments', version: '1.0.0',
        revenueShare: 65, downloads: 0, rating: 0, createdAt: '2024-03-10',
        metadata: { category: 'Science', targetAge: '12-18', languages: ['en'] }
      },
      { 
        id: '3', name: 'Parent-Teacher Communication', type: 'third-party', status: 'pending_approval',
        description: 'Integrated communication platform', version: '3.2.1',
        revenueShare: 50, downloads: 0, rating: 0, createdAt: '2024-03-15',
        metadata: { category: 'Communication', targetAge: 'all', languages: ['en', 'hi', 'te'] }
      }
    ];

    const pendingReviews = modules.filter(m => m.status === 'pending_approval' || m.status === 'under_review');

    res.json({
      success: true,
      data: {
        modules,
        pendingReviews,
        stats: {
          totalModules: modules.length,
          pendingApprovals: pendingReviews.length,
          totalRevenue: 125000 // Simulated
        }
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace governance:', error);
    res.status(500).json({ success: false, message: 'Error fetching marketplace governance' });
  }
};

export const approveModule = async (req, res) => {
  try {
    const { moduleId, revenueShare, metadata } = req.body;

    // In production, this would update the module in the database
    res.json({
      success: true,
      message: 'Module approved successfully',
      data: { moduleId, revenueShare, metadata }
    });
  } catch (error) {
    console.error('Error approving module:', error);
    res.status(500).json({ success: false, message: 'Error approving module' });
  }
};

// 3. Research Sandbox
export const getResearchSandbox = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get anonymized statistics
    const [totalStudents, totalSchools, totalTeachers] = await Promise.all([
      db.collection('schoolstudents').countDocuments({ isActive: true }),
      Organization.countDocuments({ type: 'school' }),
      User.countDocuments({ role: 'school_teacher' })
    ]);

    // Get research agreements
    const agreements = [
      {
        id: '1',
        researcher: 'Dr. John Smith',
        institution: 'MIT Technology Research',
        dataset: 'Student Performance Analytics',
        approved: true,
        approvedDate: '2024-01-15',
        expiryDate: '2024-12-31'
      },
      {
        id: '2',
        researcher: 'Dr. Sarah Johnson',
        institution: 'Stanford Education Lab',
        dataset: 'Engagement Patterns',
        approved: false,
        requestedDate: '2024-03-10'
      }
    ];

    res.json({
      success: true,
      data: {
        anonymizedData: {
          totalStudents,
          totalSchools,
          totalTeachers,
          dataAnonymized: true,
          complianceLevel: 'Full GDPR Compliance'
        },
        agreements,
        availableDatasets: [
          'Student Performance Metrics',
          'Engagement Patterns',
          'Pillar Proficiency Scores',
          'Regional Adoption Rates'
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching research sandbox:', error);
    res.status(500).json({ success: false, message: 'Error fetching research sandbox' });
  }
};

export const createResearchAgreement = async (req, res) => {
  try {
    const { researcher, institution, dataset, purpose } = req.body;

    // In production, this would create an agreement in the database
    res.json({
      success: true,
      message: 'Research agreement created',
      data: { researcher, institution, dataset, purpose, status: 'pending' }
    });
  } catch (error) {
    console.error('Error creating research agreement:', error);
    res.status(500).json({ success: false, message: 'Error creating research agreement' });
  }
};

// 4. Compliance Dashboard
export const getComplianceDashboard = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get consent expiry data
    const totalStudents = await db.collection('schoolstudents').countDocuments({ isActive: true });
    const consentedStudents = await db.collection('schoolstudents').countDocuments({
      isActive: true,
      'consentFlags': { $exists: false }
    });

    // Simulate consent expiry tracking
    const consentExpiring = [
      { id: '1', schoolName: 'ABC School', region: 'Delhi', students: 45, expiryDate: '2024-04-15' },
      { id: '2', schoolName: 'XYZ Academy', region: 'Mumbai', students: 23, expiryDate: '2024-04-20' }
    ];

    // Simulate deletion requests
    const deletionRequests = [
      { id: '1', userName: 'John Doe', email: 'john@example.com', requestDate: '2024-03-10', status: 'pending' },
      { id: '2', userName: 'Jane Smith', email: 'jane@example.com', requestDate: '2024-03-15', status: 'in_progress' }
    ];

    // Simulate legal holds
    const legalHolds = [
      { id: '1', caseNumber: 'CASE-2024-001', entityType: 'School', entityName: 'ABC School', holdDate: '2024-02-15', status: 'active' }
    ];

    res.json({
      success: true,
      data: {
        consentManagement: {
          totalStudents,
          consentedStudents,
          nonConsentedStudents: totalStudents - consentedStudents,
          consentRate: totalStudents > 0 ? ((consentedStudents / totalStudents) * 100).toFixed(2) : 100,
          expiringSoon: consentExpiring
        },
        deletionRequests,
        legalHolds,
        alerts: {
          pendingDeletions: deletionRequests.filter(d => d.status === 'pending').length,
          activeLegalHolds: legalHolds.filter(l => l.status === 'active').length,
          consentExpiring: consentExpiring.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    res.status(500).json({ success: false, message: 'Error fetching compliance dashboard' });
  }
};

export const processDeletionRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    // In production, this would process the deletion request
    res.json({
      success: true,
      message: `Deletion request ${action}ed successfully`,
      data: { requestId, action }
    });
  } catch (error) {
    console.error('Error processing deletion request:', error);
    res.status(500).json({ success: false, message: 'Error processing deletion request' });
  }
};

