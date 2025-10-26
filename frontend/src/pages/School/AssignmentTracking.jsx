import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  BarChart3,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Target,
  Award,
  FileText,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AssignmentTracking = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentStats, setAssignmentStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [filter]); // Only fetch when filter changes, not when search term changes

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAssignments();
        if (selectedAssignment) {
          fetchAssignmentStats(selectedAssignment);
        }
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, selectedAssignment]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      // Remove server-side search - we'll do client-side filtering instead
      
      const response = await api.get(`/api/school/teacher/assignments?${params.toString()}`);
      if (response.data.success) {
        setAssignments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentStats = async (assignmentId) => {
    try {
      const response = await api.get(`/api/assignment-attempts/stats/${assignmentId}`);
      if (response.data.success) {
        setAssignmentStats(response.data.data);
        setSelectedAssignment(assignmentId);
      }
    } catch (error) {
      console.error('Error fetching assignment stats:', error);
      toast.error('Failed to load assignment statistics');
    }
  };

  // Use useMemo for efficient filtering without causing re-renders
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchesFilter = filter === 'all' || assignment.type === filter;
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [assignments, filter, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateCompletionRate = (stats) => {
    if (!stats || stats.completionStats.total === 0) return 0;
    return Math.round((stats.completionStats.submitted / stats.completionStats.total) * 100);
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportAssignmentData = (assignment) => {
    if (!assignmentStats) return;
    
    const csvData = [
      ['Student Name', 'Email', 'Score', 'Percentage', 'Submitted At', 'Time Spent', 'Status', 'Is Late'],
      ...assignmentStats.attempts.map(attempt => [
        attempt.student.name,
        attempt.student.email,
        attempt.totalScore,
        `${attempt.percentage}%`,
        formatDate(attempt.submittedAt),
        `${attempt.timeSpent}m`,
        attempt.status,
        attempt.isLate ? 'Yes' : 'No'
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${assignment.title}_submissions.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

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
              <h1 className="text-4xl font-black mb-2">Assignment Tracking 📊</h1>
              <p className="text-lg text-white/90">
                Monitor student progress and completion rates in real-time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                  autoRefresh 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchAssignments}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold shadow-lg transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
              >
                <option value="all">All Types</option>
                <option value="quiz">Quiz</option>
                <option value="test">Test</option>
                <option value="homework">Homework</option>
                <option value="classwork">Classwork</option>
                <option value="project">Project</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Assignments List */}
        <div className="grid gap-6">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-black text-gray-900">{assignment.title}</h3>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 text-lg">{assignment.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          <span className="font-semibold">{assignment.type}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span className="font-semibold">Due: {formatDate(assignment.dueDate)}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          <span className="font-semibold">{assignment.questions?.length || 0} questions</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          <span className="font-semibold">{assignment.totalMarks || 100} points</span>
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchAssignmentStats(assignment._id)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      View Stats
                    </motion.button>
                  </div>

                  {/* Quick Stats Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                      <div className="text-3xl font-black text-blue-600">
                        {assignment.stats?.totalAttempts || 0}
                      </div>
                      <div className="text-sm font-bold text-blue-700">Total Attempts</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="text-3xl font-black text-green-600">
                        {assignment.stats?.submittedAttempts || 0}
                      </div>
                      <div className="text-sm font-bold text-green-700">Submitted</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                      <div className="text-3xl font-black text-amber-600">
                        {assignment.stats?.pendingAttempts || 0}
                      </div>
                      <div className="text-sm font-bold text-amber-700">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                      <div className={`text-3xl font-black ${getCompletionColor(assignment.stats?.completionRate || 0)}`}>
                        {assignment.stats?.completionRate || 0}%
                      </div>
                      <div className="text-sm font-bold text-purple-700">Completion Rate</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12">
                <div className="p-6 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">No Assignments Found</h3>
                <p className="text-lg text-gray-600 mb-6">No assignments match your current filters.</p>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchAssignments}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Refresh Assignments
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Assignment Statistics Modal */}
        {assignmentStats && selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAssignmentStats(null)} />
            <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-white">Assignment Statistics 📊</h2>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => exportAssignmentData(assignmentStats.assignment)}
                      className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Export CSV
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAssignmentStats(null)}
                      className="p-3 hover:bg-white/20 rounded-xl transition-all"
                    >
                      <X className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Assignment Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignmentStats.assignment.title}</h3>
                  <p className="text-gray-600">Type: {assignmentStats.assignment.type} • Due: {formatDate(assignmentStats.assignment.dueDate)}</p>
                </div>

                {/* Completion Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-black text-green-600">{assignmentStats.completionStats.submitted}</div>
                        <div className="text-sm font-bold text-green-700">Submitted</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-black text-amber-600">{assignmentStats.completionStats.pending}</div>
                        <div className="text-sm font-bold text-amber-700">Pending</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-black text-blue-600">{assignmentStats.completionStats.total}</div>
                        <div className="text-sm font-bold text-blue-700">Total Students</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-3xl font-black ${getCompletionColor(assignmentStats.completionStats.completionRate)}`}>
                          {assignmentStats.completionStats.completionRate}%
                        </div>
                        <div className="text-sm font-bold text-purple-700">Completion Rate</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-200 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-black text-indigo-600">{assignmentStats.averageScore || 0}</div>
                        <div className="text-sm font-bold text-indigo-700">Average Score</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-black text-orange-600">{assignmentStats.averageTimeSpent || 0}m</div>
                        <div className="text-sm font-bold text-orange-700">Avg Time Spent</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-200 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-black text-pink-600">{assignmentStats.recentActivity || 0}</div>
                        <div className="text-sm font-bold text-pink-700">Recent Activity (7d)</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Score Distribution */}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Score Distribution 📈</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg"
                    >
                      <div className="text-3xl font-black text-green-600">{assignmentStats.scoreDistribution.excellent}</div>
                      <div className="text-sm font-bold text-green-700">Excellent (90%+)</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 shadow-lg"
                    >
                      <div className="text-3xl font-black text-blue-600">{assignmentStats.scoreDistribution.good}</div>
                      <div className="text-sm font-bold text-blue-700">Good (70-89%)</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-lg"
                    >
                      <div className="text-3xl font-black text-amber-600">{assignmentStats.scoreDistribution.average}</div>
                      <div className="text-sm font-bold text-amber-700">Average (50-69%)</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200 shadow-lg"
                    >
                      <div className="text-3xl font-black text-red-600">{assignmentStats.scoreDistribution.poor}</div>
                      <div className="text-sm font-bold text-red-700">Poor (&lt;50%)</div>
                    </motion.div>
                  </div>
                </div>

                {/* Question-wise Statistics */}
                {assignmentStats.questionStats && assignmentStats.questionStats.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">Question Performance 🎯</h3>
                    <div className="space-y-4">
                      {assignmentStats.questionStats.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border-2 border-gray-200 shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xl font-black text-gray-900">
                              Question {question.questionIndex + 1}
                            </h4>
                            <div className="flex items-center gap-6 text-sm">
                              <span className="text-green-600 font-bold text-lg">
                                {question.accuracy}% accuracy
                              </span>
                              <span className="text-gray-600 font-semibold">
                                {question.correctAnswers}/{question.totalAttempts} correct
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-base mb-4 line-clamp-2">
                            {question.questionText}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000"
                              initial={{ width: 0 }}
                              animate={{ width: `${question.accuracy}%` }}
                              transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student Submissions */}
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Student Submissions 👥</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-4 px-6 font-black text-gray-700 text-lg">Student</th>
                          <th className="text-left py-4 px-6 font-black text-gray-700 text-lg">Score</th>
                          <th className="text-left py-4 px-6 font-black text-gray-700 text-lg">Percentage</th>
                          <th className="text-left py-4 px-6 font-black text-gray-700 text-lg">Submitted</th>
                          <th className="text-left py-4 px-6 font-black text-gray-700 text-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignmentStats.attempts.map((attempt, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all"
                          >
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-black text-gray-900 text-lg">{attempt.student.name}</div>
                                <div className="text-gray-500 text-sm">{attempt.student.email}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-black text-gray-900 text-lg">
                                {attempt.totalScore}/{assignmentStats.assignment.totalMarks}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className={`font-black text-lg ${getCompletionColor(attempt.percentage)}`}>
                                {attempt.percentage}%
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-gray-600 font-semibold">
                                {formatDate(attempt.submittedAt)}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                {attempt.isLate ? (
                                  <span className="px-3 py-2 text-sm font-bold text-red-600 bg-gradient-to-r from-red-100 to-pink-100 rounded-full">
                                    Late
                                  </span>
                                ) : (
                                  <span className="px-3 py-2 text-sm font-bold text-green-600 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                                    On Time
                                  </span>
                                )}
                                {attempt.autoGraded && (
                                  <span className="px-3 py-2 text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
                                    Auto-graded
                                  </span>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentTracking;
