import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

// Log an admin action
export const logAction = async (actionData) => {
  try {
    const {
      action,
      actionType,
      category,
      performedBy,
      targetType,
      targetId,
      changes,
      description,
      reason,
      requestInfo,
      organizationId,
      tenantId,
      metadata,
      severity = 'low'
    } = actionData;
    
    // Get user details if not provided
    let userDetails = {};
    if (performedBy) {
      const user = await User.findById(performedBy).select('fullName name email role').lean();
      if (user) {
        userDetails = {
          performedByName: user.fullName || user.name,
          performedByEmail: user.email,
          performedByRole: user.role
        };
      }
    }
    
    const auditLog = new AuditLog({
      action,
      actionType,
      category,
      performedBy,
      ...userDetails,
      targetType,
      targetId: targetId || new mongoose.Types.ObjectId(),
      targetName: actionData.targetName,
      targetIdentifier: actionData.targetIdentifier,
      changes: changes || {},
      description,
      reason,
      justification: actionData.justification,
      requestMethod: requestInfo?.method,
      requestPath: requestInfo?.path,
      requestId: requestInfo?.requestId,
      ipAddress: requestInfo?.ipAddress,
      userAgent: requestInfo?.userAgent,
      organizationId,
      tenantId,
      metadata: metadata || {},
      severity,
      complianceFlags: actionData.complianceFlags || []
    });
    
    await auditLog.save();
    
    return auditLog;
  } catch (error) {
    console.error('Error logging action:', error);
    // Don't throw - audit logging should not break the main flow
    return null;
  }
};

// Get audit timeline with filters
export const getAuditTimeline = async (filters = {}) => {
  try {
    const {
      startDate,
      endDate,
      performedBy,
      targetType,
      targetId,
      actionType,
      category,
      severity = 'all',
      search = '',
      page = 1,
      limit = 50,
      organizationId,
      tenantId
    } = filters;
    
    // Build query
    const query = {};
    
    // Date range
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    if (performedBy && performedBy !== 'all' && mongoose.Types.ObjectId.isValid(performedBy)) {
      query.performedBy = new mongoose.Types.ObjectId(performedBy);
    }
    
    if (targetType && targetType !== 'all') {
      query.targetType = targetType;
    }
    
    if (targetId && targetId !== 'all' && mongoose.Types.ObjectId.isValid(targetId)) {
      query.targetId = new mongoose.Types.ObjectId(targetId);
    }
    
    if (actionType && actionType !== 'all') {
      query.actionType = actionType;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (severity && severity !== 'all') {
      query.severity = severity;
    }
    
    if (organizationId && organizationId !== 'all' && mongoose.Types.ObjectId.isValid(organizationId)) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    if (tenantId) {
      query.tenantId = tenantId;
    }
    
    // Text search
    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' }},
        { description: { $regex: search, $options: 'i' }},
        { performedByName: { $regex: search, $options: 'i' }},
        { targetName: { $regex: search, $options: 'i' }}
      ];
    }
    
    // Count total
    const total = await AuditLog.countDocuments(query);
    
    // Fetch logs
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('performedBy', 'fullName name email role')
      .populate('organizationId', 'name tenantId')
      .populate('targetId')
      .lean();
    
    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting audit timeline:', error);
    throw error;
  }
};

