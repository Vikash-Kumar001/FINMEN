import auditTimelineService from '../services/auditTimelineService.js';

// Middleware to automatically log admin actions
export const auditLogger = (options = {}) => {
  return async (req, res, next) => {
    // Only log for authenticated admin users
    if (!req.user || req.user.role !== 'admin') {
      return next();
    }
    
    // Skip logging for GET requests by default (unless specified)
    if (req.method === 'GET' && !options.logGetRequests) {
      return next();
    }
    
    // Capture response
    const originalSend = res.send;
    const originalJson = res.json;
    
    let responseBody = null;
    
    // Override res.json to capture response
    res.json = function(data) {
      responseBody = data;
      return originalJson.call(this, data);
    };
    
    res.send = function(data) {
      responseBody = data;
      return originalSend.call(this, data);
    };
    
    // Log after response is sent
    res.on('finish', async () => {
      try {
        // Determine action details from request
        const actionType = mapMethodToActionType(req.method);
        const category = options.category || determineCategory(req.path);
        
        // Extract target information if available
        const targetType = options.targetType || extractTargetType(req.path);
        const targetId = extractTargetId(req);
        
        // Build changes object if applicable
        let changes = {};
        if (req.method === 'PUT' || req.method === 'PATCH' || req.method === 'POST') {
          changes = {
            before: options.before || null,
            after: req.body || null,
            fieldsChanged: Object.keys(req.body || {}),
            summary: generateChangeSummary(req.body, options.before)
          };
        }
        
        // Log the action
        await auditTimelineService.logAction({
          action: options.action || `${actionType} ${targetType || 'resource'}`,
          actionType,
          category,
          performedBy: req.user._id,
          targetType,
          targetId,
          targetName: options.targetName,
          changes,
          description: options.description || `${req.method} ${req.path}`,
          reason: options.reason,
          requestInfo: {
            method: req.method,
            path: req.path,
            requestId: req.id || req.headers['x-request-id'],
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
          },
          organizationId: req.user.orgId,
          tenantId: req.user.tenantId,
          metadata: {
            ...options.metadata,
            statusCode: res.statusCode,
            success: res.statusCode < 400
          },
          severity: options.severity || determineSeverity(actionType, category),
          complianceFlags: options.complianceFlags || []
        });
      } catch (error) {
        // Don't break the request flow if audit logging fails
        console.error('Error in audit logger middleware:', error);
      }
    });
    
    next();
  };
};

// Helper functions
const mapMethodToActionType = (method) => {
  const mapping = {
    'GET': 'view',
    'POST': 'create',
    'PUT': 'update',
    'PATCH': 'update',
    'DELETE': 'delete'
  };
  return mapping[method] || 'unknown';
};

const determineCategory = (path) => {
  if (path.includes('/user')) return 'user';
  if (path.includes('/content')) return 'content';
  if (path.includes('/organization')) return 'organization';
  if (path.includes('/payment')) return 'payment';
  if (path.includes('/approval')) return 'approval';
  if (path.includes('/incident')) return 'incident';
  if (path.includes('/support')) return 'support';
  if (path.includes('/lifecycle')) return 'lifecycle';
  if (path.includes('/governance')) return 'governance';
  if (path.includes('/financial')) return 'financial';
  if (path.includes('/settings')) return 'settings';
  return 'system';
};

const extractTargetType = (path) => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 1) {
    const type = segments[segments.length - 2];
    return type === 'admin' ? segments[segments.length - 1] : type;
  }
  return 'system';
};

const extractTargetId = (req) => {
  // Try to get ID from params
  if (req.params.id) return req.params.id;
  if (req.params.userId) return req.params.userId;
  if (req.params.contentId) return req.params.contentId;
  if (req.params.organizationId) return req.params.organizationId;
  if (req.params.ticketId) return req.params.ticketId;
  if (req.params.incidentId) return req.params.incidentId;
  
  // Try from body
  if (req.body._id) return req.body._id;
  if (req.body.id) return req.body.id;
  
  return null;
};

const generateChangeSummary = (after, before) => {
  if (!after || !before) return 'Data modified';
  
  const changedFields = [];
  for (const key in after) {
    if (JSON.stringify(after[key]) !== JSON.stringify(before[key])) {
      changedFields.push(key);
    }
  }
  
  return changedFields.length > 0
    ? `Changed fields: ${changedFields.join(', ')}`
    : 'No changes detected';
};

const determineSeverity = (actionType, category) => {
  // Critical operations
  if (actionType === 'delete' || category === 'security') {
    return 'high';
  }
  
  // Sensitive operations
  if (actionType === 'update' && (category === 'user' || category === 'settings')) {
    return 'medium';
  }
  
  // Standard operations
  return 'low';
};

export default auditLogger;

