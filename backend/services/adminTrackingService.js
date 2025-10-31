import AdminActivityTracker from '../models/AdminActivityTracker.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import ChatMessage from '../models/ChatMessage.js';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import ActivityLog from '../models/ActivityLog.js';
import mongoose from 'mongoose';

// Get platform overview with key metrics
export const getPlatformOverview = async () => {
  try {
    const [userCounts, recentActivity, activeUsers, schoolStats] = await Promise.all([
      // User distribution by role
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      
      // Recent activity (last 24 hours)
      AdminActivityTracker.countDocuments({
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      
      // Active users (last 24 hours)
      ActivityLog.distinct('userId', {
        activityType: 'login',
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      
      // School statistics
      Organization.aggregate([
        { $group: { 
          _id: null, 
          totalSchools: { $sum: 1 },
          activeSchools: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } }
        }}
      ])
    ]);

    // Process user counts
    const userDistribution = {};
    userCounts.forEach(item => {
      userDistribution[item._id] = item.count;
    });

    // Count individual vs school students
    const individualStudents = await User.countDocuments({ 
      role: 'student',
      schoolId: { $exists: false }
    });
    const schoolStudents = await User.countDocuments({ 
      role: 'school_student'
    });

    // Get parent linkage stats
    const studentsWithParents = await User.countDocuments({
      $or: [
        { role: 'student', 'linkedIds.parentIds': { $exists: true, $ne: [] } },
        { role: 'school_student', 'linkedIds.parentIds': { $exists: true, $ne: [] } }
      ]
    });
    const studentsWithoutParents = (individualStudents + schoolStudents) - studentsWithParents;

    const schoolData = schoolStats[0] || { totalSchools: 0, activeSchools: 0 };

    return {
      userDistribution,
      totalUsers: Object.values(userDistribution).reduce((a, b) => a + b, 0),
      individualStudents,
      schoolStudents,
      totalStudents: individualStudents + schoolStudents,
      studentsWithParents,
      studentsWithoutParents,
      recentActivity,
      activeUsers: activeUsers.length,
      schools: schoolData
    };
  } catch (error) {
    console.error('Error getting platform overview:', error);
    throw error;
  }
};

// Get communication flow patterns
export const getUserCommunicationFlow = async (filters = {}) => {
  try {
    const { startDate, endDate, limit = 100 } = filters;
    
    let matchStage = {};
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }

    // Get communication patterns
    const communications = await AdminActivityTracker.aggregate([
      { $match: { activityType: 'communication', ...matchStage } },
      {
        $project: {
          source: '$sourceDashboard',
          target: '$targetDashboard',
          userRole: '$userRole',
          userName: '$userName',
          communicationType: '$communicationType',
          timestamp: 1
        }
      },
      { $sort: { timestamp: -1 } },
      { $limit: limit }
    ]);

    // Group by communication types
    const byType = await AdminActivityTracker.aggregate([
      { $match: { activityType: 'communication', ...matchStage } },
      {
        $group: {
          _id: '$communicationType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent chat messages from ChatMessage model
    const recentChatMessages = await ChatMessage.find({
      ...(startDate && endDate ? {
        timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }
      } : {})
    })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(50);

    // Get recent messages from Message model
    const recentMessages = await Message.find({
      ...(startDate && endDate ? {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      } : {})
    })
      .populate('senderId', 'name email role')
      .populate({
        path: 'chatId',
        populate: {
          path: 'participants.userId',
          select: 'name email role'
        }
      })
      .sort({ createdAt: -1 })
      .limit(50);

    // Combine and format both message sources
    const allMessages = [
      ...recentChatMessages.map(msg => ({
        from: msg.senderId?.name || 'Unknown',
        to: msg.receiverId?.name || 'Unknown',
        fromRole: msg.senderId?.role || 'unknown',
        toRole: msg.receiverId?.role || 'unknown',
        fromEmail: msg.senderId?.email || '',
        toEmail: msg.receiverId?.email || '',
        message: msg.message,
        timestamp: msg.timestamp,
        _id: msg._id,
        source: 'ChatMessage'
      })),
      ...recentMessages.map(msg => {
        // Find the recipient (someone other than the sender) from chat participants
        const recipient = msg.chatId?.participants?.find(p => 
          p.userId && p.userId._id && p.userId._id.toString() !== msg.senderId._id.toString()
        );
        
        return {
          from: msg.senderId?.name || 'Unknown',
          to: recipient?.userId?.name || 'Unknown',
          fromRole: msg.senderRole || 'unknown',
          toRole: recipient?.userId?.role || recipient?.role || 'unknown',
          fromEmail: msg.senderId?.email || '',
          toEmail: recipient?.userId?.email || '',
          message: msg.content,
          timestamp: msg.createdAt,
          _id: msg._id,
          source: 'Message'
        };
      })
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);

    return {
      communications,
      byType,
      recentChatMessages: allMessages,
      totalMessages: allMessages.length
    };
  } catch (error) {
    console.error('Error getting communication flow:', error);
    throw error;
  }
};

// Get student distribution stats
export const getStudentDistribution = async () => {
  try {
    const stats = await User.aggregate([
      {
        $match: {
          $or: [{ role: 'student' }, { role: 'school_student' }]
        }
      },
      {
        $group: {
          _id: '$role',
          total: { $sum: 1 },
          withParents: {
            $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ['$linkedIds.parentIds', []] } }, 0] }, 1, 0] }
          }
        }
      }
    ]);

    return stats;
  } catch (error) {
    console.error('Error getting student distribution:', error);
    throw error;
  }
};

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const users = await User.find({ role })
      .select('name email role phone linkedIds createdAt')
      .populate({
        path: 'linkedIds.parentIds',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 });

    return users;
  } catch (error) {
    console.error('Error getting users by role:', error);
    throw error;
  }
};

