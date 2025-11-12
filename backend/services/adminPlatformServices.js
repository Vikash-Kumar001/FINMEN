import Organization from '../models/Organization.js';
import User from '../models/User.js';
import Benchmark from '../models/Benchmark.js';
import Telemetry from '../models/Telemetry.js';
import Onboarding from '../models/Onboarding.js';
import DataExport from '../models/DataExport.js';
import PolicyLegal from '../models/PolicyLegal.js';
import ActivityLog from '../models/ActivityLog.js';
import AssignmentAttempt from '../models/AssignmentAttempt.js';
import mongoose from 'mongoose';

// ============= NETWORK MAP =============

export const getNetworkMap = async () => {
  try {
    const organizations = await Organization.find().lean();
    
    // Group by region/country
    const regionalData = {};
    const schoolDistribution = [];
    
    for (const org of organizations) {
      const country = org.settings?.address?.country || 'Unknown';
      const state = org.settings?.address?.state || 'Unknown';
      const city = org.settings?.address?.city || 'Unknown';
      const region = `${country}/${state}`;
      
      if (!regionalData[region]) {
        regionalData[region] = {
          region,
          country,
          state,
          cities: {},
          totalSchools: 0,
          totalStudents: 0,
          totalTeachers: 0,
          adoptionRate: 0
        };
      }
      
      regionalData[region].totalSchools += 1;
      
      if (!regionalData[region].cities[city]) {
        regionalData[region].cities[city] = {
          city,
          schools: [],
          totalStudents: 0,
          totalTeachers: 0
        };
      }
      
      // Get user counts for this organization
      const [students, teachers] = await Promise.all([
        User.countDocuments({ orgId: org._id, role: 'school_student' }),
        User.countDocuments({ orgId: org._id, role: 'teacher' })
      ]);
      
      regionalData[region].totalStudents += students;
      regionalData[region].totalTeachers += teachers;
      regionalData[region].cities[city].totalStudents += students;
      regionalData[region].cities[city].totalTeachers += teachers;
      
      schoolDistribution.push({
        organizationId: org._id,
        name: org.name,
        tenantId: org.tenantId,
        location: {
          country,
          state,
          city,
          coordinates: org.settings?.address?.coordinates || null
        },
        metrics: {
          students,
          teachers,
          activeUsers: 0 // Would need to calculate from activity logs
        },
        createdAt: org.createdAt
      });
    }
    
    // Calculate adoption rate (simplified - active schools / total schools)
    const regions = Object.values(regionalData).map(region => ({
      ...region,
      adoptionRate: Math.min(100, (region.totalSchools / Math.max(1, organizations.length)) * 100)
    }));
    
    return {
      regions,
      schoolDistribution,
      totalSchools: organizations.length,
      totalCountries: new Set(Object.values(regionalData).map(r => r.country)).size,
      totalStates: Object.keys(regionalData).length
    };
  } catch (error) {
    console.error('Error getting network map:', error);
    throw error;
  }
};

// ============= BENCHMARKS =============

