import bcrypt from 'bcrypt';
import Stripe from 'stripe';
import crypto from 'crypto';
import ParentRegistrationIntent from '../models/ParentRegistrationIntent.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Company from '../models/Company.js';
import UserSubscription from '../models/UserSubscription.js';
import SchoolClass from '../models/School/SchoolClass.js';
import SchoolStudent from '../models/School/SchoolStudent.js';
import Subscription from '../models/Subscription.js';
import { generateToken } from '../utils/generateToken.js';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const PARENT_PLAN_PRICE = 4999;
const PARENT_STUDENT_PREMIUM_UPGRADE_PRICE = 1000;

const FREE_PLAN_FEATURES = {
  fullAccess: false,
  parentDashboard: false,
  advancedAnalytics: false,
  certificates: false,
  wiseClubAccess: false,
  inavoraAccess: false,
  gamesPerPillar: 5,
  totalGames: 50,
};
const STUDENT_PREMIUM_FEATURES = {
  fullAccess: true,
  parentDashboard: false,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: -1,
  totalGames: 2200,
};

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

const EDUCATIONAL_INSTITUTIONS_PREMIUM_FEATURES = {
  fullAccess: true,
  parentDashboard: true,
  advancedAnalytics: true,
  certificates: true,
  wiseClubAccess: true,
  inavoraAccess: true,
  gamesPerPillar: -1,
  totalGames: 2200,
};

const calculateTargetPlan = (childPlanType) => {
  if (childPlanType === 'student_parent_premium_pro' || childPlanType === 'educational_institutions_premium') {
    return { planType: 'student_parent_premium_pro', amount: 0, mode: 'existing_family_plan' };
  }
  if (childPlanType === 'student_premium') {
    return { planType: 'student_parent_premium_pro', amount: PARENT_STUDENT_PREMIUM_UPGRADE_PRICE, mode: 'student_upgrade' };
  }
  return { planType: 'student_parent_premium_pro', amount: PARENT_PLAN_PRICE, mode: 'family_upgrade' };
};

