import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    dob: {
      type: String,
    },
    institution: {
      type: String,
    },
    username: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    bio: {
      type: String,
    },
    city: {
      type: String,
    },
    language: {
      type: String,
    },
    academic: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    professional: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    guardianEmail: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "educator", "admin", "parent", "seller", "csr"],
      default: "student",
    },
    position: {
      type: String,
      required: function () {
        return this.role === "educator";
      },
    },
    subjects: {
      type: String,
      required: function () {
        return this.role === "educator";
      },
    },
    // Parent-specific fields
    childEmail: {
      type: String,
      required: function () {
        return this.role === "parent";
      },
      validate: {
        validator: function(email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please enter a valid child email address'
      }
    },
    // Seller-specific fields
    businessName: {
      type: String,
      required: function () {
        return this.role === "seller";
      },
    },
    shopType: {
      type: String,
      enum: ["Stationery", "Uniforms", "Food", "Books", "Electronics", "Other"],
      required: function () {
        return this.role === "seller";
      },
    },
    // CSR-specific fields
    organization: {
      type: String,
      required: function () {
        return this.role === "csr";
      },
    },
    isVerified: {
      type: Boolean,
      default: function () {
        return this.role === "parent" || this.role === "seller" || this.role === "csr" || this.role === "admin" || this.role === "educator";
      },
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return ["educator", "parent", "seller", "csr"].includes(this.role) ? "pending" : "approved";
      },
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    otpType: {
      type: String,
      enum: ["verify", "reset"],
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    // Add these fields to your userSchema
    completedChallengeIds: {
      type: [String],
      default: []
    },
    dailyChallengeHistory: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if ((this.role === "admin" || this.role === "educator") && !this.password) {
    return next(new Error("Password is required for admin and educator accounts"));
  }
  next();
});

userSchema.virtual("canUseGoogleLogin").get(function () {
  return this.role === "student";
});

userSchema.virtual("needsOTPVerification").get(function () {
  return this.role === "student" && !this.isVerified;
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
