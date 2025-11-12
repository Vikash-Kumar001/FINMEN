import mongoose from 'mongoose';

const policyLegalSchema = new mongoose.Schema({
  // Request Type
  requestType: {
    type: String,
    enum: ['consent', 'deletion', 'data_access', 'rectification', 'portability', 'legal_hold', 'policy_update'],
    required: true,
    index: true
  },
  
  // User/Organization
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  
  // Consent Details
  consentType: String,
  consentStatus: {
    type: String,
    enum: ['granted', 'denied', 'withdrawn', 'pending']
  },
  consentDate: Date,
  consentMethod: String, // 'email', 'sms', 'app', 'web'
  
  // Deletion Request
  deletionRequest: {
    requestedAt: Date,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'rejected'],
      default: 'pending'
    },
    scheduledDeletionDate: Date,
    completedAt: Date,
    verifiedAt: Date
  },
  
  // Legal Hold
  legalHold: {
    active: Boolean,
    caseId: String,
    caseName: String,
    holdStartDate: Date,
    holdEndDate: Date,
    reason: String,
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Data Access Request
  dataAccessRequest: {
    requestedAt: Date,
    fulfilledAt: Date,
    format: String,
    fileUrl: String
  },
  
  // Policy Updates
  policyVersion: String,
  policyAccepted: Boolean,
  policyAcceptedAt: Date,
  policyChanges: [String],
  
  // Compliance
  gdprCompliant: Boolean,
  ccpaCompliant: Boolean,
  regionCompliance: mongoose.Schema.Types.Mixed,
  
  // Status
  status: {
    type: String,
    enum: ['active', 'pending', 'completed', 'expired', 'cancelled'],
    default: 'active',
    index: true
  },
  
  // Metadata
  notes: String,
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

policyLegalSchema.index({ requestType: 1, status: 1 });
policyLegalSchema.index({ consentStatus: 1 });
policyLegalSchema.index({ 'deletionRequest.status': 1 });
policyLegalSchema.index({ 'legalHold.active': 1 });

const PolicyLegal = mongoose.model('PolicyLegal', policyLegalSchema);
export default PolicyLegal;

