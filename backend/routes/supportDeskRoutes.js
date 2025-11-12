import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  routeTicket,
  getTicketStats,
  getTicketSuggestions
} from '../controllers/supportDeskController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Get all tickets with filters
router.get('/', getTickets);

// Get ticket statistics
router.get('/stats', getTicketStats);

// Get ticket by ID
router.get('/:ticketId', getTicketById);

// Create new ticket
router.post('/', createTicket);

// Update ticket
router.put('/:ticketId', updateTicket);

// Auto-route ticket
router.post('/:ticketId/route', routeTicket);

// Get AI suggestions for ticket
router.get('/:ticketId/suggestions', getTicketSuggestions);

export default router;

