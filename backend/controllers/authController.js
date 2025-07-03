import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🎯 Google Login Controller
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create new user
      user = await User.create({
        email,
        name,
        avatar: picture,
        role: "student", // Default role changed from 'user' to 'student'
      });
    }

    // Generate JWT
    const authToken = generateToken(user._id);

    // Set cookie securely
    res
      .cookie("finmen_token", authToken, {
        httpOnly: true,
        secure: false, // For local development
        sameSite: "Lax", // More compatible for local dev
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(400).json({ message: "Google authentication failed" });
  }
};
