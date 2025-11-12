import mongoose from 'mongoose';

const featureFlagSchema = new mongoose.Schema({
  // Feature Identification
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['feature', 'experiment', 'beta', 'maintenance', 'security', 'integration', 'ui', 'api'],
    default: 'feature'
  },
  
  // Feature Status
  enabled: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'archived'],
    default: 'draft',
    index: true
  },
  
  // Rollout Configuration
  rolloutPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  rolloutType: {
    type: String,
    enum: ['global', 'percentage', 'specific_orgs', 'specific_users', 'regional'],
    default: 'global'
  },
  
  // Targeting
  targetOrganizations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }],
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  targetRoles: [{
    type: String,
    enum: ['student', 'parent', 'teacher', 'school_admin', 'admin', 'csr']
  }],
  targetRegions: [{
    type: String // e.g., 'US', 'IN', 'EU', 'APAC'
  }],
  
  // Regional Overrides
  regionalOverrides: [{
    region: {
      type: String,
      required: true
    },
    enabled: {
      type: Boolean,
      required: true
    },
    rolloutPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    notes: String,
    updatedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Feature Configuration (JSON for flexible settings)
  configuration: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // A/B Testing / Experiments
  experiments: [{
    name: String,
    variant: {
      type: String,
      enum: ['control', 'variant_a', 'variant_b', 'variant_c']
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    metrics: [String], // Track metrics for this experiment
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active'
    }
  }],
  
  // Beta Access
  betaAccess: {
    enabled: {
      type: Boolean,
      default: false
    },
    accessLevel: {
      type: String,
      enum: ['private', 'invite_only', 'public_beta'],
      default: 'private'
    },
    betaUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    betaOrganizations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    }],
    betaKey: String // Optional access key
  },
  
  // Scheduling
  schedule: {
    enabled: Boolean,
    startDate: Date,
    endDate: Date,
    timezone: String
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  priority: {
    type: Number,
    default: 0 // Higher number = higher priority
  },
  
  // Audit Trail
  auditTrail: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    changes: mongoose.Schema.Types.Mixed,
    reason: String
  }],
  
  // Usage Statistics
  stats: {
    totalRequests: {
      type: Number,
      default: 0
    },
    enabledCount: {
      type: Number,
      default: 0
    },
    lastAccessed: Date,
    activeUsers: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
featureFlagSchema.index({ enabled: 1, status: 1 });
featureFlagSchema.index({ category: 1, status: 1 });
featureFlagSchema.index({ rolloutType: 1 });
featureFlagSchema.index({ 'regionalOverrides.region': 1 });
// Note: key field already has unique: true which automatically creates an index

const FeatureFlag = mongoose.model('FeatureFlag', featureFlagSchema);
export default FeatureFlag;

