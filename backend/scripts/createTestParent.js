import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/User.js';
import UserSubscription from '../models/UserSubscription.js';

// Load environment variables
dotenv.config();

const PARENT_PLAN_PRICE = 4999;
const STUDENT_PARENT_PREMIUM_PRO_FEATURES = {
  fullAccess: true,
  parentDashboard: true,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: 220,
  totalGames: 2200,
};

const createTestParent = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test parent credentials
    const testEmail = 'testparent@finmen.com';
    const testPassword = 'TestParent123!';
    const testName = 'Test Parent';

    // Check if parent already exists
    const existingParent = await User.findOne({ email: testEmail });
    if (existingParent) {
      console.log('⚠️ Parent account already exists with this email');
      console.log('📧 Email:', testEmail);
      console.log('🔑 Password:', testPassword);
      console.log('👤 Name:', existingParent.name || existingParent.fullName);
      console.log('🔗 Linking Code:', existingParent.linkingCode);
      
      // Check subscription
      const subscription = await UserSubscription.getActiveSubscription(existingParent._id);
      if (subscription) {
        console.log('📦 Current Plan:', subscription.planType);
        console.log('📅 Status:', subscription.status);
        console.log('📅 End Date:', subscription.endDate);
      } else {
        console.log('⚠️ No active subscription found. Creating one...');
        await createSubscription(existingParent._id);
      }
      
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Generate linking code
    const prefix = 'PR';
    let linkingCode;
    let isUnique = false;
    while (!isUnique) {
      const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
      linkingCode = `${prefix}-${randomPart}`;
      const existing = await User.findOne({ linkingCode });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create parent user
    const parent = await User.create({
      name: testName,
      fullName: testName,
      email: testEmail,
      password: hashedPassword,
      role: 'parent',
      linkingCode: linkingCode,
      linkingCodeIssuedAt: new Date(),
      isVerified: true,
      linkedIds: {
        childIds: [],
        parentIds: [],
        teacherIds: [],
      },
    });

    console.log('✅ Parent account created successfully!');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
    console.log('👤 Name:', testName);
    console.log('🔗 Linking Code:', linkingCode);

    // Create subscription with student_parent_premium_pro plan
    await createSubscription(parent._id);

    console.log('\n✅ Test parent account setup complete!');
    console.log('📋 Summary:');
    console.log('   Email:', testEmail);
    console.log('   Password:', testPassword);
    console.log('   Linking Code:', linkingCode);
    console.log('   Plan: student_parent_premium_pro');
    console.log('   Status: active');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error creating test parent:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

const createSubscription = async (parentId) => {
  try {
    // Check if subscription already exists
    const existingSubscription = await UserSubscription.getActiveSubscription(parentId);
    if (existingSubscription && existingSubscription.planType === 'student_parent_premium_pro') {
      console.log('✅ Active student_parent_premium_pro subscription already exists');
      return existingSubscription;
    }

    // Create new subscription
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now

    const subscription = await UserSubscription.create({
      userId: parentId,
      planType: 'student_parent_premium_pro',
      planName: 'Student + Parent Premium Pro Plan',
      amount: PARENT_PLAN_PRICE,
      firstYearAmount: PARENT_PLAN_PRICE,
      renewalAmount: 1499,
      isFirstYear: true,
      status: 'active',
      startDate: new Date(),
      endDate: endDate,
      features: STUDENT_PARENT_PREMIUM_PRO_FEATURES,
      transactions: [{
        transactionId: `test_parent_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        amount: 0, // Free for testing
        currency: 'INR',
        status: 'completed',
        paymentDate: new Date(),
        paymentMethod: 'test',
      }],
      metadata: {
        createdFor: 'testing',
        testAccount: true,
      },
    });

    console.log('✅ Subscription created successfully');
    console.log('   Plan: student_parent_premium_pro');
    console.log('   Status: active');
    console.log('   End Date:', endDate.toISOString().split('T')[0]);

    return subscription;
  } catch (error) {
    console.error('❌ Error creating subscription:', error);
    throw error;
  }
};

// Run the script
createTestParent();

