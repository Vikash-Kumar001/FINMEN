import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
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
    hostelName: {
      type: String,
      required: true,
    },
    hostelType: {
      type: String,
      enum: ["Boys", "Girls", "Co-ed"],
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    contactInfo: {
      phone: String,
      email: String,
      wardenName: String,
    },
    blocks: [{
      blockName: {
        type: String,
        required: true,
      },
      floors: [{
        floorNumber: {
          type: Number,
          required: true,
        },
        rooms: [{
          roomNumber: {
            type: String,
            required: true,
          },
          roomType: {
            type: String,
            enum: ["Single", "Double", "Triple", "Dormitory"],
            required: true,
          },
          capacity: {
            type: Number,
            required: true,
          },
          currentOccupancy: {
            type: Number,
            default: 0,
          },
          isAvailable: {
            type: Boolean,
            default: true,
          },
          residents: [{
            studentId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "SchoolStudent",
            },
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            allottedDate: {
              type: Date,
              default: Date.now,
            },
            vacatedDate: Date,
            isActive: {
              type: Boolean,
              default: true,
            },
          }],
        }],
      }],
    }],
    feeStructure: {
      admissionFee: {
        type: Number,
        default: 0,
      },
      securityDeposit: {
        type: Number,
        default: 0,
      },
      maintenanceFee: {
        type: Number,
        default: 0,
      },
      messFee: {
        type: Number,
        default: 0,
      },
      electricityCharges: {
        type: String,
        enum: ["Included", "Extra", "Per Unit"],
        default: "Included",
      },
      waterCharges: {
        type: String,
        enum: ["Included", "Extra"],
        default: "Included",
      },
    },
    rules: {
      checkInTime: String,
      checkOutTime: String,
      visitorPolicy: String,
      noisePolicy: String,
      smokingPolicy: String,
      alcoholPolicy: String,
      petPolicy: String,
      other: [String],
    },
    totalCapacity: {
      type: Number,
      default: 0,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
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
hostelSchema.index({ tenantId: 1, hostelName: 1 });
hostelSchema.index({ tenantId: 1, hostelType: 1, isActive: 1 });
hostelSchema.index({ "blocks.floors.rooms.isAvailable": 1 });

// Calculate total capacity and occupancy
hostelSchema.pre("save", function(next) {
  let totalCapacity = 0;
  let currentOccupancy = 0;

  this.blocks.forEach(block => {
    block.floors.forEach(floor => {
      floor.rooms.forEach(room => {
        totalCapacity += room.capacity;
        currentOccupancy += room.currentOccupancy;
      });
    });
  });

  this.totalCapacity = totalCapacity;
  this.currentOccupancy = currentOccupancy;
  next();
});

// Ensure tenant isolation
hostelSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const Hostel = mongoose.model("Hostel", hostelSchema);
export default Hostel;