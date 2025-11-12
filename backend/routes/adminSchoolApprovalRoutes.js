import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { checkAdmin } from "../middlewares/checkRole.js";
import {
  getSchoolApprovalDashboard,
  getPendingSchoolRegistrations,
  getSchoolApprovalHistory,
  approveSchoolRegistration,
  rejectSchoolRegistration,
  updatePendingSchoolRegistration
} from '../controllers/companyController.js'; // Reusing companyController for school-specific logic

const router = express.Router();

router.use(requireAuth);
router.use(checkAdmin);

router.get("/dashboard", getSchoolApprovalDashboard);
router.get("/pending", getPendingSchoolRegistrations);
router.get("/history", getSchoolApprovalHistory);
router.put('/:companyId/approve', approveSchoolRegistration);
router.put('/:companyId/reject', rejectSchoolRegistration);
router.put('/:companyId/update', updatePendingSchoolRegistration);

export default router;

