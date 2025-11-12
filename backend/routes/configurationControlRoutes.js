import express from 'express';
import {
  getFeatureFlags,
  getFeatureFlagById,
  createFeatureFlag,
  updateFeatureFlag,
  toggleFeatureFlag,
  updateRolloutPercentage,
  updateRegionalOverride,
  addExperiment,
  updateBetaAccess,
  getConfigurationStats,
  checkFeatureEnabled
} from '../controllers/configurationControlController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// Public route for checking feature status (for client-side)
router.get('/check/:flagKey', checkFeatureEnabled);

// All other routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Get configuration statistics
router.get('/stats', getConfigurationStats);

// Get all feature flags
router.get('/', getFeatureFlags);

// Create feature flag
router.post('/', createFeatureFlag);

// Get feature flag by ID or key
router.get('/:flagId', getFeatureFlagById);

// Update feature flag
router.put('/:flagId', updateFeatureFlag);

// Toggle feature flag
router.post('/:flagId/toggle', toggleFeatureFlag);

// Update rollout percentage
router.put('/:flagId/rollout', updateRolloutPercentage);

// Update regional override
router.put('/:flagId/regional/:region', updateRegionalOverride);

// Add experiment
router.post('/:flagId/experiment', addExperiment);

// Update beta access
router.put('/:flagId/beta', updateBetaAccess);

export default router;

