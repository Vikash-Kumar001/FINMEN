import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, User, Activity, AlertTriangle, Bell, RefreshCw,
  ArrowRight, Filter, Calendar, Download, Eye, BarChart3, PieChart,
  Target, Zap, Clock, Mail, MessageSquare, Award, TrendingDown,
  UserCheck, UserX, AlertCircle, CheckCircle, XCircle, Info,
  School, Home, ArrowLeftRight, FileText, Search
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const BehaviorAnalytics = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    role: 'all',
    startDate: '',
    endDate: '',
    daysThreshold: 7
  });

  // State for each analytics section
  const [summary, setSummary] = useState(null);
  const [behaviorFlow, setBehaviorFlow] = useState(null);
  const [parentEngagement, setParentEngagement] = useState(null);
  const [teacherWorkload, setTeacherWorkload] = useState(null);
  const [dropOff, setDropOff] = useState(null);
  const [churn, setChurn] = useState(null);

  // Alerts state
  const [alerts, setAlerts] = useState([]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview') {
        const res = await api.get('/api/admin/behavior-analytics', {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        });
        setSummary(res.data.data?.summary);
        setBehaviorFlow(res.data.data?.behaviorFlow);
        setParentEngagement(res.data.data?.parentEngagement);
        setTeacherWorkload(res.data.data?.teacherWorkload);
        setDropOff(res.data.data?.dropOff);
        setChurn(res.data.data?.churn);
      } else if (activeTab === 'behavior-flow') {
        const res = await api.get('/api/admin/behavior-analytics/behavior-flow', {
          params: {
            role: filters.role !== 'all' ? filters.role : undefined,
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        });
        setBehaviorFlow(res.data.data);
      } else if (activeTab === 'parent-engagement') {
        const res = await api.get('/api/admin/behavior-analytics/parent-engagement', {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        });
        setParentEngagement(res.data.data);
      } else if (activeTab === 'teacher-workload') {
        const res = await api.get('/api/admin/behavior-analytics/teacher-workload', {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        });
        setTeacherWorkload(res.data.data);
      } else if (activeTab === 'drop-off') {
        const res = await api.get('/api/admin/behavior-analytics/drop-off', {
          params: {
            role: filters.role !== 'all' ? filters.role : undefined,
            daysThreshold: filters.daysThreshold
          }
        });
        setDropOff(res.data.data);
      } else if (activeTab === 'churn') {
        const res = await api.get('/api/admin/behavior-analytics/churn-predictions', {
          params: {
            role: filters.role !== 'all' ? filters.role : undefined
          }
        });
        setChurn(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching behavior analytics:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load analytics data');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Socket.IO real-time updates and alerts
  useEffect(() => {
    if (socket?.socket) {
      const handleAnalyticsUpdate = (data) => {
        // Update the relevant section
        if (data.type === 'behaviorFlow') setBehaviorFlow(data.data);
        else if (data.type === 'parentEngagement') setParentEngagement(data.data);
        else if (data.type === 'teacherWorkload') setTeacherWorkload(data.data);
        else if (data.type === 'dropOff') setDropOff(data.data);
        else if (data.type === 'churn') setChurn(data.data);
        
        // Refresh data
        fetchAllData();
      };

      const handleDropOffAlert = (data) => {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'dropoff',
          severity: 'critical',
          message: data.message,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
        
        toast.error(data.message, {
          duration: 5000,
          icon: '⚠️'
        });
      };

      const handleChurnAlert = (data) => {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'churn',
          severity: 'high',
          message: data.message,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
        
        toast.error(data.message, {
          duration: 5000,
          icon: '🔔'
        });
      };

      const handleSummaryUpdate = (data) => {
        setSummary(data);
      };

      socket.socket.on('behavior:analytics:update', handleAnalyticsUpdate);
      socket.socket.on('behavior:dropoff:alert', handleDropOffAlert);
      socket.socket.on('behavior:churn:alert', handleChurnAlert);
      socket.socket.on('behavior:analytics:summary', handleSummaryUpdate);
      
      return () => {
        socket.socket.off('behavior:analytics:update', handleAnalyticsUpdate);
        socket.socket.off('behavior:dropoff:alert', handleDropOffAlert);
        socket.socket.off('behavior:churn:alert', handleChurnAlert);
        socket.socket.off('behavior:analytics:summary', handleSummaryUpdate);
      };
    }
  }, [socket, fetchAllData]);

  const StatCard = ({ title, value, icon: Icon, trend, color = 'from-indigo-500 to-purple-600', subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-bold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'behavior-flow', label: 'Behavior Flow', icon: ArrowLeftRight },
    { id: 'parent-engagement', label: 'Parent Engagement', icon: Users },
    { id: 'teacher-workload', label: 'Teacher Workload', icon: School },
    { id: 'drop-off', label: 'Drop-off Detection', icon: TrendingDown },
    { id: 'churn', label: 'Churn Predictions', icon: AlertTriangle }
  ];

  if (loading && !summary && !behaviorFlow && !parentEngagement && !teacherWorkload && !dropOff && !churn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <Activity className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Cross-Role Behavior Analytics</h1>
                  <p className="text-lg text-white/90">Deep insights into user behavior, engagement, and retention</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAllData}
                  disabled={loading}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-900">Active Alerts</h3>
            </div>
            <div className="space-y-2">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center gap-2 text-sm text-red-800">
                  <AlertCircle className="w-4 h-4" />
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none font-medium"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="school_student">School Student</option>
              <option value="parent">Parent</option>
              <option value="school_parent">School Parent</option>
              <option value="school_teacher">Teacher</option>
            </select>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            {(activeTab === 'drop-off') && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <input
                  type="number"
                  value={filters.daysThreshold}
                  onChange={(e) => setFilters({ ...filters, daysThreshold: parseInt(e.target.value) || 7 })}
                  className="w-24 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                  placeholder="Days"
                />
                <span className="text-sm text-gray-600">days threshold</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && summary && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="High Churn Risk"
                value={churn?.summary?.usersRequiringAction || 0}
                icon={AlertTriangle}
                color="from-red-500 to-pink-600"
                subtitle="Users requiring immediate action"
              />
              <StatCard
                title="Critical Drop-offs"
                value={dropOff?.summary?.critical || 0}
                icon={TrendingDown}
                color="from-orange-500 to-amber-600"
                subtitle="Users at critical risk"
              />
              <StatCard
                title="High Parent Engagement"
                value={parentEngagement?.summary?.highEngagement || 0}
                icon={Users}
                color="from-green-500 to-emerald-600"
                subtitle={`${parentEngagement?.summary?.highEngagementRate || 0}% of parents`}
              />
              <StatCard
                title="High Teacher Workload"
                value={teacherWorkload?.summary?.highWorkload || 0}
                icon={School}
                color="from-purple-500 to-indigo-600"
                subtitle="Teachers with heavy workload"
              />
            </div>

            {/* Quick View Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowLeftRight className="w-6 h-6 text-indigo-600" />
                  Behavior Flow Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Navigation Patterns</span>
                    <span className="text-2xl font-black text-indigo-600">{behaviorFlow?.totalFlows || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Features</span>
                    <span className="text-2xl font-black text-purple-600">{behaviorFlow?.featureUsage?.length || 0}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-600" />
                  Engagement Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Parent Engagement</span>
                    <span className="text-2xl font-black text-green-600">{parentEngagement?.summary?.avgScore || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Teacher Workload</span>
                    <span className="text-2xl font-black text-purple-600">{teacherWorkload?.summary?.avgWorkload || 0}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Behavior Flow Tab */}
        {activeTab === 'behavior-flow' && behaviorFlow && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <ArrowLeftRight className="w-7 h-7 text-indigo-600" />
                User Navigation Patterns
              </h2>
              <div className="space-y-4">
                {behaviorFlow.navigationPatterns?.slice(0, 10).map((pattern, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-600 rounded-lg text-white font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {pattern._id.from || 'Unknown'} → {pattern._id.to || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">{pattern._id.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-indigo-600">{pattern.count}</p>
                      <p className="text-xs text-gray-500">transitions</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="w-7 h-7 text-purple-600" />
                Feature Usage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {behaviorFlow.featureUsage?.slice(0, 12).map((feature, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{feature.feature || 'Unknown'}</span>
                      <span className="text-sm text-gray-600">{feature.role}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-purple-600">{feature.count}</span>
                      <span className="text-sm text-gray-500">{feature.uniqueUsers} users</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Parent Engagement Tab */}
        {activeTab === 'parent-engagement' && parentEngagement && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Parents"
                value={parentEngagement.summary?.totalParents || 0}
                icon={Users}
                color="from-blue-500 to-cyan-600"
              />
              <StatCard
                title="Avg Engagement"
                value={`${parentEngagement.summary?.avgScore || 0}%`}
                icon={Target}
                color="from-green-500 to-emerald-600"
              />
              <StatCard
                title="High Engagement"
                value={parentEngagement.summary?.highEngagement || 0}
                icon={CheckCircle}
                color="from-emerald-500 to-teal-600"
              />
              <StatCard
                title="High Engagement Rate"
                value={`${parentEngagement.summary?.highEngagementRate || 0}%`}
                icon={Award}
                color="from-purple-500 to-pink-600"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Users className="w-7 h-7 text-green-600" />
                Parent Engagement Scores
              </h2>
              <div className="space-y-3">
                {parentEngagement.scores?.slice(0, 20).map((parent, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-green-50 border-2 border-green-200">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-lg font-bold text-white ${
                        parent.level === 'High' ? 'bg-green-600' :
                        parent.level === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {parent.level === 'High' ? 'H' : parent.level === 'Medium' ? 'M' : 'L'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{parent.parentName}</p>
                        <p className="text-sm text-gray-600">{parent.email}</p>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Logins: {parent.metrics.loginCount}</div>
                        <div>Messages: {parent.metrics.messageCount}</div>
                        <div>Chats: {parent.metrics.chatCount}</div>
                        <div>Views: {parent.metrics.profileViews}</div>
                        <div>Checks: {parent.metrics.childChecks}</div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-black text-green-600">{parent.score}</p>
                      <p className="text-xs text-gray-500">score</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Teacher Workload Tab */}
        {activeTab === 'teacher-workload' && teacherWorkload && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Teachers"
                value={teacherWorkload.summary?.totalTeachers || 0}
                icon={School}
                color="from-purple-500 to-indigo-600"
              />
              <StatCard
                title="Avg Workload"
                value={teacherWorkload.summary?.avgWorkload || 0}
                icon={Target}
                color="from-indigo-500 to-purple-600"
              />
              <StatCard
                title="High Workload"
                value={teacherWorkload.summary?.highWorkload || 0}
                icon={AlertTriangle}
                color="from-red-500 to-pink-600"
              />
              <StatCard
                title="Normal Workload"
                value={teacherWorkload.summary?.normalWorkload || 0}
                icon={CheckCircle}
                color="from-green-500 to-emerald-600"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <School className="w-7 h-7 text-purple-600" />
                Teacher Workload Analysis
              </h2>
              <div className="space-y-3">
                {teacherWorkload.teachers?.slice(0, 20).map((teacher, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-lg font-bold text-white ${
                        teacher.level === 'High' ? 'bg-red-600' :
                        teacher.level === 'Moderate' ? 'bg-orange-600' :
                        teacher.level === 'Normal' ? 'bg-green-600' : 'bg-gray-600'
                      }`}>
                        {teacher.level.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{teacher.teacherName}</p>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                        <div>Msgs: {teacher.metrics.totalMessages}</div>
                        <div>Students: {teacher.metrics.studentsManaged}</div>
                        <div>Assignments: {teacher.metrics.assignmentsCreated}</div>
                        <div>Hours: {teacher.metrics.hoursActive}h</div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-black text-purple-600">{teacher.workloadScore}</p>
                      <p className="text-xs text-gray-500">score</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Drop-off Detection Tab */}
        {activeTab === 'drop-off' && dropOff && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Drop-offs"
                value={dropOff.summary?.total || 0}
                icon={TrendingDown}
                color="from-orange-500 to-amber-600"
              />
              <StatCard
                title="Critical"
                value={dropOff.summary?.critical || 0}
                icon={AlertTriangle}
                color="from-red-500 to-pink-600"
                subtitle="30+ days inactive"
              />
              <StatCard
                title="High Risk"
                value={dropOff.summary?.high || 0}
                icon={AlertCircle}
                color="from-orange-500 to-red-600"
                subtitle="14+ days inactive"
              />
              <StatCard
                title="Avg Days Inactive"
                value={dropOff.summary?.avgDaysInactive || 0}
                icon={Clock}
                color="from-gray-500 to-gray-600"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <TrendingDown className="w-7 h-7 text-red-600" />
                Users at Risk of Dropping Off
              </h2>
              <div className="space-y-3">
                {dropOff.dropOffs?.slice(0, 30).map((user, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${
                    user.riskLevel === 'Critical' ? 'bg-red-50 border-red-300' :
                    user.riskLevel === 'High' ? 'bg-orange-50 border-orange-300' :
                    user.riskLevel === 'Medium' ? 'bg-yellow-50 border-yellow-300' :
                    'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-2 rounded-lg font-bold text-white ${
                          user.riskLevel === 'Critical' ? 'bg-red-600' :
                          user.riskLevel === 'High' ? 'bg-orange-600' :
                          user.riskLevel === 'Medium' ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}>
                          {user.riskLevel.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{user.userName}</p>
                          <p className="text-sm text-gray-600">{user.email} • {user.role}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            {user.possibleReasons.map((reason, i) => (
                              <span key={i} className="bg-gray-200 px-2 py-1 rounded">{reason}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-black text-red-600">{user.daysSinceLastActivity}</p>
                        <p className="text-xs text-gray-500">days inactive</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Churn Predictions Tab */}
        {activeTab === 'churn' && churn && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Critical Risk"
                value={churn.summary?.critical || 0}
                icon={AlertTriangle}
                color="from-red-500 to-pink-600"
                subtitle="70%+ churn probability"
              />
              <StatCard
                title="High Risk"
                value={churn.summary?.high || 0}
                icon={AlertCircle}
                color="from-orange-500 to-amber-600"
                subtitle="50-70% probability"
              />
              <StatCard
                title="Requiring Action"
                value={churn.summary?.usersRequiringAction || 0}
                icon={Bell}
                color="from-purple-500 to-indigo-600"
                subtitle="Immediate attention"
              />
              <StatCard
                title="Avg Churn Probability"
                value={`${churn.summary?.avgChurnProbability || 0}%`}
                icon={Target}
                color="from-gray-500 to-gray-600"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-7 h-7 text-red-600" />
                Churn Predictions & Early Alerts
              </h2>
              <div className="space-y-3">
                {churn.predictions?.slice(0, 30).map((prediction, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${
                    prediction.riskLevel === 'Critical' ? 'bg-red-50 border-red-300' :
                    prediction.riskLevel === 'High' ? 'bg-orange-50 border-orange-300' :
                    prediction.riskLevel === 'Medium' ? 'bg-yellow-50 border-yellow-300' :
                    'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-lg font-bold text-white ${
                          prediction.riskLevel === 'Critical' ? 'bg-red-600' :
                          prediction.riskLevel === 'High' ? 'bg-orange-600' :
                          prediction.riskLevel === 'Medium' ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}>
                          {prediction.riskLevel.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{prediction.userName}</p>
                          <p className="text-sm text-gray-600">{prediction.email} • {prediction.role}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>Activity: {prediction.metrics.recentActivity}</span>
                            <span>Sessions: {prediction.metrics.recentSessions}</span>
                            <span>Trend: {prediction.metrics.activityTrend > 0 ? '+' : ''}{prediction.metrics.activityTrend}%</span>
                          </div>
                          {prediction.recommendedActions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Recommended Actions:</p>
                              <div className="flex flex-wrap gap-2">
                                {prediction.recommendedActions.map((action, i) => (
                                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{action}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-black text-red-600">{prediction.churnProbability}%</p>
                        <p className="text-xs text-gray-500">churn risk</p>
                        {prediction.predictedDaysUntilChurn && (
                          <p className="text-sm font-semibold text-orange-600 mt-1">
                            ~{prediction.predictedDaysUntilChurn} days
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorAnalytics;

