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

// Generate 1000 unique challenges
const categories = ['financial', 'education', 'planning', 'other', 'daily', 'weekly'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const icons = ['Target', 'Coins', 'TrendingUp', 'Zap', 'Calendar', 'Award', 'Star', 'Crown', 'Gift', 'BookOpen'];
const gradients = [
  'from-green-400 to-emerald-400',
  'from-yellow-400 to-orange-400',
  'from-red-400 to-pink-400',
  'from-blue-400 to-indigo-400',
  'from-purple-400 to-violet-400',
  'from-cyan-400 to-teal-400',
  'from-orange-400 to-amber-400',
  'from-pink-400 to-rose-400',
  'from-indigo-400 to-blue-400',
  'from-emerald-400 to-green-400'
];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const challenges = Array.from({ length: 1000 }, (_, i) => {
  const cat = randomFrom(categories);
  const diff = randomFrom(difficulties);
  const icon = randomFrom(icons);
  const grad = randomFrom(gradients);
  const xp = 50 + (i % 10) * 10 + (diff === 'Hard' ? 40 : diff === 'Medium' ? 20 : 0);
  const coins = 20 + (i % 5) * 5 + (diff === 'Hard' ? 20 : diff === 'Medium' ? 10 : 0);
  const steps = 3 + (i % 7);
  return {
    title: `Challenge #${i + 1}: ${cat.charAt(0).toUpperCase() + cat.slice(1)} Quest`,
    description: `Complete the ${cat} challenge number ${i + 1} with ${steps} steps. Difficulty: ${diff}.`,
    category: cat,
    difficulty: diff,
    xpReward: xp,
    coinReward: coins,
    estimatedTime: `${steps * (diff === 'Hard' ? 2 : 1)} days`,
    completionSteps: steps,
    benefits: [
      `Benefit 1 for challenge ${i + 1}`,
      `Benefit 2 for challenge ${i + 1}`,
      `Benefit 3 for challenge ${i + 1}`
    ],
    iconName: icon,
    gradientColors: grad
  };
});

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