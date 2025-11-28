import mongoose from 'mongoose';

const subscriptionRenewalRequestSchema = new mongoose.Schema({
  // Organization and Subscription References
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  
  // Requested By
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestedByName: String,
  requestedByEmail: String,
  
  // Renewal Details
  requestedPlan: {
    name: {
      type: String,
      enum: ['free', 'student_premium', 'student_parent_premium_pro', 'educational_institutions_premium'],
      required: true,
    },
    displayName: String,
  },
  requestedStudents: {
    type: Number,
    required: true,
    min: 0,
  },
  requestedTeachers: {
    type: Number,
    required: true,
    min: 0,
  },
  billingCycle: {
    type: String,
    enum: ['yearly'],
    default: 'yearly',
  },
  estimatedAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Current Subscription Details (snapshot)
  currentPlan: {
    name: String,
    displayName: String,
  },
  currentStudents: Number,
  currentTeachers: Number,
  currentEndDate: Date,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
    index: true,
  },
  
  // Approval Details
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedByName: String,
  approvedAt: Date,
  rejectionReason: String,
  adminNotes: String,
  
  // Additional Information
  notes: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Indexes
subscriptionRenewalRequestSchema.index({ status: 1, createdAt: -1 });
subscriptionRenewalRequestSchema.index({ orgId: 1, status: 1 });
subscriptionRenewalRequestSchema.index({ requestedBy: 1 });

const SubscriptionRenewalRequest = mongoose.model('SubscriptionRenewalRequest', subscriptionRenewalRequestSchema);

export default SubscriptionRenewalRequest;

