import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Users, User, BarChart3, TrendingUp, Eye,
  Filter, Calendar, Download, RefreshCw, UserPlus, Mail,
  Building, Target, Zap, Clock, Search, ArrowRight, FileText,
  Shield, School, TrendingDown, DollarSign, Award, FileEdit
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';

const AdminTrackingDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [activityPage, setActivityPage] = useState(1);
  const [activityLimit, setActivityLimit] = useState(20);
  const [activityTotalPages, setActivityTotalPages] = useState(0);
  const [activityFilters, setActivityFilters] = useState({
    activityType: 'all',
    sourceDashboard: 'all',
    startDate: '',
    endDate: ''
  });
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [realtimeActivity, setRealtimeActivity] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    activityType: 'all',
    sourceDashboard: 'all'
  });
  const socket = useSocket();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview') {
        const res = await api.get('/api/admin/tracking/overview').catch(() => ({ data: { data: null } }));
        setOverview(res.data.data || null);
      } else if (activeTab === 'activities') {
        const params = {
          page: activityPage,
          limit: activityLimit,
          activityType: activityFilters.activityType !== 'all' ? activityFilters.activityType : undefined,
          sourceDashboard: activityFilters.sourceDashboard !== 'all' ? activityFilters.sourceDashboard : undefined,
          startDate: activityFilters.startDate || undefined,
          endDate: activityFilters.endDate || undefined
        };
        const res = await api.get('/api/admin/tracking/activity-feed', { params }).catch(() => ({ data: { data: [] } }));
        setRealtimeActivity(res.data.data?.activities || res.data.data || []);
        if (res.data.data?.pagination) {
          setActivityTotalPages(res.data.data.pagination.pages || 0);
        }
      } else if (activeTab === 'users') {
        const res = await api.get('/api/admin/tracking/student-distribution').catch(() => ({ data: { data: [] } }));
        setUsers(res.data.data || []);
      } else if (activeTab === 'analytics') {
        const res = await api.get('/api/admin/tracking/analytics').catch(() => ({ data: { data: null } }));
        setAnalytics(res.data.data || null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [activeTab, activityPage, activityLimit, activityFilters]);

  // Real-time Socket.IO updates
  useEffect(() => {
    if (socket?.socket) {
      const handleActivityUpdate = (data) => {
        if (activeTab === 'activities') {
          setRealtimeActivity(prev => [data, ...prev].slice(0, 100)); // Keep last 100
          fetchData(); // Refresh full list
        }
      };

      socket.socket.on('admin:activity:new', handleActivityUpdate);
      return () => {
        socket.socket.off('admin:activity:new', handleActivityUpdate);
      };
    }
  }, [socket, activeTab]);

  const fetchUsersByRole = async (role) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/tracking/users/${role}`);
      setStudentsList(res.data.data || []);
      setSelectedRole(role);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/tracking/user/${userId}`);
      setSelectedStudent(res.data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const sidebarItems = [
    { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'activities', label: 'Activity Feed', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  if (loading && !overview && activeTab === 'overview') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header with Tabs */}
      <div className="bg-white shadow-lg border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              📊 Admin Tracking Dashboard
            </h1>
            <button
              onClick={() => navigate('/admin/payment-tracker')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 transition-all shadow-md"
            >
              <DollarSign className="w-5 h-5" />
              Payment Tracker
            </button>
          </div>
          <nav className="mt-4 flex flex-wrap gap-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && overview && (
            <div>
              <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Platform Overview
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Total Users"
                  value={overview.totalUsers || 0}
                  subtitle={`Active: ${overview.activeUsers || 0}`}
                  icon={Users}
                  color="from-blue-500 to-cyan-600"
                />
                <StatCard
                  title="Total Students"
                  value={overview.totalStudents || 0}
                  subtitle={`Individual: ${overview.individualStudents || 0}, School: ${overview.schoolStudents || 0}`}
                  icon={UserPlus}
                  color="from-green-500 to-emerald-600"
                />
                <StatCard
                  title="Schools"
                  value={overview.schools?.totalSchools || 0}
                  subtitle={`Active: ${overview.schools?.activeSchools || 0}`}
                  icon={Building}
                  color="from-orange-500 to-red-600"
                />
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-black mb-4">Parent Linkage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-black text-green-600">{overview.studentsWithParents || 0}</div>
                    <div className="text-sm text-gray-600">With Parents</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-black text-orange-600">{overview.studentsWithoutParents || 0}</div>
                    <div className="text-sm text-gray-600">Without Parents</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-black mb-4">Recent Activity (24h)</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-indigo-600">{overview.recentActivity || 0}</div>
                  <div className="text-gray-600">Activities tracked in the last 24 hours</div>
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div>
              {!selectedRole && !selectedStudent && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                      User Management
                    </h1>
                    <button
                      onClick={fetchData}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {users.map((roleData, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => fetchUsersByRole(roleData._id)}
                        className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                            {(roleData._id === 'student' || roleData._id === 'school_student') ? <UserPlus className="w-8 h-8 text-white" /> : <Users className="w-8 h-8 text-white" />}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1 capitalize">{roleData._id || 'Unknown'}</p>
                        <p className="text-3xl font-black text-gray-900">{roleData.total || 0}</p>
                        <p className="text-xs text-gray-500 mt-1">With Parents: {roleData.withParents || 0}</p>
                        <div className="mt-4 flex items-center text-indigo-600 font-semibold">
                          Click to view <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {selectedRole && !selectedStudent && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => { setSelectedRole(null); setStudentsList([]); }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
                      >
                        ← Back
                      </button>
                      <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent capitalize">
                        {selectedRole}
                      </h1>
                    </div>
                    <button
                      onClick={() => fetchUsersByRole(selectedRole)}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {loading ? (
                      <div className="p-12 text-center">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto animate-spin"></div>
                        <p className="text-gray-600 mt-4">Loading users...</p>
                      </div>
                    ) : studentsList.length === 0 ? (
                      <div className="p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No users found</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {studentsList.map((student, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => fetchUserDetails(student._id)}
                            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black flex-shrink-0">
                                {student.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900">{student.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-600">{student.email}</div>
                                {student.phone && (
                                  <div className="text-xs text-gray-500">📞 {student.phone}</div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">
                                  Joined: {new Date(student.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-indigo-600 font-semibold mt-2">
                                  View Details <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedStudent && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => { setSelectedStudent(null); }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
                      >
                        ← Back
                      </button>
                      <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                        Student Details
                      </h1>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                          <User className="w-6 h-6 text-indigo-600" />
                          Personal Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-600">Name:</span>
                            <span className="font-bold text-gray-900">{selectedStudent.name}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-600">Email:</span>
                            <span className="font-bold text-gray-900">{selectedStudent.email}</span>
                          </div>
                          {selectedStudent.phone && (
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-semibold text-gray-600">Phone:</span>
                              <span className="font-bold text-gray-900">{selectedStudent.phone}</span>
                            </div>
                          )}
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-600">Role:</span>
                            <span className="font-bold text-gray-900 capitalize">{selectedStudent.role}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-600">Joined:</span>
                            <span className="font-bold text-gray-900">{new Date(selectedStudent.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                          <Users className="w-6 h-6 text-blue-600" />
                          Parent Connections
                        </h3>
                        {selectedStudent.linkedIds?.parentIds && selectedStudent.linkedIds.parentIds.length > 0 ? (
                          <div className="space-y-3">
                            {selectedStudent.linkedIds.parentIds.map((parent, idx) => (
                              <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                                <div className="font-bold text-gray-900">{parent.name}</div>
                                <div className="text-sm text-gray-600">{parent.email}</div>
                                {parent.phone && <div className="text-xs text-gray-500">📞 {parent.phone}</div>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center bg-gray-50 rounded-lg">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">No parents linked</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                  Real-Time Activity Feed
                </h1>
                <div className="flex gap-3">
                  <select
                    value={activityFilters.activityType}
                    onChange={(e) => { setActivityFilters({ ...activityFilters, activityType: e.target.value }); setActivityPage(1); fetchData(); }}
                    className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold"
                  >
                    <option value="all">All Types</option>
                    <option value="communication">Communication</option>
                    <option value="transaction">Transaction</option>
                    <option value="engagement">Engagement</option>
                    <option value="login">Login</option>
                    <option value="administrative">Administrative</option>
                    <option value="system">System</option>
                    <option value="analytics_view">Analytics View</option>
                  </select>
                  <select
                    value={activityFilters.sourceDashboard}
                    onChange={(e) => { setActivityFilters({ ...activityFilters, sourceDashboard: e.target.value }); setActivityPage(1); fetchData(); }}
                    className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold"
                  >
                    <option value="all">All Dashboards</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="school_admin">School Admin</option>
                    <option value="csr">CSR</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input
                    type="date"
                    className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={activityFilters.startDate}
                    onChange={(e) => { setActivityFilters({ ...activityFilters, startDate: e.target.value }); setActivityPage(1); }}
                  />
                  <input
                    type="date"
                    className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={activityFilters.endDate}
                    onChange={(e) => { setActivityFilters({ ...activityFilters, endDate: e.target.value }); setActivityPage(1); }}
                  />
                  <button
                    onClick={fetchData}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {realtimeActivity.length === 0 ? (
                  <div className="p-12 text-center">
                    <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No activities found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {realtimeActivity.map((activity, idx) => (
                      <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black">
                            {activity.userId?.name?.[0]?.toUpperCase() || activity.userRole?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900">{activity.userId?.name || activity.userName || 'Unknown User'}</div>
                            <div className="text-sm text-gray-600 capitalize">{activity.sourceDashboard} → {activity.activityType}</div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {activityTotalPages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                  <button
                    onClick={() => { if (activityPage > 1) { setActivityPage(activityPage - 1); fetchData(); } }}
                    disabled={activityPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold">
                    {activityPage} / {activityTotalPages}
                  </span>
                  <button
                    onClick={() => { if (activityPage < activityTotalPages) { setActivityPage(activityPage + 1); fetchData(); } }}
                    disabled={activityPage === activityTotalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <button
                  onClick={fetchData}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {analytics ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                      <div className="text-3xl font-black mb-2">{analytics.byDashboard?.reduce((sum, d) => sum + (d.count || 0), 0) || 0}</div>
                      <div className="text-sm opacity-90">Total Activities</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                      <div className="text-3xl font-black mb-2">{analytics.topUsers?.length || 0}</div>
                      <div className="text-sm opacity-90">Top Users</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
                      <div className="text-3xl font-black mb-2">{analytics.dailyTrend?.length || 0}</div>
                      <div className="text-sm opacity-90">Days Tracked</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                      <div className="text-3xl font-black mb-2">{analytics.recentActivities?.length || 0}</div>
                      <div className="text-sm opacity-90">Recent Events</div>
                    </div>
                  </div>

                  {/* Daily Trend */}
                  {analytics.dailyTrend && analytics.dailyTrend.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        7-Day Activity Trend
                      </h3>
                      <div className="flex items-end gap-2 h-48">
                        {analytics.dailyTrend.map((day, idx) => {
                          const maxCount = Math.max(...analytics.dailyTrend.map(d => d.count), 1);
                          const heightPercent = (day.count / maxCount) * 100;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg mb-2 transition-all hover:opacity-80"
                                style={{ height: `${Math.max(heightPercent, 5)}%` }}
                              />
                              <div className="text-xs font-bold text-gray-700">{day.count}</div>
                              <div className="text-xs text-gray-500">{day._id.split('-')[2]}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Top Active Users */}
                  {analytics.topUsers && analytics.topUsers.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                        <Award className="w-6 h-6 text-yellow-600" />
                        Top Active Users
                      </h3>
                      <div className="space-y-3">
                        {analytics.topUsers.map((user, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-black flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-gray-900">{user.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-orange-600">{user.activityCount || 0}</div>
                              <div className="text-xs text-gray-500">activities</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* By Dashboard */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-indigo-600" />
                      Activity by Dashboard
                    </h3>
                    <div className="space-y-4">
                      {analytics.byDashboard && analytics.byDashboard.map((item, idx) => (
                        <div key={idx} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-gray-900 capitalize">{item.dashboard || item._id}</div>
                              <div className="text-sm text-gray-600">{item.uniqueUsers || 0} unique users</div>
                            </div>
                            <div className="text-2xl font-black text-indigo-600">{item.count || 0}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Communication Patterns */}
                  {analytics.communicationPatterns && analytics.communicationPatterns.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-pink-600" />
                        Communication Flow Patterns
                      </h3>
                      <div className="space-y-3">
                        {analytics.communicationPatterns.map((pattern, idx) => (
                          <div key={idx} className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900 capitalize">{pattern.source || 'unknown'}</span>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                                <span className="font-semibold text-gray-700 capitalize">{pattern.target || 'unknown'}</span>
                              </div>
                              <div className="text-xl font-black text-pink-600">{pattern.count}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* By Activity Type */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-green-600" />
                      Activity by Type
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {analytics.byType && analytics.byType.map((item, idx) => (
                        <div key={idx} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-gray-900 capitalize">{item._id}</div>
                            <div className="text-xl font-black text-green-600">{item.count}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hourly Activity */}
                  {analytics.hourlyActivity && analytics.hourlyActivity.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-purple-600" />
                        Activity by Hour
                      </h3>
                      <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                        {analytics.hourlyActivity.map((item, idx) => (
                          <div key={idx} className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg text-center">
                            <div className="text-xs font-bold text-gray-600 mb-1">{item._id}h</div>
                            <div className="text-lg font-black text-purple-600">{item.count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Activities */}
                  {analytics.recentActivities && analytics.recentActivities.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-indigo-600" />
                        Recent Activities
                      </h3>
                      <div className="divide-y divide-gray-200">
                        {analytics.recentActivities.map((activity, idx) => (
                          <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black flex-shrink-0">
                                {activity.userId?.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">{activity.userId?.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-600 capitalize">{activity.sourceDashboard} → {activity.activityType}</div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No analytics data available</p>
                </div>
              )}
            </div>
          )}
      </main>
    </div>
  );
};

export default AdminTrackingDashboard;
