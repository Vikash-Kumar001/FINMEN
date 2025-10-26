import express from 'express';
import {
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  markAsSeen,
  getUserChats
} from '../controllers/chatController.js';
import { requireAuth, requireSchoolRole, requireSchoolRoleOrParent } from '../middlewares/requireAuth.js';

const router = express.Router();

// Get or create chat for a specific student
router.get('/student/:studentId', requireAuth, requireSchoolRoleOrParent, getOrCreateChat);

// Get user's all chats
router.get('/user-chats', requireAuth, requireSchoolRoleOrParent, getUserChats);

// Get chat messages
router.get('/:chatId/messages', requireAuth, requireSchoolRoleOrParent, getChatMessages);

// Send message
router.post('/:chatId/send', requireAuth, requireSchoolRoleOrParent, sendMessage);

// Mark messages as seen
router.put('/:chatId/seen', requireAuth, requireSchoolRoleOrParent, markAsSeen);

export default router;
