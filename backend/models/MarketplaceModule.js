import mongoose from 'mongoose';

const marketplaceModuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    version: {
      type: String,
      required: true,
      default: '1.0.0'
    },
    type: {
      type: String,
      enum: ['inavora', 'third-party'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'active', 'archived'],
      default: 'pending'
    },
    // Approval details
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String,
    // Module metadata
    metadata: {
      category: {
        type: String,
        enum: ['Education', 'Science', 'Communication', 'Games', 'Utilities', 'Analytics', 'Other'],
        required: true
      },
      targetAge: String,
      languages: [String],
      tags: [String],
      thumbnail: String,
      previewUrl: String,
      screenshots: [String],
      videoDemo: String,
      documentation: String
    },
    // Business details
    revenueShare: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    pricing: {
      type: {
        type: String,
        enum: ['free', 'paid', 'subscription'],
        default: 'free'
      },
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    // Statistics
    stats: {
      downloads: {
        type: Number,
        default: 0
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      reviewCount: {
        type: Number,
        default: 0
      },
      activeUsers: {
        type: Number,
        default: 0
      }
    },
    // Catalog settings
    catalogSettings: {
      featured: {
        type: Boolean,
        default: false
      },
      featuredUntil: Date,
      promoted: {
        type: Boolean,
        default: false
      }
    },
    // Developer/Publisher info
    developer: {
      name: String,
      contact: String
    },
    // Audit trail
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
      metadata: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
marketplaceModuleSchema.index({ status: 1, type: 1 });
marketplaceModuleSchema.index({ 'metadata.category': 1 });
marketplaceModuleSchema.index({ 'metadata.tags': 1 });
marketplaceModuleSchema.index({ 'stats.rating': -1 });
marketplaceModuleSchema.index({ 'catalogSettings.featured': 1 });
// Text search index for full-text search
marketplaceModuleSchema.index({ name: 'text', description: 'text' });

const MarketplaceModule = mongoose.model('MarketplaceModule', marketplaceModuleSchema);
export default MarketplaceModule;

