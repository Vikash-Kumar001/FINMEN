import express from "express";
import {
  getRedemptionRequests,
  approveRedemption,
  rejectRedemption,
} from "../controllers/adminController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { checkAdmin } from "../middlewares/checkRole.js";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.use(requireAuth);
router.use(checkAdmin); // ✅ Only admins

router.get("/pending-redemptions", getRedemptionRequests);
router.post("/approve/:id", approveRedemption);
router.post("/reject/:id", rejectRedemption);

export default router;
