import mongoose from 'mongoose';

const missionProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completedMissions: [
    {
      missionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FinancialMission',
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

const MissionProgress = mongoose.model('MissionProgress', missionProgressSchema);
export default MissionProgress;
