import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Heart,
  Trophy,
  AlertTriangle,
  Mail,
  ArrowRight,
  Activity,
  Coins,
  Zap,
  Star,
  Flame,
  BookOpen,
  Brain,
  Target,
  MessageSquare,
  Plus,
  Eye,
  BarChart3,
  Settings,
  CheckCircle,
  X,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const ParentOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [parentProfile, setParentProfile] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [childEmail, setChildEmail] = useState("");
  const [addingChild, setAddingChild] = useState(false);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [childrenRes, profileRes] = await Promise.all([
        api.get("/api/parent/children"),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      
      setChildren(childrenRes.data.children || []);
      setParentProfile(profileRes.data);

      // Calculate aggregate stats
      const childrenData = childrenRes.data.children || [];
      const totalChildren = childrenData.length;
      const totalXP = childrenData.reduce((sum, child) => sum + (child.xp || 0), 0);
      const totalCoins = childrenData.reduce((sum, child) => sum + (child.healCoins || 0), 0);
      const avgProgress = childrenData.length > 0 
        ? Math.round(childrenData.reduce((sum, child) => sum + (child.overallMastery || 0), 0) / childrenData.length)
        : 0;

      setStats({
        totalChildren,
        totalXP,
        totalCoins,
        avgProgress
      });

      // Mock recent activities
      setRecentActivities([
        { action: "Sarah completed Math Mission", time: "5 mins ago", icon: "🎯", child: "Sarah" },
        { action: "John earned 50 HealCoins", time: "15 mins ago", icon: "🪙", child: "John" },
        { action: "Sarah achieved new badge", time: "1 hour ago", icon: "🏆", child: "Sarah" },
      ]);
    } catch (error) {
      console.error("Error fetching overview data:", error);
      toast.error("Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async () => {
    if (!childEmail.trim()) {
      toast.error("Please enter child's email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(childEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setAddingChild(true);
      const response = await api.post("/api/parent/link-child", {
        childEmail: childEmail.trim(),
      });
      toast.success(response.data.message || "Child linked successfully!");
      setShowAddChildModal(false);
      setChildEmail("");
      fetchOverviewData();
    } catch (error) {
      console.error("Error linking child:", error);
      toast.error(error.response?.data?.message || "Failed to link child");
    } finally {
      setAddingChild(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-bold">{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
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

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-3xl p-12 shadow-2xl max-w-md"
        >
          <Users className="w-20 h-20 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            No Children Linked Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start by linking your child's account to monitor their progress
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddChildModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Link Child Account
          </motion.button>
        </motion.div>

        {/* Add Child Modal */}
        {showAddChildModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Link Child Account</h3>
              <input
                type="email"
                placeholder="Enter child's email address"
                value={childEmail}
                onChange={(e) => setChildEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddChildModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddChild}
                  disabled={addingChild}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {addingChild ? "Linking..." : "Link Child"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-black mb-2">
                Welcome back, {parentProfile?.name || "Parent"}! 👋
              </h1>
              <p className="text-lg text-white/90">
                Here's what's happening with your children today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/80">Today's Date</p>
                <p className="text-xl font-bold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddChildModal(true)}
                className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2 border-2 border-white/30"
              >
                <Plus className="w-5 h-5" />
                Link Child
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Children"
            value={stats.totalChildren || 0}
            icon={Users}
            color="from-purple-500 to-pink-600"
            trend="+1"
          />
          <StatCard
            title="Total XP Earned"
            value={stats.totalXP || 0}
            icon={Zap}
            color="from-blue-500 to-cyan-600"
            trend="+12%"
          />
          <StatCard
            title="Total HealCoins"
            value={stats.totalCoins || 0}
            icon={Coins}
            color="from-yellow-500 to-amber-600"
            trend="+8%"
          />
          <StatCard
            title="Avg Progress"
            value={`${stats.avgProgress || 0}%`}
            icon={Target}
            color="from-green-500 to-emerald-600"
            trend="+5%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - My Children */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Children */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="w-7 h-7 text-purple-600" />
                  My Children
                </h2>
                <button
                  onClick={() => navigate("/parent/children")}
                  className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map((child, idx) => {
                // Only log in development (never expose user data in production)
                if (import.meta.env.DEV) {
                  console.log('Child data:', { id: child._id, name: child.name });
                }
                return (
                <motion.div
                  key={child._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  onClick={() => navigate(`/parent/child/${child._id}/analytics`)}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 cursor-pointer hover:shadow-xl transition-all"
                >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={child.avatar || "/avatars/avatar1.png"}
                        alt={child.name}
                        className="w-16 h-16 rounded-full border-3 border-purple-300 shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {child.name}
                        </h3>
                        <p className="text-sm text-gray-600">{child.grade || "Student"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-blue-100 rounded-lg p-2 text-center">
                        <p className="text-lg font-black text-blue-700">
                          {child.level || 1}
                        </p>
                        <p className="text-xs text-blue-600">Level</p>
                      </div>
                      <div className="bg-amber-100 rounded-lg p-2 text-center">
                        <p className="text-lg font-black text-amber-700">
                          {child.xp || 0}
                        </p>
                        <p className="text-xs text-amber-600">XP</p>
                      </div>
                      <div className="bg-green-100 rounded-lg p-2 text-center">
                        <p className="text-lg font-black text-green-700">
                          {child.healCoins || 0}
                        </p>
                        <p className="text-xs text-green-600">Coins</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/parent/child/${child._id}/analytics`);
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Progress
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/parent/child/${child._id}/chat`);
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        title="Chat with teacher"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Teacher Chat</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                <Activity className="w-7 h-7 text-green-600" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivities.map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200"
                  >
                    <span className="text-3xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">
                        {activity.child} • {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions & Insights */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-200 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-purple-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.03, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/parent/children")}
                  className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-left">
                    Manage Children
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/parent/messages")}
                  className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-left">
                    Messages
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/parent/settings")}
                  className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-left">
                    Settings
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Quick Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Active Today
                    </span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-black text-green-600">
                    {children.filter((c) => c.lastActive).length}/{children.length}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Avg Engagement
                    </span>
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-blue-600">
                    {Math.round(stats.avgProgress || 0)}%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Messages Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-purple-600" />
                  Messages
                </h3>
              </div>
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">No new messages</p>
              </div>
              <button
                onClick={() => navigate("/parent/messages")}
                className="w-full mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center justify-center gap-2"
              >
                View All Messages <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Link Child Account</h3>
              <button
                onClick={() => setShowAddChildModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <input
              type="email"
              placeholder="Enter child's email address"
              value={childEmail}
              onChange={(e) => setChildEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddChild()}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddChildModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChild}
                disabled={addingChild}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addingChild ? "Linking..." : "Link Child"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ParentOverview;

