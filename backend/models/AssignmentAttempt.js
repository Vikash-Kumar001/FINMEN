import mongoose from 'mongoose';

const assignmentAttemptSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
    required: true
  },
  tenantId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'submitted', 'graded'],
    default: 'in_progress'
  },
  answers: [{
    questionId: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      required: true
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    points: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    }
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // total time in seconds
    default: 0
  },
  submittedAt: {
    type: Date
  },
  gradedAt: {
    type: Date
  },
  feedback: {
    type: String,
    default: ''
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  isLate: {
    type: Boolean,
    default: false
  },
  autoGraded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
assignmentAttemptSchema.index({ assignmentId: 1, studentId: 1 });
assignmentAttemptSchema.index({ studentId: 1, status: 1 });
assignmentAttemptSchema.index({ classId: 1, status: 1 });
assignmentAttemptSchema.index({ tenantId: 1 });

// Calculate percentage before saving
assignmentAttemptSchema.pre('save', function(next) {
  if (this.totalScore && this.maxScore) {
    this.percentage = Math.round((this.totalScore / this.maxScore) * 100);
  }
  next();
});

export default mongoose.model('AssignmentAttempt', assignmentAttemptSchema);
