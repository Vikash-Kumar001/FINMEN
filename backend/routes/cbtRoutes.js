import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  startChat,
  getChatHistory,
  clearChatHistory,
} from '../controllers/cbtController.js';

const router = express.Router();

router.post('/chat', requireAuth, startChat);
router.get('/history', requireAuth, getChatHistory);
router.delete('/history', requireAuth, clearChatHistory);

export default router;
