export const checkEducatorApproved = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.role === "educator" && !user.isApproved) {
    return res.status(403).json({
      message: "Your account is pending admin approval.",
    });
  }

  next();
};

// Middleware to restrict access to admin only
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};
