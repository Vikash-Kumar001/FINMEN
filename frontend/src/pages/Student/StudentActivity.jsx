import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  BarChart3,
  Zap,
  BookOpen,
  Gamepad2,
  Brain,
  Heart,
  DollarSign,
  Star,
  ArrowLeft,
  Filter,
  RefreshCw,
  FileText,
  X,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentActivity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityStats, setActivityStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const fetchActivityData = useCallback(async () => {
    try {
      setLoading(true);
      const [activitiesRes, statsRes] = await Promise.all([
        api.get(`/api/activity?filter=${filter}&timeRange=${timeRange}`),
        api.get('/api/activity/stats')
      ]);
      
      console.log('📊 Activities data received:', activitiesRes.data.activities);
      setActivities(activitiesRes.data.activities || []);
      setActivityStats(statsRes.data || {});
    } catch (error) {
      console.error('Error fetching activity data:', error);
      toast.error('Failed to load activity data');
    } finally {
      setLoading(false);
    }
  }, [filter, timeRange]);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const handleDeleteAssignment = (assignment) => {
    setAssignmentToDelete(assignment);
    setShowDeleteModal(true);
  };

  const handleDeleteForMe = async () => {
    if (!assignmentToDelete) return;

    try {
      const response = await api.delete(`/api/school/student/assignments/${assignmentToDelete._id}/for-me`);
      toast.success(response.data.message);
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
      fetchActivityData();
    } catch (error) {
      console.error("Error deleting assignment for me:", error);
      toast.error(error.response?.data?.message || "Failed to delete assignment");
    }
  };

  const handleAttemptAssignment = async (assignment) => {
    try {
      console.log('🚀 Starting assignment attempt for:', assignment);
      console.log('🔑 Token in localStorage:', localStorage.getItem('finmen_token') ? 'Present' : 'Missing');
      console.log('🔑 Token value:', localStorage.getItem('finmen_token'));
      console.log('🌐 API base URL:', api.defaults.baseURL);
      
      // Check if it's an assignment and has a type that can be attempted
      const canAttempt = assignment.type === 'assignment' && 
        (assignment.assignmentType === 'quiz' || 
         assignment.assignmentType === 'test' || 
         assignment.assignmentType === 'homework' || 
         assignment.assignmentType === 'classwork' ||
         // Fallback: if no assignmentType is set, assume it can be attempted
         !assignment.assignmentType);
      
      console.log('✅ Can attempt assignment:', canAttempt);
      
      if (canAttempt) {
        // Start assignment attempt
        console.log('📡 Making API call to:', `/api/assignment-attempts/start/${assignment._id}`);
        const response = await api.post(`/api/assignment-attempts/start/${assignment._id}`);
        console.log('📡 API response:', response.data);
        
        if (response.data.success) {
          navigate(`/student/assignment/${assignment._id}/attempt`);
        } else {
          toast.error(response.data.message || 'Failed to start assignment');
        }
      } else if (assignment.type === 'assignment' && assignment.assignmentType === 'project') {
        // For projects, show details first
        handleActivityClick(assignment);
      } else {
        // For other assignment types, show details
        handleActivityClick(assignment);
      }
    } catch (error) {
      console.error('❌ Error starting assignment:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      toast.error(error.response?.data?.message || 'Failed to start assignment');
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment': return <FileText className="w-5 h-5" />;
      case 'task': return <Target className="w-5 h-5" />;
      case 'challenge': return <Zap className="w-5 h-5" />;
      case 'activity': return <BookOpen className="w-5 h-5" />;
      case 'game': return <Gamepad2 className="w-5 h-5" />;
      case 'lesson': return <BookOpen className="w-5 h-5" />;
      case 'achievement': return <Award className="w-5 h-5" />;
      case 'quiz': return <Brain className="w-5 h-5" />;
      case 'mood': return <Heart className="w-5 h-5" />;
      case 'wallet': return <DollarSign className="w-5 h-5" />;
      case 'level_up': return <Star className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getSubmissionStatusDisplay = (assignment) => {
    if (!assignment.submissionStatus) {
      return { text: 'Not Started', color: 'text-gray-500', icon: Clock };
    }
    
    switch (assignment.submissionStatus.status) {
      case 'in_progress':
        return { text: 'In Progress', color: 'text-yellow-600', icon: Clock };
      case 'submitted':
        return { text: 'Submitted', color: 'text-green-600', icon: CheckCircle };
      case 'graded':
        return { text: 'Graded', color: 'text-blue-600', icon: CheckCircle };
      default:
        return { text: 'Unknown', color: 'text-gray-500', icon: Clock };
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'assignment': return 'from-indigo-500 to-blue-500';
      case 'task': return 'from-teal-500 to-cyan-500';
      case 'challenge': return 'from-purple-500 to-indigo-500';
      case 'activity': return 'from-emerald-500 to-green-500';
      case 'game': return 'from-blue-500 to-cyan-500';
      case 'lesson': return 'from-green-500 to-emerald-500';
      case 'achievement': return 'from-yellow-500 to-orange-500';
      case 'quiz': return 'from-pink-500 to-rose-500';
      case 'mood': return 'from-red-500 to-pink-500';
      case 'wallet': return 'from-amber-500 to-yellow-500';
      case 'level_up': return 'from-violet-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-semibold ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Activity className="w-10 h-10" />
              Learning Content
            </h1>
            <p className="text-lg text-white/90">
              View assignments, tasks, challenges, and activities from your teachers
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Assignments"
            value={activityStats.assignmentsAssigned || 0}
            icon={FileText}
            color="from-indigo-500 to-blue-500"
            trend={activityStats.assignmentsTrend}
          />
          <StatCard
            title="Tasks"
            value={activityStats.tasksAssigned || 0}
            icon={Target}
            color="from-teal-500 to-cyan-500"
            trend={activityStats.tasksTrend}
          />
          <StatCard
            title="Challenges"
            value={activityStats.challengesAssigned || 0}
            icon={Zap}
            color="from-purple-500 to-indigo-500"
            trend={activityStats.challengesTrend}
          />
          <StatCard
            title="Activities"
            value={activityStats.activitiesAssigned || 0}
            icon={BookOpen}
            color="from-emerald-500 to-green-500"
            trend={activityStats.activitiesTrend}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Content</option>
              <option value="assignments">Assignments</option>
              <option value="tasks">Tasks</option>
              <option value="challenges">Challenges</option>
              <option value="activities">Activities</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={fetchActivityData}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-600" />
              Learning Content Timeline
            </h2>
            <p className="text-gray-600 mt-1">Assignments, tasks, challenges, and activities from your teachers</p>
          </div>
          
          <div className="p-6">
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleActivityClick(activity)}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 hover:border-purple-300 hover:shadow-md"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${getActivityColor(activity.type)} flex-shrink-0`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {activity.title || activity.action || 'Content'}
                        </h3>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(activity.timestamp || activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description || activity.message || 'No description available'}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activity.category && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">
                            {activity.category}
                          </span>
                        )}
                        {activity.subject && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                            {activity.subject}
                          </span>
                        )}
                        {activity.createdBy && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                            by {activity.createdBy}
                          </span>
                        )}
                        {activity.priority && (
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            activity.priority === 'high' ? 'text-red-600 bg-red-100' :
                            activity.priority === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                            'text-gray-600 bg-gray-100'
                          }`}>
                            {activity.priority}
                          </span>
                        )}
                      </div>
                      {/* Additional info based on content type */}
                      {activity.type === 'assignment' && activity.dueDate && (
                        <div className="mt-2 text-xs text-gray-500">
                          Due: {new Date(activity.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      {/* Submission status for assignments */}
                      {activity.type === 'assignment' && activity.submissionStatus && (
                        <div className="mt-2 flex items-center gap-1 text-xs">
                          {(() => {
                            const statusDisplay = getSubmissionStatusDisplay(activity);
                            const IconComponent = statusDisplay.icon;
                            return (
                              <>
                                <IconComponent className={`w-3 h-3 ${statusDisplay.color}`} />
                                <span className={statusDisplay.color}>{statusDisplay.text}</span>
                                {activity.submissionStatus.submittedAt && (
                                  <span className="text-gray-400">
                                    • {new Date(activity.submissionStatus.submittedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                      {activity.type === 'challenge' && activity.endDate && (
                        <div className="mt-2 text-xs text-gray-500">
                          Ends: {new Date(activity.endDate).toLocaleDateString()}
                        </div>
                      )}
                      {activity.type === 'activity' && activity.scheduledDate && (
                        <div className="mt-2 text-xs text-gray-500">
                          Scheduled: {new Date(activity.scheduledDate).toLocaleDateString()}
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="mt-3 flex gap-2">
                        {activity.type === 'assignment' && (
                          <>
                            {(activity.assignmentType === 'quiz' || 
                              activity.assignmentType === 'test' || 
                              activity.assignmentType === 'homework' || 
                              activity.assignmentType === 'classwork' ||
                              !activity.assignmentType) ? (
                              // Check if assignment has been submitted
                              activity.submissionStatus?.status === 'submitted' || activity.submissionStatus?.status === 'graded' ? (
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Submitted
                                </div>
                              ) : activity.submissionStatus?.status === 'in_progress' ? (
                                <div className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  In Progress
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAttemptAssignment(activity);
                                  }}
                                  className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  Attempt
                                </button>
                              )
                            ) : activity.assignmentType === 'project' ? (
                              // Check if project has been submitted
                              activity.submissionStatus?.status === 'submitted' || activity.submissionStatus?.status === 'graded' ? (
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Submitted
                                </div>
                              ) : activity.submissionStatus?.status === 'in_progress' ? (
                                <div className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  In Progress
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleActivityClick(activity);
                                  }}
                                  className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-lg hover:bg-purple-600 transition-colors"
                                >
                                  View Project
                                </button>
                              )
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleActivityClick(activity);
                                }}
                                className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors"
                              >
                                View Details
                              </button>
                            )}
                            {/* Delete button - only show for submitted assignments */}
                            {activity.canDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAssignment(activity);
                                }}
                                className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivityClick(activity);
                          }}
                          className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                    {activity.points && (
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                        <Star className="w-4 h-4" />
                        +{activity.points}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Content Found</h3>
                <p className="text-gray-500 mb-4">
                  {filter === 'all' 
                    ? "No assignments, tasks, challenges, or activities have been assigned to you yet. Check back later or contact your teacher."
                    : `No ${filter} found for the selected time range.`
                  }
                </p>
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Activity Details Modal */}
      {showActivityModal && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowActivityModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Activity Details</h2>
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Title</h3>
                  <p className="text-gray-700">{selectedActivity.title || selectedActivity.action || 'Content'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedActivity.description || selectedActivity.message || 'No description available'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Type</h3>
                    <p className="text-gray-700 capitalize">{selectedActivity.type || selectedActivity.assignmentType || 'Unknown'}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Subject</h3>
                    <p className="text-gray-700">{selectedActivity.subject || 'Not specified'}</p>
                  </div>
                  {selectedActivity.dueDate && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Due Date</h3>
                      <p className="text-gray-700">{new Date(selectedActivity.dueDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Priority</h3>
                    <p className="text-gray-700 capitalize">{selectedActivity.priority || 'Medium'}</p>
                  </div>
                </div>
                {selectedActivity.points && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Points</h3>
                    <p className="text-gray-700">{selectedActivity.points} points</p>
                  </div>
                )}
                {selectedActivity.questions && selectedActivity.questions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Questions ({selectedActivity.questions.length})</h3>
                    <div className="space-y-2">
                      {selectedActivity.questions.map((question, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900">
                            {index + 1}. {question.question || `${question.type?.replace(/_/g, ' ')} Task`}
                          </p>
                          <p className="text-sm text-gray-600">Points: {question.points}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedActivity.type === 'assignment' && (selectedActivity.assignmentType === 'quiz' || selectedActivity.assignmentType === 'test') && (
                  <div className="mt-6 p-4 rounded-lg">
                    {selectedActivity.submissionStatus?.status === 'submitted' || selectedActivity.submissionStatus?.status === 'graded' ? (
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-green-900 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Assignment Submitted
                        </h3>
                        <p className="text-green-700 mb-2">
                          You have successfully submitted this {selectedActivity.assignmentType} assignment.
                        </p>
                        {selectedActivity.submissionStatus.submittedAt && (
                          <p className="text-green-600 text-sm">
                            Submitted on: {new Date(selectedActivity.submissionStatus.submittedAt).toLocaleString()}
                          </p>
                        )}
                        {selectedActivity.submissionStatus.status === 'graded' && (
                          <p className="text-green-600 text-sm font-semibold">
                            This assignment has been graded.
                          </p>
                        )}
                      </div>
                    ) : selectedActivity.submissionStatus?.status === 'in_progress' ? (
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-yellow-900 mb-2 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Assignment In Progress
                        </h3>
                        <p className="text-yellow-700 mb-4">
                          You have started this {selectedActivity.assignmentType} assignment but haven't submitted it yet.
                        </p>
                        <button
                          onClick={() => {
                            setShowActivityModal(false);
                            handleAttemptAssignment(selectedActivity);
                          }}
                          className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                        >
                          Continue {selectedActivity.assignmentType === 'quiz' ? 'Quiz' : 'Test'}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-blue-900 mb-2">Ready to Attempt?</h3>
                        <p className="text-blue-700 mb-4">This is a {selectedActivity.assignmentType} assignment. Click the button below to start attempting it.</p>
                        <button
                          onClick={() => {
                            setShowActivityModal(false);
                            handleAttemptAssignment(selectedActivity);
                          }}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                        >
                          Start {selectedActivity.assignmentType === 'quiz' ? 'Quiz' : 'Test'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && assignmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Remove Assignment</h2>
                    <p className="text-red-100 text-sm">Remove this assignment from your view</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  "{assignmentToDelete.title}"
                </h3>
                <p className="text-gray-600 text-sm">
                  Subject: {assignmentToDelete.subject} • Due: {new Date(assignmentToDelete.dueDate).toLocaleDateString()}
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Submitted on {assignmentToDelete.submissionStatus?.submittedAt ? new Date(assignmentToDelete.submissionStatus.submittedAt).toLocaleDateString() : 'Unknown date'}</span>
                </div>
              </div>

              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This will only remove the assignment from your view. Your submission and grades will be preserved. You can still access it from your submission history.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteForMe}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove from My View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentActivity;
