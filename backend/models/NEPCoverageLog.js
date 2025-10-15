import mongoose from 'mongoose';

const nepCoverageLogSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  campusId: String,
  
  // Activity details
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  activityType: {
    type: String,
    enum: ['assignment', 'template', 'challenge', 'quiz', 'project', 'lesson'],
    required: true,
  },
  activityTitle: String,
  
  // Student/Class info
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
  },
  grade: Number,
  section: String,
  
  // NEP competencies covered
  competenciesCovered: [{
    competencyId: String,
    pillar: String,
    coveragePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    masteryLevel: {
      type: String,
      enum: ['introduced', 'developing', 'proficient', 'mastered'],
      default: 'introduced',
    },
  }],
  
  // Time tracking
  coverageHours: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  completionDate: Date,
  
  // Completion tracking
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  
  // Performance metrics
  scoreAchieved: Number,
  maxScore: Number,
  
  // Teacher/Admin who assigned
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
}, {
  timestamps: true,
});

// Indexes
nepCoverageLogSchema.index({ tenantId: 1, startDate: -1 });
nepCoverageLogSchema.index({ tenantId: 1, grade: 1, startDate: -1 });
nepCoverageLogSchema.index({ activityId: 1, activityType: 1 });
nepCoverageLogSchema.index({ 'competenciesCovered.competencyId': 1 });

const NEPCoverageLog = mongoose.model('NEPCoverageLog', nepCoverageLogSchema);
export default NEPCoverageLog;

