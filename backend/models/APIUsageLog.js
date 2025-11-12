import mongoose from 'mongoose';

const apiUsageLogSchema = new mongoose.Schema({
  // API Key Reference
  apiKeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'APIKey',
    required: true,
    index: true
  },
  apiKey: {
    type: String,
    index: true
  }, // Store key for quick lookups
  
  // Request Details
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    required: true
  },
  endpoint: {
    type: String,
    required: true,
    index: true
  },
  path: {
    type: String,
    required: true
  },
  queryParams: mongoose.Schema.Types.Mixed,
  
  // Response Details
  statusCode: {
    type: Number,
    required: true,
    index: true
  },
  responseTime: {
    type: Number, // in milliseconds
    required: true
  },
  responseSize: Number, // in bytes
  
  // Request/Response Data
  requestBody: mongoose.Schema.Types.Mixed,
  responseBody: mongoose.Schema.Types.Mixed,
  
  // Client Information
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: String,
  referer: String,
  
  // Errors
  errorMessage: String,
  errorCode: String,
  errorStack: String,
  
  // Rate Limiting
  rateLimitExceeded: {
    type: Boolean,
    default: false
  },
  rateLimitRemaining: Number,
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  tenantId: String,
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
apiUsageLogSchema.index({ apiKeyId: 1, timestamp: -1 });
apiUsageLogSchema.index({ endpoint: 1, timestamp: -1 });
apiUsageLogSchema.index({ statusCode: 1, timestamp: -1 });
apiUsageLogSchema.index({ organizationId: 1, timestamp: -1 });

const APIUsageLog = mongoose.model('APIUsageLog', apiUsageLogSchema);
export default APIUsageLog;

