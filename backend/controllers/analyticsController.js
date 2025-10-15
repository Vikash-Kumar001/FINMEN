import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

// ============= EVENT LOGGING =============

// Log a single analytics event
export const logEvent = async (req, res, next) => {
  try {
    const { eventName, eventCategory, metadata, performance } = req.body;
    const { tenantId } = req;

    if (!eventName) {
      throw new ErrorResponse('Event name is required', 400);
    }

    const event = await AnalyticsEvent.logEvent({
      tenantId,
      orgId: req.user?.orgId,
      eventName,
      eventCategory: eventCategory || 'action',
      userId: req.user?._id,
      userName: req.user?.name,
      userRole: req.user?.role,
      userEmail: req.user?.email,
      metadata: metadata || {},
      sessionId: req.sessionID || req.headers['x-session-id'],
      ipAddress: req.ip || req.headers['x-forwarded-for']?.split(',')[0],
      userAgent: req.headers['user-agent'],
      performance,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Event logged successfully',
      eventId: event?._id,
    });
  } catch (err) {
    next(err);
  }
};

// Batch log multiple events
export const logBatchEvents = async (req, res, next) => {
  try {
    const { events } = req.body;
    const { tenantId } = req;

    if (!events || !Array.isArray(events) || events.length === 0) {
      throw new ErrorResponse('Events array is required', 400);
    }

    const loggedEvents = await Promise.all(
      events.map(eventData =>
        AnalyticsEvent.logEvent({
          tenantId,
          orgId: req.user?.orgId,
          userId: req.user?._id,
          userName: req.user?.name,
          userRole: req.user?.role,
          userEmail: req.user?.email,
          sessionId: req.sessionID || req.headers['x-session-id'],
          ipAddress: req.ip || req.headers['x-forwarded-for']?.split(',')[0],
          userAgent: req.headers['user-agent'],
          ...eventData,
          timestamp: new Date(),
        })
      )
    );

    res.status(201).json({
      success: true,
      message: `${loggedEvents.length} events logged successfully`,
      count: loggedEvents.length,
    });
  } catch (err) {
    next(err);
  }
};

// ============= SPECIFIC EVENT LOGGERS =============

// Log school.overview.view event
export const logOverviewView = async (req, res, next) => {
  try {
    const { school_id, campus_id } = req.body;
    const { tenantId } = req;

    await AnalyticsEvent.logEvent({
      tenantId,
      orgId: req.user?.orgId,
      eventName: 'school.overview.view',
      eventCategory: 'view',
      userId: req.user?._id,
      userName: req.user?.name,
      userRole: req.user?.role,
      userEmail: req.user?.email,
      metadata: {
        school_id: school_id || req.user?.orgId,
        campus_id: campus_id || 'all',
      },
      sessionId: req.sessionID || req.headers['x-session-id'],
      ipAddress: req.ip || req.headers['x-forwarded-for']?.split(',')[0],
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: 'Overview view logged',
    });
  } catch (err) {
    next(err);
  }
};

// Log school.approval.action event
export const logApprovalAction = async (req, res, next) => {
  try {
    const { admin_id, assignment_id, action, template_id, item_type } = req.body;
    const { tenantId } = req;

    await AnalyticsEvent.logEvent({
      tenantId,
      orgId: req.user?.orgId,
      eventName: 'school.approval.action',
      eventCategory: 'action',
      userId: req.user?._id,
      userName: req.user?.name,
      userRole: req.user?.role,
      userEmail: req.user?.email,
      metadata: {
        admin_id: admin_id || req.user?._id,
        assignment_id,
        template_id,
        item_type: item_type || 'assignment',
        action, // 'approved', 'rejected', 'requested_changes'
      },
      sessionId: req.sessionID || req.headers['x-session-id'],
      ipAddress: req.ip || req.headers['x-forwarded-for']?.split(',')[0],
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: 'Approval action logged',
    });
  } catch (err) {
    next(err);
  }
};

// Log school.template.create event
export const logTemplateCreate = async (req, res, next) => {
  try {
    const { template_id, created_by, template_type, template_category } = req.body;
    const { tenantId } = req;

    await AnalyticsEvent.logEvent({
      tenantId,
      orgId: req.user?.orgId,
      eventName: 'school.template.create',
      eventCategory: 'create',
      userId: req.user?._id,
      userName: req.user?.name,
      userRole: req.user?.role,
      userEmail: req.user?.email,
      metadata: {
        template_id,
        created_by: created_by || req.user?._id,
        template_type,
        template_category,
      },
      sessionId: req.sessionID || req.headers['x-session-id'],
      ipAddress: req.ip || req.headers['x-forwarded-for']?.split(',')[0],
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: 'Template creation logged',
    });
  } catch (err) {
    next(err);
  }
};

