import express from 'express';
import {
  getPredictions,
  predictSchoolRisk,
  predictRenewal,
  detectCheatingInExam,
  identifyTeacherTraining,
  forecastOperationalWorkload,
  getPredictionStats
} from '../controllers/predictiveModelsController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Statistics
router.get('/stats', getPredictionStats);

// Get all predictions
router.get('/', getPredictions);

// School performance risk
router.post('/school/:organizationId/risk', predictSchoolRisk);

// Subscription renewal
router.post('/organization/:organizationId/renewal', predictRenewal);

// Cheating detection
router.post('/exam/:examId/student/:studentId/cheating', detectCheatingInExam);

// Training needs
router.post('/teacher/:teacherId/training', identifyTeacherTraining);

// Workload forecast
router.post('/workload/forecast', forecastOperationalWorkload);
router.post('/workload/forecast/:organizationId', forecastOperationalWorkload);

export default router;

