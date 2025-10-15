import express from "express";
import {
  getAllStudents,
  getRedemptionRequests,
  approveRedemption,
  rejectRedemption,
  getLeaderboard,
  getAdminStats,
  getAnalytics,
  getPendingStakeholders,
  approveStakeholder,
  rejectStakeholder,
} from "../controllers/adminController.js";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth.js";
import { registerByAdmin } from "../controllers/authController.js";

const router = express.Router();

// 🔒 Protect all admin routes
router.use(requireAuth, requireAdmin);

// 📊 Admin Dashboard Statistics
router.get("/stats", getAdminStats);

// 📊 Analytics Data for AdminAnalytics
router.get("/analytics", getAnalytics);


// 👥 All Stakeholder Management (Parents, Sellers, CSRs)
router.get("/pending-approvals", getPendingStakeholders);
router.put("/approve-stakeholder/:id", approveStakeholder);
router.put("/reject-stakeholder/:id", rejectStakeholder);

// 👨‍🎓 Student Management
router.get("/students", getAllStudents);

// 🏆 Leaderboard
router.get("/leaderboard", getLeaderboard);

// 💸 Redemptions
router.get("/redemptions", getRedemptionRequests);
router.put("/redemptions/approve/:id", approveRedemption);
router.put("/redemptions/reject/:id", rejectRedemption);

// ➕ Admin Creates Admin
router.post("/create-user", registerByAdmin);

export default router;