import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  // Service/Component Identification
  serviceName: {
    type: String,
    required: true,
    index: true
  },
  component: {
    type: String,
    required: true
  },
  
  // Performance Metrics
  metrics: {
    responseTime: Number, // milliseconds
    throughput: Number, // requests per second
    errorRate: Number, // percentage
    cpuUsage: Number, // percentage
    memoryUsage: Number, // percentage
    diskUsage: Number, // percentage
    activeConnections: Number,
    queueLength: Number,
    cacheHitRate: Number
  },
  
  // Status
  status: {
    type: String,
    enum: ['healthy', 'degraded', 'down', 'warning'],
    default: 'healthy',
    index: true
  },
  
  // Alerts
  alerts: [{
    type: {
      type: String,
      enum: ['high_latency', 'high_error_rate', 'high_cpu', 'high_memory', 'connection_failure']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    message: String,
    threshold: Number,
    currentValue: Number,
    triggeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  
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

telemetrySchema.index({ serviceName: 1, timestamp: -1 });
telemetrySchema.index({ status: 1, timestamp: -1 });

const Telemetry = mongoose.model('Telemetry', telemetrySchema);
export default Telemetry;

