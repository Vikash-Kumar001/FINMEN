import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

/**
 * Check if teacher has access based on school subscription status
 */
export const checkTeacherAccess = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user || (user.role !== 'school_teacher' && user.role !== 'teacher')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.',
      });
    }

    if (!user.orgId || !user.tenantId) {
      return res.status(200).json({
        success: true,
        hasAccess: false,
        reason: 'not_linked_to_school',
        message: 'You are not linked to any school.',
      });
    }

    // Find the school's subscription
    const schoolSubscription = await Subscription.findOne({
      orgId: user.orgId,
      tenantId: user.tenantId
    });

    if (!schoolSubscription) {
      return res.status(200).json({
        success: true,
        hasAccess: false,
        reason: 'no_subscription',
        message: 'Your school does not have an active subscription.',
      });
    }

    const now = new Date();
    const isActive = schoolSubscription.status === 'active' && 
                    (!schoolSubscription.endDate || new Date(schoolSubscription.endDate) > now);

    // Get school information
    const school = await Organization.findById(user.orgId).select('name settings.contactInfo');

    return res.status(200).json({
      success: true,
      hasAccess: isActive,
      subscriptionStatus: schoolSubscription.status,
      subscriptionEndDate: schoolSubscription.endDate,
      isExpired: !isActive,
      reason: isActive ? 'active_subscription' : 'expired_subscription',
      message: isActive 
        ? 'You have access to the platform.' 
        : 'Your school\'s subscription has expired. Please contact your school administrator.',
      schoolName: school?.name || 'Your school',
      schoolContact: school?.settings?.contactInfo || null,
    });
  } catch (error) {
    console.error('Error checking teacher access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check access',
      error: error.message,
    });
  }
};

export default {
  checkTeacherAccess,
};

