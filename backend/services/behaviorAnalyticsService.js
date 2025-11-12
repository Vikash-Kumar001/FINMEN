import User from '../models/User.js';
import Organization from '../models/Organization.js';
import ActivityLog from '../models/ActivityLog.js';
import ChatMessage from '../models/ChatMessage.js';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import mongoose from 'mongoose';

// Behavior Flow Analytics - Track how users move through the app
export const getBehaviorFlow = async (filters = {}) => {
  try {
    const { role, startDate, endDate, limit = 50 } = filters;
    
    let dateFilter = {};
    const hasDateFilter = startDate || endDate;
    if (hasDateFilter) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }

    const roleFilter = role ? { role } : {};
    
    // Get user navigation patterns
    const navigationPatterns = await ActivityLog.aggregate([
      { $match: { 
        activityType: { $in: ['navigation', 'page_view', 'click'] },
        ...(hasDateFilter ? dateFilter : {})
      }},
      { $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }},
      { $unwind: '$user' },
      { $match: { 'user.role': roleFilter.role || { $exists: true } }},
      { $group: {
        _id: {
          from: '$metadata.from',
          to: '$metadata.to',
          role: '$user.role'
        },
        count: { $sum: 1 },
        avgTime: { $avg: '$metadata.duration' }
      }},
      { $sort: { count: -1 }},
      { $limit: limit }
    ]);

    // Get feature usage frequency
    const featureUsage = await ActivityLog.aggregate([
      { $match: {
        activityType: 'feature_usage',
        ...(hasDateFilter ? dateFilter : {})
      }},
      { $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }},
      { $unwind: '$user' },
      { $match: { 'user.role': roleFilter.role || { $exists: true } }},
      { $group: {
        _id: {
          feature: '$metadata.feature',
          role: '$user.role'
        },
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }},
      { $project: {
        feature: '$_id.feature',
        role: '$_id.role',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' }
      }},
      { $sort: { count: -1 }}
    ]);

    // Get session flows
    const sessionFlows = await ActivityLog.aggregate([
      { $match: {
        activityType: 'session',
        ...(hasDateFilter ? dateFilter : {})
      }},
      { $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }},
      { $unwind: '$user' },
      { $match: { 'user.role': roleFilter.role || { $exists: true } }},
      { $group: {
        _id: '$userId',
        sessions: { $sum: 1 },
        avgDuration: { $avg: '$metadata.duration' },
        pages: { $addToSet: '$metadata.page' }
      }},
      { $project: {
        userId: '$_id',
        sessions: 1,
        avgDuration: 1,
        pagesVisited: { $size: '$pages' }
      }}
    ]);

    return {
      navigationPatterns,
      featureUsage,
      sessionFlows: sessionFlows.slice(0, limit),
      totalFlows: navigationPatterns.length
    };
  } catch (error) {
    console.error('Error getting behavior flow:', error);
    throw error;
  }
};

