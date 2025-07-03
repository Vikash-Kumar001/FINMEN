import mongoose from 'mongoose';

const financialMissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  level: {
    type: String,
    enum: ['junior', 'pro'],
    required: true,
  },
  xp: { type: Number, required: true },
  rewardCoins: { type: Number, required: true },
  badge: String, // optional
}, { timestamps: true });

const FinancialMission = mongoose.model('FinancialMission', financialMissionSchema);
export default FinancialMission;
