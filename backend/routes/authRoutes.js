import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  googleLogin,
  registerByAdmin,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPasswordWithOTP,
  checkVerificationStatus,
} from "../controllers/authController.js";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

// ✅ Student Self-Registration
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name || normalizedEmail,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      isVerified: false,
    });

    await sendOTP(newUser.email, "verify");

    res.status(200).json({
      message: "OTP sent to email for verification",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ✅ Setup First Admin (one-time setup)
router.post("/setup-admin", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists. Use /admin-register for additional admins.",
      });
    }

    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name: name || normalizedEmail,
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    const token = generateToken(newAdmin._id);

    res
      .cookie("finmen_token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "First admin created successfully",
        user: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
  } catch (err) {
    console.error("Admin setup error:", err);
    res.status(500).json({ message: "Admin setup failed" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", verifyOTP);

// ✅ Check Verification Status
router.post("/check-verification", checkVerificationStatus);

// ✅ Login with role-based checks
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google login. Please use Google to sign in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Email verification check for students
    if (user.role === "student" && !user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in.",
        needsVerification: true,
      });
    }

    // Educator approval status checks
    if (user.role === "educator") {
      if (user.approvalStatus === "pending") {
        return res.status(403).json({
          message: "Your educator account is currently under review. You will be notified once approved.",
          approvalStatus: "pending",
        });
      }

      if (user.approvalStatus === "rejected") {
        return res.status(403).json({
          message: "Your educator account has been rejected. Please contact administration.",
          approvalStatus: "rejected",
        });
      }
    }

    const token = generateToken(user._id);

    res
      .cookie("finmen_token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          approvalStatus: user.approvalStatus,
        },
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Forgot Password
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password with OTP
router.post("/reset-password", resetPasswordWithOTP);

// ✅ Google Login (Student only)
router.post("/google", googleLogin);

// ✅ Admin-only: Register admin or educator
router.post("/admin-register", requireAuth, requireAdmin, registerByAdmin);

// ✅ Get Logged-in User
router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

// ✅ Logout
router.post("/logout", (req, res) => {
  res.clearCookie("finmen_token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logout successful" });
});

export default router;
