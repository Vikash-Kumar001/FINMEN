import cron from 'node-cron';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const REMINDER_WINDOW_DAYS = 7;
const REMINDER_INTERVAL_HOURS = 12;

export const sendSubscriptionExpiryReminders = async () => {
  const now = new Date();
  const windowStart = new Date(now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const windowEnd = new Date(windowStart.getTime() + 24 * 60 * 60 * 1000);

  const subscriptions = await Subscription.find({
    status: 'active',
    endDate: {
      $gte: windowStart,
      $lt: windowEnd,
    },
  }).lean();

  if (!subscriptions.length) return;

  for (const subscription of subscriptions) {
    try {
      const lastReminder = subscription.metadata?.lastExpiryReminderAt
        ? new Date(subscription.metadata.lastExpiryReminderAt)
        : null;

      if (lastReminder) {
        const diffHours = (now.getTime() - lastReminder.getTime()) / (60 * 60 * 1000);
        if (diffHours < REMINDER_INTERVAL_HOURS) {
          continue;
        }
      }

      const admins = await User.find({
        orgId: subscription.orgId,
        role: 'school_admin',
      }).select('_id name email').lean();

      if (!admins.length) continue;

      const reminderDate = new Date(subscription.endDate);

      const notifications = admins.map((admin) => ({
        userId: admin._id,
        type: 'subscription_expiry_reminder',
        title: 'School subscription expiring soon',
        message: `Your premium plan expires on ${reminderDate.toLocaleDateString()}. Please renew to maintain uninterrupted access.`,
        priority: 'high',
        metadata: {
          subscriptionId: subscription._id,
          expiryDate: reminderDate,
        },
      }));

      await Notification.insertMany(notifications);

      await Subscription.updateOne(
        { _id: subscription._id },
        {
          $set: {
            metadata: {
              ...(subscription.metadata || {}),
              lastExpiryReminderAt: now,
            },
          },
        },
      );
    } catch (error) {
      console.error('Failed to send subscription reminder', error);
    }
  }
};

export const scheduleSubscriptionReminders = () => {
  cron.schedule('0 9,21 * * *', async () => {
    try {
      await sendSubscriptionExpiryReminders();
    } catch (error) {
      console.error('Subscription reminder scheduler failed', error);
    }
  });
};

