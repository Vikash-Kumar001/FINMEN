import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * Socket handler for chat real-time interactions
 * Enables students to send and receive chat messages
 */
export const setupChatSocket = (io, socket, user) => {
  // Student subscribe to chat
  socket.on('student:chat:subscribe', async ({ studentId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:chat:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`💬 Student ${studentId} subscribed to chat`);
      
      // Join student-specific room for chat updates
      socket.join(`student-chat-${studentId}`);
      
      // Get student's chat history (last 50 messages)
      const chatHistory = await ChatMessage.find({ 
        $or: [
          { senderId: studentId },
          { receiverId: studentId }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('senderId', 'name profilePicture')
      .lean();
      
      // Reverse to show oldest first
      chatHistory.reverse();
      
      socket.emit('student:chat:history', chatHistory);
      
    } catch (err) {
      console.error('Error in student:chat:subscribe:', err);
      socket.emit('student:chat:error', { message: err.message });
    }
  });

  // Student send chat message
  socket.on('student:chat:send', async ({ studentId, message, attachments = [] }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:chat:error', { message: 'Unauthorized access' });
        return;
      }

      // Validate input
      if (!message && attachments.length === 0) {
        socket.emit('student:chat:error', { message: 'Message or attachment is required' });
        return;
      }

      // Find an admin or educator to receive the message
      // For simplicity, we'll find the first admin in the system
      // In a production system, you might want to implement a more sophisticated routing logic
      const admin = await User.findOne({ role: 'admin' }).select('_id name profilePicture');
      
      if (!admin) {
        socket.emit('student:chat:error', { message: 'No admin available to receive your message' });
        return;
      }

      // Create chat message
      const chatMessage = await ChatMessage.create({
        senderId: studentId,
        receiverId: admin._id,
        message,
        attachments,
        timestamp: new Date(),
        isRead: false
      });

      // Populate sender info
      const populatedMessage = await ChatMessage.findById(chatMessage._id)
        .populate('senderId', 'name profilePicture')
        .lean();

      // Log activity
      await ActivityLog.create({
        userId: studentId,
        activityType: 'chat_message_sent',
        details: {
          messageId: chatMessage._id,
          receiverId: admin._id
        },
        timestamp: new Date()
      });

      // Send message to student
      socket.emit('student:chat:message', populatedMessage);
      
      // Send message to all admins
      io.to('admin-chat').emit('admin:chat:message', {
        ...populatedMessage,
        studentId
      });

    } catch (err) {
      console.error('Error in student:chat:send:', err);
      socket.emit('student:chat:error', { message: err.message });
    }
  });

  // Admin subscribe to all student chats
  socket.on('admin:chat:subscribe', async ({ adminId }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:chat:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`💬 Admin ${adminId} subscribed to all chats`);
      
      // Join admin-specific room for chat updates
      socket.join('admin-chat');
      
      // Get all recent chat messages (last 100 messages)
      const chatHistory = await ChatMessage.find({})
        .sort({ timestamp: -1 })
        .limit(100)
        .populate('senderId', 'name profilePicture')
        .populate('receiverId', 'name profilePicture')
        .lean();
      
      socket.emit('admin:chat:history', chatHistory);
      
    } catch (err) {
      console.error('Error in admin:chat:subscribe:', err);
      socket.emit('admin:chat:error', { message: err.message });
    }
  });

  // Admin send chat message to student
  socket.on('admin:chat:send', async ({ adminId, studentId, message, attachments = [] }) => {
    try {
      // Verify admin permissions
      if (user._id.toString() !== adminId || user.role !== 'admin') {
        socket.emit('admin:chat:error', { message: 'Unauthorized access' });
        return;
      }

      // Validate input
      if (!message && attachments.length === 0) {
        socket.emit('admin:chat:error', { message: 'Message or attachment is required' });
        return;
      }

      if (!studentId) {
        socket.emit('admin:chat:error', { message: 'Student ID is required' });
        return;
      }

      // Verify student exists
      const student = await User.findOne({ _id: studentId, role: 'student' });
      if (!student) {
        socket.emit('admin:chat:error', { message: 'Student not found' });
        return;
      }

      // Create chat message
      const chatMessage = await ChatMessage.create({
        senderId: adminId,
        receiverId: studentId,
        message,
        attachments,
        timestamp: new Date(),
        isRead: false
      });

      // Populate sender info
      const populatedMessage = await ChatMessage.findById(chatMessage._id)
        .populate('senderId', 'name profilePicture')
        .lean();

      // Log activity
      await ActivityLog.create({
        userId: adminId,
        activityType: 'chat_message_sent',
        details: {
          messageId: chatMessage._id,
          receiverId: studentId
        },
        timestamp: new Date()
      });

      // Send message to all admins
      io.to('admin-chat').emit('admin:chat:message', {
        ...populatedMessage,
        studentId
      });
      
      // Send message to specific student if they're online
      io.to(`student-chat-${studentId}`).emit('student:chat:message', populatedMessage);

    } catch (err) {
      console.error('Error in admin:chat:send:', err);
      socket.emit('admin:chat:error', { message: err.message });
    }
  });

  // Mark messages as read
  socket.on('chat:mark-read', async ({ userId, messageIds }) => {
    try {
      // Verify user permissions
      if (user._id.toString() !== userId) {
        socket.emit('chat:error', { message: 'Unauthorized access' });
        return;
      }

      if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        socket.emit('chat:error', { message: 'Message IDs are required' });
        return;
      }

      // Update messages as read
      await ChatMessage.updateMany(
        { _id: { $in: messageIds }, receiverId: userId },
        { $set: { isRead: true } }
      );

      // Notify about read status
      if (user.role === 'student') {
        io.to('admin-chat').emit('admin:chat:read', { messageIds, studentId: userId });
      } else if (user.role === 'admin') {
        // Find the students associated with these messages
        const messages = await ChatMessage.find({ _id: { $in: messageIds } });
        const studentIds = [...new Set(messages.map(msg => 
          msg.senderId.toString() === userId ? msg.receiverId.toString() : msg.senderId.toString()
        ))];
        
        // Notify each student
        studentIds.forEach(studentId => {
          io.to(`student-chat-${studentId}`).emit('student:chat:read', { messageIds });
        });
      }

    } catch (err) {
      console.error('Error in chat:mark-read:', err);
      socket.emit('chat:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to chat
    if (user.role === 'student') {
      socket.leave(`student-chat-${user._id}`);
    } else if (user.role === 'admin') {
      socket.leave('admin-chat');
    }
  });
};