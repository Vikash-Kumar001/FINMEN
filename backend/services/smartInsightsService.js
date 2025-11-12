import User from '../models/User.js';
import Organization from '../models/Organization.js';
import ActivityLog from '../models/ActivityLog.js';
import mongoose from 'mongoose';

// Generate AI-powered insights from platform data
export const generateSmartInsights = async (filters = {}) => {
  try {
    const { timeRange = 'week' } = filters;
    
    // Calculate date ranges
    const now = new Date();
    let currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd;
    
    switch (timeRange) {
      case 'day':
        currentPeriodStart = new Date(now.setHours(0, 0, 0, 0));
        currentPeriodEnd = new Date();
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
        previousPeriodEnd = new Date(currentPeriodStart);
        break;
      case 'week':
        currentPeriodStart = new Date(now.setDate(now.getDate() - 7));
        currentPeriodEnd = new Date();
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        previousPeriodEnd = new Date(currentPeriodStart);
        break;
      case 'month':
        currentPeriodStart = new Date(now.setMonth(now.getMonth() - 1));
        currentPeriodEnd = new Date();
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        previousPeriodEnd = new Date(currentPeriodStart);
        break;
      default:
        currentPeriodStart = new Date(now.setDate(now.getDate() - 7));
        currentPeriodEnd = new Date();
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        previousPeriodEnd = new Date(currentPeriodStart);
    }

    const insights = [];

    // 1. Attendance/Analytics Insights
    const attendanceInsight = await getAttendanceInsight(currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd);
    if (attendanceInsight) insights.push(attendanceInsight);

    // 2. Assignment Completion Insights
    const assignmentInsight = await getAssignmentInsight(currentPeriodStart, currentPeriodEnd);
    if (assignmentInsight) insights.push(assignmentInsight);

    // 3. User Engagement Insights
    const engagementInsight = await getEngagementInsight(currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd);
    if (engagementInsight) insights.push(engagementInsight);

    // 4. School Performance Insights
    const schoolInsight = await getSchoolPerformanceInsight(currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd);
    if (schoolInsight) insights.push(schoolInsight);

    // 5. Student Activity Insights
    const activityInsight = await getStudentActivityInsight(currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd);
    if (activityInsight) insights.push(activityInsight);

    // 6. Teacher Workload Insights
    const workloadInsight = await getTeacherWorkloadInsight(currentPeriodStart, currentPeriodEnd);
    if (workloadInsight) insights.push(workloadInsight);

    // Sort by priority (critical > high > medium > low)
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    insights.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));

    return {
      insights,
      total: insights.length,
      critical: insights.filter(i => i.priority === 'critical').length,
      high: insights.filter(i => i.priority === 'high').length,
      medium: insights.filter(i => i.priority === 'medium').length,
      low: insights.filter(i => i.priority === 'low').length,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating smart insights:', error);
    throw error;
  }
};

