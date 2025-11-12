import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  slideNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  slideType: {
    type: String,
    enum: ['title', 'content', 'bullet', 'image', 'video', 'blank'],
    default: 'content'
  },
  layout: {
    type: String,
    enum: ['centered', 'left', 'right', 'two-column', 'three-column', 'title-only', 'title-content', 'content-caption', 'blank'],
    default: 'centered'
  },
  masterLayoutId: {
    type: String,
    default: null
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  fontSize: {
    type: Number,
    default: 24
  },
  showSlideNumber: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: false
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  headerText: {
    type: String,
    default: ''
  },
  footerText: {
    type: String,
    default: ''
  },
  images: [{
    url: String,
    alt: String,
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: Number,
      height: Number
    },
    crop: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    },
    backgroundRemoved: {
      type: Boolean,
      default: false
    },
    processedUrl: String,
    zIndex: {
      type: Number,
      default: 0
    }
  }],
  videos: [{
    url: String,
    thumbnail: String,
    autoplay: {
      type: Boolean,
      default: false
    }
  }],
  textBoxes: [{
    id: String,
    content: String,
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: Number,
      height: Number
    },
    style: {
      fontSize: Number,
      fontFamily: String,
      color: String,
      backgroundColor: String,
      borderColor: String,
      borderWidth: Number,
      borderRadius: Number,
      textAlign: String,
      fontWeight: String,
      fontStyle: String,
      textDecoration: String
    },
    zIndex: {
      type: Number,
      default: 0
    }
  }],
  shapes: [{
    id: String,
    type: {
      type: String,
      enum: ['rectangle', 'circle', 'ellipse', 'triangle', 'line', 'arrow', 'polygon', 'star', 'heart', 'diamond']
    },
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: Number,
      height: Number
    },
    style: {
      fill: String,
      stroke: String,
      strokeWidth: Number,
      opacity: Number,
      rotation: Number
    },
    points: [{
      x: Number,
      y: Number
    }],
    zIndex: {
      type: Number,
      default: 0
    }
  }],
  icons: [{
    id: String,
    name: String,
    library: {
      type: String,
      enum: ['lucide', 'font-awesome', 'material', 'feather'],
      default: 'lucide'
    },
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: Number,
      height: Number
    },
    style: {
      color: String,
      fill: String,
      strokeWidth: Number,
      rotation: Number
    },
    zIndex: {
      type: Number,
      default: 0
    }
  }],
  smartArt: [{
    id: String,
    type: {
      type: String,
      enum: ['process', 'cycle', 'hierarchy', 'relationship', 'matrix', 'pyramid', 'list', 'picture']
    },
    data: [{
      text: String,
      children: [mongoose.Schema.Types.Mixed]
    }],
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: Number,
      height: Number
    },
    style: {
      colorScheme: String,
      layout: String,
      direction: String
    },
    zIndex: {
      type: Number,
      default: 0
    }
  }],
  charts: [{
    id: String,
    type: {
      type: String,
      enum: ['bar', 'line', 'pie', 'doughnut', 'area', 'radar', 'scatter', 'bubble', 'polar']
    },
    data: {
      labels: [String],
      datasets: [{
        label: String,
        data: [Number],
        backgroundColor: [String],
        borderColor: [String],
        borderWidth: Number
      }]
    },
    options: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: Number,
      height: Number
    },
    zIndex: {
      type: Number,
      default: 0
    }
  }],
  tables: [{
    id: String,
    rows: Number,
    cols: Number,
    data: [[String]],
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: Number,
      height: Number
    },
    style: {
      headerBackground: String,
      headerTextColor: String,
      cellBackground: String,
      cellTextColor: String,
      borderColor: String,
      borderWidth: Number,
      fontSize: Number,
      fontFamily: String
    },
    zIndex: {
      type: Number,
      default: 0
    }
  }],
  equations: [{
    id: String,
    latex: String,
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: Number,
      height: Number
    },
    style: {
      fontSize: Number,
      color: String,
      backgroundColor: String
    },
    zIndex: {
      type: Number,
      default: 0
    }
  }],
  symbols: [{
    id: String,
    symbol: String,
    category: {
      type: String,
      enum: ['math', 'greek', 'arrows', 'operators', 'relations', 'special', 'currency', 'punctuation']
    },
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: Number,
      height: Number
    },
    style: {
      fontSize: Number,
      color: String
    },
    zIndex: {
      type: Number,
      default: 0
    }
  }],
  bullets: [{
    text: String,
    level: {
      type: Number,
      default: 0
    }
  }],
  notes: {
    type: String,
    default: ''
  },
  animations: [{
    element: String,
    type: String,
    duration: Number,
    delay: Number
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: true });

const presentationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  slides: [slideSchema],
  theme: {
    type: String,
    enum: ['default', 'dark', 'light', 'colorful', 'minimal', 'professional', 'modern', 'classic', 'corporate', 'creative'],
    default: 'default'
  },
  template: {
    type: String,
    default: null
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PresentationTemplate',
    default: null
  },
  masterSlides: [{
    name: String,
    layout: String,
    backgroundColor: String,
    textColor: String,
    header: {
      enabled: Boolean,
      text: String,
      fontSize: Number,
      color: String
    },
    footer: {
      enabled: Boolean,
      text: String,
      fontSize: Number,
      color: String
    },
    slideNumber: {
      enabled: Boolean,
      position: {
        type: String,
        enum: ['bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left', 'top-center'],
        default: 'bottom-right'
      },
      fontSize: Number,
      color: String
    },
    backgroundImage: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  defaultMasterLayout: {
    type: String,
    default: 'default'
  },
  numbering: {
    enabled: {
      type: Boolean,
      default: true
    },
    startFrom: {
      type: Number,
      default: 1
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
  headers: {
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
    },
    position: {
      type: String,
      enum: ['top-left', 'top-center', 'top-right'],
      default: 'top-center'
    }
  },
  footers: {
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
    },
    position: {
      type: String,
      enum: ['bottom-left', 'bottom-center', 'bottom-right'],
      default: 'bottom-center'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  shareCode: {
    type: String,
    unique: true,
    sparse: true
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    default: 'general'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 0
  },
  lastViewed: {
    type: Date
  },
  currentSlide: {
    type: Number,
    default: 0
  },
  isPresenting: {
    type: Boolean,
    default: false
  },
  presentationSessionId: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
presentationSchema.index({ createdBy: 1, createdAt: -1 });
presentationSchema.index({ isPublic: 1, isPublished: 1 });
presentationSchema.index({ tags: 1 });
presentationSchema.index({ category: 1 });

// Generate unique share code
presentationSchema.methods.generateShareCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Add slide
presentationSchema.methods.addSlide = function(slideData) {
  const maxSlideNumber = this.slides.length > 0 
    ? Math.max(...this.slides.map(s => s.slideNumber))
    : -1;
  
  const newSlide = {
    ...slideData,
    slideNumber: slideData.slideNumber !== undefined 
      ? slideData.slideNumber 
      : maxSlideNumber + 1
  };
  
  this.slides.push(newSlide);
  return this.save();
};

// Remove slide
presentationSchema.methods.removeSlide = function(slideNumber) {
  this.slides = this.slides.filter(s => s.slideNumber !== slideNumber);
  // Reorder remaining slides
  this.slides.forEach((slide, index) => {
    slide.slideNumber = index;
  });
  return this.save();
};

// Update slide
presentationSchema.methods.updateSlide = function(slideNumber, updates) {
  const slide = this.slides.find(s => s.slideNumber === slideNumber);
  if (slide) {
    Object.assign(slide, updates);
    return this.save();
  }
  throw new Error('Slide not found');
};

// Generate share code if not exists
presentationSchema.pre('save', function(next) {
  if (this.isPublic && !this.shareCode) {
    let code;
    do {
      code = this.generateShareCode();
    } while (this.constructor.findOne({ shareCode: code }));
    this.shareCode = code;
  }
  next();
});

const Presentation = mongoose.model('Presentation', presentationSchema);

export default Presentation;

