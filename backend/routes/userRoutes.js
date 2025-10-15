import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { 
  getUserProfile, updateUserProfile, getAllStudents, updateUserAvatar, updateUserPassword,
  getUserSettings, updateUserSettings, exportUserData, getAdminProfileStats, uploadAvatar
} from '../controllers/userController.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

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
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});

const upload = multer({ storage });

// All user routes require auth
router.use(requireAuth);

// 👤 GET /api/user/profile — Get current user profile
router.get('/profile', getUserProfile);

// 📝 PUT /api/user/profile — Update user profile
router.put('/profile', updateUserProfile);

// 🖼️ POST /api/user/avatar — Update avatar (multipart form or preset URL)
router.post('/avatar', upload.single('avatar'), updateUserAvatar);

// 🖼️ POST /api/user/upload-avatar — Upload avatar (alternative endpoint)
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);

// 🔒 PUT /api/user/password — Update user password
router.put('/password', updateUserPassword);

// 🔒 PUT /api/user/change-password — Change password (alternative endpoint)
router.put('/change-password', updateUserPassword);

// ⚙️ GET /api/user/settings — Get user settings
router.get('/settings', getUserSettings);

// ⚙️ PUT /api/user/settings — Update user settings
router.put('/settings', updateUserSettings);

// 📊 GET /api/user/export-data — Export user data
router.get('/export-data', exportUserData);

// 👥 GET /api/user/students — Get all students (for admin)
router.get('/students', getAllStudents);

export default router;