import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { extractTenant } from '../middlewares/tenantMiddleware.js';
import {
  startAttempt,
  saveProgress,
  submitAssignment,
  getAttempt,
  getStudentAttempts,
  getAssignmentStats
} from '../controllers/assignmentAttemptController.js';

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log('🔍 Assignment Attempt Route Hit:', {
    method: req.method,
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl
  });
  next();
});

// Apply authentication and tenant middleware to all routes
router.use(requireAuth);
router.use(extractTenant);

// Student routes
router.post('/start/:assignmentId', startAttempt);
router.put('/progress/:attemptId', saveProgress);
router.post('/submit/:attemptId', submitAssignment);
router.get('/:attemptId', getAttempt);
router.get('/assignment/:assignmentId/attempts', getStudentAttempts);

// Teacher routes
router.get('/stats/:assignmentId', getAssignmentStats);

export default router;
