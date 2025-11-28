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
import {
  getSubscriptionRenewalRequests,
  getSubscriptionRenewalRequestById,
  approveSubscriptionRenewal,
  rejectSubscriptionRenewal
} from '../controllers/subscriptionRenewalController.js';

const router = express.Router();

router.use(requireAuth);
router.use(checkAdmin);

router.get("/dashboard", getSchoolApprovalDashboard);
router.get("/pending", getPendingSchoolRegistrations);
router.get("/history", getSchoolApprovalHistory);
router.put('/:companyId/approve', approveSchoolRegistration);
router.put('/:companyId/reject', rejectSchoolRegistration);
router.put('/:companyId/update', updatePendingSchoolRegistration);

// Subscription renewal approval routes
router.get("/subscription-renewals", getSubscriptionRenewalRequests);
router.get("/subscription-renewals/:requestId", getSubscriptionRenewalRequestById);
router.put("/subscription-renewals/:requestId/approve", approveSubscriptionRenewal);
router.put("/subscription-renewals/:requestId/reject", rejectSubscriptionRenewal);

// Subscription expiration notification routes (admin only)
router.post("/subscription-expiration-notifications/trigger", async (req, res) => {
  const { triggerExpirationNotifications } = await import('../controllers/subscriptionExpirationNotificationController.js');
  return triggerExpirationNotifications(req, res);
});

export default router;

