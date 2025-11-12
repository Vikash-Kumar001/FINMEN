import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  addTextBox,
  updateTextBox,
  deleteTextBox,
  addShape,
  updateShape,
  deleteShape,
  addIcon,
  updateIcon,
  deleteIcon,
  addChart,
  updateChart,
  deleteChart,
  addTable,
  updateTable,
  deleteTable,
  addEquation,
  updateEquation,
  deleteEquation,
  addSymbol,
  updateSymbol,
  deleteSymbol,
  addSmartArt,
  updateSmartArt,
  deleteSmartArt,
  updateImage,
  processImage
} from '../controllers/slideElementController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Text Box routes
router.post('/:id/slides/:slideNumber/text-boxes', addTextBox);
router.put('/:id/slides/:slideNumber/text-boxes/:elementId', updateTextBox);
router.delete('/:id/slides/:slideNumber/text-boxes/:elementId', deleteTextBox);

// Shape routes
router.post('/:id/slides/:slideNumber/shapes', addShape);
router.put('/:id/slides/:slideNumber/shapes/:elementId', updateShape);
router.delete('/:id/slides/:slideNumber/shapes/:elementId', deleteShape);

// Icon routes
router.post('/:id/slides/:slideNumber/icons', addIcon);
router.put('/:id/slides/:slideNumber/icons/:elementId', updateIcon);
router.delete('/:id/slides/:slideNumber/icons/:elementId', deleteIcon);

// Chart routes
router.post('/:id/slides/:slideNumber/charts', addChart);
router.put('/:id/slides/:slideNumber/charts/:elementId', updateChart);
router.delete('/:id/slides/:slideNumber/charts/:elementId', deleteChart);

// Table routes
router.post('/:id/slides/:slideNumber/tables', addTable);
router.put('/:id/slides/:slideNumber/tables/:elementId', updateTable);
router.delete('/:id/slides/:slideNumber/tables/:elementId', deleteTable);

// Equation routes
router.post('/:id/slides/:slideNumber/equations', addEquation);
router.put('/:id/slides/:slideNumber/equations/:elementId', updateEquation);
router.delete('/:id/slides/:slideNumber/equations/:elementId', deleteEquation);

// Symbol routes
router.post('/:id/slides/:slideNumber/symbols', addSymbol);
router.put('/:id/slides/:slideNumber/symbols/:elementId', updateSymbol);
router.delete('/:id/slides/:slideNumber/symbols/:elementId', deleteSymbol);

// SmartArt routes
router.post('/:id/slides/:slideNumber/smart-art', addSmartArt);
router.put('/:id/slides/:slideNumber/smart-art/:elementId', updateSmartArt);
router.delete('/:id/slides/:slideNumber/smart-art/:elementId', deleteSmartArt);

// Image processing routes
router.put('/:id/slides/:slideNumber/images/:elementId', updateImage);
router.post('/:id/slides/:slideNumber/images/:elementId/process', processImage);

export default router;