const createStripeIntent = async ({ amount, currency, metadata }) => {
  if (!stripe) {
    const fakeIntentId = `int_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const metadataString = Object.entries(metadata || {})
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');
    return {
      id: fakeIntentId,
      client_secret: fakeIntentId,
      metadata,
      __mocked: true,
      description: `Mocked payment for ${metadata.planType || 'plan'} [${metadataString}]`,
    };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    payment_method_types: ['card', 'upi', 'netbanking'],
    metadata,
  });
  return paymentIntent;
};

export const initiateParentRegistration = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      flow,
      childLinkingCode,
    } = req.body;

    if (!stripe) {
      return res.status(500).json({ success: false, message: 'Payment gateway not configured.' });
    }

    if (!name || !email || !password || !flow) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    let childUser = null;
    let childPlanType = null;
    if (flow === 'child_existing') {
      if (!childLinkingCode) {
        return res.status(400).json({ success: false, message: 'Child linking code is required.' });
      }
      childUser = await User.findOne({ linkingCode: childLinkingCode.trim().toUpperCase() });
      if (!childUser || childUser.role !== 'student') {
        return res.status(404).json({ success: false, message: 'Child account not found for the provided code.' });
      }
      const childSubscription = await UserSubscription.getActiveSubscription(childUser._id);
      childPlanType = childSubscription?.planType || 'free';
    }

    const targetPlan = calculateTargetPlan(childPlanType);

    const hashedPassword = await bcrypt.hash(password, 10);
    const metadata = {
      purpose: 'parent_registration',
      parentEmail: normalizedEmail,
      flow,
      childUserId: childUser?._id?.toString() || '',
      childPlanType: childPlanType || 'free',
      planType: targetPlan.planType,
      amount: targetPlan.amount.toString(),
    };

    let paymentIntent = null;
    if (targetPlan.amount > 0) {
      paymentIntent = await createStripeIntent({
        amount: targetPlan.amount,
        currency: 'inr',
        metadata,
      });
    }

    const intent = await ParentRegistrationIntent.create({
      email: normalizedEmail,
      name,
      passwordHash: hashedPassword,
      flow,
      childUserId: childUser?._id,
      childSubscriptionPlan: childPlanType || null,
      planType: targetPlan.planType,
      amount: targetPlan.amount,
      currency: 'INR',
      stripePaymentIntentId: paymentIntent?.id || null,
      status: targetPlan.amount > 0 ? 'payment_pending' : 'completed',
      metadata: metadata,
      expiresAt: new Date(Date.now() + (targetPlan.amount > 0 ? 60 : 15) * 60 * 1000),
    });

    res.status(200).json({
      success: true,
      intentId: intent._id,
      requiresPayment: targetPlan.amount > 0,
      clientSecret: paymentIntent?.client_secret || null,
      amount: targetPlan.amount,
      currency: 'INR',
      planType: targetPlan.planType,
      flow,
    });
  } catch (error) {
    console.error('initiateParentRegistration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate parent registration' });
  }
};

const createParentAccountFromIntent = async (intent, paymentIntentId = null) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const parentUser = await User.create([{
      name: intent.name,
      fullName: intent.name,
      email: intent.email,
      password: intent.passwordHash,
      role: 'parent',
      isVerified: true,
      approvalStatus: 'approved',
    }], { session });

    const parent = parentUser[0];

    if (intent.childUserId) {
      await User.updateOne(
        { _id: intent.childUserId },
        {
          $addToSet: { 'linkedIds.parentIds': parent._id },
        },
        { session },
      );
      await User.updateOne(
        { _id: parent._id },
        {
          $addToSet: { 'linkedIds.childIds': intent.childUserId },
        },
        { session },
      );
    }

    const childId = intent.childUserId || null;

    const parentPlanEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const subscriptionPayload = {
      planType: 'student_parent_premium_pro',
      planName: 'Student + Parent Premium Pro Plan',
      amount: intent.amount,
      firstYearAmount: PARENT_PLAN_PRICE,
      renewalAmount: PARENT_PLAN_PRICE,
      isFirstYear: true,
      status: 'active',
      startDate: new Date(),
      endDate: parentPlanEndDate,
      features: {
        ...STUDENT_PARENT_PREMIUM_PRO_FEATURES,
      },
      transactions: paymentIntentId ? [{
        transactionId: `reg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        amount: intent.amount,
        currency: 'INR',
        status: 'completed',
        paymentDate: new Date(),
        stripePaymentIntentId: intent.stripePaymentIntentId,
      }] : [],
      metadata: {
        parentRegistrationIntentId: intent._id,
        childUserId: childId,
      },
    };

    if (childId) {
      const existingChildSub = await UserSubscription.getActiveSubscription(childId);
      if (!existingChildSub || existingChildSub.planType !== 'student_parent_premium_pro') {
        await UserSubscription.create([{
          userId: childId,
          ...subscriptionPayload,
        }], { session });
      } else {
        existingChildSub.transactions = existingChildSub.transactions || [];
        if (paymentIntentId) {
          existingChildSub.transactions.push({
            transactionId: `reg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: intent.amount,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
            stripePaymentIntentId: intent.stripePaymentIntentId,
          });
        }
        existingChildSub.planName = subscriptionPayload.planName;
        existingChildSub.features = subscriptionPayload.features;
        existingChildSub.endDate = parentPlanEndDate;
        await existingChildSub.save({ session });
      }
    }

    await UserSubscription.create([{
      userId: parent._id,
      ...subscriptionPayload,
    }], { session });

    await ParentRegistrationIntent.deleteOne({ _id: intent._id }, { session });

    await session.commitTransaction();

    return parent;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const confirmParentRegistration = async (req, res) => {
  try {
    const { intentId, paymentIntentId } = req.body;

    if (!intentId) {
      return res.status(400).json({ success: false, message: 'Intent ID is required' });
    }

    const intent = await ParentRegistrationIntent.findById(intentId);
    if (!intent) {
      return res.status(404).json({ success: false, message: 'Registration intent not found' });
    }

    if (intent.status === 'completed') {
      const existingUser = await User.findOne({ email: intent.email });
      if (existingUser) {
        return res.status(200).json({ success: true, user: existingUser });
      }
    }

    if (intent.amount > 0 && intent.stripePaymentIntentId && !intent.metadata?.__mocked) {
      if (!paymentIntentId) {
        return res.status(400).json({ success: false, message: 'Payment intent ID is required' });
      }
      if (!stripe) {
        return res.status(500).json({ success: false, message: 'Payment gateway not configured.' });
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ success: false, message: 'Payment not completed yet.' });
      }
    }

    const parentUser = await createParentAccountFromIntent(intent, paymentIntentId);

    const token = generateToken(parentUser._id);

    res.cookie("finmen_token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).status(200).json({
      success: true,
      user: {
        id: parentUser._id,
        name: parentUser.name,
        email: parentUser.email,
        role: parentUser.role,
      },
      token,
    });
  } catch (error) {
    console.error('confirmParentRegistration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to finalize parent registration' });
  }
};

export const linkStudentToParent = async (req, res) => {
  try {
    const { childEmail, parentLinkingCode } = req.body;

    if (!childEmail || !parentLinkingCode) {
      return res.status(400).json({ success: false, message: 'Child email and parent code required.' });
    }

    const child = await User.findOne({ email: childEmail.toLowerCase(), role: 'student' });
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child account not found.' });
    }

    const parent = await User.findOne({ linkingCode: parentLinkingCode.toUpperCase(), role: 'parent' });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent account not found for this code.' });
    }

    const parentSubscription = await UserSubscription.getActiveSubscription(parent._id);
    const isFamilyPlanActive = parentSubscription?.planType === 'student_parent_premium_pro';

    const childSubscription = await UserSubscription.getActiveSubscription(child._id);
    const childPlanType = childSubscription?.planType || 'free';

    if (!isFamilyPlanActive) {
      return res.status(400).json({ success: false, message: 'Parent plan is not active. Ask parent to complete setup.' });
    }

    if (childPlanType !== 'student_parent_premium_pro' && childPlanType !== 'educational_institutions_premium') {
      if (childSubscription) {
        childSubscription.transactions = childSubscription.transactions || [];
        childSubscription.transactions.push({
          transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          amount: 0,
          currency: 'INR',
          status: 'completed',
          paymentDate: new Date(),
        });
        childSubscription.planType = 'student_parent_premium_pro';
        childSubscription.planName = 'Student + Parent Premium Pro Plan';
        childSubscription.features = parentSubscription.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES;
        childSubscription.endDate = parentSubscription.endDate;
        await childSubscription.save();
      } else {
        await UserSubscription.create({
          userId: child._id,
          planType: 'student_parent_premium_pro',
          planName: 'Student + Parent Premium Pro Plan',
          amount: 0,
          firstYearAmount: PARENT_PLAN_PRICE,
          renewalAmount: PARENT_PLAN_PRICE,
          isFirstYear: true,
          status: 'active',
          startDate: new Date(),
          endDate: parentSubscription?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          features: parentSubscription?.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES,
          transactions: [{
            transactionId: `link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            linkedVia: 'parent_linking_code',
            parentId: parent._id,
          },
        });
      }
    }

    await User.updateOne({ _id: child._id }, { $addToSet: { 'linkedIds.parentIds': parent._id } });
    await User.updateOne({ _id: parent._id }, { $addToSet: { 'linkedIds.childIds': child._id } });

    res.status(200).json({
      success: true,
      message: 'Child linked to parent successfully.',
      childPlan: 'student_parent_premium_pro',
    });
  } catch (error) {
    console.error('linkStudentToParent error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to link student to parent' });
  }
};

