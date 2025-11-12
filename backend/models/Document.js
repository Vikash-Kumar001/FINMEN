import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  // Document Identification
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  documentType: {
    type: String,
    enum: ['compliance', 'policy', 'report', 'certificate', 'license', 'contract', 'audit', 'financial', 'academic', 'other'],
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['gdpr', 'hipaa', 'ferpa', 'iso', 'accreditation', 'insurance', 'tax', 'legal', 'hr', 'academic', 'other'],
    default: 'other'
  },
  
  // File Information
  filename: {
    type: String,
    required: true
  },
  originalFilename: String,
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileHash: String, // For integrity checking
  
  // Compliance & Audit
  complianceStandards: [{
    standard: String, // e.g., 'GDPR', 'HIPAA', 'FERPA'
    requirement: String,
    status: {
      type: String,
      enum: ['compliant', 'pending', 'non_compliant'],
      default: 'pending'
    }
  }],
  auditRequirements: [{
    auditType: String,
    required: Boolean,
    lastAudited: Date,
    nextAuditDue: Date,
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Validity & Expiry
  validFrom: Date,
  validUntil: Date,
  isExpired: {
    type: Boolean,
    default: false,
    index: true
  },
  expiryReminderSent: {
    type: Boolean,
    default: false
  },
  
  // Version Control
  version: {
    type: String,
    default: '1.0'
  },
  versionHistory: [{
    version: String,
    filename: String,
    filePath: String,
    uploadedAt: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changes: String
  }],
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  
  // Access Control
  accessLevel: {
    type: String,
    enum: ['public', 'internal', 'restricted', 'confidential'],
    default: 'internal'
  },
  allowedRoles: [{
    type: String,
    enum: ['student', 'parent', 'teacher', 'school_admin', 'admin']
  }],
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  tenantId: String,
  
  // Metadata
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  tags: [String],
  keywords: [String],
  
  // Usage Tracking
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastAccessed: Date,
  lastAccessedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
documentSchema.index({ organizationId: 1, documentType: 1 });
documentSchema.index({ 'complianceStandards.standard': 1 });
documentSchema.index({ validUntil: 1, isExpired: 1 });
documentSchema.index({ title: 'text', description: 'text', keywords: 'text' });

const Document = mongoose.model('Document', documentSchema);
export default Document;