export const createBenchmark = async (benchmarkData, createdBy) => {
  try {
    const {
      benchmarkName,
      benchmarkType,
      startDate,
      endDate,
      organizationIds = []
    } = benchmarkData;
    
    // Get all organizations if none specified
    const orgFilter = organizationIds.length > 0
      ? { _id: { $in: organizationIds.map(id => new mongoose.Types.ObjectId(id)) } }
      : {};
    
    const organizations = await Organization.find(orgFilter).lean();
    
    // Calculate metrics for each school
    const schools = [];
    const metricsArray = [];
    
    for (const org of organizations) {
      const [students, teachers, activities, assignments] = await Promise.all([
        User.countDocuments({ orgId: org._id, role: 'school_student' }),
        User.countDocuments({ orgId: org._id, role: 'teacher' }),
        ActivityLog.countDocuments({
          userId: { $in: await User.find({ orgId: org._id }).select('_id').lean().then(users => users.map(u => u._id)) },
          timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }),
        AssignmentAttempt.countDocuments({
          studentId: { $in: await User.find({ orgId: org._id, role: 'school_student' }).select('_id').lean().then(users => users.map(u => u._id)) },
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })
      ]);
      
      const activityRate = students > 0 ? (activities / students) : 0;
      const completionRate = assignments > 0 ? (assignments / (assignments + 10)) * 100 : 0;
      
      let score = 0;
      if (benchmarkType === 'engagement') {
        score = Math.min(100, (activityRate / 10) * 100);
      } else if (benchmarkType === 'academic') {
        score = completionRate;
      } else {
        score = (activityRate + completionRate) / 2;
      }
      
      metricsArray.push(score);
      
      schools.push({
        organizationId: org._id,
        metrics: {
          students,
          teachers,
          activities,
          assignments,
          activityRate,
          completionRate
        },
        score
      });
    }
    
    // Calculate network statistics
    const sortedScores = metricsArray.sort((a, b) => a - b);
    const networkAverage = sortedScores.reduce((a, b) => a + b, 0) / sortedScores.length;
    const networkMedian = sortedScores.length > 0 
      ? sortedScores[Math.floor(sortedScores.length / 2)]
      : 0;
    const networkMin = sortedScores[0] || 0;
    const networkMax = sortedScores[sortedScores.length - 1] || 0;
    const variance = sortedScores.reduce((sum, val) => sum + Math.pow(val - networkAverage, 2), 0) / sortedScores.length;
    const networkStdDev = Math.sqrt(variance);
    
    // Calculate percentile and rank
    schools.forEach((school, index) => {
      const percentile = (sortedScores.filter(s => s <= school.score).length / sortedScores.length) * 100;
      school.percentile = percentile;
      school.rank = sortedScores.filter(s => s > school.score).length + 1;
    });
    
    const benchmark = new Benchmark({
      benchmarkName,
      benchmarkType,
      schools,
      networkAverage,
      networkMedian,
      networkMin,
      networkMax,
      networkStdDev,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: new mongoose.Types.ObjectId(createdBy)
    });
    
    await benchmark.save();
    
    return await Benchmark.findById(benchmark._id)
      .populate('schools.organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error creating benchmark:', error);
    throw error;
  }
};

