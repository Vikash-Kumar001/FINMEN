import Notification from '../models/Notification.js';

/**
 * Create a notification
 */
export const createNotification = async (notificationData) => {
  try {
    // Check if Notification model exists, otherwise return mock
    if (typeof Notification !== 'undefined' && Notification) {
      return await Notification.create(notificationData);
    } else {
      // Mock notification for development
      console.log('📧 Notification created:', notificationData);
      return { success: true, data: notificationData };
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email notification
 */
export const sendEmailNotification = async (to, subject, body) => {
  try {
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log('📧 Email sent to:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send SMS notification
 */
export const sendSMSNotification = async (phoneNumber, message) => {
  try {
    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log('📱 SMS sent to:', phoneNumber);
    console.log('Message:', message);
    return { success: true };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Slack/PagerDuty alert
 */
export const sendAlert = async (alertData) => {
  try {
    // In production, integrate with alerting service (PagerDuty, Slack, etc.)
    console.log('🚨 Alert sent:', alertData);
    return { success: true };
  } catch (error) {
    console.error('Error sending alert:', error);
    return { success: false, error: error.message };
  }
};

