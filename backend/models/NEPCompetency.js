import mongoose from 'mongoose';

const nepCompetencySchema = new mongoose.Schema({
  // NEP Competency ID (unique identifier)
  competencyId: {
    type: String,
    required: true,
    unique: true,
    // Format: NEP-<Grade>-<Pillar>-<Number> e.g., "NEP-10-UVLS-001"
  },
  
  // Competency details
  title: {
    type: String,
    required: true,
  },
  description: String,
  
  // Classification
  grade: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  pillar: {
    type: String,
    enum: ['uvls', 'dcos', 'moral', 'ehe', 'crgc'],
    required: true,
  },
  
  // NEP 2020 Framework details
  learningOutcome: String,
  assessmentCriteria: [String],
  
  // Related competencies
  prerequisites: [{
    type: String, // competencyId
  }],
  relatedCompetencies: [{
    type: String, // competencyId
  }],
  
  // Difficulty & duration
  difficulty: {
    type: String,
    enum: ['foundation', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  recommendedHours: {
    type: Number,
    default: 1,
  },
  
  // Categorization
  domain: {
    type: String,
    enum: ['cognitive', 'affective', 'psychomotor'],
  },
  bloomLevel: {
    type: String,
    enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Official NEP reference
  nepReference: {
    document: String,
    section: String,
    page: Number,
  },
  
}, {
  timestamps: true,
});

// Indexes
nepCompetencySchema.index({ grade: 1, pillar: 1 });
nepCompetencySchema.index({ pillar: 1, isActive: 1 });

const NEPCompetency = mongoose.model('NEPCompetency', nepCompetencySchema);
export default NEPCompetency;

