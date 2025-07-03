import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import { sendApprovalEmail } from "../utils/mailer.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

// 👩‍🏫 Fetch all educators (approved + pending + rejected)
export const getAllEducators = async (_req, res) => {
  try {
    const educators = await User.find({ role: "educator" }).sort({ createdAt: -1 });
    res.status(200).json(educators);
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
      isApproved: false,
      isBlocked: { $ne: true },
    });
    res.status(200).json(educators);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching pending educators" });
  }
};

// ✅ Approve educator
export const approveEducator = async (req, res) => {
  try {
    const educator = await User.findById(req.params.id);
    if (!educator || educator.role !== "educator") {
      return res.status(404).json({ error: "Educator not found" });
    }

    educator.isApproved = true;
    educator.isBlocked = false;
    await educator.save();

    await sendApprovalEmail(educator.email, educator.name);

    res.status(200).json({ message: "Educator approved", educator });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve educator" });
  }
};

// ❌ Reject educator (soft block)
export const rejectEducator = async (req, res) => {
  try {
    const educator = await User.findById(req.params.id);
    if (!educator || educator.role !== "educator") {
      return res.status(404).json({ error: "Educator not found" });
    }

    educator.isBlocked = true;
    educator.isApproved = false;
    await educator.save();

    res.status(200).json({ message: "Educator rejected", educator });
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
    const totalEducators = await User.countDocuments({ role: "educator", isApproved: true });
    const pendingEducators = await User.countDocuments({ role: "educator", isApproved: false });
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
