import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// Get or create chat between teacher and parent for a specific student
export const getOrCreateChat = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tenantId, isLegacyUser, user: currentUser } = req;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Find the student and get parent information
    const student = await User.findById(studentId).select('name email linkedIds').lean();
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('Student data:', {
      studentId,
      studentName: student.name,
      linkedIds: student.linkedIds,
      currentUserRole: currentUser.role
    });

    // Debug: Check what teachers exist in the system
    const allTeachers = await User.find({
      role: { $in: ['school_teacher', 'teacher'] }
    }).select('_id name email role').lean();
    console.log('All teachers in system:', allTeachers);

    // Determine parent ID and teacher ID based on user role
    let parentId, teacherId;
    if (currentUser.role === 'parent') {
      // For regular parents, they are the parent
      parentId = currentUser._id;
      // Find teacher linked to the student - try multiple approaches
      teacherId = student.linkedIds?.teacherIds?.[0];
      
      // If no teacher found in student's linkedIds, find a teacher who has this student
      if (!teacherId) {
        console.log('No teacher in student linkedIds, searching for teacher with this student...');
        const teacherWithStudent = await User.findOne({
          role: { $in: ['school_teacher', 'teacher'] },
          'linkedIds.studentIds': studentId
        }).select('_id name email').lean();
        
        console.log('Found teacher:', teacherWithStudent);
        
        if (teacherWithStudent) {
          teacherId = teacherWithStudent._id;
        } else {
          // Let's also try to find any teacher and see what's available
          const anyTeacher = await User.findOne({
            role: { $in: ['school_teacher', 'teacher'] }
          }).select('_id name email role linkedIds').lean();
          
          console.log('Any teacher found:', anyTeacher);
          
          // If we found any teacher, use them as a fallback
          if (anyTeacher) {
            console.log('Using fallback teacher:', anyTeacher._id);
            teacherId = anyTeacher._id;
          } else {
            return res.status(404).json({ 
              message: 'No teacher found for this student. Please contact support to link a teacher.' 
            });
          }
        }
      }
    } else {
      // For school users, get parent from student's linkedIds
      parentId = student.linkedIds?.parentIds?.[0];
      if (!parentId) {
        return res.status(404).json({ message: 'No parent linked to this student' });
      }
      // Current user is the teacher
      teacherId = currentUser._id;
    }

    // Use tenantId or fallback to 'legacy' for legacy users
    const effectiveTenantId = tenantId || 'legacy';

    // Check if chat already exists
    let chat = await Chat.findOne({
      tenantId: effectiveTenantId,
      studentId,
      'participants.userId': { $all: [teacherId, parentId] }
    }).populate('participants.userId', 'name email avatar role')
      .populate('lastMessage')
      .populate('studentId', 'name email avatar');

    console.log('Existing chat found:', chat ? 'Yes' : 'No');
    if (chat) {
      console.log('Chat details:', {
        chatId: chat._id,
        participants: chat.participants.map(p => ({ userId: p.userId, role: p.role })),
        studentId: chat.studentId
      });
    } else {
      // Debug: Check what chats exist for this student
      const existingChats = await Chat.find({
        studentId,
        tenantId: effectiveTenantId
      }).select('participants studentId tenantId').lean();
      
      console.log('All chats for this student:', existingChats);
      console.log('Looking for teacherId:', teacherId, 'parentId:', parentId);
      
      // Try to find any chat with this parent and student (regardless of teacher)
      const parentChat = await Chat.findOne({
        studentId,
        tenantId: effectiveTenantId,
        'participants.userId': parentId
      }).populate('participants.userId', 'name email avatar role')
        .populate('lastMessage')
        .populate('studentId', 'name email avatar');
        
      if (parentChat) {
        console.log('Found existing chat with parent:', parentChat._id);
        chat = parentChat;
      }
    }

    if (!chat) {
      // Create new chat
      chat = new Chat({
        tenantId: effectiveTenantId,
        studentId,
        participants: [
          {
            userId: teacherId,
            role: 'teacher'
          },
          {
            userId: parentId,
            role: 'parent'
          }
        ]
      });

      await chat.save();
      await chat.populate('participants.userId', 'name email avatar role');
      await chat.populate('studentId', 'name email avatar');
    }

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Error getting/creating chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get chat messages
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const { user: currentUser } = req;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.userId.toString() === currentUser._id.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ chatId, isDeleted: false })
      .populate('senderId', 'name avatar role')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as seen for current user
    const unreadMessages = messages.filter(msg => 
      msg.senderId._id.toString() !== currentUser._id.toString() &&
      !msg.readBy.some(read => read.userId.toString() === currentUser._id.toString())
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(msg => msg._id) } },
        { 
          $addToSet: { 
            readBy: { 
              userId: currentUser._id, 
              readAt: new Date() 
            } 
          },
          $set: { status: 'seen' }
        }
      );
    }

    // Update unread count
    await Chat.findByIdAndUpdate(chatId, {
      $set: {
        [`unreadCount.${currentUser.role === 'school_teacher' ? 'teacher' : 'parent'}`]: 0
      }
    });

    res.json({
      success: true,
      data: messages.reverse()
    });
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text', replyTo, attachments } = req.body;
    const { user: currentUser } = req;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.userId.toString() === currentUser._id.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = new Message({
      chatId,
      senderId: currentUser._id,
      senderRole: currentUser.role === 'school_teacher' ? 'teacher' : 'parent',
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
        [`unreadCount.${currentUser.role === 'school_teacher' ? 'parent' : 'teacher'}`]: 1
      }
    });

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark messages as seen
export const markAsSeen = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { user: currentUser } = req;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.userId.toString() === currentUser._id.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark all messages in chat as seen for current user
    await Message.updateMany(
      { 
        chatId, 
        senderId: { $ne: currentUser._id },
        'readBy.userId': { $ne: currentUser._id }
      },
      { 
        $addToSet: { 
          readBy: { 
            userId: currentUser._id, 
            readAt: new Date() 
          } 
        },
        $set: { status: 'seen' }
      }
    );

    // Update unread count
    await Chat.findByIdAndUpdate(chatId, {
      $set: {
        [`unreadCount.${currentUser.role === 'school_teacher' ? 'teacher' : 'parent'}`]: 0
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as seen:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's chats
export const getUserChats = async (req, res) => {
  try {
    const { user: currentUser } = req;
    const { tenantId } = req;

    const chats = await Chat.find({
      tenantId,
      'participants.userId': currentUser._id,
      isActive: true
    })
      .populate('participants.userId', 'name email avatar role')
      .populate('studentId', 'name email avatar')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Error getting user chats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
