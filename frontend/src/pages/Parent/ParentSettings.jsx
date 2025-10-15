import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Mail,
  Smartphone,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Users,
  Activity,
  MessageSquare,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const ParentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parentProfile, setParentProfile] = useState(null);
  const [permissions, setPermissions] = useState({
    canViewProgress: true,
    canViewMood: true,
    canViewTransactions: true,
    canViewMessages: true,
    canManageRewards: false,
    canSetGoals: true,
    receiveEmailNotifications: true,
    receiveSMSNotifications: false,
    weeklyReports: true,
    monthlyReports: true,
    alertOnLowEngagement: true,
    alertOnMoodChanges: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyDigest: true,
    monthlyReport: true,
    achievementAlerts: true,
    lowEngagementAlerts: true,
    moodChangeAlerts: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [settingsRes, profileRes] = await Promise.all([
        api.get("/api/parent/settings"),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      
      if (settingsRes.data.permissions) {
        setPermissions(settingsRes.data.permissions);
      }
      if (settingsRes.data.notifications) {
        setNotificationSettings(settingsRes.data.notifications);
      }
      setParentProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePermissions = async () => {
    try {
      setSaving(true);
      await api.put("/api/parent/settings", {
        permissions,
        notifications: notificationSettings,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const PermissionToggle = ({ title, description, value, onChange, icon: Icon }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all"
    >
      <div className="flex items-start gap-4 flex-1">
        <div className={`p-3 rounded-lg ${value ? 'bg-gradient-to-br from-purple-100 to-pink-100' : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${value ? 'text-purple-600' : 'text-gray-400'}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!value)}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
          value
            ? "bg-gradient-to-r from-purple-500 to-pink-600"
            : "bg-gray-300"
        }`}
      >
        <motion.div
          animate={{ x: value ? 28 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
        />
      </motion.button>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Settings className="w-10 h-10" />
              {parentProfile?.name || "Parent"}'s Settings
            </h1>
            <p className="text-lg text-white/90">
              Manage your account settings and child monitoring permissions
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-4">
        {/* Monitoring Permissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border-2 border-purple-200 p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Monitoring Permissions
              </h2>
              <p className="text-sm text-gray-600">
                Control what you can view and manage
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <PermissionToggle
              title="View Progress & Analytics"
              description="Access detailed progress reports and learning analytics"
              value={permissions.canViewProgress}
              onChange={(val) =>
                setPermissions({ ...permissions, canViewProgress: val })
              }
              icon={Activity}
            />
            <PermissionToggle
              title="View Mood Tracking"
              description="Monitor your child's mood logs and mental wellbeing"
              value={permissions.canViewMood}
              onChange={(val) =>
                setPermissions({ ...permissions, canViewMood: val })
              }
              icon={Eye}
            />
            <PermissionToggle
              title="View Transactions & Wallet"
              description="See HealCoins transactions and wallet balance"
              value={permissions.canViewTransactions}
              onChange={(val) =>
                setPermissions({ ...permissions, canViewTransactions: val })
              }
              icon={Lock}
            />
            <PermissionToggle
              title="View Messages"
              description="Access messages and communications from school"
              value={permissions.canViewMessages}
              onChange={(val) =>
                setPermissions({ ...permissions, canViewMessages: val })
              }
              icon={MessageSquare}
            />
            <PermissionToggle
              title="Manage Rewards"
              description="Approve or restrict reward redemptions"
              value={permissions.canManageRewards}
              onChange={(val) =>
                setPermissions({ ...permissions, canManageRewards: val })
              }
              icon={CheckCircle}
            />
            <PermissionToggle
              title="Set Learning Goals"
              description="Create and manage learning goals for your child"
              value={permissions.canSetGoals}
              onChange={(val) =>
                setPermissions({ ...permissions, canSetGoals: val })
              }
              icon={Users}
            />
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border-2 border-blue-200 p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Notification Preferences
              </h2>
              <p className="text-sm text-gray-600">
                Choose how you want to receive updates
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <PermissionToggle
              title="Email Notifications"
              description="Receive updates via email"
              value={notificationSettings.emailNotifications}
              onChange={(val) =>
                setNotificationSettings({ ...notificationSettings, emailNotifications: val })
              }
              icon={Mail}
            />
            <PermissionToggle
              title="SMS Notifications"
              description="Get important alerts via SMS"
              value={notificationSettings.smsNotifications}
              onChange={(val) =>
                setNotificationSettings({ ...notificationSettings, smsNotifications: val })
              }
              icon={Smartphone}
            />
            <PermissionToggle
              title="Weekly Digest"
              description="Weekly summary of your child's activities"
              value={notificationSettings.weeklyDigest}
              onChange={(val) =>
                setNotificationSettings({ ...notificationSettings, weeklyDigest: val })
              }
              icon={RefreshCw}
            />
            <PermissionToggle
              title="Monthly Report"
              description="Comprehensive monthly progress report"
              value={notificationSettings.monthlyReport}
              onChange={(val) =>
                setNotificationSettings({ ...notificationSettings, monthlyReport: val })
              }
              icon={CheckCircle}
            />
            <PermissionToggle
              title="Achievement Alerts"
              description="Get notified when your child earns achievements"
              value={notificationSettings.achievementAlerts}
              onChange={(val) =>
                setNotificationSettings({ ...notificationSettings, achievementAlerts: val })
              }
              icon={CheckCircle}
            />
            <PermissionToggle
              title="Low Engagement Alerts"
              description="Alert when child's engagement drops below threshold"
              value={notificationSettings.lowEngagementAlerts}
              onChange={(val) =>
                setNotificationSettings({ ...notificationSettings, lowEngagementAlerts: val })
              }
              icon={AlertTriangle}
            />
            <PermissionToggle
              title="Mood Change Alerts"
              description="Get notified about significant mood pattern changes"
              value={notificationSettings.moodChangeAlerts}
              onChange={(val) =>
                setNotificationSettings({ ...notificationSettings, moodChangeAlerts: val })
              }
              icon={Eye}
            />
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Save Changes
              </h3>
              <p className="text-sm text-gray-600">
                Your settings will be applied immediately
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSavePermissions}
              disabled={saving}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-3"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentSettings;

