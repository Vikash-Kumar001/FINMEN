// Script to create a test student account with Student + Parent Premium Pro Plan
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';
import UserSubscription from './models/UserSubscription.js';
import { generateAvatar } from './utils/avatarGenerator.js';

// Load environment variables
dotenv.config();

const PLAN_CONFIG = {
  name: 'Student + Parent Premium Pro Plan',
  planType: 'student_parent_premium_pro',
  firstYearAmount: 4999,
  renewalAmount: 1499,
  features: {
    fullAccess: true,
    parentDashboard: true,
    advancedAnalytics: true,
    certificates: true,
    wiseClubAccess: true,
    inavoraAccess: true,
    gamesPerPillar: -1, // Unlimited
    totalGames: 2200,
  },
};

const createTestAccount = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/finmen';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const email = 'm@gmail.com';
    const password = '123456789';
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail });
    
    if (user) {
      console.log(`⚠️  User with email ${email} already exists. Updating...`);
      
      // Update user details
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.role = 'student';
      user.isVerified = true;
      user.approvalStatus = 'approved';
      
      // Generate avatar if not exists
      if (!user.avatarData || !user.avatarData.isGenerated) {
        const avatarData = generateAvatar({
          name: user.name || 'Test Student',
          email: normalizedEmail,
          role: 'student'
        });
        user.avatarData = avatarData;
      }
      
      await user.save();
      console.log(`✅ User updated: ${user._id}`);
    } else {
      console.log(`\n🧪 Creating new test student account...`);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate avatar
      const avatarData = generateAvatar({
        name: 'Test Student',
        email: normalizedEmail,
        role: 'student'
      });
      
      // Create user
      user = await User.create({
        name: 'Test Student',
        fullName: 'Test Student',
        email: normalizedEmail,
        password: hashedPassword,
        role: 'student',
        isVerified: true,
        approvalStatus: 'approved',
        dateOfBirth: new Date('2010-01-01'), // Set a default date of birth
        dob: '2010-01-01',
        avatarData: avatarData,
      });
      
      console.log(`✅ User created: ${user._id}`);
    }

    // Check if subscription already exists
    let subscription = await UserSubscription.findOne({
      userId: user._id,
      planType: PLAN_CONFIG.planType,
      status: 'active'
    });

    if (subscription) {
      console.log(`⚠️  Active subscription already exists. Updating to ensure it's active...`);
      
      // Update subscription to ensure it's active and has correct features
      subscription.status = 'active';
      subscription.planName = PLAN_CONFIG.name;
      subscription.firstYearAmount = PLAN_CONFIG.firstYearAmount;
      subscription.renewalAmount = PLAN_CONFIG.renewalAmount;
      subscription.isFirstYear = true;
      subscription.startDate = new Date();
      subscription.endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
      subscription.features = PLAN_CONFIG.features;
      
      // Add a transaction record if none exists
      if (!subscription.transactions || subscription.transactions.length === 0) {
        subscription.transactions = [{
          transactionId: `test_account_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          amount: 0,
          currency: 'INR',
          status: 'completed',
          mode: 'system',
          paymentDate: new Date(),
          initiatedBy: {
            context: 'system'
          },
          metadata: {
            testAccount: true,
            createdBy: 'create-test-account script'
          }
        }];
      }
      
      await subscription.save();
      console.log(`✅ Subscription updated: ${subscription._id}`);
    } else {
      // Cancel or expire any existing subscriptions
      await UserSubscription.updateMany(
        { userId: user._id, status: 'active' },
        { status: 'expired', cancelledAt: new Date() }
      );
      
      console.log(`\n🧪 Creating Student + Parent Premium Pro Plan subscription...`);
      
      // Create new subscription
      subscription = await UserSubscription.create({
        userId: user._id,
        planType: PLAN_CONFIG.planType,
        planName: PLAN_CONFIG.name,
        amount: 0, // Test account, no payment
        firstYearAmount: PLAN_CONFIG.firstYearAmount,
        renewalAmount: PLAN_CONFIG.renewalAmount,
        isFirstYear: true,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        features: PLAN_CONFIG.features,
        transactions: [{
          transactionId: `test_account_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          amount: 0,
          currency: 'INR',
          status: 'completed',
          mode: 'system',
          paymentDate: new Date(),
          initiatedBy: {
            context: 'system'
          },
          metadata: {
            testAccount: true,
            createdBy: 'create-test-account script'
          }
        }],
        purchasedBy: {
          context: 'system'
        },
        metadata: {
          testAccount: true,
          createdBy: 'create-test-account script',
          createdAt: new Date()
        }
      });
      
      console.log(`✅ Subscription created: ${subscription._id}`);
    }

    console.log('\n📋 Account Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`User ID: ${user._id}`);
    console.log(`Role: ${user.role}`);
    console.log(`Verified: ${user.isVerified}`);
    console.log(`Plan: ${PLAN_CONFIG.name}`);
    console.log(`Subscription Status: ${subscription.status}`);
    console.log(`Subscription End Date: ${subscription.endDate.toLocaleDateString()}`);
    console.log(`Features:`);
    console.log(`  - Full Access: ${subscription.features.fullAccess}`);
    console.log(`  - Parent Dashboard: ${subscription.features.parentDashboard}`);
    console.log(`  - Advanced Analytics: ${subscription.features.advancedAnalytics}`);
    console.log(`  - Certificates: ${subscription.features.certificates}`);
    console.log(`  - WiseClub Access: ${subscription.features.wiseClubAccess}`);
    console.log(`  - Inavora Access: ${subscription.features.inavoraAccess}`);
    console.log(`  - Games Per Pillar: ${subscription.features.gamesPerPillar === -1 ? 'Unlimited' : subscription.features.gamesPerPillar}`);
    console.log(`  - Total Games: ${subscription.features.totalGames}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 Test account created successfully!');

  } catch (error) {
    console.error('❌ Error creating test account:', error);
    if (error.code === 11000) {
      console.error('Duplicate key error - user may already exist with different fields');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

// Run the script
createTestAccount();

