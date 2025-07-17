import mongoose from 'mongoose';

const ChallengeProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    currentStep: {
      type: Number,
      default: 0,
    },
    completedSteps: {
      type: [Number],
      default: [],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only have one progress record per challenge
ChallengeProgressSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

const ChallengeProgress = mongoose.model('ChallengeProgress', ChallengeProgressSchema);

export default ChallengeProgress;