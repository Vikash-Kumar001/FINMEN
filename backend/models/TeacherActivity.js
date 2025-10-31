import mongoose from 'mongoose';

const teacherActivitySchema = new mongoose.Schema({
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
    enum: ['lesson', 'workshop', 'field_trip', 'experiment', 'discussion', 'presentation', 'group_work', 'individual_work', 'assessment', 'other'],
    default: 'lesson',
  },
  subject: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
  },
  className: {
    type: String,
    required: true,
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
  scheduledDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  location: {
    type: String,
    default: 'Classroom',
  },
  objectives: [{
    type: String,
    description: String,
  }],
  learningOutcomes: [{
    type: String,
    description: String,
  }],
  prerequisites: [String],
  materials: [{
    name: String,
    description: String,
    quantity: Number,
    provided: Boolean,
  }],
  instructions: {
    type: String,
    required: true,
  },
  steps: [{
    stepNumber: Number,
    title: String,
    description: String,
    duration: Number, // Duration in minutes
    resources: [{
      name: String,
      url: String,
      type: String,
    }],
  }],
  resources: [{
    name: String,
    url: String,
    type: String, // 'file', 'link', 'video', 'document', 'image'
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date,
  }],
  points: {
    type: Number,
    default: 15,
  },
  xpReward: {
    type: Number,
    default: 8,
  },
  coinReward: {
    type: Number,
    default: 3,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'in_progress', 'completed', 'cancelled'],
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
      enum: ['registered', 'attended', 'completed', 'absent'],
      default: 'registered',
    },
    attendance: {
      checkedIn: Date,
      checkedOut: Date,
      duration: Number, // Actual duration in minutes
    },
    participation: {
      score: Number,
      comments: String,
      ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      ratedAt: Date,
    },
    submission: {
      content: String,
      attachments: [{
        filename: String,
        url: String,
      }],
      submittedAt: Date,
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
  requiresAttendance: {
    type: Boolean,
    default: true,
  },
  allowSubmission: {
    type: Boolean,
    default: false,
  },
  submissionDeadline: Date,
  gradingCriteria: [{
    name: String,
    description: String,
    weight: Number,
    maxScore: Number,
  }],
}, {
  timestamps: true,
});

// Indexes for faster queries
teacherActivitySchema.index({ tenantId: 1, createdBy: 1, status: 1 });
teacherActivitySchema.index({ tenantId: 1, classId: 1, scheduledDate: 1 });
teacherActivitySchema.index({ tenantId: 1, 'participants.studentId': 1, status: 1 });

const TeacherActivity = mongoose.model('TeacherActivity', teacherActivitySchema);
export default TeacherActivity;
