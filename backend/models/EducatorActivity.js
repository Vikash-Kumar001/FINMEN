import mongoose from "mongoose";

const educatorActivitySchema = new mongoose.Schema(
  {
    educatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityType: {
      type: String,
      enum: ["login", "logout", "student_interaction", "content_creation", "feedback", "other"],
      required: true,
    },
    details: {
      type: Object,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number, // Duration in minutes
      default: 0,
    },
  },
  { timestamps: true }
);

const EducatorActivity = mongoose.model("EducatorActivity", educatorActivitySchema);
export default EducatorActivity;