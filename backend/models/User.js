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
    picture: {
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
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
