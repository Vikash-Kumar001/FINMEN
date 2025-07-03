const requireApprovedEducator = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== 'educator' || !user.isApproved) {
    console.warn('🔒 Access denied: User not approved or not an educator');
    return res.status(403).json({
      error: 'Access denied. Only approved educators can access this route.',
    });
  }

  next();
};

export { requireApprovedEducator };
