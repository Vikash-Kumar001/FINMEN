import express from "express";
import {
  registerByAdmin,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPasswordWithOTP,
  checkVerificationStatus,
  login
} from "../controllers/authController.js";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth.js";
import { trackEducatorLogin } from "../utils/educatorActivityTracker.js";
import { generateToken } from "../utils/generateToken.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ✅ Student Self-Registration
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, dateOfBirth } = req.body;

    if (!email || !password || !fullName || !dateOfBirth) {
      return res.status(400).json({ message: "Email, password, full name, and date of birth are required" });
    }

    // Validate dateOfBirth
    const parsedDob = new Date(dateOfBirth);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({ message: "Invalid date of birth format" });
    }
    const now = new Date();
    if (parsedDob > now) {
      return res.status(400).json({ message: "Date of birth cannot be in the future" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: fullName.trim(),
      fullName: fullName.trim(),
      dateOfBirth: parsedDob,
      dob: dateOfBirth,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      isVerified: false,
    });

    const otpResult = await sendOTP(newUser.email, "verify");

    res.status(200).json({
      message: otpResult?.success
        ? "OTP sent to email for verification"
        : "Account created. OTP email failed; please use resend OTP.",
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
router.post("/login", trackEducatorLogin, login);

// ✅ Forgot Password
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password with OTP
router.post("/reset-password", resetPasswordWithOTP);

// ✅ Google Login (Student only)
// Google authentication endpoints removed

// ✅ Parent/Seller/CSR Self-Registration (no verification required)
router.post("/register-stakeholder", async (req, res) => {
  try {
    const { 
      email, password, name, role,
      // Parent fields
      childEmail,
      // Seller fields  
      businessName, shopType,
      // CSR fields
      organization,
      // Educator fields
      position, subjects
    } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "Email, password, name, and role are required" });
    }

    if (!["parent", "seller", "csr", "educator"].includes(role)) {
      return res.status(400).json({ message: "Role must be one of: parent, seller, csr, educator" });
    }

    // Role-specific validation
    if (role === "parent" && !childEmail) {
      return res.status(400).json({ message: "Child email is required for parent role" });
    }
    
    if (role === "seller" && (!businessName || !shopType)) {
      return res.status(400).json({ message: "Business name and shop type are required for seller role" });
    }
    
    if (role === "csr" && !organization) {
      return res.status(400).json({ message: "Organization name is required for CSR role" });
    }
    
    if (role === "educator" && (!position || !subjects)) {
      return res.status(400).json({ message: "Position and subjects are required for educator role" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      isVerified: true, // Auto-verified for stakeholders
      // Parents are auto-approved; others remain pending for admin review
      approvalStatus: role === "parent" ? "approved" : "pending",
    };

    // Add role-specific fields
    if (role === "parent") {
      userData.childEmail = childEmail;
    } else if (role === "seller") {
      userData.businessName = businessName;
      userData.shopType = shopType;
    } else if (role === "csr") {
      userData.organization = organization;
    } else if (role === "educator") {
      userData.position = position;
      userData.subjects = subjects;
    }

    const newUser = await User.create(userData);

    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
    const message = role === "parent"
      ? `${roleLabel} account created successfully. Your account is active.`
      : `${roleLabel} account created successfully. Your account is pending admin approval.`;

    res.status(201).json({
      message,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        approvalStatus: newUser.approvalStatus,
      },
    });
  } catch (err) {
    console.error("Stakeholder registration error:", err);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    res.status(500).json({ message: "Registration failed" });
  }
});

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