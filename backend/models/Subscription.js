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
      enum: ['free', 'basic', 'standard', 'premium', 'enterprise'],
      default: 'free',
    },
    displayName: String,
    price: {
      type: Number,
      default: 0,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly',
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
    enum: ['active', 'past_due', 'cancelled', 'expired', 'trial'],
    default: 'trial',
  },
  
  // Dates
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  trialEndDate: {
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

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;

