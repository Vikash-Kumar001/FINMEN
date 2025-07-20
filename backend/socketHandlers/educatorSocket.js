import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import EducatorActivity from '../models/EducatorActivity.js';

/**
 * Socket handler for educator real-time interactions
 * Enables admins to track, create, and manage educators
 */
export const setupEducatorSocket = (io, socket, user) => {
  // Admin subscribe to educator activity
  socket.on('admin:educator:activity:subscribe', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:educator:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`👨‍🏫 Admin ${adminId} subscribed to educator activity`);
      
      // Join admin-specific room for educator updates
      socket.join('admin-educator-activity');
      
      // Get all educators with their activity
      const educators = await User.find({ role: 'educator' })
        .select('_id name email profilePicture status createdAt')
        .lean();
      
      // Get activity for each educator
      const educatorsWithActivity = await Promise.all(educators.map(async (educator) => {
        const activity = await EducatorActivity.find({ educatorId: educator._id })
          .sort({ timestamp: -1 })
          .limit(10);
        
        return {
          ...educator,
          activity
        };
      }));
      
      socket.emit('admin:educator:activity:data', educatorsWithActivity);
      
    } catch (err) {
      console.error('Error in admin:educator:activity:subscribe:', err);
      socket.emit('admin:educator:error', { message: err.message });
    }
  });

  // Admin track specific educator
  socket.on('admin:educator:track', async ({ adminId, educatorId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:educator:error', { message: 'Unauthorized access' });
        return;
      }

      // Verify educator exists
      const educator = await User.findOne({ _id: educatorId, role: 'educator' });
      if (!educator) {
        socket.emit('admin:educator:error', { message: 'Educator not found' });
        return;
      }

      console.log(`👨‍🏫 Admin ${adminId} started tracking educator ${educatorId}`);
      
      // Join educator-specific tracking room
      socket.join(`admin-track-educator-${educatorId}`);
      
      // Get educator details with activity
      const educatorDetails = await User.findById(educatorId)
        .select('_id name email profilePicture status createdAt')
        .lean();
      
      const activity = await EducatorActivity.find({ educatorId })
        .sort({ timestamp: -1 })
        .limit(50);
      
      socket.emit('admin:educator:track:data', {
        ...educatorDetails,
        activity
      });
      
      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'educator_tracking_started',
        details: {
          educatorId
        },
        timestamp: new Date()
      });

    } catch (err) {
      console.error('Error in admin:educator:track:', err);
      socket.emit('admin:educator:error', { message: err.message });
    }
  });

  // Admin untrack specific educator
  socket.on('admin:educator:untrack', async ({ adminId, educatorId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:educator:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`👨‍🏫 Admin ${adminId} stopped tracking educator ${educatorId}`);
      
      // Leave educator-specific tracking room
      socket.leave(`admin-track-educator-${educatorId}`);
      
      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'educator_tracking_stopped',
        details: {
          educatorId
        },
        timestamp: new Date()
      });

      socket.emit('admin:educator:untrack:success', { 
        message: 'Stopped tracking educator',
        educatorId
      });

    } catch (err) {
      console.error('Error in admin:educator:untrack:', err);
      socket.emit('admin:educator:error', { message: err.message });
    }
  });

  // Admin create new educator
  socket.on('admin:educator:create', async ({ adminId, name, email, password }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:educator:error', { message: 'Unauthorized access' });
        return;
      }

      // Validate input
      if (!name || !email || !password) {
        socket.emit('admin:educator:error', { message: 'Name, email, and password are required' });
        return;
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        socket.emit('admin:educator:error', { message: 'Email already in use' });
        return;
      }

      // Create new educator
      const newEducator = await User.create({
        name,
        email,
        password, // Note: In a real app, ensure this is hashed before saving
        role: 'educator',
        status: 'active',
        createdAt: new Date()
      });

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'educator_created',
        details: {
          educatorId: newEducator._id,
          educatorName: newEducator.name,
          educatorEmail: newEducator.email
        },
        timestamp: new Date()
      });

      // Notify all admins about new educator
      const educatorData = {
        _id: newEducator._id,
        name: newEducator.name,
        email: newEducator.email,
        role: newEducator.role,
        status: newEducator.status,
        createdAt: newEducator.createdAt
      };
      
      io.to('admin-educator-activity').emit('admin:educator:created', educatorData);
      
      socket.emit('admin:educator:create:success', { 
        message: 'Educator created successfully',
        educator: educatorData
      });

    } catch (err) {
      console.error('Error in admin:educator:create:', err);
      socket.emit('admin:educator:error', { message: err.message });
    }
  });

  // Admin join room for pending educators
  socket.on('admin:join', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`👨‍🏫 Admin ${adminId} joined admin room`);
      
      // Join admin room
      socket.join('admin-room');
      
      // Get pending educators
      const pendingEducators = await User.find({ 
        role: 'educator', 
        status: 'pending' 
      })
      .select('_id name email profilePicture createdAt')
      .sort({ createdAt: -1 })
      .lean();
      
      socket.emit('admin:pending-educators', pendingEducators);

    } catch (err) {
      console.error('Error in admin:join:', err);
      socket.emit('admin:error', { message: err.message });
    }
  });

  // Admin approve educator
  socket.on('admin:educator:approved', async ({ adminId, educatorId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:error', { message: 'Unauthorized access' });
        return;
      }

      // Find educator
      const educator = await User.findOne({ _id: educatorId, role: 'educator', status: 'pending' });
      if (!educator) {
        socket.emit('admin:error', { message: 'Pending educator not found' });
        return;
      }

      // Update educator status
      educator.status = 'active';
      await educator.save();

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'educator_approved',
        details: {
          educatorId,
          educatorName: educator.name,
          educatorEmail: educator.email
        },
        timestamp: new Date()
      });

      // Notify all admins
      io.to('admin-room').emit('admin:educator:status-updated', {
        educatorId,
        status: 'active'
      });
      
      // Get updated pending educators
      const pendingEducators = await User.find({ 
        role: 'educator', 
        status: 'pending' 
      })
      .select('_id name email profilePicture createdAt')
      .sort({ createdAt: -1 })
      .lean();
      
      io.to('admin-room').emit('admin:pending-educators', pendingEducators);
      
      // Notify educator if they're online
      io.to(`user-${educatorId}`).emit('educator:status-updated', {
        status: 'active',
        message: 'Your educator account has been approved'
      });

      socket.emit('admin:educator:approved:success', { 
        message: 'Educator approved successfully',
        educatorId
      });

    } catch (err) {
      console.error('Error in admin:educator:approved:', err);
      socket.emit('admin:error', { message: err.message });
    }
  });

  // Admin reject educator
  socket.on('admin:educator:rejected', async ({ adminId, educatorId, reason }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:error', { message: 'Unauthorized access' });
        return;
      }

      // Find educator
      const educator = await User.findOne({ _id: educatorId, role: 'educator', status: 'pending' });
      if (!educator) {
        socket.emit('admin:error', { message: 'Pending educator not found' });
        return;
      }

      // Update educator status
      educator.status = 'rejected';
      educator.rejectionReason = reason || 'No reason provided';
      await educator.save();

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'educator_rejected',
        details: {
          educatorId,
          educatorName: educator.name,
          educatorEmail: educator.email,
          reason: educator.rejectionReason
        },
        timestamp: new Date()
      });

      // Notify all admins
      io.to('admin-room').emit('admin:educator:status-updated', {
        educatorId,
        status: 'rejected'
      });
      
      // Get updated pending educators
      const pendingEducators = await User.find({ 
        role: 'educator', 
        status: 'pending' 
      })
      .select('_id name email profilePicture createdAt')
      .sort({ createdAt: -1 })
      .lean();
      
      io.to('admin-room').emit('admin:pending-educators', pendingEducators);
      
      // Notify educator if they're online
      io.to(`user-${educatorId}`).emit('educator:status-updated', {
        status: 'rejected',
        message: 'Your educator account has been rejected',
        reason: educator.rejectionReason
      });

      socket.emit('admin:educator:rejected:success', { 
        message: 'Educator rejected successfully',
        educatorId
      });

    } catch (err) {
      console.error('Error in admin:educator:rejected:', err);
      socket.emit('admin:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to educators
    if (user.role === 'admin') {
      socket.leave('admin-educator-activity');
      socket.leave('admin-room');
      
      // Find and leave all educator tracking rooms
      const rooms = Object.keys(socket.rooms);
      rooms.forEach(room => {
        if (room.startsWith('admin-track-educator-')) {
          socket.leave(room);
        }
      });
    }
  });
};