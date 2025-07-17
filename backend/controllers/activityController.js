import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

// Log a new activity
export const logActivity = async (req, res, next) => {
  try {
    const { activityType, description, metadata, pageUrl } = req.body;
    const userId = req.user._id;

    if (!activityType || !description) {
      throw new ErrorResponse('Activity type and description are required', 400);
    }

    const activityLog = await ActivityLog.create({
      userId,
      activityType,
      description,
      metadata: metadata || {},
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      pageUrl: pageUrl || req.headers.referer,
    });

    // Emit real-time notification to admin and educators
    const io = req.app.get('io');
    if (io) {
      // Emit to admin room
      io.to('admin-room').emit('student-activity', {
        activityLog,
        user: {
          id: req.user._id,
          name: req.user.name,
          role: req.user.role,
        },
      });

      // If the student has an assigned educator, emit to that educator's room
      if (req.user.educatorId) {
        io.to(`educator-${req.user.educatorId}`).emit('student-activity', {
          activityLog,
          user: {
            id: req.user._id,
            name: req.user.name,
            role: req.user.role,
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      data: activityLog,
    });
  } catch (err) {
    next(err);
  }
};

// Get activities for a specific user (for admin and educators)
export const getUserActivities = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, activityType, limit = 50, page = 1 } = req.query;

    // Check if the user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      throw new ErrorResponse('User not found', 404);
    }

    // Check if the requester has permission to view this user's activities
    if (req.user.role === 'educator') {
      const student = await User.findById(userId);
      if (!student || student.educatorId?.toString() !== req.user._id.toString()) {
        throw new ErrorResponse('You do not have permission to view this student\'s activities', 403);
      }
    }

    // Build query
    const query = { userId };

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

// Get my activities (for students to see their own activity)
export const getMyActivities = async (req, res, next) => {
  try {
    const { startDate, endDate, activityType, limit = 50, page = 1 } = req.query;

    // Build query
    const query = { userId: req.user._id };

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

// Get activity summary for admin dashboard
export const getActivitySummary = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Get activity counts by type
    const activityCounts = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: daysAgo },
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

    // Get activity counts by day
    const activityByDay = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get most active users
    const mostActiveUsers = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: daysAgo },
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
        $limit: 10,
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
        $project: {
          _id: 1,
          count: 1,
          'user.name': 1,
          'user.username': 1,
          'user.role': 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        activityCounts,
        activityByDay,
        mostActiveUsers,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get real-time activity stream (for admin dashboard)
export const getActivityStream = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name username role');

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};