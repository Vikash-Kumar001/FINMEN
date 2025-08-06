import mongoose from 'mongoose';

const gameAchievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['financial', 'mental', 'general'],
      required: true
    },
    badge: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      required: true
    },
    icon: {
      type: String,
      default: '🏆'
    },
    requiredCriteria: {
      type: Object,
      default: {}
    },
    rewardCoins: {
      type: Number,
      default: 0
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const GameAchievement = mongoose.model('GameAchievement', gameAchievementSchema);
export default GameAchievement;