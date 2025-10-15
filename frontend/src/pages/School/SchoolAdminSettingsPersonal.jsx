import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Bell, Lock, Eye, Globe, Moon, Sun, Monitor, Save, Shield,
  Mail, MessageSquare, Smartphone, Calendar, Clock, Languages, Palette,
  CheckCircle, AlertCircle, Volume2, VolumeX, Database, Download, Trash2,
  ArrowRight
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminSettingsPersonal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  const [notificationSettings, setNotificationSettings] = useState({
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
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmailToTeachers: true,
    showPhoneToTeachers: false,
    allowDataExport: true,
    twoFactorAuth: false,
    sessionTimeout: 30
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    timezone: 'Asia/Kolkata',
    compactMode: false,
    animationsEnabled: true,
    soundEnabled: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/settings');
      if (response.data.settings) {
        setNotificationSettings(response.data.settings.notifications || notificationSettings);
        setPrivacySettings(response.data.settings.privacy || privacySettings);
        setDisplaySettings(response.data.settings.display || displaySettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await api.put('/api/user/settings', {
        section: 'notifications',
        settings: notificationSettings
      });
      toast.success('Notification settings saved!');
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setSaving(true);
      await api.put('/api/user/settings', {
        section: 'privacy',
        settings: privacySettings
      });
      toast.success('Privacy settings saved!');
    } catch (error) {
      console.error('Error saving privacy:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDisplay = async () => {
    try {
      setSaving(true);
      await api.put('/api/user/settings', {
        section: 'display',
        settings: displaySettings
      });
      toast.success('Display settings saved!');
    } catch (error) {
      console.error('Error saving display:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      toast.loading('Preparing your data export...');
      const response = await api.get('/api/user/export-data', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `my-data-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.dismiss();
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Settings className="w-10 h-10" />
              Account Settings
            </h1>
            <p className="text-lg text-white/90">Customize your account preferences</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-2 mb-6 flex gap-2 flex-wrap"
        >
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 min-w-[140px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 min-w-[140px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('display')}
            className={`flex-1 min-w-[140px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'display'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            Display
          </button>
        </motion.div>

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-purple-600" />
              Notification Preferences
            </h2>

            <div className="space-y-6">
              {/* Notification Channels */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Notification Channels</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-bold text-gray-900">Email Notifications</p>
                      <p className="text-xs text-gray-600">Receive updates via email</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <Bell className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-bold text-gray-900">Push Notifications</p>
                      <p className="text-xs text-gray-600">Browser notifications</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-bold text-gray-900">SMS Notifications</p>
                      <p className="text-xs text-gray-600">Text message alerts</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">What to notify me about</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyOnApproval}
                      onChange={(e) => setNotificationSettings({...notificationSettings, notifyOnApproval: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Approval Requests</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyOnAssignment}
                      onChange={(e) => setNotificationSettings({...notificationSettings, notifyOnAssignment: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">New Assignments</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyOnWellbeing}
                      onChange={(e) => setNotificationSettings({...notificationSettings, notifyOnWellbeing: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Wellbeing Alerts</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyOnSystemUpdates}
                      onChange={(e) => setNotificationSettings({...notificationSettings, notifyOnSystemUpdates: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">System Updates</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyOnNewStudent}
                      onChange={(e) => setNotificationSettings({...notificationSettings, notifyOnNewStudent: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">New Student Added</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyOnAttendanceAlert}
                      onChange={(e) => setNotificationSettings({...notificationSettings, notifyOnAttendanceAlert: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Attendance Alerts</span>
                  </label>
                </div>
              </div>

              {/* Email Digest */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Email Digest Frequency</h3>
                <select
                  value={notificationSettings.digestFrequency}
                  onChange={(e) => setNotificationSettings({...notificationSettings, digestFrequency: e.target.value})}
                  className="w-full md:w-1/2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                >
                  <option value="realtime">Real-time (Instant)</option>
                  <option value="hourly">Hourly Digest</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Digest</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Notifications'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-purple-600" />
              Privacy & Security
            </h2>

            <div className="space-y-6">
              {/* Visibility Settings */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Profile Visibility</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={privacySettings.showEmailToTeachers}
                      onChange={(e) => setPrivacySettings({...privacySettings, showEmailToTeachers: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Show email to teachers</p>
                      <p className="text-xs text-gray-600">Teachers can see your email address</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={privacySettings.showPhoneToTeachers}
                      onChange={(e) => setPrivacySettings({...privacySettings, showPhoneToTeachers: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Show phone to teachers</p>
                      <p className="text-xs text-gray-600">Teachers can see your phone number</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Security Settings */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Security</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={privacySettings.twoFactorAuth}
                      onChange={(e) => setPrivacySettings({...privacySettings, twoFactorAuth: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-600">Add extra security to your account</p>
                    </div>
                  </label>

                  <div className="p-4 border-2 border-gray-200 rounded-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <select
                      value={privacySettings.sessionTimeout}
                      onChange={(e) => setPrivacySettings({...privacySettings, sessionTimeout: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={0}>Never timeout</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Data Management</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={privacySettings.allowDataExport}
                      onChange={(e) => setPrivacySettings({...privacySettings, allowDataExport: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <Database className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-bold text-gray-900">Allow Data Export</p>
                      <p className="text-xs text-gray-600">Enable downloading your data</p>
                    </div>
                  </label>

                  <button
                    onClick={handleExportData}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="font-bold text-gray-900">Export My Data</p>
                        <p className="text-xs text-gray-600">Download all your account data (JSON)</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSavePrivacy}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Privacy Settings'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Display Tab */}
        {activeTab === 'display' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Palette className="w-6 h-6 text-purple-600" />
              Display Preferences
            </h2>

            <div className="space-y-6">
              {/* Theme */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    displaySettings.theme === 'light' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={displaySettings.theme === 'light'}
                      onChange={(e) => setDisplaySettings({...displaySettings, theme: e.target.value})}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <p className="font-bold text-gray-900">Light</p>
                    </div>
                  </label>

                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    displaySettings.theme === 'dark' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={displaySettings.theme === 'dark'}
                      onChange={(e) => setDisplaySettings({...displaySettings, theme: e.target.value})}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Moon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <p className="font-bold text-gray-900">Dark</p>
                    </div>
                  </label>

                  <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    displaySettings.theme === 'auto' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="theme"
                      value="auto"
                      checked={displaySettings.theme === 'auto'}
                      onChange={(e) => setDisplaySettings({...displaySettings, theme: e.target.value})}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-bold text-gray-900">Auto</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Formats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
                  <select
                    value={displaySettings.language}
                    onChange={(e) => setDisplaySettings({...displaySettings, language: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date Format</label>
                  <select
                    value={displaySettings.dateFormat}
                    onChange={(e) => setDisplaySettings({...displaySettings, dateFormat: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Time Format</label>
                  <select
                    value={displaySettings.timeFormat}
                    onChange={(e) => setDisplaySettings({...displaySettings, timeFormat: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                  >
                    <option value="12h">12-hour (AM/PM)</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Timezone</label>
                  <select
                    value={displaySettings.timezone}
                    onChange={(e) => setDisplaySettings({...displaySettings, timezone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                </div>
              </div>

              {/* UI Preferences */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">UI Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={displaySettings.compactMode}
                      onChange={(e) => setDisplaySettings({...displaySettings, compactMode: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Compact Mode</p>
                      <p className="text-xs text-gray-600">Show more content in less space</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={displaySettings.animationsEnabled}
                      onChange={(e) => setDisplaySettings({...displaySettings, animationsEnabled: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Enable Animations</p>
                      <p className="text-xs text-gray-600">Smooth transitions and effects</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={displaySettings.soundEnabled}
                      onChange={(e) => setDisplaySettings({...displaySettings, soundEnabled: e.target.checked})}
                      className="w-5 h-5"
                    />
                    {displaySettings.soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-purple-600" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900">Sound Effects</p>
                      <p className="text-xs text-gray-600">Play sounds for notifications</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveDisplay}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Display Settings'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchoolAdminSettingsPersonal;

