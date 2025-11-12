import auditTimelineService from '../services/auditTimelineService.js';

/**
 * Helper function to log admin actions easily from controllers
 * @param {Object} req - Express request object (must have req.user and req.app.get)
 * @param {Object} options - Audit log options
 * @param {string} options.action - Action description
 * @param {string} options.actionType - Type of action (create, update, delete, etc.)
 * @param {string} options.category - Category (user, content, organization, etc.)
 * @param {string} options.targetType - Target type
 * @param {string|ObjectId} options.targetId - Target ID
 * @param {Object} options.changes - Changes object (before/after)
 * @param {string} options.description - Action description
 * @param {string} options.reason - Reason for action
 * @param {string} options.severity - Severity level (low, medium, high, critical)
 */
export const logAdminAction = async (req, options = {}) => {
  // Only log for admin users
  if (!req.user || req.user.role !== 'admin') {
    return;
  }
  
  try {
    const requestInfo = {
      method: req.method,
      path: req.path,
      requestId: req.id || req.headers['x-request-id'],
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent')
    };
    
    await auditTimelineService.logAction({
      action: options.action,
      actionType: options.actionType,
      category: options.category,
      performedBy: req.user._id,
      targetType: options.targetType,
      targetId: options.targetId,
      targetName: options.targetName,
      changes: options.changes || {},
      description: options.description || `${req.method} ${req.path}`,
      reason: options.reason,
      requestInfo,
      organizationId: req.user.orgId,
      tenantId: req.user.tenantId,
      metadata: options.metadata || {},
      severity: options.severity || 'low',
      complianceFlags: options.complianceFlags || []
    });
    
    // Emit real-time notification via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      io.to('admin').emit('admin:audit:new', {
        action: options.action,
        actionType: options.actionType,
        category: options.category,
        performedBy: {
          _id: req.user._id,
          name: req.user.fullName || req.user.name
        },
        timestamp: new Date()
      });
    }
  } catch (error) {
    // Don't break the main flow if audit logging fails
    console.error('Error logging admin action:', error);
  }
};

export default logAdminAction;

