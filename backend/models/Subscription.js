import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  tenantId: {
    type: String,
    required: true,
  },
  
  // Plan details
  plan: {
    name: {
      type: String,
      enum: ['free', 'student_premium', 'student_parent_premium_pro', 'educational_institutions_premium'],
      default: 'free',
    },
    displayName: String,
    price: {
      type: Number,
      default: 0,
    },
    billingCycle: {
      type: String,
      enum: ['yearly'],
      default: 'yearly',
    },
  },
  
  // Limits
  limits: {
    maxStudents: {
      type: Number,
      default: 100,
    },
    maxTeachers: {
      type: Number,
      default: 10,
    },
    maxClasses: {
      type: Number,
      default: 10,
    },
    maxCampuses: {
      type: Number,
      default: 1,
    },
    maxStorage: {
      type: Number,
      default: 5, // in GB
    },
    maxTemplates: {
      type: Number,
      default: 50,
    },
    features: {
      advancedAnalytics: {
        type: Boolean,
        default: false,
      },
      aiAssistant: {
        type: Boolean,
        default: false,
      },
      customBranding: {
        type: Boolean,
        default: false,
      },
      apiAccess: {
        type: Boolean,
        default: false,
      },
      prioritySupport: {
        type: Boolean,
        default: false,
      },
      whiteLabel: {
        type: Boolean,
        default: false,
      },
    },
  },
  
  // Current usage
  usage: {
    students: {
      type: Number,
      default: 0,
    },
    teachers: {
      type: Number,
      default: 0,
    },
    classes: {
      type: Number,
      default: 0,
    },
    campuses: {
      type: Number,
      default: 1,
    },
    storage: {
      type: Number,
      default: 0, // in GB
    },
    templates: {
      type: Number,
      default: 0,
    },
  },
  
  // Subscription status
  status: {
    type: String,
    enum: ['active', 'past_due', 'cancelled', 'expired', 'pending'],
    default: 'pending',
  },
  
  // Dates
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  lastRenewedAt: {
    type: Date,
  },
  cancelledAt: Date,
  
  // Billing
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'bank', 'upi', 'wallet'],
    },
    last4: String,
    brand: String,
  },
  
  // Invoices
  invoices: [{
    invoiceId: String,
    amount: Number,
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed', 'refunded'],
    },
    paidAt: Date,
    dueDate: Date,
    invoiceUrl: String,
    description: String,
  }],
  
  // Add-ons
  addOns: [{
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    active: Boolean,
  }],

  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: true,
  },
  
  // Notes
  notes: String,
  
}, {
  timestamps: true,
});

// Indexes
subscriptionSchema.index({ tenantId: 1 });
subscriptionSchema.index({ orgId: 1 });
subscriptionSchema.index({ status: 1 });

// Methods
subscriptionSchema.methods.isOverLimit = function(resource) {
  const usage = this.usage[resource] || 0;
  const limit = this.limits[`max${resource.charAt(0).toUpperCase() + resource.slice(1)}`] || 0;
  return usage >= limit;
};

subscriptionSchema.methods.daysUntilExpiry = function() {
  if (!this.endDate) return null;
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

subscriptionSchema.methods.isActive = function() {
  // Check if status is active AND endDate hasn't passed
  if (this.status !== 'active' && this.status !== 'pending') {
    return false;
  }
  if (!this.endDate) {
    return this.status === 'active';
  }
  return new Date(this.endDate) > new Date();
};

subscriptionSchema.methods.isExpired = function() {
  if (!this.endDate) return false;
  return new Date(this.endDate) <= new Date();
};

subscriptionSchema.methods.getActualStatus = function() {
  // Compute actual status based on endDate
  if (this.status === 'cancelled') {
    return 'cancelled';
  }
  if (this.isExpired()) {
    return 'expired';
  }
  if (this.status === 'active' && this.isActive()) {
    return 'active';
  }
  if (this.status === 'pending' && !this.isExpired()) {
    return 'pending';
  }
  // If status says active but expired, return expired
  return 'expired';
};

subscriptionSchema.methods.getCurrentCycleStartDate = function() {
  // Calculate the start date of the current billing cycle
  // If lastRenewedAt exists, use it; otherwise calculate from endDate
  if (this.lastRenewedAt) {
    return this.lastRenewedAt;
  }
  
  // If no lastRenewedAt, calculate from endDate based on billing cycle
  if (this.endDate) {
    const cycleMonths = this.plan?.billingCycle === 'yearly' ? 12 : 12; // Default to yearly
    const cycleStart = new Date(this.endDate);
    cycleStart.setMonth(cycleStart.getMonth() - cycleMonths);
    return cycleStart;
  }
  
  // Fallback to original startDate
  return this.startDate || new Date();
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;

