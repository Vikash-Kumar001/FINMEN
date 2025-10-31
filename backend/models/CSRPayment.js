import mongoose from 'mongoose';

const csrPaymentSchema = new mongoose.Schema({
  // Payment Identification
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  paymentType: {
    type: String,
    enum: ['per_campaign', 'healcoins_pool', 'subscription', 'one_time'],
    required: true
  },
  
  // CSR Organization Information
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  organizationName: String,
  csrContactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Campaign Reference (if per-campaign payment)
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  campaignTitle: String,
  
  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  
  // HealCoins Details (if applicable)
  healCoinsAmount: {
    type: Number,
    default: 0
  },
  healCoinsExchangeRate: {
    type: Number,
    default: 1 // HealCoins to currency ratio
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'credit_card', 'debit_card', 'net_banking', 'wallet'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'payu', 'paytm', 'stripe', 'manual']
  },
  transactionId: String, // Gateway transaction ID
  
  // Payment Schedule
  paymentSchedule: {
    type: String,
    enum: ['immediate', 'monthly', 'quarterly', 'yearly', 'custom'],
    default: 'immediate'
  },
  scheduledDate: Date,
  recurringEndDate: Date,
  
  // Financial Tracking
  budgetCategory: {
    type: String,
    enum: ['campaign_funding', 'healcoins_pool', 'platform_fees', 'admin_costs', 'marketing', 'infrastructure'],
    required: true
  },
  costCenter: String,
  projectCode: String,
  
  // Approval Workflow
  approvalStatus: {
    type: String,
    enum: ['pending_approval', 'approved', 'rejected', 'escalated'],
    default: 'pending_approval'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  approvalNotes: String,
  
  // Finance Team Integration
  financeTeam: {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    processedAt: Date,
    processingNotes: String,
    invoiceGenerated: {
      type: Boolean,
      default: false
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice'
    }
  },
  
  // Payment Processing
  processingDetails: {
    initiatedAt: Date,
    processedAt: Date,
    completedAt: Date,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    failureReason: String,
    retryCount: {
      type: Number,
      default: 0
    }
  },
  
  // Documentation
  supportingDocuments: [{
    type: {
      type: String,
      enum: ['agreement', 'proposal', 'budget_approval', 'campaign_plan', 'other']
    },
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Audit Trail
  auditTrail: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
  }],
  
  // Notifications
  notifications: [{
    type: String,
    message: String,
    sentTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }]
}, {
  timestamps: true
});

// Indexes for better performance
csrPaymentSchema.index({ organizationId: 1, status: 1 });
// paymentId already has unique: true in field definition, no need for explicit index
csrPaymentSchema.index({ campaignId: 1 });
csrPaymentSchema.index({ status: 1, approvalStatus: 1 });
csrPaymentSchema.index({ createdAt: -1 });

// Pre-save middleware to generate payment ID
csrPaymentSchema.pre('save', function(next) {
  if (this.isNew && !this.paymentId) {
    this.paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// Virtual for payment amount in different currencies
csrPaymentSchema.virtual('amountInUSD').get(function() {
  if (this.currency === 'USD') return this.amount;
  // Add currency conversion logic here
  return this.amount * 0.012; // Approximate INR to USD conversion
});

// Method to calculate HealCoins equivalent
csrPaymentSchema.methods.calculateHealCoins = function() {
  return Math.floor(this.amount * this.healCoinsExchangeRate);
};

// Method to update audit trail
csrPaymentSchema.methods.addAuditEntry = function(action, performedBy, details, oldValue, newValue) {
  this.auditTrail.push({
    action,
    performedBy,
    details,
    oldValue,
    newValue
  });
};

const CSRPayment = mongoose.model('CSRPayment', csrPaymentSchema);

export default CSRPayment;
