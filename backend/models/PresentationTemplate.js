import mongoose from 'mongoose';

const masterSlideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  layout: {
    type: String,
    enum: ['centered', 'left', 'right', 'two-column', 'three-column', 'title-only', 'title-content', 'content-caption', 'blank'],
    default: 'centered'
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  titleColor: {
    type: String,
    default: '#000000'
  },
  titleSize: {
    type: Number,
    default: 44
  },
  fontSize: {
    type: Number,
    default: 24
  },
  header: {
    enabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    fontSize: {
      type: Number,
      default: 12
    },
    color: {
      type: String,
      default: '#666666'
    }
  },
  footer: {
    enabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    fontSize: {
      type: Number,
      default: 12
    },
    color: {
      type: String,
      default: '#666666'
    }
  },
  slideNumber: {
    enabled: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      enum: ['bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left', 'top-center'],
      default: 'bottom-right'
    },
    fontSize: {
      type: Number,
      default: 14
    },
    color: {
      type: String,
      default: '#666666'
    }
  },
  backgroundImage: {
    type: String,
    default: null
  }
}, { _id: true });

const presentationTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['business', 'education', 'marketing', 'creative', 'minimal', 'professional', 'custom'],
    default: 'custom'
  },
  theme: {
    type: String,
    enum: ['default', 'dark', 'light', 'colorful', 'minimal', 'professional', 'modern', 'classic', 'corporate', 'creative'],
    default: 'default'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  masterSlides: [masterSlideSchema],
  defaultLayout: {
    type: String,
    default: 'centered'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes
presentationTemplateSchema.index({ category: 1, isPublic: 1 });
presentationTemplateSchema.index({ theme: 1 });
presentationTemplateSchema.index({ isSystem: 1, isPublic: 1 });

const PresentationTemplate = mongoose.model('PresentationTemplate', presentationTemplateSchema);

export default PresentationTemplate;

