import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema(
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
    // Student Information
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'studentType'
    },
    studentType: {
      type: String,
      enum: ['SchoolStudent'],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    paymentDetails: {
      receiptNumber: {
        type: String,
        required: true,
        unique: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      paymentDate: {
        type: Date,
        default: Date.now,
      },
      dueDate: {
        type: Date,
        required: true,
      },
      paymentMode: {
        type: String,
        enum: ["cash", "cheque", "online", "card", "upi"],
        required: true,
      },
      transactionId: String,
      bankDetails: {
        bankName: String,
        chequeNumber: String,
        chequeDate: Date,
      },
    },
    feeBreakdown: {
      admissionFee: { type: Number, default: 0 },
      tuitionFee: { type: Number, default: 0 },
      developmentFee: { type: Number, default: 0 },
      examFee: { type: Number, default: 0 },
      libraryFee: { type: Number, default: 0 },
      labFee: { type: Number, default: 0 },
      hostelFee: { type: Number, default: 0 },
      transportFee: { type: Number, default: 0 },
      miscellaneousFee: { type: Number, default: 0 },
      lateFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
    },
    // School-specific fields
    schoolPayment: {
      classNumber: Number,
      section: String,
      stream: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
    },
    paymentFor: {
      type: String,
      enum: ["admission", "semester", "annual", "installment"],
      required: true,
    },
    installmentNumber: {
      type: Number,
      default: 1,
    },
    totalInstallments: {
      type: Number,
      default: 1,
    },
    remarks: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
feePaymentSchema.index({ tenantId: 1, receiptNumber: 1 }, { unique: true });
feePaymentSchema.index({ tenantId: 1, studentId: 1, academicYear: 1 });
feePaymentSchema.index({ tenantId: 1, userId: 1 });
feePaymentSchema.index({ status: 1, isActive: 1 });

// Generate receipt number before saving
feePaymentSchema.pre("save", function(next) {
  if (!this.paymentDetails.receiptNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.paymentDetails.receiptNumber = `RCP${year}${month}${random}`;
  }
  next();
});

// Ensure tenant isolation
feePaymentSchema.pre(/^find/, function() {
  if (this.getQuery().tenantId) {
    return;
  }
  throw new Error("TenantId is required for all queries");
});

const FeePayment = mongoose.model("FeePayment", feePaymentSchema);
export default FeePayment;