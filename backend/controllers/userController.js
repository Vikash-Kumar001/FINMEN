export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      dob,
      institution,
      username,
      city,
      language,
      guardianEmail
    } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (dob) user.dob = dob;
    if (institution) user.institution = institution;
    if (username) user.username = username;
    if (city) user.city = city;
    if (language) user.language = language;
    if (guardianEmail) user.guardianEmail = guardianEmail;
    
    // Save the updated user
    await user.save();
    
    // Emit socket event for real-time updates
    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      institution: user.institution,
      city: user.city,
      avatar: user.avatar,
      dob: user.dob,
      username: user.username,
      language: user.language,
      guardianEmail: user.guardianEmail,
      updatedAt: user.updatedAt
    };
    if (req.io) {
      req.io.to('admin').emit('student:profile:updated', payload);
      req.io.to('educator').emit('student:profile:updated', payload);
      req.io.to(user._id.toString()).emit('user:profile:updated', payload);
    }
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        institution: user.institution,
        username: user.username,
        city: user.city,
        language: user.language,
        guardianEmail: user.guardianEmail
      }
    });
  } catch (err) {
    console.error('❌ Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// 👥 GET /api/user/students — Get all students (for admin/educator)
export const getAllStudents = async (req, res) => {
  try {
    // Check if user is admin or educator
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Not authorized to access student data' });
    }
    
    // Get all students
    const students = await User.find({ role: 'student' })
      .select('name email avatar institution city dob lastActive createdAt');
    
    res.status(200).json(students);
  } catch (err) {
    console.error('❌ Get students error:', err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};