import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * Socket handler for wallet and redemption real-time interactions
 * Enables students to view their wallet balance and redemption history
 * Enables admins to manage redemption requests
 */
export const setupWalletSocket = (io, socket, user) => {
  // Student wallet subscription
  socket.on('student:wallet:subscribe', async ({ studentId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId) {
        socket.emit('student:wallet:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`💰 Student ${studentId} subscribed to wallet updates`);
      
      // Join student-specific room for wallet updates
      socket.join(`student-wallet-${studentId}`);
      
      // Send initial wallet data
      const wallet = await Wallet.findOne({ userId: studentId });
      const transactions = await Transaction.find({ userId: studentId })
        .sort({ createdAt: -1 })
        .limit(10);
      
      socket.emit('student:wallet:data', { 
        wallet: wallet || { balance: 0, lastUpdated: new Date() },
        transactions
      });
      
    } catch (err) {
      console.error('Error in student:wallet:subscribe:', err);
      socket.emit('student:wallet:error', { message: err.message });
    }
  });

  // Student redemption request
  socket.on('student:wallet:redeem', async ({ studentId, amount, upiId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:wallet:error', { message: 'Unauthorized access' });
        return;
      }

      if (!amount || amount <= 0) {
        socket.emit('student:wallet:error', { message: 'Invalid amount' });
        return;
      }

      if (!upiId) {
        socket.emit('student:wallet:error', { message: 'UPI ID is required' });
        return;
      }

      // Find student wallet
      const wallet = await Wallet.findOne({ userId: studentId });

      if (!wallet || wallet.balance < amount) {
        socket.emit('student:wallet:error', { message: 'Insufficient wallet balance' });
        return;
      }

      // Deduct amount from wallet
      wallet.balance -= amount;
      wallet.lastUpdated = new Date();
      await wallet.save();

      // Create redemption transaction
      const transaction = await Transaction.create({
        userId: studentId,
        type: 'redeem',
        amount,
        description: `Redemption request for ₹${amount} to UPI: ${upiId}`,
        status: 'pending',
        metadata: { upiId }
      });

      // Log activity
      await ActivityLog.create({
        userId: studentId,
        activityType: 'redemption_request',
        details: {
          amount,
          upiId,
          transactionId: transaction._id
        },
        timestamp: new Date()
      });

      // Send updated wallet data to student
      const updatedTransactions = await Transaction.find({ userId: studentId })
        .sort({ createdAt: -1 })
        .limit(10);

      socket.emit('student:wallet:data', { 
        wallet,
        transactions: updatedTransactions
      });

      // Notify all admins about the new redemption request
      io.to('admins').emit('admin:redemptions:new', {
        message: `New redemption request from ${user.name}`,
        redemption: transaction
      });

      socket.emit('student:wallet:redeem:success', { 
        message: 'Redemption request submitted successfully',
        transaction
      });

    } catch (err) {
      console.error('Error in student:wallet:redeem:', err);
      socket.emit('student:wallet:error', { message: err.message });
    }
  });

  // Admin redemption subscription
  socket.on('admin:redemptions:subscribe', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:redemptions:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`👁️ Admin ${adminId} subscribed to redemption requests`);
      
      // Join admin-specific room for redemption updates
      socket.join(`admin-redemptions-${adminId}`);
      
      // Send initial redemption data
      const redemptions = await Transaction.find({ type: 'redeem' })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
      
      socket.emit('admin:redemptions:data', redemptions);
      
    } catch (err) {
      console.error('Error in admin:redemptions:subscribe:', err);
      socket.emit('admin:redemptions:error', { message: err.message });
    }
  });

  // Admin approve redemption
  socket.on('admin:redemptions:approve', async ({ adminId, redemptionId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:redemptions:error', { message: 'Unauthorized access' });
        return;
      }

      const transaction = await Transaction.findById(redemptionId);
      
      if (!transaction || transaction.type !== 'redeem' || transaction.status !== 'pending') {
        socket.emit('admin:redemptions:error', { message: 'Invalid redemption request' });
        return;
      }

      // Update transaction status
      transaction.status = 'approved';
      transaction.approvedBy = adminId;
      transaction.approvedAt = new Date();
      await transaction.save();

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'approve_redemption',
          redemptionId: transaction._id,
          studentId: transaction.userId,
          amount: transaction.amount
        },
        timestamp: new Date()
      });

      // Get updated redemptions list
      const updatedRedemptions = await Transaction.find({ type: 'redeem' })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

      // Notify all admins about the updated redemptions
      io.to('admins').emit('admin:redemptions:update', updatedRedemptions);

      // Notify the student about the approved redemption
      io.to(transaction.userId.toString()).emit('student:wallet:redemption:approved', {
        message: 'Your redemption request has been approved',
        transaction
      });

      socket.emit('admin:redemptions:approve:success', { 
        message: 'Redemption request approved successfully',
        transaction
      });

    } catch (err) {
      console.error('Error in admin:redemptions:approve:', err);
      socket.emit('admin:redemptions:error', { message: err.message });
    }
  });

  // Admin reject redemption
  socket.on('admin:redemptions:reject', async ({ adminId, redemptionId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:redemptions:error', { message: 'Unauthorized access' });
        return;
      }

      const transaction = await Transaction.findById(redemptionId);
      
      if (!transaction || transaction.type !== 'redeem' || transaction.status !== 'pending') {
        socket.emit('admin:redemptions:error', { message: 'Invalid redemption request' });
        return;
      }

      // Find student wallet to refund the amount
      const wallet = await Wallet.findOne({ userId: transaction.userId });
      
      if (!wallet) {
        socket.emit('admin:redemptions:error', { message: 'Student wallet not found' });
        return;
      }

      // Refund the amount to student wallet
      wallet.balance += transaction.amount;
      wallet.lastUpdated = new Date();
      await wallet.save();

      // Update transaction status
      transaction.status = 'rejected';
      transaction.description += ' (Rejected & refunded)';
      transaction.rejectedBy = adminId;
      transaction.rejectedAt = new Date();
      await transaction.save();

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'reject_redemption',
          redemptionId: transaction._id,
          studentId: transaction.userId,
          amount: transaction.amount
        },
        timestamp: new Date()
      });

      // Get updated redemptions list
      const updatedRedemptions = await Transaction.find({ type: 'redeem' })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

      // Notify all admins about the updated redemptions
      io.to('admins').emit('admin:redemptions:update', updatedRedemptions);

      // Get updated wallet data for the student
      const updatedTransactions = await Transaction.find({ userId: transaction.userId })
        .sort({ createdAt: -1 })
        .limit(10);

      // Notify the student about the rejected redemption and updated wallet
      io.to(transaction.userId.toString()).emit('student:wallet:data', { 
        wallet,
        transactions: updatedTransactions
      });

      io.to(transaction.userId.toString()).emit('student:wallet:redemption:rejected', {
        message: 'Your redemption request has been rejected and the amount has been refunded to your wallet',
        transaction
      });

      socket.emit('admin:redemptions:reject:success', { 
        message: 'Redemption request rejected and refunded successfully',
        transaction
      });

    } catch (err) {
      console.error('Error in admin:redemptions:reject:', err);
      socket.emit('admin:redemptions:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to wallet and redemptions
    if (user.role === 'student') {
      socket.leave(`student-wallet-${user._id}`);
    }
    if (user.role === 'admin') {
      socket.leave(`admin-redemptions-${user._id}`);
    }
  });
};