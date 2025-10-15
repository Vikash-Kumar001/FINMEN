/**
 * Migration Script: Generate Avatars for Existing Users
 * This script will generate avatars for all existing users who don't have avatarData
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import { generateAvatar } from '../utils/avatarGenerator.js';
import dotenv from 'dotenv';

dotenv.config();

const generateAvatarsForExistingUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finmen');
    console.log('✅ Connected to MongoDB');

    // Find all users without avatarData
    const usersWithoutAvatars = await User.find({
      $or: [
        { avatarData: { $exists: false } },
        { avatarData: null },
        { 'avatarData.type': { $exists: false } }
      ]
    });

    console.log(`📊 Found ${usersWithoutAvatars.length} users without avatar data`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutAvatars) {
      try {
        // Generate avatar data
        const avatarData = generateAvatar({
          name: user.name,
          email: user.email,
          role: user.role
        });

        // Update user with avatar data
        await User.findByIdAndUpdate(user._id, {
          avatar: avatarData.url, // Update legacy avatar field
          avatarData: {
            type: 'generated',
            ...avatarData
          }
        });

        console.log(`✅ Generated avatar for ${user.name} (${user.role})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to generate avatar for ${user.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully processed: ${successCount} users`);
    console.log(`❌ Failed: ${errorCount} users`);
    console.log(`📊 Total users processed: ${usersWithoutAvatars.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the migration
generateAvatarsForExistingUsers();
