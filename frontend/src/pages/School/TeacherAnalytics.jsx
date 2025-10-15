import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Trophy,
  Target,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Zap,
  Brain,
  Heart,
  Sparkles,
  Globe,
  Shield,
  BookOpen,
  Activity,
  ArrowRight,
  Mail,
  Plus,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import NewAssignmentModal from "../../components/NewAssignmentModal";
import InviteStudentsModal from "../../components/InviteStudentsModal";

const TeacherAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [classMastery, setClassMastery] = useState({});
  const [studentsAtRisk, setStudentsAtRisk] = useState([]);
  const [sessionEngagement, setSessionEngagement] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [selectedClass, setSelectedClass] = useState("all");
  const [classes, setClasses] = useState([]);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showInviteStudents, setShowInviteStudents] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange, selectedClass]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [
        masteryRes,
        atRiskRes,
        engagementRes,
        leaderboardRes,
        profileRes,
        classesRes,
      ] = await Promise.all([
        api.get("/api/school/teacher/class-mastery"),
        api.get("/api/school/teacher/students-at-risk"),
        api.get("/api/school/teacher/session-engagement"),
        api.get("/api/school/teacher/leaderboard"),
        api.get("/api/user/profile"),
        api.get("/api/school/teacher/classes"),
      ]);

      setClassMastery(masteryRes.data || {});
      setStudentsAtRisk(atRiskRes.data.students || []);
      setSessionEngagement(engagementRes.data || {});
      setLeaderboard(leaderboardRes.data.leaderboard || []);
      setTeacherProfile(profileRes.data);
      setClasses(classesRes.data || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const pillarIcons = {
    "Financial Literacy": "💰",
    "Brain Health": "🧠",
    "UVLS": "❤️",
    "Digital Citizenship": "🌐",
    "Moral Values": "🛡️",
    "AI for All": "✨",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2">
              Class Analytics Dashboard
            </h1>
            <p className="text-lg text-white/90">
              {teacherProfile?.name}'s comprehensive class performance insights
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-8 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.name} value={cls.name}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export Report
          </motion.button>
        </motion.div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pillar Mastery Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-purple-600" />
                Educational Pillar Mastery
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(classMastery).map(([pillar, percentage], idx) => (
                <motion.div
                  key={pillar}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{pillarIcons[pillar] || "📚"}</span>
                      <span className="text-sm font-bold text-gray-900">{pillar}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-gray-900">{percentage}%</span>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        percentage >= 75 ? "bg-green-100 text-green-700" :
                        percentage >= 50 ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {percentage >= 75 ? "Excellent" : percentage >= 50 ? "Good" : "Needs Focus"}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full rounded-full ${
                          percentage >= 75
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : percentage >= 50
                            ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                            : "bg-gradient-to-r from-amber-500 to-orange-600"
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Overall Performance */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold mb-4">Overall Class Performance</h3>
              <div className="text-center">
                <div className="inline-block p-6 bg-white/20 rounded-full mb-3">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <p className="text-5xl font-black mb-2">
                  {Object.values(classMastery).length > 0
                    ? Math.round(Object.values(classMastery).reduce((a, b) => a + b, 0) / Object.values(classMastery).length)
                    : 0}%
                </p>
                <p className="text-sm opacity-90">Average Mastery</p>
              </div>
            </div>

            {/* Engagement Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Engagement Split
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      Games
                    </span>
                    <span className="text-sm font-bold">{sessionEngagement.games || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-600"
                      style={{ width: `${sessionEngagement.games || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      Lessons
                    </span>
                    <span className="text-sm font-bold">{sessionEngagement.lessons || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-600"
                      style={{ width: `${sessionEngagement.lessons || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Students at Risk Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-red-500" />
              Students Requiring Attention
            </h2>
            <button
              onClick={() => navigate("/school-teacher/students")}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {studentsAtRisk.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">All Students Doing Great!</h3>
              <p className="text-gray-600">No students currently at risk. Keep up the excellent work!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentsAtRisk.map((student, idx) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  onClick={() => navigate(`/school-teacher/student/${student._id}/progress`)}
                  className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={student.avatar || "/avatars/avatar1.png"}
                      alt={student.name}
                      className="w-12 h-12 rounded-full border-2 border-red-300"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-600">{student.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      student.riskLevel === "High" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                    }`}>
                      {student.riskLevel} Risk
                    </span>
                    <span className="text-xs text-gray-600">{student.metric}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Leaderboard & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-500" />
                Class Leaderboard
              </h2>
            </div>

            <div className="space-y-3">
              {leaderboard.map((student, idx) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => navigate(`/school-teacher/student/${student._id}/progress`)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-2 border-amber-200 cursor-pointer transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                      idx === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg" :
                      idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md" :
                      idx === 2 ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md" :
                      "bg-gradient-to-br from-blue-400 to-blue-500 text-white"
                    }`}>
                      {idx + 1}
                    </div>
                  </div>
                  <img
                    src={student.avatar || "/avatars/avatar1.png"}
                    alt={student.name}
                    className="w-14 h-14 rounded-full border-3 border-amber-300"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">{student.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-gray-600">Level {student.level}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs font-bold text-amber-600">{student.totalXP} XP</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-amber-600">{student.healCoins}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-orange-500">🔥</span>
                      <span className="font-bold text-orange-600">{student.streak}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Performance Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Class Average
              </h3>
              <div className="text-center">
                <p className="text-6xl font-black mb-2">
                  {Object.values(classMastery).length > 0
                    ? Math.round(Object.values(classMastery).reduce((a, b) => a + b, 0) / Object.values(classMastery).length)
                    : 0}%
                </p>
                <p className="text-sm opacity-90">Overall Mastery</p>
              </div>
            </div>

            {/* Insights Cards */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Key Insights
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Strong Performance</p>
                      <p className="text-xs text-green-700 mt-1">
                        {Object.entries(classMastery).filter(([, p]) => p >= 75).length} pillars above 75%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Needs Attention</p>
                      <p className="text-xs text-amber-700 mt-1">
                        {Object.entries(classMastery).filter(([, p]) => p < 50).length} pillars below 50%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Engagement Rate</p>
                      <p className="text-xs text-blue-700 mt-1">
                        {sessionEngagement.overall || 0}% active participation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Recommendations
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Focus on Weak Pillars</p>
                  <p className="text-xs text-purple-700">
                    Create targeted assignments for pillars below 50%
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Engage At-Risk Students</p>
                  <p className="text-xs text-blue-700">
                    {studentsAtRisk.length} students need individual attention
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={() => navigate("/school-teacher/students")}
            className="px-6 py-4 bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all font-bold text-gray-900 flex items-center justify-between"
          >
            <span>Manage Students</span>
            <Users className="w-6 h-6 text-purple-600" />
          </button>
          <button
            onClick={() => setShowNewAssignment(true)}
            className="px-6 py-4 bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all font-bold text-gray-900 flex items-center justify-between"
          >
            <span>Create Assignment</span>
            <Plus className="w-6 h-6 text-blue-600" />
          </button>
          <button
            onClick={() => navigate("/school-teacher/messages")}
            className="px-6 py-4 bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all font-bold text-gray-900 flex items-center justify-between"
          >
            <span>View Messages</span>
            <Mail className="w-6 h-6 text-green-600" />
          </button>
        </motion.div>
      </div>

      {/* Modals */}
      <NewAssignmentModal
        isOpen={showNewAssignment}
        onClose={() => setShowNewAssignment(false)}
        onSuccess={fetchAnalyticsData}
      />

      <InviteStudentsModal
        isOpen={showInviteStudents}
        onClose={() => setShowInviteStudents(false)}
      />
    </div>
  );
};

export default TeacherAnalytics;
