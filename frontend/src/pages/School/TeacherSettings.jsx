import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Bell,
  Mail,
  Eye,
  Users,
  Lock,
  Globe,
  Smartphone,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  BarChart3,
  MessageSquare,
  Clock,
  Calendar,
  Zap,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const TeacherSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [classroomSettings, setClassroomSettings] = useState({
    autoGradeQuizzes: true,
    allowLateSubmissions: true,
    showStudentProgress: true,
    enablePeerReview: false,
    trackAttendance: true,
    allowParentAccess: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newSubmissionAlerts: true,
    lowEngagementAlerts: true,
    parentMessageAlerts: true,
    weeklyReports: true,
    dailyDigest: false,
    upcomingDeadlineReminders: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareProgressWithParents: true,
    shareProgressWithAdmin: true,
    allowDataAnalytics: true,
    profileVisibility: "school",
  });

  const [displaySettings, setDisplaySettings] = useState({
    defaultView: "grid",
    studentsPerPage: 20,
    showAvatars: true,
    darkMode: false,
    compactView: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [settingsRes, profileRes] = await Promise.all([
        api.get("/api/school/teacher/settings").catch(() => ({ data: {} })),
        api.get("/api/user/profile").catch(() => ({ data: null })),
      ]);

      if (settingsRes.data.classroom) {
        setClassroomSettings(settingsRes.data.classroom);
      }
      if (settingsRes.data.notifications) {
        setNotificationSettings(settingsRes.data.notifications);
      }
      if (settingsRes.data.privacy) {
        setPrivacySettings(settingsRes.data.privacy);
      }
      if (settingsRes.data.display) {
        setDisplaySettings(settingsRes.data.display);
      }
      setTeacherProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await api.put("/api/school/teacher/settings", {
        classroom: classroomSettings,
        notifications: notificationSettings,
        privacy: privacySettings,
        display: displaySettings,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const SettingToggle = ({ title, description, value, onChange, icon: Icon, color = "purple" }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all"
    >
      <div className="flex items-start gap-4 flex-1">
        <div
          className={`p-3 rounded-lg ${
            value
              ? `bg-gradient-to-br from-${color}-100 to-${color}-100`
              : "bg-gray-100"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              value ? `text-${color}-600` : "text-gray-400"
            }`}
          />
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

  const SelectSetting = ({ title, description, value, onChange, options, icon: Icon }) => (
    <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
      <div className="flex items-start gap-4 mb-3">
        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none bg-white font-medium"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Settings className="w-10 h-10" />
              {teacherProfile?.name || "Teacher"}'s Settings
            </h1>
            <p className="text-lg text-white/90">
              Customize your teaching experience and preferences
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-4">
        {/* Classroom Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border-2 border-blue-200 p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Classroom Management
              </h2>
              <p className="text-sm text-gray-600">
                Configure how you manage your classes and students
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <SettingToggle
              title="Auto-Grade Quizzes"
              description="Automatically grade multiple-choice and objective questions"
              value={classroomSettings.autoGradeQuizzes}
              onChange={(val) =>
                setClassroomSettings({ ...classroomSettings, autoGradeQuizzes: val })
              }
              icon={CheckCircle}
              color="blue"
            />
            <SettingToggle
              title="Allow Late Submissions"
              description="Students can submit assignments after the deadline"
              value={classroomSettings.allowLateSubmissions}
              onChange={(val) =>
                setClassroomSettings({ ...classroomSettings, allowLateSubmissions: val })
              }
              icon={Clock}
              color="blue"
            />
            <SettingToggle
              title="Show Student Progress"
              description="Display progress bars and performance metrics to students"
              value={classroomSettings.showStudentProgress}
              onChange={(val) =>
                setClassroomSettings({ ...classroomSettings, showStudentProgress: val })
              }
              icon={BarChart3}
              color="blue"
            />
            <SettingToggle
              title="Enable Peer Review"
              description="Allow students to review each other's work"
              value={classroomSettings.enablePeerReview}
              onChange={(val) =>
                setClassroomSettings({ ...classroomSettings, enablePeerReview: val })
              }
              icon={Users}
              color="blue"
            />
            <SettingToggle
              title="Track Attendance"
              description="Monitor student attendance and engagement"
              value={classroomSettings.trackAttendance}
              onChange={(val) =>
                setClassroomSettings({ ...classroomSettings, trackAttendance: val })
              }
              icon={Calendar}
              color="blue"
            />
            <SettingToggle
              title="Allow Parent Access"
              description="Parents can view their child's progress in your class"
              value={classroomSettings.allowParentAccess}
              onChange={(val) =>
                setClassroomSettings({ ...classroomSettings, allowParentAccess: val })
              }
              icon={Shield}
              color="blue"
            />
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border-2 border-purple-200 p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Notification Preferences
              </h2>
              <p className="text-sm text-gray-600">
                Choose how you want to receive updates and alerts
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <SettingToggle
              title="Email Notifications"
              description="Receive updates and alerts via email"
              value={notificationSettings.emailNotifications}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  emailNotifications: val,
                })
              }
              icon={Mail}
            />
            <SettingToggle
              title="SMS Notifications"
              description="Get important alerts via text message"
              value={notificationSettings.smsNotifications}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  smsNotifications: val,
                })
              }
              icon={Smartphone}
            />
            <SettingToggle
              title="Push Notifications"
              description="Browser notifications for real-time updates"
              value={notificationSettings.pushNotifications}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  pushNotifications: val,
                })
              }
              icon={Zap}
            />
            <SettingToggle
              title="New Submission Alerts"
              description="Get notified when students submit assignments"
              value={notificationSettings.newSubmissionAlerts}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  newSubmissionAlerts: val,
                })
              }
              icon={CheckCircle}
            />
            <SettingToggle
              title="Low Engagement Alerts"
              description="Alert when student engagement drops below threshold"
              value={notificationSettings.lowEngagementAlerts}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  lowEngagementAlerts: val,
                })
              }
              icon={AlertTriangle}
            />
            <SettingToggle
              title="Parent Message Alerts"
              description="Get notified when parents send messages"
              value={notificationSettings.parentMessageAlerts}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  parentMessageAlerts: val,
                })
              }
              icon={MessageSquare}
            />
            <SettingToggle
              title="Weekly Reports"
              description="Receive weekly summary of class performance"
              value={notificationSettings.weeklyReports}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  weeklyReports: val,
                })
              }
              icon={BarChart3}
            />
            <SettingToggle
              title="Daily Digest"
              description="Daily summary of activities and updates"
              value={notificationSettings.dailyDigest}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  dailyDigest: val,
                })
              }
              icon={Calendar}
            />
            <SettingToggle
              title="Upcoming Deadline Reminders"
              description="Reminders for assignment and grading deadlines"
              value={notificationSettings.upcomingDeadlineReminders}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  upcomingDeadlineReminders: val,
                })
              }
              icon={Clock}
            />
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border-2 border-green-200 p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Privacy & Data Sharing
              </h2>
              <p className="text-sm text-gray-600">
                Control who can access student data and analytics
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <SettingToggle
              title="Share Progress with Parents"
              description="Allow parents to view their child's progress in your class"
              value={privacySettings.shareProgressWithParents}
              onChange={(val) =>
                setPrivacySettings({
                  ...privacySettings,
                  shareProgressWithParents: val,
                })
              }
              icon={Users}
              color="green"
            />
            <SettingToggle
              title="Share Progress with Admin"
              description="School administrators can view your class analytics"
              value={privacySettings.shareProgressWithAdmin}
              onChange={(val) =>
                setPrivacySettings({
                  ...privacySettings,
                  shareProgressWithAdmin: val,
                })
              }
              icon={Eye}
              color="green"
            />
            <SettingToggle
              title="Allow Data Analytics"
              description="Contribute anonymized data to improve platform features"
              value={privacySettings.allowDataAnalytics}
              onChange={(val) =>
                setPrivacySettings({
                  ...privacySettings,
                  allowDataAnalytics: val,
                })
              }
              icon={BarChart3}
              color="green"
            />
            <SelectSetting
              title="Profile Visibility"
              description="Who can see your teacher profile"
              value={privacySettings.profileVisibility}
              onChange={(val) =>
                setPrivacySettings({
                  ...privacySettings,
                  profileVisibility: val,
                })
              }
              options={[
                { value: "school", label: "School Only" },
                { value: "parents", label: "School & Parents" },
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
              ]}
              icon={Globe}
            />
          </div>
        </motion.div>

        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border-2 border-amber-200 p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Display Preferences
              </h2>
              <p className="text-sm text-gray-600">
                Customize how information is displayed
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <SelectSetting
              title="Default Student View"
              description="How students are displayed by default"
              value={displaySettings.defaultView}
              onChange={(val) =>
                setDisplaySettings({ ...displaySettings, defaultView: val })
              }
              options={[
                { value: "grid", label: "Grid View" },
                { value: "list", label: "List View" },
                { value: "table", label: "Table View" },
              ]}
              icon={Users}
            />
            <SelectSetting
              title="Students Per Page"
              description="Number of students to show per page"
              value={displaySettings.studentsPerPage}
              onChange={(val) =>
                setDisplaySettings({
                  ...displaySettings,
                  studentsPerPage: parseInt(val),
                })
              }
              options={[
                { value: "10", label: "10 Students" },
                { value: "20", label: "20 Students" },
                { value: "50", label: "50 Students" },
                { value: "100", label: "100 Students" },
              ]}
              icon={Users}
            />
            <SettingToggle
              title="Show Student Avatars"
              description="Display student profile pictures in lists"
              value={displaySettings.showAvatars}
              onChange={(val) =>
                setDisplaySettings({ ...displaySettings, showAvatars: val })
              }
              icon={Users}
              color="amber"
            />
            <SettingToggle
              title="Compact View"
              description="Show more information in less space"
              value={displaySettings.compactView}
              onChange={(val) =>
                setDisplaySettings({ ...displaySettings, compactView: val })
              }
              icon={Eye}
              color="amber"
            />
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Save All Changes
              </h3>
              <p className="text-sm text-gray-600">
                Your settings will be applied immediately
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
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

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-200 p-6 mt-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-600" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-bold text-gray-900">{teacherProfile?.email || "N/A"}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Role</p>
              <p className="font-bold text-gray-900 capitalize">
                {teacherProfile?.role?.replace("_", " ") || "Teacher"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Member Since</p>
              <p className="font-bold text-gray-900">
                {teacherProfile?.createdAt
                  ? new Date(teacherProfile.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherSettings;

