/**
 * Avatar Routes
 * Handles all avatar-related endpoints
 */

import express from 'express';
import {
  generateUserAvatar,
  getAvatarOptions,
  updateUserAvatar,
  uploadCustomAvatar,
  resetAvatarToGenerated,
  getUserAvatar
} from '../controllers/avatarController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload dir exists
const uploadDir = path.resolve(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, `avatar_${Date.now()}_${base}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get user's current avatar
router.get('/:userId', getUserAvatar);

// Generate avatar for user (if missing)
router.post('/generate/:userId', generateUserAvatar);

// Get avatar options for customization
router.get('/options/:userId', getAvatarOptions);

// Update user avatar with custom selection
router.put('/update/:userId', updateUserAvatar);

// Upload custom avatar image
router.post('/upload/:userId', upload.single('avatar'), (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}, uploadCustomAvatar);

// Reset avatar to generated version
router.post('/reset/:userId', resetAvatarToGenerated);

export default router;
