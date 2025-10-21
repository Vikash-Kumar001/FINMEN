import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserProgress from '../models/UserProgress.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

const testInsert = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finmen');
    console.log('Connected to MongoDB');

    // Test inserting a single UserProgress record
    console.log('Testing UserProgress insert...');
    const testUserProgress = new UserProgress({
      userId: new mongoose.Types.ObjectId(),
      xp: 100,
      level: 1,
      healCoins: 50,
      streak: 5,
      lastCheckIn: new Date()
    });

    await testUserProgress.save();
    console.log('✅ UserProgress record created successfully');

    // Test inserting a single Transaction record
    console.log('Testing Transaction insert...');
    const testTransaction = new Transaction({
      userId: new mongoose.Types.ObjectId(),
      type: 'earn',
      amount: 1000,
      description: 'Test transaction',
      status: 'completed'
    });

    await testTransaction.save();
    console.log('✅ Transaction record created successfully');

    // Check counts
    const userProgressCount = await UserProgress.countDocuments();
    const transactionCount = await Transaction.countDocuments();
    
    console.log(`UserProgress count: ${userProgressCount}`);
    console.log(`Transaction count: ${transactionCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testInsert();