// Get user details by ID
export const getUserDetails = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'linkedIds.parentIds',
        select: 'name email phone'
      });

    return user;
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
};

// Get parent linkage statistics
export const getParentLinkageStats = async () => {
  try {
    const stats = await User.aggregate([
      {
        $match: {
          $or: [{ role: 'student' }, { role: 'school_student' }]
        }
      },
      {
        $project: {
          hasParents: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ['$linkedIds.parentIds', []] } }, 0] },
              1, 0
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          linked: { $sum: '$hasParents' },
          unlinked: { $sum: { $subtract: [1, '$hasParents'] } }
        }
      }
    ]);

    return stats[0] || { total: 0, linked: 0, unlinked: 0 };
  } catch (error) {
    console.error('Error getting parent linkage stats:', error);
    throw error;
  }
};

// Get real-time activity feed
export const getRealTimeActivity = async (limit = 100) => {
  try {
    const activities = await AdminActivityTracker.find({
      isRealTime: true
    })
      .populate('userId', 'name email role')
      .populate('participants.userId', 'name role')
      .sort({ timestamp: -1 })
      .limit(limit);

    return activities;
  } catch (error) {
    console.error('Error getting real-time activity:', error);
    throw error;
  }
};

// Get activity by type with filters
export const getActivityByType = async (filters = {}) => {
  try {
    const { 
      activityType, 
      sourceDashboard, 
      targetDashboard, 
      startDate, 
      endDate, 
      userId,
      page = 1, 
      limit = 50 
    } = filters;

    let matchStage = {};
    if (activityType) matchStage.activityType = activityType;
    if (sourceDashboard) matchStage.sourceDashboard = sourceDashboard;
    if (targetDashboard) matchStage.targetDashboard = targetDashboard;
    if (userId) matchStage.userId = new mongoose.Types.ObjectId(userId);
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [activities, total] = await Promise.all([
      AdminActivityTracker.find(matchStage)
        .populate('userId', 'name email role')
        .populate('participants.userId', 'name role')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AdminActivityTracker.countDocuments(matchStage)
    ]);

    return {
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };
  } catch (error) {
    console.error('Error getting activity by type:', error);
    throw error;
  }
};

// Get dashboard analytics
export const getDashboardAnalytics = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    
    let dateMatch = {};
    if (startDate || endDate) {
      dateMatch.timestamp = {};
      if (startDate) dateMatch.timestamp.$gte = new Date(startDate);
      if (endDate) dateMatch.timestamp.$lte = new Date(endDate);
    }

    // Get activity by dashboard
    const byDashboard = await AdminActivityTracker.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: '$sourceDashboard',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          dashboard: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          _id: 0
        }
      }
    ]);

    // Get activity by type
    const byType = await AdminActivityTracker.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get hourly activity pattern
    const hourlyActivity = await AdminActivityTracker.aggregate([
      { $match: dateMatch },
      {
        $project: {
          hour: { $hour: '$timestamp' }
        }
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top active users
    const topUsers = await AdminActivityTracker.aggregate([
      { $match: dateMatch },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }},
      { $unwind: '$user' },
      { $project: {
        userId: '$_id',
        name: '$user.name',
        email: '$user.email',
        role: '$user.role',
        activityCount: '$count',
        _id: 0
      }}
    ]);

    // Get recent activities
    const recentActivities = await AdminActivityTracker.find(dateMatch)
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(20);

    // Get daily activity trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyTrend = await AdminActivityTracker.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo }, ...dateMatch } },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        }
      },
      { $group: { _id: '$date', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get activity source-target patterns
    const communicationPatterns = await AdminActivityTracker.aggregate([
      { $match: { activityType: 'communication', ...dateMatch } },
      { $group: {
        _id: {
          source: '$sourceDashboard',
          target: '$targetDashboard'
        },
        count: { $sum: 1 }
      }},
      { $project: {
        source: '$_id.source',
        target: '$_id.target',
        count: 1,
        _id: 0
      }},
      { $sort: { count: -1 } }
    ]);

    return {
      byDashboard,
      byType,
      hourlyActivity,
      topUsers,
      recentActivities,
      dailyTrend,
      communicationPatterns
    };
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    throw error;
  }
};

// Export activity report
export const exportActivityReport = async (filters = {}) => {
  try {
    const activities = await AdminActivityTracker.find({
      ...(filters.startDate && filters.endDate ? {
        timestamp: { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) }
      } : {})
    })
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(10000); // Max 10k records for export

    return activities;
  } catch (error) {
    console.error('Error exporting activity report:', error);
    throw error;
  }
};

export default {
  getPlatformOverview,
  getUserCommunicationFlow,
  getStudentDistribution,
  getParentLinkageStats,
  getRealTimeActivity,
  getActivityByType,
  getDashboardAnalytics,
  exportActivityReport,
  getUsersByRole,
  getUserDetails
};