// Parent Engagement Scoring
export const getParentEngagementScore = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    
    let dateFilter = {};
    const hasDateFilter = startDate || endDate;
    if (hasDateFilter) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }

    // Get all parents
    const parents = await User.find({ role: { $in: ['parent', 'school_parent'] } });
    
    const engagementScores = await Promise.all(parents.map(async (parent) => {
      const [loginCount, messageCount, chatCount, profileViews, childChecks] = await Promise.all([
        // Login frequency
        ActivityLog.countDocuments({
          userId: parent._id,
          activityType: 'login',
          ...(hasDateFilter ? { timestamp: dateFilter } : {})
        }),
        // Messages sent
        Message.countDocuments({
          senderId: parent._id,
          ...(hasDateFilter ? { createdAt: dateFilter } : {})
        }),
        // Chats participated
        Chat.countDocuments({
          participants: parent._id,
          ...(hasDateFilter ? { updatedAt: dateFilter } : {})
        }),
        // Profile views (checking child progress)
        ActivityLog.countDocuments({
          userId: parent._id,
          activityType: { $in: ['page_view', 'profile_view'] },
          'metadata.page': { $in: ['child-analytics', 'child-progress', 'parent-child'] },
          ...(hasDateFilter ? { timestamp: dateFilter } : {})
        }),
        // Direct child checks
        ActivityLog.countDocuments({
          userId: parent._id,
          activityType: 'child_progress_check',
          ...(hasDateFilter ? { timestamp: dateFilter } : {})
        })
      ]);

      // Calculate engagement score (0-100)
      const score = Math.min(100, 
        (loginCount * 10) +
        (messageCount * 5) +
        (chatCount * 15) +
        (profileViews * 3) +
        (childChecks * 20)
      );

      // Engagement level
      let level = 'Low';
      if (score >= 70) level = 'High';
      else if (score >= 40) level = 'Medium';

      return {
        parentId: parent._id,
        parentName: parent.name || parent.fullName,
        email: parent.email,
        score,
        level,
        metrics: {
          loginCount,
          messageCount,
          chatCount,
          profileViews,
          childChecks
        },
        lastActive: parent.lastActiveAt || parent.updatedAt
      };
    }));

    // Sort by score descending
    engagementScores.sort((a, b) => b.score - a.score);

    // Calculate averages
    const avgScore = engagementScores.length > 0
      ? engagementScores.reduce((sum, p) => sum + p.score, 0) / engagementScores.length
      : 0;

    const highEngagement = engagementScores.filter(p => p.level === 'High').length;
    const mediumEngagement = engagementScores.filter(p => p.level === 'Medium').length;
    const lowEngagement = engagementScores.filter(p => p.level === 'Low').length;

    return {
      scores: engagementScores,
      summary: {
        totalParents: engagementScores.length,
        avgScore: Math.round(avgScore),
        highEngagement,
        mediumEngagement,
        lowEngagement,
        highEngagementRate: engagementScores.length > 0
          ? Math.round((highEngagement / engagementScores.length) * 100)
          : 0
      }
    };
  } catch (error) {
    console.error('Error getting parent engagement score:', error);
    throw error;
  }
};

