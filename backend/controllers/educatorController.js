// controllers/educatorController.js
import User from '../models/User.js';
import MoodLog from '../models/MoodLog.js';
import MissionProgress from '../models/MissionProgress.js';
import Feedback from "../models/Feedback.js";

// 📊 GET /api/educators/students
export const getMyStudents = async (req, res) => {
  try {
    const educator = await User.findById(req.user._id);
    if (!educator || educator.role !== 'educator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const students = await User.find({ educatorId: educator._id });
    res.status(200).json(students);
  } catch (err) {
    console.error('Failed to fetch students:', err);
    res.status(500).json({ error: 'Server error fetching students' });
  }
};

// 📈 GET /api/educators/student/:id/overview
export const getStudentOverview = async (req, res) => {
  const studentId = req.params.id;
  try {
    const moodLogs = await MoodLog.find({ userId: studentId });
    const progress = await MissionProgress.findOne({ userId: studentId });

    res.status(200).json({ moodLogs, progress });
  } catch (err) {
    console.error('Failed to fetch student overview:', err);
    res.status(500).json({ error: 'Error fetching student data' });
  }
};

// ✅ POST /api/educators/feedback/:id
export const submitFeedback = async (req, res, next) => {
  try {
    const educatorId = req.user._id;
    const studentId = req.params.id;
    const { feedback } = req.body;

    if (!feedback || !studentId) {
      throw new ErrorResponse("Missing required fields", 400);
    }

    const newFeedback = await Feedback.create({
      studentId,
      educatorId,
      feedback,
    });

    res.status(201).json({ message: "Feedback submitted", newFeedback });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/educators/feedback/:id
export const getStudentFeedback = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    const feedbacks = await Feedback.find({ studentId })
      .populate("educatorId", "name email") // to show who gave the feedback
      .sort({ createdAt: -1 });

    res.status(200).json(feedbacks);
  } catch (err) {
    next(err);
  }
};

