import mongoose from 'mongoose';

const complianceAuditLogSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  
  // Who performed the action
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userRole: String,
  userName: String,
  
  // What action was performed
  action: {
    type: String,
    enum: [
      // Consent actions
      'consent_granted',
      'consent_denied',
      'consent_withdrawn',
      'consent_expired',
      'consent_renewed',
      // Data access
      'data_accessed',
      'data_exported',
      'data_deleted',
      'data_archived',
      'data_modified',
      // User management
      'user_created',
      'user_deleted',
      'user_suspended',
      'user_reactivated',
      'role_changed',
      // School management
      'student_created',
      'student_deleted',
      'student_updated',
      'teacher_created',
      'teacher_deleted',
      'teacher_updated',
      'class_created',
      'class_deleted',
      'class_updated',
      'students_added_to_class',
      // Policy changes
      'policy_created',
      'policy_updated',
      'policy_deleted',
      'policy_enforced',
      // Security
      'login_attempt',
      'login_success',
      'login_failed',
      'logout',
      'password_changed',
      'password_reset',
      'mfa_enabled',
      'mfa_disabled',
      // Compliance
      'data_breach_detected',
      'data_breach_reported',
      'gdpr_request',
      'data_subject_request',
      'audit_performed',
      // System
      'settings_changed',
      'integration_enabled',
      'integration_disabled',
    ],
    required: true,
  },
  
  // Target of the action
  targetType: {
    type: String,
    enum: ['user', 'student', 'teacher', 'class', 'consent', 'policy', 'data', 'system', 'template', 'assignment'],
  },
  targetId: mongoose.Schema.Types.ObjectId,
  targetName: String,
  
  // Action details
  description: String,
  changes: {
    type: mongoose.Schema.Types.Mixed,
    // Stores before/after values for modifications
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  // Request information
  ipAddress: String,
  userAgent: String,
  requestUrl: String,
  requestMethod: String,
  
  // Result
  status: {
    type: String,
    enum: ['success', 'failure', 'partial', 'pending'],
    default: 'success',
  },
  errorMessage: String,
  
  // Compliance flags
  isPIIAccess: {
    type: Boolean,
    default: false,
  },
  isSensitiveData: {
    type: Boolean,
    default: false,
  },
  requiresReview: {
    type: Boolean,
    default: false,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: Date,
  
  // Geolocation
  location: {
    country: String,
    region: String,
    city: String,
  },
  
  // Duration tracking
  duration: Number, // in milliseconds
  
  // Tags for categorization
  tags: [String],
  
  // Retention
  retainUntil: Date,
  
}, {
  timestamps: true,
});

// Indexes for efficient queries
complianceAuditLogSchema.index({ tenantId: 1, createdAt: -1 });
complianceAuditLogSchema.index({ userId: 1, createdAt: -1 });
complianceAuditLogSchema.index({ action: 1, createdAt: -1 });
complianceAuditLogSchema.index({ targetType: 1, targetId: 1 });
complianceAuditLogSchema.index({ isPIIAccess: 1, createdAt: -1 });
complianceAuditLogSchema.index({ requiresReview: 1, reviewedAt: 1 });

// Static methods
complianceAuditLogSchema.statics.logAction = async function(data) {
  try {
    return await this.create({
      ...data,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error logging audit action:', error);
    // Don't throw error - audit logging should not break application flow
  }
};

complianceAuditLogSchema.statics.getPIIAccessLogs = async function(tenantId, startDate, endDate) {
  return await this.find({
    tenantId,
    isPIIAccess: true,
    createdAt: { $gte: startDate, $lte: endDate },
  }).sort({ createdAt: -1 });
};

const ComplianceAuditLog = mongoose.model('ComplianceAuditLog', complianceAuditLogSchema);
export default ComplianceAuditLog;

