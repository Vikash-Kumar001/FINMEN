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
    },
    subjects: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