export const verifyParentLinkCode = async (req, res) => {
  try {
    const { parentLinkingCode } = req.body;
    if (!parentLinkingCode) {
      return res.status(400).json({ success: false, message: 'Parent linking code is required.' });
    }

    const parent = await User.findOne({ linkingCode: parentLinkingCode.trim().toUpperCase(), role: 'parent' });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent account not found for this code.' });
    }

    const parentSubscription = await UserSubscription.getActiveSubscription(parent._id);

    res.status(200).json({
      success: true,
      parent: {
        id: parent._id,
        name: parent.name,
        email: parent.email,
        linkingCode: parent.linkingCode,
      },
      planType: parentSubscription?.planType || null,
    });
  } catch (error) {
    console.error('verifyParentLinkCode error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to verify parent code' });
  }
};

export const initiateStudentRegistration = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      dateOfBirth,
      flow,
      parentLinkingCode,
      gender,
      schoolLinkingCode,
    } = req.body;

    if (!fullName || !email || !password || !dateOfBirth || !flow || !gender) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const allowedFlows = ['parent_exists', 'parent_not_created', 'school_link'];
    if (!allowedFlows.includes(flow)) {
      return res.status(400).json({ success: false, message: 'Invalid registration flow selected.' });
    }

    const parsedDob = new Date(dateOfBirth);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date of birth format.' });
    }
    const now = new Date();
    if (parsedDob > now) {
      return res.status(400).json({ success: false, message: 'Date of birth cannot be in the future.' });
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedGender = String(gender).trim();
    const allowedGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];

    if (!allowedGenders.includes(normalizedGender)) {
      return res.status(400).json({ success: false, message: 'Invalid gender selection.' });
    }
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    let parent = null;
    if (flow === 'parent_exists') {
      if (!parentLinkingCode) {
        return res.status(400).json({ success: false, message: 'Parent linking code required.' });
      }
      parent = await User.findOne({ linkingCode: parentLinkingCode.trim().toUpperCase(), role: 'parent' });
      if (!parent) {
        return res.status(404).json({ success: false, message: 'Parent not found for provided code.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let schoolContext = null;

    if (flow === 'school_link') {
      if (!schoolLinkingCode || !schoolLinkingCode.trim()) {
        return res.status(400).json({ success: false, message: 'School linking code required.' });
      }

      const normalizedSchoolCode = schoolLinkingCode.trim().toUpperCase();

      let teacher = await User.findOne({ 'metadata.registrationCodes.code': normalizedSchoolCode });
      if (!teacher) {
        teacher = await User.findOne({
          'metadata.registrationCodes.code': schoolLinkingCode.trim(),
        });
      }

      let registrationRecord = null;
      let schoolClass = null;
      let organization = null;

      if (teacher) {
        const registrationEntries = Array.isArray(teacher.metadata?.registrationCodes)
          ? teacher.metadata.registrationCodes
          : [];
        registrationRecord = registrationEntries.find(
          (entry) => String(entry?.code || '').toUpperCase() === normalizedSchoolCode,
        );
      }

      if (registrationRecord) {
        if (registrationRecord.expiresAt && new Date(registrationRecord.expiresAt) < new Date()) {
          return res.status(400).json({ success: false, message: 'This school code has expired.' });
        }

        if (!registrationRecord.classId) {
          return res.status(400).json({ success: false, message: 'This school code is missing class information.' });
        }

        schoolClass = await SchoolClass.findById(registrationRecord.classId).lean();
        if (!schoolClass) {
          return res.status(404).json({ success: false, message: 'Class not found for provided school code.' });
        }
      } else {
        organization = await Organization.findOne({
          linkingCode: normalizedSchoolCode,
        }).lean();

        if (!organization) {
          organization = await Organization.findOne({ linkingCode: schoolLinkingCode.trim() }).lean();
        }

        if (!organization) {
          return res.status(404).json({ success: false, message: 'No school found for the provided code.' });
        }
      }

      const targetOrgId = schoolClass?.orgId || organization?._id;
      const targetTenantId = schoolClass?.tenantId || organization?.tenantId;

      const subscription = await Subscription.findOne({
        tenantId: targetTenantId,
        orgId: targetOrgId,
      }).lean();

      const now = new Date();
      let isPlanActive = false;
      let planStatus = 'inactive';
      let planEndDate = null;

      let subscriptionPlanName = null;

      if (subscription) {
        subscriptionPlanName = subscription.plan?.name || subscription.plan?.planType || null;
        const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
        if (subscription.status === 'active' && (!endDate || endDate > now)) {
          isPlanActive = true;
          planStatus = 'active';
          planEndDate = endDate;
        } else {
          planStatus = subscription.status || 'inactive';
          planEndDate = endDate && endDate > now ? endDate : null;
        }
      }

      schoolContext = {
        teacherId: teacher?._id || null,
        tenantId: targetTenantId,
        orgId: targetOrgId,
        classId: schoolClass?._id || null,
        academicYear: schoolClass?.academicYear || organization?.settings?.academicYear?.current || null,
        classNumber: schoolClass?.classNumber || null,
        registrationCode: normalizedSchoolCode,
        className: registrationRecord?.className || organization?.name || null,
        section: registrationRecord?.section || null,
        plan: {
          isActive: isPlanActive,
          status: planStatus,
          planType: isPlanActive
            ? (subscriptionPlanName === 'student_parent_premium_pro' ? 'student_parent_premium_pro'
              : subscriptionPlanName === 'educational_institutions_premium' ? 'educational_institutions_premium'
              : 'student_premium')
            : 'free',
          endDate: planEndDate,
        },
      };
    }

    res.status(200).json({
      success: true,
      payload: {
        name: fullName.trim(),
        email: normalizedEmail,
        passwordHash: hashedPassword,
        dateOfBirth: parsedDob,
        flow,
        gender: normalizedGender,
        parentId: parent?._id || null,
        schoolContext,
      },
    });
  } catch (error) {
    console.error('initiateStudentRegistration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate student registration' });
  }
};

export const finalizeStudentRegistration = async (req, res) => {
  try {
    const {
      name,
      email,
      passwordHash,
      dateOfBirth,
      flow,
      parentId,
      parentPlanType,
      gender,
      schoolContext,
    } = req.body;

    if (!name || !email || !passwordHash || !dateOfBirth || !flow || !gender) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    const allowedGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];
    if (!allowedGenders.includes(String(gender).trim())) {
      return res.status(400).json({ success: false, message: 'Invalid gender selection.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Account already exists.' });
    }

    const dobValue = new Date(dateOfBirth);
    if (Number.isNaN(dobValue.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date of birth.' });
    }

    if (flow === 'school_link' && !schoolContext) {
      return res.status(400).json({ success: false, message: 'School context missing for school registration flow.' });
    }

    const targetRole = flow === 'school_link' ? 'school_student' : 'student';
    const userDoc = {
      name,
      fullName: name,
      email,
      password: passwordHash,
      role: targetRole,
      dateOfBirth: dobValue,
      dob: dobValue.toISOString(),
      gender,
      isVerified: false,
    };

    if (flow === 'school_link' && schoolContext) {
      if (!schoolContext.orgId) {
        return res.status(400).json({ success: false, message: 'School information missing for registration.' });
      }

      const company = await Company.findOne({ organizations: schoolContext.orgId }).lean();
      const studentLimit = Number(company?.academicInfo?.totalStudents) || 0;
      if (studentLimit > 0) {
        const currentStudents = await SchoolStudent.countDocuments({ orgId: schoolContext.orgId });
        if (currentStudents >= studentLimit) {
          return res.status(403).json({
            success: false,
            message: 'You can’t register because your school has reached its maximum number of student seats. Please contact your school.',
          });
        }
      }

      userDoc.tenantId = schoolContext.tenantId;
      userDoc.orgId = schoolContext.orgId;
      const planExpiryDate = schoolContext?.plan?.endDate ? new Date(schoolContext.plan.endDate) : null;
      userDoc.metadata = {
        schoolEnrollment: {
          registrationCode: schoolContext.registrationCode,
          classId: schoolContext.classId,
          classNumber: schoolContext.classNumber,
          className: schoolContext.className || null,
          academicYear: schoolContext.academicYear || null,
          linkedTeacherId: schoolContext.teacherId || null,
          planStatus: schoolContext.plan?.status || 'inactive',
          planExpiresAt: planExpiryDate,
          linkedAt: new Date(),
        },
      };
    }

    const studentDoc = await User.create(userDoc);

    let createdPlanType = 'free';
    if (flow === 'parent_exists' && parentId) {
      const parentSubscription = await UserSubscription.getActiveSubscription(parentId);
      const parentHasActiveFamilyPlan = parentSubscription && parentSubscription.planType === 'student_parent_premium_pro';

      if (parentHasActiveFamilyPlan) {
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'student_parent_premium_pro',
          planName: 'Student + Parent Premium Pro Plan',
          amount: 0,
          firstYearAmount: PARENT_PLAN_PRICE,
          renewalAmount: PARENT_PLAN_PRICE,
          isFirstYear: true,
          status: 'active',
          startDate: new Date(),
          endDate: parentSubscription.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          features: parentSubscription.features || STUDENT_PARENT_PREMIUM_PRO_FEATURES,
          transactions: [{
            transactionId: `student_link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            studentRegistrationFlow: flow,
            parentId,
          },
        });
        createdPlanType = 'student_parent_premium_pro';
        await User.updateOne({ _id: studentDoc._id }, { $addToSet: { 'linkedIds.parentIds': parentId } });
        await User.updateOne({ _id: parentId }, { $addToSet: { 'linkedIds.childIds': studentDoc._id } });
      } else {
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'free',
          planName: 'Free Plan',
          amount: 0,
          firstYearAmount: 0,
          renewalAmount: 0,
          isFirstYear: true,
          status: 'active',
          startDate: new Date(),
          features: {
            ...FREE_PLAN_FEATURES,
          },
          metadata: {
            studentRegistrationFlow: flow,
            parentId,
          },
        });
        createdPlanType = 'free';
      }
    } else if (flow === 'school_link' && schoolContext) {
      const planDetails = schoolContext.plan || {};
      if (planDetails.isActive && planDetails.planType === 'educational_institutions_premium') {
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'educational_institutions_premium',
          planName: 'Educational Institutions Premium Plan',
          amount: 0,
          firstYearAmount: 0,
          renewalAmount: 0,
          isFirstYear: true,
          status: 'active',
          startDate: new Date(),
          endDate: planDetails.endDate ? new Date(planDetails.endDate) : undefined,
          features: {
            ...EDUCATIONAL_INSTITUTIONS_PREMIUM_FEATURES,
          },
          transactions: [{
            transactionId: `school_link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            studentRegistrationFlow: flow,
            orgId: schoolContext.orgId,
            tenantId: schoolContext.tenantId,
            registrationCode: schoolContext.registrationCode,
            linkedTeacherId: schoolContext.teacherId || null,
          },
        });
        createdPlanType = 'educational_institutions_premium';
      } else if (planDetails.planType === 'student_premium' && planDetails.isActive) {
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'student_premium',
          planName: 'Students Premium Plan',
          amount: 0,
          firstYearAmount: 0,
          renewalAmount: 0,
          isFirstYear: true,
          status: 'active',
          startDate: new Date(),
          endDate: planDetails.endDate ? new Date(planDetails.endDate) : undefined,
          features: {
            ...STUDENT_PREMIUM_FEATURES,
          },
          transactions: [{
            transactionId: `school_link_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            amount: 0,
            currency: 'INR',
            status: 'completed',
            paymentDate: new Date(),
          }],
          metadata: {
            studentRegistrationFlow: flow,
            orgId: schoolContext.orgId,
            tenantId: schoolContext.tenantId,
            registrationCode: schoolContext.registrationCode,
            linkedTeacherId: schoolContext.teacherId || null,
          },
        });
        createdPlanType = 'student_premium';
      } else {
        await UserSubscription.create({
          userId: studentDoc._id,
          planType: 'free',
          planName: 'Free Plan',
          amount: 0,
          firstYearAmount: 0,
          renewalAmount: 0,
          isFirstYear: true,
          status: 'active',
          startDate: new Date(),
          features: {
            ...FREE_PLAN_FEATURES,
          },
          metadata: {
            studentRegistrationFlow: flow,
            orgId: schoolContext.orgId,
            tenantId: schoolContext.tenantId,
            registrationCode: schoolContext.registrationCode,
          },
        });
        createdPlanType = 'free';
      }

      const admissionNumber = `ADM${new Date().getFullYear()}${Date.now().toString().slice(-6)}`;
      const rollNumber = `ROLL${Date.now().toString().slice(-6)}`;
      const formattedGender = gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Other';

      const schoolStudentRecord = await SchoolStudent.create({
        tenantId: schoolContext.tenantId,
        orgId: schoolContext.orgId,
        userId: studentDoc._id,
        admissionNumber,
        rollNumber,
        classId: schoolContext.classId,
        section: schoolContext.section || null,
        academicYear: schoolContext.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        parentIds: [],
        personalInfo: {
          dateOfBirth: dobValue,
          gender: formattedGender,
        },
        academicInfo: {
          admissionDate: new Date(),
        },
        isActive: true,
      });

      if (schoolContext.teacherId) {
        await User.updateOne({ _id: studentDoc._id }, { $addToSet: { 'linkedIds.teacherIds': schoolContext.teacherId } });
      }

      const io = req.app && typeof req.app.get === "function" ? req.app.get("io") : null;
      if (io && schoolContext.orgId) {
        try {
          const adminRecipients = await User.find({
            role: 'school_admin',
            orgId: schoolContext.orgId,
          }).select('_id tenantId');

          adminRecipients.forEach((admin) => {
            io.to(admin._id.toString()).emit('school:students:updated', {
              type: 'created',
              studentId: schoolStudentRecord._id.toString(),
              tenantId: schoolContext.tenantId || null,
              orgId: schoolContext.orgId?.toString?.() ?? null,
            });
          });
        } catch (emitError) {
          console.error('Error emitting school student update:', emitError);
        }
      }
    } else {
      await UserSubscription.create({
        userId: studentDoc._id,
        planType: 'free',
        planName: 'Free Plan',
        amount: 0,
        firstYearAmount: 0,
        renewalAmount: 0,
        isFirstYear: true,
        status: 'active',
        startDate: new Date(),
        features: {
          ...FREE_PLAN_FEATURES,
        },
        metadata: {
          studentRegistrationFlow: flow,
        },
      });
    }

    res.status(200).json({
      success: true,
      userId: studentDoc._id,
      linkingCode: studentDoc.linkingCode,
      planType: createdPlanType,
    });
  } catch (error) {
    console.error('finalizeStudentRegistration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to finalize student registration' });
  }
};

