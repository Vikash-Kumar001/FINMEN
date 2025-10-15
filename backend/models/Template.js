import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  tenantId: {
    type: String,
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
  category: {
    type: String,
    enum: ['assignment', 'quiz', 'project', 'test', 'homework', 'activity', 'lesson_plan'],
    required: true,
  },
  subject: {
    type: String,
  },
  gradeLevel: [{
    type: Number, // 1-12
  }],
  type: {
    type: String,
    enum: ['free', 'premium', 'custom'],
    default: 'free',
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  
  // Template content
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  // Questions bank
  questions: [{
    question: String,
    type: {
      type: String,
      enum: ['mcq', 'true_false', 'short_answer', 'long_answer', 'fill_blank'],
    },
    options: [String],
    correctAnswer: mongoose.Schema.Types.Mixed,
    marks: Number,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
  }],
  
  // Metadata
  duration: Number, // in minutes
  totalMarks: Number,
  passingMarks: Number,
  
  // Enhanced metadata for NEP & Pillar tagging
  metadata: {
    nepLinks: [{
      competency: String,
      link: String,
      description: String,
    }],
    pillarAlignment: [String], // ['uvls', 'dcos', 'moral', 'ehe', 'crgc']
  },
  
  // Usage stats
  usageCount: {
    type: Number,
    default: 0,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  
  // Creator info
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Approval status (for user-created templates)
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Visibility
  isPublic: {
    type: Boolean,
    default: false, // Only visible to the org/tenant
  },
  isGlobal: {
    type: Boolean,
    default: false, // Available to all schools (platform templates)
  },
  
  tags: [String],
  
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
templateSchema.index({ tenantId: 1, category: 1 });
templateSchema.index({ isGlobal: 1, type: 1 });
templateSchema.index({ createdBy: 1 });

const Template = mongoose.model('Template', templateSchema);
export default Template;

