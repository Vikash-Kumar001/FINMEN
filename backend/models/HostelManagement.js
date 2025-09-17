import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      // index removed, only keep schema.index()
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    hostelName: {
      type: String,
      required: true,
      trim: true,
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
      landmark: String,
    },
    contactDetails: {
      wardenName: String,
      wardenPhone: String,
      wardenEmail: String,
      officePhone: String,
      emergencyContact: String,
    },
    facilities: {
      wifi: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      mess: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      library: { type: Boolean, default: false },
      commonRoom: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      security: { type: Boolean, default: true },
      powerBackup: { type: Boolean, default: false },
      waterSupply: { type: Boolean, default: true },
      other: [String],
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
            enum: ["Single", "Double", "Triple", "Quad"],
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
          monthlyRent: {
            type: Number,
            required: true,
          },
          securityDeposit: {
            type: Number,
            default: 0,
          },
          amenities: {
            ac: { type: Boolean, default: false },
            fan: { type: Boolean, default: true },
            bed: { type: Number, default: 1 },
            study_table: { type: Number, default: 1 },
            chair: { type: Number, default: 1 },
            wardrobe: { type: Number, default: 1 },
            bathroom: {
              type: String,
              enum: ["Attached", "Common"],
              default: "Common",
            },
          },
          isAvailable: {
            type: Boolean,
            default: true,
          },
          residents: [{
            studentId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "CollegeStudent",
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