import express from 'express';
import {
  getNetworkMapData,
  createBenchmarkAnalysis,
  getBenchmarks,
  getPlatformTelemetryData,
  recordTelemetryData,
  createSchoolOnboarding,
  getSchoolOnboardings,
  updateSchoolOnboarding,
  startTrialPeriod,
  createDataExportRequest,
  getDataExports,
  getPolicyLegalStats,
  getPolicyLegalRequests,
  createPolicyLegalRequest
} from '../controllers/adminPlatformController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Network Map
router.get('/network-map', getNetworkMapData);

// Benchmarks
router.get('/benchmarks', getBenchmarks);
router.post('/benchmarks', createBenchmarkAnalysis);

// Platform Telemetry
router.get('/telemetry', getPlatformTelemetryData);
router.post('/telemetry', recordTelemetryData);

// School Onboarding
router.get('/onboarding', getSchoolOnboardings);
router.post('/onboarding', createSchoolOnboarding);
router.put('/onboarding/:onboardingId', updateSchoolOnboarding);
router.post('/onboarding/:onboardingId/trial', startTrialPeriod);

// Data Export
router.get('/data-export', getDataExports);
router.post('/data-export', createDataExportRequest);

// Policy & Legal
router.get('/policy-legal/stats', getPolicyLegalStats);
router.get('/policy-legal/requests', getPolicyLegalRequests);
router.post('/policy-legal/requests', createPolicyLegalRequest);

export default router;

