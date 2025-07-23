import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * Socket handler for admin-educator real-time interactions
 * Enables admins to track educator activities and manage educator accounts
 */
export const setupAdminEducatorSocket = (io, socket, user) => {
  // Only admins can access these events
  if (user.role !== 'admin') return;

  // Subscribe to real-time educator activity tracking
  socket.on('admin:educator:activity:subscribe', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId) {
        socket.emit('admin:educator:activity:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`👁️ Admin ${adminId} subscribed to educator activity tracking`);
      
      // Join admin-specific room for educator tracking
      socket.join(`admin-educator-tracker-${adminId}`);
      
      // Send initial data
      const educators = await User.find({ role: 'educator' })
        .select('_id name email position subjects approvalStatus lastActive')
        .sort({ lastActive: -1 });
      
      socket.emit('admin:educator:activity:data', educators);
      
    } catch (err) {
      console.error('Error in admin:educator:activity:subscribe:', err);
      socket.emit('admin:educator:activity:error', { message: err.message });
    }
  });

  // Create new educator account
  socket.on('admin:educator:create', async ({ adminId, educatorData }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId) {
        socket.emit('admin:educator:create:error', { message: 'Unauthorized access' });
        return;
      }

      const { name, email, password, position, subjects } = educatorData;
      
      // Validate required fields
      if (!name || !email || !password || !position || !subjects) {
        socket.emit('admin:educator:create:error', { 
          message: 'Missing required fields for educator creation' 
        });
        return;
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        socket.emit('admin:educator:create:error', { message: 'Email already in use' });
        return;
      }

      // Create new educator
      const newEducator = await User.create({
        name,
        email: email.toLowerCase(),
        password, // Will be hashed by the User model pre-save hook
        role: 'educator',
        position,
        subjects,
        approvalStatus: 'approved', // Auto-approve when created by admin
        isVerified: true,
        approvedBy: adminId,
        approvedAt: new Date()
      });

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'create_educator',
          educatorId: newEducator._id,
          educatorName: newEducator.name,
          educatorEmail: newEducator.email
        },
        timestamp: new Date()
      });

      // Notify all admins about the new educator
      io.to('admins').emit('admin:educator:created', {
        message: `New educator ${name} created by admin`,
        educator: {
          _id: newEducator._id,
          name: newEducator.name,
          email: newEducator.email,
          position: newEducator.position,
          subjects: newEducator.subjects,
          approvalStatus: newEducator.approvalStatus,
          createdAt: newEducator.createdAt
        }
      });

      // Send success response to the admin who created the educator
      socket.emit('admin:educator:create:success', {
        message: 'Educator created successfully',
        educator: {
          _id: newEducator._id,
          name: newEducator.name,
          email: newEducator.email,
          position: newEducator.position,
          subjects: newEducator.subjects
        }
      });

      // Update educator lists for all admins
      const updatedEducators = await User.find({ role: 'educator' })
        .select('_id name email position subjects approvalStatus lastActive')
        .sort({ createdAt: -1 });
      
      io.to('admins').emit('admin:educators:update', updatedEducators);
      
    } catch (err) {
      console.error('Error in admin:educator:create:', err);
      socket.emit('admin:educator:create:error', { message: err.message });
    }
  });

  // Track specific educator activity
  socket.on('admin:educator:track', async ({ adminId, educatorId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId) {
        socket.emit('admin:educator:track:error', { message: 'Unauthorized access' });
        return;
      }

      // Verify educator exists
      const educator = await User.findOne({ _id: educatorId, role: 'educator' });
      if (!educator) {
        socket.emit('admin:educator:track:error', { message: 'Educator not found' });
        return;
      }

      console.log(`👁️ Admin ${adminId} tracking educator ${educatorId}`);
      
      // Join room specific to this educator for tracking
      socket.join(`admin-track-educator-${educatorId}`);
      
      // Get recent activities for this educator
      const recentActivities = await ActivityLog.find({ userId: educatorId })
        .sort({ timestamp: -1 })
        .limit(20);
      
      socket.emit('admin:educator:track:data', {
        educator: {
          _id: educator._id,
          name: educator.name,
          email: educator.email,
          position: educator.position,
          subjects: educator.subjects,
          approvalStatus: educator.approvalStatus,
          lastActive: educator.lastActive,
          createdAt: educator.createdAt
        },
        activities: recentActivities
      });
      
    } catch (err) {
      console.error('Error in admin:educator:track:', err);
      socket.emit('admin:educator:track:error', { message: err.message });
    }
  });

  // Stop tracking specific educator
  socket.on('admin:educator:untrack', ({ adminId, educatorId }) => {
    if (user._id.toString() !== adminId) return;
    
    console.log(`👁️ Admin ${adminId} stopped tracking educator ${educatorId}`);
    socket.leave(`admin-track-educator-${educatorId}`);
    socket.emit('admin:educator:untrack:success');
  });
};