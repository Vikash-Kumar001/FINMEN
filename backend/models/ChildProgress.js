import mongoose from "mongoose";

const childProgressSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    digitalTwin: {
      finance: {
        level: { type: Number, default: 1 },
        progress: { type: Number, default: 0 },
        weeklyGrowth: { type: Number, default: 0 },
      },
      mentalWellness: {
        level: { type: Number, default: 1 },
        progress: { type: Number, default: 0 },
        weeklyGrowth: { type: Number, default: 0 },
      },
      values: {
        level: { type: Number, default: 1 },
        progress: { type: Number, default: 0 },
        weeklyGrowth: { type: Number, default: 0 },
      },
      ai: {
        level: { type: Number, default: 1 },
        progress: { type: Number, default: 0 },
        weeklyGrowth: { type: Number, default: 0 },
      },
    },
    progressReport: {
      coinsEarned: { type: Number, default: 0 },
      gamesCompleted: { type: Number, default: 0 },
      timeSpent: { type: Number, default: 0 }, // in minutes
      strengths: [{ type: String }],
      needsSupport: [{ type: String }],
    },
    recentActivity: [{
      type: { type: String, enum: ["game", "quiz", "mood", "journal", "challenge"] },
      title: { type: String },
      coins: { type: Number, default: 0 },
      timestamp: { type: Date, default: Date.now },
    }],
    weeklyReport: {
      generated: { type: Boolean, default: false },
      generatedAt: { type: Date },
      reportData: { type: mongoose.Schema.Types.Mixed },
    },
  },
  {
    timestamps: true,
  }
);

const ChildProgress = mongoose.model("ChildProgress", childProgressSchema);
export default ChildProgress;