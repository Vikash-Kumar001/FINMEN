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
