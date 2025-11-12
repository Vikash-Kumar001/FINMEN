import mongoose from 'mongoose';

const onboardingSchema = new mongoose.Schema({
  // Organization Details
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  tenantId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Trial Information
  trialStatus: {
    type: String,
    enum: ['not_started', 'active', 'expired', 'converted', 'cancelled'],
    default: 'not_started'
  },
  trialStartDate: Date,
  trialEndDate: Date,
  trialDays: {
    type: Number,
    default: 30
  },
  
  // Onboarding Progress
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  steps: [{
    stepName: String,
    completed: Boolean,
    completedAt: Date
  }],
  
  // Assigned Manager
  assignedManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Onboarding Data
  schoolName: {
    type: String,
    required: true
  },
  contactEmail: String,
  contactPhone: String,
  region: String,
  country: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'on_hold', 'cancelled'],
    default: 'pending',
    index: true
  },
  
  // Notes
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

onboardingSchema.index({ status: 1, createdAt: -1 });
onboardingSchema.index({ trialStatus: 1 });

const Onboarding = mongoose.model('Onboarding', onboardingSchema);
export default Onboarding;

