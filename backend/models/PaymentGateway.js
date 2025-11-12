import mongoose from "mongoose";

const paymentGatewaySchema = new mongoose.Schema({
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

  // Gateway Configuration
  gatewayName: {
    type: String,
    enum: ["razorpay", "stripe", "phonepe", "paytm"],
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  
  // Gateway Credentials (Encrypted)
  credentials: {
    keyId: String,        // API Key ID
    keySecret: String,    // API Key Secret (encrypted)
    merchantId: String,   // Merchant ID
    merchantKey: String,  // Merchant Key (encrypted)
    webhookSecret: String, // Webhook secret (encrypted)
    environment: {
      type: String,
      enum: ["sandbox", "production"],
      default: "sandbox",
    },
  },

  // Gateway Settings
  settings: {
    isActive: {
      type: Boolean,
      default: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    supportedCurrencies: [{
      type: String,
      default: ["INR"],
    }],
    supportedPaymentMethods: [{
      type: String,
      enum: ["card", "netbanking", "upi", "wallet", "emi"],
      default: ["card", "netbanking", "upi"],
    }],
    minimumAmount: {
      type: Number,
      default: 1,
    },
    maximumAmount: {
      type: Number,
      default: 1000000,
    },
    processingFee: {
      type: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      value: {
        type: Number,
        default: 2.5,
      },
      gst: {
        type: Number,
        default: 18,
      },
    },
  },

  // Webhook Configuration
  webhooks: {
    isEnabled: {
      type: Boolean,
      default: true,
    },
    url: String,
    events: [{
      type: String,
      enum: [
        "payment.authorized",
        "payment.captured",
        "payment.failed",
        "refund.created",
        "refund.processed",
        "subscription.created",
        "subscription.cancelled",
      ],
    }],
    retryAttempts: {
      type: Number,
      default: 3,
    },
  },

  // Gateway Statistics
  statistics: {
    totalTransactions: {
      type: Number,
      default: 0,
    },
    successfulTransactions: {
      type: Number,
      default: 0,
    },
    failedTransactions: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalFees: {
      type: Number,
      default: 0,
    },
    lastTransactionAt: Date,
    successRate: {
      type: Number,
      default: 0,
    },
  },

  // Configuration Metadata
  configuredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
paymentGatewaySchema.index({ organizationId: 1, tenantId: 1 });
paymentGatewaySchema.index({ gatewayName: 1, "settings.isActive": 1 });
paymentGatewaySchema.index({ "settings.isPrimary": 1 });

// Method to calculate success rate
paymentGatewaySchema.methods.calculateSuccessRate = function() {
  if (this.statistics.totalTransactions === 0) return 0;
  return (this.statistics.successfulTransactions / this.statistics.totalTransactions) * 100;
};

// Method to update statistics
paymentGatewaySchema.methods.updateStatistics = function(transaction) {
  this.statistics.totalTransactions += 1;
  this.statistics.totalAmount += transaction.amount;
  this.statistics.totalFees += transaction.processingFee || 0;
  this.statistics.lastTransactionAt = new Date();
  
  if (transaction.status === 'completed') {
    this.statistics.successfulTransactions += 1;
  } else if (transaction.status === 'failed') {
    this.statistics.failedTransactions += 1;
  }
  
  this.statistics.successRate = this.calculateSuccessRate();
};

// Static method to get primary gateway
paymentGatewaySchema.statics.getPrimaryGateway = async function(organizationId, tenantId) {
  return this.findOne({
    organizationId: new mongoose.Types.ObjectId(organizationId),
    tenantId: tenantId,
    "settings.isPrimary": true,
    "settings.isActive": true,
    isActive: true,
  });
};

// Static method to get active gateways
paymentGatewaySchema.statics.getActiveGateways = async function(organizationId, tenantId) {
  return this.find({
    organizationId: new mongoose.Types.ObjectId(organizationId),
    tenantId: tenantId,
    "settings.isActive": true,
    isActive: true,
  }).sort({ "settings.isPrimary": -1, gatewayName: 1 });
};

export default mongoose.model("PaymentGateway", paymentGatewaySchema);