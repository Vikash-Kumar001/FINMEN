import mongoose from 'mongoose';

const teacherChallengeSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['academic', 'creative', 'physical', 'social', 'environmental', 'technology', 'leadership', 'other'],
    default: 'academic',
  },
  category: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'special', 'seasonal', 'event_based'],
    default: 'weekly',
  },
  subject: {
    type: String,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
  },
  className: {
    type: String,
  },
  section: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetAudience: {
    type: String,
    enum: ['all_students', 'specific_class', 'specific_students', 'grade_level', 'whole_school'],
    default: 'specific_class',
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Duration in days
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium',
  },
  points: {
    type: Number,
    default: 20,
  },
  xpReward: {
    type: Number,
    default: 10,
  },
  coinReward: {
    type: Number,
    default: 5,
  },
  badges: [{
    _id: String,
    name: String,
    description: String,
    icon: String,
  }],
  requirements: [{
    type: String,
    description: String,
    mandatory: Boolean,
  }],
  instructions: {
    type: String,
    required: true,
  },
  resources: [{
    name: String,
    url: String,
    type: String, // 'file', 'link', 'video', 'document'
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'active', 'completed', 'cancelled', 'expired'],
    default: 'published',
  },
  participants: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    joinedAt: Date,
    status: {
      type: String,
      enum: ['joined', 'in_progress', 'completed', 'abandoned'],
      default: 'joined',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    submittedAt: Date,
    submission: {
      content: String,
      attachments: [{
        filename: String,
        url: String,
      }],
    },
    grade: Number,
    feedback: String,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    gradedAt: Date,
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'class_only', 'school_only'],
    default: 'class_only',
  },
  maxParticipants: {
    type: Number,
  },
  allowLateJoin: {
    type: Boolean,
    default: true,
  },
  autoGrade: {
    type: Boolean,
    default: false,
  },
  criteria: [{
    name: String,
    description: String,
    weight: Number,
    maxScore: Number,
  }],
}, {
  timestamps: true,
});

// Indexes for faster queries
teacherChallengeSchema.index({ tenantId: 1, createdBy: 1, status: 1 });
teacherChallengeSchema.index({ tenantId: 1, classId: 1, startDate: 1, endDate: 1 });
teacherChallengeSchema.index({ tenantId: 1, 'participants.studentId': 1, status: 1 });

const TeacherChallenge = mongoose.model('TeacherChallenge', teacherChallengeSchema);
export default TeacherChallenge;
