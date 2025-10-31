import express from 'express';
import { requireAuth, requireCSR } from '../middlewares/requireAuth.js';
import {
  getCobrandingPartnerships,
  getCobrandingPartnership,
  createCobrandingPartnership,
  updateCobrandingPartnership,
  updateContractStatus,
  addCommunicationLog,
  addBrandAsset,
  addLegalDocument,
  associateCampaign,
  getExpiringContracts,
  getComplianceDashboard,
  deleteCobrandingPartnership
} from '../controllers/cobrandingLegalController.js';

const router = express.Router();

// Middleware to ensure only CSR users can access these routes
router.use(requireAuth);
router.use(requireCSR);

// Co-branding partnership management
router.get('/cobranding/partnerships', getCobrandingPartnerships);
router.get('/cobranding/partnerships/:partnershipId', getCobrandingPartnership);
router.post('/cobranding/partnerships', createCobrandingPartnership);
router.put('/cobranding/partnerships/:partnershipId', updateCobrandingPartnership);
router.delete('/cobranding/partnerships/:partnershipId', deleteCobrandingPartnership);

// Contract management
router.put('/cobranding/partnerships/:partnershipId/contract-status', updateContractStatus);
router.get('/cobranding/expiring-contracts', getExpiringContracts);

// Communication management
router.post('/cobranding/partnerships/:partnershipId/communication', addCommunicationLog);

// Brand asset management
router.post('/cobranding/partnerships/:partnershipId/assets', addBrandAsset);

// Legal document management
router.post('/cobranding/partnerships/:partnershipId/legal-documents', addLegalDocument);

// Campaign association
router.post('/cobranding/partnerships/:partnershipId/associate-campaign', associateCampaign);

// Compliance and dashboard
router.get('/cobranding/compliance-dashboard', getComplianceDashboard);

export default router;
