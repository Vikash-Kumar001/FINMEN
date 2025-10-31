import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  createApprovalRequest,
  getApprovalRequests,
  getApprovalById,
  updateWorkflowStep,
  makeApprovalDecision,
  updatePilotResults,
  getApprovalStats
} from '../controllers/campaignApprovalController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
// Temporarily comment out for testing
// router.use(requireAuth);
// router.use(requireCSR);

// Campaign Approval Management
router.post('/approvals', createApprovalRequest);
router.get('/approvals', getApprovalRequests);
router.get('/approvals/stats', getApprovalStats); // Move this before the :approvalId route
router.get('/approvals/:approvalId', getApprovalById);
router.put('/approvals/:approvalId/workflow', updateWorkflowStep);
router.put('/approvals/:approvalId/decision', makeApprovalDecision);
router.put('/approvals/:approvalId/pilot-results', updatePilotResults);

export default router;
