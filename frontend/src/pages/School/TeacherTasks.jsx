import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Star,
  Target,
  BookOpen,
  FileText,
  TrendingUp,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import NewAssignmentModal from "../../components/NewAssignmentModal";

const TeacherTasks = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, profileRes] = await Promise.all([
        api.get("/api/school/teacher/assignments"),
        api.get("/api/user/profile"),
      ]);

      setAssignments(assignmentsRes.data || []);
      setTeacherProfile(profileRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await api.delete(`/api/school/teacher/assignments/${assignmentId}`);
      toast.success("Assignment deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
    const matchesPriority = filterPriority === "all" || assignment.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === "pending").length,
    inProgress: assignments.filter(a => a.status === "in_progress" || a.status === "published").length,
    completed: assignments.filter(a => a.status === "completed" || a.status === "approved").length,
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
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-black mb-2">
                Assignments & Tasks
              </h1>
              <p className="text-lg text-white/90">
                {teacherProfile?.name}'s assignment management dashboard
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewAssignment(true)}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Assignment
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Assignments</p>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-black text-gray-900">{stats.pending}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
            <p className="text-3xl font-black text-gray-900">{stats.inProgress}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-black text-gray-900">{stats.completed}</p>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white font-semibold"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white font-semibold"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </motion.div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.length === 0 ? (
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Assignments Found</h3>
              <p className="text-gray-500 mb-6">Create your first assignment to get started</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewAssignment(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all inline-flex items-center gap-3"
              >
                <Plus className="w-6 h-6" />
                Create First Assignment
              </motion.button>
            </div>
          ) : (
            filteredAssignments.map((assignment, idx) => (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                      {assignment.approvalRequired && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        {assignment.subject}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        assignment.priority === "high" ? "bg-red-500 text-white" :
                        assignment.priority === "medium" ? "bg-amber-500 text-white" :
                        "bg-green-500 text-white"
                      }`}>
                        {assignment.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        assignment.status === "completed" || assignment.status === "approved" ? "bg-green-100 text-green-700" :
                        assignment.status === "in_progress" || assignment.status === "published" ? "bg-blue-100 text-blue-700" :
                        assignment.status === "pending_approval" ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {assignment.status?.replace(/_/g, " ") || "pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssignment(assignment);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </motion.button>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{assignment.className || "Multiple Classes"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{assignment.modules?.length || 0} modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{assignment.healCoinsReward || 100} coins</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {assignment.submissions && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Submissions</span>
                      <span className="text-xs font-bold text-gray-900">
                        {assignment.submissions?.length || 0} / {assignment.totalStudents || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                        style={{
                          width: `${
                            assignment.totalStudents
                              ? (assignment.submissions.length / assignment.totalStudents) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t-2 border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAssignment(assignment._id);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* No assignments message included in grid above */}
      </div>

      {/* New Assignment Modal */}
      <NewAssignmentModal
        isOpen={showNewAssignment}
        onClose={() => setShowNewAssignment(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default TeacherTasks;
