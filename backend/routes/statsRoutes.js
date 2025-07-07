import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getStudentStats, getXPLogs } from "../controllers/statsController.js";

const router = express.Router();

router.get("/student", requireAuth, getStudentStats);
router.get("/xp-logs", requireAuth, getXPLogs);

export default router;
