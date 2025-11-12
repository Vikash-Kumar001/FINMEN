import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // Action Details
  action: {
    type: String,
    required: true,
    index: true
  },
  actionType: {
    type: String,
    enum: [
      'create', 'update', 'delete', 'approve', 'reject', 'access', 'export',
      'login', 'logout', 'view', 'modify', 'assign', 'resolve', 'route',
      'bulk_operation', 'import', 'sync', 'configure', 'restrict', 'enable', 'disable'
    ],
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: [
      'user', 'content', 'organization', 'payment', 'approval', 'incident',
      'support', 'lifecycle', 'governance', 'financial', 'system', 'settings',
      'security', 'access', 'data', 'reports', 'analytics'
    ],
    required: true,
    index: true
  },
  
  // Actor Information
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  performedByName: String,
  performedByEmail: String,
  performedByRole: String,
  
  // Target Information
  targetType: {
    type: String,
    enum: ['user', 'content', 'organization', 'ticket', 'incident', 'payment', 'approval', 'other'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  targetName: String,
  targetIdentifier: String, // For non-MongoDB IDs or external references
  
  // Change Details
  changes: {
    before: mongoose.Schema.Types.Mixed, // Previous state
    after: mongoose.Schema.Types.Mixed,  // New state
    fieldsChanged: [String], // List of changed field names
    summary: String // Human-readable summary of changes
  },
  
  // Context
  description: String,
  reason: String,
  justification: String,
  
  // Request Information
  requestMethod: String, // GET, POST, PUT, DELETE
  requestPath: String,
  requestId: String, // Unique request identifier
  ipAddress: String,
  userAgent: String,
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  tenantId: String,
  
  // Additional Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Compliance & Security
  complianceFlags: [String], // e.g., 'gdpr', 'hipaa', 'ferpa'
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  requiresNotification: {
    type: Boolean,
    default: false
  },
  
  // Related Entities
  relatedEntityType: String,
  relatedEntityId: mongoose.Schema.Types.ObjectId,
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for common queries
auditLogSchema.index({ performedBy: 1, timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1, timestamp: -1 });
auditLogSchema.index({ category: 1, actionType: 1, timestamp: -1 });
auditLogSchema.index({ organizationId: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 }); // For timeline queries

// Text index for search
auditLogSchema.index({
  action: 'text',
  description: 'text',
  performedByName: 'text',
  targetName: 'text'
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;

