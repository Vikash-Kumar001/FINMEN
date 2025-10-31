import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
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
    enum: ['homework', 'project', 'quiz', 'presentation', 'research', 'practical', 'other'],
    default: 'homework',
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
  assignedTo: {
    type: String,
    enum: ['all_students', 'specific_students', 'class'],
    default: 'class',
  },
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  assignedDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'in_progress', 'completed', 'cancelled'],
    default: 'published',
  },
  instructions: {
    type: String,
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
  points: {
    type: Number,
    default: 10,
  },
  xpReward: {
    type: Number,
    default: 5,
  },
  coinReward: {
    type: Number,
    default: 2,
  },
  submissions: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    submittedAt: Date,
    content: String,
    attachments: [{
      filename: String,
      url: String,
    }],
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late', 'rejected'],
      default: 'submitted',
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
    enum: ['public', 'private', 'class_only'],
    default: 'class_only',
  },
  allowLateSubmission: {
    type: Boolean,
    default: false,
  },
  latePenalty: {
    type: Number,
    default: 0, // Percentage penalty for late submission
  },
  maxAttempts: {
    type: Number,
    default: 1,
  },
  requirements: [{
    type: String,
    description: String,
    mandatory: Boolean,
  }],
}, {
  timestamps: true,
});

// Indexes for faster queries
taskSchema.index({ tenantId: 1, createdBy: 1, status: 1 });
taskSchema.index({ tenantId: 1, classId: 1, dueDate: 1 });
taskSchema.index({ tenantId: 1, assignedStudents: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
