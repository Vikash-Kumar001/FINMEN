import express from 'express';
import {
  bulkOnboard,
  syncHRIS,
  processGraduationPromotion,
  linkParentStudent,
  bulkLinkParentStudent,
  getLifecycleStats
} from '../controllers/userLifecycleController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Get lifecycle statistics
router.get('/stats', getLifecycleStats);

// Bulk onboard users
router.post('/bulk-onboard', bulkOnboard);

// Sync HRIS teacher roster
router.post('/hris/sync', syncHRIS);

// Process graduation and promotion
router.post('/graduation-promotion', processGraduationPromotion);

// Link parent and student
router.post('/link-parent-student', linkParentStudent);

// Bulk link parent-student
router.post('/bulk-link-parent-student', bulkLinkParentStudent);

export default router;

