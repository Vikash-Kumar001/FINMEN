import express from 'express';
import {
  createJobOpening,
  deleteJobOpening,
  getAdminJobOpenings,
  reorderJobOpenings,
  updateJobOpening,
} from '../controllers/jobOpeningController.js';
import { getJobApplications, streamJobApplications, updateJobApplicationStatus } from '../controllers/jobApplicationController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

router.use(requireAuth);
router.use(checkAdmin);

router.get('/', getAdminJobOpenings);
router.post('/', createJobOpening);
router.put('/:jobId', updateJobOpening);
router.delete('/:jobId', deleteJobOpening);
router.post('/reorder', reorderJobOpenings);
router.get('/applications', getJobApplications);
router.get('/applications/stream', streamJobApplications);
router.put('/applications/:applicationId', updateJobApplicationStatus);

export default router;

