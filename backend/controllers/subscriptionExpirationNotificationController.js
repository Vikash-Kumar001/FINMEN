import SubscriptionExpirationNotification from '../models/SubscriptionExpirationNotification.js';
import Subscription from '../models/Subscription.js';
import { processExpirationNotifications } from '../services/subscriptionExpirationNotificationService.js';

/**
 * Get expiration notification status for a subscription
 */
export const getExpirationNotificationStatus = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const user = req.user;

    if (!user || (user.role !== 'school_admin' && user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
      });
    }

    // Get subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    // Check if user has access to this subscription
    if (user.role === 'school_admin' && subscription.orgId.toString() !== user.orgId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this subscription.',
      });
    }

    // Get all notifications for this subscription
    const notifications = await SubscriptionExpirationNotification.find({
      subscriptionId: subscription._id,
    }).sort({ createdAt: -1 }).lean();

    // Get upcoming notifications that should be sent
    const now = new Date();
    const expirationDate = subscription.endDate ? new Date(subscription.endDate) : null;
    const daysUntilExpiration = expirationDate 
      ? Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24))
      : null;

    const upcomingNotifications = [];
    if (expirationDate && daysUntilExpiration !== null) {
      const schedule = [90, 60, 30, 14, 7, 3, 1];
      for (const days of schedule) {
        if (daysUntilExpiration >= days) {
          const notificationType = `pre_expiration_${days}`;
          const sent = notifications.some(n => n.notificationType === notificationType && n.status === 'sent');
          upcomingNotifications.push({
            notificationType,
            daysUntilExpiration: days,
            scheduledDate: new Date(expirationDate.getTime() - days * 24 * 60 * 60 * 1000),
            sent,
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        subscription: {
          id: subscription._id,
          status: subscription.status,
          endDate: subscription.endDate,
          daysUntilExpiration,
        },
        notifications: notifications.map(n => ({
          id: n._id,
          notificationType: n.notificationType,
          daysUntilExpiration: n.daysUntilExpiration,
          status: n.status,
          sentAt: n.sentAt,
          createdAt: n.createdAt,
          emailsSent: n.sentToAdmins?.filter(a => a.delivered).length || 0,
          totalAdmins: n.sentToAdmins?.length || 0,
        })),
        upcomingNotifications,
      },
    });
  } catch (error) {
    console.error('Error getting expiration notification status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification status',
      error: error.message,
    });
  }
};

/**
 * Manually trigger expiration notification processing (admin only)
 */
export const triggerExpirationNotifications = async (req, res) => {
  try {
    const user = req.user;

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
      });
    }

    const io = req.app.get('io');
    const result = await processExpirationNotifications(io);

    return res.status(200).json({
      success: true,
      message: 'Expiration notifications processed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error triggering expiration notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process notifications',
      error: error.message,
    });
  }
};

export default {
  getExpirationNotificationStatus,
  triggerExpirationNotifications,
};

