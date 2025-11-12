import mongoose from 'mongoose';

const dataExportSchema = new mongoose.Schema({
  // Export Identification
  exportName: {
    type: String,
    required: true,
    trim: true
  },
  exportType: {
    type: String,
    enum: ['research', 'analytics', 'compliance', 'backup', 'custom'],
    required: true
  },
  
  // Data Selection
  dataScope: {
    type: String,
    enum: ['all', 'organizations', 'users', 'activities', 'custom'],
    required: true
  },
  filters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Anonymization
  anonymize: {
    type: Boolean,
    default: true
  },
  anonymizationRules: {
    removePII: Boolean,
    hashIdentifiers: Boolean,
    aggregateData: Boolean,
    dateOffset: Number // days to offset dates
  },
  
  // Export Format
  format: {
    type: String,
    enum: ['csv', 'json', 'excel', 'parquet'],
    default: 'csv'
  },
  
  // File Details
  fileUrl: String,
  fileSize: Number, // bytes
  fileName: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'expired'],
    default: 'pending',
    index: true
  },
  
  // Processing
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalRecords: Number,
  processedRecords: Number,
  
  // Expiry
  expiresAt: Date,
  accessCount: {
    type: Number,
    default: 0
  },
  lastAccessed: Date,
  
  // Research Sandbox
  isSandbox: {
    type: Boolean,
    default: false
  },
  sandboxAccess: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    accessGranted: Date,
    expiresAt: Date
  }],
  
  // Created By
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Metadata
  description: String,
  tags: [String]
}, {
  timestamps: true
});

dataExportSchema.index({ status: 1, createdAt: -1 });
dataExportSchema.index({ exportType: 1 });
dataExportSchema.index({ expiresAt: 1 });

const DataExport = mongoose.model('DataExport', dataExportSchema);
export default DataExport;

