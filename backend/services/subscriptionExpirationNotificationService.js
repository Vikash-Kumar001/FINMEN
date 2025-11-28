import Subscription from '../models/Subscription.js';
import SubscriptionExpirationNotification from '../models/SubscriptionExpirationNotification.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Organization from '../models/Organization.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/sendMail.js';
import mongoose from 'mongoose';

// Notification schedule (days before/after expiration)
const NOTIFICATION_SCHEDULE = {
  preExpiration: [90, 60, 30, 14, 7, 3, 1],
  postExpiration: [1, 3, 7, 14, 30],
};

// Plan details for notifications
const PLAN_DISPLAY_NAMES = {
  educational_institutions_premium: 'Educational Institutions Premium Plan',
  free: 'Free Plan',
};

/**
 * Get all active subscriptions that need expiration notifications
 */
export const getSubscriptionsNeedingNotifications = async () => {
  try {
    const now = new Date();
    const subscriptions = await Subscription.find({
      status: { $in: ['active', 'pending'] },
      endDate: { $exists: true, $ne: null },
    }).populate('orgId', 'name tenantId').lean();

    const subscriptionsNeedingNotifications = [];

    for (const subscription of subscriptions) {
      if (!subscription.endDate) continue;

      const expirationDate = new Date(subscription.endDate);
      const daysUntilExpiration = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));

      // Check pre-expiration notifications
      for (const days of NOTIFICATION_SCHEDULE.preExpiration) {
        if (daysUntilExpiration === days) {
          const notificationType = `pre_expiration_${days}`;
          const alreadySent = await SubscriptionExpirationNotification.findOne({
            subscriptionId: subscription._id,
            notificationType,
            status: 'sent',
          });

          if (!alreadySent) {
            subscriptionsNeedingNotifications.push({
              subscription,
              notificationType,
              daysUntilExpiration: days,
              expirationDate,
            });
          }
        }
      }

      // Check expiration day notification
      if (daysUntilExpiration === 0) {
        const alreadySent = await SubscriptionExpirationNotification.findOne({
          subscriptionId: subscription._id,
          notificationType: 'expiration_day',
          status: 'sent',
        });

        if (!alreadySent) {
          subscriptionsNeedingNotifications.push({
            subscription,
            notificationType: 'expiration_day',
            daysUntilExpiration: 0,
            expirationDate,
          });
        }
      }

      // Check post-expiration notifications
      if (daysUntilExpiration < 0) {
        const daysSinceExpiration = Math.abs(daysUntilExpiration);
        for (const days of NOTIFICATION_SCHEDULE.postExpiration) {
          if (daysSinceExpiration === days) {
            const notificationType = `post_expiration_${days}`;
            const alreadySent = await SubscriptionExpirationNotification.findOne({
              subscriptionId: subscription._id,
              notificationType,
              status: 'sent',
            });

            if (!alreadySent) {
              subscriptionsNeedingNotifications.push({
                subscription,
                notificationType,
                daysUntilExpiration: -daysSinceExpiration,
                expirationDate,
              });
            }
          }
        }
      }
    }

    return subscriptionsNeedingNotifications;
  } catch (error) {
    console.error('Error getting subscriptions needing notifications:', error);
    throw error;
  }
};

/**
 * Send expiration notification to school admins
 */
