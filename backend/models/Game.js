import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['financial', 'mental'], 
      required: true 
    },
    category: {
      type: String,
      enum: ['mind-maze', 'breathe-balance', 'piggy-bank-builder', 'shop-smart', 'invest-quest', 'budget-hero'],
      required: true
    },
    ageGroup: {
      type: String,
      enum: ['junior', 'pro', 'all'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy'
    },
    rewardCoins: {
      type: Number,
      required: true,
      default: 10
    },
    estimatedTime: {
      type: String,
      default: '5-10 min'
    },
    gradient: {
      type: String,
      default: 'from-blue-500 to-indigo-500'
    },
    benefits: [{
      type: String
    }],
    route: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Game = mongoose.model('Game', gameSchema);
export default Game;