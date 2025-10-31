import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserProgress from '../models/UserProgress.js';
import Transaction from '../models/Transaction.js';
import Reward from '../models/Reward.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finmen');
    console.log('Connected to MongoDB');

    const organizationId = '507f1f77bcf86cd799439011';

    // Check UserProgress data
    const userProgressCount = await UserProgress.countDocuments({
      organizationId: new mongoose.Types.ObjectId(organizationId)
    });
    console.log(`UserProgress records: ${userProgressCount}`);

    // Check Transaction data
    const transactionCount = await Transaction.countDocuments({
      organizationId: new mongoose.Types.ObjectId(organizationId)
    });
    console.log(`Transaction records: ${transactionCount}`);

    // Check Reward data
    const rewardCount = await Reward.countDocuments();
    console.log(`Reward records: ${rewardCount}`);

    // Sample some data
    const sampleUserProgress = await UserProgress.findOne({
      organizationId: new mongoose.Types.ObjectId(organizationId)
    });
    console.log('Sample UserProgress:', sampleUserProgress);

    const sampleTransaction = await Transaction.findOne({
      organizationId: new mongoose.Types.ObjectId(organizationId)
    });
    console.log('Sample Transaction:', sampleTransaction);

    const sampleReward = await Reward.findOne();
    console.log('Sample Reward:', sampleReward);

    process.exit(0);
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
};

checkData();
