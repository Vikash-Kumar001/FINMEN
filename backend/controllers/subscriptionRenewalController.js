import mongoose from 'mongoose';
import SubscriptionRenewalRequest from '../models/SubscriptionRenewalRequest.js';
import Subscription from '../models/Subscription.js';
import Company from '../models/Company.js';
import Organization from '../models/Organization.js';

// Get all subscription renewal requests (admin only)
export const getSubscriptionRenewalRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const requests = await SubscriptionRenewalRequest.find(filter)
      .populate('orgId', 'name tenantId')
      .populate('companyId', 'name email')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SubscriptionRenewalRequest.countDocuments(filter);

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching subscription renewal requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch renewal requests',
      error: error.message,
    });
  }
};

// Get single renewal request by ID
export const getSubscriptionRenewalRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await SubscriptionRenewalRequest.findById(requestId)
      .populate('orgId', 'name tenantId')
      .populate('companyId', 'name email contactInfo')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('subscriptionId');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Renewal request not found',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('Error fetching renewal request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch renewal request',
      error: error.message,
    });
  }
};

// Approve subscription renewal request
export const approveSubscriptionRenewal = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminNotes } = req.body || {};

    const request = await SubscriptionRenewalRequest.findById(requestId)
      .populate('subscriptionId')
      .populate('companyId');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Renewal request not found',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    const subscription = await Subscription.findById(request.subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    // Define helper functions (same as in schoolController)
    const BILLING_CYCLE_MONTHS = { yearly: 12 };
    const BILLING_MULTIPLIER = { yearly: 12 };
    const EXTRA_USAGE_RATES = { student: 40, teacher: 120 };
    const PLAN_DISPLAY_NAMES = {
      free: 'Free Plan',
      student_premium: 'Student Premium Plan',
      student_parent_premium_pro: 'Student + Parent Premium Pro Plan',
      educational_institutions_premium: 'Educational Institutions Premium Plan'
    };
    const PLAN_LIMITS = {
      free: { price: 0, maxStudents: 100, maxTeachers: 10, maxClasses: 10, maxCampuses: 1, maxStorage: 5, maxTemplates: 50 },
      student_premium: { price: 4499, maxStudents: 1000, maxTeachers: 100, maxClasses: 100, maxCampuses: 3, maxStorage: 200, maxTemplates: 200 },
      student_parent_premium_pro: { price: 4999, maxStudents: 1000, maxTeachers: 100, maxClasses: 100, maxCampuses: 3, maxStorage: 200, maxTemplates: 200 },
      educational_institutions_premium: { price: 0, maxStudents: 10000, maxTeachers: 1000, maxClasses: 1000, maxCampuses: 20, maxStorage: 1000, maxTemplates: 2000 }
    };
    const PLAN_FEATURES = {
      free: { advancedAnalytics: false, aiAssistant: false, customBranding: false, apiAccess: false, prioritySupport: false, whiteLabel: false, premiumTemplates: false },
      student_premium: { advancedAnalytics: true, aiAssistant: false, customBranding: false, apiAccess: false, prioritySupport: false, whiteLabel: false, premiumTemplates: true },
      student_parent_premium_pro: { advancedAnalytics: true, aiAssistant: true, customBranding: false, apiAccess: false, prioritySupport: true, whiteLabel: false, premiumTemplates: true },
      educational_institutions_premium: { advancedAnalytics: true, aiAssistant: true, customBranding: true, apiAccess: true, prioritySupport: true, whiteLabel: false, premiumTemplates: true }
    };
    
    const capitalize = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);
    const resolvePlanFeatures = (planName) => {
      const base = PLAN_FEATURES[planName] || PLAN_FEATURES.free;
      return { ...base };
    };
    const resolvePlanLimits = (planName) => {
      const base = PLAN_LIMITS[planName] || PLAN_LIMITS.free;
      const { price, ...limits } = base;
      return { ...limits };
    };
    const computeBillingAmount = (planName, billingCycle, students = 0, teachers = 0) => {
      const plan = PLAN_LIMITS[planName] || PLAN_LIMITS.free;
      const cycle = billingCycle || 'yearly';
      const multiplier = BILLING_MULTIPLIER[cycle] || BILLING_MULTIPLIER.yearly;
      let amount = plan.price * multiplier;
      const extraStudents = plan.maxStudents === -1 ? 0 : Math.max(0, students - plan.maxStudents);
      const extraTeachers = plan.maxTeachers === -1 ? 0 : Math.max(0, teachers - plan.maxTeachers);
      amount += (extraStudents * EXTRA_USAGE_RATES.student + extraTeachers * EXTRA_USAGE_RATES.teacher) * multiplier;
      return { amount, extraStudents, extraTeachers };
    };

    const targetPlanName = request.requestedPlan.name;
    const desiredStudents = request.requestedStudents;
    const desiredTeachers = request.requestedTeachers;
    const cycle = request.billingCycle || 'yearly';
    const now = new Date();
    const cycleMonths = BILLING_CYCLE_MONTHS[cycle] || BILLING_CYCLE_MONTHS.yearly;
    const multiplier = BILLING_MULTIPLIER[cycle] || BILLING_MULTIPLIER.yearly;

    const resolvedLimits = resolvePlanLimits(targetPlanName);
    const features = resolvePlanFeatures(targetPlanName);

    const updatedLimits = {
      ...resolvedLimits,
      maxStudents: resolvedLimits.maxStudents === -1
        ? -1
        : Math.max(resolvedLimits.maxStudents, desiredStudents),
      maxTeachers: resolvedLimits.maxTeachers === -1
        ? -1
        : Math.max(resolvedLimits.maxTeachers, desiredTeachers),
      features,
    };

    const planConfig = PLAN_LIMITS[targetPlanName];
    
    subscription.plan = {
      name: targetPlanName,
      displayName: PLAN_DISPLAY_NAMES[targetPlanName] || `${capitalize(targetPlanName)} Plan`,
      price: planConfig.price,
      billingCycle: cycle,
    };

    subscription.limits = updatedLimits;
    subscription.status = 'active';
    subscription.autoRenew = true;
    subscription.startDate = subscription.startDate || now;
    subscription.lastRenewedAt = now; // Track when subscription was renewed

    const previousEnd = subscription.endDate ? new Date(subscription.endDate) : null;
    const renewalBase = previousEnd && previousEnd > now ? previousEnd : now;
    const nextEndDate = new Date(renewalBase);
    nextEndDate.setMonth(nextEndDate.getMonth() + cycleMonths);
    subscription.endDate = nextEndDate;

    const { amount, extraStudents, extraTeachers } = computeBillingAmount(
      targetPlanName,
      cycle,
      desiredStudents,
      desiredTeachers
    );

    const addOns = (subscription.addOns || []).filter(addOn => !['extra_students', 'extra_teachers'].includes(addOn.name));

    if (extraStudents > 0) {
      addOns.push({
        name: 'extra_students',
        description: `${extraStudents} additional students`,
        price: EXTRA_USAGE_RATES.student * multiplier,
        quantity: extraStudents,
        active: true,
      });
    }

    if (extraTeachers > 0) {
      addOns.push({
        name: 'extra_teachers',
        description: `${extraTeachers} additional teachers`,
        price: EXTRA_USAGE_RATES.teacher * multiplier,
        quantity: extraTeachers,
        active: true,
      });
    }

    subscription.addOns = addOns;

    subscription.invoices = subscription.invoices || [];
    subscription.invoices.push({
      invoiceId: `INV-${Date.now()}`,
      amount,
      currency: 'INR',
      status: 'paid',
      paidAt: now,
      dueDate: nextEndDate,
      description: `${PLAN_DISPLAY_NAMES[targetPlanName] || capitalize(targetPlanName)} Renewal - ${capitalize(cycle)} • ${desiredStudents} students / ${desiredTeachers} teachers`,
    });

    const previousNotes = subscription.notes ? `\n${subscription.notes}` : '';
    subscription.notes = `Renewed on ${now.toISOString()} by Admin (approved renewal request ${requestId}) for ${desiredStudents} students and ${desiredTeachers} teachers.${previousNotes}`;

    await subscription.save();

    // Update Company subscription info
    if (request.companyId) {
      const company = await Company.findById(request.companyId);
      if (company) {
        company.subscriptionPlan = targetPlanName;
        company.subscriptionStart = subscription.startDate;
        company.subscriptionExpiry = subscription.endDate;
        await company.save();
      }
    }

    // Sync all linked students' subscriptions to premium and teachers' access
    const { syncSchoolStudentSubscriptions, syncSchoolTeacherAccess } = await import('../services/schoolStudentSubscriptionSync.js');
    const io = req.app.get('io');
    try {
      const syncResult = await syncSchoolStudentSubscriptions(
        request.orgId.toString(),
        request.tenantId,
        true, // isActive = true (renewed)
        subscription.endDate,
        io
      );
      console.log(`Synced ${syncResult.studentsUpdated} student subscriptions after renewal approval`);

      // Sync teacher access
      const teacherSyncResult = await syncSchoolTeacherAccess(
        request.orgId.toString(),
        request.tenantId,
        true, // isActive = true (renewed)
        subscription.endDate,
        io
      );
      console.log(`Notified ${teacherSyncResult.teachersNotified} teachers after renewal approval`);
    } catch (syncError) {
      console.error('Error syncing subscriptions after renewal:', syncError);
      // Don't fail the renewal if sync fails, but log it
    }

    // Update renewal request
    request.status = 'approved';
    request.approvedBy = req.user._id;
    request.approvedByName = req.user.name || 'Admin';
    request.approvedAt = now;
    request.adminNotes = adminNotes || '';
    await request.save();

    // Emit socket events
    if (io) {
      // Notify school admin
      io.to(request.requestedBy.toString()).emit('school:subscription:updated', {
        subscription: subscription.toObject ? subscription.toObject() : subscription,
        tenantId: request.tenantId,
        orgId: request.orgId.toString(),
      });

      // Notify all admins
      io.emit('admin:subscription-renewal:approved', {
        requestId: request._id,
        orgId: request.orgId.toString(),
        companyName: request.companyId?.name,
      });
    }

    res.json({
      success: true,
      message: 'Subscription renewal approved successfully',
      data: {
        request: request.toObject ? request.toObject() : request,
        subscription: subscription.toObject ? subscription.toObject() : subscription,
      },
    });
  } catch (error) {
    console.error('Error approving renewal request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve renewal request',
      error: error.message,
    });
  }
};

// Reject subscription renewal request
export const rejectSubscriptionRenewal = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rejectionReason, adminNotes } = req.body || {};

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const request = await SubscriptionRenewalRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Renewal request not found',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    request.status = 'rejected';
    request.approvedBy = req.user._id;
    request.approvedByName = req.user.name || 'Admin';
    request.approvedAt = new Date();
    request.rejectionReason = rejectionReason;
    request.adminNotes = adminNotes || '';
    await request.save();

    // Emit socket events
    const io = req.app.get('io');
    if (io) {
      // Notify school admin
      io.to(request.requestedBy.toString()).emit('school:subscription-renewal:rejected', {
        requestId: request._id,
        rejectionReason,
      });

      // Notify all admins
      io.emit('admin:subscription-renewal:rejected', {
        requestId: request._id,
        orgId: request.orgId.toString(),
      });
    }

    res.json({
      success: true,
      message: 'Subscription renewal rejected',
      data: request.toObject ? request.toObject() : request,
    });
  } catch (error) {
    console.error('Error rejecting renewal request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject renewal request',
      error: error.message,
    });
  }
};

