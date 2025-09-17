import mongoose from "mongoose";

const schoolStudentSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
    },
    rollNumber: String,
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    parentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // At least one parent is mandatory
    }],
    personalInfo: {
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },
      bloodGroup: String,
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
      },
      emergencyContact: {
        name: String,
        phone: String,
        relation: String,
      },
    },
    academicInfo: {
      admissionDate: {
        type: Date,
        default: Date.now,
      },
      previousSchool: String,
      tcNumber: String, // Transfer Certificate
      subjects: [{
        subjectId: mongoose.Schema.Types.ObjectId,
        isOptional: Boolean,
      }],
    },
    fees: {
      totalFees: Number,
      paidAmount: {
        type: Number,
        default: 0,
      },
      pendingAmount: {
        type: Number,
        default: 0,
      },
      lastPaymentDate: Date,
      paymentHistory: [{
        amount: Number,
        date: Date,
        receiptNumber: String,
        paymentMode: {
          type: String,
          enum: ["cash", "cheque", "online", "card"],
        },
      }],
    },
    attendance: {
      totalDays: {
        type: Number,
        default: 0,
      },
      presentDays: {
        type: Number,
        default: 0,
      },
      percentage: {
        type: Number,
        default: 0,
      },
    },
    transport: {
      isUsing: {
        type: Boolean,
        default: false,
      },
      routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransportRoute",
      },
      stopName: String,
      fees: Number,
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

// Indexes for efficient queries
schoolStudentSchema.index({ tenantId: 1, admissionNumber: 1 });
schoolStudentSchema.index({ tenantId: 1, classId: 1, section: 1 });
schoolStudentSchema.index({ tenantId: 1, academicYear: 1 });
schoolStudentSchema.index({ userId: 1, tenantId: 1 });

// Validate at least one parent
schoolStudentSchema.pre("save", function(next) {
  if (!this.parentIds || this.parentIds.length === 0) {
    return next(new Error("At least one parent is required for each student"));
  }
  
  // Calculate pending fees
  if (this.fees.totalFees && this.fees.paidAmount) {
    this.fees.pendingAmount = this.fees.totalFees - this.fees.paidAmount;
  }
  
  // Calculate attendance percentage
  if (this.attendance.totalDays > 0) {
    this.attendance.percentage = (this.attendance.presentDays / this.attendance.totalDays) * 100;
  }
  
  next();
});

// Ensure tenant isolation
schoolStudentSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const SchoolStudent = mongoose.model("SchoolStudent", schoolStudentSchema);
export default SchoolStudent;