export const sendAdminExpirationNotification = async (
  subscription,
  notificationType,
  daysUntilExpiration,
  expirationDate
) => {
  try {
    // Get company and organization details
    const company = await Company.findOne({
      organizations: subscription.orgId,
    }).lean();

    if (!company) {
      throw new Error('Company not found for subscription');
    }

    const organization = await Organization.findById(subscription.orgId).lean();
    const schoolName = organization?.name || company?.name || 'Your School';

    // Get all school admins
    const admins = await User.find({
      orgId: subscription.orgId,
      tenantId: subscription.tenantId,
      role: 'school_admin',
      isVerified: true,
    }).select('_id email name').lean();

    if (!admins || admins.length === 0) {
      console.log(`No admins found for subscription ${subscription._id}`);
      return { success: false, reason: 'no_admins' };
    }

    // Determine notification content based on type
    const notificationContent = getNotificationContent(
      notificationType,
      daysUntilExpiration,
      expirationDate,
      schoolName,
      subscription
    );

    // Create notification record
    const notificationRecord = await SubscriptionExpirationNotification.create({
      subscriptionId: subscription._id,
      orgId: subscription.orgId,
      tenantId: subscription.tenantId,
      companyId: company._id,
      notificationType,
      daysUntilExpiration,
      expirationDate,
      channels: ['email', 'in_app'],
      status: 'sending',
      sentToAdmins: admins.map(admin => ({
        userId: admin._id,
        email: admin.email,
        name: admin.name,
      })),
    });

    const emailResults = [];
    const inAppResults = [];

    // Send emails to all admins
    for (const admin of admins) {
      try {
        // Send email
        await sendEmail({
          to: admin.email,
          subject: notificationContent.emailSubject,
          html: notificationContent.emailHtml,
        });

        emailResults.push({
          userId: admin._id,
          email: admin.email,
          name: admin.name,
          sentAt: new Date(),
          delivered: true,
        });

        // Create in-app notification
        await Notification.create({
          userId: admin._id,
          type: daysUntilExpiration < 0 ? 'alert' : 'warning',
          title: notificationContent.inAppTitle,
          message: notificationContent.inAppMessage,
          metadata: {
            subscriptionId: subscription._id.toString(),
            notificationType,
            daysUntilExpiration,
            expirationDate,
            actionUrl: '/school/admin/payment-tracker',
          },
        });

        inAppResults.push({
          userId: admin._id,
          success: true,
        });
      } catch (error) {
        console.error(`Error sending notification to admin ${admin._id}:`, error);
        emailResults.push({
          userId: admin._id,
          email: admin.email,
          name: admin.name,
          sentAt: new Date(),
          delivered: false,
        });
      }
    }

    // Update notification record
    notificationRecord.sentToAdmins = emailResults;
    notificationRecord.status = 'sent';
    notificationRecord.sentAt = new Date();
    notificationRecord.completedAt = new Date();
    await notificationRecord.save();

    // Emit socket event for real-time updates
    // This will be handled by the calling function with io instance

    return {
      success: true,
      notificationId: notificationRecord._id,
      emailsSent: emailResults.filter(r => r.delivered).length,
      inAppNotifications: inAppResults.length,
      totalAdmins: admins.length,
    };
  } catch (error) {
    console.error('Error sending admin expiration notification:', error);
    throw error;
  }
};

/**
 * Send expiration notification to teachers
 */
export const sendTeacherExpirationNotification = async (
  subscription,
  notificationType,
  daysUntilExpiration
) => {
  try {
    // Only send to teachers on expiration day and post-expiration
    if (daysUntilExpiration > 0) {
      return { success: true, skipped: true, reason: 'pre_expiration_skip' };
    }

    // Get all teachers
    const teachers = await User.find({
      orgId: subscription.orgId,
      tenantId: subscription.tenantId,
      role: 'school_teacher',
      isVerified: true,
    }).select('_id email name').lean();

    if (!teachers || teachers.length === 0) {
      return { success: true, skipped: true, reason: 'no_teachers' };
    }

    const organization = await Organization.findById(subscription.orgId).lean();
    const schoolName = organization?.name || 'Your School';

    const notificationContent = getTeacherNotificationContent(
      notificationType,
      daysUntilExpiration,
      schoolName
    );

    const emailResults = [];
    const inAppResults = [];

    // Send notifications to teachers
    for (const teacher of teachers) {
      try {
        // Send email (only on expiration day and first post-expiration)
        if (daysUntilExpiration === 0 || daysUntilExpiration === -1) {
          await sendEmail({
            to: teacher.email,
            subject: notificationContent.emailSubject,
            html: notificationContent.emailHtml,
          });

          emailResults.push({
            userId: teacher._id,
            email: teacher.email,
            name: teacher.name,
            sentAt: new Date(),
            delivered: true,
          });
        }

        // Create in-app notification
        await Notification.create({
          userId: teacher._id,
          type: 'alert',
          title: notificationContent.inAppTitle,
          message: notificationContent.inAppMessage,
          metadata: {
            subscriptionId: subscription._id.toString(),
            notificationType,
            daysUntilExpiration,
          },
        });

        inAppResults.push({
          userId: teacher._id,
          success: true,
        });
      } catch (error) {
        console.error(`Error sending notification to teacher ${teacher._id}:`, error);
      }
    }

    return {
      success: true,
      emailsSent: emailResults.length,
      inAppNotifications: inAppResults.length,
      totalTeachers: teachers.length,
    };
  } catch (error) {
    console.error('Error sending teacher expiration notification:', error);
    throw error;
  }
};

