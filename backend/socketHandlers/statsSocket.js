import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * Socket handler for admin statistics real-time interactions
 * Enables admins to view real-time statistics and analytics
 */
export const setupStatsSocket = (io, socket, user) => {
  // Admin subscribe to stats data
  socket.on('admin:stats:subscribe', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:stats:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`📊 Admin ${adminId} subscribed to stats data`);
      
      // Join admin-specific room for stats updates
      socket.join(`admin-stats-${adminId}`);
      
      // Calculate statistics
      const stats = await calculateStats();
      
      socket.emit('admin:stats:data', stats);
      
    } catch (err) {
      console.error('Error in admin:stats:subscribe:', err);
      socket.emit('admin:stats:error', { message: err.message });
    }
  });

  // Admin request stats refresh
  socket.on('admin:stats:refresh', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:stats:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`🔄 Admin ${adminId} refreshing stats data`);
      
      // Calculate fresh statistics
      const stats = await calculateStats();
      
      socket.emit('admin:stats:data', stats);
      
    } catch (err) {
      console.error('Error in admin:stats:refresh:', err);
      socket.emit('admin:stats:error', { message: err.message });
    }
  });

  // Helper function to calculate statistics
  const calculateStats = async () => {
    // Get current date and time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // User statistics
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEducators = await User.countDocuments({ role: 'educator' });
    const activeStudents = await User.countDocuments({ 
      role: 'student', 
      lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    });
    const newStudentsToday = await User.countDocuments({ 
      role: 'student', 
      createdAt: { $gte: today } 
    });
    const newStudentsThisWeek = await User.countDocuments({ 
      role: 'student', 
      createdAt: { $gte: thisWeekStart } 
    });
    const newStudentsThisMonth = await User.countDocuments({ 
      role: 'student', 
      createdAt: { $gte: thisMonthStart } 
    });
    
    // Transaction statistics
    const pendingRedemptions = await Transaction.countDocuments({ 
      type: 'redeem', 
      status: 'pending' 
    });
    const completedRedemptions = await Transaction.countDocuments({ 
      type: 'redeem', 
      status: 'approved' 
    });
    const totalRedemptionAmount = await Transaction.aggregate([
      { $match: { type: 'redeem' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Activity statistics
    const activitiesToday = await ActivityLog.countDocuments({ 
      timestamp: { $gte: today } 
    });
    const activitiesThisWeek = await ActivityLog.countDocuments({ 
      timestamp: { $gte: thisWeekStart } 
    });
    
    // Student engagement by class
    const studentsByClass = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent activity
    const recentActivity = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'name role');
    
    return {
      users: {
        totalStudents,
        totalEducators,
        activeStudents,
        newStudentsToday,
        newStudentsThisWeek,
        newStudentsThisMonth,
        studentsByClass: studentsByClass.map(item => ({
          class: item._id || 'Unassigned',
          count: item.count
        }))
      },
      transactions: {
        pendingRedemptions,
        completedRedemptions,
        totalRedemptionAmount: totalRedemptionAmount.length > 0 ? totalRedemptionAmount[0].total : 0
      },
      activity: {
        activitiesToday,
        activitiesThisWeek,
        recentActivity: recentActivity.map(activity => ({
          id: activity._id,
          type: activity.activityType,
          user: activity.userId ? {
            id: activity.userId._id,
            name: activity.userId.name,
            role: activity.userId.role
          } : null,
          details: activity.details,
          timestamp: activity.timestamp
        }))
      },
      lastUpdated: new Date()
    };
  };

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to stats
    if (user.role === 'admin') {
      socket.leave(`admin-stats-${user._id}`);
    }
  });
};