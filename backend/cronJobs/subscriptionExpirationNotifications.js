import cron from 'node-cron';
import { processExpirationNotifications } from '../services/subscriptionExpirationNotificationService.js';

/**
 * Schedule subscription expiration notifications
 * Runs daily at 9:00 AM and 6:00 PM to check for subscriptions needing notifications
 */
export const scheduleSubscriptionExpirationNotifications = (io = null) => {
  // Run twice daily: 9:00 AM and 6:00 PM
  cron.schedule('0 9,18 * * *', async () => {
    try {
      console.log('🔔 Running scheduled subscription expiration notification check...');
      await processExpirationNotifications(io);
    } catch (error) {
      console.error('❌ Subscription expiration notification scheduler failed:', error);
    }
  });

  console.log('✅ Subscription expiration notification scheduler started (runs at 9:00 AM and 6:00 PM daily)');
};

export default scheduleSubscriptionExpirationNotifications;

