import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from '../models/Challenge.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected for seeding'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Sample challenges data
const challenges = [
  {
    title: 'Budget Master',
    description: 'Create a monthly budget and track your expenses for a week',
    category: 'financial',
    difficulty: 'Easy',
    xpReward: 50,
    coinReward: 20,
    estimatedTime: '5-7 days',
    completionSteps: 3,
    benefits: [
      'Learn budgeting basics',
      'Track spending habits',
      'Develop financial discipline'
    ],
    iconName: 'Target',
    gradientColors: 'from-green-400 to-emerald-400'
  },
  {
    title: 'Savings Challenge',
    description: 'Save a small amount each day for 30 days',
    category: 'financial',
    difficulty: 'Medium',
    xpReward: 100,
    coinReward: 50,
    estimatedTime: '30 days',
    completionSteps: 30,
    benefits: [
      'Build saving habit',
      'Learn delayed gratification',
      'Achieve financial goals'
    ],
    iconName: 'Coins',
    gradientColors: 'from-yellow-400 to-orange-400'
  },
  {
    title: 'Investment Simulator',
    description: 'Practice investing with virtual money',
    category: 'financial',
    difficulty: 'Hard',
    xpReward: 150,
    coinReward: 75,
    estimatedTime: '2 weeks',
    completionSteps: 5,
    benefits: [
      'Understand investment basics',
      'Learn risk management',
      'Practice market analysis'
    ],
    iconName: 'TrendingUp',
    gradientColors: 'from-red-400 to-pink-400'
  },
  {
    title: 'Financial Quiz Marathon',
    description: 'Complete a series of financial literacy quizzes',
    category: 'education',
    difficulty: 'Medium',
    xpReward: 120,
    coinReward: 60,
    estimatedTime: '3-5 days',
    completionSteps: 10,
    benefits: [
      'Test financial knowledge',
      'Learn new concepts',
      'Improve decision making'
    ],
    iconName: 'Zap',
    gradientColors: 'from-blue-400 to-indigo-400'
  },
  {
    title: 'Expense Tracking',
    description: 'Track all your expenses for two weeks',
    category: 'financial',
    difficulty: 'Easy',
    xpReward: 80,
    coinReward: 40,
    estimatedTime: '14 days',
    completionSteps: 14,
    benefits: [
      'Identify spending patterns',
      'Find saving opportunities',
      'Build financial awareness'
    ],
    iconName: 'Calendar',
    gradientColors: 'from-purple-400 to-violet-400'
  },
  {
    title: 'Financial Goal Setting',
    description: 'Set and work towards a specific financial goal',
    category: 'planning',
    difficulty: 'Medium',
    xpReward: 100,
    coinReward: 50,
    estimatedTime: '1 month',
    completionSteps: 4,
    benefits: [
      'Learn goal setting',
      'Develop action plans',
      'Track progress effectively'
    ],
    iconName: 'Target',
    gradientColors: 'from-cyan-400 to-teal-400'
  }
];

// Seed function
const seedChallenges = async () => {
  try {
    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('🧹 Cleared existing challenges');

    // Insert new challenges
    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`🌱 Seeded ${createdChallenges.length} challenges`);

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
};

// Run the seed function
seedChallenges();