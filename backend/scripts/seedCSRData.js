import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserProgress from '../models/UserProgress.js';
import Organization from '../models/Organization.js';
import Transaction from '../models/Transaction.js';
import Reward from '../models/Reward.js';
import XPLog from '../models/XPLog.js';

dotenv.config();

const seedCSRData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finmen');
    console.log('Connected to MongoDB');

    const organizationId = '507f1f77bcf86cd799439011';

    // Create test organization if it doesn't exist
    const existingOrg = await Organization.findById(organizationId);
    if (!existingOrg) {
      await Organization.create({
        _id: organizationId,
        name: 'Test CSR School',
        email: 'csr@test.com',
        type: 'school',
        tenantId: 'csr-tenant-001',
        companyId: new mongoose.Types.ObjectId(),
        settings: {
          timezone: 'Asia/Kolkata',
          currency: 'INR'
        }
      });
      console.log('Created test organization');
    }

    // Create test user progress data (matching actual schema)
    // Clear existing data first since userId is unique
    await UserProgress.deleteMany({});
    
    const progressData = [];

    for (let i = 0; i < 50; i++) {
      const xp = Math.floor(Math.random() * 1000) + 100;
      const level = Math.floor(xp / 100) + 1;
      const healCoins = Math.floor(Math.random() * 500) + 50;

      progressData.push({
        userId: new mongoose.Types.ObjectId(),
        xp,
        level,
        healCoins,
        streak: Math.floor(Math.random() * 30),
        lastCheckIn: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }

    try {
      await UserProgress.insertMany(progressData);
      console.log('Created user progress data');
    } catch (error) {
      console.error('Error creating user progress data:', error.message);
    }

    // Create test transactions (matching actual schema)
    // Clear existing data first
    await Transaction.deleteMany({});
    
    const transactions = [];
    for (let i = 0; i < 80; i++) {
      const amount = Math.floor(Math.random() * 10000) + 1000;

      transactions.push({
        userId: new mongoose.Types.ObjectId(),
        type: Math.random() > 0.5 ? 'earn' : 'credit',
        amount,
        description: `CSR Transaction ${transactions.length + 1}`,
        status: 'completed'
      });
    }

    try {
      await Transaction.insertMany(transactions);
      console.log('Created transaction data');
    } catch (error) {
      console.error('Error creating transaction data:', error.message);
    }

    // Create test rewards
    const rewards = [];
    
    for (let i = 0; i < 25; i++) {
      const cost = Math.floor(Math.random() * 500) + 100;

      rewards.push({
        name: `Test Reward ${i + 1}`,
        description: `Description for reward ${i + 1}`,
        cost
      });
    }

    await Reward.insertMany(rewards);
    console.log('Created reward data');

    // Create test XP logs
    const xpLogs = [];
    const reasons = ['mood_checkin', 'journal_entry', 'game_played', 'reward_redeemed', 'admin_adjustment'];
    
    for (let i = 0; i < 40; i++) {
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      const xp = Math.floor(Math.random() * 100) + 10;
      const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      xpLogs.push({
        userId: new mongoose.Types.ObjectId(),
        xp,
        reason,
        date
      });
    }

    await XPLog.insertMany(xpLogs);
    console.log('Created XP log data');

    console.log('CSR test data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding CSR data:', error);
    process.exit(1);
  }
};

seedCSRData();
