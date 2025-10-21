import mongoose from 'mongoose';

const cobrandingLegalSchema = new mongoose.Schema({
  // Partnership Information
  partnerName: { type: String, required: true },
  partnerType: {
    type: String,
    enum: ['corporate', 'ngo', 'educational_institution', 'government', 'individual'],
    required: true
  },
  
  // Contact Information
  contactInfo: {
    primaryContact: {
      name: String,
      email: String,
      phone: String,
      designation: String
    },
    secondaryContact: {
      name: String,
      email: String,
      phone: String,
      designation: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    website: String,
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String
    }
  },
  
  // Partnership Details
  partnershipDetails: {
    partnershipType: {
      type: String,
      enum: ['financial_sponsor', 'content_partner', 'implementation_partner', 'technology_partner', 'strategic_alliance'],
      required: true
    },
    partnershipScope: {
      type: String,
      enum: ['national', 'regional', 'state', 'district', 'local'],
      default: 'regional'
    },
    targetAudience: [String],
    partnershipGoals: [String],
    expectedOutcomes: [String]
  },
  
  // Contract and Legal Information
  contractInfo: {
    contractId: { type: String, unique: true },
    contractType: {
      type: String,
      enum: ['mou', 'sponsorship_agreement', 'implementation_contract', 'service_agreement', 'partnership_agreement'],
      required: true
    },
    contractStatus: {
      type: String,
      enum: ['draft', 'under_review', 'negotiating', 'signed', 'active', 'expired', 'terminated', 'renewed'],
      default: 'draft'
    },
    startDate: Date,
    endDate: Date,
    renewalDate: Date,
    contractValue: {
      amount: Number,
      currency: { type: String, default: 'INR' },
      paymentTerms: String,
      paymentSchedule: [{
        installment: Number,
        amount: Number,
        dueDate: Date,
        status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' }
      }]
    },
    contractTerms: {
      duration: Number, // in months
      autoRenewal: { type: Boolean, default: false },
      terminationClause: String,
      forceMajeure: String,
      confidentiality: String,
      intellectualProperty: String
    }
  },
  
  // Legal Compliance
  legalCompliance: {
    isCompliant: { type: Boolean, default: false },
    complianceStatus: {
      type: String,
      enum: ['compliant', 'non_compliant', 'under_review', 'requires_action'],
      default: 'under_review'
    },
    complianceChecks: [{
      checkType: String,
      status: { type: String, enum: ['passed', 'failed', 'pending', 'not_applicable'] },
      checkedAt: Date,
      checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: String,
      nextCheck: Date
    }],
    legalDocuments: [{
      documentType: { type: String, enum: ['contract', 'mou', 'nda', 'certificate', 'license', 'permit', 'other'] },
      documentName: String,
      documentUrl: String,
      uploadedAt: { type: Date, default: Date.now() },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      expiryDate: Date,
      isActive: { type: Boolean, default: true }
    }],
    lastReviewed: Date,
    nextReview: Date,
    complianceNotes: String
  },
  
  // Brand Assets and Guidelines
  brandAssets: {
    logo: {
      primaryLogo: String,
      secondaryLogo: String,
      logoVariations: [String],
      logoGuidelines: String,
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      approvedAt: Date
    },
    brandColors: [{
      colorName: String,
      hexCode: String,
      usage: String
    }],
    typography: {
      primaryFont: String,
      secondaryFont: String,
      fontGuidelines: String
    },
    brandGuidelines: String,
    assetLibrary: [{
      assetType: { type: String, enum: ['logo', 'banner', 'brochure', 'presentation', 'video', 'audio', 'document', 'other'] },
      assetName: String,
      assetUrl: String,
      description: String,
      usage: String,
      restrictions: String,
      uploadedAt: { type: Date, default: Date.now() },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
  },
  
  // Campaign and Project Associations
  associatedCampaigns: [{
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    campaignName: String,
    associationType: { type: String, enum: ['sponsor', 'partner', 'supporter', 'implementer'] },
    contribution: String,
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['active', 'completed', 'paused', 'cancelled'] }
  }],
  
  // Performance and Impact Tracking
  performanceMetrics: {
    totalInvestment: { type: Number, default: 0 },
    totalReach: { type: Number, default: 0 },
    totalImpact: { type: Number, default: 0 },
    satisfactionScore: { type: Number, default: 0 },
    renewalLikelihood: { type: Number, default: 0 }, // 0-100 percentage
    lastAssessment: Date,
    nextAssessment: Date
  },
  
  // Communication and Updates
  communication: {
    lastContact: Date,
    nextContact: Date,
    contactFrequency: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'as_needed'] },
    communicationLog: [{
      date: { type: Date, default: Date.now() },
      type: { type: String, enum: ['email', 'phone', 'meeting', 'video_call', 'other'] },
      subject: String,
      notes: String,
      participants: [String],
      followUpRequired: { type: Boolean, default: false },
      followUpDate: Date
    }],
    reportingSchedule: {
      frequency: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'annually'] },
      lastReport: Date,
      nextReport: Date,
      reportTemplate: String
    }
  },
  
  // Risk Management
  riskAssessment: {
    risks: [{
      riskType: String,
      description: String,
      likelihood: { type: String, enum: ['low', 'medium', 'high'] },
      impact: { type: String, enum: ['low', 'medium', 'high'] },
      mitigation: String,
      status: { type: String, enum: ['identified', 'monitoring', 'mitigated', 'resolved'] },
      lastAssessed: Date,
      nextAssessment: Date
    }],
    lastRiskAssessment: Date,
    nextRiskAssessment: Date
  },
  
  // Metadata
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Status and Flags
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated', 'expired'],
    default: 'active'
  },
  isActive: { type: Boolean, default: true },
  
  // Tags and Categories
  tags: [String],
  categories: [String],
  
  // Notifications and Alerts
  notifications: [{
    type: String,
    message: String,
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'] },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
  }]

}, {
  timestamps: true
});

