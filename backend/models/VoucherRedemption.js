import mongoose from "mongoose";

const voucherRedemptionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coinsPaid: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "delivered"],
      default: "pending",
    },
    qrCode: {
      type: String,
      required: true,
      unique: true,
    },
    rejectionReason: {
      type: String,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    voucherCode: {
      type: String,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate QR code before saving
voucherRedemptionSchema.pre('save', function(next) {
  if (!this.qrCode) {
    this.qrCode = `QR${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

const VoucherRedemption = mongoose.model("VoucherRedemption", voucherRedemptionSchema);
export default VoucherRedemption;