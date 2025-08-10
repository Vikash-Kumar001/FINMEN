import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiresAt -otpType');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      location: user.location || user.city || '',
      website: user.website || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      academic: user.academic || {},
      professional: user.professional || {},
      preferences: user.preferences || {},
    });
  } catch (err) {
    console.error('❌ Get profile error:', err);
    res.status(500).json({ message: 'Failed to load profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const body = req.body || {};

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Basic fields
    ['name', 'dob', 'institution', 'username', 'city', 'language', 'guardianEmail', 'phone', 'location', 'website', 'bio', 'avatar']
      .forEach((field) => {
        if (body[field] !== undefined) user[field] = body[field];
      });

    // Nested objects from tabs
    if (body.personal) Object.assign(user, body.personal);
    if (body.academic) user.academic = { ...(user.academic || {}), ...body.academic };
    if (body.professional) user.professional = { ...(user.professional || {}), ...body.professional };
    if (body.preferences) user.preferences = { ...(user.preferences || {}), ...body.preferences };

    await user.save();

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
      updatedAt: user.updatedAt,
    };

    if (req.io) {
      req.io.to('admin').emit('student:profile:updated', payload);
      req.io.to('educator').emit('student:profile:updated', payload);
      req.io.to(user._id.toString()).emit('user:profile:updated', payload);
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('❌ Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const updateUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If file uploaded via multer
    if (req.file) {
      // Expose via /uploads/avatars/<filename>
      const publicPath = `/uploads/avatars/${req.file.filename}`;
      user.avatar = publicPath;
      await user.save();
      return res.status(200).json({ message: 'Avatar updated', avatar: user.avatar });
    }

    // Support URL avatar update via body.avatar
    const { avatar } = req.body || {};
    if (!avatar) return res.status(400).json({ message: 'avatar is required' });

    user.avatar = avatar;
    await user.save();

    res.status(200).json({ message: 'Avatar updated', avatar: user.avatar });
  } catch (err) {
    console.error('❌ Avatar update error:', err);
    res.status(500).json({ message: 'Failed to update avatar' });
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