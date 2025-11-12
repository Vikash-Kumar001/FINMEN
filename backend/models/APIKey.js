import mongoose from 'mongoose';
import crypto from 'crypto';

const apiKeySchema = new mongoose.Schema({
  // Key Identification
  keyName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  keyPrefix: {
    type: String,
    required: true,
    default: 'sk'
  }, // e.g., 'sk_live', 'sk_test'
  
  // Key Details
  description: {
    type: String,
    default: ''
  },
  keyType: {
    type: String,
    enum: ['live', 'test', 'development'],
    default: 'development',
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired', 'suspended'],
    default: 'active',
    index: true
  },
  
  // Access Control
  scopes: [{
    type: String,
    enum: ['read', 'write', 'admin', 'webhook', 'reporting', 'analytics']
  }],
  allowedIPs: [String],
  allowedDomains: [String],
  
  // Rate Limiting
  rateLimit: {
    requestsPerMinute: {
      type: Number,
      default: 60
    },
    requestsPerHour: {
      type: Number,
      default: 1000
    },
    requestsPerDay: {
      type: Number,
      default: 10000
    }
  },
  
  // Usage Tracking
  usage: {
    totalRequests: {
      type: Number,
      default: 0
    },
    successfulRequests: {
      type: Number,
      default: 0
    },
    failedRequests: {
      type: Number,
      default: 0
    },
    lastUsed: Date,
    lastUsedIP: String
  },
  
  // Expiry
  expiresAt: Date,
  neverExpires: {
    type: Boolean,
    default: false
  },
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  tenantId: String,
  
  // Created By
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Revocation
  revokedAt: Date,
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  revocationReason: String,
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tags: [String]
}, {
  timestamps: true
});

// Generate API key
apiKeySchema.statics.generateKey = function(prefix = 'sk') {
  const randomBytes = crypto.randomBytes(32);
  const key = randomBytes.toString('hex');
  return `${prefix}_${key}`;
};

// Indexes
apiKeySchema.index({ organizationId: 1, status: 1 });
// Note: apiKey field already has unique: true which automatically creates an index
apiKeySchema.index({ createdBy: 1 });

const APIKey = mongoose.model('APIKey', apiKeySchema);
export default APIKey;

