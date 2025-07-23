// utils/educatorActivityTracker.js
import ActivityLog from '../models/ActivityLog.js';

/**
 * Middleware to track educator login activity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const trackEducatorLogin = async (req, res, next) => {
  try {
    // Only track if user is an educator
    if (req.user && req.user.role === 'educator') {
      const { _id: userId } = req.user;
      
      // Create activity log entry
      await ActivityLog.create({
        userId,
        activityType: 'login',
        description: 'Educator logged in',
        details: {
          method: 'credentials',
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      // Emit socket event for real-time tracking if socket.io is available
      if (req.app.get('io')) {
        const io = req.app.get('io');
        
        // Emit to admin room for real-time tracking
        io.to('admin-room').emit('educator:activity', {
          userId,
          name: req.user.name,
          email: req.user.email,
          activityType: 'login',
          timestamp: new Date(),
        });
        
        // Also emit to educator's personal tracking room
        io.to(`educator-tracking-${userId}`).emit('educator:activity', {
          userId,
          name: req.user.name,
          email: req.user.email,
          activityType: 'login',
          timestamp: new Date(),
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Error tracking educator login:', error);
    // Don't block the login process if tracking fails
    next();
  }
};

/**
 * Track any educator activity
 * @param {Object} user - User object
 * @param {String} activityType - Type of activity
 * @param {String} description - Description of activity
 * @param {Object} details - Additional details
 * @param {Object} req - Express request object (optional)
 * @param {Object} io - Socket.io instance (optional)
 */
export const trackEducatorActivity = async (user, activityType, description, details = {}, req = null, io = null) => {
  try {
    if (!user || user.role !== 'educator') return;
    
    const userId = user._id;
    
    // Create activity log entry
    const activity = await ActivityLog.create({
      userId,
      activityType,
      description,
      details,
      ipAddress: req ? req.ip : null,
      userAgent: req ? req.headers['user-agent'] : null,
      pageUrl: req && req.originalUrl ? req.originalUrl : null,
    });
    
    // Emit socket event for real-time tracking if socket.io is available
    if (io) {
      // Emit to admin room for real-time tracking
      io.to('admin-room').emit('educator:activity', {
        userId,
        name: user.name,
        email: user.email,
        activityType,
        description,
        timestamp: activity.timestamp,
      });
      
      // Also emit to educator's personal tracking room
      io.to(`educator-tracking-${userId}`).emit('educator:activity', {
        userId,
        name: user.name,
        email: user.email,
        activityType,
        description,
        timestamp: activity.timestamp,
      });
    }
    
    return activity;
  } catch (error) {
    console.error('Error tracking educator activity:', error);
    return null;
  }
};