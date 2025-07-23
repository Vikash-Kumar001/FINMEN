export const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};

export const checkEducator = (req, res, next) => {
  if (req.user && req.user.role === "educator") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Educators only." });
};

export const checkStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Students only." });
};

/**
 * Middleware to check if user has one of the allowed roles
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} - Express middleware function
 */
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: `Access denied. Only ${roles.join(', ')} allowed.` });
  };
};
