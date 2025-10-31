import express from 'express';
import {
  createApprovalRequest,
  getApprovalRequests,
  approveRequest,
  rejectRequest,
  accessApprovedData,
  getApprovalStats
} from '../controllers/adminApprovalController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Approval request endpoints
router.post('/requests', createApprovalRequest);
router.get('/requests', getApprovalRequests);
router.get('/stats', getApprovalStats);
router.put('/requests/:requestId/approve', approveRequest);
router.put('/requests/:requestId/reject', rejectRequest);
router.post('/requests/:requestId/access', accessApprovedData);

export default router;

