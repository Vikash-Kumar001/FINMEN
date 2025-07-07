import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware: Authenticate User from JWT
export const requireAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.finmen_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ✅ Middleware: Admin-only access
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// ✅ Middleware: Educator-only access
export const requireEducator = (req, res, next) => {
  if (req.user?.role !== "educator") {
    return res.status(403).json({ message: "Access denied. Educators only." });
  }
  next();
};

// ✅ Middleware: Student-only access
export const requireStudent = (req, res, next) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};
