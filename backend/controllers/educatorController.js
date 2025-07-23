// controllers/educatorController.js
import User from '../models/User.js';
import MoodLog from '../models/MoodLog.js';
import MissionProgress from '../models/MissionProgress.js';
import Feedback from "../models/Feedback.js";
import XPLog from '../models/XPLog.js';
import Journal from '../models/Journal.js';

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
    // Get student basic info
    const student = await User.findById(studentId).select('-password -otp -otpExpiresAt');
    
    // Get mood tracking data
    const moodLogs = await MoodLog.find({ userId: studentId }).sort({ date: -1 }).limit(10);
    
    // Get XP and activity data
    const xpLogs = await XPLog.find({ userId: studentId }).sort({ date: -1 }).limit(20);
    const totalXp = xpLogs.reduce((sum, log) => sum + log.xp, 0);
    const level = Math.floor(totalXp / 100) + 1;
    
    // Get mission/progress data
    const progress = await MissionProgress.findOne({ userId: studentId });
    
    // Get journal entries (without content for privacy)
    const journalCount = await Journal.countDocuments({ userId: studentId });
    const lastJournalDate = await Journal.findOne({ userId: studentId }).sort({ date: -1 }).select('date');
    
    // Calculate activity metrics
    const activityBreakdown = xpLogs.reduce((acc, log) => {
      acc[log.reason] = (acc[log.reason] || 0) + 1;
      return acc;
    }, {});
    
    // Get recent feedback
    const recentFeedback = await Feedback.find({ studentId })
      .populate("educatorId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({ 
      student,
      moodLogs, 
      progress,
      stats: {
        totalXp,
        level,
        journalCount,
        lastJournalDate: lastJournalDate?.date,
        activityBreakdown
      },
      recentFeedback,
      recentActivities: xpLogs.map(log => ({
        type: log.reason,
        xp: log.xp,
        date: log.date
      }))
    });
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

// 📊 GET /api/educators/student/:id/activity
export const getStudentActivity = async (req, res) => {
  const studentId = req.params.id;
  const { period = 'week' } = req.query; // 'day', 'week', 'month', 'year'
  
  try {
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch(period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7)); // Default to week
    }
    
    // Get mood logs for the period
    const moodLogs = await MoodLog.find({
      userId: studentId,
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    // Get XP logs for the period
    const xpLogs = await XPLog.find({
      userId: studentId,
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    // Get journal entries for the period (count only, not content)
    const journalEntries = await Journal.find({
      userId: studentId,
      date: { $gte: startDate }
    }).select('date').sort({ date: 1 });
    
    // Process data for visualization
    const moodData = processMoodData(moodLogs, period);
    const activityData = processActivityData(xpLogs, period);
    const journalData = processJournalData(journalEntries, period);
    
    res.status(200).json({
      moodData,
      activityData,
      journalData,
      summary: {
        totalMoodCheckins: moodLogs.length,
        totalXpEarned: xpLogs.reduce((sum, log) => sum + log.xp, 0),
        totalJournalEntries: journalEntries.length,
        activityBreakdown: xpLogs.reduce((acc, log) => {
          acc[log.reason] = (acc[log.reason] || 0) + log.xp;
          return acc;
        }, {})
      }
    });
  } catch (err) {
    console.error('Failed to fetch student activity:', err);
    res.status(500).json({ error: 'Error fetching student activity data' });
  }
};

// Helper functions for data processing
function processMoodData(moodLogs, period) {
  // Group mood data by day/week/etc. for visualization
  return moodLogs.map(log => ({
    date: log.date,
    emoji: log.emoji
  }));
}

function processActivityData(xpLogs, period) {
  // Group XP data by day/week/etc. for visualization
  return xpLogs.map(log => ({
    date: log.date,
    xp: log.xp,
    type: log.reason
  }));
}

function processJournalData(journalEntries, period) {
  // Group journal data by day/week/etc. for visualization
  return journalEntries.map(entry => ({
    date: entry.date
  }));
}

