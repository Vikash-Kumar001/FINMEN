import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  // Asset Identification
  assetId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  assetType: {
    type: String,
    enum: ['device', 'license', 'lab_equipment', 'furniture', 'infrastructure', 'software', 'other'],
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['computer', 'tablet', 'mobile', 'printer', 'projector', 'server', 'network', 'lab_equipment', 'furniture', 'other'],
    default: 'other'
  },
  
  // Asset Details
  brand: String,
  model: String,
  serialNumber: {
    type: String,
    index: true
  },
  purchaseDate: Date,
  purchasePrice: Number,
  currentValue: Number,
  warrantyExpiry: Date,
  
  // Location & Assignment
  location: {
    building: String,
    room: String,
    floor: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  assignedTo: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    },
    department: String,
    assignedDate: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'reserved', 'retired', 'lost', 'damaged'],
    default: 'available',
    index: true
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'damaged'],
    default: 'good'
  },
  
  // License Information (for software/licenses)
  licenseDetails: {
    licenseType: {
      type: String,
      enum: ['perpetual', 'subscription', 'trial', 'open_source']
    },
    licenseKey: String,
    seats: Number,
    usedSeats: Number,
    expiryDate: Date,
    vendor: String,
    renewalDate: Date,
    cost: Number
  },
  
  // Maintenance
  maintenanceSchedule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'as_needed']
    },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    maintenanceHistory: [{
      date: Date,
      type: String,
      description: String,
      cost: Number,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      nextDue: Date
    }]
  },
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  tenantId: String,
  
  // Lab Specific (for lab equipment)
  labDetails: {
    labName: String,
    labType: String,
    safetyRequirements: [String],
    calibrationDate: Date,
    nextCalibrationDate: Date
  },
  
  // Depreciation
  depreciationMethod: String,
  depreciationRate: Number,
  accumulatedDepreciation: Number,
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  images: [String],
  documents: [String]
}, {
  timestamps: true
});

// Indexes
assetSchema.index({ organizationId: 1, status: 1 });
assetSchema.index({ assetType: 1, category: 1 });
assetSchema.index({ 'assignedTo.userId': 1 });

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;

