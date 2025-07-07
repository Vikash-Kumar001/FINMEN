import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  googleLogin,
  registerByAdmin,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPasswordWithOTP
} from "../controllers/authController.js";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

// ✅ Student Self-Registration
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
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

    // Send OTP
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

// ✅ Verify OTP (for registration)
router.post("/verify-otp", verifyOTP);

// ✅ Login (for student/educator/admin)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.password) {
      return res.status(400).json({
        message: "Invalid credentials or use Google login.",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
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
        },
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Forgot Password - Send OTP
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password with OTP
router.post("/reset-password", resetPasswordWithOTP);

// ✅ Google Login
router.post("/google", googleLogin);

// ✅ Admin-only: Register another admin or educator
router.post("/admin-register", requireAuth, requireAdmin, registerByAdmin);

// ✅ Get Current Logged-in User
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
