import mongoose from 'mongoose';

const budgetTransactionSchema = new mongoose.Schema({
  // Transaction Details
  transactionId: { type: String, unique: true, required: true },
  type: {
    type: String,
    enum: [
      'healcoins_funded',
      'healcoins_spent',
      'reward_distribution',
      'admin_fee',
      'operational_cost',
      'campaign_budget',
      'refund',
      'transfer'
    ],
    required: true
  },
  
  // Amount Information
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  healCoinsAmount: { type: Number, default: 0 },
  exchangeRate: { type: Number, default: 1 }, // HealCoins to currency ratio
  
  // Transaction Context
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Transaction Details
  description: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'auth', 'book', 'clothes', 'food', 'gadget', 'game', 'gift', 'grocery',
      'health', 'home', 'lifestyle', 'music', 'sport', 'stationery', 'travel', 'other'
    ],
    default: 'other'
  },
  
  // Status and Processing
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  processingDate: Date,
  completionDate: Date,
  
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['healcoins', 'wallet', 'external_payment', 'admin_credit', 'system_grant'],
    default: 'healcoins'
  },
  paymentReference: String,
  paymentGateway: String,
  
  // Voucher/Product Information
  voucherId: { type: mongoose.Schema.Types.ObjectId, ref: 'VoucherRedemption' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productDetails: {
    name: String,
    price: Number,
    category: String,
    description: String
  },
  
  // Financial Tracking
  balanceBefore: { type: Number, default: 0 },
  balanceAfter: { type: Number, default: 0 },
  healCoinsBalanceBefore: { type: Number, default: 0 },
  healCoinsBalanceAfter: { type: Number, default: 0 },
  
  // Approval and Authorization
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  approvalNotes: String,
  
  // Audit Trail
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Additional Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: String,
    deviceInfo: String,
    sessionId: String
  },
  
  // Reconciliation
  reconciled: { type: Boolean, default: false },
  reconciledAt: Date,
  reconciledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Fees and Charges
  fees: {
    processingFee: { type: Number, default: 0 },
    adminFee: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 }
  },
  
  // Tags and Notes
  tags: [String],
  notes: String,
  internalNotes: String

}, {
  timestamps: true
});

// Indexes for better performance
budgetTransactionSchema.index({ organizationId: 1, createdAt: -1 });
budgetTransactionSchema.index({ campaignId: 1, type: 1 });
budgetTransactionSchema.index({ userId: 1, createdAt: -1 });
budgetTransactionSchema.index({ status: 1, createdAt: -1 });
// transactionId already has unique: true in field definition, no need for explicit index

// Virtual for net amount (after fees)
budgetTransactionSchema.virtual('netAmount').get(function() {
  return this.amount - (this.fees.totalFees || 0);
});

// Pre-save middleware to generate transaction ID
budgetTransactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 9);
    this.transactionId = `TXN_${timestamp}_${random}`.toUpperCase();
  }
  
  // Calculate total fees
  this.fees.totalFees = (this.fees.processingFee || 0) + (this.fees.adminFee || 0);
  
  next();
});

// Static method to get budget summary
budgetTransactionSchema.statics.getBudgetSummary = async function(organizationId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        organizationId: mongoose.Types.ObjectId(organizationId),
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        totalHealCoins: { $sum: '$healCoinsAmount' },
        transactionCount: { $sum: 1 },
        totalFees: { $sum: '$fees.totalFees' }
      }
    }
  ];

  return await this.aggregate(pipeline);
};

// Instance method to get transaction details
budgetTransactionSchema.methods.getTransactionDetails = function() {
  return {
    transactionId: this.transactionId,
    type: this.type,
    amount: this.amount,
    healCoinsAmount: this.healCoinsAmount,
    description: this.description,
    status: this.status,
    createdAt: this.createdAt,
    netAmount: this.netAmount
  };
};

const BudgetTransaction = mongoose.model('BudgetTransaction', budgetTransactionSchema);

export default BudgetTransaction;
