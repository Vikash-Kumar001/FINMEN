import mongoose from 'mongoose';

const campaignTemplateSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['finance', 'mental_health', 'values', 'ai_literacy', 'environmental', 'health', 'safety'],
    required: true
  },
  gradeLevel: {
    type: String,
    enum: ['6-8', '9-12', 'all'],
    default: '6-8'
  },
  
  // Template Type
  templateType: {
    type: String,
    enum: ['public', 'custom', 'organization_specific'],
    default: 'public'
  },
  
  // Content & Assets
  content: {
    learningObjectives: [String],
    keyTopics: [String],
    activities: [{
      name: String,
      description: String,
      duration: Number, // in minutes
      type: {
        type: String,
        enum: ['quiz', 'game', 'simulation', 'discussion', 'project']
      }
    }],
    resources: [{
      type: {
        type: String,
        enum: ['video', 'document', 'image', 'link', 'audio']
      },
      title: String,
      url: String,
      description: String
    }],
    assessmentCriteria: [String]
  },
  
  // NEP Competency Mapping
  nepCompetencies: [{
    competency: String,
    domain: String,
    grade: String,
    learningOutcome: String
  }],
  
  // Duration & Structure
  estimatedDuration: {
    totalMinutes: Number,
    sessions: Number,
    sessionDuration: Number
  },
  
  // Rewards & Budget
  rewardStructure: {
    baseReward: Number, // HealCoins per completion
    bonusReward: Number, // HealCoins for excellence
    participationReward: Number // HealCoins for participation
  },
  
  // Requirements
  requirements: {
    minStudents: Number,
    maxStudents: Number,
    requiredEquipment: [String],
    prerequisites: [String],
    teacherTraining: {
      required: Boolean,
      duration: Number, // in minutes
      materials: [String]
    }
  },
  
  // Customization Options
  customizationOptions: {
    allowsModification: Boolean,
    customizableElements: [String], // ['content', 'duration', 'rewards', 'assessment']
    brandingOptions: {
      allowsCustomLogo: Boolean,
      allowsCustomColors: Boolean,
      allowsCustomMessaging: Boolean
    }
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  
  // Usage Statistics
  usageStats: {
    timesUsed: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    averageCompletionRate: { type: Number, default: 0 },
    averageEngagementScore: { type: Number, default: 0 }
  },
  
  // Status & Approval
  status: {
    type: String,
    enum: ['draft', 'under_review', 'approved', 'rejected', 'archived'],
    default: 'draft'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: String,
  
  // Version Control
  version: { type: Number, default: 1 },
  isLatest: { type: Boolean, default: true },
  parentTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CampaignTemplate'
  },
  
  // Tags for Discovery
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
}, {
  timestamps: true
});

// Indexes for better performance
campaignTemplateSchema.index({ category: 1, gradeLevel: 1 });
campaignTemplateSchema.index({ templateType: 1, status: 1 });
campaignTemplateSchema.index({ organizationId: 1, status: 1 });
campaignTemplateSchema.index({ tags: 1 });

// Virtual for calculating popularity score
campaignTemplateSchema.virtual('popularityScore').get(function() {
  return (this.usageStats.timesUsed * 0.4) + 
         (this.usageStats.successRate * 0.3) + 
         (this.usageStats.averageEngagementScore * 0.3);
});

// Pre-save middleware to update usage stats
campaignTemplateSchema.pre('save', function(next) {
  if (this.isNew) {
    this.usageStats = {
      timesUsed: 0,
      successRate: 0,
      averageCompletionRate: 0,
      averageEngagementScore: 0
    };
  }
  next();
});

const CampaignTemplate = mongoose.model('CampaignTemplate', campaignTemplateSchema);

export default CampaignTemplate;
