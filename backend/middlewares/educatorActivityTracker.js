import ActivityLog from '../models/ActivityLog.js';

/**
 * Middleware to track educator activities
 * This middleware should be applied to educator routes to log their activities
 */
export const trackEducatorActivity = (activityType) => {
  return async (req, res, next) => {
    // Store the original send function
    const originalSend = res.send;
    
    // Only track for educators
    if (req.user && req.user.role === 'educator') {
      try {
        // Create a timestamp for the activity
        const timestamp = new Date();
        
        // Extract relevant information from the request
        const { method, originalUrl, params, query, body } = req;
        const userId = req.user._id;
        
        // Prepare details based on the activity type and request
        let details = {
          method,
          path: originalUrl,
        };
        
        // Add specific details based on activity type
        switch (activityType) {
          case 'student_view':
            details.studentId = params.studentId || query.studentId;
            break;
          case 'report_view':
            details.reportType = params.type || query.type;
            details.period = params.period || query.period;
            break;
          case 'analytics_view':
            details.analyticsType = params.type || query.type;
            break;
          case 'student_interaction':
            details.studentId = params.studentId || body.studentId;
            details.interactionType = params.interactionType || body.interactionType;
            break;
          case 'feedback_provided':
            details.studentId = params.studentId || body.studentId;
            details.feedbackType = params.feedbackType || body.feedbackType;
            break;
          default:
            // For other activity types, include minimal details
            break;
        }
        
        // Override the send function to log activity after response is sent
        res.send = function (data) {
          // Call the original send function
          originalSend.call(this, data);
          
          // Only log activity if response was successful
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // Update educator's lastActive timestamp
            const io = req.app.get('io');
            if (io) {
              io.to('admins').emit('educator:activity', {
                educatorId: userId,
                activityType,
                timestamp,
                details
              });
            }
            
            // Log the activity asynchronously
            ActivityLog.create({
              userId,
              activityType,
              description: `Educator ${activityType.replace(/_/g, ' ')}`,
              details,
              timestamp,
              ipAddress: req.ip,
              userAgent: req.get('User-Agent'),
              pageUrl: req.get('Referer')
            }).catch(err => {
              console.error('Error logging educator activity:', err);
            });
          }
        };
      } catch (err) {
        console.error('Error in educator activity tracker middleware:', err);
        // Continue even if tracking fails
      }
    }
    
    next();
  };
};

/**
 * Middleware to track educator login activity
 * This should be applied to the login route
 */
export const trackEducatorLogin = async (req, res, next) => {
  // Store original json function
  const originalJson = res.json;
  
  res.json = function (data) {
    // Call the original json function
    originalJson.call(this, data);
    
    // Check if login was successful and user is an educator
    if (res.statusCode === 200 && data.success && data.user && data.user.role === 'educator') {
      const userId = data.user._id;
      
      // Log the login activity
      ActivityLog.create({
        userId,
        activityType: 'login',
        description: 'Educator logged in',
        details: {
          method: 'login',
          success: true
        },
        timestamp: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }).catch(err => {
        console.error('Error logging educator login:', err);
      });
      
      // Notify admins about educator login
      const io = req.app.get('io');
      if (io) {
        io.to('admins').emit('educator:login', {
          educatorId: userId,
          timestamp: new Date(),
          name: data.user.name,
          email: data.user.email
        });
      }
    }
  };
  
  next();
};