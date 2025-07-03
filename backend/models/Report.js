import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["weekly", "monthly", "custom"],
      default: "weekly",
    },
    data: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: ["generated", "reviewed", "archived"],
      default: "generated",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

reportSchema.index({ userId: 1, reportType: 1, createdAt: -1 }); // Index for faster queries

const Report = mongoose.model("Report", reportSchema);

export default Report;