// Attendance Insight
async function getAttendanceInsight(currentStart, currentEnd, previousStart, previousEnd) {
  try {
    const db = mongoose.connection.db;
    
    // Get current period attendance
    const currentAttendance = await db.collection('schoolstudents').aggregate([
      { $match: { isActive: true }},
      { $group: {
        _id: '$tenantId',
        avgAttendance: { $avg: '$attendance.percentage' },
        totalStudents: { $sum: 1 }
      }}
    ]).toArray();

    // Get schools with significant attendance drops
    const schoolsWithDrops = [];
    for (const school of currentAttendance) {
      if (school.avgAttendance < 70) {
        const organization = await Organization.findOne({ tenantId: school._id });
        if (organization) {
          schoolsWithDrops.push({
            schoolId: school._id,
            schoolName: organization.name || 'Unknown School',
            avgAttendance: Math.round(school.avgAttendance),
            students: school.totalStudents
          });
        }
      }
    }

    if (schoolsWithDrops.length > 0) {
      const top3 = schoolsWithDrops
        .sort((a, b) => a.avgAttendance - b.avgAttendance)
        .slice(0, 3);

      return {
        id: `attendance-${Date.now()}`,
        type: 'attendance',
        priority: 'high',
        title: 'Attendance Drop Detected',
        message: `Attendance dropped below 70% in ${schoolsWithDrops.length} school${schoolsWithDrops.length > 1 ? 's' : ''}. Top concern: ${top3.map(s => s.schoolName).join(', ')}`,
        details: {
          affectedSchools: schoolsWithDrops.length,
          schools: top3,
          averageAttendance: Math.round(schoolsWithDrops.reduce((sum, s) => sum + s.avgAttendance, 0) / schoolsWithDrops.length)
        },
        recommendedActions: [
          'Send attendance reminder notifications to parents',
          'Contact school administrators to investigate causes',
          'Review engagement metrics for affected schools'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error getting attendance insight:', error);
  }
  return null;
}

// Assignment Completion Insight
async function getAssignmentInsight(currentStart, currentEnd) {
  try {
    const db = mongoose.connection.db;
    
    // Get assignment completion rates by class/grade
    const assignments = await ActivityLog.aggregate([
      { $match: {
        activityType: { $in: ['assignment_created', 'assignment_submitted', 'assignment_graded'] },
        timestamp: { $gte: currentStart, $lte: currentEnd }
      }},
      { $group: {
        _id: {
          type: '$activityType',
          class: '$metadata.class',
          grade: '$metadata.grade'
        },
        count: { $sum: 1 }
      }}
    ]);

    // Find classes with low completion rates
    const classStats = {};
    assignments.forEach(a => {
      const key = `${a._id.class || a._id.grade || 'Unknown'}`;
      if (!classStats[key]) {
        classStats[key] = { created: 0, submitted: 0, graded: 0 };
      }
      if (a._id.type === 'assignment_created') classStats[key].created += a.count;
      if (a._id.type === 'assignment_submitted') classStats[key].submitted += a.count;
      if (a._id.type === 'assignment_graded') classStats[key].graded += a.count;
    });

    const lowCompletion = Object.entries(classStats)
      .filter(([_, stats]) => stats.created > 0)
      .map(([className, stats]) => ({
        className,
        completionRate: stats.created > 0 ? Math.round((stats.submitted / stats.created) * 100) : 0,
        created: stats.created,
        submitted: stats.submitted
      }))
      .filter(c => c.completionRate < 60)
      .sort((a, b) => a.completionRate - b.completionRate);

    if (lowCompletion.length > 0) {
      const topConcern = lowCompletion[0];
      return {
        id: `assignment-${Date.now()}`,
        type: 'assignment',
        priority: 'high',
        title: 'Low Assignment Completion Detected',
        message: `${topConcern.className} needs teacher support; assignment completion is ${topConcern.completionRate}% (${topConcern.submitted}/${topConcern.created} completed)`,
        details: {
          affectedClasses: lowCompletion.length,
          classes: lowCompletion.slice(0, 5),
          averageCompletionRate: Math.round(lowCompletion.reduce((sum, c) => sum + c.completionRate, 0) / lowCompletion.length)
        },
        recommendedActions: [
          `Reach out to ${topConcern.className} teacher for support`,
          'Send reminder notifications to students',
          'Review assignment difficulty and provide additional resources',
          'Consider extending deadlines for struggling students'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error getting assignment insight:', error);
  }
  return null;
}

// Engagement Insight
async function getEngagementInsight(currentStart, currentEnd, previousStart, previousEnd) {
  try {
    // Get user engagement trends
    const currentEngagement = await ActivityLog.countDocuments({
      timestamp: { $gte: currentStart, $lte: currentEnd }
    });

    const previousEngagement = await ActivityLog.countDocuments({
      timestamp: { $gte: previousStart, $lte: previousEnd }
    });

    const change = previousEngagement > 0 
      ? ((currentEngagement - previousEngagement) / previousEngagement) * 100 
      : 0;

    if (Math.abs(change) > 15) {
      return {
        id: `engagement-${Date.now()}`,
        type: 'engagement',
        priority: change < -15 ? 'high' : 'medium',
        title: change < 0 ? 'Engagement Decline Detected' : 'Engagement Increase',
        message: `Platform engagement ${change < 0 ? 'decreased' : 'increased'} by ${Math.abs(change).toFixed(1)}% compared to previous period`,
        details: {
          currentEngagement,
          previousEngagement,
          change: Math.round(change),
          trend: change < 0 ? 'declining' : 'improving'
        },
        recommendedActions: change < 0 ? [
          'Launch re-engagement campaign',
          'Send personalized content recommendations',
          'Highlight new features and updates',
          'Offer incentives for active users'
        ] : [
          'Maintain current engagement strategies',
          'Identify successful engagement drivers',
          'Scale positive initiatives to other segments'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error getting engagement insight:', error);
  }
  return null;
}

// School Performance Insight
async function getSchoolPerformanceInsight(currentStart, currentEnd, previousStart, previousEnd) {
  try {
    const schools = await Organization.find({ type: 'school', isActive: true }).limit(20);
    
    const schoolPerformance = [];
    for (const school of schools) {
      const students = await mongoose.connection.db.collection('schoolstudents').countDocuments({
        tenantId: school.tenantId,
        isActive: true
      });

      const recentActivity = await ActivityLog.countDocuments({
        timestamp: { $gte: currentStart, $lte: currentEnd }
      });

      if (students > 0) {
        const activityPerStudent = recentActivity / students;
        schoolPerformance.push({
          schoolId: school._id,
          schoolName: school.name,
          tenantId: school.tenantId,
          students,
          activityPerStudent
        });
      }
    }

    const lowPerforming = schoolPerformance
      .filter(s => s.activityPerStudent < 5)
      .sort((a, b) => a.activityPerStudent - b.activityPerStudent)
      .slice(0, 5);

    if (lowPerforming.length > 0) {
      return {
        id: `school-performance-${Date.now()}`,
        type: 'school_performance',
        priority: 'medium',
        title: 'Low-Performing Schools Detected',
        message: `${lowPerforming.length} school${lowPerforming.length > 1 ? 's' : ''} showing low activity rates. Consider outreach: ${lowPerforming.map(s => s.schoolName).join(', ')}`,
        details: {
          affectedSchools: lowPerforming.length,
          schools: lowPerforming
        },
        recommendedActions: [
          'Schedule check-in call with school administrators',
          'Offer additional training and support resources',
          'Extend trial period if applicable',
          'Send usage tips and best practices'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error getting school performance insight:', error);
  }
  return null;
}

// Student Activity Insight
async function getStudentActivityInsight(currentStart, currentEnd, previousStart, previousEnd) {
  try {
    const currentActive = await User.countDocuments({
      role: { $in: ['student', 'school_student'] },
      lastActiveAt: { $gte: currentStart, $lte: currentEnd }
    });

    const previousActive = await User.countDocuments({
      role: { $in: ['student', 'school_student'] },
      lastActiveAt: { $gte: previousStart, $lte: previousEnd }
    });

    const change = previousActive > 0
      ? ((currentActive - previousActive) / previousActive) * 100
      : 0;

    if (Math.abs(change) > 10) {
      return {
        id: `student-activity-${Date.now()}`,
        type: 'student_activity',
        priority: change < -10 ? 'high' : 'medium',
        title: change < 0 ? 'Student Activity Decline' : 'Student Activity Increase',
        message: `Active student count ${change < 0 ? 'dropped' : 'increased'} by ${Math.abs(change).toFixed(1)}% (${currentActive} vs ${previousActive} active students)`,
        details: {
          currentActive,
          previousActive,
          change: Math.round(change),
          trend: change < 0 ? 'declining' : 'improving'
        },
        recommendedActions: change < 0 ? [
          'Send re-engagement emails to inactive students',
          'Launch gamification challenges',
          'Highlight peer achievements and milestones',
          'Offer rewards for returning students'
        ] : [
          'Continue current engagement strategies',
          'Analyze what drove the increase',
          'Replicate successful initiatives'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error getting student activity insight:', error);
  }
  return null;
}

// Teacher Workload Insight
async function getTeacherWorkloadInsight(currentStart, currentEnd) {
  try {
    const teachers = await User.find({
      role: { $in: ['school_teacher', 'teacher'] },
      isActive: true
    }).limit(50);

    const teacherWorkloads = await Promise.all(teachers.map(async (teacher) => {
      const messages = await ActivityLog.countDocuments({
        userId: teacher._id,
        activityType: { $in: ['message_sent', 'message_received'] },
        timestamp: { $gte: currentStart, $lte: currentEnd }
      });

      const assignments = await ActivityLog.countDocuments({
        userId: teacher._id,
        activityType: { $in: ['assignment_created', 'assignment_graded'] },
        timestamp: { $gte: currentStart, $lte: currentEnd }
      });

      return {
        teacherId: teacher._id,
        teacherName: teacher.name || teacher.fullName,
        email: teacher.email,
        workload: messages + (assignments * 2) // Weighted score
      };
    }));

    const highWorkload = teacherWorkloads
      .filter(t => t.workload > 100)
      .sort((a, b) => b.workload - a.workload)
      .slice(0, 5);

    if (highWorkload.length > 0) {
      return {
        id: `teacher-workload-${Date.now()}`,
        type: 'teacher_workload',
        priority: 'medium',
        title: 'High Teacher Workload Detected',
        message: `${highWorkload.length} teacher${highWorkload.length > 1 ? 's' : ''} showing signs of high workload. Consider providing support: ${highWorkload.map(t => t.teacherName).join(', ')}`,
        details: {
          affectedTeachers: highWorkload.length,
          teachers: highWorkload
        },
        recommendedActions: [
          'Offer additional teaching resources and materials',
          'Consider redistributing workload if possible',
          'Provide administrative support',
          'Schedule check-in to assess needs'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error getting teacher workload insight:', error);
  }
  return null;
}

// Detect anomalies in platform data
export const detectAnomalies = async (filters = {}) => {
  try {
    const { timeRange = 'week' } = filters;
    
    const now = new Date();
    let startDate, endDate;
    
    switch (timeRange) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date();
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        endDate = new Date();
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
    }

    const anomalies = [];

    // 1. Unusual login patterns
    const loginAnomaly = await detectLoginAnomalies(startDate, endDate);
    if (loginAnomaly) anomalies.push(loginAnomaly);

    // 2. Sudden drops in activity
    const activityAnomaly = await detectActivityAnomalies(startDate, endDate);
    if (activityAnomaly) anomalies.push(activityAnomaly);

    // 3. Unusual error rates
    const errorAnomaly = await detectErrorAnomalies(startDate, endDate);
    if (errorAnomaly) anomalies.push(errorAnomaly);

    // 4. Resource usage spikes
    const resourceAnomaly = await detectResourceAnomalies(startDate, endDate);
    if (resourceAnomaly) anomalies.push(resourceAnomaly);

    return {
      anomalies,
      total: anomalies.length,
      critical: anomalies.filter(a => a.severity === 'critical').length,
      high: anomalies.filter(a => a.severity === 'high').length,
      detectedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    throw error;
  }
};

// Detect login anomalies
async function detectLoginAnomalies(startDate, endDate) {
  try {
    // Check for unusual login patterns (e.g., sudden drop or spike)
    const logins = await ActivityLog.find({
      activityType: 'login',
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: 1 });

    if (logins.length === 0) return null;

    // Group by day
    const loginsByDay = {};
    logins.forEach(login => {
      const day = login.timestamp.toISOString().split('T')[0];
      loginsByDay[day] = (loginsByDay[day] || 0) + 1;
    });

    const values = Object.values(loginsByDay);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length);

    // Find days with significant deviation (more than 2 standard deviations)
    const anomalies = Object.entries(loginsByDay).filter(([_, count]) => 
      Math.abs(count - avg) > (2 * stdDev)
    );

    if (anomalies.length > 0) {
      return {
        id: `login-anomaly-${Date.now()}`,
        type: 'login',
        severity: 'high',
        title: 'Unusual Login Pattern Detected',
        description: `Detected ${anomalies.length} day${anomalies.length > 1 ? 's' : ''} with abnormal login activity`,
        details: {
          anomalies: anomalies.map(([date, count]) => ({
            date,
            count,
            deviation: Math.round(((count - avg) / avg) * 100)
          })),
          averageLogins: Math.round(avg)
        },
        recommendedActions: [
          'Investigate login patterns for security concerns',
          'Check for potential account breaches',
          'Review authentication logs',
          'Notify affected users if suspicious activity detected'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error detecting login anomalies:', error);
  }
  return null;
}

// Detect activity anomalies
async function detectActivityAnomalies(startDate, endDate) {
  try {
    const activities = await ActivityLog.find({
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: 1 });

    if (activities.length === 0) return null;

    // Group by hour
    const activitiesByHour = {};
    activities.forEach(activity => {
      const hour = activity.timestamp.toISOString().substring(0, 13) + ':00:00';
      activitiesByHour[hour] = (activitiesByHour[hour] || 0) + 1;
    });

    const values = Object.values(activitiesByHour);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Check for sudden drops (more than 50% drop)
    if (min < avg * 0.5) {
      return {
        id: `activity-drop-${Date.now()}`,
        type: 'activity',
        severity: 'high',
        title: 'Sudden Activity Drop Detected',
        description: `Activity dropped to ${Math.round((min / avg) * 100)}% of average. Possible system issue or user engagement problem.`,
        details: {
          averageActivity: Math.round(avg),
          minimumActivity: min,
          dropPercentage: Math.round(((avg - min) / avg) * 100)
        },
        recommendedActions: [
          'Check system health and performance',
          'Review recent platform updates or changes',
          'Investigate potential technical issues',
          'Send user engagement notifications if needed'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error detecting activity anomalies:', error);
  }
  return null;
}

// Detect error anomalies
async function detectErrorAnomalies(startDate, endDate) {
  try {
    const errors = await ActivityLog.countDocuments({
      activityType: 'error',
      timestamp: { $gte: startDate, $lte: endDate }
    });

    const totalActivities = await ActivityLog.countDocuments({
      timestamp: { $gte: startDate, $lte: endDate }
    });

    const errorRate = totalActivities > 0 ? (errors / totalActivities) * 100 : 0;

    if (errorRate > 5) {
      return {
        id: `error-anomaly-${Date.now()}`,
        type: 'error',
        severity: 'critical',
        title: 'High Error Rate Detected',
        description: `Error rate of ${errorRate.toFixed(2)}% detected. This is above normal threshold (5%).`,
        details: {
          totalErrors: errors,
          totalActivities,
          errorRate: errorRate.toFixed(2)
        },
        recommendedActions: [
          'Immediately review error logs',
          'Check system health and resource usage',
          'Investigate recent code deployments',
          'Notify development team',
          'Consider temporary system maintenance if needed'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error detecting error anomalies:', error);
  }
  return null;
}

// Detect resource anomalies
async function detectResourceAnomalies(startDate, endDate) {
  try {
    // This would typically check server resources, but we'll simulate with activity patterns
    const peakActivity = await ActivityLog.aggregate([
      { $match: { timestamp: { $gte: startDate, $lte: endDate }}},
      { $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp' }
        },
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 }},
      { $limit: 1 }
    ]);

    if (peakActivity.length > 0 && peakActivity[0].count > 10000) {
      return {
        id: `resource-anomaly-${Date.now()}`,
        type: 'resource',
        severity: 'medium',
        title: 'Resource Usage Spike Detected',
        description: `Peak activity of ${peakActivity[0].count} requests detected in a single hour. Consider scaling resources.`,
        details: {
          peakHour: peakActivity[0]._id,
          peakRequests: peakActivity[0].count
        },
        recommendedActions: [
          'Monitor server resources closely',
          'Consider auto-scaling if available',
          'Review and optimize database queries',
          'Check for potential DDoS or abuse'
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error detecting resource anomalies:', error);
  }
  return null;
}

// Generate action recommendations based on insights and anomalies
export const generateRecommendations = async (filters = {}) => {
  try {
    const [insights, anomalies] = await Promise.all([
      generateSmartInsights(filters),
      detectAnomalies(filters)
    ]);

    const recommendations = [];

    // Process insights into actionable recommendations
    insights.insights.forEach(insight => {
      insight.recommendedActions?.forEach((action, index) => {
        recommendations.push({
          id: `rec-${insight.id}-${index}`,
          insightId: insight.id,
          type: insight.type,
          priority: insight.priority,
          action: action,
          category: getActionCategory(action),
          autoExecutable: isAutoExecutable(action),
          timestamp: new Date().toISOString()
        });
      });
    });

    // Process anomalies into recommendations
    anomalies.anomalies.forEach(anomaly => {
      anomaly.recommendedActions?.forEach((action, index) => {
        recommendations.push({
          id: `rec-${anomaly.id}-${index}`,
          anomalyId: anomaly.id,
          type: anomaly.type,
          priority: anomaly.severity,
          action: action,
          category: getActionCategory(action),
          autoExecutable: isAutoExecutable(action),
          timestamp: new Date().toISOString()
        });
      });
    });

    // Sort by priority
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    recommendations.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));

    return {
      recommendations,
      total: recommendations.length,
      autoExecutable: recommendations.filter(r => r.autoExecutable).length,
      manual: recommendations.filter(r => !r.autoExecutable).length,
      byCategory: groupByCategory(recommendations),
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
};

// Helper functions
function getActionCategory(action) {
  const lower = action.toLowerCase();
  if (lower.includes('send') || lower.includes('notification') || lower.includes('email')) return 'communication';
  if (lower.includes('extend') || lower.includes('trial')) return 'trial';
  if (lower.includes('assign') || lower.includes('mentor')) return 'assignment';
  if (lower.includes('review') || lower.includes('investigate') || lower.includes('check')) return 'investigation';
  if (lower.includes('offer') || lower.includes('provide')) return 'support';
  return 'general';
}

function isAutoExecutable(action) {
  const lower = action.toLowerCase();
  return lower.includes('send reminder') || 
         lower.includes('send notification') || 
         lower.includes('auto-assign') ||
         lower.includes('extend trial');
}

function groupByCategory(recommendations) {
  const grouped = {};
  recommendations.forEach(rec => {
    if (!grouped[rec.category]) {
      grouped[rec.category] = [];
    }
    grouped[rec.category].push(rec);
  });
  return grouped;
}

export default {
  generateSmartInsights,
  detectAnomalies,
  generateRecommendations
};

