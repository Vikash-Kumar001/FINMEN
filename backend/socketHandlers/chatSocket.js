import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

export const setupChatSocket = (io) => {
  // Increase max listeners to prevent memory leak warnings
  io.setMaxListeners(20);
  
  io.on('connection', (socket) => {
    console.log('💬 Chat socket connected:', socket.id);
    
    // Set max listeners for this socket
    socket.setMaxListeners(20);

    // Join chat room
    socket.on('join-chat', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat) {
          socket.join(chatId);
          socket.emit('joined-chat', { chatId });
          console.log(`User joined chat: ${chatId}`);
        }
      } catch (error) {
        console.error('Error joining chat:', error);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Leave chat room
    socket.on('leave-chat', (chatId) => {
      socket.leave(chatId);
      socket.emit('left-chat', { chatId });
      console.log(`User left chat: ${chatId}`);
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { chatId, content, messageType = 'text', replyTo, attachments } = data;
        const userId = socket.userId;

        if (!userId) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        const user = await User.findById(userId).select('name avatar role');
        if (!user) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        const message = new Message({
          chatId,
          senderId: userId,
          senderRole: user.role === 'school_teacher' ? 'teacher' : 'parent',
          content: content.trim(),
          messageType,
          replyTo,
          attachments: attachments || []
        });

        await message.save();
        await message.populate('senderId', 'name avatar role');
        await message.populate('replyTo');

        // Update chat with last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          lastMessageAt: new Date(),
          $inc: {
            [`unreadCount.${user.role === 'school_teacher' ? 'parent' : 'teacher'}`]: 1
          }
        });

        // Emit message to all users in the chat room
        io.to(chatId).emit('new-message', {
          message,
          chatId
        });

        console.log(`Message sent in chat ${chatId}:`, content.substring(0, 50));
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Mark messages as seen
    socket.on('mark-as-seen', async (data) => {
      try {
        const { chatId } = data;
        const userId = socket.userId;

        if (!userId) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        const user = await User.findById(userId).select('role');
        if (!user) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        // Mark all messages in chat as seen for current user
        await Message.updateMany(
          { 
            chatId, 
            senderId: { $ne: userId },
            'readBy.userId': { $ne: userId }
          },
          { 
            $addToSet: { 
              readBy: { 
                userId: userId, 
                readAt: new Date() 
              } 
            },
            $set: { status: 'seen' }
          }
        );

        // Update unread count
        await Chat.findByIdAndUpdate(chatId, {
          $set: {
            [`unreadCount.${user.role === 'school_teacher' ? 'teacher' : 'parent'}`]: 0
          }
        });

        // Emit seen status to other users in chat
        socket.to(chatId).emit('messages-seen', {
          chatId,
          seenBy: userId,
          seenAt: new Date()
        });

        console.log(`Messages marked as seen in chat ${chatId} by user ${userId}`);
      } catch (error) {
        console.error('Error marking messages as seen:', error);
        socket.emit('error', { message: 'Failed to mark messages as seen' });
      }
    });

    // Typing indicator
    socket.on('typing-start', (data) => {
      const { chatId, userId } = data;
      socket.to(chatId).emit('user-typing', {
        chatId,
        userId,
        isTyping: true
      });
    });

    socket.on('typing-stop', (data) => {
      const { chatId, userId } = data;
      socket.to(chatId).emit('user-typing', {
        chatId,
        userId,
        isTyping: false
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('💬 Chat socket disconnected:', socket.id);
    });
  });
};