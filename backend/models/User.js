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
    city: {
      type: String,
    },
    language: {
      type: String,
    },
    guardianEmail: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "educator", "admin"],
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "educator" ? "pending" : "approved";
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
