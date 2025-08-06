// 📝 PUT /api/user/profile — Update user profile
router.put('/profile', requireAuth, updateUserProfile);

// 👥 GET /api/user/students — Get all students (for admin/educator)
router.get('/students', requireAuth, getAllStudents);