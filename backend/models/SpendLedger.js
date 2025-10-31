import mongoose from 'mongoose';

const spendLedgerSchema = new mongoose.Schema({
  // Transaction Identification
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  transactionType: {
    type: String,
    enum: ['payment', 'healcoins_fund', 'healcoins_spend', 'refund', 'adjustment', 'fee'],
    required: true
  },
  
  // Organization and Campaign Reference
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  
  // Financial Details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  healCoinsAmount: {
    type: Number,
    default: 0
  },
  
  // Transaction Classification
  category: {
    type: String,
    enum: [
      'campaign_funding',
      'healcoins_pool',
      'student_rewards',
      'platform_fees',
      'admin_costs',
      'marketing',
      'infrastructure',
      'operational',
      'refund',
      'adjustment'
    ],
    required: true
  },
  subcategory: String,
  
  // Description and Details
  description: {
    type: String,
    required: true
  },
  reference: String, // External reference number
  notes: String,
  
  // Transaction Direction
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  
  // Balance Tracking
  runningBalance: {
    type: Number,
    required: true
  },
  healCoinsBalance: {
    type: Number,
    required: true
  },
  
  // Payment Method and Gateway
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'credit_card', 'debit_card', 'net_banking', 'wallet', 'healcoins', 'manual']
  },
  gatewayTransactionId: String,
  
  // Status and Processing
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed'],
    default: 'completed'
  },
  processedAt: {
    type: Date,
    default: Date.now
  },
  
  // Related Documents
  relatedPaymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CSRPayment'
  },
  relatedInvoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  
  // Approval and Authorization
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  authorizationLevel: {
    type: String,
    enum: ['auto', 'manager', 'director', 'finance'],
    default: 'auto'
  },
  
  // Cost Center and Project Tracking
  costCenter: String,
  projectCode: String,
  department: String,
  
  // Tax Information
  taxDetails: {
    taxRate: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    taxableAmount: {
      type: Number,
      default: 0
    },
    taxType: String
  },
  
  // Reconciliation
  reconciliationStatus: {
    type: String,
    enum: ['pending', 'matched', 'unmatched', 'disputed'],
    default: 'pending'
  },
  reconciledAt: Date,
  reconciledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Audit Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Tags for Reporting
  tags: [String],
  
  // Metadata
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Indexes for better performance
spendLedgerSchema.index({ organizationId: 1, createdAt: -1 });
spendLedgerSchema.index({ campaignId: 1, createdAt: -1 });
spendLedgerSchema.index({ transactionType: 1, status: 1 });
spendLedgerSchema.index({ category: 1, createdAt: -1 });
// transactionId already has unique: true in field definition, no need for explicit index
spendLedgerSchema.index({ createdAt: -1 });

// Pre-save middleware to generate transaction ID
spendLedgerSchema.pre('save', function(next) {
  if (this.isNew && !this.transactionId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.transactionId = `TXN_${timestamp}_${random}`.toUpperCase();
  }
  next();
});

// Virtual for formatted amount
spendLedgerSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount.toLocaleString()}`;
});

// Virtual for transaction impact
spendLedgerSchema.virtual('impact').get(function() {
  return this.direction === 'inbound' ? '+' : '-';
});

// Static method to get balance for organization
spendLedgerSchema.statics.getOrganizationBalance = async function(organizationId) {
  const latestTransaction = await this.findOne(
    { organizationId },
    { runningBalance: 1, healCoinsBalance: 1 }
  ).sort({ createdAt: -1 });
  
  return {
    balance: latestTransaction?.runningBalance || 0,
    healCoinsBalance: latestTransaction?.healCoinsBalance || 0
  };
};

// Static method to get spend summary
spendLedgerSchema.statics.getSpendSummary = async function(organizationId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        organizationId: new mongoose.Types.ObjectId(organizationId),
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        direction: 'outbound'
      }
    },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        totalHealCoins: { $sum: '$healCoinsAmount' },
        transactionCount: { $sum: 1 }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ];
  
  return await this.aggregate(pipeline);
};

// Method to update balances
spendLedgerSchema.methods.updateBalances = async function() {
  const previousTransaction = await this.constructor.findOne(
    { 
      organizationId: this.organizationId,
      createdAt: { $lt: this.createdAt }
    }
  ).sort({ createdAt: -1 });
  
  const previousBalance = previousTransaction?.runningBalance || 0;
  const previousHealCoinsBalance = previousTransaction?.healCoinsBalance || 0;
  
  if (this.direction === 'inbound') {
    this.runningBalance = previousBalance + this.amount;
    this.healCoinsBalance = previousHealCoinsBalance + this.healCoinsAmount;
  } else {
    this.runningBalance = previousBalance - this.amount;
    this.healCoinsBalance = previousHealCoinsBalance - this.healCoinsAmount;
  }
};

const SpendLedger = mongoose.model('SpendLedger', spendLedgerSchema);

export default SpendLedger;
