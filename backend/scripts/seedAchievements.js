import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GameAchievement from '../models/GameAchievement.js';
import colors from 'colors';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding achievements'.green.bold))
  .catch(err => {
    console.error(`Error: ${err.message}`.red.bold);
    process.exit(1);
  });

// Achievement data
const achievements = [
  // General Achievements
  {
    name: 'First Steps',
    description: 'Complete your first game',
    category: 'general',
    badge: 'bronze',
    icon: '🏆',
    requiredCriteria: { gamesCompleted: 1 },
    rewardCoins: 20,
    isHidden: false
  },
  {
    name: 'Game Explorer',
    description: 'Play at least one game from each category',
    category: 'general',
    badge: 'silver',
    icon: '🔍',
    requiredCriteria: { uniqueCategories: 6 },
    rewardCoins: 50,
    isHidden: false
  },
  {
    name: 'Dedicated Player',
    description: 'Complete 10 games in total',
    category: 'general',
    badge: 'gold',
    icon: '⭐',
    requiredCriteria: { gamesCompleted: 10 },
    rewardCoins: 100,
    isHidden: false
  },
  {
    name: 'Master of All',
    description: 'Complete all games at least once',
    category: 'general',
    badge: 'platinum',
    icon: '👑',
    requiredCriteria: { allGamesCompleted: true },
    rewardCoins: 200,
    isHidden: false
  },
  {
    name: 'Streak Master',
    description: 'Maintain a 7-day streak of playing games',
    category: 'general',
    badge: 'diamond',
    icon: '🔥',
    requiredCriteria: { streak: 7 },
    rewardCoins: 150,
    isHidden: false
  },

  // Financial Game Achievements
  {
    name: 'Money Saver',
    description: 'Complete Piggy Bank Builder with a perfect score',
    category: 'financial',
    badge: 'bronze',
    icon: '💰',
    requiredCriteria: { game: 'piggy-bank-builder', score: 100 },
    rewardCoins: 30,
    isHidden: false
  },
  {
    name: 'Smart Shopper',
    description: 'Complete Shop Smart! without going over budget',
    category: 'financial',
    badge: 'silver',
    icon: '🛒',
    requiredCriteria: { game: 'shop-smart', perfectBudget: true },
    rewardCoins: 40,
    isHidden: false
  },
  {
    name: 'Investment Guru',
    description: 'Achieve a 15% return on investment in Invest Quest',
    category: 'financial',
    badge: 'gold',
    icon: '📈',
    requiredCriteria: { game: 'invest-quest', returnRate: 15 },
    rewardCoins: 60,
    isHidden: false
  },
  {
    name: 'Budget Wizard',
    description: 'Successfully handle all emergencies in Budget Hero',
    category: 'financial',
    badge: 'platinum',
    icon: '✨',
    requiredCriteria: { game: 'budget-hero', emergenciesHandled: true },
    rewardCoins: 80,
    isHidden: false
  },
  {
    name: 'Financial Expert',
    description: 'Complete all financial games with high scores',
    category: 'financial',
    badge: 'diamond',
    icon: '💎',
    requiredCriteria: { financialMastery: true },
    rewardCoins: 120,
    isHidden: false
  },

  // Mental Health Game Achievements
  {
    name: 'Mind Explorer',
    description: 'Complete Mind Maze for the first time',
    category: 'mental',
    badge: 'bronze',
    icon: '🧠',
    requiredCriteria: { game: 'mind-maze', completed: true },
    rewardCoins: 25,
    isHidden: false
  },
  {
    name: 'Zen Master',
    description: 'Complete a full session of Breathe & Balance without interruption',
    category: 'mental',
    badge: 'silver',
    icon: '🧘',
    requiredCriteria: { game: 'breathe-balance', fullSession: true },
    rewardCoins: 35,
    isHidden: false
  },
  {
    name: 'Emotion Navigator',
    description: 'Solve all emotion-based puzzles in Mind Maze',
    category: 'mental',
    badge: 'gold',
    icon: '😌',
    requiredCriteria: { game: 'mind-maze', allPuzzles: true },
    rewardCoins: 55,
    isHidden: false
  },
  {
    name: 'Mindfulness Champion',
    description: 'Maintain a 5-day streak in Breathe & Balance',
    category: 'mental',
    badge: 'platinum',
    icon: '🌟',
    requiredCriteria: { game: 'breathe-balance', streak: 5 },
    rewardCoins: 75,
    isHidden: false
  },
  {
    name: 'Mental Wellness Guru',
    description: 'Complete all mental wellness games 10 times each',
    category: 'mental',
    badge: 'diamond',
    icon: '🌈',
    requiredCriteria: { mentalMastery: true },
    rewardCoins: 110,
    isHidden: false
  },

  // Hidden Achievements
  {
    name: 'Speed Demon',
    description: 'Complete any game in under 5 minutes with a perfect score',
    category: 'general',
    badge: 'gold',
    icon: '⚡',
    requiredCriteria: { timePlayed: 5, perfectScore: true },
    rewardCoins: 90,
    isHidden: true
  },
  {
    name: 'Night Owl',
    description: 'Play games between midnight and 4 AM',
    category: 'general',
    badge: 'silver',
    icon: '🦉',
    requiredCriteria: { playedAtNight: true },
    rewardCoins: 45,
    isHidden: true
  },
  {
    name: 'Weekend Warrior',
    description: 'Play games for 3 hours total during a weekend',
    category: 'general',
    badge: 'platinum',
    icon: '🏅',
    requiredCriteria: { weekendHours: 3 },
    rewardCoins: 85,
    isHidden: true
  }
];

// Seed function
const seedAchievements = async () => {
  try {
    // Clear existing achievements
    await GameAchievement.deleteMany({});
    console.log('Existing achievements deleted'.yellow);

    // Insert new achievements
    const createdAchievements = await GameAchievement.insertMany(achievements);
    console.log(`${createdAchievements.length} achievements seeded successfully`.green.bold);

    // Exit process
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Run the seed function
seedAchievements();