export const getBenchmarks = async (filters = {}) => {
  try {
    const {
      benchmarkType = 'all',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    if (benchmarkType !== 'all') {
      query.benchmarkType = benchmarkType;
    }
    
    const total = await Benchmark.countDocuments(query);
    
    const benchmarks = await Benchmark.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('schools.organizationId', 'name tenantId')
      .lean();
    
    return {
      benchmarks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting benchmarks:', error);
    throw error;
  }
};

// ============= PLATFORM TELEMETRY =============

export const getPlatformTelemetry = async () => {
  try {
    // Get recent telemetry data
    const recentTelemetry = await Telemetry.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();
    
    // Aggregate by service
    const serviceMetrics = {};
    const now = Date.now();
    
    for (const telemetry of recentTelemetry) {
      if (!serviceMetrics[telemetry.serviceName]) {
        serviceMetrics[telemetry.serviceName] = {
          serviceName: telemetry.serviceName,
          components: {},
          status: 'healthy',
          alerts: [],
          latestMetrics: {},
          history: []
        };
      }
      
      const service = serviceMetrics[telemetry.serviceName];
      
      if (!service.components[telemetry.component]) {
        service.components[telemetry.component] = {
          name: telemetry.component,
          metrics: [],
          status: 'healthy'
        };
      }
      
      service.components[telemetry.component].metrics.push(telemetry.metrics);
      service.latestMetrics = telemetry.metrics;
      
      if (telemetry.status !== 'healthy') {
        service.status = telemetry.status;
      }
      
      if (telemetry.alerts?.length > 0) {
        service.alerts.push(...telemetry.alerts);
      }
      
      // Keep last 50 data points per component
      if (service.components[telemetry.component].metrics.length > 50) {
        service.components[telemetry.component].metrics = service.components[telemetry.component].metrics.slice(-50);
      }
    }
    
    // Calculate averages and detect issues
    const services = Object.values(serviceMetrics).map(service => {
      const allMetrics = Object.values(service.components).flatMap(c => c.metrics);
      const avgResponseTime = allMetrics.length > 0
        ? allMetrics.reduce((sum, m) => sum + (m.responseTime || 0), 0) / allMetrics.length
        : 0;
      const avgErrorRate = allMetrics.length > 0
        ? allMetrics.reduce((sum, m) => sum + (m.errorRate || 0), 0) / allMetrics.length
        : 0;
      const avgCpuUsage = allMetrics.length > 0
        ? allMetrics.reduce((sum, m) => sum + (m.cpuUsage || 0), 0) / allMetrics.length
        : 0;
      const avgMemoryUsage = allMetrics.length > 0
        ? allMetrics.reduce((sum, m) => sum + (m.memoryUsage || 0), 0) / allMetrics.length
        : 0;
      
      // Determine overall status
      let status = 'healthy';
      if (avgErrorRate > 5 || avgCpuUsage > 90 || avgMemoryUsage > 90) {
        status = 'critical';
      } else if (avgErrorRate > 2 || avgCpuUsage > 70 || avgMemoryUsage > 70 || avgResponseTime > 2000) {
        status = 'warning';
      }
      
      return {
        ...service,
        averageMetrics: {
          responseTime: avgResponseTime,
          errorRate: avgErrorRate,
          cpuUsage: avgCpuUsage,
          memoryUsage: avgMemoryUsage
        },
        status
      };
    });
    
    return {
      services,
      overallHealth: services.every(s => s.status === 'healthy') ? 'healthy' : 'degraded',
      totalServices: services.length,
      criticalServices: services.filter(s => s.status === 'critical').length
    };
  } catch (error) {
    console.error('Error getting platform telemetry:', error);
    throw error;
  }
};

export const recordTelemetry = async (telemetryData) => {
  try {
    const telemetry = new Telemetry(telemetryData);
    
    // Add alerts if thresholds exceeded
    const alerts = [];
    if (telemetry.metrics.responseTime > 2000) {
      alerts.push({
        type: 'high_latency',
        severity: 'high',
        message: `High response time: ${telemetry.metrics.responseTime}ms`,
        threshold: 2000,
        currentValue: telemetry.metrics.responseTime
      });
    }
    if (telemetry.metrics.errorRate > 5) {
      alerts.push({
        type: 'high_error_rate',
        severity: 'critical',
        message: `High error rate: ${telemetry.metrics.errorRate}%`,
        threshold: 5,
        currentValue: telemetry.metrics.errorRate
      });
    }
    if (telemetry.metrics.cpuUsage > 80) {
      alerts.push({
        type: 'high_cpu',
        severity: 'high',
        message: `High CPU usage: ${telemetry.metrics.cpuUsage}%`,
        threshold: 80,
        currentValue: telemetry.metrics.cpuUsage
      });
    }
    if (telemetry.metrics.memoryUsage > 85) {
      alerts.push({
        type: 'high_memory',
        severity: 'high',
        message: `High memory usage: ${telemetry.metrics.memoryUsage}%`,
        threshold: 85,
        currentValue: telemetry.metrics.memoryUsage
      });
    }
    
    telemetry.alerts = alerts;
    
    // Determine status
    if (alerts.some(a => a.severity === 'critical')) {
      telemetry.status = 'down';
    } else if (alerts.length > 0) {
      telemetry.status = 'warning';
    }
    
    await telemetry.save();
    
    return telemetry;
  } catch (error) {
    console.error('Error recording telemetry:', error);
    throw error;
  }
};

// ============= SCHOOL ONBOARDING =============

export const createOnboarding = async (onboardingData, createdBy) => {
  try {
    const onboarding = new Onboarding({
      ...onboardingData,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      status: 'pending'
    });
    
    await onboarding.save();
    
    return await Onboarding.findById(onboarding._id)
      .populate('assignedManager', 'fullName name email')
      .lean();
  } catch (error) {
    console.error('Error creating onboarding:', error);
    throw error;
  }
};

export const getOnboardings = async (filters = {}) => {
  try {
    const {
      status = 'all',
      trialStatus = 'all',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }
    if (trialStatus !== 'all') {
      query.trialStatus = trialStatus;
    }
    
    const total = await Onboarding.countDocuments(query);
    
    const onboardings = await Onboarding.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('assignedManager', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    return {
      onboardings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting onboardings:', error);
    throw error;
  }
};

export const updateOnboarding = async (onboardingId, updateData) => {
  try {
    const onboarding = await Onboarding.findByIdAndUpdate(
      onboardingId,
      { $set: updateData },
      { new: true }
    ).populate('assignedManager', 'fullName name email');
    
    if (!onboarding) {
      throw new Error('Onboarding not found');
    }
    
    return onboarding;
  } catch (error) {
    console.error('Error updating onboarding:', error);
    throw error;
  }
};

export const startTrial = async (onboardingId, trialDays = 30) => {
  try {
    const onboarding = await Onboarding.findById(onboardingId);
    if (!onboarding) {
      throw new Error('Onboarding not found');
    }
    
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + trialDays);
    
    onboarding.trialStatus = 'active';
    onboarding.trialStartDate = startDate;
    onboarding.trialEndDate = endDate;
    onboarding.trialDays = trialDays;
    
    await onboarding.save();
    
    return onboarding;
  } catch (error) {
    console.error('Error starting trial:', error);
    throw error;
  }
};

// ============= DATA EXPORT =============

export const createDataExport = async (exportData, createdBy) => {
  try {
    const export_ = new DataExport({
      ...exportData,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      status: 'pending'
    });
    
    await export_.save();
    
    // Simulate export processing (in production, this would be a background job)
    setTimeout(async () => {
      try {
        const updated = await DataExport.findById(export_._id);
        updated.status = 'processing';
        updated.progress = 10;
        await updated.save();
        
        // Simulate progress
        const interval = setInterval(async () => {
          const current = await DataExport.findById(export_._id);
          if (current.progress < 90) {
            current.progress += 10;
            await current.save();
          } else {
            clearInterval(interval);
            const final = await DataExport.findById(export_._id);
            final.status = 'completed';
            final.progress = 100;
            final.fileUrl = `/exports/${export_._id}.${export_.format}`;
            final.fileName = `${export_.exportName}.${export_.format}`;
            await final.save();
          }
        }, 1000);
      } catch (error) {
        console.error('Error processing export:', error);
      }
    }, 1000);
    
    return export_;
  } catch (error) {
    console.error('Error creating data export:', error);
    throw error;
  }
};

export const getDataExports = async (filters = {}) => {
  try {
    const {
      exportType = 'all',
      status = 'all',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    if (exportType !== 'all') {
      query.exportType = exportType;
    }
    if (status !== 'all') {
      query.status = status;
    }
    
    const total = await DataExport.countDocuments(query);
    
    const exports = await DataExport.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'fullName name email')
      .lean();
    
    return {
      exports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting data exports:', error);
    throw error;
  }
};

// ============= POLICY & LEGAL =============

export const getPolicyLegalStats = async () => {
  try {
    const [
      totalConsents,
      grantedConsents,
      pendingDeletions,
      activeLegalHolds,
      consentRate
    ] = await Promise.all([
      PolicyLegal.countDocuments({ requestType: 'consent' }),
      PolicyLegal.countDocuments({ requestType: 'consent', consentStatus: 'granted' }),
      PolicyLegal.countDocuments({ 'deletionRequest.status': { $in: ['pending', 'in_progress'] } }),
      PolicyLegal.countDocuments({ 'legalHold.active': true }),
      PolicyLegal.aggregate([
        { $match: { requestType: 'consent' }},
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            granted: { $sum: { $cond: [{ $eq: ['$consentStatus', 'granted'] }, 1, 0] }}
          }
        }
      ])
    ]);
    
    const rate = consentRate[0]?.total > 0
      ? (consentRate[0].granted / consentRate[0].total) * 100
      : 0;
    
    return {
      totalConsents,
      grantedConsents,
      consentRate: rate,
      pendingDeletions,
      activeLegalHolds,
      withdrawnConsents: await PolicyLegal.countDocuments({ consentStatus: 'withdrawn' })
    };
  } catch (error) {
    console.error('Error getting policy legal stats:', error);
    throw error;
  }
};

export const getPolicyLegalRequests = async (filters = {}) => {
  try {
    const {
      requestType = 'all',
      status = 'all',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    if (requestType !== 'all') {
      query.requestType = requestType;
    }
    if (status !== 'all') {
      query.status = status;
    }
    
    const total = await PolicyLegal.countDocuments(query);
    
    const requests = await PolicyLegal.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    return {
      requests,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting policy legal requests:', error);
    throw error;
  }
};

export const createPolicyLegalRequest = async (requestData, createdBy) => {
  try {
    const request = new PolicyLegal({
      ...requestData,
      createdBy: new mongoose.Types.ObjectId(createdBy)
    });
    
    await request.save();
    
    return await PolicyLegal.findById(request._id)
      .populate('userId', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error creating policy legal request:', error);
    throw error;
  }
};

export default {
  getNetworkMap,
  createBenchmark,
  getBenchmarks,
  getPlatformTelemetry,
  recordTelemetry,
  createOnboarding,
  getOnboardings,
  updateOnboarding,
  startTrial,
  createDataExport,
  getDataExports,
  getPolicyLegalStats,
  getPolicyLegalRequests,
  createPolicyLegalRequest
};

