import mongoose from 'mongoose';

const gameProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    timePlayed: {
      type: Number, // in seconds
      default: 0
    },
    achievements: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      earnedAt: {
        type: Date,
        default: Date.now
      },
      badge: {
        type: String,
        enum: ['bronze', 'silver', 'gold'],
        default: 'bronze'
      }
    }],
    coinsEarned: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    lastPlayed: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only have one progress record per game
gameProgressSchema.index({ userId: 1, gameId: 1 }, { unique: true });

const GameProgress = mongoose.model('GameProgress', gameProgressSchema);
export default GameProgress;