// ============= ANALYTICS RETRIEVAL =============

// Get all events with filters
export const getEvents = async (req, res, next) => {
  try {
    const { tenantId } = req;
    const {
      eventName,
      eventCategory,
      userId,
      startDate,
      endDate,
      limit = 100,
      page = 1,
    } = req.query;

    const filter = { tenantId };
    if (eventName) filter.eventName = eventName;
    if (eventCategory) filter.eventCategory = eventCategory;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const events = await AnalyticsEvent.find(filter)
      .populate('userId', 'name email role profilePicture')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await AnalyticsEvent.countDocuments(filter);

    res.json({
      success: true,
      events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get event statistics
export const getEventStats = async (req, res, next) => {
  try {
    const { tenantId } = req;
    const { eventName, startDate, endDate, userId } = req.query;

    const stats = await AnalyticsEvent.getEventStats({
      tenantId,
      eventName,
      startDate,
      endDate,
      userId,
    });

    res.json({
      success: true,
      stats,
    });
  } catch (err) {
    next(err);
  }
};

// Get analytics dashboard summary
export const getAnalyticsDashboard = async (req, res, next) => {
  try {
    const { tenantId } = req;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }

    // Get event counts by type
    const eventCounts = await AnalyticsEvent.aggregate([
      { $match: { tenantId, ...dateFilter } },
      {
        $group: {
          _id: '$eventName',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          eventName: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get activity timeline (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const timeline = await AnalyticsEvent.aggregate([
      { $match: { tenantId, timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            eventName: '$eventName',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          events: {
            $push: {
              eventName: '$_id.eventName',
              count: '$count',
            },
          },
          totalEvents: { $sum: '$count' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top users by activity
    const topUsers = await AnalyticsEvent.aggregate([
      { $match: { tenantId, ...dateFilter } },
      {
        $group: {
          _id: '$userId',
          eventCount: { $sum: 1 },
          userName: { $first: '$userName' },
          userRole: { $first: '$userRole' },
        },
      },
      { $sort: { eventCount: -1 } },
      { $limit: 10 },
    ]);

    // Get recent events
    const recentEvents = await AnalyticsEvent.find({ tenantId })
      .populate('userId', 'name email role profilePicture')
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({
      success: true,
      dashboard: {
        eventCounts,
        timeline,
        topUsers,
        recentEvents,
        summary: {
          totalEvents: eventCounts.reduce((sum, e) => sum + e.count, 0),
          uniqueEventTypes: eventCounts.length,
          totalUsers: new Set(topUsers.map(u => u._id?.toString())).size,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get event funnel analysis
export const getEventFunnel = async (req, res, next) => {
  try {
    const { tenantId } = req;
    const { events: funnelEvents, startDate, endDate } = req.query;

    if (!funnelEvents) {
      throw new ErrorResponse('Funnel events array is required', 400);
    }

    const eventNames = funnelEvents.split(',');
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }

    const funnelData = await Promise.all(
      eventNames.map(async (eventName) => {
        const count = await AnalyticsEvent.countDocuments({
          tenantId,
          eventName: eventName.trim(),
          ...dateFilter,
        });
        const uniqueUsers = await AnalyticsEvent.distinct('userId', {
          tenantId,
          eventName: eventName.trim(),
          ...dateFilter,
        });

        return {
          eventName: eventName.trim(),
          count,
          uniqueUsers: uniqueUsers.length,
        };
      })
    );

    res.json({
      success: true,
      funnel: funnelData,
    });
  } catch (err) {
    next(err);
  }
};

// Export events as CSV
export const exportEvents = async (req, res, next) => {
  try {
    const { tenantId } = req;
    const { eventName, startDate, endDate } = req.query;

    const filter = { tenantId };
    if (eventName) filter.eventName = eventName;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const events = await AnalyticsEvent.find(filter)
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(10000);

    // Convert to CSV
    const csvHeaders = 'Timestamp,Event Name,Category,User Name,User Role,User Email,Metadata,IP Address\n';
    const csvRows = events.map(event =>
      [
        event.timestamp.toISOString(),
        event.eventName,
        event.eventCategory,
        event.userName || '',
        event.userRole || '',
        event.userEmail || '',
        JSON.stringify(event.metadata).replace(/"/g, '""'),
        event.ipAddress || '',
      ].join(',')
    ).join('\n');

    const csv = csvHeaders + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-events-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
