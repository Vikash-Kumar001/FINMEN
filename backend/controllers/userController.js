import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiresAt -otpType');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      fullName: user.fullName || user.name,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      location: user.location || user.city || '',
      website: user.website || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      dateOfBirth: user.dateOfBirth || user.dob || null,
      dob: user.dob || null,
      subject: user.subject || '', // Include subject for school teachers
      academic: user.academic || {},
      professional: user.professional || {},
      preferences: user.preferences || {
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'friends', contactInfo: 'friends', academicInfo: 'private' },
        sound: { effects: true, music: true, volume: 75 }
      },
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
      fullName: user.fullName || user.name,
      name: user.name,
      email: user.email,
      role: user.role,
      institution: user.institution,
      city: user.city,
      location: user.location || user.city,
      avatar: user.avatar,
      dob: user.dob,
      dateOfBirth: user.dateOfBirth || user.dob,
      username: user.username,
      language: user.language,
      guardianEmail: user.guardianEmail,
      phone: user.phone,
      website: user.website,
      bio: user.bio,
      academic: user.academic,
      professional: user.professional,
      preferences: user.preferences,
      updatedAt: user.updatedAt,
    };

    if (req.io) {
      req.io.to('admin').emit('student:profile:updated', payload);
      req.io.to(user._id.toString()).emit('user:profile:updated', payload);
    }

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        fullName: user.fullName || user.name,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        website: user.website,
        bio: user.bio,
        academic: user.academic,
        professional: user.professional,
        preferences: user.preferences
      }
    });
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

export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user has a password (not Google login)
    if (!user.password) {
      return res.status(400).json({ message: 'Cannot change password for Google login accounts' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Password update error:', err);
    res.status(500).json({ message: 'Failed to update password' });
  }
};

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings preferences');
    
    const defaultSettings = {
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        notifyOnApproval: true,
        notifyOnAssignment: true,
        notifyOnWellbeing: true,
        notifyOnSystemUpdates: true,
        notifyOnNewStudent: false,
        notifyOnAttendanceAlert: true,
        digestFrequency: 'daily'
      },
      privacy: {
        showEmailToTeachers: true,
        showPhoneToTeachers: false,
        allowDataExport: true,
        twoFactorAuth: false,
        sessionTimeout: 30
      },
      display: {
        theme: 'light',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        timezone: 'Asia/Kolkata',
        compactMode: false,
        animationsEnabled: true,
        soundEnabled: false
      }
    };

    res.json({
      settings: {
        notifications: { ...defaultSettings.notifications, ...(user.settings?.notifications || user.preferences?.notifications || {}) },
        privacy: { ...defaultSettings.privacy, ...(user.settings?.privacy || {}) },
        display: { ...defaultSettings.display, ...(user.settings?.display || user.preferences || {}) }
      }
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    const { section, settings } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.settings) user.settings = {};
    
    if (section === 'notifications') {
      user.settings.notifications = { ...(user.settings.notifications || {}), ...settings };
    } else if (section === 'privacy') {
      user.settings.privacy = { ...(user.settings.privacy || {}), ...settings };
    } else if (section === 'display') {
      user.settings.display = { ...(user.settings.display || {}), ...settings };
      // Also update user.preferences for backward compatibility
      user.preferences = { ...(user.preferences || {}), ...settings };
    }

    user.markModified('settings');
    user.markModified('preferences');
    await user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

// Export user data
export const exportUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiresAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exportData = {
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        joiningDate: user.createdAt
      },
      settings: user.settings || {},
      preferences: user.preferences || {},
      academic: user.academic || {},
      professional: user.professional || {},
      metadata: {
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
        lastActive: user.lastActive,
        exportedAt: new Date()
      }
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({ message: 'Failed to export data' });
  }
};

// Get admin profile stats
export const getAdminProfileStats = async (req, res) => {
  try {
    const { tenantId } = req;
    
    // Import models
    const SchoolStudent = (await import('../models/School/SchoolStudent.js')).default;
    const Assignment = (await import('../models/Assignment.js')).default;
    
    const [totalStudents, totalTeachers, assignmentsApproved] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      Assignment.countDocuments({ 
        tenantId,
        status: 'approved',
        approvedBy: req.user._id
      })
    ]);

    // Calculate days active
    const joinDate = req.user.createdAt || new Date();
    const daysActive = Math.floor((new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24));

    res.json({
      stats: {
        totalStudents,
        totalTeachers,
        assignmentsApproved,
        daysActive
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        assignmentsApproved: 0,
        daysActive: 0
      }
    });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If file uploaded via multer
    if (req.file) {
      const publicPath = `/uploads/avatars/${req.file.filename}`;
      user.avatar = publicPath;
      await user.save();
      return res.status(200).json({ 
        message: 'Avatar uploaded successfully',
        avatarUrl: user.avatar 
      });
    }

    res.status(400).json({ message: 'No file uploaded' });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};

// 👥 GET /api/user/students — Get all students (for admin)
export const getAllStudents = async (req, res) => {
  try {
    // Check if user is admin or school_admin
    if (!['admin', 'school_admin'].includes(req.user.role)) {
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