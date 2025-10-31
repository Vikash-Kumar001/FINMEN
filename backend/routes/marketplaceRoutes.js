import express from 'express';
import {
  getMarketplaceModules,
  getCatalogModules,
  getModuleById,
  createModule,
  approveModule,
  rejectModule,
  updateModule,
  validateAnonymizedExportEndpoint,
  generateAnonymizedExportEndpoint,
  getMarketplaceStats
} from '../controllers/marketplaceController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// Public catalog routes
router.get('/catalog', getCatalogModules);
router.get('/catalog/:moduleId', getModuleById);

// Admin-only routes
router.use(requireAuth);
router.use(checkAdmin);

router.get('/', getMarketplaceModules);
router.get('/stats', getMarketplaceStats);
router.post('/', createModule);
router.get('/:moduleId', getModuleById);
router.put('/:moduleId', updateModule);
router.put('/:moduleId/approve', approveModule);
router.put('/:moduleId/reject', rejectModule);
router.post('/validate-export', validateAnonymizedExportEndpoint);
router.post('/generate-export', generateAnonymizedExportEndpoint);

export default router;

