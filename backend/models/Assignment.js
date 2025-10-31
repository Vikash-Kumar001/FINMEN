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
  assignedToClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
  }],
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
    enum: ['grading', 'approval', 'review', 'homework', 'project', 'test', 'quiz', 'classwork'],
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
  // Soft delete fields for teacher-specific deletion
  hiddenFromTeacher: {
    type: Boolean,
    default: false,
  },
  hiddenFromStudents: {
    type: Boolean,
    default: false,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deletedAt: {
    type: Date,
  },
  deleteType: {
    type: String,
    enum: ['soft_teacher', 'soft_students', 'hard'],
    default: null,
  },
  // List of students who have hidden this assignment from their view
  hiddenFromStudentsList: [{
    type: String, // Student IDs as strings
  }],
  
  // Template-based assignment fields
  questions: [{
    type: {
      type: String,
      enum: [
        'multiple_choice',
        'true_false',
        'short_answer',
        'essay',
        'fill_in_blank',
        'matching',
        'problem_solving',
        'word_problem',
        'research_question',
        'presentation',
        'reflection'
      ],
      required: true
    },
    question: {
      type: String,
      required: function() {
        // For project assignments, question field is not required if it's a task type
        return !['research_question', 'presentation', 'reflection'].includes(this.type);
      }
    },
    options: [mongoose.Schema.Types.Mixed], // Can be strings for multiple choice or objects for matching
    correctAnswer: mongoose.Schema.Types.Mixed, // Can be string, number, boolean, or array
    points: {
      type: Number,
      default: 1
    },
    explanation: String,
    required: {
      type: Boolean,
      default: true
    },
    timeLimit: {
      type: Number,
      default: 0 // in minutes, 0 = no limit
    }
  }],
  questionCount: {
    type: Number,
    default: 0
  },
  instructions: {
    type: String,
    default: "Complete all questions carefully."
  },
  gradingType: {
    type: String,
    enum: ['auto', 'manual', 'mixed'],
    default: 'auto'
  },
  allowRetake: {
    type: Boolean,
    default: true
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  
  // Project-specific fields
  projectMode: {
    type: String,
    enum: ['instructions', 'virtual'],
    default: 'instructions'
  },
  projectData: {
    mode: {
      type: String,
      enum: ['instructions', 'virtual'],
      default: 'instructions'
    },
    instructions: String,
    deliverables: String,
    resources: String,
    deadline: Date,
    duration: Number, // in days
    groupSize: {
      type: String,
      enum: ['individual', 'pairs', 'small', 'large'],
      default: 'individual'
    },
    submissionRequirements: String
  },
  
}, {
  timestamps: true,
});

// Indexes for faster queries
assignmentSchema.index({ tenantId: 1, teacherId: 1, status: 1 });
assignmentSchema.index({ tenantId: 1, classId: 1, dueDate: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;

