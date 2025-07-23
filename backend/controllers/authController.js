import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendMail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email, type = "verify") => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (user.role === "admin" || user.role === "educator")) {
      return { success: true, message: "No OTP required for admin/educator accounts" };
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        otp,
        otpExpiresAt: expiresAt,
        otpType: type,
      }
    );

    const subject = type === "verify" ? "Verify Your Email" : "Reset Your Password";
    const message = `
      <h2>${subject}</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail({ to: email, subject, html: message });

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Send OTP error:", error);
    throw new Error("Failed to send OTP");
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, type = "verify" } = req.body;

    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role === "admin" || user.role === "educator") {
      return res.status(400).json({ message: "Admin and educator accounts don't require OTP verification" });
    }

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otpType !== type) {
      return res.status(400).json({ message: "Invalid OTP type" });
    }

    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      otp: null,
      otpExpiresAt: null,
      otpType: null,
    });

    const token = generateToken(user._id);

    res
      .cookie("finmen_token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Email verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google login. Please use Google to sign in." });
    }

    if (user.role === "admin" || user.role === "educator") {
      return res.status(400).json({ message: "Admin and educator accounts cannot reset password via OTP. Please contact your administrator." });
    }

    await sendOTP(user.email, "reset");

    res.status(200).json({
      message: "OTP sent to email for password reset",
      email: user.email,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
};

export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role === "admin" || user.role === "educator") {
      return res.status(400).json({ message: "Admin and educator accounts cannot reset password via OTP. Please contact your administrator." });
    }

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otpType !== "reset") {
      return res.status(400).json({ message: "Invalid OTP type" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      otp: null,
      otpExpiresAt: null,
      otpType: null,
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "No token provided" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Invalid Google token payload" });

    const { email, name, picture } = payload;
    if (!email) return res.status(400).json({ message: "Google account must have a verified email" });

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user && user.role !== "student") {
      return res.status(403).json({ message: "Google login is allowed only for students." });
    }

    if (!user) {
      user = await User.create({
        name: name || email,
        email: email.toLowerCase(),
        avatar: picture,
        role: "student",
        isVerified: true,
        fromGoogle: true,
      });
    }

    const authToken = generateToken(user._id);

    res
      .cookie("finmen_token", authToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Google login successful",
        token: authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(400).json({ message: "Google authentication failed" });
  }
};

export const registerByAdmin = async (req, res) => {
  try {
    const { email, password, name, role, position, subjects } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "Email, password, name, and role are required" });
    }

    if (!["admin", "educator"].includes(role)) {
      return res.status(400).json({ message: "Role must be either 'admin' or 'educator'" });
    }

    if (role === "educator" && (!position || !subjects)) {
      return res.status(400).json({ message: "Position and subjects are required for educator role" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      isVerified: true,
      position: role === "educator" ? position : undefined,
      subjects: role === "educator" ? subjects : undefined,
      approvalStatus: role === "educator" ? "pending" : "approved",
    });

    res.status(201).json({
      message: role === "educator"
        ? "Educator registered successfully. Account is pending approval."
        : `${role} registered successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        approvalStatus: newUser.approvalStatus,
        position: newUser.position,
        subjects: newUser.subjects,
      },
    });
  } catch (error) {
    console.error("Admin register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role === "admin" || user.role === "educator") {
      return res.status(200).json({
        needsVerification: false,
        isVerified: true,
        role: user.role,
        message: "Admin and educator accounts don't require email verification"
      });
    }

    res.status(200).json({
      needsVerification: !user.isVerified,
      isVerified: user.isVerified,
      role: user.role,
      message: user.isVerified ? "Account already verified" : "Account needs verification"
    });
  } catch (error) {
    console.error("Check verification status error:", error);
    res.status(500).json({ message: "Failed to check verification status" });
  }
};

export const login = async (req, res) => {
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
        token // Include token in response for frontend storage
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};