// Teacher Workload Analytics
export const getTeacherWorkload = async (filters = {}) => {
  try {
    const { tenantId, startDate, endDate } = filters;
    
    let dateFilter = {};
    const hasDateFilter = startDate || endDate;
    if (hasDateFilter) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }

    const teacherFilter = {
      role: { $in: ['school_teacher', 'teacher'] },
      ...(tenantId && { tenantId })
    };

    const teachers = await User.find(teacherFilter);
    
    const workloadData = await Promise.all(teachers.map(async (teacher) => {
      const [messagesSent, messagesReceived, chatsActiveCount, studentsManaged, assignmentsCreated, 
             assignmentsGraded, announcementsCreated, hoursActive] = await Promise.all([
        // Messages sent
        Message.countDocuments({
          senderId: teacher._id,
          ...(hasDateFilter ? { createdAt: dateFilter } : {})
        }),
        // Messages received
        Message.countDocuments({
          receiverId: teacher._id,
          ...(hasDateFilter ? { createdAt: dateFilter } : {})
        }),
        // Active chats
        Chat.countDocuments({
          participants: teacher._id,
          ...(hasDateFilter ? { updatedAt: dateFilter } : {})
        }),
        // Students managed (would need to query school_student collection)
        mongoose.connection.db.collection('schoolstudents').countDocuments({
          tenantId: teacher.tenantId || tenantId,
          isActive: true
        }),
        // Assignments created
        ActivityLog.countDocuments({
          userId: teacher._id,
          activityType: 'assignment_created',
          ...(hasDateFilter ? { timestamp: dateFilter } : {})
        }),
        // Assignments graded
        ActivityLog.countDocuments({
          userId: teacher._id,
          activityType: 'assignment_graded',
          ...(hasDateFilter ? { timestamp: dateFilter } : {})
        }),
        // Announcements created
        ActivityLog.countDocuments({
          userId: teacher._id,
          activityType: 'announcement_created',
          ...(hasDateFilter ? { timestamp: dateFilter } : {})
        }),
        // Calculate active hours from activity logs
        ActivityLog.aggregate([
          { $match: {
            userId: teacher._id,
            ...(hasDateFilter ? { timestamp: dateFilter } : {})
          }},
          { $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
            },
            hours: { $sum: { $divide: ['$metadata.duration', 3600000] } }
          }},
          { $group: {
            _id: null,
            totalHours: { $sum: '$hours' }
          }}
        ])
      ]);

      const totalHours = hoursActive[0]?.totalHours || 0;
      const totalMessages = messagesSent + messagesReceived;
      
      // Calculate workload score (0-100)
      const workloadScore = Math.min(100,
        (totalMessages * 0.5) +
        (chatsActiveCount * 2) +
        (assignmentsCreated * 3) +
        (assignmentsGraded * 2) +
        (announcementsCreated * 1.5) +
        (totalHours * 5)
      );

      // Workload level
      let level = 'Normal';
      if (workloadScore >= 70) level = 'High';
      else if (workloadScore >= 40) level = 'Moderate';
      else if (workloadScore < 20) level = 'Light';

      return {
        teacherId: teacher._id,
        teacherName: teacher.name || teacher.fullName,
        email: teacher.email,
        tenantId: teacher.tenantId,
        workloadScore: Math.round(workloadScore),
        level,
        metrics: {
          messagesSent,
          messagesReceived,
          totalMessages,
          chatsActive: chatsActiveCount || 0,
          studentsManaged: studentsManaged || 0,
          assignmentsCreated,
          assignmentsGraded,
          announcementsCreated,
          hoursActive: Math.round(totalHours * 10) / 10
        },
        lastActive: teacher.lastActiveAt || teacher.updatedAt
      };
    }));

    // Sort by workload score descending
    workloadData.sort((a, b) => b.workloadScore - a.workloadScore);

    // Calculate averages
    const avgWorkload = workloadData.length > 0
      ? workloadData.reduce((sum, t) => sum + t.workloadScore, 0) / workloadData.length
      : 0;

    return {
      teachers: workloadData,
      summary: {
        totalTeachers: workloadData.length,
        avgWorkload: Math.round(avgWorkload),
        highWorkload: workloadData.filter(t => t.level === 'High').length,
        moderateWorkload: workloadData.filter(t => t.level === 'Moderate').length,
        normalWorkload: workloadData.filter(t => t.level === 'Normal').length,
        lightWorkload: workloadData.filter(t => t.level === 'Light').length
      }
    };
  } catch (error) {
    console.error('Error getting teacher workload:', error);
    throw error;
  }
};

