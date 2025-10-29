import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Get current file details (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Allowed origins for CORS
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map(origin => origin.trim())
  : [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://finmen.vercel.app"
    ];

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
app.set("io", io);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Add security headers to fix Cross-Origin-Opener-Policy issues
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS: " + origin), false);
      }
    },
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Import all routes
import authRoutes from "./routes/authRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import rewardsRoutes from "./routes/rewardsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import adminRedemptionRoutes from "./routes/adminRedemptionRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import activityRoutes from './routes/activityRoutes.js';
import userProgressRoutes from './routes/userProgressRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import csrRoutes from "./routes/csrRoutes.js";
import csrKPIRoutes from "./routes/csrKPIRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import budgetTransactionRoutes from "./routes/budgetTransactionRoutes.js";
import impactReportRoutes from "./routes/impactReportRoutes.js";
import cobrandingLegalRoutes from "./routes/cobrandingLegalRoutes.js";
import campaignWizardRoutes from "./routes/campaignWizardRoutes.js";
import csrPaymentRoutes from "./routes/csrPaymentRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import csrReportRoutes from "./routes/csrReportRoutes.js";
import campaignApprovalRoutes from "./routes/campaignApprovalRoutes.js";
import budgetTrackingRoutes from "./routes/budgetTrackingRoutes.js";
import csrOverviewRoutes from "./routes/csrOverviewRoutes.js";
import avatarRoutes from "./routes/avatarRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import assignmentAttemptRoutes from "./routes/assignmentAttemptRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Multi-tenant routes
import companyRoutes from "./routes/companyRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import globalStatsRoutes from "./routes/globalStatsRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";

// Import models and other logic
import User from "./models/User.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { scheduleWeeklyReports } from "./cronJobs/reportScheduler.js";
import { startNotificationTTL } from "./cronJobs/notificationTTL.js";

// Socket Handlers
import { setupWalletSocket } from "./socketHandlers/walletSocket.js";
import { setupStudentSocket } from "./socketHandlers/studentSocket.js";
import { setupStatsSocket } from "./socketHandlers/statsSocket.js";
import { setupFeedbackSocket } from "./socketHandlers/feedbackSocket.js";
import { setupGameSocket } from "./socketHandlers/gameSocket.js";
import { setupJournalSocket } from "./socketHandlers/journalSocket.js";
import { setupChatSocket } from "./socketHandlers/chatSocket.js";
import { setupCSROverviewSocket } from "./socketHandlers/csrOverviewSocket.js";

// Socket.IO Authentication and Events
io.on("connection", async (socket) => {
  console.log("🟢 New socket connected:", socket.id);

  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      socket.emit("error", { message: "Authentication required" });
      return socket.disconnect();
    }

    if (typeof token !== "string" || !token.includes(".") || token.split(".").length !== 3) {
      socket.emit("error", { message: "Invalid token format" });
      return socket.disconnect();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      socket.emit("error", { message: "Invalid or expired token" });
      return socket.disconnect();
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      socket.emit("error", { message: "User not found" });
      return socket.disconnect();
    }


    socket.join(user._id.toString());
    if (user.role === "admin") {
      socket.join("admins");
      socket.join("admin-room");
    }

    console.log(`👤 User ${user._id} (${user.role}) joined their room`);

    if (user.role === "admin") {
      setupStudentSocket(io, socket, user);
      setupStatsSocket(io, socket, user);
    }

    setupWalletSocket(io, socket, user);
    setupFeedbackSocket(io, socket, user);
    setupGameSocket(io, socket, user);
    setupJournalSocket(io, socket, user);
    setupChatSocket(io, socket, user);
    
    // Setup CSR-specific sockets
    if (user.role === "csr") {
      setupCSROverviewSocket(io, socket, user);
    }

  } catch (err) {
    console.error("❌ Socket auth error:", err.message);
    socket.emit("error", { message: "Authentication error" });
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// Serve uploads statically
app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));

// Legacy Routes (maintain backward compatibility)
app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);

// Multi-tenant Routes
app.use("/api/company", companyRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/global", globalStatsRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin/redemptions", adminRedemptionRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/student", studentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/progress', userProgressRoutes);
app.use('/api/user', userRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/csr', csrRoutes);
app.use('/api/csr-kpis', csrKPIRoutes);
app.use('/api/csr', campaignRoutes);
app.use('/api/budget', budgetTransactionRoutes);
app.use('/api/csr', impactReportRoutes);
app.use('/api/csr', cobrandingLegalRoutes);
app.use('/api/campaign-wizard', campaignWizardRoutes);
app.use('/api/csr-financial', csrPaymentRoutes);
app.use('/api/csr-financial', invoiceRoutes);
app.use('/api/csr-reports', csrReportRoutes);
app.use('/api/campaign-approvals', campaignApprovalRoutes);
app.use('/api/budget-tracking', budgetTrackingRoutes);
app.use('/api/csr-overview', csrOverviewRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/assignment-attempts', assignmentAttemptRoutes);
app.use('/api/chat', chatRoutes);

// Health Check
app.get("/", (_, res) => {
  res.send("🌱 FINMEN API is running...");
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(clientPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Global error handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  scheduleWeeklyReports();
  // Start real-time notification TTL cleanup (15 days)
  const ttlSeconds = parseInt(process.env.NOTIFICATION_TTL_SECONDS || "1296000", 10);
  startNotificationTTL(io, { ttlSeconds, intervalSeconds: 3600 });
});

export default app;