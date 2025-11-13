import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/User.js';
import UserSubscription from '../models/UserSubscription.js';

// Load environment variables
dotenv.config();

const STUDENT_PARENT_PREMIUM_PRO_FEATURES = {
  fullAccess: true,
  parentDashboard: true,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: -1,
  totalGames: 2200,
};

const createTestStudentPro = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test student credentials
    const testEmail = 'teststudentpro@finmen.com';
    const testPassword = 'TestStudentPro123!';
    const testName = 'Test Student Pro';
    const testDateOfBirth = new Date('2010-01-15');
    const testGender = 'male';

    // Check if student already exists
    const existingStudent = await User.findOne({ email: testEmail });
    if (existingStudent) {
      console.log('⚠️ Student account already exists with this email');
      console.log('📧 Email:', testEmail);
      console.log('🔑 Password:', testPassword);
      console.log('👤 Name:', existingStudent.name || existingStudent.fullName);
      console.log('🔗 Linking Code:', existingStudent.linkingCode);
      
      // Check subscription
      const subscription = await UserSubscription.getActiveSubscription(existingStudent._id);
      if (subscription) {
        console.log('📦 Current Plan:', subscription.planType);
        console.log('📅 Status:', subscription.status);
        console.log('📅 End Date:', subscription.endDate);
        
        // Update to student_parent_premium_pro if not already
        if (subscription.planType !== 'student_parent_premium_pro') {
          console.log('🔄 Updating subscription to student_parent_premium_pro...');
          subscription.planType = 'student_parent_premium_pro';
          subscription.planName = 'Student + Parent Premium Pro Plan';
          subscription.features = STUDENT_PARENT_PREMIUM_PRO_FEATURES;
          subscription.amount = 4999;
          subscription.firstYearAmount = 4999;
          subscription.renewalAmount = 1499;
          await subscription.save();
          console.log('✅ Subscription updated to student_parent_premium_pro');
        }
      } else {
        console.log('⚠️ No active subscription found. Creating student_parent_premium_pro subscription...');
        await createSubscription(existingStudent._id);
      }
      
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Generate linking code
    const prefix = 'ST';
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

    // Create student user
    const student = await User.create({
      name: testName,
      fullName: testName,
      email: testEmail,
      password: hashedPassword,
      role: 'student',
      linkingCode: linkingCode,
      linkingCodeIssuedAt: new Date(),
      dateOfBirth: testDateOfBirth,
      dob: testDateOfBirth.toISOString().split('T')[0],
      gender: testGender,
      isVerified: true,
      linkedIds: {
        childIds: [],
        parentIds: [],
        teacherIds: [],
      },
    });

    console.log('✅ Student account created successfully!');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
    console.log('👤 Name:', testName);
    console.log('🔗 Linking Code:', linkingCode);

    // Create subscription with student_parent_premium_pro plan
    await createSubscription(student._id);

    console.log('\n✅ Test student account setup complete!');
    console.log('📋 Summary:');
    console.log('   Email:', testEmail);
    console.log('   Password:', testPassword);
    console.log('   Linking Code:', linkingCode);
    console.log('   Plan: student_parent_premium_pro');
    console.log('   Status: active');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error creating test student:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

const createSubscription = async (studentId) => {
  try {
    // Check if subscription already exists
    const existingSubscription = await UserSubscription.getActiveSubscription(studentId);
    if (existingSubscription && existingSubscription.planType === 'student_parent_premium_pro') {
      console.log('✅ Active student_parent_premium_pro subscription already exists');
      return existingSubscription;
    }

    // Create new subscription
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now

    const subscription = await UserSubscription.create({
      userId: studentId,
      planType: 'student_parent_premium_pro',
      planName: 'Student + Parent Premium Pro Plan',
      amount: 4999,
      firstYearAmount: 4999,
      renewalAmount: 1499,
      isFirstYear: true,
      status: 'active',
      startDate: new Date(),
      endDate: endDate,
      features: STUDENT_PARENT_PREMIUM_PRO_FEATURES,
      transactions: [{
        transactionId: `test_student_pro_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
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
createTestStudentPro();