// Drop-off Detection - Identify users becoming inactive
export const getDropOffDetection = async (filters = {}) => {
  try {
    const { role, daysThreshold = 7 } = filters;
    
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    const roleFilter = role 
      ? { role }
      : { role: { $in: ['student', 'school_student', 'parent', 'school_parent', 'school_teacher'] } };

    // Get users who were active but are now inactive
    const inactiveUsers = await User.find({
      ...roleFilter,
      lastActiveAt: { $lt: thresholdDate },
      isActive: true
    }).limit(100);

    const dropOffData = await Promise.all(inactiveUsers.map(async (user) => {
      // Get last activity details
      const lastActivity = await ActivityLog.findOne({
        userId: user._id
      }).sort({ timestamp: -1 });

      // Get activity in last 30 days before drop-off
      const activity30DaysAgo = new Date(lastActivity?.timestamp || user.lastActiveAt);
      activity30DaysAgo.setDate(activity30DaysAgo.getDate() - 30);

      const activityBeforeDropOff = await ActivityLog.countDocuments({
        userId: user._id,
        timestamp: {
          $gte: activity30DaysAgo,
          $lt: lastActivity?.timestamp || user.lastActiveAt
        }
      });

      // Days since last activity
      const daysSinceLastActivity = Math.floor(
        (new Date() - new Date(lastActivity?.timestamp || user.lastActiveAt)) / (1000 * 60 * 60 * 24)
      );

      // Drop-off risk level
      let riskLevel = 'Low';
      if (daysSinceLastActivity >= 30) riskLevel = 'Critical';
      else if (daysSinceLastActivity >= 14) riskLevel = 'High';
      else if (daysSinceLastActivity >= 7) riskLevel = 'Medium';

      // Possible reasons for drop-off
      const reasons = [];
      if (activityBeforeDropOff < 5) reasons.push('Low initial engagement');
      if (!lastActivity) reasons.push('Never logged in after registration');
      if (daysSinceLastActivity > 14) reasons.push('Extended inactivity');
      if (user.role === 'student' || user.role === 'school_student') {
        const hasLowProgress = false; // Would check progress metrics
        if (hasLowProgress) reasons.push('Low progress or achievements');
      }

      return {
        userId: user._id,
        userName: user.name || user.fullName,
        email: user.email,
        role: user.role,
        daysSinceLastActivity,
        riskLevel,
        lastActivity: lastActivity?.timestamp || user.lastActiveAt,
        activityBeforeDropOff,
        possibleReasons: reasons.length > 0 ? reasons : ['Unknown'],
        accountCreated: user.createdAt
      };
    }));

    // Sort by days since last activity descending
    dropOffData.sort((a, b) => b.daysSinceLastActivity - a.daysSinceLastActivity);

    // Summary statistics
    const critical = dropOffData.filter(u => u.riskLevel === 'Critical').length;
    const high = dropOffData.filter(u => u.riskLevel === 'High').length;
    const medium = dropOffData.filter(u => u.riskLevel === 'Medium').length;
    const low = dropOffData.filter(u => u.riskLevel === 'Low').length;

    return {
      dropOffs: dropOffData,
      summary: {
        total: dropOffData.length,
        critical,
        high,
        medium,
        low,
        avgDaysInactive: dropOffData.length > 0
          ? Math.round(dropOffData.reduce((sum, u) => sum + u.daysSinceLastActivity, 0) / dropOffData.length)
          : 0
      }
    };
  } catch (error) {
    console.error('Error getting drop-off detection:', error);
    throw error;
  }
};