// Get drill-down details for a specific action
export const getActionDetails = async (logId) => {
  try {
    const log = await AuditLog.findById(logId)
      .populate('performedBy', 'fullName name email role')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    if (!log) {
      throw new Error('Audit log not found');
    }
    
    // Get related actions (actions on the same target)
    const relatedActions = await AuditLog.find({
      targetType: log.targetType,
      targetId: log.targetId,
      _id: { $ne: log._id }
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('performedBy', 'fullName name email role')
      .lean();
    
    // Get user's action history
    const userHistory = await AuditLog.find({
      performedBy: log.performedBy,
      _id: { $ne: log._id }
    })
      .sort({ timestamp: -1 })
      .limit(20)
      .select('action actionType category timestamp targetType targetId')
      .lean();
    
    return {
      ...log,
      relatedActions,
      userHistory
    };
  } catch (error) {
    console.error('Error getting action details:', error);
    throw error;
  }
};

// Get audit statistics
export const getAuditStats = async (filters = {}) => {
  try {
    const { startDate, endDate, organizationId } = filters;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }
    
    const orgFilter = organizationId && mongoose.Types.ObjectId.isValid(organizationId)
      ? { ...dateFilter, organizationId: new mongoose.Types.ObjectId(organizationId) }
      : dateFilter;
    
    const [
      totalActions,
      byCategory,
      byActionType,
      byUser,
      bySeverity,
      recentActions
    ] = await Promise.all([
      AuditLog.countDocuments(orgFilter),
      AuditLog.aggregate([
        { $match: orgFilter },
        { $group: { _id: '$category', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      AuditLog.aggregate([
        { $match: orgFilter },
        { $group: { _id: '$actionType', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      AuditLog.aggregate([
        { $match: orgFilter },
        { $group: {
          _id: '$performedBy',
          count: { $sum: 1 },
          name: { $first: '$performedByName' },
          role: { $first: '$performedByRole' }
        }},
        { $sort: { count: -1 }},
        { $limit: 10 }
      ]),
      AuditLog.aggregate([
        { $match: orgFilter },
        { $group: { _id: '$severity', count: { $sum: 1 }}}
      ]),
      AuditLog.find(orgFilter)
        .sort({ timestamp: -1 })
        .limit(10)
        .select('action actionType category performedByName timestamp')
        .lean()
    ]);
    
    return {
      total: totalActions,
      byCategory: byCategory || [],
      byActionType: byActionType || [],
      byUser: byUser || [],
      bySeverity: bySeverity || [],
      recentActions: recentActions || []
    };
  } catch (error) {
    console.error('Error getting audit stats:', error);
    throw error;
  }
};

// Export audit logs for compliance
export const exportAuditLogs = async (filters = {}, format = 'json') => {
  try {
    const {
      startDate,
      endDate,
      performedBy,
      targetType,
      category,
      organizationId
    } = filters;
    
    // Build query (same as getAuditTimeline)
    const query = {};
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    if (performedBy && performedBy !== 'all' && mongoose.Types.ObjectId.isValid(performedBy)) {
      query.performedBy = new mongoose.Types.ObjectId(performedBy);
    }
    
    if (targetType && targetType !== 'all') {
      query.targetType = targetType;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (organizationId && organizationId !== 'all' && mongoose.Types.ObjectId.isValid(organizationId)) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    // Fetch all matching logs (no pagination for export)
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .populate('performedBy', 'fullName name email role')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    // Format based on export type
    if (format === 'csv') {
      // Convert to CSV format
      const headers = [
        'Timestamp', 'Action', 'Action Type', 'Category', 'Performed By',
        'Role', 'Target Type', 'Target ID', 'Target Name', 'IP Address',
        'Description', 'Changes Summary', 'Severity'
      ];
      
      const rows = logs.map(log => [
        log.timestamp.toISOString(),
        log.action,
        log.actionType,
        log.category,
        log.performedByName || 'N/A',
        log.performedByRole || 'N/A',
        log.targetType,
        log.targetId.toString(),
        log.targetName || 'N/A',
        log.ipAddress || 'N/A',
        log.description || '',
        log.changes?.summary || '',
        log.severity
      ]);
      
      return {
        format: 'csv',
        data: [headers, ...rows].map(row => row.join(',')).join('\n'),
        filename: `audit-log-${new Date().toISOString().split('T')[0]}.csv`
      };
    } else {
      // JSON format
      return {
        format: 'json',
        data: logs,
        filename: `audit-log-${new Date().toISOString().split('T')[0]}.json`
      };
    }
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    throw error;
  }
};

// Get changes for a specific target
export const getTargetHistory = async (targetType, targetId) => {
  try {
    if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
      throw new Error('Invalid target ID');
    }
    
    const logs = await AuditLog.find({
      targetType,
      targetId: new mongoose.Types.ObjectId(targetId)
    })
      .sort({ timestamp: -1 })
      .populate('performedBy', 'fullName name email role')
      .lean();
    
    return logs;
  } catch (error) {
    console.error('Error getting target history:', error);
    throw error;
  }
};

// Get user activity summary
export const getUserActivitySummary = async (userId, filters = {}) => {
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }
    
    const { startDate, endDate } = filters;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const [
      totalActions,
      byCategory,
      byActionType,
      recentActions,
      criticalActions
    ] = await Promise.all([
      AuditLog.countDocuments({ performedBy: userObjectId, ...dateFilter }),
      AuditLog.aggregate([
        { $match: { performedBy: userObjectId, ...dateFilter }},
        { $group: { _id: '$category', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      AuditLog.aggregate([
        { $match: { performedBy: userObjectId, ...dateFilter }},
        { $group: { _id: '$actionType', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      AuditLog.find({ performedBy: userObjectId, ...dateFilter })
        .sort({ timestamp: -1 })
        .limit(20)
        .lean(),
      AuditLog.find({ 
        performedBy: userObjectId, 
        ...dateFilter,
        severity: { $in: ['high', 'critical'] }
      })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean()
    ]);
    
    return {
      totalActions,
      byCategory: byCategory || [],
      byActionType: byActionType || [],
      recentActions: recentActions || [],
      criticalActions: criticalActions || []
    };
  } catch (error) {
    console.error('Error getting user activity summary:', error);
    throw error;
  }
};

export default {
  logAction,
  getAuditTimeline,
  getActionDetails,
  getAuditStats,
  exportAuditLogs,
  getTargetHistory,
  getUserActivitySummary
};

