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
      enum: ['financial', 'mental', 'ai', 'brain', 'finance', 'educational'], 
      required: true 
    },
    category: {
      type: String,
      enum: [
        // Original games
        'mind-maze', 'breathe-balance', 'piggy-bank-builder', 'shop-smart', 'invest-quest', 'budget-hero',
        // AI games
        'spot-the-pattern', 'cat-or-dog', 'true-or-false-ai-quiz', 'sorting-colors',
        'ai-artist-game', 'ai-basics-badge', 'ai-daily-life-badge', 'ai-doctor-quiz',
        'ai-doctor-simulation', 'ai-in-banking-quiz', 'ai-in-games', 'ai-in-maps-story',
        'ai-news-story', 'ai-or-human-quiz', 'ai-or-not-quiz', 'ai-translator-quiz',
        'airport-scanner-story', 'chatbot-friend', 'emoji-classifier', 'face-unlock-game',
        'friendly-ai-quiz', 'match-ai-tools', 'match-ai-uses', 'music-ai-story',
        'online-shopping-ai', 'pattern-finding-puzzle', 'pattern-music-game',
        'pattern-music-game-2', 'pattern-music-game-3', 'prediction-puzzle',
        'recommendation-game', 'robot-emotion-story', 'robot-helper-reflex',
        'robot-helper-story', 'robot-vacuum-game', 'robot-vision-game',
        'self-driving-car-game', 'siri-alexa-quiz', 'smart-city-traffic-game',
        'smart-farming-quiz', 'smart-fridge-story', 'smart-home-lights-game',
        'smart-home-story', 'smart-speaker-story', 'smartwatch-game',
        'sorting-animals', 'spam-vs-not-spam', 'traffic-light-ai', 'train-the-robot',
        'voice-assistant-quiz', 'weather-prediction-story', 'youtube-recommendation-game'
      ],
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
    coinsPerLevel: {
      type: Number,
      default: null // If set, awards coins per level instead of total
    },
    totalLevels: {
      type: Number,
      default: 1 // Number of levels/questions in the game
    },
    maxScore: {
      type: Number,
      default: 100 // Maximum possible score for the game
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