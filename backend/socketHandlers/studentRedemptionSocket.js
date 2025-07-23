import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import ActivityLog from '../models/ActivityLog.js';
import Wallet from '../models/Wallet.js';

/**
 * Socket handler for student redemption real-time interactions
 * Enables educators to view and manage student redemption requests
 */
export const setupStudentRedemptionSocket = (io, socket, user) => {
  // Student/Educator subscribe to redemption requests
  socket.on('student:redemption:subscribe', async ({ studentId }) => {
    try {
      // Verify permissions (only the student or an educator can access)
      if (user._id.toString() !== studentId && user.role !== 'educator') {
        socket.emit('student:redemption:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`💰 ${user.role === 'educator' ? 'Educator' : 'Student'} ${user._id} subscribed to redemption requests`);
      
      // Join room for redemption updates
      socket.join(`student-redemption-${studentId}`);
      
      // Get redemption requests
      const redemptions = await Transaction.find({ 
        userId: studentId,
        type: 'redemption'
      })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .lean();
      
      socket.emit('student:redemption:data', redemptions);
      
    } catch (err) {
      console.error('Error in student:redemption:subscribe:', err);
      socket.emit('student:redemption:error', { message: err.message });
    }
  });

  // Educator approve redemption request
  socket.on('student:redemption:approve', async ({ educatorId, redemptionId }) => {
    try {
      // Verify educator permissions
      if (user._id.toString() !== educatorId || user.role !== 'educator') {
        socket.emit('student:redemption:error', { message: 'Unauthorized access' });
        return;
      }

      // Find redemption request
      const redemption = await Transaction.findOne({ 
        _id: redemptionId,
        type: 'redemption',
        status: 'pending'
      });
      
      if (!redemption) {
        socket.emit('student:redemption:error', { message: 'Redemption request not found or already processed' });
        return;
      }

      // Update redemption status
      redemption.status = 'completed';
      redemption.processedBy = educatorId;
      redemption.processedAt = new Date();
      await redemption.save();

      // Log activity
      await ActivityLog.create({
        userId: educatorId,
        activityType: 'redemption_approved',
        details: {
          redemptionId: redemption._id,
          studentId: redemption.userId,
          amount: redemption.amount
        },
        timestamp: new Date()
      });

      // Get updated redemption with user info
      const updatedRedemption = await Transaction.findById(redemptionId)
        .populate('userId', 'name email')
        .lean();

      // Notify student
      io.to(`student-redemption-${redemption.userId}`).emit('student:redemption:approved', {
        redemption: updatedRedemption,
        message: 'Your redemption request has been approved'
      });

      // Notify all educators subscribed to this student's redemptions
      io.to(`student-redemption-${redemption.userId}`).emit('student:redemption:update', updatedRedemption);

      socket.emit('student:redemption:approve:success', { 
        message: 'Redemption request approved successfully',
        redemptionId
      });

    } catch (err) {
      console.error('Error in student:redemption:approve:', err);
      socket.emit('student:redemption:error', { message: err.message });
    }
  });

  // Educator reject redemption request
  socket.on('student:redemption:reject', async ({ educatorId, redemptionId, reason }) => {
    try {
      // Verify educator permissions
      if (user._id.toString() !== educatorId || user.role !== 'educator') {
        socket.emit('student:redemption:error', { message: 'Unauthorized access' });
        return;
      }

      // Find redemption request
      const redemption = await Transaction.findOne({ 
        _id: redemptionId,
        type: 'redemption',
        status: 'pending'
      });
      
      if (!redemption) {
        socket.emit('student:redemption:error', { message: 'Redemption request not found or already processed' });
        return;
      }

      // Get student wallet
      const wallet = await Wallet.findOne({ userId: redemption.userId });
      if (!wallet) {
        socket.emit('student:redemption:error', { message: 'Student wallet not found' });
        return;
      }

      // Refund amount to student wallet
      wallet.balance += redemption.amount;
      await wallet.save();

      // Update redemption status
      redemption.status = 'rejected';
      redemption.processedBy = educatorId;
      redemption.processedAt = new Date();
      redemption.rejectionReason = reason || 'No reason provided';
      await redemption.save();

      // Create refund transaction
      await Transaction.create({
        userId: redemption.userId,
        type: 'refund',
        amount: redemption.amount,
        status: 'completed',
        details: {
          reason: 'Redemption request rejected',
          originalTransactionId: redemption._id
        },
        createdAt: new Date()
      });

      // Log activity
      await ActivityLog.create({
        userId: educatorId,
        activityType: 'redemption_rejected',
        details: {
          redemptionId: redemption._id,
          studentId: redemption.userId,
          amount: redemption.amount,
          reason: redemption.rejectionReason
        },
        timestamp: new Date()
      });

      // Get updated redemption with user info
      const updatedRedemption = await Transaction.findById(redemptionId)
        .populate('userId', 'name email')
        .lean();

      // Notify student
      io.to(`student-redemption-${redemption.userId}`).emit('student:redemption:rejected', {
        redemption: updatedRedemption,
        message: 'Your redemption request has been rejected',
        reason: redemption.rejectionReason
      });

      // Notify all educators subscribed to this student's redemptions
      io.to(`student-redemption-${redemption.userId}`).emit('student:redemption:update', updatedRedemption);

      socket.emit('student:redemption:reject:success', { 
        message: 'Redemption request rejected successfully',
        redemptionId
      });

    } catch (err) {
      console.error('Error in student:redemption:reject:', err);
      socket.emit('student:redemption:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to student redemptions
    if (user.role === 'student') {
      socket.leave(`student-redemption-${user._id}`);
    } else if (user.role === 'educator') {
      // Find and leave all student redemption rooms
      const rooms = Object.keys(socket.rooms);
      rooms.forEach(room => {
        if (room.startsWith('student-redemption-')) {
          socket.leave(room);
        }
      });
    }
  });
};