/**
 * Avatar Controller
 * Handles avatar generation, customization, and management
 */

import User from '../models/User.js';
import { generateAvatar, generateAvatarOptions, updateAvatar } from '../utils/avatarGenerator.js';

/**
 * Generate avatar for existing user (if missing)
 * GET /api/avatar/generate/:userId
 */
export const generateUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate avatar data
    const avatarData = generateAvatar({
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Update user with avatar data
    await User.findByIdAndUpdate(userId, {
      avatar: avatarData.url,
      avatarData: {
        type: 'generated',
        ...avatarData
      }
    });

    res.status(200).json({
      message: 'Avatar generated successfully',
      avatar: avatarData
    });
  } catch (error) {
    console.error('Generate avatar error:', error);
    res.status(500).json({ message: 'Failed to generate avatar' });
  }
};

/**
 * Get avatar options for user customization
 * GET /api/avatar/options/:userId
 */
export const getAvatarOptions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate multiple avatar options
    const avatarOptions = generateAvatarOptions({
      name: user.name,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      message: 'Avatar options generated successfully',
      options: avatarOptions
    });
  } catch (error) {
    console.error('Get avatar options error:', error);
    res.status(500).json({ message: 'Failed to generate avatar options' });
  }
};

/**
 * Update user avatar with custom selection
 * PUT /api/avatar/update/:userId
 */
export const updateUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const { avatarOption } = req.body;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }

    if (!avatarOption) {
      return res.status(400).json({ message: 'Avatar option is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update avatar with new option
    await User.findByIdAndUpdate(userId, {
      avatar: avatarOption.url,
      avatarData: {
        type: 'generated',
        url: avatarOption.url,
        initials: avatarOption.initials,
        colors: avatarOption.colors,
        icon: avatarOption.icon,
        role: avatarOption.role,
        isGenerated: true,
        updatedAt: new Date().toISOString()
      }
    });

    res.status(200).json({
      message: 'Avatar updated successfully',
      avatar: {
        url: avatarOption.url,
        initials: avatarOption.initials,
        colors: avatarOption.colors,
        icon: avatarOption.icon,
        role: avatarOption.role,
        isGenerated: true
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ message: 'Failed to update avatar' });
  }
};

/**
 * Upload custom avatar image
 * POST /api/avatar/upload/:userId
 */
export const uploadCustomAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Avatar image is required' });
    }

    // Create the full URL for the uploaded file
    const apiBaseUrl = process.env.API_URL || 'http://localhost:5000';
    const customAvatarUrl = `${apiBaseUrl}/uploads/avatars/${req.file.filename}`;

    // Update user with custom avatar
    await User.findByIdAndUpdate(userId, {
      avatar: customAvatarUrl,
      avatarData: {
        type: 'uploaded',
        url: customAvatarUrl,
        isGenerated: false,
        updatedAt: new Date().toISOString()
      }
    });

    res.status(200).json({
      message: 'Custom avatar uploaded successfully',
      avatar: {
        url: customAvatarUrl,
        type: 'uploaded',
        isGenerated: false
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};

/**
 * Reset avatar to generated version
 * POST /api/avatar/reset/:userId
 */
export const resetAvatarToGenerated = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new avatar data
    const avatarData = generateAvatar({
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Update user with generated avatar
    await User.findByIdAndUpdate(userId, {
      avatar: avatarData.url,
      avatarData: {
        type: 'generated',
        ...avatarData
      }
    });

    res.status(200).json({
      message: 'Avatar reset to generated version successfully',
      avatar: avatarData
    });
  } catch (error) {
    console.error('Reset avatar error:', error);
    res.status(500).json({ message: 'Failed to reset avatar' });
  }
};

/**
 * Get user's current avatar information
 * GET /api/avatar/:userId
 */
export const getUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('avatar avatarData name email role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If no avatar data exists, generate one
    if (!user.avatarData || !user.avatarData.url) {
      const avatarData = generateAvatar({
        name: user.name,
        email: user.email,
        role: user.role
      });

      await User.findByIdAndUpdate(userId, {
        avatar: avatarData.url,
        avatarData: {
          type: 'generated',
          ...avatarData
        }
      });

      return res.status(200).json({
        avatar: avatarData
      });
    }

    res.status(200).json({
      avatar: user.avatarData
    });
  } catch (error) {
    console.error('Get avatar error:', error);
    res.status(500).json({ message: 'Failed to get avatar' });
  }
};
