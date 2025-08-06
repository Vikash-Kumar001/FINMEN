import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';
import Game from '../models/Game.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in the .env file.'.red.bold);
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected for seeding games'.green.bold))
  .catch((err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`.red.bold);
    process.exit(1);
  });

const games = [
  // Mental Health Games (All Ages 8–25)
  {
    title: 'Mind Maze',
    description: 'A calming puzzle game where users solve emotion-based riddles and self-reflection challenges to reduce stress.',
    type: 'mental',
    category: 'mind-maze',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 50,
    estimatedTime: '15 min',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    benefits: [
      'Stress reduction',
      'Emotional awareness',
      'Problem-solving skills',
      'Self-reflection',
    ],
    route: '/games/mind-maze',
  },
  {
    title: 'Breathe & Balance',
    description: 'Interactive breathing and focus game using click/drag rhythm to encourage mindfulness.',
    type: 'mental',
    category: 'breathe-balance',
    ageGroup: 'all',
    difficulty: 'easy',
    rewardCoins: 40,
    estimatedTime: '10 min',
    gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    benefits: [
      'Anxiety reduction',
      'Focus improvement',
      'Mindfulness practice',
      'Stress management',
    ],
    route: '/games/breathe-balance',
  },

  // Financial Games for Below Teenagers (8–14)
  {
    title: 'Piggy Bank Builder',
    description: 'A game teaching kids how to save coins by completing household missions and avoiding spending traps.',
    type: 'financial',
    category: 'piggy-bank-builder',
    ageGroup: 'junior',
    difficulty: 'easy',
    rewardCoins: 45,
    estimatedTime: '15 min',
    gradient: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
    benefits: [
      'Saving habits',
      'Money management',
      'Delayed gratification',
      'Goal setting',
    ],
    route: '/games/piggy-bank-builder',
  },
  {
    title: 'Shop Smart!',
    description: 'Kids learn budgeting by shopping in a virtual mall within a limited budget, focusing on needs vs wants.',
    type: 'financial',
    category: 'shop-smart',
    ageGroup: 'junior',
    difficulty: 'medium',
    rewardCoins: 55,
    estimatedTime: '20 min',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    benefits: [
      'Budgeting skills',
      'Needs vs wants',
      'Price comparison',
      'Decision making',
    ],
    route: '/games/shop-smart',
  },

  // Financial Games for Teenagers and Above (15–25)
  {
    title: 'Invest Quest',
    description: 'A simulation where users play as young investors, learning basic stock market, SIP, and crypto through choices and consequences.',
    type: 'financial',
    category: 'invest-quest',
    ageGroup: 'pro',
    difficulty: 'hard',
    rewardCoins: 70,
    estimatedTime: '25 min',
    gradient: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    benefits: [
      'Investment basics',
      'Risk management',
      'Portfolio diversification',
      'Long-term planning',
    ],
    route: '/games/invest-quest',
  },
  {
    title: 'Budget Hero',
    description: 'Teenagers manage a month\'s budget as a college student, facing real-life expense scenarios, part-time jobs, and emergencies.',
    type: 'financial',
    category: 'budget-hero',
    ageGroup: 'pro',
    difficulty: 'medium',
    rewardCoins: 60,
    estimatedTime: '20 min',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    benefits: [
      'Budget planning',
      'Emergency funds',
      'Income management',
      'Financial responsibility',
    ],
    route: '/games/budget-hero',
  },
];

const seedGames = async () => {
  try {
    await Game.deleteMany({});
    console.log('🗑️  Existing games deleted'.yellow);

    const createdGames = await Game.insertMany(games);
    console.log(`✅ ${createdGames.length} games seeded successfully`.green.bold);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error while seeding games: ${error.message}`.red.bold);
    process.exit(1);
  }
};

seedGames();
