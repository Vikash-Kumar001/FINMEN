import mongoose from 'mongoose';

const integrationHealthSchema = new mongoose.Schema({
  // Integration Identification
  integrationName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  integrationType: {
    type: String,
    enum: ['api', 'webhook', 'sso', 'payment', 'sms', 'email', 'analytics', 'other'],
    required: true,
    index: true
  },
  provider: String, // e.g., 'Stripe', 'Twilio', 'SendGrid'
  
  // Connection Details
  endpoint: String,
  apiKey: String,
  configuration: mongoose.Schema.Types.Mixed,
  
  // Health Status
  status: {
    type: String,
    enum: ['healthy', 'degraded', 'down', 'unknown'],
    default: 'unknown',
    index: true
  },
  
  // Health Metrics
  metrics: {
    responseTime: Number, // in milliseconds
    successRate: Number, // percentage
    uptime: Number, // percentage
    errorRate: Number, // percentage
    lastCheck: Date,
    lastSuccess: Date,
    lastFailure: Date,
    consecutiveFailures: {
      type: Number,
      default: 0
    }
  },
  
  // Health Check History
  healthCheckHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['healthy', 'degraded', 'down']
    },
    responseTime: Number,
    errorMessage: String,
    statusCode: Number
  }],
  
  // Alerts
  alerts: [{
    type: {
      type: String,
      enum: ['downtime', 'high_latency', 'high_error_rate', 'authentication_failure']
    },
    message: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    triggeredAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: Date,
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  tenantId: String,
  
  // Metadata
  enabled: {
    type: Boolean,
    default: true
  },
  lastChecked: Date,
  nextCheck: Date,
  checkInterval: {
    type: Number,
    default: 300000 // 5 minutes in milliseconds
  },
  
  // Created/Updated
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
integrationHealthSchema.index({ integrationType: 1, status: 1 });
integrationHealthSchema.index({ organizationId: 1, status: 1 });
integrationHealthSchema.index({ lastChecked: 1 });

const IntegrationHealth = mongoose.model('IntegrationHealth', integrationHealthSchema);
export default IntegrationHealth;

