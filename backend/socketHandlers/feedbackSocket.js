import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import ActivityLog from '../models/ActivityLog.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';

/**
 * Socket handler for feedback real-time interactions
 * Enables students to submit feedback and admins to view feedback history
 */
export const setupFeedbackSocket = (io, socket, user) => {
  // Student submit feedback
  socket.on('student:feedback:submit', async (data) => {
    try {
      const { studentId, message, rating, category } = data;
      
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:feedback:error', { message: 'Unauthorized access' });
        return;
      }

      if (!message || !rating || !category) {
        socket.emit('student:feedback:error', { message: 'Missing required fields' });
        return;
      }

      // Create new feedback
      const feedback = await Feedback.create({
        userId: studentId,
        message,
        rating,
        category,
        status: 'pending'
      });

      // Log activity
      await ActivityLog.create({
        userId: studentId,
        activityType: 'feedback_submitted',
        details: {
          feedbackId: feedback._id,
          category,
          rating
        },
        timestamp: new Date()
      });

      // Reward student for providing feedback
      const wallet = await Wallet.findOne({ userId: studentId });
      
      if (wallet) {
        const rewardAmount = 5; // 5 coins for feedback
        wallet.balance += rewardAmount;
        wallet.lastUpdated = new Date();
        await wallet.save();

        // Create transaction record
        await Transaction.create({
          userId: studentId,
          type: 'reward',
          amount: rewardAmount,
          description: 'Reward for providing feedback',
          status: 'completed'
        });

        // Notify student about the reward
        socket.emit('student:wallet:update', { 
          balance: wallet.balance,
          message: `You received ${rewardAmount} coins for your feedback!`
        });
      }



      socket.emit('student:feedback:success', { 
        message: 'Feedback submitted successfully',
        feedback
      });

    } catch (err) {
      console.error('Error in student:feedback:submit:', err);
      socket.emit('student:feedback:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // No admin rooms to leave
  });
};