import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  // Vehicle Information
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  vehicleType: {
    type: String,
    enum: ['bus', 'van', 'car', 'other'],
    default: 'bus'
  },
  make: String,
  model: String,
  year: Number,
  capacity: {
    type: Number,
    required: true
  },
  
  // Driver Information
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  driverName: String,
  driverPhone: String,
  driverLicense: String,
  
  // Route Information
  routeName: {
    type: String,
    required: true
  },
  routeNumber: String,
  startLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  endLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  stops: [{
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    sequence: Number,
    arrivalTime: String
  }],
  
  // Schedule
  schedule: {
    morningPickup: String,
    morningDropoff: String,
    eveningPickup: String,
    eveningDropoff: String,
    daysOfWeek: [{
      type: Number, // 0-6 (Sunday-Saturday)
      required: true
    }]
  },
  
  // Current Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'off_duty'],
    default: 'active',
    index: true
  },
  currentLocation: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    lastUpdated: Date
  },
  
  // Students
  assignedStudents: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    stopName: String,
    pickupTime: String,
    dropoffTime: String
  }],
  
  // Organization Context
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  tenantId: String,
  
  // Maintenance & Compliance
  registrationNumber: String,
  insuranceExpiry: Date,
  permitExpiry: Date,
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date,
  mileage: Number,
  
  // Tracking
  trackingEnabled: {
    type: Boolean,
    default: false
  },
  trackingDeviceId: String,
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  tags: [String]
}, {
  timestamps: true
});

// Indexes
transportSchema.index({ organizationId: 1, status: 1 });
transportSchema.index({ routeName: 1 });
transportSchema.index({ driverId: 1 });

const Transport = mongoose.model('Transport', transportSchema);
export default Transport;