// Automated Churn Predictions with Early Alerts
export const getChurnPredictions = async (filters = {}) => {
  try {
    const { role, daysAhead = 30 } = filters;
    
    const roleFilter = role 
      ? { role }
      : { role: { $in: ['student', 'school_student', 'parent', 'school_parent'] } };

    const users = await User.find({
      ...roleFilter,
      isActive: true
    }).limit(500);

    const churnPredictions = await Promise.all(users.map(async (user) => {
      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [recentActivity, recentSessions, recentMessages, loginFrequency] = await Promise.all([
        ActivityLog.countDocuments({
          userId: user._id,
          timestamp: { $gte: thirtyDaysAgo }
        }),
        ActivityLog.countDocuments({
          userId: user._id,
          activityType: 'session',
          timestamp: { $gte: thirtyDaysAgo }
        }),
        Message.countDocuments({
          $or: [
            { senderId: user._id },
            { receiverId: user._id }
          ],
          createdAt: { $gte: thirtyDaysAgo }
        }),
        ActivityLog.countDocuments({
          userId: user._id,
          activityType: 'login',
          timestamp: { $gte: thirtyDaysAgo }
        })
      ]);

      // Calculate activity trend (comparing last 15 days vs previous 15 days)
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      const recentActivityCount = await ActivityLog.countDocuments({
        userId: user._id,
        timestamp: { $gte: fifteenDaysAgo }
      });

      const previousActivityCount = await ActivityLog.countDocuments({
        userId: user._id,
        timestamp: {
          $gte: thirtyDaysAgo,
          $lt: fifteenDaysAgo
        }
      });

      const activityTrend = previousActivityCount > 0
        ? ((recentActivityCount - previousActivityCount) / previousActivityCount) * 100
        : recentActivityCount > 0 ? 100 : -100;

      // Calculate churn probability (0-100)
      let churnProbability = 0;
      
      // Factors that increase churn probability
      if (recentActivity === 0) churnProbability += 40;
      else if (recentActivity < 5) churnProbability += 30;
      else if (recentActivity < 10) churnProbability += 15;

      if (recentSessions === 0) churnProbability += 25;
      else if (recentSessions < 3) churnProbability += 15;

      if (loginFrequency === 0) churnProbability += 20;
      else if (loginFrequency < 5) churnProbability += 10;

      if (activityTrend < -50) churnProbability += 20;
      else if (activityTrend < -30) churnProbability += 10;
      else if (activityTrend < -10) churnProbability += 5;

      // Days since last activity
      const daysSinceLastActivity = user.lastActiveAt
        ? Math.floor((new Date() - new Date(user.lastActiveAt)) / (1000 * 60 * 60 * 24))
        : Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));

      if (daysSinceLastActivity >= 14) churnProbability += 15;
      else if (daysSinceLastActivity >= 7) churnProbability += 10;
      else if (daysSinceLastActivity >= 3) churnProbability += 5;

      churnProbability = Math.min(100, Math.max(0, churnProbability));

      // Risk level
      let riskLevel = 'Low';
      if (churnProbability >= 70) riskLevel = 'Critical';
      else if (churnProbability >= 50) riskLevel = 'High';
      else if (churnProbability >= 30) riskLevel = 'Medium';

      // Prediction (estimated days until churn)
      let predictedDaysUntilChurn = null;
      if (churnProbability >= 70) {
        predictedDaysUntilChurn = Math.max(1, Math.round(daysSinceLastActivity * 0.5));
      } else if (churnProbability >= 50) {
        predictedDaysUntilChurn = Math.max(7, Math.round(daysSinceLastActivity * 1.5));
      } else if (churnProbability >= 30) {
        predictedDaysUntilChurn = Math.max(14, Math.round(daysSinceLastActivity * 2));
      }

      // Recommended actions
      const recommendedActions = [];
      if (churnProbability >= 70) {
        recommendedActions.push('Immediate outreach required');
        recommendedActions.push('Send re-engagement campaign');
        recommendedActions.push('Offer incentives or support');
      } else if (churnProbability >= 50) {
        recommendedActions.push('Schedule follow-up communication');
        recommendedActions.push('Highlight new features or content');
      } else if (churnProbability >= 30) {
        recommendedActions.push('Monitor activity closely');
        recommendedActions.push('Send personalized content recommendations');
      }

      return {
        userId: user._id,
        userName: user.name || user.fullName,
        email: user.email,
        role: user.role,
        churnProbability: Math.round(churnProbability),
        riskLevel,
        predictedDaysUntilChurn,
        metrics: {
          recentActivity,
          recentSessions,
          recentMessages,
          loginFrequency,
          activityTrend: Math.round(activityTrend),
          daysSinceLastActivity
        },
        recommendedActions,
        lastActive: user.lastActiveAt || user.updatedAt,
        accountCreated: user.createdAt
      };
    }));

    // Sort by churn probability descending
    churnPredictions.sort((a, b) => b.churnProbability - a.churnProbability);

    // Summary
    const critical = churnPredictions.filter(u => u.riskLevel === 'Critical').length;
    const high = churnPredictions.filter(u => u.riskLevel === 'High').length;
    const medium = churnPredictions.filter(u => u.riskLevel === 'Medium').length;
    const low = churnPredictions.filter(u => u.riskLevel === 'Low').length;

    return {
      predictions: churnPredictions,
      summary: {
        total: churnPredictions.length,
        critical,
        high,
        medium,
        low,
        avgChurnProbability: churnPredictions.length > 0
          ? Math.round(churnPredictions.reduce((sum, u) => sum + u.churnProbability, 0) / churnPredictions.length)
          : 0,
        usersRequiringAction: critical + high
      }
    };
  } catch (error) {
    console.error('Error getting churn predictions:', error);
    throw error;
  }
};

export default {
  getBehaviorFlow,
  getParentEngagementScore,
  getTeacherWorkload,
  getDropOffDetection,
  getChurnPredictions
};

