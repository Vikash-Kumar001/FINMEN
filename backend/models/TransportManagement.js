import mongoose from "mongoose";

const transportRouteSchema = new mongoose.Schema(
  {
    // Tenant Information
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    tenantId: {
      type: String,
      required: true,
    },
    routeNumber: {
      type: String,
      required: true,
    },
    routeName: {
      type: String,
      required: true,
    },
    routeStops: [{
      stopName: {
        type: String,
        required: true,
      },
      stopOrder: {
        type: Number,
        required: true,
      },
      distanceFromStart: {
        type: Number, // in KM
        required: true,
      },
      estimatedArrivalTime: String, // in HH:MM format
      students: [{
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'studentType'
        },
        studentType: {
          type: String,
          enum: ['SchoolStudent'],
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        boardingPoint: {
          type: String,
          enum: ["Morning", "Evening", "Both"],
          default: "Both",
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        joinedDate: {
          type: Date,
          default: Date.now,
        },
      }],
    }],
    vehicleDetails: {
      vehicleNumber: {
        type: String,
        required: true,
        unique: true,
      },
      vehicleType: {
        type: String,
        enum: ["Bus", "Van", "Car", "Other"],
        required: true,
      },
      make: String,
      model: String,
      capacity: {
        type: Number,
        required: true,
      },
      currentOccupancy: {
        type: Number,
        default: 0,
      },
      insuranceExpiry: Date,
      fitnessExpiry: Date,
      permitExpiry: Date,
    },
    driverDetails: {
      driverName: {
        type: String,
        required: true,
      },
      driverPhone: {
        type: String,
        required: true,
      },
      licenseNumber: String,
      licenseExpiry: Date,
      alternatePhone: String,
    },
    schedule: {
      operatingDays: [{
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      }],
      morningStartTime: String,
      morningEndTime: String,
      eveningStartTime: String,
      eveningEndTime: String,
      totalDistance: Number, // in KM
      estimatedDuration: Number, // in minutes
    },
    feeStructure: {
      monthlyFee: {
        type: Number,
        required: true,
      },
      admissionFee: {
        type: Number,
        default: 0,
      },
      securityDeposit: {
        type: Number,
        default: 0,
      },
      fuelSurcharge: {
        type: Number,
        default: 0,
      },
    },
    maintenance: [{
      maintenanceDate: {
        type: Date,
        required: true,
      },
      maintenanceType: {
        type: String,
        enum: ["Regular Service", "Repair", "Emergency", "Annual Check"],
        required: true,
      },
      description: String,
      cost: Number,
      nextServiceDate: Date,
      serviceCenter: String,
      mechanicDetails: String,
    }],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Under Maintenance", "Retired"],
      default: "Active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
transportRouteSchema.index({ tenantId: 1, routeNumber: 1 }, { unique: true });
transportRouteSchema.index({ tenantId: 1, status: 1, isActive: 1 });
transportRouteSchema.index({ "vehicleDetails.vehicleNumber": 1 });
transportRouteSchema.index({ "driverDetails.driverPhone": 1 });

// Calculate current occupancy
transportRouteSchema.pre("save", function(next) {
  let totalStudents = 0;
  this.routeStops.forEach(stop => {
    totalStudents += stop.students.filter(student => student.isActive).length;
  });
  this.vehicleDetails.currentOccupancy = totalStudents;
  next();
});

// Ensure tenant isolation
transportRouteSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const TransportRoute = mongoose.model("TransportRoute", transportRouteSchema);
export default TransportRoute;