import express from 'express';
import {
  getOrCreateChat,
  getOrCreateStudentChat,
  getOrCreateParentChat,
  getChatMessages,
  sendMessage,
  markAsSeen,
  getUserChats,
  clearChat,
  reactToMessage,
  editMessage,
  starMessage,
  pinMessage,
  deleteMessage,
  forwardMessage,
  uploadChatFiles,
  uploadMiddleware
} from '../controllers/chatController.js';
import { requireAuth, requireSchoolRole, requireSchoolRoleOrParent } from '../middlewares/requireAuth.js';

const router = express.Router();

// Get or create chat for a specific student (legacy - keeping for backward compatibility)
router.get('/student/:studentId', requireAuth, requireSchoolRoleOrParent, getOrCreateChat);

// Get or create teacher-student chat
router.get('/student-chat/:studentId', requireAuth, requireSchoolRoleOrParent, getOrCreateStudentChat);

// Get or create teacher-parent chat
router.get('/parent-chat/:studentId', requireAuth, requireSchoolRoleOrParent, getOrCreateParentChat);

// Get user's all chats
router.get('/user-chats', requireAuth, requireSchoolRoleOrParent, getUserChats);

// Upload chat files
router.post('/upload', requireAuth, requireSchoolRoleOrParent, uploadMiddleware.array('files', 5), uploadChatFiles);

// Get chat messages
router.get('/:chatId/messages', requireAuth, requireSchoolRoleOrParent, getChatMessages);

// Send message
router.post('/:chatId/send', requireAuth, requireSchoolRoleOrParent, sendMessage);

// Mark messages as seen
router.put('/:chatId/seen', requireAuth, requireSchoolRoleOrParent, markAsSeen);

// Clear chat for current user only
router.delete('/:chatId', requireAuth, requireSchoolRoleOrParent, clearChat);

// Message operations
router.post('/message/:messageId/react', requireAuth, reactToMessage);
router.put('/message/:messageId/edit', requireAuth, editMessage);
router.post('/message/:messageId/star', requireAuth, starMessage);
router.post('/message/:messageId/pin', requireAuth, pinMessage);
router.delete('/message/:messageId', requireAuth, deleteMessage);
router.post('/message/:messageId/forward', requireAuth, forwardMessage);

export default router;
