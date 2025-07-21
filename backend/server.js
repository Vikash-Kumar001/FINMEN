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

// Parse allowed origins (comma-separated string)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map(origin => origin.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

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
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl)
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
import adminEducatorRoutes from "./routes/adminEducatorRoutes.js";
import educatorRoutes from "./routes/educatorRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import adminRedemptionRoutes from "./routes/adminRedemptionRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

// Import models and other logic
import User from "./models/User.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { scheduleWeeklyReports } from "./cronJobs/reportScheduler.js";

// Socket Handlers
import { setupAdminEducatorSocket } from "./socketHandlers/adminEducatorSocket.js";
import { setupWalletSocket } from "./socketHandlers/walletSocket.js";
import { setupStudentSocket } from "./socketHandlers/studentSocket.js";
import { setupStatsSocket } from "./socketHandlers/statsSocket.js";
import { setupFeedbackSocket } from "./socketHandlers/feedbackSocket.js";
import { setupGameSocket } from "./socketHandlers/gameSocket.js";
import { setupAdminPanelSocket } from "./socketHandlers/adminPanelSocket.js";
import { setupJournalSocket } from "./socketHandlers/journalSocket.js";
import { setupChatSocket } from "./socketHandlers/chatSocket.js";
import { setupEducatorSocket } from "./socketHandlers/educatorSocket.js";
import { setupStudentRedemptionSocket } from "./socketHandlers/studentRedemptionSocket.js";

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

    if (user.role === "educator" && user.approvalStatus !== "approved") {
      socket.emit("error", { message: "Access denied: Not approved" });
      return socket.disconnect();
    }

    socket.join(user._id.toString());
    if (user.role === "admin") {
      socket.join("admins");
      socket.join("admin-room");
    }
    if (user.role === "educator") {
      socket.join("educators");
      socket.join(`educator-${user._id}`);
    }

    console.log(`👤 User ${user._id} (${user.role}) joined their room`);

    if (user.role === "admin") {
      setupAdminEducatorSocket(io, socket, user);
      setupStudentSocket(io, socket, user);
      setupStatsSocket(io, socket, user);
      setupAdminPanelSocket(io, socket, user);
      setupEducatorSocket(io, socket, user);
    }

    setupWalletSocket(io, socket, user);
    setupFeedbackSocket(io, socket, user);
    setupGameSocket(io, socket, user);
    setupJournalSocket(io, socket, user);
    setupChatSocket(io, socket, user);
    setupStudentRedemptionSocket(io, socket, user);

    if (user.role === "educator") {
      await User.findByIdAndUpdate(user._id, { lastActive: new Date() });
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/educators", adminEducatorRoutes);
app.use("/api/educators", educatorRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin/redemptions", adminRedemptionRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/activities", activityRoutes);

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
});
