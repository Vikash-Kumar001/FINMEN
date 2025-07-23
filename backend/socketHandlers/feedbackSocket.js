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

      // Notify all admins about the new feedback
      io.to('admins').emit('admin:feedback:new', {
        message: `New feedback from ${user.name}`,
        feedback: {
          _id: feedback._id,
          userId: {
            _id: user._id,
            name: user.name
          },
          message: feedback.message,
          rating: feedback.rating,
          category: feedback.category,
          status: feedback.status,
          createdAt: feedback.createdAt
        }
      });

      socket.emit('student:feedback:success', { 
        message: 'Feedback submitted successfully',
        feedback
      });

    } catch (err) {
      console.error('Error in student:feedback:submit:', err);
      socket.emit('student:feedback:error', { message: err.message });
    }
  });

  // Admin subscribe to feedback history for a specific student
  socket.on('admin:feedback:history:subscribe', async ({ adminId, studentId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:feedback:history:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`👁️ Admin ${adminId} subscribed to feedback history for student ${studentId}`);
      
      // Join room for this specific student's feedback history
      socket.join(`admin-feedback-history-${studentId}`);
      
      // Get student info
      const student = await User.findById(studentId).select('name email');
      
      if (!student) {
        socket.emit('admin:feedback:history:error', { message: 'Student not found' });
        return;
      }
      
      // Get feedback history
      const feedbackHistory = await Feedback.find({ userId: studentId })
        .sort({ createdAt: -1 });
      
      socket.emit('admin:feedback:history:data', {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email
        },
        feedback: feedbackHistory
      });
      
    } catch (err) {
      console.error('Error in admin:feedback:history:subscribe:', err);
      socket.emit('admin:feedback:history:error', { message: err.message });
    }
  });

  // Admin respond to feedback
  socket.on('admin:feedback:respond', async ({ adminId, feedbackId, response }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:feedback:error', { message: 'Unauthorized access' });
        return;
      }

      if (!response) {
        socket.emit('admin:feedback:error', { message: 'Response is required' });
        return;
      }

      // Update feedback with admin response
      const feedback = await Feedback.findById(feedbackId);
      
      if (!feedback) {
        socket.emit('admin:feedback:error', { message: 'Feedback not found' });
        return;
      }

      feedback.adminResponse = response;
      feedback.respondedBy = adminId;
      feedback.respondedAt = new Date();
      feedback.status = 'responded';
      await feedback.save();

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'respond_to_feedback',
          feedbackId: feedback._id,
          studentId: feedback.userId
        },
        timestamp: new Date()
      });

      // Notify the student about the response
      io.to(feedback.userId.toString()).emit('student:feedback:response', {
        message: 'An admin has responded to your feedback',
        feedback: {
          _id: feedback._id,
          message: feedback.message,
          rating: feedback.rating,
          category: feedback.category,
          adminResponse: feedback.adminResponse,
          status: feedback.status,
          createdAt: feedback.createdAt,
          respondedAt: feedback.respondedAt
        }
      });

      // Update feedback history for all admins viewing this student's history
      const updatedFeedbackHistory = await Feedback.find({ userId: feedback.userId })
        .sort({ createdAt: -1 });
      
      io.to(`admin-feedback-history-${feedback.userId}`).emit('admin:feedback:history:update', updatedFeedbackHistory);

      socket.emit('admin:feedback:respond:success', { 
        message: 'Response sent successfully',
        feedback
      });

    } catch (err) {
      console.error('Error in admin:feedback:respond:', err);
      socket.emit('admin:feedback:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to feedback
    if (user.role === 'admin') {
      // Find all rooms this socket is in that match the pattern
      const rooms = Object.keys(socket.rooms).filter(room => 
        room.startsWith('admin-feedback-history-')
      );
      
      // Leave each room
      rooms.forEach(room => socket.leave(room));
    }
  });
};