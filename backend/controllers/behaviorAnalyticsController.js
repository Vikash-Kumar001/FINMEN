import behaviorAnalyticsService from '../services/behaviorAnalyticsService.js';

// Get Behavior Flow Analytics
export const getBehaviorFlow = async (req, res) => {
  try {
    const { role, startDate, endDate, limit } = req.query;
    
    const data = await behaviorAnalyticsService.getBehaviorFlow({
      role,
      startDate,
      endDate,
      limit: limit ? parseInt(limit) : 50
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('behavior:analytics:update', {
        type: 'behaviorFlow',
        data
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getBehaviorFlow:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching behavior flow analytics',
      error: error.message
    });
  }
};

// Get Parent Engagement Scores
export const getParentEngagement = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const data = await behaviorAnalyticsService.getParentEngagementScore({
      startDate,
      endDate
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('behavior:analytics:update', {
        type: 'parentEngagement',
        data
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getParentEngagement:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching parent engagement scores',
      error: error.message
    });
  }
};

// Get Teacher Workload Analytics
export const getTeacherWorkload = async (req, res) => {
  try {
    const { tenantId, startDate, endDate } = req.query;
    
    const data = await behaviorAnalyticsService.getTeacherWorkload({
      tenantId,
      startDate,
      endDate
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('behavior:analytics:update', {
        type: 'teacherWorkload',
        data
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getTeacherWorkload:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher workload analytics',
      error: error.message
    });
  }
};

// Get Drop-off Detection
export const getDropOffDetection = async (req, res) => {
  try {
    const { role, daysThreshold } = req.query;
    
    const data = await behaviorAnalyticsService.getDropOffDetection({
      role,
      daysThreshold: daysThreshold ? parseInt(daysThreshold) : 7
    });

    // Emit alert for critical drop-offs
    const io = req.app.get('io');
    if (io && data.summary.critical > 0) {
      io.to('admin').emit('behavior:dropoff:alert', {
        critical: data.summary.critical,
        high: data.summary.high,
        message: `${data.summary.critical} users at critical risk of dropping off`
      });
    }

    // Emit real-time update
    if (io) {
      io.to('admin').emit('behavior:analytics:update', {
        type: 'dropOff',
        data
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getDropOffDetection:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drop-off detection',
      error: error.message
    });
  }
};

// Get Churn Predictions
export const getChurnPredictions = async (req, res) => {
  try {
    const { role, daysAhead } = req.query;
    
    const data = await behaviorAnalyticsService.getChurnPredictions({
      role,
      daysAhead: daysAhead ? parseInt(daysAhead) : 30
    });

    // Emit alerts for high-risk users
    const io = req.app.get('io');
    if (io && data.summary.usersRequiringAction > 0) {
      io.to('admin').emit('behavior:churn:alert', {
        critical: data.summary.critical,
        high: data.summary.high,
        totalRequiringAction: data.summary.usersRequiringAction,
        message: `${data.summary.usersRequiringAction} users require immediate attention to prevent churn`
      });
    }

    // Emit real-time update
    if (io) {
      io.to('admin').emit('behavior:analytics:update', {
        type: 'churn',
        data
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getChurnPredictions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching churn predictions',
      error: error.message
    });
  }
};

// Get All Analytics (Dashboard Summary)
export const getAllBehaviorAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const [behaviorFlow, parentEngagement, teacherWorkload, dropOff, churn] = await Promise.all([
      behaviorAnalyticsService.getBehaviorFlow({ startDate, endDate, limit: 10 }),
      behaviorAnalyticsService.getParentEngagementScore({ startDate, endDate }),
      behaviorAnalyticsService.getTeacherWorkload({ startDate, endDate }),
      behaviorAnalyticsService.getDropOffDetection({ daysThreshold: 7 }),
      behaviorAnalyticsService.getChurnPredictions({ daysAhead: 30 })
    ]);

    const summary = {
      behaviorFlow: {
        totalFlows: behaviorFlow.totalFlows,
        featureUsage: behaviorFlow.featureUsage.length
      },
      parentEngagement: parentEngagement.summary,
      teacherWorkload: teacherWorkload.summary,
      dropOff: dropOff.summary,
      churn: churn.summary
    };

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('behavior:analytics:summary', summary);
    }

    res.json({
      success: true,
      data: {
        summary,
        behaviorFlow,
        parentEngagement,
        teacherWorkload,
        dropOff,
        churn
      }
    });
  } catch (error) {
    console.error('Error in getAllBehaviorAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching behavior analytics summary',
      error: error.message
    });
  }
};

export default {
  getBehaviorFlow,
  getParentEngagement,
  getTeacherWorkload,
  getDropOffDetection,
  getChurnPredictions,
  getAllBehaviorAnalytics
};

