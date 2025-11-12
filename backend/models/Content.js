import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['lesson', 'template', 'module', 'course', 'resource', 'activity'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  
  // Content Details
  content: {
    type: mongoose.Schema.Types.Mixed, // Can store HTML, JSON, or other content formats
    required: true
  },
  thumbnail: String,
  previewUrl: String,
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  
  // Approval Workflow
  status: {
    type: String,
    enum: ['draft', 'pending', 'under_review', 'approved', 'rejected', 'published', 'archived'],
    default: 'draft'
  },
  submittedForReview: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,
  rejectionReason: String,
  publishedAt: Date,
  
  // Age Appropriateness
  ageRating: {
    type: String,
    enum: ['all', '3+', '7+', '10+', '13+', '16+', '18+'],
    default: 'all'
  },
  minAge: Number,
  maxAge: Number,
  ageVerificationRequired: {
    type: Boolean,
    default: false
  },
  
  // Region Restrictions
  allowedRegions: [{
    type: String // Country codes or region names
  }],
  blockedRegions: [{
    type: String
  }],
  regionRestrictions: [{
    region: String,
    reason: String,
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    blockedAt: Date
  }],
  
  // Creator Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  tenantId: String,
  
  // Content Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    engagementScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    averageTimeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    lastViewedAt: Date,
    usageByRegion: [{
      region: String,
      views: Number,
      completions: Number
    }],
    usageByAge: [{
      ageGroup: String,
      views: Number,
      completions: Number
    }]
  },
  
  // Metadata
  tags: [String],
  keywords: [String],
  language: {
    type: String,
    default: 'en'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: Number, // in minutes
  estimatedDuration: Number,
  
  // Flags and Moderation
  flaggedForReview: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  flaggedAt: Date,
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  parentVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  
  // Audit Trail
  auditTrail: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    changes: mongoose.Schema.Types.Mixed,
    reason: String
  }]
}, {
  timestamps: true
});

// Indexes
contentSchema.index({ status: 1, type: 1 });
contentSchema.index({ createdBy: 1, status: 1 });
contentSchema.index({ organizationId: 1, status: 1 });
contentSchema.index({ category: 1, status: 1 });
contentSchema.index({ ageRating: 1, status: 1 });
contentSchema.index({ 'analytics.engagementScore': -1 });
contentSchema.index({ publishedAt: -1 });

const Content = mongoose.model('Content', contentSchema);
export default Content;

