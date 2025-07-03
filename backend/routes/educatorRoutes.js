import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireApprovedEducator } from "../middlewares/requireApprovedEducator.js";
import {
  getMyStudents,
  getStudentOverview,
  submitFeedback,
  getStudentFeedback,
} from "../controllers/educatorController.js";

const router = express.Router();

// 💬 Educator feedback route
router.post("/feedback/:id", requireAuth, requireApprovedEducator, submitFeedback);

router.get("/feedback/:id", requireAuth, getStudentFeedback);

// 🎓 Dashboard Access
router.get("/dashboard", requireAuth, requireApprovedEducator, (req, res) => {
  res.json({ message: "✅ Welcome, Educator!" });
});

// 📊 Get all students linked to the educator
router.get("/students", requireAuth, requireApprovedEducator, getMyStudents);

// 📈 Get a single student's mood + financial progress
router.get("/student/:id/overview", requireAuth, requireApprovedEducator, getStudentOverview);

export default router;
