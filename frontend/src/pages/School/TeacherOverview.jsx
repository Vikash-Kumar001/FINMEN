import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  Plus,
  Mail,
  CheckCircle,
  Trophy,
  Activity,
  Target,
  ArrowRight,
  Calendar,
  Clock,
  BarChart3,
  MessageSquare,
  Sparkles,
  Gamepad2,
  Brain,
  Heart,
  Star,
  Flame,
  UserPlus,
  FileText,
  Award,
  Zap,
  TrendingDown,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import NewAssignmentModal from "../../components/NewAssignmentModal";
import InviteStudentsModal from "../../components/InviteStudentsModal";

const TeacherOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [classes, setClasses] = useState([]);
  const [studentsAtRisk, setStudentsAtRisk] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [classMastery, setClassMastery] = useState({});
  const [sessionEngagement, setSessionEngagement] = useState({});
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showInviteStudents, setShowInviteStudents] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        classesRes,
        atRiskRes,
        leaderboardRes,
        pendingRes,
        messagesRes,
        profileRes,
        masteryRes,
        engagementRes,
      ] = await Promise.all([
        api.get("/api/school/teacher/stats"),
        api.get("/api/school/teacher/classes"),
        api.get("/api/school/teacher/students-at-risk"),
        api.get("/api/school/teacher/leaderboard"),
        api.get("/api/school/teacher/pending-tasks"),
        api.get("/api/school/teacher/messages").catch(() => ({ data: { messages: [] } })),
        api.get("/api/user/profile").catch(() => ({ data: null })),
        api.get("/api/school/teacher/class-mastery"),
        api.get("/api/school/teacher/session-engagement"),
      ]);

      setStats(statsRes.data);
      const classesData = classesRes.data?.classes || [];
      console.log('Classes data:', classesData);
      setClasses(classesData);
      setStudentsAtRisk(atRiskRes.data.students || []);
      setLeaderboard(leaderboardRes.data.leaderboard || []);
      setPendingTasks(pendingRes.data.tasks || []);
      setMessages(messagesRes.data.messages || []);
      setTeacherProfile(profileRes.data);
      setClassMastery(masteryRes.data || {});
      setSessionEngagement(engagementRes.data || {});
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, onClick, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 cursor-pointer transition-all ${
        onClick ? "hover:shadow-xl hover:border-purple-300" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-bold">{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const QuickActionButton = ({ label, icon: Icon, color, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r ${color} text-white font-bold shadow-lg hover:shadow-xl transition-all`}
    >
      <Icon className="w-6 h-6" />
      {label}
    </motion.button>
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-4xl font-black mb-2">
                Welcome back, {teacherProfile?.name || "Teacher"}! 👋
              </h1>
              <p className="text-lg text-white/90">
                Here's what's happening with your classes today
              </p>
            </div>
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
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <QuickActionButton
            label="New Assignment"
            icon={Plus}
            color="from-purple-500 to-pink-600"
            onClick={() => setShowNewAssignment(true)}
          />
          <QuickActionButton
            label="Invite Students"
            icon={UserPlus}
            color="from-blue-500 to-cyan-600"
            onClick={() => setShowInviteStudents(true)}
          />
          <QuickActionButton
            label="View Messages"
            icon={Mail}
            color="from-green-500 to-emerald-600"
            onClick={() => navigate("/school-teacher/messages")}
          />
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents || 0}
            icon={Users}
            color="from-blue-500 to-cyan-600"
            trend="+5%"
            subtitle="Across all classes"
            onClick={() => navigate("/school-teacher/students")}
          />
          <StatCard
            title="Active Classes"
            value={Array.isArray(classes) ? classes.length : 0}
            icon={BookOpen}
            color="from-green-500 to-emerald-600"
            subtitle="Teaching this semester"
            onClick={() => navigate("/school-teacher/students")}
          />
          <StatCard
            title="At Risk Students"
            value={studentsAtRisk.length}
            icon={AlertCircle}
            color="from-red-500 to-pink-600"
            trend={studentsAtRisk.length > 5 ? "+3" : "-2"}
            subtitle="Needs attention"
            onClick={() => navigate("/school-teacher/analytics")}
          />
          <StatCard
            title="Pending Tasks"
            value={pendingTasks.length}
            icon={CheckCircle}
            color="from-amber-500 to-orange-600"
            subtitle="Assignments to grade"
            onClick={() => navigate("/school-teacher/tasks")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Classes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-purple-600" />
                  My Classes
                </h2>
                <button
                  onClick={() => navigate("/school-teacher/students")}
                  className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 transition-all"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Array.isArray(classes) ? classes : []).slice(0, 4).map((cls, idx) => {
                  // Ensure cls is an object and has the required properties
                  if (!cls || typeof cls !== 'object') {
                    console.warn('Invalid class object:', cls);
                    return null;
                  }
                  return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    onClick={() => navigate("/school-teacher/students")}
                    className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{cls.name || 'Unnamed Class'}</h3>
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-2xl font-black text-blue-600">{cls.studentCount || 0}</p>
                        <p className="text-xs text-gray-600">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-green-600">{Array.isArray(cls.subjects) ? cls.subjects.length : 0}</p>
                        <p className="text-xs text-gray-600">Subjects</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-purple-600">{cls.academicYear || '2024'}</p>
                        <p className="text-xs text-gray-600">Year</p>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Class Performance by Pillar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <BarChart3 className="w-7 h-7 text-green-600" />
                  Class Mastery by Pillar
                </h2>
                <button
                  onClick={() => navigate("/school-teacher/analytics")}
                  className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2 transition-all"
                >
                  Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {Object.entries(classMastery).slice(0, 6).map(([pillar, percentage], idx) => (
                  <motion.div
                    key={pillar}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{pillar}</span>
                      <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Trophy className="w-7 h-7 text-amber-500" />
                  Top Performers
                </h2>
              </div>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((student, idx) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => navigate(`/school-teacher/student/${student._id}/progress`)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-2 border-amber-200 cursor-pointer transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${
                        idx === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-500" :
                        idx === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500" :
                        idx === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" :
                        "bg-gradient-to-br from-blue-400 to-blue-500"
                      }`}>
                        {idx + 1}
                      </div>
                    </div>
                    <img
                      src={student.avatar || "/avatars/avatar1.png"}
                      alt={student.name}
                      className="w-12 h-12 rounded-full border-2 border-amber-300"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-600">Level {student.level} • {student.totalXP} XP</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-orange-600">{student.streak}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* At Risk Students */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  At Risk
                </h2>
                <button
                  onClick={() => navigate("/school-teacher/analytics")}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {studentsAtRisk.slice(0, 5).map((student, idx) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => navigate(`/school-teacher/student/${student._id}/progress`)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer transition-all"
                  >
                    <img
                      src={student.avatar || "/avatars/avatar1.png"}
                      alt={student.name}
                      className="w-10 h-10 rounded-full border-2 border-red-300"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                      <p className="text-xs text-red-600">{student.reason}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      student.riskLevel === "High" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                    }`}>
                      {student.riskLevel}
                    </div>
                  </motion.div>
                ))}
                {studentsAtRisk.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">All students doing well!</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Pending Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-500" />
                  Pending Tasks
                </h2>
                <button
                  onClick={() => navigate("/school-teacher/tasks")}
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {pendingTasks.slice(0, 4).map((task, idx) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => navigate("/school-teacher/tasks")}
                    className="p-3 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{task.title}</p>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        task.priority === "high" ? "bg-red-500 text-white" :
                        task.priority === "medium" ? "bg-amber-500 text-white" :
                        "bg-green-500 text-white"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{task.dueDate}</span>
                      <span className="mx-1">•</span>
                      <span>{task.class}</span>
                    </div>
                  </motion.div>
                ))}
                {pendingTasks.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">All caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-500" />
                  Recent Messages
                </h2>
                <button
                  onClick={() => navigate("/school-teacher/messages")}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                >
                  Inbox <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {messages.slice(0, 4).map((msg, idx) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => navigate("/school-teacher/messages")}
                    className={`p-3 rounded-lg ${
                      msg.read ? "bg-gray-50" : "bg-blue-50 border-2 border-blue-200"
                    } hover:bg-blue-100 cursor-pointer transition-all`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className={`font-semibold text-sm ${msg.read ? "text-gray-700" : "text-gray-900"}`}>
                        {msg.subject}
                      </p>
                      {!msg.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{msg.sender} • {msg.time}</p>
                  </motion.div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No new messages</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Engagement and Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Engagement Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-indigo-500" />
              Engagement
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Games</span>
                  <span className="text-sm font-bold text-gray-900">{sessionEngagement.games || 0}%</span>
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
                  <span className="text-sm font-semibold text-gray-700">Lessons</span>
                  <span className="text-sm font-bold text-gray-900">{sessionEngagement.lessons || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-600"
                    style={{ width: `${sessionEngagement.lessons || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* This Week Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              This Week
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Active Students</span>
                </div>
                <span className="text-2xl font-black">{stats.totalStudents || 2}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">Achievements</span>
                </div>
                <span className="text-2xl font-black">{leaderboard.length * 3 || 6}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Avg Engagement</span>
                </div>
                <span className="text-2xl font-black">{sessionEngagement.overall || 100}%</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/school-teacher/students")}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 rounded-lg font-semibold text-gray-900 transition-all flex items-center justify-between group"
              >
                <span>View All Students</span>
                <Users className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/school-teacher/analytics")}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 rounded-lg font-semibold text-gray-900 transition-all flex items-center justify-between group"
              >
                <span>Analytics Dashboard</span>
                <BarChart3 className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setShowNewAssignment(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 rounded-lg font-semibold text-gray-900 transition-all flex items-center justify-between group"
              >
                <span>Create Assignment</span>
                <Plus className="w-5 h-5 text-purple-600 group-hover:rotate-90 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/school-teacher/settings")}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-2 border-gray-200 rounded-lg font-semibold text-gray-900 transition-all flex items-center justify-between group"
              >
                <span>Settings</span>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <NewAssignmentModal
        isOpen={showNewAssignment}
        onClose={() => setShowNewAssignment(false)}
        onSuccess={fetchDashboardData}
      />

      <InviteStudentsModal
        isOpen={showInviteStudents}
        onClose={() => setShowInviteStudents(false)}
      />
    </div>
  );
};

export default TeacherOverview;
