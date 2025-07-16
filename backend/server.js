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

// Load env variables
dotenv.config();

// Helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes
import authRoutes from "./routes/authRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import rewardsRoutes from "./routes/rewardsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import educatorRoutes from "./routes/educatorRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import adminRedemptionRoutes from "./routes/adminRedemptionRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

// Middleware
import { errorHandler } from "./middlewares/errorMiddleware.js";

// Cron
import { scheduleWeeklyReports } from "./cronJobs/reportScheduler.js";

// Models
import User from "./models/User.js";

// Express & server setup
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
app.set("io", io);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Socket.IO auth and events
io.on("connection", async (socket) => {
  console.log("🟢 New socket connected:", socket.id);

  try {
    const token = socket.handshake.auth?.token;

    if (!token) throw new Error("No token provided in socket auth");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) throw new Error("User not found");

    // Check educator approval
    if (user.role === "educator" && user.approvalStatus !== "approved") {
      console.log("🔒 Access denied: User not approved or not an educator");
      socket.disconnect();
      return;
    }

    // Join personal and role-specific rooms
    socket.join(user._id.toString());
    if (user.role === "admin") socket.join("admins");
    if (user.role === "educator") socket.join("educators");

    console.log(`👤 User ${user._id} (${user.role}) joined their room`);

    // Add socket event listeners if needed here...
    // Example: socket.on("custom:event", handler);

  } catch (err) {
    console.error("❌ Socket auth error:", err.message);
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
app.use("/api/educators", educatorRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin/redemptions", adminRedemptionRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/stats", statsRoutes);

// Health check
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

// Error handler
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  scheduleWeeklyReports();
});
