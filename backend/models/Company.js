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
      enum: ['school', 'college'],
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
      enum: ["basic", "premium", "enterprise"],
      default: "basic",
    },
    subscriptionExpiry: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
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