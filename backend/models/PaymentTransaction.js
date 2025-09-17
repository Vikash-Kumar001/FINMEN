import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema({
  // Tenant Information
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    // index removed, only keep schema.index()
  },
  tenantId: {
    type: String,
    required: true,
    // index removed, only keep schema.index()
  },

  // Transaction Identification
  transactionId: {
    type: String,
    required: true,
    unique: true,
    // index removed, only keep schema.index()
  },
  gatewayTransactionId: String, // Gateway's transaction ID
  gatewayOrderId: String,       // Gateway's order ID
  
  // Payment Gateway Information
  gatewayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentGateway",
    required: true,
  },
  gatewayName: {
    type: String,
    required: true,
  },

  // Transaction Details
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: "INR",
  },
  description: {
    type: String,
    required: true,
  },
  
  // Fee Information
  processingFee: {
    gatewayFee: {
      type: Number,
      default: 0,
    },
    gst: {
      type: Number,
      default: 0,
    },
    totalFee: {
      type: Number,
      default: 0,
    },
  },
  netAmount: {
    type: Number,
    required: true,
  },

  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userDetails: {
    name: String,
    email: String,
    phone: String,
  },

  // Related Entity (Fee Payment, Event Registration, etc.)
  relatedEntity: {
    entityType: {
      type: String,
      enum: ["fee_payment", "event_registration", "donation", "other"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },

  // Payment Method Details
  paymentMethod: {
    type: {
      type: String,
      enum: ["card", "netbanking", "upi", "wallet", "emi"],
    },
    details: {
      // For card payments
      cardType: String,
      cardNetwork: String,
      last4Digits: String,
      
      // For UPI payments
      upiId: String,
      
      // For net banking
      bankName: String,
      
      // For wallet payments
      walletName: String,
    },
  },

  // Transaction Status
  status: {
    type: String,
    enum: [
      "initiated",
      "pending",
      "processing",
      "completed",
      "failed",
      "cancelled",
      "refunded",
      "partially_refunded",
    ],
    default: "initiated",
    index: true,
  },
  
  // Status History
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    reason: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  }],

  // Gateway Response
  gatewayResponse: {
    success: Boolean,
    message: String,
    errorCode: String,
    rawResponse: mongoose.Schema.Types.Mixed,
  },

  // Refund Information
  refunds: [{
    refundId: String,
    amount: {
      type: Number,
      required: true,
    },
    reason: String,
    status: {
      type: String,
      enum: ["initiated", "processing", "completed", "failed"],
      default: "initiated",
    },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    initiatedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: Date,
    gatewayRefundId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
  }],

  // Webhook Information
  webhooks: [{
    eventType: String,
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    payload: mongoose.Schema.Types.Mixed,
    processed: {
      type: Boolean,
      default: false,
    },
    processedAt: Date,
  }],

  // Retry Information
  retryAttempts: {
    type: Number,
    default: 0,
  },
  maxRetries: {
    type: Number,
    default: 3,
  },
  nextRetryAt: Date,

  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: {
      type: String,
      enum: ["web", "mobile", "api"],
      default: "web",
    },
    additionalInfo: mongoose.Schema.Types.Mixed,
  },

  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
  expiresAt: Date,

  // Flags
  isReconciled: {
    type: Boolean,
    default: false,
  },
  reconciledAt: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
paymentTransactionSchema.index({ organizationId: 1, tenantId: 1 });
paymentTransactionSchema.index({ userId: 1, status: 1 });
paymentTransactionSchema.index({ gatewayId: 1, status: 1 });
paymentTransactionSchema.index({ "relatedEntity.entityType": 1, "relatedEntity.entityId": 1 });
paymentTransactionSchema.index({ initiatedAt: -1 });
paymentTransactionSchema.index({ completedAt: -1 });

// Virtual for total refunded amount
paymentTransactionSchema.virtual('totalRefunded').get(function() {
  return this.refunds
    .filter(refund => refund.status === 'completed')
    .reduce((total, refund) => total + refund.amount, 0);
});

// Virtual for refund status
paymentTransactionSchema.virtual('refundStatus').get(function() {
  const totalRefunded = this.totalRefunded;
  if (totalRefunded === 0) return 'none';
  if (totalRefunded >= this.amount) return 'full';
  return 'partial';
});

// Method to update status
paymentTransactionSchema.methods.updateStatus = function(newStatus, reason, updatedBy) {
  this.statusHistory.push({
    status: this.status,
    reason: reason,
    updatedBy: updatedBy,
  });
  
  this.status = newStatus;
  
  if (newStatus === 'completed') {
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Method to add refund
paymentTransactionSchema.methods.addRefund = function(refundData) {
  this.refunds.push(refundData);
  
  const totalRefunded = this.totalRefunded;
  if (totalRefunded >= this.amount) {
    this.status = 'refunded';
  } else if (totalRefunded > 0) {
    this.status = 'partially_refunded';
  }
  
  return this.save();
};

// Method to check if transaction can be refunded
paymentTransactionSchema.methods.canRefund = function() {
  return this.status === 'completed' && this.totalRefunded < this.amount;
};

// Method to calculate processing fee
paymentTransactionSchema.methods.calculateProcessingFee = function(gateway) {
  if (!gateway || !gateway.settings.processingFee) return 0;
  
  const { type, value, gst } = gateway.settings.processingFee;
  let fee = 0;
  
  if (type === 'percentage') {
    fee = (this.amount * value) / 100;
  } else {
    fee = value;
  }
  
  const gstAmount = (fee * gst) / 100;
  const totalFee = fee + gstAmount;
  
  this.processingFee = {
    gatewayFee: fee,
    gst: gstAmount,
    totalFee: totalFee,
  };
  
  this.netAmount = this.amount - totalFee;
  
  return totalFee;
};

// Static method to generate transaction ID
paymentTransactionSchema.statics.generateTransactionId = function() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${random}`;
};

// Static method to get transaction statistics
paymentTransactionSchema.statics.getTransactionStats = async function(organizationId, tenantId, dateRange) {
  const matchQuery = {
    organizationId: new mongoose.Types.ObjectId(organizationId),
    tenantId: tenantId,
    isActive: true,
  };
  
  if (dateRange) {
    matchQuery.initiatedAt = {
      $gte: new Date(dateRange.startDate),
      $lte: new Date(dateRange.endDate),
    };
  }
  
  const stats = await this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        totalFees: { $sum: "$processingFee.totalFee" },
        completedTransactions: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
        },
        failedTransactions: {
          $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] }
        },
        refundedAmount: { $sum: "$totalRefunded" },
      }
    }
  ]);
  
  const result = stats[0] || {
    totalTransactions: 0,
    totalAmount: 0,
    totalFees: 0,
    completedTransactions: 0,
    failedTransactions: 0,
    refundedAmount: 0,
  };
  
  result.successRate = result.totalTransactions > 0 
    ? (result.completedTransactions / result.totalTransactions) * 100 
    : 0;
    
  return result;
};

export default mongoose.model("PaymentTransaction", paymentTransactionSchema);