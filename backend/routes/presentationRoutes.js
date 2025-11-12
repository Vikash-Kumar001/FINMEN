import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import {
  createPresentation,
  getMyPresentations,
  getSharedPresentations,
  getPresentation,
  getPresentationByShareCode,
  updatePresentation,
  addSlide,
  updateSlide,
  deleteSlide,
  deletePresentation,
  sharePresentation,
  startPresentation,
  updateCurrentSlide,
  stopPresentation,
  uploadImage,
  reorderSlides,
  duplicateSlide,
  updatePresentationMetadata,
  upload
} from '../controllers/presentationController.js';

const router = express.Router();

// Public route - get by share code (no auth required)
router.get('/share/:shareCode', getPresentationByShareCode);

// All other routes require authentication
router.use(requireAuth);

// CRUD operations
router.post('/', createPresentation);
router.get('/my-presentations', getMyPresentations);
router.get('/shared', getSharedPresentations);
router.get('/:id', getPresentation);
router.put('/:id', updatePresentation);
router.delete('/:id', deletePresentation);

// Slide operations
router.post('/:id/slides', addSlide);
router.put('/:id/slides/:slideNumber', updateSlide);
router.delete('/:id/slides/:slideNumber', deleteSlide);

// Sharing
router.post('/:id/share', sharePresentation);

// Real-time presentation control
router.post('/:id/start', startPresentation);
router.put('/:id/slide', updateCurrentSlide);
router.post('/:id/stop', stopPresentation);

// Image upload
router.post('/:id/upload-image', requireAuth, upload.single('image'), (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  next();
}, uploadImage);

// Slide management
router.post('/:id/reorder-slides', reorderSlides);
router.post('/:id/slides/:slideNumber/duplicate', duplicateSlide);

// Update presentation metadata (numbering, headers, footers, master slides)
router.put('/:id/metadata', updatePresentationMetadata);

export default router;

