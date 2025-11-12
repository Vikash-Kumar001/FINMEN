import mongoose from 'mongoose';

const communicationTemplateSchema = new mongoose.Schema({
  // Template Identification
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['fee_reminder', 'exam_notice', 'attendance_alert', 'announcement', 'general', 'event', 'custom'],
    default: 'general',
    index: true
  },
  
  // Template Content
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  bodyHtml: String, // HTML version
  
  // Channels
  channels: [{
    type: String,
    enum: ['email', 'sms', 'push', 'in_app'],
    required: true
  }],
  
  // Variables/Placeholders
  variables: [{
    name: String,
    description: String,
    example: String,
    required: Boolean
  }],
  
  // Default Recipients
  defaultRecipientType: {
    type: String,
    enum: ['all', 'students', 'teachers', 'parents', 'school_admins', 'custom']
  },
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  tenantId: String,
  isGlobal: {
    type: Boolean,
    default: false
  },
  
  // Usage Statistics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: Date,
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
    index: true
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes
communicationTemplateSchema.index({ category: 1, status: 1 });
communicationTemplateSchema.index({ isGlobal: 1, organizationId: 1 });

const CommunicationTemplate = mongoose.model('CommunicationTemplate', communicationTemplateSchema);
export default CommunicationTemplate;

