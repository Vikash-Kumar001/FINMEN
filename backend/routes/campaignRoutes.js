import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  updateCampaignStage,
  approveCampaign,
  deleteCampaign,
  getCampaignTemplates,
  getCampaignMetrics
} from '../controllers/campaignController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
router.use(requireAuth);
router.use(requireCSR);

// Campaign CRUD operations
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:campaignId', getCampaign);
router.post('/campaigns', createCampaign);
router.put('/campaigns/:campaignId', updateCampaign);
router.delete('/campaigns/:campaignId', deleteCampaign);

// Campaign workflow management
router.put('/campaigns/:campaignId/stage', updateCampaignStage);
router.put('/campaigns/:campaignId/approve', approveCampaign);

// Campaign resources
router.get('/campaigns/templates', getCampaignTemplates);
router.get('/campaigns/:campaignId/metrics', getCampaignMetrics);

export default router;
