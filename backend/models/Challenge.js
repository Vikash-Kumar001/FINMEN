import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['financial', 'education', 'planning', 'other'],
      default: 'financial',
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    xpReward: {
      type: Number,
      required: true,
      default: 50,
    },
    coinReward: {
      type: Number,
      required: true,
      default: 20,
    },
    estimatedTime: {
      type: String,
      required: true,
    },
    completionSteps: {
      type: Number,
      required: true,
      default: 1,
    },
    benefits: {
      type: [String],
      default: [],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: function() {
        // Default to 30 days from start date
        const date = new Date(this.startDate);
        date.setDate(date.getDate() + 30);
        return date;
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    iconName: {
      type: String,
      default: 'Target',
    },
    gradientColors: {
      type: String,
      default: 'from-blue-400 to-indigo-400',
    },
  },
  { timestamps: true }
);

const Challenge = mongoose.model('Challenge', ChallengeSchema);

export default Challenge;