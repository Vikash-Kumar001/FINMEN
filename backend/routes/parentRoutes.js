import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireParent } from "../middlewares/requireAuth.js";
import ChildProgress from "../models/ChildProgress.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";

const router = express.Router();

// Middleware to ensure only parents can access these routes
router.use(requireAuth);
router.use(requireParent);

// Get child data for the parent
router.get("/child", async (req, res) => {
  try {
    const parent = req.user;
    
    if (!parent.childEmail) {
      return res.status(400).json({ message: "No child email linked to this parent account" });
    }
    
    // Find the child by email
    const child = await User.findOne({ 
      email: parent.childEmail,
      role: "student" 
    }).select("name email dob avatar level currentStreak");

    if (!child) {
      return res.status(404).json({ message: "Child not found with the linked email" });
    }

    // Get child's progress data
    const progress = await ChildProgress.findOne({ 
      parentId: parent._id, 
      childId: child._id 
    });
    
    // Get child's wallet data
    const wallet = await Wallet.findOne({ userId: child._id });
    
    // If no progress exists, create initial progress data
    if (!progress) {
      const newProgress = await ChildProgress.create({
        parentId: parent._id,
        childId: child._id,
        digitalTwin: {
          finance: { level: 1, progress: 0, weeklyGrowth: 0 },
          mentalWellness: { level: 1, progress: 0, weeklyGrowth: 0 },
          values: { level: 1, progress: 0, weeklyGrowth: 0 },
          ai: { level: 1, progress: 0, weeklyGrowth: 0 }
        },
        progressReport: {
          coinsEarned: 0,
          gamesCompleted: 0,
          timeSpent: 0,
          strengths: [],
          needsSupport: []
        },
        recentActivity: []
      });
    }

    const childData = {
      ...child.toObject(),
      progress: progress || {},
      totalCoins: wallet?.balance || 0,
      parentLinked: true
    };

    res.json(childData);
  } catch (error) {
    console.error("Error fetching child data:", error);
    res.status(500).json({ message: "Failed to fetch child data" });
  }
});

// Get detailed progress for a specific child
router.get("/child/:childId/progress", async (req, res) => {
  try {
    const { childId } = req.params;
    const parentId = req.user._id;

    // Verify the child belongs to this parent
    const child = await User.findOne({
      _id: childId,
      guardianEmail: req.user.email,
      role: "student"
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found or access denied" });
    }

    const progress = await ChildProgress.findOne({ parentId, childId });
    const wallet = await Wallet.findOne({ userId: childId });

    res.json({
      child: child.toObject(),
      progress: progress || {},
      wallet: wallet || { balance: 0 },
    });
  } catch (error) {
    console.error("Error fetching child progress:", error);
    res.status(500).json({ message: "Failed to fetch child progress" });
  }
});

// Generate and download progress report
router.post("/child/:childId/report", async (req, res) => {
  try {
    const { childId } = req.params;
    const { format = "pdf" } = req.body;
    const parentId = req.user._id;

    // Verify the child belongs to this parent
    const child = await User.findOne({
      _id: childId,
      guardianEmail: req.user.email,
      role: "student"
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found or access denied" });
    }

    const progress = await ChildProgress.findOne({ parentId, childId });
    
    // Generate report data
    const reportData = {
      child: child.toObject(),
      progress: progress || {},
      generatedAt: new Date(),
      format,
    };

    // Update the progress record with report generation info
    if (progress) {
      progress.weeklyReport = {
        generated: true,
        generatedAt: new Date(),
        reportData,
      };
      await progress.save();
    }

    res.json({
      message: "Report generated successfully",
      reportData,
      downloadUrl: `/api/parent/child/${childId}/download-report?format=${format}`,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
});

// Update notification preferences
router.put("/notifications", async (req, res) => {
  try {
    const { preferences } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      $set: { "preferences.notifications": preferences }
    });

    res.json({ message: "Notification preferences updated successfully" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ message: "Failed to update notification preferences" });
  }
});

export default router;