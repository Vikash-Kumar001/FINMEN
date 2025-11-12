import auditTimelineService from '../services/auditTimelineService.js';

// Get audit timeline
export const getAuditTimeline = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      performedBy: req.query.performedBy,
      targetType: req.query.targetType,
      targetId: req.query.targetId,
      actionType: req.query.actionType,
      category: req.query.category,
      severity: req.query.severity || 'all',
      search: req.query.search || '',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      organizationId: req.query.organizationId,
      tenantId: req.query.tenantId
    };
    
    const data = await auditTimelineService.getAuditTimeline(filters);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getAuditTimeline:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit timeline',
      error: error.message
    });
  }
};

// Get action details (drill-down)
export const getActionDetails = async (req, res) => {
  try {
    const { logId } = req.params;
    
    const details = await auditTimelineService.getActionDetails(logId);

    res.json({
      success: true,
      data: details
    });
  } catch (error) {
    console.error('Error in getActionDetails:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching action details',
      error: error.message
    });
  }
};

// Get audit statistics
export const getAuditStats = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      organizationId: req.query.organizationId
    };
    
    const stats = await auditTimelineService.getAuditStats(filters);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getAuditStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit statistics',
      error: error.message
    });
  }
};

// Export audit logs
export const exportAuditLogs = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      performedBy: req.query.performedBy,
      targetType: req.query.targetType,
      category: req.query.category,
      organizationId: req.query.organizationId
    };
    
    const format = req.query.format || 'json';
    
    const exportData = await auditTimelineService.exportAuditLogs(filters, format);
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${exportData.filename}"`);
      res.send(exportData.data);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${exportData.filename}"`);
      res.json(exportData.data);
    }
  } catch (error) {
    console.error('Error in exportAuditLogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting audit logs',
      error: error.message
    });
  }
};

// Get target history
export const getTargetHistory = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    
    const history = await auditTimelineService.getTargetHistory(targetType, targetId);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error in getTargetHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching target history',
      error: error.message
    });
  }
};

// Get user activity summary
export const getUserActivitySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const summary = await auditTimelineService.getUserActivitySummary(userId, filters);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error in getUserActivitySummary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity summary',
      error: error.message
    });
  }
};

export default {
  getAuditTimeline,
  getActionDetails,
  getAuditStats,
  exportAuditLogs,
  getTargetHistory,
  getUserActivitySummary
};

