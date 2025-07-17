// controllers/adminEducatorController.js
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

/**
 * Get activities for a specific educator
 * @route GET /api/admin/educators/:id/activities
 * @access Private (Admin only)
 */
export const getEducatorActivities = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, activityType, limit = 50, page = 1 } = req.query;

    // Check if the educator exists
    const educator = await User.findOne({ _id: id, role: 'educator' });
    if (!educator) {
      return res.status(404).json({ success: false, message: 'Educator not found' });
    }

    // Build query
    const query = { userId: id };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (activityType) {
      query.activityType = activityType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get educator statistics
 * @route GET /api/admin/educators/stats
 * @access Private (Admin only)
 */
export const getEducatorStats = async (req, res, next) => {
  try {
    const totalEducators = await User.countDocuments({ role: 'educator' });
    const approvedEducators = await User.countDocuments({ role: 'educator', approvalStatus: 'approved' });
    const pendingEducators = await User.countDocuments({ role: 'educator', approvalStatus: 'pending' });
    const rejectedEducators = await User.countDocuments({ role: 'educator', approvalStatus: 'rejected' });

    // Get most active educators in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const mostActiveEducators = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo },
          // Match only educator activities
          $or: [
            { activityType: 'login' },
            { activityType: 'student_view' },
            { activityType: 'report_view' },
            { activityType: 'analytics_view' },
            { activityType: 'feedback_provided' },
          ],
        },
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $match: {
          'user.role': 'educator',
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          'user.name': 1,
          'user.email': 1,
          'user.position': 1,
          'user.lastActive': 1,
        },
      },
    ]);

    // Get activity types distribution for educators
    const activityDistribution = await ActivityLog.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $match: {
          'user.role': 'educator',
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEducators,
        approvedEducators,
        pendingEducators,
        rejectedEducators,
        mostActiveEducators,
        activityDistribution,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Export educators data as CSV
 * @route GET /api/admin/educators/export
 * @access Private (Admin only)
 */
export const exportEducatorsCSV = async (req, res, next) => {
  try {
    const educators = await User.find({ role: 'educator' })
      .select('name email position subjects approvalStatus lastActive createdAt')
      .sort({ createdAt: -1 });

    if (!educators.length) {
      return res.status(404).json({ success: false, message: 'No educators found' });
    }

    // Convert to CSV format
    const fields = ['Name', 'Email', 'Position', 'Subjects', 'Status', 'Last Active', 'Created At'];
    const rows = educators.map(edu => [
      edu.name,
      edu.email,
      edu.position || 'N/A',
      edu.subjects || 'N/A',
      edu.approvalStatus,
      edu.lastActive ? new Date(edu.lastActive).toLocaleString() : 'Never',
      new Date(edu.createdAt).toLocaleString()
    ]);

    // Create CSV content
    const csvContent = [
      fields.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=educators.csv');

    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};