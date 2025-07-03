import express from "express";
import {
  getAllEducators,
  getPendingEducators,
  approveEducator,
  rejectEducator,
  getAllStudents,
  getRedemptionRequests,
  approveRedemption,
  rejectRedemption,
  getAdminStats,
  getLeaderboard,
} from "../controllers/adminController.js";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth.js";

const router = express.Router();

// 🔒 Protect all admin routes
router.use(requireAuth, requireAdmin);
router.get("/stats", getAdminStats);

// 👩‍🏫 Educator Management
router.get("/educators", getAllEducators);                    // All educators
router.get("/educators/pending", getPendingEducators);        // Only pending ones
router.put("/educators/approve/:id", approveEducator);        // Approve by ID
router.put("/educators/reject/:id", rejectEducator);          // Reject by ID

// 👨‍🎓 Student Listing
router.get("/students", getAllStudents);

// 💸 Wallet Redemptions
router.get("/redemptions", getRedemptionRequests);            // All pending redemptions
router.put("/redemptions/approve/:id", approveRedemption);    // Approve redemption
router.put("/redemptions/reject/:id", rejectRedemption);      // Reject + refund redemption

router.get("/leaderboard", requireAdmin, getLeaderboard);

export default router;
