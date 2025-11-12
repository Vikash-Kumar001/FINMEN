import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '../controllers/presentationTemplateController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all templates
router.get('/', getTemplates);

// Get single template
router.get('/:id', getTemplate);

// Create template
router.post('/', createTemplate);

// Update template
router.put('/:id', updateTemplate);

// Delete template
router.delete('/:id', deleteTemplate);

export default router;

