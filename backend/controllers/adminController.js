import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import MoodLog from "../models/MoodLog.js";
import MissionProgress from "../models/MissionProgress.js";
import FinancialMission from "../models/FinancialMission.js";
import { sendApprovalEmail } from "../utils/mailer.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

// 🔍 Get all pending stakeholders (parents, sellers, CSRs)
export const getPendingStakeholders = async (_req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["parent", "seller", "csr"] },
      approvalStatus: "pending",
    }).select("-password -otp -otpExpiresAt -otpType")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ message: "Pending stakeholders fetched", users });
  } catch (err) {
    console.error("Error fetching pending stakeholders:", err);
    res.status(500).json({ error: "Server error while fetching pending stakeholders" });
  }
};

// ✅ Approve any stakeholder (parent, seller, CSR)
export const approveStakeholder = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const stakeholder = await User.findById(id);
    if (!stakeholder || !["parent", "seller", "csr"].includes(stakeholder.role)) {
      return res.status(404).json({ error: "Stakeholder not found" });
    }

    if (stakeholder.approvalStatus === "approved") {
      return res.status(400).json({ message: `${stakeholder.role} already approved` });
    }

    stakeholder.approvalStatus = "approved";
    stakeholder.approvedBy = adminId;
    stakeholder.approvedAt = new Date();
    stakeholder.rejectedAt = null;
    stakeholder.rejectionReason = null;

    await stakeholder.save();
    
    // Send approval email
    try {
      await sendApprovalEmail(stakeholder.email, stakeholder.name, stakeholder.role);
    } catch (emailError) {
      console.error("Error sending approval email:", emailError);
      // Don't fail the approval if email fails
    }

    res.status(200).json({ 
      message: `${stakeholder.role.charAt(0).toUpperCase() + stakeholder.role.slice(1)} approved successfully`, 
      user: stakeholder 
    });
  } catch (err) {
    console.error("Error approving stakeholder:", err);
    res.status(500).json({ error: "Failed to approve stakeholder" });
  }
};

// ❌ Reject any stakeholder (parent, seller, CSR)
export const rejectStakeholder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const stakeholder = await User.findById(id);
    if (!stakeholder || !["parent", "seller", "csr"].includes(stakeholder.role)) {
      return res.status(404).json({ error: "Stakeholder not found" });
    }

    stakeholder.approvalStatus = "rejected";
    stakeholder.rejectedAt = new Date();
    stakeholder.rejectionReason = reason || "No reason provided";
    stakeholder.approvedBy = null;
    stakeholder.approvedAt = null;

    await stakeholder.save();

    res.status(200).json({ 
      message: `${stakeholder.role.charAt(0).toUpperCase() + stakeholder.role.slice(1)} rejected successfully`, 
      user: stakeholder 
    });
  } catch (err) {
    console.error("Error rejecting stakeholder:", err);
    res.status(500).json({ error: "Failed to reject stakeholder" });
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
    const redemptions = await Transaction.countDocuments({ type: "redeem" });

    res.status(200).json({
      totalUsers,
      totalStudents,
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