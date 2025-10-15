import mongoose from 'mongoose';

const dataRetentionPolicySchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  
  // Policy details
  name: {
    type: String,
    required: true,
  },
  description: String,
  
  // Data type this policy applies to
  dataType: {
    type: String,
    enum: [
      'student_records',
      'academic_data',
      'attendance_records',
      'financial_records',
      'health_records',
      'communication_logs',
      'assessment_data',
      'behavior_records',
      'consent_records',
      'audit_logs',
      'user_accounts',
      'parent_data',
      'teacher_data',
      'activity_logs',
    ],
    required: true,
  },
  
  // Retention period
  retentionPeriod: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ['days', 'months', 'years'],
      default: 'years',
    },
  },
  
  // What happens after retention period
  actionAfterExpiry: {
    type: String,
    enum: ['delete', 'archive', 'anonymize', 'manual_review'],
    default: 'archive',
  },
  
  // Legal basis
  legalBasis: {
    type: String,
    enum: [
      'legal_requirement',
      'contractual_obligation',
      'consent',
      'legitimate_interest',
      'regulatory_compliance',
    ],
  },
  legalReference: String, // e.g., "GDPR Article 17", "India IT Act 2000"
  
  // Exceptions
  exceptions: [{
    reason: String,
    extendedPeriod: {
      value: Number,
      unit: String,
    },
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Enforcement
  autoEnforce: {
    type: Boolean,
    default: false,
  },
  lastEnforcedAt: Date,
  
  // Statistics
  recordsAffected: {
    type: Number,
    default: 0,
  },
  recordsDeleted: {
    type: Number,
    default: 0,
  },
  recordsArchived: {
    type: Number,
    default: 0,
  },
  
  // Approval
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: Date,
  
  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
}, {
  timestamps: true,
});

// Indexes
dataRetentionPolicySchema.index({ tenantId: 1, dataType: 1 });
dataRetentionPolicySchema.index({ isActive: 1, autoEnforce: 1 });

// Methods
dataRetentionPolicySchema.methods.getRetentionDays = function() {
  const { value, unit } = this.retentionPeriod;
  if (unit === 'days') return value;
  if (unit === 'months') return value * 30;
  if (unit === 'years') return value * 365;
  return value;
};

dataRetentionPolicySchema.methods.calculateExpiryDate = function(createdDate) {
  const days = this.getRetentionDays();
  const expiry = new Date(createdDate);
  expiry.setDate(expiry.getDate() + days);
  return expiry;
};

const DataRetentionPolicy = mongoose.model('DataRetentionPolicy', dataRetentionPolicySchema);
export default DataRetentionPolicy;

