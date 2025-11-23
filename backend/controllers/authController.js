import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendMail.js";
import { generateAvatar } from "../utils/avatarGenerator.js";


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email, type = "verify", sendEmailSync = false) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (user.role === "admin" || user.role === "parent" || user.role === "seller" || user.role === "csr")) {
      return { success: true, message: "No OTP required for admin/parent/seller/csr accounts" };
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP first - this is critical and must succeed
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

    // Send email asynchronously in the background (non-blocking)
    // This ensures the API responds quickly even if email service is slow
    const sendEmailAsync = async () => {
      try {
        console.log(`📧 Starting to send email to ${email} for ${type}...`);
        const startTime = Date.now();
        
        await sendEmail({ to: email, subject, html: message });
        
        const duration = Date.now() - startTime;
        console.log(`✅ Email sent successfully to ${email} for ${type} (took ${duration}ms)`);
        console.log(`📩 Email details: Subject="${subject}", OTP=${otp}`);
        
        return { success: true, duration };
      } catch (emailErr) {
        const errorMessage = emailErr?.message || "Unknown error";
        const errorCode = emailErr?.code || "UNKNOWN";
        
        console.error(`❌ Background email send error for ${email}:`, errorMessage);
        console.error(`❌ Error code: ${errorCode}`);
        console.error(`❌ Full error:`, emailErr);
        
        // Log specific error types
        if (errorCode === 'ETIMEDOUT' || errorMessage.includes('timeout')) {
          console.error(`⏱️ Email timeout for ${email} - SMTP connection timed out`);
        } else if (errorCode === 'EAUTH') {
          console.error(`🔐 Email auth failed for ${email} - Check MAIL_USER and MAIL_PASS`);
        } else if (errorMessage.includes('not configured')) {
          console.error(`⚙️ Email not configured - Missing environment variables`);
        }
        
        // Email failure is logged but doesn't affect the response
        // OTP is already saved, so user can still use it or request resend
        return { success: false, error: errorMessage, code: errorCode };
      }
    };

    // In production, wait for email to be sent to ensure it completes
    // In development, we can use async for faster response
    const isProduction = process.env.NODE_ENV === 'production';
    const shouldSendSync = sendEmailSync || isProduction;

    if (shouldSendSync) {
      // For production or when synchronous sending is required
      // This ensures emails are actually sent before responding
      // Add timeout protection to prevent hanging requests
      try {
        console.log(`📧 Sending email ${isProduction ? 'synchronously (production)' : 'synchronously'} to ${email} for ${type}...`);
        const startTime = Date.now();
        
        // Wrap email sending in a timeout to prevent hanging
        const emailPromise = sendEmail({ to: email, subject, html: message });
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email sending timeout after 90 seconds')), 90000)
        );
        
        await Promise.race([emailPromise, timeoutPromise]);
        
        const duration = Date.now() - startTime;
        console.log(`✅ Email sent successfully to ${email} for ${type} (took ${duration}ms)`);
        console.log(`📩 Email details: Subject="${subject}", OTP=${otp}`);
        
        return { success: true, message: "OTP sent successfully" };
      } catch (emailErr) {
        console.error("Send email error:", emailErr);
        const errorMessage = emailErr?.message || "Unknown email error";
        const errorCode = emailErr?.code || "UNKNOWN";
        
        // Log detailed error information
        console.error(`❌ Email send failed for ${email}:`, errorMessage);
        console.error(`❌ Error code: ${errorCode}`);
        console.error(`❌ Full error:`, emailErr);
        
        // Check if it's a configuration error
        if (errorMessage.includes("not configured") || errorMessage.includes("MAIL_USER") || errorMessage.includes("MAIL_PASS")) {
          return { success: false, message: "Email service is not configured. Please contact support." };
        }
        
        // Check if it's a timeout
        if (errorMessage.includes("timeout") || errorCode === 'ETIMEDOUT') {
          console.error(`⏱️ Email sending timed out for ${email}`);
          // OTP is already saved, so return success with a note
          return { 
            success: true, 
            message: "OTP generated successfully. Email sending is taking longer than expected. Please check your email or try resending." 
          };
        }
        
        // In production, we want to know if email failed
        // OTP is already saved, so user can still use it or request resend
        if (isProduction) {
          // In production, log the error but still return success since OTP is saved
          // User can request resend if email doesn't arrive
          return { 
            success: true, 
            message: "OTP generated successfully. If you don't receive the email, please try resending." 
          };
        } else {
          return { success: true, message: "OTP generated successfully. Email sending failed, but you can still use the OTP or request a resend." };
        }
      }
    } else {
      // Development mode: Start email sending in background (fire and forget)
      // Use process.nextTick to ensure it runs in the next event loop iteration
      process.nextTick(() => {
        sendEmailAsync()
          .then(result => {
            if (result && result.success) {
              console.log(`✅ Background email completed successfully for ${email} (took ${result.duration}ms)`);
            } else {
              console.error(`❌ Background email failed for ${email}:`, result?.error || 'Unknown error');
              console.error(`❌ Error code: ${result?.code || 'UNKNOWN'}`);
            }
          })
          .catch(err => {
            console.error(`❌ Unexpected error in background email for ${email}:`, err);
            console.error(`❌ Error stack:`, err?.stack);
          });
      });
      
      // Return success immediately - OTP is saved, email will be sent in background
      console.log(`✅ OTP generated and saved for ${email}. Email sending started in background.`);
      return { success: true, message: "OTP generated and email is being sent" };
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    const errorMessage = error?.message || "Unknown error";
    // Non-fatal: return failure to caller instead of throwing
    return { success: false, message: `Failed to generate or store OTP: ${errorMessage}` };
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, type = "verify" } = req.body;

    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts don't require OTP verification" });
    }

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otpType !== type) {
      return res.status(400).json({ message: "Invalid OTP type" });
    }

    // For password reset, don't clear OTP yet (will be cleared after password reset)
    // For email verification, clear OTP and log user in
    if (type === "reset") {
      // Just verify the OTP is valid, but keep it for password reset
      return res.status(200).json({
        message: "OTP verified successfully. You can now reset your password.",
      });
    }

    // For email verification (registration)
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

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts don't require OTP verification" });
    }

    // Resend OTP for email verification (registration)
    const result = await sendOTP(user.email, "verify");

    if (result.success) {
      res.status(200).json({
        message: "OTP resent successfully",
        email: user.email,
      });
    } else {
      res.status(500).json({
        message: result.message || "Failed to resend OTP",
      });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Allow password reset via OTP even if no password is currently set

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot reset password via OTP. Please contact your administrator." });
    }

    // Send OTP asynchronously (non-blocking email sending)
    // OTP is saved immediately, email is sent in background
    const result = await sendOTP(user.email, "reset", false);

    if (result && result.success) {
      res.status(200).json({
        message: "OTP has been generated and sent to your email. Please check your inbox.",
        email: user.email,
      });
    } else {
      const errorMessage = result?.message || "Failed to generate reset OTP";
      console.error("Failed to generate OTP:", errorMessage);
      res.status(500).json({
        message: errorMessage,
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    const errorMessage = error?.message || "Unknown error occurred";
    res.status(500).json({ message: "Failed to process password reset request. Please try again." });
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

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot reset password via OTP. Please contact your administrator." });
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


export const registerByAdmin = async (req, res) => {
  try {
    const { email, password, name, role, position, subjects } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "Email, password, name, and role are required" });
    }

    // Allow school_admin, school_student, school_teacher, school_parent
    const allowedRoles = ["admin", "parent", "seller", "csr", "school_admin", "school_student", "school_teacher", "school_parent"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Role must be one of: ${allowedRoles.join(", ")}` });
    }


    // For school_student, generate permanent random code
    let studentCode;
    if (role === "school_student") {
      studentCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    // For school_parent, require studentCode and link parent to student
    let linkedStudent = null;
    if (role === "school_parent") {
      const { studentCode: parentStudentCode } = req.body;
      if (!parentStudentCode) {
        return res.status(400).json({ message: "Student code is required to register parent account" });
      }
      linkedStudent = await User.findOne({ role: "school_student", studentCode: parentStudentCode });
      if (!linkedStudent) {
        return res.status(400).json({ message: "Invalid student code. No student found." });
      }
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate avatar for the new user
    const avatarData = generateAvatar({
      name,
      email: normalizedEmail,
      role
    });

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      isVerified: true, // All roles created by admin are pre-verified
      approvalStatus: ["parent", "seller", "csr"].includes(role) ? "pending" : "approved",
      studentCode: role === "school_student" ? studentCode : undefined,
      linkedStudentId: role === "school_parent" && linkedStudent ? linkedStudent._id : undefined,
      avatar: avatarData.url, // Set legacy avatar field
      avatarData: {
        type: 'generated',
        ...avatarData
      }
    });

    res.status(201).json({
      message: ["parent", "seller", "csr"].includes(role)
        ? `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully. Account is pending approval.`
        : `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
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

    if (user.role === "admin") {
      return res.status(200).json({
        needsVerification: false,
        isVerified: true,
        role: user.role,
        message: "Admin accounts don't require email verification"
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

// Add this function to the existing login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    console.log('Login attempt for:', normalizedEmail);
    
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log('User not found for email:', normalizedEmail);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });

    if (!user.password) {
      console.log('No password set for user:', user.email);
      return res.status(400).json({
        message: "No password set for this account. Please reset your password.",
      });
    }

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', user.email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Email verification is no longer required for student login.
    // We allow login regardless of verification status.

    // Approval status checks for parent and seller only (CSR users don't need approval)
    if (["parent", "seller", "school_admin"].includes(user.role)) {
      if (user.approvalStatus === "pending") {
        return res.status(403).json({
          message: `Your ${user.role === "school_admin" ? "school" : user.role} account is currently under review. You will be notified once approved.`,
          approvalStatus: "pending",
        });
      }

      if (user.approvalStatus === "rejected") {
        return res.status(403).json({
          message: `Your ${user.role === "school_admin" ? "school" : user.role} account has been rejected. Please contact administration.`,
          approvalStatus: "rejected",
        });
      }
    }

    const token = generateToken(user._id);

    // Daily login reward for students
    if (user.role === "student" || user.role === "school_student") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastActive = user.lastActive ? new Date(user.lastActive) : null;
      let lastActiveDay = null;
      if (lastActive) {
        lastActiveDay = new Date(lastActive);
        lastActiveDay.setHours(0, 0, 0, 0);
      }
      
      // Check if this is a new day login
      let loginReward = null;
      if (!lastActiveDay || today.getTime() > lastActiveDay.getTime()) {
        // Award 5 HealCoins for daily login
        const dailyReward = 5; // 5 HealCoins for daily login
        
        // Update user's last active timestamp
        user.lastActive = new Date();
        await user.save();
        
        // Add coins to wallet
        let wallet = await Wallet.findOne({ userId: user._id });
        
        if (!wallet) {
          wallet = await Wallet.create({
            userId: user._id,
            balance: dailyReward
          });
        } else {
          wallet.balance += dailyReward;
          await wallet.save();
        }
        
        // Create transaction record
        await Transaction.create({
          userId: user._id,
          type: "credit",
          amount: dailyReward,
          description: "Daily login reward"
        });
        
        loginReward = {
          received: true,
          amount: dailyReward
        };
        
        // Return login reward info with response
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
            token, // Include token in response for frontend storage
            loginReward
          });
      } else {
        // Regular login without reward
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
            token,
            loginReward: null
          });
      }
    } else {
      // Non-student login (no rewards)
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
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};