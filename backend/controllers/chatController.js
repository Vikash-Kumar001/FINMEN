import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import SchoolStudent from '../models/School/SchoolStudent.js';
import SchoolClass from '../models/School/SchoolClass.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Get or create chat between teacher and parent for a specific student
export const getOrCreateChat = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tenantId, isLegacyUser, user: currentUser } = req;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Validate that studentId is a valid ObjectId
    if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid studentId format:', studentId);
      console.error('This usually happens due to route conflicts. studentId provided:', studentId);
      return res.status(400).json({ message: 'Invalid student ID format. Please use a valid student ID to access chat.' });
    }

    // Find the student and get parent information
    const student = await User.findById(studentId).select('name email linkedIds dateOfBirth gender').lean();
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
      .populate('studentId', 'name email avatar gender phone dateOfBirth');

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
        .populate('studentId', 'name email avatar gender phone dateOfBirth');
        
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
      await chat.populate('studentId', 'name email avatar gender phone dateOfBirth');
    }

    // Fetch additional student details from SchoolStudent
    let studentDetails = {
      age: null,
      gender: null,
      grade: null
    };
    
    try {
      const schoolStudent = await SchoolStudent.findOne({ 
        userId: studentId,
        tenantId: effectiveTenantId 
      }).populate('classId', 'className section');

      console.log('SchoolStudent found:', schoolStudent ? 'Yes' : 'No');
      
      if (schoolStudent) {
        console.log('SchoolStudent data:', {
          personalInfo: schoolStudent.personalInfo,
          classId: schoolStudent.classId
        });
        
        // Calculate age from dateOfBirth
        if (schoolStudent.personalInfo?.dateOfBirth) {
          const today = new Date();
          const birthDate = new Date(schoolStudent.personalInfo.dateOfBirth);
          studentDetails.age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            studentDetails.age--;
          }
        }

        studentDetails.gender = schoolStudent.personalInfo?.gender || null;
        studentDetails.grade = schoolStudent.classId?.className || null;
        
        console.log('Student details prepared:', studentDetails);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
    
    // Fallback: Get gender from User if not found in SchoolStudent
    if (studentDetails.gender === null) {
      if (chat.studentId?.gender) {
        studentDetails.gender = chat.studentId.gender;
        console.log('Using User gender as fallback (from chat.studentId):', chat.studentId.gender);
      } else if (student?.gender) {
        studentDetails.gender = student.gender;
        console.log('Using User gender as fallback (from student object):', student.gender);
      }
    }
    
    // Fallback: Calculate age from User's dateOfBirth if not found in SchoolStudent
    if (studentDetails.age === null && chat.studentId?.dateOfBirth) {
      console.log('Using User dateOfBirth as fallback:', chat.studentId.dateOfBirth);
      const today = new Date();
      const birthDate = new Date(chat.studentId.dateOfBirth);
      if (!isNaN(birthDate.getTime())) {
        studentDetails.age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          studentDetails.age--;
        }
        console.log('Calculated age from User dateOfBirth:', studentDetails.age);
      }
    }

    // Add student details to chat object
    const chatData = chat.toObject();
    chatData.studentDetails = studentDetails;
    
    console.log('=== DEBUG: Student Details ===');
    console.log('chat.studentId?:', chat.studentId?._id, chat.studentId?.name);
    console.log('chat.studentId.gender:', chat.studentId?.gender);
    console.log('chat.studentId.dateOfBirth:', chat.studentId?.dateOfBirth);
    console.log('studentDetails before sending:', JSON.stringify(chatData.studentDetails));
    console.log('===============================');

    res.json({
      success: true,
      data: chatData
    });
  } catch (error) {
    console.error('Error getting/creating chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get or create chat between teacher and student
export const getOrCreateStudentChat = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tenantId, isLegacyUser, user: currentUser } = req;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Validate that studentId is a valid ObjectId
    if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid studentId format:', studentId);
      return res.status(400).json({ message: 'Invalid student ID format. Please use a valid student ID to access chat.' });
    }

    // Find the student with linkedIds and tenantId
    const student = await User.findById(studentId).select('name email avatar gender dateOfBirth linkedIds tenantId').lean();
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('Student data:', {
      studentId,
      studentName: student.name,
      currentUserRole: currentUser.role,
      linkedIds: student.linkedIds,
      tenantId: student.tenantId
    });

    // Determine teacher and student IDs based on current user role
    let teacherId, studentUserId;
    
    if (currentUser.role === 'school_student' || currentUser.role === 'student') {
      // Current user is a student accessing their own chat
      studentUserId = currentUser._id;
      
      // Find teacher linked to this student
      const teacherLinkId = student.linkedIds?.teacherIds?.[0];
      if (teacherLinkId) {
        teacherId = teacherLinkId;
        console.log('Found teacher from student linkedIds:', teacherLinkId);
      } else {
        console.log('No teacher in student linkedIds, searching for any teacher...');
        
        // Get effective tenantId for search
        const studentTenantId = student.tenantId || 'legacy';
        
        // Find any teacher who has this student linked (reverse lookup)
        let teacherWithStudent = await User.findOne({
          role: { $in: ['school_teacher', 'teacher'] },
          'linkedIds.studentIds': studentId
        }).select('_id').lean();
        
        if (teacherWithStudent) {
          teacherId = teacherWithStudent._id;
          console.log('Found teacher from reverse lookup:', teacherId);
        } else {
          // Try to find ANY teacher in the same tenant/school
          const anyTeacher = await User.findOne({
            role: { $in: ['school_teacher', 'teacher'] },
            tenantId: studentTenantId
          }).select('_id name email').lean();
          
          if (anyTeacher) {
            teacherId = anyTeacher._id;
            console.log('Found any teacher in same tenant:', anyTeacher.name, teacherId);
          } else {
            return res.status(404).json({ 
              message: 'No teacher available in your school. Please contact support.' 
            });
          }
        }
      }
    } else {
      // Current user is a teacher
      teacherId = currentUser._id;
      studentUserId = studentId;
      console.log('Current user is a teacher, using teacherId:', teacherId);
    }

    // Use tenantId or fallback to 'legacy' for legacy users
    const effectiveTenantId = tenantId || 'legacy';

    // Check if chat already exists (teacher-student chat)
    let chat = await Chat.findOne({
      tenantId: effectiveTenantId,
      studentId,
      chatType: 'teacher-student',
      'participants.userId': { $all: [teacherId, studentUserId] }
    }).populate('participants.userId', 'name email avatar role')
      .populate('lastMessage')
      .populate('studentId', 'name email avatar gender phone dateOfBirth');

    console.log('Existing chat found:', chat ? 'Yes' : 'No');

    if (chat) {
      console.log('Chat details:', {
        chatId: chat._id,
        participants: chat.participants.map(p => ({
          userId: p.userId._id,
          name: p.userId.name,
          role: p.role
        }))
      });
    }

    // If chat doesn't exist, create new one
    if (!chat) {
      console.log('Creating new teacher-student chat...');
      
      chat = new Chat({
        tenantId: effectiveTenantId,
        studentId,
        chatType: 'teacher-student',
        participants: [
          { userId: teacherId, role: 'teacher' },
          { userId: studentUserId, role: 'student' }
        ],
        lastMessageAt: new Date(),
        isActive: true,
        unreadCount: {
          teacher: 0,
          student: 0
        }
      });

      await chat.save();
      console.log('New chat created:', chat._id);

      // Populate the saved chat
      await chat.populate('participants.userId', 'name email avatar role');
      await chat.populate('studentId', 'name email avatar gender phone dateOfBirth');
    }

    // Format response
    const chatData = {
      chatId: chat._id,
      participants: chat.participants.map(p => ({
        userId: {
          _id: p.userId._id,
          name: p.userId.name,
          email: p.userId.email,
          avatar: p.userId.avatar,
          role: p.userId.role
        },
        role: p.role
      })),
      studentId: chat.studentId,
      studentDetails: {
        name: chat.studentId?.name,
        email: chat.studentId?.email,
        avatar: chat.studentId?.avatar,
        gender: chat.studentId?.gender,
        dateOfBirth: chat.studentId?.dateOfBirth,
        age: chat.studentId?.dateOfBirth ? 
          Math.floor((new Date() - new Date(chat.studentId.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : null
      },
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };

    res.json({
      success: true,
      data: chatData
    });
  } catch (error) {
    console.error('Error getting/creating student chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get or create chat between teacher and parent (keeping existing functionality but updating for separation)
export const getOrCreateParentChat = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tenantId, isLegacyUser, user: currentUser } = req;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Validate that studentId is a valid ObjectId
    if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid studentId format:', studentId);
      return res.status(400).json({ message: 'Invalid student ID format. Please use a valid student ID to access chat.' });
    }

    // Find the student and get parent information
    const student = await User.findById(studentId).select('name email linkedIds dateOfBirth gender').lean();
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('Student data:', {
      studentId,
      studentName: student.name,
      linkedIds: student.linkedIds,
      currentUserRole: currentUser.role
    });

    // Determine parent ID and teacher ID based on user role
    let parentId, teacherId;
    if (currentUser.role === 'parent') {
      // For regular parents, they are the parent
      parentId = currentUser._id;
      // Find teacher linked to the student
      teacherId = student.linkedIds?.teacherIds?.[0];
      
      // If no teacher found in student's linkedIds, find a teacher who has this student
      if (!teacherId) {
        const teacherWithStudent = await User.findOne({
          role: { $in: ['school_teacher', 'teacher'] },
          'linkedIds.studentIds': studentId
        }).select('_id name email').lean();
        
        if (teacherWithStudent) {
          teacherId = teacherWithStudent._id;
        } else {
          const anyTeacher = await User.findOne({
            role: { $in: ['school_teacher', 'teacher'] }
          }).select('_id name email').lean();
          
          if (anyTeacher) {
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

    // Check if chat already exists (teacher-parent chat)
    let chat = await Chat.findOne({
      tenantId: effectiveTenantId,
      studentId,
      chatType: 'teacher-parent',
      'participants.userId': { $all: [teacherId, parentId] }
    }).populate('participants.userId', 'name email avatar role')
      .populate('lastMessage')
      .populate('studentId', 'name email avatar gender phone dateOfBirth');

    console.log('Existing chat found:', chat ? 'Yes' : 'No');

    if (chat) {
      console.log('Chat details:', {
        chatId: chat._id,
        participants: chat.participants.map(p => ({
          userId: p.userId._id,
          name: p.userId.name,
          role: p.role
        }))
      });
    }

    // If chat doesn't exist, create new one
    if (!chat) {
      console.log('Creating new teacher-parent chat...');
      
      chat = new Chat({
        tenantId: effectiveTenantId,
        studentId,
        chatType: 'teacher-parent',
        participants: [
          { userId: teacherId, role: 'teacher' },
          { userId: parentId, role: 'parent' }
        ],
        lastMessageAt: new Date(),
        isActive: true,
        unreadCount: {
          teacher: 0,
          parent: 0
        }
      });

      await chat.save();
      console.log('New chat created:', chat._id);

      // Populate the saved chat
      await chat.populate('participants.userId', 'name email avatar role');
      await chat.populate('studentId', 'name email avatar gender phone dateOfBirth');
    }

    // Format response
    const chatData = {
      chatId: chat._id,
      participants: chat.participants.map(p => ({
        userId: {
          _id: p.userId._id,
          name: p.userId.name,
          email: p.userId.email,
          avatar: p.userId.avatar,
          role: p.userId.role
        },
        role: p.role
      })),
      studentId: chat.studentId,
      studentDetails: {
        name: chat.studentId?.name,
        email: chat.studentId?.email,
        avatar: chat.studentId?.avatar,
        gender: chat.studentId?.gender,
        dateOfBirth: chat.studentId?.dateOfBirth,
        age: chat.studentId?.dateOfBirth ? 
          Math.floor((new Date() - new Date(chat.studentId.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : null
      },
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };

    res.json({
      success: true,
      data: chatData
    });
  } catch (error) {
    console.error('Error getting/creating parent chat:', error);
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

    // Exclude messages deleted by current user
    const messages = await Message.find({ 
      chatId, 
      'deletedBy.userId': { $ne: currentUser._id }
    })
      .populate('senderId', 'name avatar role')
      .populate('replyTo', 'content senderId messageType attachments')
      .populate('forwardedFrom', 'content senderId messageType attachments')
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
    let unreadField;
    if (currentUser.role === 'school_teacher' || currentUser.role === 'teacher') {
      unreadField = 'unreadCount.teacher';
    } else if (currentUser.role === 'school_student' || currentUser.role === 'student') {
      unreadField = 'unreadCount.student';
    } else {
      unreadField = 'unreadCount.parent';
    }
    
    await Chat.findByIdAndUpdate(chatId, {
      $set: {
        [unreadField]: 0
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

    // Validate chatId
    if (!chatId || chatId === 'undefined') {
      console.error('Invalid chatId:', chatId);
      return res.status(400).json({ message: 'Invalid chat ID' });
    }

    // Allow empty content if attachments are present
    if ((!content || content.trim().length === 0) && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ message: 'Message content or attachment is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      console.error('Chat not found with ID:', chatId);
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.userId.toString() === currentUser._id.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate file sizes (max 25MB per file)
    if (attachments && attachments.length > 0) {
      const maxSize = 25 * 1024 * 1024; // 25MB in bytes
      for (const attachment of attachments) {
        if (attachment.fileSize && attachment.fileSize > maxSize) {
          return res.status(400).json({ 
            message: 'Oops! This file exceeds the size limit of 25 MB',
            maxSize: 25
          });
        }
      }
    }

    // Format attachments properly
    const formattedAttachments = (attachments || []).map(att => ({
      filename: att.filename || 'file',
      url: att.url,
      fileType: att.fileType || 'application/octet-stream',
      fileSize: att.fileSize || 0,
      thumbnail: att.thumbnail
    }));

    // Use space as content if no text but attachments exist (Message schema requires content)
    const hasAttachments = formattedAttachments.length > 0;
    const messageContent = (content || '').trim() || (hasAttachments ? ' ' : content);

    // Determine sender role for message
    let senderRole;
    if (currentUser.role === 'school_teacher' || currentUser.role === 'teacher') {
      senderRole = 'teacher';
    } else if (currentUser.role === 'school_student' || currentUser.role === 'student') {
      senderRole = 'student';
    } else {
      senderRole = 'parent';
    }

    const message = new Message({
      chatId,
      senderId: currentUser._id,
      senderRole,
      content: messageContent,
      messageType: messageType || 'text',
      replyTo: replyTo || undefined,
      attachments: formattedAttachments
    });

    await message.save();
    await message.populate('senderId', 'name avatar role');
    
    // Only populate replyTo if it exists
    if (replyTo) {
      await message.populate('replyTo', 'content senderId messageType attachments');
    }

    // Update chat with last message and increment unread count
    let unreadField;
    if (currentUser.role === 'school_teacher' || currentUser.role === 'teacher') {
      // Teacher sent message, increment for other participant(s)
      const chat = await Chat.findById(chatId);
      if (chat.chatType === 'teacher-student') {
        unreadField = 'unreadCount.student';
      } else {
        unreadField = 'unreadCount.parent';
      }
    } else if (currentUser.role === 'school_student' || currentUser.role === 'student') {
      // Student sent message, increment for teacher
      unreadField = 'unreadCount.teacher';
    } else {
      // Parent sent message, increment for teacher
      unreadField = 'unreadCount.teacher';
    }

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
      $inc: { [unreadField]: 1 }
    });

    // Emit message to all participants via socket
    const io = req.app.get('io');
    if (io) {
      io.to(chatId).emit('new-message', {
        message,
        chatId
      });
      console.log(`📤 Message broadcasted to chat ${chatId}`);
    }

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

// Clear chat for current user only (marks messages as deleted for this user)
export const clearChat = async (req, res) => {
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

    // Mark all messages in the chat as deleted for this user only
    await Message.updateMany(
      { 
        chatId,
        'deletedBy.userId': { $ne: currentUser._id }
      },
      { 
        $push: { 
          deletedBy: { 
            userId: currentUser._id, 
            deletedAt: new Date() 
          } 
        }
      }
    );

    // Also mark unread messages as seen for this user
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

    res.json({ 
      success: true, 
      message: 'Chat cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// React to a message
export const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const { user: currentUser } = req;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      r => r.userId.toString() === currentUser._id.toString() && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter(
        r => !(r.userId.toString() === currentUser._id.toString() && r.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        emoji,
        userId: currentUser._id,
        createdAt: new Date()
      });
    }

    await message.save();
    await message.populate('senderId', 'name avatar role');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(message.chatId.toString()).emit('message-reaction-updated', {
        messageId: message._id,
        chatId: message.chatId,
        reactions: message.reactions,
        emoji,
        userId: currentUser._id,
        action: existingReaction ? 'removed' : 'added'
      });
    }

    res.json({ 
      success: true, 
      data: message 
    });
  } catch (error) {
    console.error('Error reacting to message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Edit a message
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const { user: currentUser } = req;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender
    if (message.senderId.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own messages' });
    }

    // Update message
    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();
    await message.populate('senderId', 'name avatar role');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(message.chatId.toString()).emit('message-edited', {
        messageId: message._id,
        chatId: message.chatId,
        message
      });
    }

    res.json({ 
      success: true, 
      data: message 
    });
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Star/Unstar a message
export const starMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { user: currentUser } = req;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const isStarred = message.starredBy.includes(currentUser._id);

    if (isStarred) {
      // Unstar
      message.starredBy = message.starredBy.filter(
        id => id.toString() !== currentUser._id.toString()
      );
    } else {
      // Star
      message.starredBy.push(currentUser._id);
    }

    await message.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(message.chatId.toString()).emit('message-star-updated', {
        messageId: message._id,
        chatId: message.chatId,
        starredBy: message.starredBy,
        action: isStarred ? 'unstarred' : 'starred'
      });
    }

    res.json({ 
      success: true, 
      data: message 
    });
  } catch (error) {
    console.error('Error starring message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Pin/unpin a message
export const pinMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { user: currentUser } = req;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Initialize pinnedBy if it doesn't exist
    if (!message.pinnedBy) {
      message.pinnedBy = [];
    }

    const isPinnedByMe = message.pinnedBy.some(id => id.toString() === currentUser._id.toString());

    if (isPinnedByMe) {
      // Unpin - remove current user from pinnedBy
      message.pinnedBy = message.pinnedBy.filter(
        id => id.toString() !== currentUser._id.toString()
      );
    } else {
      // Pin - add current user to pinnedBy (allow multiple pins)
      message.pinnedBy.push(currentUser._id);
    }

    await message.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(message.chatId.toString()).emit('message-pin-updated', {
        messageId: message._id,
        chatId: message.chatId,
        pinnedBy: message.pinnedBy,
        action: isPinnedByMe ? 'unpinned' : 'pinned'
      });
    }

    res.json({ 
      success: true, 
      data: message,
      isPinned: !isPinnedByMe
    });
  } catch (error) {
    console.error('Error pinning message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { user: currentUser } = req;
    const { deleteForEveryone = false } = req.query;

    const message = await Message.findById(messageId).populate('chatId');
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Get chat to find all participants
    const chat = await Chat.findById(message.chatId._id || message.chatId);
    const participantIds = chat.participants.map(p => p.userId.toString());

    if (deleteForEveryone === 'true') {
      // Only the sender can delete for everyone
      if (message.senderId.toString() !== currentUser._id.toString()) {
        return res.status(403).json({ 
          success: false,
          message: 'Only the message sender can delete for everyone' 
        });
      }
      
      // Delete for everyone - mark as deleted for all participants
      participantIds.forEach(participantId => {
        if (!message.deletedBy.some(d => d.userId.toString() === participantId)) {
          message.deletedBy.push({
            userId: participantId,
            deletedAt: new Date()
          });
        }
      });
      
      await message.save();

      // Emit real-time update for all participants
      const io = req.app.get('io');
      if (io) {
        const chatIdStr = chat._id.toString();
        io.to(chatIdStr).emit('message-deleted-for-everyone', {
          messageId: message._id,
          chatId: chatIdStr,
          deletedBy: currentUser._id
        });
      }
    } else {
      // Delete for me only - mark as deleted for current user
      if (!message.deletedBy.some(d => d.userId.toString() === currentUser._id.toString())) {
        message.deletedBy.push({
          userId: currentUser._id,
          deletedAt: new Date()
        });
        await message.save();
      }

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        const chatIdStr = chat._id.toString();
        io.to(chatIdStr).emit('message-deleted', {
          messageId: message._id,
          chatId: chatIdStr,
          deletedBy: currentUser._id
        });
      }
    }

    res.json({ 
      success: true, 
      message: 'Message deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forward message
export const forwardMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { chatId: targetChatId } = req.body;
    const { user: currentUser } = req;

    // Get original message
    const originalMessage = await Message.findById(messageId)
      .populate('senderId', 'name avatar role');
    if (!originalMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify target chat exists and user is participant
    const targetChat = await Chat.findById(targetChatId);
    if (!targetChat) {
      return res.status(404).json({ message: 'Target chat not found' });
    }

    const isParticipant = targetChat.participants.some(
      p => p.userId.toString() === currentUser._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create forwarded message
    const forwardedMessage = new Message({
      chatId: targetChatId,
      senderId: currentUser._id,
      senderRole: currentUser.role === 'school_teacher' ? 'teacher' : 'parent',
      content: originalMessage.content,
      messageType: originalMessage.messageType,
      attachments: originalMessage.attachments,
      forwardedFrom: messageId,
      forwardedBy: currentUser._id,
      replyTo: null
    });

    await forwardedMessage.save();
    await forwardedMessage.populate('senderId', 'name avatar role');

    // Update target chat
    await Chat.findByIdAndUpdate(targetChatId, {
      lastMessage: forwardedMessage._id,
      lastMessageAt: new Date()
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(targetChatId).emit('new-message', {
        message: forwardedMessage,
        chatId: targetChatId
      });
    }

    res.json({ 
      success: true, 
      data: forwardedMessage 
    });
  } catch (error) {
    console.error('Error forwarding message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/chat';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// Upload chat files
export const uploadChatFiles = async (req, res) => {
  try {
    const files = req.files || [];
    
    if (files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = files.map(file => ({
      filename: file.originalname,
      url: `/uploads/chat/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      thumbnail: file.mimetype.startsWith('image/') ? `/uploads/chat/${file.filename}` : undefined
    }));

    res.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading chat files:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
