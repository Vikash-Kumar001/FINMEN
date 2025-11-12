import express from 'express';
import {
  getContent,
  getContentById,
  approveContent,
  rejectContent,
  checkAgeAppropriate,
  setRegionRestrictions,
  getContentAnalytics,
  getGovernanceStats
} from '../controllers/contentGovernanceController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Get governance statistics
router.get('/stats', getGovernanceStats);

// Get content analytics
router.get('/analytics', getContentAnalytics);

// Get all content
router.get('/', getContent);

// Get content by ID
router.get('/:contentId', getContentById);

// Approve content
router.post('/:contentId/approve', approveContent);

// Reject content
router.post('/:contentId/reject', rejectContent);

// Check age appropriateness
router.post('/:contentId/check-age', checkAgeAppropriate);

// Set region restrictions
router.put('/:contentId/region-restrictions', setRegionRestrictions);

export default router;

