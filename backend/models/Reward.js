import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    cost: { type: Number, required: true }, // HealCoins cost
  },
  { timestamps: true }
);

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;
