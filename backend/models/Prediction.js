import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  // Prediction Identification
  predictionType: {
    type: String,
    enum: ['school_performance', 'subscription_renewal', 'cheating_detection', 'training_need', 'workload_forecast'],
    required: true,
    index: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  targetType: {
    type: String,
    enum: ['school', 'organization', 'user', 'exam', 'teacher', 'system'],
    required: true
  },
  
  // Prediction Results
  prediction: {
    result: {
      type: String,
      required: true
    }, // e.g., 'high_risk', 'low_risk', 'likely_to_renew', 'unlikely_to_renew', 'suspicious', 'normal'
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }, // Confidence/risk score 0-100
    probability: {
      type: Number,
      min: 0,
      max: 1
    }, // Probability for classification predictions
    confidence: {
      type: Number,
      min: 0,
      max: 100
    } // Model confidence in prediction
  },
  
  // Detailed Metrics
  metrics: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }, // Model-specific metrics
  
  // Factors Influencing Prediction
  factors: [{
    factor: String,
    weight: Number,
    impact: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    },
    value: mongoose.Schema.Types.Mixed
  }],
  
  // Recommendations
  recommendations: [{
    action: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    description: String,
    estimatedImpact: String
  }],
  
  // Model Information
  modelVersion: String,
  algorithm: String,
  trainingDataPeriod: {
    startDate: Date,
    endDate: Date
  },
  
  // Validation
  actualOutcome: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }, // Actual result for validation
  predictionAccuracy: Number, // Calculated when actual outcome is known
  validatedAt: Date,
  
  // Timestamps
  predictedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: Date, // Prediction validity period
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  tenantId: String,
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  tags: [String]
}, {
  timestamps: true
});

// Indexes
predictionSchema.index({ predictionType: 1, targetId: 1 });
predictionSchema.index({ 'prediction.score': -1 });
predictionSchema.index({ organizationId: 1, predictedAt: -1 });
predictionSchema.index({ expiresAt: 1 });

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;

