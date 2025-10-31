import adminTrackingService from '../services/adminTrackingService.js';
import User from '../models/User.js';

// Get platform overview
export const getPlatformOverview = async (req, res) => {
  try {
    const data = await adminTrackingService.getPlatformOverview();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getPlatformOverview:', error);
    res.status(500).json({ success: false, message: 'Error fetching platform overview' });
  }
};

// Get user communication flow
export const getUserCommunicationFlow = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const data = await adminTrackingService.getUserCommunicationFlow({ startDate, endDate, limit });
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getUserCommunicationFlow:', error);
    res.status(500).json({ success: false, message: 'Error fetching communication flow' });
  }
};

// Get student distribution
export const getStudentDistribution = async (req, res) => {
  try {
    const data = await adminTrackingService.getStudentDistribution();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getStudentDistribution:', error);
    res.status(500).json({ success: false, message: 'Error fetching student distribution' });
  }
};

// Get parent linkage stats
export const getParentLinkageStats = async (req, res) => {
  try {
    const data = await adminTrackingService.getParentLinkageStats();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getParentLinkageStats:', error);
    res.status(500).json({ success: false, message: 'Error fetching parent linkage stats' });
  }
};

// Get real-time activity feed
export const getRealTimeActivity = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await adminTrackingService.getRealTimeActivity(parseInt(limit) || 100);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getRealTimeActivity:', error);
    res.status(500).json({ success: false, message: 'Error fetching real-time activity' });
  }
};

// Get activity by type with filters
export const getActivityByType = async (req, res) => {
  try {
    const { activityType, sourceDashboard, targetDashboard, startDate, endDate, userId, page, limit } = req.query;
    const data = await adminTrackingService.getActivityByType({
      activityType, sourceDashboard, targetDashboard, startDate, endDate, userId, page, limit
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getActivityByType:', error);
    res.status(500).json({ success: false, message: 'Error fetching activities' });
  }
};

// Get activity feed with filters and pagination
export const getActivityFeed = async (req, res) => {
  try {
    const { activityType, sourceDashboard, targetDashboard, startDate, endDate, userId, page, limit } = req.query;
    const data = await adminTrackingService.getActivityByType({
      activityType,
      sourceDashboard,
      targetDashboard,
      startDate,
      endDate,
      userId,
      page,
      limit
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getActivityFeed:', error);
    res.status(500).json({ success: false, message: 'Error fetching activity feed' });
  }
};

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await adminTrackingService.getDashboardAnalytics({ startDate, endDate });
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in getDashboardAnalytics:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
};

// Export activity report
export const exportActivityReport = async (req, res) => {
  try {
    const { startDate, endDate, format } = req.query;
    const activities = await adminTrackingService.exportActivityReport({ startDate, endDate });
    
    if (format === 'csv') {
      // CSV export implementation
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=activity-report.csv');
      // Add CSV conversion logic here
      return res.send('CSV format coming soon');
    }
    
    res.json({ success: true, data: activities, count: activities.length });
  } catch (error) {
    console.error('Error in exportActivityReport:', error);
    res.status(500).json({ success: false, message: 'Error exporting report' });
  }
};

// Get users by role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await adminTrackingService.getUsersByRole(role);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error in getUsersByRole:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

// Get user details by ID
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await adminTrackingService.getUserDetails(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    res.status(500).json({ success: false, message: 'Error fetching user details' });
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
  getUserDetails,
  getActivityFeed
};

