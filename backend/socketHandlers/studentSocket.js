import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * Socket handler for student data real-time interactions
 * Enables admins to view and manage student data
 */
export const setupStudentSocket = (io, socket, user) => {
  // Admin subscribe to student data
  socket.on('admin:students:subscribe', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:students:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`👁️ Admin ${adminId} subscribed to student data`);
      
      // Join admin-specific room for student data updates
      socket.join(`admin-students-${adminId}`);
      
      // Send initial student data
      const students = await User.find({ role: 'student' })
        .select('_id name email status class xp achievements lastActive')
        .sort({ createdAt: -1 });
      
      socket.emit('admin:students:data', students);
      
    } catch (err) {
      console.error('Error in admin:students:subscribe:', err);
      socket.emit('admin:students:error', { message: err.message });
    }
  });

  // Admin export student data as CSV
  socket.on('admin:students:exportCSV', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:students:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`📊 Admin ${adminId} exporting student data as CSV`);
      
      // Get all student data for CSV export
      const students = await User.find({ role: 'student' })
        .select('_id name email status class xp achievements lastActive createdAt')
        .sort({ createdAt: -1 });
      
      // Format data for CSV
      const csvData = students.map(student => ({
        id: student._id,
        name: student.name,
        email: student.email,
        status: student.status,
        class: student.class,
        xp: student.xp,
        achievements: student.achievements ? student.achievements.length : 0,
        lastActive: student.lastActive ? student.lastActive.toISOString() : 'Never',
        createdAt: student.createdAt.toISOString()
      }));
      
      socket.emit('admin:students:csv', csvData);
      
      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'export_student_data',
          count: students.length
        },
        timestamp: new Date()
      });
      
    } catch (err) {
      console.error('Error in admin:students:exportCSV:', err);
      socket.emit('admin:students:error', { message: err.message });
    }
  });

  // Admin update student status
  socket.on('admin:student:update_status', async ({ adminId, studentId, status }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:students:error', { message: 'Unauthorized access' });
        return;
      }

      if (!['active', 'inactive', 'suspended'].includes(status)) {
        socket.emit('admin:students:error', { message: 'Invalid status value' });
        return;
      }

      // Update student status
      const student = await User.findById(studentId);
      
      if (!student || student.role !== 'student') {
        socket.emit('admin:students:error', { message: 'Student not found' });
        return;
      }

      student.status = status;
      await student.save();

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'update_student_status',
          studentId,
          studentName: student.name,
          oldStatus: student.status,
          newStatus: status
        },
        timestamp: new Date()
      });

      // Notify all admins about the status change
      io.to('admins').emit('admin:student:status_changed', {
        studentId,
        status
      });

      socket.emit('admin:student:update_status:success', { 
        message: `Student status updated to ${status}`,
        studentId,
        status
      });

    } catch (err) {
      console.error('Error in admin:student:update_status:', err);
      socket.emit('admin:students:error', { message: err.message });
    }
  });

  // Admin delete student
  socket.on('admin:student:delete', async ({ adminId, studentId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:students:error', { message: 'Unauthorized access' });
        return;
      }

      // Find student
      const student = await User.findById(studentId);
      
      if (!student || student.role !== 'student') {
        socket.emit('admin:students:error', { message: 'Student not found' });
        return;
      }

      // Store student info for logging
      const studentInfo = {
        id: student._id,
        name: student.name,
        email: student.email
      };

      // Delete student
      await User.findByIdAndDelete(studentId);

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'admin_action',
        details: {
          action: 'delete_student',
          studentId: studentInfo.id,
          studentName: studentInfo.name,
          studentEmail: studentInfo.email
        },
        timestamp: new Date()
      });

      // Notify all admins about the deletion
      io.to('admins').emit('admin:student:deleted', {
        studentId
      });

      socket.emit('admin:student:delete:success', { 
        message: 'Student deleted successfully',
        studentId
      });

    } catch (err) {
      console.error('Error in admin:student:delete:', err);
      socket.emit('admin:students:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to student data
    if (user.role === 'admin') {
      socket.leave(`admin-students-${user._id}`);
    }
  });
};