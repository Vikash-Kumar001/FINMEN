import express from 'express';
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  assignIncident,
  resolveIncident,
  createPrivacyIncidentManual,
  getIncidentStats,
  getIncidentManagementURLRoute
} from '../controllers/incidentController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Incident endpoints
router.get('/', getIncidents);
router.get('/stats', getIncidentStats);
router.get('/:incidentId', getIncidentById);
router.post('/', createIncident);
router.put('/:incidentId', updateIncident);
router.put('/:incidentId/assign', assignIncident);
router.put('/:incidentId/resolve', resolveIncident);
router.post('/privacy', createPrivacyIncidentManual);
router.get('/url/:ticketNumber', getIncidentManagementURLRoute);

export default router;

