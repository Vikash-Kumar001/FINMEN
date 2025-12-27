import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  Mail,
  Save,
  RefreshCw,
  Activity,
  Heart,
  Coins,
  MessageSquare,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const ParentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parentProfile, setParentProfile] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [overviewRes, profileRes] = await Promise.all([
        api.get("/api/parent/overview").catch(() => ({ data: null })),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      
      if (overviewRes?.data?.parent?.preferences?.notifications?.email !== undefined) {
        setEmailNotifications(overviewRes.data.parent.preferences.notifications.email);
      }
      setParentProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await api.put("/api/parent/email-notifications", { 
        enabled: emailNotifications 
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({ value, onChange, label, description, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition-all">
      <div className="flex items-start gap-3 flex-1">
        <div className={`p-2.5 rounded-lg ${value ? 'bg-indigo-100' : 'bg-slate-100'}`}>
          <Icon className={`w-5 h-5 ${value ? 'text-indigo-600' : 'text-slate-400'}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 mb-0.5">{label}</h4>
          <p className="text-xs text-slate-600">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
          value ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
            value ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Settings
                </h1>
                <p className="text-sm text-white/80">
                  Manage your notification preferences
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Available Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <Activity className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">Progress Tracking</p>
                <p className="text-xs text-slate-600">View your child's learning progress</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <Heart className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">Mood Tracking</p>
                <p className="text-xs text-slate-600">Monitor your child's wellbeing</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <Coins className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">HealCoins & Rewards</p>
                <p className="text-xs text-slate-600">Track wallet and transactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <MessageSquare className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">Messages</p>
                <p className="text-xs text-slate-600">Communicate with school</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Notification Preferences
              </h2>
              <p className="text-xs text-slate-600">
                Control how you receive updates about your child
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <ToggleSwitch
              value={emailNotifications}
              onChange={setEmailNotifications}
              label="Email Notifications"
              description="Receive updates about your child's activities via email"
              icon={Mail}
            />
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                Save Changes
              </h3>
              <p className="text-xs text-slate-600">
                Your settings will be applied immediately
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
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

