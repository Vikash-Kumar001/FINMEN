import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  defineScope,
  selectTemplates,
  configurePilot,
  setBudget,
  requestApprovals,
  launchCampaign,
  getTemplates,
  getMonitoringData,
  generateReport
} from '../controllers/campaignWizardController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
// Temporarily comment out for testing
// router.use(requireAuth);
// router.use(requireCSR);

// Campaign Wizard Steps
router.post('/scope', defineScope);
router.post('/templates', selectTemplates);
router.post('/pilot', configurePilot);
router.post('/budget', setBudget);
router.post('/approvals', requestApprovals);
router.post('/launch', launchCampaign);

// Campaign Resources
router.get('/templates', getTemplates);

// Campaign Monitoring
router.get('/monitoring/:campaignId', getMonitoringData);

// Campaign Reporting
router.get('/report/:campaignId/:reportType?', generateReport);

export default router;
