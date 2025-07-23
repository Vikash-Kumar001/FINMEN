import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * Socket handler for admin panel real-time interactions
 * Enables admins to manage users, approve educators, and update roles
 */
export const setupAdminPanelSocket = (io, socket, user) => {
  // Admin subscribe to panel data
  socket.on('admin:panel:subscribe', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:panel:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`👁️ Admin ${adminId} subscribed to admin panel data`);
      
      // Join admin-specific room for panel updates
      socket.join(`admin-panel-${adminId}`);
      
      // Get pending educators
      const pendingEducators = await User.find({ 
        role: 'educator', 
        approvalStatus: 'pending' 
      }).select('_id name email position subjects createdAt');
      
      // Get all users
      const allUsers = await User.find()
        .select('_id name email role status approvalStatus lastActive')
        .sort({ createdAt: -1 });
      
      socket.emit('admin:panel:data', {
        pendingEducators,
        allUsers
      });
      
    } catch (err) {
      console.error('Error in admin:panel:subscribe:', err);
      socket.emit('admin:panel:error', { message: err.message });
    }
  });

  // Admin approve educator
  socket.on('admin:panel:approveEducator', async ({ adminId, educatorId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:panel:error', { message: 'Unauthorized access' });
        return;
      }

      // Find educator
      const educator = await User.findOne({ 
        _id: educatorId, 
        role: 'educator', 
        approvalStatus: 'pending' 
      });
      
      if (!educator) {
        socket.emit('admin:panel:error', { message: 'Educator not found or already approved' });
        return;
      }

      // Update educator status
      educator.approvalStatus = 'approved';
      educator.approvedBy = adminId;
      educator.approvedAt = new Date();
      await educator.save();

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'approve_educator',
          educatorId,
          educatorName: educator.name,
          educatorEmail: educator.email
        },
        timestamp: new Date()
      });

      // Get updated pending educators
      const pendingEducators = await User.find({ 
        role: 'educator', 
        approvalStatus: 'pending' 
      }).select('_id name email position subjects createdAt');
      
      // Get all users
      const allUsers = await User.find()
        .select('_id name email role status approvalStatus lastActive')
        .sort({ createdAt: -1 });
      
      // Notify all admins about the updated data
      io.to('admins').emit('admin:panel:data', {
        pendingEducators,
        allUsers
      });

      // Notify the educator about approval
      io.to(educatorId).emit('educator:approved', {
        message: 'Your educator account has been approved'
      });

      socket.emit('admin:panel:approveEducator:success', { 
        message: 'Educator approved successfully',
        educatorId
      });

    } catch (err) {
      console.error('Error in admin:panel:approveEducator:', err);
      socket.emit('admin:panel:error', { message: err.message });
    }
  });

  // Admin update user role
  socket.on('admin:panel:updateRole', async ({ adminId, userId, newRole }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:panel:error', { message: 'Unauthorized access' });
        return;
      }

      // Validate role
      if (!['student', 'educator', 'admin'].includes(newRole)) {
        socket.emit('admin:panel:error', { message: 'Invalid role' });
        return;
      }

      // Find user
      const targetUser = await User.findById(userId);
      
      if (!targetUser) {
        socket.emit('admin:panel:error', { message: 'User not found' });
        return;
      }

      // Store old role for logging
      const oldRole = targetUser.role;

      // Update user role
      targetUser.role = newRole;
      
      // If changing to educator, set approval status
      if (newRole === 'educator' && oldRole !== 'educator') {
        targetUser.approvalStatus = 'approved'; // Auto-approve when admin changes role
        targetUser.approvedBy = adminId;
        targetUser.approvedAt = new Date();
      }
      
      await targetUser.save();

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'update_user_role',
          targetUserId: userId,
          targetUserName: targetUser.name,
          oldRole,
          newRole
        },
        timestamp: new Date()
      });

      // Get all users
      const allUsers = await User.find()
        .select('_id name email role status approvalStatus lastActive')
        .sort({ createdAt: -1 });
      
      // Notify all admins about the updated data
      io.to('admins').emit('admin:panel:users:update', allUsers);

      // Notify the user about role change
      io.to(userId).emit('user:role:updated', {
        message: `Your account role has been updated to ${newRole}`,
        newRole
      });

      socket.emit('admin:panel:updateRole:success', { 
        message: `User role updated to ${newRole} successfully`,
        userId,
        newRole
      });

    } catch (err) {
      console.error('Error in admin:panel:updateRole:', err);
      socket.emit('admin:panel:error', { message: err.message });
    }
  });

  // Admin delete user
  socket.on('admin:panel:deleteUser', async ({ adminId, userId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:panel:error', { message: 'Unauthorized access' });
        return;
      }

      // Prevent admin from deleting themselves
      if (userId === adminId) {
        socket.emit('admin:panel:error', { message: 'Cannot delete your own account' });
        return;
      }

      // Find user
      const targetUser = await User.findById(userId);
      
      if (!targetUser) {
        socket.emit('admin:panel:error', { message: 'User not found' });
        return;
      }

      // Store user info for logging
      const userInfo = {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role
      };

      // Delete user
      await User.findByIdAndDelete(userId);

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'delete_user',
          targetUserId: userInfo.id,
          targetUserName: userInfo.name,
          targetUserEmail: userInfo.email,
          targetUserRole: userInfo.role
        },
        timestamp: new Date()
      });

      // Get all users
      const allUsers = await User.find()
        .select('_id name email role status approvalStatus lastActive')
        .sort({ createdAt: -1 });
      
      // Notify all admins about the updated data
      io.to('admins').emit('admin:panel:users:update', allUsers);

      socket.emit('admin:panel:deleteUser:success', { 
        message: 'User deleted successfully',
        userId
      });

    } catch (err) {
      console.error('Error in admin:panel:deleteUser:', err);
      socket.emit('admin:panel:error', { message: err.message });
    }
  });

  // Admin save settings
  socket.on('admin:settings:save', async ({ adminId, settings }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:settings:error', { message: 'Unauthorized access' });
        return;
      }

      if (!settings) {
        socket.emit('admin:settings:error', { message: 'Settings data is required' });
        return;
      }

      // In a real implementation, you would save these settings to a database
      // For now, we'll just log them and emit a success event
      console.log(`Admin ${adminId} saved settings:`, settings);

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'update_settings',
          settings
        },
        timestamp: new Date()
      });

      // Notify all admins about the updated settings
      io.to('admins').emit('admin:settings:updated', settings);

      socket.emit('admin:settings:save:success', { 
        message: 'Settings saved successfully',
        settings
      });

    } catch (err) {
      console.error('Error in admin:settings:save:', err);
      socket.emit('admin:settings:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to admin panel
    if (user.role === 'admin') {
      socket.leave(`admin-panel-${user._id}`);
    }
  });
};