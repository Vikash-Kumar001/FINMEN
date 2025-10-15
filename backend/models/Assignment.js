import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
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
    required: true,
  },
  section: {
    type: String,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  totalMarks: {
    type: Number,
    default: 100,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  type: {
    type: String,
    enum: ['grading', 'approval', 'review', 'homework', 'project', 'test'],
    default: 'homework',
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue', 'draft', 'published', 'pending_approval', 'approved', 'rejected', 'changes_requested'],
    default: 'pending',
  },
  requestedChanges: {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    requestedAt: Date,
    changes: [String],
    comments: String,
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectedAt: Date,
  submissions: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    submittedAt: Date,
    marks: Number,
    feedback: String,
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted',
    },
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Advanced Wizard Fields
  scope: {
    type: String,
    enum: ['single_class', 'multiple_classes', 'whole_school', 'csr', 'state'],
    default: 'single_class'
  },
  scopeClasses: [{
    id: String,
    name: String
  }],
  approvalRequired: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  
  // Template
  templateType: {
    type: String,
    enum: ['blank', 'template']
  },
  templateId: String,
  
  // Modules
  modules: [{
    type: {
      type: String,
      enum: ['question_bank', 'inavora']
    },
    id: String,
    title: String,
    module_id: String,
    questionCount: Number,
    duration: Number
  }],
  
  // Rules
  startTime: Date,
  endTime: Date,
  maxAttempts: Number,
  randomizeQuestions: Boolean,
  gradingType: {
    type: String,
    enum: ['auto', 'manual'],
    default: 'auto'
  },
  accessibility: {
    allowScreenReader: Boolean,
    extraTime: Boolean,
    textToSpeech: Boolean
  },
  
  // Participants
  participantMode: {
    type: String,
    enum: ['all', 'filtered', 'manual', 'ai_suggested']
  },
  selectedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  filterTags: [String],
  aiSuggestions: [{
    studentId: mongoose.Schema.Types.ObjectId,
    studentName: String,
    weakPillars: [String],
    confidence: Number
  }],
  
  // Rewards
  healCoinsReward: Number,
  badges: [{
    _id: String,
    name: String,
    description: String
  }],
  certificate: Boolean,
}, {
  timestamps: true,
});

// Indexes for faster queries
assignmentSchema.index({ tenantId: 1, teacherId: 1, status: 1 });
assignmentSchema.index({ tenantId: 1, classId: 1, dueDate: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;

