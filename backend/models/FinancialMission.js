import mongoose from "mongoose";

const financialMissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  level: {
    type: String,
    enum: ["junior", "pro"],
    required: true,
  },
  xp: {
    type: Number,
    required: true,
  },
  rewardCoins: {
    type: Number,
    required: true,
  },
  badge: {
    type: String,
  },
  userRole: {
    type: String,
    enum: ["student", "educator", "admin"],
    required: true,
  },
  department: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model("FinancialMission", financialMissionSchema);