/**
 * Get notification content based on type
 */
const getNotificationContent = (notificationType, daysUntilExpiration, expirationDate, schoolName, subscription) => {
  const planName = PLAN_DISPLAY_NAMES[subscription.plan?.name] || 'Educational Institutions Premium Plan';
  const formattedExpirationDate = new Date(expirationDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const renewalUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/school/admin/payment-tracker`;
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@wisestudent.org';

  let emailSubject, emailHtml, inAppTitle, inAppMessage;

  if (daysUntilExpiration > 0) {
    // Pre-expiration notifications
    emailSubject = `⚠️ Your ${schoolName} subscription expires in ${daysUntilExpiration} day${daysUntilExpiration > 1 ? 's' : ''}`;
    inAppTitle = `Subscription Expiring Soon`;
    inAppMessage = `Your school's subscription expires in ${daysUntilExpiration} day${daysUntilExpiration > 1 ? 's' : ''}. Renew now to avoid service interruption.`;

    emailHtml = generatePreExpirationEmailHtml(
      schoolName,
      planName,
      daysUntilExpiration,
      formattedExpirationDate,
      renewalUrl,
      supportEmail
    );
  } else if (daysUntilExpiration === 0) {
    // Expiration day
    emailSubject = `🚨 URGENT: Your ${schoolName} subscription has expired today`;
    inAppTitle = `Subscription Expired`;
    inAppMessage = `Your school's subscription has expired. Renew immediately to restore access.`;

    emailHtml = generateExpirationDayEmailHtml(
      schoolName,
      planName,
      formattedExpirationDate,
      renewalUrl,
      supportEmail
    );
  } else {
    // Post-expiration
    const daysSinceExpiration = Math.abs(daysUntilExpiration);
    emailSubject = `⚠️ Action Required: ${schoolName} subscription expired ${daysSinceExpiration} day${daysSinceExpiration > 1 ? 's' : ''} ago`;
    inAppTitle = `Subscription Expired`;
    inAppMessage = `Your school's subscription expired ${daysSinceExpiration} day${daysSinceExpiration > 1 ? 's' : ''} ago. Renew now to restore access.`;

    emailHtml = generatePostExpirationEmailHtml(
      schoolName,
      planName,
      daysSinceExpiration,
      formattedExpirationDate,
      renewalUrl,
      supportEmail
    );
  }

  return {
    emailSubject,
    emailHtml,
    inAppTitle,
    inAppMessage,
  };
};

/**
 * Get teacher notification content
 */
const getTeacherNotificationContent = (notificationType, daysUntilExpiration, schoolName) => {
  let emailSubject, emailHtml, inAppTitle, inAppMessage;

  if (daysUntilExpiration === 0) {
    emailSubject = `⚠️ ${schoolName}'s subscription has expired`;
    inAppTitle = `School Subscription Expired`;
    inAppMessage = `Your school's subscription has expired. Please contact your school administrator. Access is currently restricted.`;

    emailHtml = generateTeacherExpirationEmailHtml(schoolName);
  } else {
    emailSubject = `⚠️ ${schoolName}'s subscription expired`;
    inAppTitle = `School Subscription Expired`;
    inAppMessage = `Your school's subscription has expired. Please contact your school administrator.`;

    emailHtml = generateTeacherExpirationEmailHtml(schoolName);
  }

  return {
    emailSubject,
    emailHtml,
    inAppTitle,
    inAppMessage,
  };
};

