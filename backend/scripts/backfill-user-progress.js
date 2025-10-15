// Script to backfill UserProgress for existing users
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';
import Wallet from '../models/Wallet.js';
import UnifiedGameProgress from '../models/UnifiedGameProgress.js';

dotenv.config();

async function backfillUserProgress() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all students
    const students = await User.find({ role: 'student' });
    console.log(`\n📊 Found ${students.length} students to process`);

    let created = 0;
    let updated = 0;

    for (const student of students) {
      console.log(`\n👤 Processing: ${student.name} (${student.email})`);
      
      // Check if UserProgress exists
      let userProgress = await UserProgress.findOne({ userId: student._id });
      
      if (!userProgress) {
        // Create new UserProgress
        userProgress = await UserProgress.create({
          userId: student._id,
          xp: 0,
          level: 1,
          healCoins: 0,
          streak: 0,
          lastCheckIn: new Date()
        });
        console.log('  ✨ Created new UserProgress');
        created++;
      } else {
        console.log('  ℹ️  UserProgress already exists');
        
        // Calculate XP from game progress if needed
        if (userProgress.xp === 0) {
          const wallet = await Wallet.findOne({ userId: student._id });
          if (wallet && wallet.balance > 0) {
            // Estimate XP from coins (2 XP per coin)
            const estimatedXP = Math.floor(wallet.balance / 2);
            userProgress.xp = estimatedXP;
            userProgress.level = Math.floor(estimatedXP / 100) + 1;
            await userProgress.save();
            console.log(`  🔄 Updated XP to ${estimatedXP} (Level ${userProgress.level})`);
            updated++;
          }
        }
      }
      
      // Check game activity for streak
      const gameActivity = await UnifiedGameProgress.find({ userId: student._id });
      if (gameActivity.length > 0) {
        const lastPlayed = gameActivity
          .map(g => g.lastPlayedAt)
          .filter(d => d)
          .sort((a, b) => b - a)[0];
        
        if (lastPlayed) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const lastPlayedDay = new Date(lastPlayed);
          lastPlayedDay.setHours(0, 0, 0, 0);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastPlayedDay.getTime() === today.getTime() || lastPlayedDay.getTime() === yesterday.getTime()) {
            userProgress.streak = Math.max(userProgress.streak, 1);
            userProgress.lastCheckIn = lastPlayed;
            await userProgress.save();
            console.log(`  📅 Updated streak to ${userProgress.streak}`);
          }
        }
      }
      
      console.log(`  📊 Final stats: Level ${userProgress.level}, ${userProgress.xp} XP, ${userProgress.streak} day streak`);
    }

    console.log(`\n✅ Backfill complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Total: ${students.length}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

backfillUserProgress();