// Indexes for better performance
cobrandingLegalSchema.index({ organizationId: 1, status: 1 });
cobrandingLegalSchema.index({ 'contractInfo.contractStatus': 1 });
cobrandingLegalSchema.index({ partnerName: 1 });
cobrandingLegalSchema.index({ 'contractInfo.startDate': 1, 'contractInfo.endDate': 1 });

// Pre-save middleware to generate contract ID
cobrandingLegalSchema.pre('save', async function(next) {
  if (!this.contractInfo.contractId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 9);
    this.contractInfo.contractId = `CONTRACT_${timestamp}_${random}`.toUpperCase();
  }
  
  // Calculate next review date (6 months from now)
  if (!this.legalCompliance.nextReview) {
    this.legalCompliance.nextReview = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Virtual for contract duration in days
cobrandingLegalSchema.virtual('contractDuration').get(function() {
  if (this.contractInfo.startDate && this.contractInfo.endDate) {
    return Math.ceil((this.contractInfo.endDate - this.contractInfo.startDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for days until expiry
cobrandingLegalSchema.virtual('daysUntilExpiry').get(function() {
  if (this.contractInfo.endDate) {
    const now = new Date();
    const diffTime = this.contractInfo.endDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Static method to get expiring contracts
cobrandingLegalSchema.statics.getExpiringContracts = async function(days = 30) {
  const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  
  return await this.find({
    'contractInfo.endDate': { $lte: expiryDate, $gte: new Date() },
    'contractInfo.contractStatus': 'active'
  });
};

// Instance method to add communication log entry
cobrandingLegalSchema.methods.addCommunicationLog = function(entry) {
  this.communication.communicationLog.push({
    ...entry,
    date: new Date()
  });
  this.communication.lastContact = new Date();
  return this.save();
};

// Instance method to add risk
cobrandingLegalSchema.methods.addRisk = function(risk) {
  this.riskAssessment.risks.push({
    ...risk,
    lastAssessed: new Date()
  });
  this.riskAssessment.lastRiskAssessment = new Date();
  return this.save();
};

const CobrandingLegal = mongoose.model('CobrandingLegal', cobrandingLegalSchema);

export default CobrandingLegal;
