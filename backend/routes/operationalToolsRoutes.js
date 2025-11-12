import express from 'express';
import {
  getCalendarEvents,
  createCalendarEvent,
  getTransportVehicles,
  createTransportVehicle,
  updateTransportLocation,
  getAssets,
  createAsset,
  getDocuments,
  createDocument,
  getOperationalStats
} from '../controllers/operationalToolsController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Statistics
router.get('/stats', getOperationalStats);

// Calendar Events
router.get('/calendar', getCalendarEvents);
router.post('/calendar', createCalendarEvent);

// Transport
router.get('/transport', getTransportVehicles);
router.post('/transport', createTransportVehicle);
router.put('/transport/:vehicleId/location', updateTransportLocation);

// Assets
router.get('/assets', getAssets);
router.post('/assets', createAsset);

// Documents
router.get('/documents', getDocuments);
router.post('/documents', createDocument);

export default router;

