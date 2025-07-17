import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireApprovedEducator } from "../middlewares/requireApprovedEducator.js";
import { trackEducatorActivity } from "../middlewares/educatorActivityTracker.js";
import {
  getMyStudents,
  getStudentOverview,
  submitFeedback,
  getStudentFeedback,
  getStudentActivity,
} from "../controllers/educatorController.js";

const router = express.Router();

// 💬 Educator feedback route
router.post("/feedback/:id", requireAuth, requireApprovedEducator, trackEducatorActivity('feedback_provided'), submitFeedback);

router.get("/feedback/:id", requireAuth, getStudentFeedback);

// 🎓 Dashboard Access
router.get("/dashboard", requireAuth, requireApprovedEducator, (req, res) => {
  res.json({ message: "✅ Welcome, Educator!" });
});

// 📊 Get all students linked to the educator
router.get("/students", requireAuth, requireApprovedEducator, trackEducatorActivity('student_view'), getMyStudents);

// 📈 Get a single student's mood + financial progress
router.get("/student/:id/overview", requireAuth, requireApprovedEducator, trackEducatorActivity('student_view'), getStudentOverview);

// 📊 Get a student's detailed activity data
router.get("/student/:id/activity", requireAuth, requireApprovedEducator, trackEducatorActivity('analytics_view'), getStudentActivity);

export default router;
