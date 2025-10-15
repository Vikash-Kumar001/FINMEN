import mongoose from 'mongoose';

const consentRecordSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userRole: {
    type: String,
    enum: ['school_student', 'school_parent', 'school_teacher', 'school_admin'],
  },
  
  // Consent details
  consentType: {
    type: String,
    enum: [
      'data_collection',
      'data_processing',
      'data_sharing',
      'marketing_communications',
      'photo_video_usage',
      'health_data',
      'academic_data',
      'biometric_data',
      'third_party_sharing',
      'research_participation',
      'ai_processing',
      'location_tracking',
    ],
    required: true,
  },
  
  // Consent status
  status: {
    type: String,
    enum: ['granted', 'denied', 'withdrawn', 'expired', 'pending'],
    default: 'pending',
  },
  
  // Consent details
  purpose: {
    type: String,
    required: true,
  },
  description: String,
  
  // Version tracking (for consent policy changes)
  policyVersion: {
    type: String,
    required: true,
  },
  
  // Dates
  grantedAt: Date,
  deniedAt: Date,
  withdrawnAt: Date,
  expiresAt: Date,
  
  // Guardian consent (for minors)
  requiresGuardianConsent: {
    type: Boolean,
    default: false,
  },
  guardianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  guardianConsentStatus: {
    type: String,
    enum: ['granted', 'denied', 'pending'],
  },
  guardianConsentedAt: Date,
  
  // IP and metadata for audit
  ipAddress: String,
  userAgent: String,
  consentMethod: {
    type: String,
    enum: ['web_form', 'mobile_app', 'paper_form', 'email', 'verbal'],
    default: 'web_form',
  },
  
  // Evidence/proof
  evidenceUrl: String, // Link to signed form/document
  signatureData: String, // Digital signature
  
  // Renewal tracking
  isRenewable: {
    type: Boolean,
    default: true,
  },
  renewalReminder: {
    sent: Boolean,
    sentAt: Date,
  },
  
  // Notes
  notes: String,
  withdrawalReason: String,
  
}, {
  timestamps: true,
});

// Indexes for efficient queries
consentRecordSchema.index({ tenantId: 1, userId: 1, consentType: 1 });
consentRecordSchema.index({ status: 1, expiresAt: 1 });
consentRecordSchema.index({ tenantId: 1, status: 1 });

// Methods
consentRecordSchema.methods.isValid = function() {
  if (this.status !== 'granted') return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  return true;
};

consentRecordSchema.methods.withdraw = function(reason) {
  this.status = 'withdrawn';
  this.withdrawnAt = new Date();
  this.withdrawalReason = reason;
  return this.save();
};

const ConsentRecord = mongoose.model('ConsentRecord', consentRecordSchema);
export default ConsentRecord;

