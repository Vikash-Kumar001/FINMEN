import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, MapPin, Edit, Save, X, Camera, Shield,
  Award, Activity, TrendingUp, Clock, CheckCircle, AlertCircle, Key,
  Upload, Eye, EyeOff, Building2, Briefcase, Globe, Lock, Bell,
  Settings, BarChart3, Users, FileText, CreditCard, Zap, RefreshCw
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { fetchSchoolApprovalDashboard } from '../../services/schoolApprovalService';
import { useAuth } from '../../context/AuthUtils';
import { useSocket } from '../../context/SocketContext';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    avatar: '',
    bio: '',
    location: '',
    website: '',
    dateOfBirth: '',
    joiningDate: '',
    adminLevel: '',
    permissions: []
  });

  const [editProfile, setEditProfile] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSchools: 0,
    totalStudents: 0,
    pendingApprovals: 0,
    activeIncidents: 0,
    lastLogin: '',
    accountCreated: ''
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000';
  
  const normalizeAvatarUrl = useCallback((src) => {
    if (!src) return src;
    if (src.startsWith('http')) return src;
    if (src.startsWith('/uploads/')) return `${apiBaseUrl}${src}`;
    return src;
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchProfile();
    fetchAdminStats();
    fetchRecentActivity();
    
    const interval = setInterval(() => {
      fetchAdminStats();
      fetchRecentActivity();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Real-time Socket.IO updates
  useEffect(() => {
    if (socket?.socket) {
      const handleProfileUpdate = (data) => {
        if (data.userId === user?._id) {
          setProfile(prev => ({
            ...prev,
            ...data,
            avatar: data.avatar ? normalizeAvatarUrl(data.avatar) : prev.avatar
          }));
          toast.success('Profile updated in real-time!');
        }
      };

      const handleStatsUpdate = (data) => {
        setStats(prev => ({
          ...prev,
          totalUsers: data.totalUsers ?? prev.totalUsers,
          totalSchools: data.totalSchools ?? prev.totalSchools,
          totalStudents: data.totalStudents ?? prev.totalStudents,
          pendingApprovals: data.pendingApprovals ?? prev.pendingApprovals,
          activeIncidents: data.activeIncidents ?? prev.activeIncidents
        }));
      };

      socket.socket.on('admin:profile:update', handleProfileUpdate);
      socket.socket.on('admin:stats:update', handleStatsUpdate);
      
      return () => {
        socket.socket.off('admin:profile:update', handleProfileUpdate);
        socket.socket.off('admin:stats:update', handleStatsUpdate);
      };
    }
  }, [socket, user, normalizeAvatarUrl]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/profile').catch(() => ({ data: null }));
      
      if (response.data) {
        const profileData = response.data.data || response.data;
        const dobValue = profileData.dateOfBirth || profileData.dob;
        const formattedDob = dobValue ? (typeof dobValue === 'string' ? dobValue.split('T')[0] : new Date(dobValue).toISOString().split('T')[0]) : '';
        
        setProfile({
          name: profileData.name || profileData.fullName || user?.name || 'Admin',
          email: profileData.email || user?.email || '',
          phone: profileData.phone || '',
          role: profileData.role || 'admin',
          avatar: normalizeAvatarUrl(profileData.avatar || ''),
          bio: profileData.bio || '',
          location: profileData.location || profileData.city || '',
          website: profileData.website || '',
          dateOfBirth: dobValue || '',
          joiningDate: profileData.createdAt || profileData.joiningDate || '',
          adminLevel: profileData.adminLevel || 'standard',
          permissions: profileData.permissions || []
        });
        setEditProfile({
          name: profileData.name || profileData.fullName || user?.name || 'Admin',
          email: profileData.email || user?.email || '',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          location: profileData.location || profileData.city || '',
          website: profileData.website || '',
          dateOfBirth: formattedDob
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const [panelRes, overviewRes, incidentsRes, approvalsDashboard] = await Promise.all([
        api.get('/api/admin/panel').catch(() => ({ data: { data: null } })),
        api.get('/api/admin/tracking/overview').catch(() => ({ data: { data: null } })),
        api.get('/api/incidents?status=open').catch(() => ({ data: { data: [] } })),
        fetchSchoolApprovalDashboard().catch(() => null)
      ]);

      // Extract stats from panel endpoint (primary source)
      const panelData = panelRes.data?.data || {};
      
      // Extract stats from overview endpoint (secondary source)
      const overviewData = overviewRes.data?.data || {};
      
      // Combine data from both sources, with panel taking priority
      // Note: panelData.dashboardStats is the student count
      const totalUsers = panelData.totalUsers || overviewData.totalUsers || 0;
      const totalSchools = panelData.totalSchools || overviewData.schools?.totalSchools || 0;
      const totalStudents = panelData.dashboardStats || panelData.totalStudents || 
                           overviewData.totalStudents || 
                           ((overviewData.individualStudents || 0) + (overviewData.schoolStudents || 0)) || 0;
      const approvalSummary = approvalsDashboard?.data?.summary || {};
      const pendingApprovals = approvalSummary.pending ?? 0;
      const activeIncidents = incidentsRes.data?.data?.length || incidentsRes.data?.length || 0;

      setStats(prev => ({
        ...prev,
        totalUsers,
        totalSchools,
        totalStudents,
        pendingApprovals,
        activeIncidents,
        accountCreated: profile.joiningDate || profile.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Set default values if all requests fail
      setStats(prev => ({
        ...prev,
        totalUsers: 0,
        totalSchools: 0,
        totalStudents: 0,
        pendingApprovals: 0,
        activeIncidents: 0
      }));
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await api.get('/api/admin/tracking/activity-feed?limit=5').catch(() => ({ data: { data: [] } }));
      setRecentActivity(response.data.data?.activities || response.data.data || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      
      // Prepare the update payload - ensure dateOfBirth is properly formatted
      const updatePayload = {
        ...editProfile,
        dateOfBirth: editProfile.dateOfBirth || null,
        dob: editProfile.dateOfBirth || null // Also send as dob for backward compatibility
      };
      
      await api.put('/api/user/profile', updatePayload);
      
      // Update local state with formatted dateOfBirth
      const updatedProfile = {
        ...editProfile,
        dateOfBirth: editProfile.dateOfBirth || ''
      };
      
      setProfile(prev => ({ ...prev, ...updatedProfile }));
      setEditMode(false);
      toast.success('Profile updated successfully!');
      
      // Emit real-time update
      if (socket?.socket) {
        socket.socket.emit('admin:profile:updated', {
          userId: user?._id,
          ...updatedProfile
        });
      }
      
      // Refresh profile to get updated data from server
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await api.put('/api/user/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/api/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newAvatar = response.data?.avatar || response.data?.data?.avatar;
      if (newAvatar) {
        setProfile(prev => ({ ...prev, avatar: normalizeAvatarUrl(newAvatar) }));
        toast.success('Avatar updated successfully!');
        
        // Emit real-time update
        if (socket?.socket) {
          socket.socket.emit('admin:profile:updated', {
            userId: user?._id,
            avatar: newAvatar
          });
        }
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <User className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Admin Profile</h1>
                  <p className="text-lg text-white/90">Manage your profile, settings, and preferences</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-5xl shadow-2xl">
                    {profile.avatar ? (
                      <img 
                        src={normalizeAvatarUrl(profile.avatar)} 
                        alt={profile.name} 
                        className="w-full h-full rounded-full object-cover" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full rounded-full flex items-center justify-center" style={{ display: profile.avatar ? 'none' : 'flex' }}>
                      {profile.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                  </div>
                  <label className="absolute bottom-0 right-0 p-3 bg-indigo-500 rounded-full cursor-pointer hover:bg-indigo-600 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarUpload} 
                      className="hidden" 
                      disabled={saving}
                    />
                  </label>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mt-4">{profile.name || 'Admin'}</h2>
                <p className="text-sm text-gray-600 capitalize">{profile.role?.replace('_', ' ') || 'Administrator'}</p>
                <p className="text-xs text-gray-500 mt-1">{profile.email || 'No email'}</p>
                {profile.adminLevel && (
                  <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                    {profile.adminLevel === 'super' ? 'Super Admin' : 'Admin'}
                  </span>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">Total Users</span>
                    </div>
                    <span className="text-2xl font-black text-blue-600">{stats.totalUsers || 0}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700">Schools</span>
                    </div>
                    <span className="text-2xl font-black text-green-600">{stats.totalSchools || 0}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-700">Students</span>
                    </div>
                    <span className="text-2xl font-black text-purple-600">{stats.totalStudents || 0}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-semibold text-gray-700">Pending</span>
                    </div>
                    <span className="text-2xl font-black text-yellow-600">{stats.pendingApprovals || 0}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Key className="w-5 h-5" />
                  Change Password
                </button>
                <button
                  onClick={() => navigate('/admin/settings')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Platform Settings
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6">
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {activity.activityType || 'Activity'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column - Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-indigo-600" />
                  Personal Information
                </h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-bold hover:bg-indigo-200 transition-all flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditProfile({
                          name: profile.name,
                          email: profile.email,
                          phone: profile.phone,
                          bio: profile.bio,
                          location: profile.location,
                          website: profile.website,
                          dateOfBirth: profile.dateOfBirth
                        });
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editProfile.name || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-semibold">{profile.name || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={editProfile.email || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-semibold">{profile.email || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={editProfile.phone || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-semibold">{profile.phone || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editProfile.location || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-semibold">{profile.location || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                  {editMode ? (
                    <input
                      type="url"
                      value={editProfile.website || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-semibold">{profile.website || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={editProfile.dateOfBirth ? (typeof editProfile.dateOfBirth === 'string' && editProfile.dateOfBirth.includes('T') ? editProfile.dateOfBirth.split('T')[0] : editProfile.dateOfBirth) : ''}
                      onChange={(e) => setEditProfile({ ...editProfile, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-semibold">
                      {profile.dateOfBirth ? (typeof profile.dateOfBirth === 'string' ? new Date(profile.dateOfBirth).toLocaleDateString() : profile.dateOfBirth) : 'N/A'}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                {editMode ? (
                  <textarea
                    value={editProfile.bio || ''}
                    onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[100px]">
                    {profile.bio || 'No bio added yet.'}
                  </p>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-600" />
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <p className="px-4 py-3 bg-indigo-50 rounded-xl text-indigo-700 font-bold capitalize">
                    {profile.role?.replace('_', ' ') || 'Administrator'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Level</label>
                  <p className="px-4 py-3 bg-purple-50 rounded-xl text-purple-700 font-bold capitalize">
                    {profile.adminLevel === 'super' ? 'Super Administrator' : 'Standard Administrator'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Created</label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-semibold">
                    {stats.accountCreated ? new Date(stats.accountCreated).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Login</label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-semibold">
                    {stats.lastLogin ? new Date(stats.lastLogin).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Key className="w-6 h-6 text-indigo-600" />
                Change Password
              </h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Change Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;

