import express from 'express';
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getStudentAnnouncements,
  getTeacherAnnouncements,
  getParentAnnouncements,
  markAnnouncementAsRead,
  getAnnouncementStats,
  toggleAnnouncementPin
} from '../controllers/announcementController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkRole } from '../middlewares/checkRole.js';
import { extractTenant } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(extractTenant);

// Admin routes (School Admin and Teacher)
router.post('/', requireAuth, checkRole(['school_admin', 'school_teacher']), createAnnouncement);
router.get('/admin/all', requireAuth, checkRole(['school_admin']), getAllAnnouncements);
router.get('/admin/stats', requireAuth, checkRole(['school_admin']), getAnnouncementStats);
router.get('/admin/:id', requireAuth, checkRole(['school_admin']), getAnnouncementById);
router.put('/admin/:id', requireAuth, checkRole(['school_admin']), updateAnnouncement);
router.delete('/admin/:id', requireAuth, checkRole(['school_admin']), deleteAnnouncement);
router.patch('/admin/:id/toggle-pin', requireAuth, checkRole(['school_admin']), toggleAnnouncementPin);

// Student routes
router.get('/student', requireAuth, checkRole(['school_student', 'student']), getStudentAnnouncements);
router.patch('/student/:id/read', requireAuth, checkRole(['school_student', 'student']), markAnnouncementAsRead);

// Teacher routes
router.get('/teacher', requireAuth, checkRole(['school_teacher']), getTeacherAnnouncements);
router.patch('/teacher/:id/read', requireAuth, checkRole(['school_teacher']), markAnnouncementAsRead);

// Parent routes
router.get('/parent', requireAuth, checkRole(['school_parent', 'parent']), getParentAnnouncements);
router.patch('/parent/:id/read', requireAuth, checkRole(['school_parent', 'parent']), markAnnouncementAsRead);

// General announcement details (for all roles)
router.get('/:id', requireAuth, getAnnouncementById);

export default router;