/**
 * Generate pre-expiration email HTML
 */
const generatePreExpirationEmailHtml = (schoolName, planName, daysRemaining, expirationDate, renewalUrl, supportEmail) => {
  const urgencyColor = daysRemaining <= 7 ? '#dc2626' : daysRemaining <= 30 ? '#f59e0b' : '#3b82f6';
  const urgencyText = daysRemaining <= 7 ? 'URGENT' : daysRemaining <= 30 ? 'IMPORTANT' : 'REMINDER';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, ${urgencyColor} 0%, ${urgencyColor}dd 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Wise Student</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Subscription Expiration ${urgencyText}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Subscription Expiring Soon</h2>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Dear ${schoolName} Administrator,
              </p>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                This is a reminder that your <strong>${planName}</strong> subscription will expire in <strong style="color: ${urgencyColor};">${daysRemaining} day${daysRemaining > 1 ? 's' : ''}</strong>.
              </p>
              
              <!-- Expiration Details Box -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600;">📅 Expiration Date</p>
                <p style="margin: 0; color: #92400e; font-size: 18px; font-weight: 700;">${expirationDate}</p>
                <p style="margin: 10px 0 0; color: #92400e; font-size: 13px;">Days Remaining: <strong>${daysRemaining}</strong></p>
              </div>

              <!-- Impact Section -->
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <p style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600;">What happens if you don't renew?</p>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                  <li>All teachers will lose access to the platform</li>
                  <li>All students will be downgraded to freemium plan</li>
                  <li>Advanced features will be disabled</li>
                  <li>Analytics and reporting will be unavailable</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${renewalUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Renew Subscription Now
                </a>
              </div>

              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you have any questions or need assistance with renewal, please contact our support team at 
                <a href="mailto:${supportEmail}" style="color: #667eea; text-decoration: none;">${supportEmail}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                This is an automated notification. Please do not reply to this email.
              </p>
              <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                © ${new Date().getFullYear()} Wise Student. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Generate expiration day email HTML
 */
const generateExpirationDayEmailHtml = (schoolName, planName, expirationDate, renewalUrl, supportEmail) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">🚨 URGENT ACTION REQUIRED</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Subscription Expired Today</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Your Subscription Has Expired</h2>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Dear ${schoolName} Administrator,
              </p>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Your <strong>${planName}</strong> subscription expired on <strong>${expirationDate}</strong>. Immediate action is required to restore access.
              </p>
              
              <!-- Critical Alert Box -->
              <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <p style="margin: 0 0 10px; color: #991b1b; font-size: 14px; font-weight: 600;">⚠️ Current Status</p>
                <ul style="margin: 10px 0 0; padding-left: 20px; color: #991b1b; font-size: 14px; line-height: 1.8;">
                  <li>Teachers cannot access the platform</li>
                  <li>Students have been downgraded to freemium</li>
                  <li>Advanced features are disabled</li>
                  <li>Service interruption is active</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${renewalUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Renew Subscription Immediately
                </a>
              </div>

              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Need help? Contact our support team immediately at 
                <a href="mailto:${supportEmail}" style="color: #667eea; text-decoration: none;">${supportEmail}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                This is an automated urgent notification. Please renew your subscription to restore full access.
              </p>
              <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                © ${new Date().getFullYear()} Wise Student. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Generate post-expiration email HTML
 */
const generatePostExpirationEmailHtml = (schoolName, planName, daysSinceExpiration, expirationDate, renewalUrl, supportEmail) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Action Required</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Subscription Expired ${daysSinceExpiration} Day${daysSinceExpiration > 1 ? 's' : ''} Ago</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Renew Your Subscription</h2>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Dear ${schoolName} Administrator,
              </p>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Your <strong>${planName}</strong> subscription expired on <strong>${expirationDate}</strong> (${daysSinceExpiration} day${daysSinceExpiration > 1 ? 's' : ''} ago). Service remains interrupted until renewal.
              </p>
              
              <!-- Status Box -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600;">Current Service Status</p>
                <ul style="margin: 10px 0 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.8;">
                  <li>Platform access remains restricted</li>
                  <li>Teachers cannot access their dashboards</li>
                  <li>Students are on freemium plan</li>
                  <li>All premium features are disabled</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${renewalUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Renew Subscription Now
                </a>
              </div>

              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Questions? Contact support at <a href="mailto:${supportEmail}" style="color: #667eea; text-decoration: none;">${supportEmail}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                This is an automated reminder. Renew your subscription to restore full access.
              </p>
              <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                © ${new Date().getFullYear()} Wise Student. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Generate teacher expiration email HTML
 */
const generateTeacherExpirationEmailHtml = (schoolName) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">⚠️ Access Restricted</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">School Subscription Expired</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Subscription Expired</h2>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Dear Teacher,
              </p>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${schoolName}'s subscription has expired. As a result, your access to the platform is currently restricted.
              </p>
              
              <!-- Info Box -->
              <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <p style="margin: 0 0 10px; color: #1e40af; font-size: 14px; font-weight: 600;">What You Need to Do</p>
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  Please contact your school administrator to renew the subscription. Once renewed, your access will be automatically restored.
                </p>
              </div>

              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Access will be restored automatically once your school administrator renews the subscription.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                This is an automated notification from Wise Student.
              </p>
              <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                © ${new Date().getFullYear()} Wise Student. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Process all pending expiration notifications
 */
export const processExpirationNotifications = async (io = null) => {
  try {
    console.log('🔔 Starting expiration notification processing...');
    
    const subscriptionsNeedingNotifications = await getSubscriptionsNeedingNotifications();
    console.log(`📋 Found ${subscriptionsNeedingNotifications.length} subscriptions needing notifications`);

    const results = {
      processed: 0,
      adminNotifications: 0,
      teacherNotifications: 0,
      errors: 0,
    };

    for (const { subscription, notificationType, daysUntilExpiration, expirationDate } of subscriptionsNeedingNotifications) {
      try {
        // Send admin notifications
        const adminResult = await sendAdminExpirationNotification(
          subscription,
          notificationType,
          daysUntilExpiration,
          expirationDate
        );

        if (adminResult.success) {
          results.adminNotifications += adminResult.emailsSent || 0;
          
          // Emit socket event for real-time updates
          if (io && subscription.orgId) {
            const admins = await User.find({
              orgId: subscription.orgId,
              tenantId: subscription.tenantId,
              role: 'school_admin',
            }).select('_id').lean();

            admins.forEach(admin => {
              io.to(admin._id.toString()).emit('subscription:expiration:notification', {
                notificationType,
                daysUntilExpiration,
                expirationDate,
                timestamp: new Date(),
              });
            });
          }
        }

        // Send teacher notifications (only on expiration and post-expiration)
        if (daysUntilExpiration <= 0) {
          const teacherResult = await sendTeacherExpirationNotification(
            subscription,
            notificationType,
            daysUntilExpiration
          );

          if (teacherResult.success && !teacherResult.skipped) {
            results.teacherNotifications += teacherResult.emailsSent || 0;
          }
        }

        results.processed++;
      } catch (error) {
        console.error(`Error processing notification for subscription ${subscription._id}:`, error);
        results.errors++;
      }
    }

    console.log(`✅ Notification processing complete:`, results);
    return results;
  } catch (error) {
    console.error('Error processing expiration notifications:', error);
    throw error;
  }
};

export default {
  getSubscriptionsNeedingNotifications,
  sendAdminExpirationNotification,
  sendTeacherExpirationNotification,
  processExpirationNotifications,
};

