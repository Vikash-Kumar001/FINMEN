import mongoose from 'mongoose';

const benchmarkSchema = new mongoose.Schema({
  // Benchmark Identification
  benchmarkName: {
    type: String,
    required: true,
    trim: true
  },
  benchmarkType: {
    type: String,
    enum: ['academic', 'engagement', 'attendance', 'completion', 'retention', 'financial', 'custom'],
    required: true,
    index: true
  },
  
  // Comparison Data
  schools: [{
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    metrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    percentile: Number,
    rank: Number
  }],
  
  // Aggregate Metrics
  networkAverage: Number,
  networkMedian: Number,
  networkMin: Number,
  networkMax: Number,
  networkStdDev: Number,
  
  // Time Period
  startDate: Date,
  endDate: Date,
  
  // Created By
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Metadata
  description: String,
  tags: [String]
}, {
  timestamps: true
});

benchmarkSchema.index({ benchmarkType: 1, createdAt: -1 });

const Benchmark = mongoose.model('Benchmark', benchmarkSchema);
export default Benchmark;

