import mongoose from "mongoose";

const missionProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedMissions: [
    {
      missionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FinancialMission",
        required: true,
      },
      level: {
        type: String, // Added to store mission level for analytics
        required: true,
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  xp: { type: Number, default: 0 },
  healCoins: { type: Number, default: 0 },
  badges: [String],
}, { timestamps: true });

export default mongoose.model("MissionProgress", missionProgressSchema);