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
  .then(() => console.log('✅ MongoDB connected for seeding AI games'.green.bold))
  .catch((err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`.red.bold);
    process.exit(1);
  });

const aiGames = [
  // Pattern Recognition Games
  {
    title: 'Spot the Pattern',
    description: 'Identify patterns in sequences of shapes and colors to develop logical thinking.',
    type: 'ai',
    category: 'spot-the-pattern',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 50,
    coinsPerLevel: 10,
    totalLevels: 5,
    maxScore: 100,
    estimatedTime: '8-12 min',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    benefits: [
      'Pattern recognition',
      'Logical thinking',
      'Visual processing',
      'Problem solving'
    ],
    route: '/student/ai/spot-the-pattern'
  },
  
  // Classification Games
  {
    title: 'Cat or Dog',
    description: 'Learn image classification by identifying cats and dogs in photos.',
    type: 'ai',
    category: 'cat-or-dog',
    ageGroup: 'junior',
    difficulty: 'easy',
    rewardCoins: 25,
    coinsPerLevel: 5,
    totalLevels: 5,
    maxScore: 50,
    estimatedTime: '5-8 min',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    benefits: [
      'Image recognition',
      'Classification skills',
      'Decision making',
      'Visual learning'
    ],
    route: '/student/ai/cat-or-dog'
  },
  
  {
    title: 'Sorting Colors',
    description: 'Practice classification by sorting objects by their colors.',
    type: 'ai',
    category: 'sorting-colors',
    ageGroup: 'junior',
    difficulty: 'easy',
    rewardCoins: 30,
    coinsPerLevel: 6,
    totalLevels: 5,
    maxScore: 60,
    estimatedTime: '6-10 min',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    benefits: [
      'Color recognition',
      'Sorting skills',
      'Pattern matching',
      'Visual processing'
    ],
    route: '/student/ai/sorting-colors'
  },
  
  {
    title: 'Sorting Animals',
    description: 'Learn to categorize different animals by their characteristics.',
    type: 'ai',
    category: 'sorting-animals',
    ageGroup: 'junior',
    difficulty: 'easy',
    rewardCoins: 30,
    coinsPerLevel: 6,
    totalLevels: 5,
    maxScore: 60,
    estimatedTime: '6-10 min',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    benefits: [
      'Animal recognition',
      'Classification',
      'Biology basics',
      'Memory skills'
    ],
    route: '/student/ai/sorting-animals'
  },
  
  // AI Knowledge Games
  {
    title: 'True or False AI Quiz',
    description: 'Test your knowledge about artificial intelligence with true/false questions.',
    type: 'ai',
    category: 'true-or-false-ai-quiz',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 40,
    coinsPerLevel: 8,
    totalLevels: 5,
    maxScore: 80,
    estimatedTime: '7-10 min',
    gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    benefits: [
      'AI knowledge',
      'Critical thinking',
      'Technology awareness',
      'Learning facts'
    ],
    route: '/student/ai/true-or-false-ai-quiz'
  },
  
  {
    title: 'AI or Human Quiz',
    description: 'Learn to distinguish between AI-generated and human-created content.',
    type: 'ai',
    category: 'ai-or-human-quiz',
    ageGroup: 'pro',
    difficulty: 'hard',
    rewardCoins: 60,
    coinsPerLevel: 12,
    totalLevels: 5,
    maxScore: 100,
    estimatedTime: '10-15 min',
    gradient: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    benefits: [
      'AI detection',
      'Critical analysis',
      'Technology literacy',
      'Ethical awareness'
    ],
    route: '/student/ai/ai-or-human-quiz'
  },
  
  // Interactive AI Games
  {
    title: 'Train the Robot',
    description: 'Teach a virtual robot to perform tasks through simple programming.',
    type: 'ai',
    category: 'train-the-robot',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 70,
    coinsPerLevel: 14,
    totalLevels: 5,
    maxScore: 120,
    estimatedTime: '12-18 min',
    gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    benefits: [
      'Programming concepts',
      'Logic building',
      'AI training understanding',
      'Problem solving'
    ],
    route: '/student/ai/train-the-robot'
  },
  
  {
    title: 'Robot Vision Game',
    description: 'Help a robot identify objects using computer vision concepts.',
    type: 'ai',
    category: 'robot-vision-game',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 55,
    coinsPerLevel: 11,
    totalLevels: 5,
    maxScore: 100,
    estimatedTime: '9-12 min',
    gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    benefits: [
      'Computer vision',
      'Object recognition',
      'AI concepts',
      'Visual processing'
    ],
    route: '/student/ai/robot-vision-game'
  },
  
  // Smart Technology Games
  {
    title: 'Smart Home Story',
    description: 'Learn how AI powers smart homes through interactive storytelling.',
    type: 'ai',
    category: 'smart-home-story',
    ageGroup: 'all',
    difficulty: 'easy',
    rewardCoins: 35,
    coinsPerLevel: 7,
    totalLevels: 5,
    maxScore: 70,
    estimatedTime: '8-12 min',
    gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    benefits: [
      'Smart technology',
      'AI applications',
      'Home automation',
      'Daily life AI'
    ],
    route: '/student/ai/smart-home-story'
  },
  
  {
    title: 'Voice Assistant Quiz',
    description: 'Discover how voice assistants like Siri and Alexa understand speech.',
    type: 'ai',
    category: 'voice-assistant-quiz',
    ageGroup: 'all',
    difficulty: 'easy',
    rewardCoins: 40,
    coinsPerLevel: 8,
    totalLevels: 5,
    maxScore: 80,
    estimatedTime: '8-12 min',
    gradient: 'linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)',
    benefits: [
      'Speech recognition',
      'Natural language processing',
      'Voice technology',
      'AI interaction'
    ],
    route: '/student/ai/voice-assistant-quiz'
  },
  
  // Machine Learning Games
  {
    title: 'Pattern Music Game',
    description: 'Learn pattern recognition through musical sequences and rhythms.',
    type: 'ai',
    category: 'pattern-music-game',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 45,
    coinsPerLevel: 9,
    totalLevels: 5,
    maxScore: 90,
    estimatedTime: '10-15 min',
    gradient: 'linear-gradient(135deg, #fab1a0 0%, #e17055 100%)',
    benefits: [
      'Audio pattern recognition',
      'Music and AI',
      'Sequence learning',
      'Auditory processing'
    ],
    route: '/student/ai/pattern-music-game'
  },
  
  {
    title: 'Recommendation Game',
    description: 'Understand how AI recommendation systems suggest content you might like.',
    type: 'ai',
    category: 'recommendation-game',
    ageGroup: 'pro',
    difficulty: 'medium',
    rewardCoins: 50,
    coinsPerLevel: 10,
    totalLevels: 5,
    maxScore: 100,
    estimatedTime: '10-15 min',
    gradient: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)',
    benefits: [
      'Recommendation systems',
      'User preferences',
      'AI algorithms',
      'Personalization'
    ],
    route: '/student/ai/recommendation-game'
  },
  
  // AI Ethics & Safety Games
  {
    title: 'Friendly AI Quiz',
    description: 'Learn about AI safety and how to build helpful, harmless AI systems.',
    type: 'ai',
    category: 'friendly-ai-quiz',
    ageGroup: 'pro',
    difficulty: 'medium',
    rewardCoins: 55,
    coinsPerLevel: 11,
    totalLevels: 5,
    maxScore: 110,
    estimatedTime: '12-15 min',
    gradient: 'linear-gradient(135deg, #00b894 0%, #55a3ff 100%)',
    benefits: [
      'AI ethics',
      'Safety awareness',
      'Responsible AI',
      'Social impact'
    ],
    route: '/student/ai/friendly-ai-quiz'
  },
  
  // Specialized AI Applications
  {
    title: 'AI Doctor Simulation',
    description: 'Experience how AI assists doctors in medical diagnosis and treatment.',
    type: 'ai',
    category: 'ai-doctor-simulation',
    ageGroup: 'pro',
    difficulty: 'hard',
    rewardCoins: 80,
    coinsPerLevel: 16,
    totalLevels: 5,
    maxScore: 140,
    rewardCoins: 30,
    coinsPerLevel: 6,
    totalLevels: 5,
    maxScore: 60,
    estimatedTime: '6-10 min',
    gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    benefits: [
      'Smart appliances',
      'Kitchen AI',
      'Home automation',
      'Connected devices'
    ],
    route: '/student/ai/smart-fridge-story'
  },
  
  {
    title: 'Smart Home Lights Game',
    description: 'Control smart lighting systems with AI automation.',
    type: 'ai',
    category: 'smart-home-lights-game',
    ageGroup: 'all',
    difficulty: 'easy',
    rewardCoins: 30,
    coinsPerLevel: 6,
    totalLevels: 5,
    maxScore: 60,
    estimatedTime: '6-10 min',
    gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    benefits: [
      'Home automation',
      'Smart lighting',
      'Energy efficiency',
      'IoT devices'
    ],
    route: '/student/ai/smart-home-lights-game'
  },
  
  {
    title: 'Smart Speaker Story',
    description: 'Explore the AI technology inside smart speakers.',
    type: 'ai',
    category: 'smart-speaker-story',
    ageGroup: 'all',
    difficulty: 'easy',
    rewardCoins: 35,
    coinsPerLevel: 7,
    totalLevels: 5,
    maxScore: 70,
    estimatedTime: '8-12 min',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    benefits: [
      'Smart speakers',
      'Voice interaction',
      'Audio AI',
      'Home assistants'
    ],
    route: '/student/ai/smart-speaker-story'
  },
  
  {
    title: 'Smartwatch Game',
    description: 'Learn how AI in smartwatches monitors health and fitness.',
    type: 'ai',
    category: 'smartwatch-game',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 40,
    coinsPerLevel: 8,
    totalLevels: 5,
    maxScore: 80,
    estimatedTime: '8-12 min',
    gradient: 'linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%)',
    benefits: [
      'Wearable AI',
      'Health monitoring',
      'Fitness tracking',
      'Personal devices'
    ],
    route: '/student/ai/smartwatch-game'
  },
  
  {
    title: 'Spam vs Not Spam',
    description: 'Train an AI to detect spam messages and emails.',
    type: 'ai',
    category: 'spam-vs-not-spam',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 40,
    coinsPerLevel: 8,
    totalLevels: 5,
    maxScore: 80,
    estimatedTime: '8-12 min',
    gradient: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)',
    benefits: [
      'Spam detection',
      'Email security',
      'Text classification',
      'Safety AI'
    ],
    route: '/student/ai/spam-vs-not-spam'
  },
  
  {
    title: 'Traffic Light AI',
    description: 'Optimize traffic lights using AI for better traffic flow.',
    type: 'ai',
    category: 'traffic-light-ai',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 40,
    coinsPerLevel: 8,
    totalLevels: 5,
    maxScore: 80,
    estimatedTime: '8-12 min',
    gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    benefits: [
      'Traffic optimization',
      'Urban AI',
      'Smart infrastructure',
      'City systems'
    ],
    route: '/student/ai/traffic-light-ai'
  },
  
  {
    title: 'Weather Prediction Story',
    description: 'Learn how AI helps predict weather patterns.',
    type: 'ai',
    category: 'weather-prediction-story',
    ageGroup: 'all',
    difficulty: 'medium',
    rewardCoins: 40,
    coinsPerLevel: 8,
    totalLevels: 5,
    maxScore: 80,
    estimatedTime: '8-12 min',
    gradient: 'linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)',
    benefits: [
      'Weather AI',
      'Prediction models',
      'Climate technology',
      'Meteorology'
    ],
    route: '/student/ai/weather-prediction-story'
  },
  
  {
    title: 'YouTube Recommendation Game',
    description: 'Understand how AI recommends videos you might like.',
    type: 'ai',
    category: 'youtube-recommendation-game',
    ageGroup: 'all',
    difficulty: 'easy',
    rewardCoins: 30,
    coinsPerLevel: 6,
    totalLevels: 5,
    maxScore: 60,
    estimatedTime: '6-10 min',
    gradient: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)',
    benefits: [
      'Recommendation systems',
      'Content discovery',
      'Personalization',
      'Video AI'
    ],
    route: '/student/ai/youtube-recommendation-game'
  }
];

// Function to seed AI games
const seedAIGames = async () => {
  try {
    console.log('🌱 Seeding AI games...'.yellow.bold);
    
    // Remove existing AI games
    await Game.deleteMany({ type: 'ai' });
    console.log('🧹 Removed existing AI games'.yellow);
    
    // Insert new AI games
    const insertedGames = await Game.insertMany(aiGames);
    console.log(`✅ Successfully seeded ${insertedGames.length} AI games`.green.bold);
    
    // List seeded games
    console.log('\n📋 Seeded AI Games:'.cyan.bold);
    insertedGames.forEach((game, index) => {
      console.log(`${index + 1}. ${game.title} - ${game.rewardCoins} coins (${game.coinsPerLevel} per level)`.cyan);
    });
    
    console.log('\n🎉 AI games seeding completed successfully!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding AI games:', error);
    process.exit(1);
  }
};

// Run the seeder
seedAIGames();