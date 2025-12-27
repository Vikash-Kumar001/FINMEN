import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line
import { Camera, Palette, RotateCcw, Upload, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const Avatar = ({ 
  user, 
  size = 'large', 
  showCustomize = false, 
  onAvatarUpdate,
  className = '' 
}) => {
  const [avatarData, setAvatarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState([]);
  const [customizing, setCustomizing] = useState(false);

  // Size configurations
  const sizeConfig = {
    xsmall: { size: 32, text: 'text-xxs' },
    small: { size: 40, text: 'text-xs' },
    medium: { size: 60, text: 'text-sm' },
    large: { size: 120, text: 'text-lg' },
    xlarge: { size: 200, text: 'text-2xl' }
  };

  const currentSize = sizeConfig[size] || sizeConfig.large;

  // Helper function to get the correct user ID
  const getUserId = () => {
    const userId = user?.id || user?._id;
    if (!userId) {
      console.warn('Avatar component: No user ID found in user object:', user);
    }
    return userId;
  };

  useEffect(() => {
    if (getUserId()) {
      fetchAvatarData();
    }
  }, [user?.id, user?._id]);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (customizing || showOptions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [customizing, showOptions]);

  const fetchAvatarData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      const response = await api.get(`/api/avatar/${userId}`);
      setAvatarData(response.data.avatar);
    } catch (error) {
      console.error('Error fetching avatar:', error);
      // Fallback to legacy avatar or generate new one
      if (user?.avatar) {
        setAvatarData({ url: user.avatar, isGenerated: false });
      } else {
        generateNewAvatar();
      }
    } finally {
      setLoading(false);
    }
  };

  const generateNewAvatar = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      const response = await api.post(`/api/avatar/generate/${userId}`);
      setAvatarData(response.data.avatar);
      if (onAvatarUpdate) onAvatarUpdate(response.data.avatar);
    } catch (error) {
      console.error('Error generating avatar:', error);
      toast.error('Failed to generate avatar');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvatarOptions = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      const response = await api.get(`/api/avatar/options/${userId}`);
      setAvatarOptions(response.data.options);
      setShowOptions(true);
    } catch (error) {
      console.error('Error fetching avatar options:', error);
      toast.error('Failed to load avatar options');
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (avatarOption) => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      const response = await api.put(`/api/avatar/update/${userId}`, {
        avatarOption
      });
      setAvatarData(response.data.avatar);
      setShowOptions(false);
      setCustomizing(false);
      if (onAvatarUpdate) onAvatarUpdate(response.data.avatar);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };

  const resetAvatar = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      const response = await api.post(`/api/avatar/reset/${userId}`);
      setAvatarData(response.data.avatar);
      setShowOptions(false);
      setCustomizing(false);
      if (onAvatarUpdate) onAvatarUpdate(response.data.avatar);
      toast.success('Avatar reset successfully!');
    } catch (error) {
      console.error('Error resetting avatar:', error);
      toast.error('Failed to reset avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const userId = getUserId();
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      const response = await api.post(`/api/avatar/upload/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAvatarData(response.data.avatar);
      setCustomizing(false);
      if (onAvatarUpdate) onAvatarUpdate(response.data.avatar);
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div 
        className={`bg-gray-200 rounded-full flex items-center justify-center ${className}`}
        style={{ width: currentSize.size, height: currentSize.size }}
      >
        <div className="text-gray-400">?</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Avatar Display */}
      <div className="relative group">
        {loading ? (
          <div 
            className="bg-gray-200 rounded-full flex items-center justify-center animate-pulse"
            style={{ width: currentSize.size, height: currentSize.size }}
          >
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : avatarData?.url ? (
          <img
            src={avatarData.url}
            alt={`${user.name}'s avatar`}
            className="rounded-full object-cover shadow-lg border-2 border-white"
            style={{ width: currentSize.size, height: currentSize.size }}
            onError={() => generateNewAvatar()}
          />
        ) : (
          <div 
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            style={{ width: currentSize.size, height: currentSize.size }}
          >
            <span className={currentSize.text}>
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}

        {/* Customize Button */}
        {showCustomize && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCustomizing(true)}
            className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors"
          >
            <Camera className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Customization Modal */}
      {customizing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setCustomizing(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Customize Avatar</h3>
              <button
                onClick={() => setCustomizing(false)}
                className="text-gray-100 hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Upload Custom Image */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-100 mb-2">Upload your own image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700"
                >
                  Choose File
                </label>
              </div>

              {/* Generate Options - Always available */}
              <button
                onClick={fetchAvatarOptions}
                disabled={loading}
                className="w-full bg-white/90 text-indigo-900 py-3 rounded-lg font-medium hover:bg-gray-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Palette className="w-5 h-5" />
                {avatarData?.isGenerated === false ? 'Generate New Options' : 'Generate Options'}
              </button>

              {/* Reset to Generated - Only show if user has uploaded custom image */}
              {avatarData?.isGenerated === false && (
                <button
                  onClick={resetAvatar}
                  disabled={loading}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset to Generated
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Avatar Options Modal */}
      {showOptions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setShowOptions(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Choose Your Avatar</h3>
                <p className="text-sm text-gray-200 mt-1">
                  Select a generated option or upload your own image
                </p>
              </div>
              <button
                onClick={() => setShowOptions(false)}
                className="text-gray-200 hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {avatarOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => updateAvatar(option)}
                  disabled={loading}
                  className="p-4 border-2 border-gray-200 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <img
                    src={option.url}
                    alt={`Avatar option ${index + 1}`}
                    className="w-full h-24 object-contain rounded-lg mb-2 "
                  />
                  <p className="text-xs text-gray-200 text-center">
                    Option {index + 1}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* Upload Custom Image Option */}
            <div className="border-t border-white/20 pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-200 mb-3">Or upload your own image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="avatar-upload-modal"
                />
                <label
                  htmlFor="avatar-upload-modal"
                  className="inline-block bg-white/20 text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer hover:bg-white/30 transition-colors border border-white/30"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Custom Image
                </label>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Avatar;
