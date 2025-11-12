import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // index removed, only unique
    },
    password: {
      type: String,
      required: true,
    },
    contactInfo: {
      phone: String,
      address: String,
      website: String,
      city: String,
      state: String,
      pincode: String,
    },
    type: {
      type: String,
      enum: ['company', 'school'],
      default: 'company'
    },
    academicInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    institutionId: {
      type: String,
      unique: true,
      sparse: true
    },
    organizations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "student_premium", "student_parent_premium_pro", "educational_institutions_premium"],
      default: "free",
    },
    subscriptionStart: {
      type: Date,
    },
    subscriptionExpiry: {
      type: Date,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: {
      type: String,
    },
    approvalNotes: {
      type: String,
    },
    reviewHistory: {
      type: [{
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        action: {
          type: String,
          enum: ["submitted", "approved", "rejected", "commented"],
          required: true,
        },
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        }
      }],
      default: []
    },
    lastReviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Only keep isActive index, email is already unique
companySchema.index({ isActive: 1 });

const Company = mongoose.model("Company", companySchema);
export default Company;