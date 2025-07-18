import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import MoodLog from "../models/MoodLog.js";
import MissionProgress from "../models/MissionProgress.js";
import FinancialMission from "../models/FinancialMission.js";
import { sendApprovalEmail } from "../utils/mailer.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

// 👩‍🏫 Fetch all educators (approved + pending + rejected)
export const getAllEducators = async (_req, res) => {
  try {
    const educators = await User.find({ role: "educator" })
      .select("-password -otp -otpExpiresAt -otpType")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "All educators fetched", educators });
  } catch (err) {
    console.error("Error fetching educators:", err);
    res.status(500).json({ error: "Failed to fetch educators" });
  }
};

// 🔍 Educators pending approval
export const getPendingEducators = async (_req, res) => {
  try {
    const educators = await User.find({
      role: "educator",
      approvalStatus: "pending",
    }).select("-password -otp -otpExpiresAt -otpType");
    res.status(200).json({ message: "Pending educators fetched", educators });
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching pending educators" });
  }
};

// ✅ Approve educator
export const approveEducator = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const educator = await User.findById(id);
    if (!educator || educator.role !== "educator") {
      return res.status(404).json({ error: "Educator not found" });
    }

    if (educator.approvalStatus === "approved") {
      return res.status(400).json({ message: "Educator already approved" });
    }

    educator.approvalStatus = "approved";
    educator.approvedBy = adminId;
    educator.approvedAt = new Date();
    educator.rejectedAt = null;
    educator.rejectionReason = null;

    await educator.save();
    await sendApprovalEmail(educator.email, educator.name);

    res.status(200).json({ message: "Educator approved successfully", educator });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve educator" });
  }
};

// ❌ Reject educator
export const rejectEducator = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const educator = await User.findById(id);
    if (!educator || educator.role !== "educator") {
      return res.status(404).json({ error: "Educator not found" });
    }

    educator.approvalStatus = "rejected";
    educator.rejectedAt = new Date();
    educator.rejectionReason = reason || "No reason provided";
    educator.approvedBy = null;
    educator.approvedAt = null;

    await educator.save();

    res.status(200).json({ message: "Educator rejected successfully", educator });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject educator" });
  }
};

// 👩‍🎓 Get all students
export const getAllStudents = async (_req, res) => {
  try {
    const students = await User.find({ role: "student" }).sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// 💰 Get all pending redemption requests
export const getRedemptionRequests = async (_req, res) => {
  try {
    const requests = await Transaction.find({ type: "redeem", status: "pending" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch redemption requests" });
  }
};

// ✅ Approve a redemption request
export const approveRedemption = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn || txn.type !== "redeem" || txn.status !== "pending") {
      throw new ErrorResponse("Invalid redemption request", 400);
    }

    txn.status = "approved";
    await txn.save();

    res.status(200).json({ message: "Redemption approved", txn });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to approve redemption" });
  }
};

// ❌ Reject redemption request and refund coins
export const rejectRedemption = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn || txn.type !== "redeem" || txn.status !== "pending") {
      throw new ErrorResponse("Invalid redemption request", 400);
    }

    const wallet = await Wallet.findOne({ userId: txn.userId });
    if (!wallet) throw new ErrorResponse("Wallet not found", 404);

    wallet.balance += txn.amount;
    await wallet.save();

    txn.status = "rejected";
    txn.description += " (Rejected & refunded)";
    await txn.save();

    res.status(200).json({ message: "Redemption rejected and refunded", txn });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to reject redemption" });
  }
};

// 🏆 Leaderboard - Top users by HealCoins
export const getLeaderboard = async (_req, res) => {
  try {
    const topUsers = await Wallet.find()
      .sort({ balance: -1 })
      .limit(10)
      .populate("userId", "name email");

    const leaderboard = topUsers.map((entry) => ({
      name: entry.userId?.name,
      email: entry.userId?.email,
      balance: entry.balance,
    }));

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

// 📊 Platform-wide statistics for dashboard overview
export const getAdminStats = async (_req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalEducators = await User.countDocuments({ role: "educator" });
    const pendingEducators = await User.countDocuments({ role: "educator", approvalStatus: "pending" });
    const redemptions = await Transaction.countDocuments({ type: "redeem" });

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalEducators,
      pendingEducators,
      redemptions,
    });
  } catch (err) {
    next(err);
  }
};

// 📊 Analytics data for AdminAnalytics
export const getAnalytics = async (req, res) => {
  try {
    const { timeRange, userType, department } = req.query;

    // Base query for time range
    const timeFilter = {};
    if (timeRange !== "all") {
      const now = new Date();
      if (timeRange === "day") {
        timeFilter.date = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
      } else if (timeRange === "week") {
        timeFilter.date = { $gte: new Date(now.setDate(now.getDate() - 7)) };
      } else if (timeRange === "month") {
        timeFilter.date = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
      }
    }

    // User counts
    const userQuery = userType !== "all" ? { role: userType } : {};
    const totalUsers = await User.countDocuments(userQuery);
    const totalStudents = await User.countDocuments({ ...userQuery, role: "student" });
    const totalEducators = await User.countDocuments({ ...userQuery, role: "educator" });

    // Mood stats
    const moodQuery = { ...timeFilter };
    if (department !== "all") {
      moodQuery["user.department"] = department;
    }
    const moodStats = await MoodLog.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { ...moodQuery, ...(userType !== "all" ? { "user.role": userType } : {}) } },
      { $group: { _id: "$emoji", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Mission stats
    const missionQuery = {};
    if (timeRange !== "all") {
      const now = new Date();
      if (timeRange === "day") {
        missionQuery["completedMissions.completedAt"] = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
      } else if (timeRange === "week") {
        missionQuery["completedMissions.completedAt"] = { $gte: new Date(now.setDate(now.getDate() - 7)) };
      } else if (timeRange === "month") {
        missionQuery["completedMissions.completedAt"] = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
      }
    }
    const missionStats = await MissionProgress.aggregate([
      { $unwind: "$completedMissions" },
      {
        $lookup: {
          from: "financialmissions",
          localField: "completedMissions.missionId",
          foreignField: "_id",
          as: "mission",
        },
      },
      { $unwind: "$mission" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          ...missionQuery,
          ...(userType !== "all" ? { "mission.userRole": userType } : {}),
          ...(department !== "all" ? { "mission.department": department } : {}),
        },
      },
      { $group: { _id: "$completedMissions.level", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Department stats
    const departmentQuery = department !== "all" ? { department } : {};
    const departmentStats = await User.aggregate([
      { $match: { ...departmentQuery, ...userQuery } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Total moods
    const totalMoods = await MoodLog.countDocuments(moodQuery);

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalEducators,
      totalMoods,
      moodStats,
      missionStats,
      departmentStats,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
};