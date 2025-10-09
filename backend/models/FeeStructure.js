import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
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
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    // School-specific fee structure
    schoolFees: {
      classWise: [{
        classNumber: {
          type: Number,
          required: true,
        },
        stream: String, // For classes 11-12
        fees: {
          admissionFee: {
            type: Number,
            default: 0,
          },
          tuitionFee: {
            type: Number,
            default: 0,
          },
          developmentFee: {
            type: Number,
            default: 0,
          },
          examFee: {
            type: Number,
            default: 0,
          },
          libraryFee: {
            type: Number,
            default: 0,
          },
          transportFee: {
            type: Number,
            default: 0,
          },
          miscellaneousFee: {
            type: Number,
            default: 0,
          },
          total: {
            type: Number,
            default: 0,
          },
        },
      }],
    },
    // Common fee settings
    paymentSchedule: {
      installments: {
        type: Number,
        default: 1,
      },
      dueDates: [Date],
    },
    lateFeePolicy: {
      gracePeriod: {
        type: Number,
        default: 7, // days
      },
      lateFeeAmount: {
        type: Number,
        default: 0,
      },
      lateFeePercentage: {
        type: Number,
        default: 0,
      },
    },
    discounts: [{
      name: String,
      type: {
        type: String,
        enum: ["percentage", "fixed"],
      },
      value: Number,
      eligibilityCriteria: String,
      isActive: {
        type: Boolean,
        default: true,
      },
    }],
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
feeStructureSchema.index({ tenantId: 1, academicYear: 1 });
feeStructureSchema.index({ orgId: 1, isActive: 1 });

// Calculate total fees before saving
feeStructureSchema.pre("save", function(next) {
  // Calculate school fees totals
  if (this.schoolFees && this.schoolFees.classWise) {
    this.schoolFees.classWise.forEach(classData => {
      const fees = classData.fees;
      fees.total = (fees.admissionFee || 0) + 
                   (fees.tuitionFee || 0) + 
                   (fees.developmentFee || 0) + 
                   (fees.examFee || 0) + 
                   (fees.libraryFee || 0) + 
                   (fees.transportFee || 0) + 
                   (fees.miscellaneousFee || 0);
    });
  }

  next();
});

// Ensure tenant isolation
feeStructureSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
export default FeeStructure;