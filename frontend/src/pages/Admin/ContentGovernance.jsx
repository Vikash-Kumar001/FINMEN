import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line
import { useNavigate } from 'react-router-dom';
import {
  Shield, FileText, CheckCircle, XCircle, Eye, Globe, Calendar,
  RefreshCw, Filter, Search, TrendingUp, TrendingDown, BarChart3,
  AlertTriangle, Users, Clock, Target, Award, AlertCircle, X,
  ArrowLeft, Play, Download, Upload, Settings, Lock, Unlock,
  Flag, Globe2, Zap, Star, Activity, BarChart, PieChart
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const ContentGovernance = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [content, setContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    category: 'all',
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ageRating: 'all',
    region: 'all'
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingContentId, setRejectingContentId] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/content-governance', { params: filters });
      if (res.data.success) {
        setContent(res.data.data.content || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load content');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/content-governance/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/content-governance/analytics', {
        params: { timeRange: 'month' }
      });
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    fetchStats();
    
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchContent();
      fetchStats();
      if (activeTab === 'analytics') {
        fetchAnalytics();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchContent, fetchStats, fetchAnalytics, activeTab]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (socket?.socket) {
      const handleContentUpdate = (data) => {
        setContent(data.content || []);
        fetchContent();
      };

      const handleContentApproved = (content) => {
        toast.success(`Content "${content.title}" approved!`, {
          duration: 3000
        });
        fetchContent();
        fetchStats();
      };

      const handleContentRejected = (content) => {
        toast.error(`Content "${content.title}" rejected`, {
          duration: 3000
        });
        fetchContent();
        fetchStats();
      };

      socket.socket.on('content:governance:update', handleContentUpdate);
      socket.socket.on('content:approved', handleContentApproved);
      socket.socket.on('content:rejected', handleContentRejected);
      
      return () => {
        socket.socket.off('content:governance:update', handleContentUpdate);
        socket.socket.off('content:approved', handleContentApproved);
        socket.socket.off('content:rejected', handleContentRejected);
      };
    }
  }, [socket, fetchContent, fetchStats]);

  const handleContentClick = async (contentId) => {
    try {
      const res = await api.get(`/api/admin/content-governance/${contentId}`);
      if (res.data.success) {
        setSelectedContent(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching content details:', error);
      toast.error('Failed to load content details');
    }
  };

  const handleApprove = async (contentId) => {
    try {
      const res = await api.post(`/api/admin/content-governance/${contentId}/approve`, {
        comments: 'Approved by admin'
      });
      if (res.data.success) {
        toast.success('Content approved successfully!');
        fetchContent();
        fetchStats();
        if (selectedContent && selectedContent._id === contentId) {
          setSelectedContent(res.data.data);
        }
      }
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error(error.response?.data?.message || 'Failed to approve content');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      const res = await api.post(`/api/admin/content-governance/${rejectingContentId}/reject`, {
        rejectionReason
      });
      if (res.data.success) {
        toast.success('Content rejected');
        setShowRejectModal(false);
        setRejectionReason('');
        setRejectingContentId(null);
        fetchContent();
        fetchStats();
        if (selectedContent && selectedContent._id === rejectingContentId) {
          setSelectedContent(res.data.data);
        }
      }
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error(error.response?.data?.message || 'Failed to reject content');
    }
  };

  const handleSetRegionRestrictions = async (contentId, restrictions) => {
    try {
      const res = await api.put(`/api/admin/content-governance/${contentId}/region-restrictions`, restrictions);
      if (res.data.success) {
        toast.success('Region restrictions updated');
        fetchContent();
        if (selectedContent && selectedContent._id === contentId) {
          setSelectedContent(res.data.data);
        }
      }
    } catch (error) {
      console.error('Error setting region restrictions:', error);
      toast.error(error.response?.data?.message || 'Failed to update region restrictions');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending':
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    if (score >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const StatCard = ({ title, value, icon: Icon, color = 'from-blue-500 to-cyan-600', subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pending', label: 'Pending Review', icon: Clock },
    { id: 'approved', label: 'Approved Content', icon: CheckCircle },
    { id: 'analytics', label: 'Content Analytics', icon: TrendingUp },
    { id: 'restrictions', label: 'Age & Region', icon: Globe }
  ];

  if (loading && !content.length && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <Shield className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Content Governance</h1>
                  <p className="text-lg text-white/90">Track, approve & manage digital content</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchContent}
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
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Content"
              value={stats.total || 0}
              icon={FileText}
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              title="Pending Review"
              value={stats.pendingReview || 0}
              icon={Clock}
              color="from-yellow-500 to-amber-600"
              subtitle={`${stats.approvalRate || 0}% approval rate`}
            />
            <StatCard
              title="Approved"
              value={stats.approved || 0}
              icon={CheckCircle}
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              title="Published"
              value={stats.published || 0}
              icon={Eye}
              color="from-blue-500 to-cyan-600"
            />
          </div>
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'analytics') {
                      fetchAnalytics();
                    }
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
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
        {(activeTab === 'overview' || activeTab === 'pending' || activeTab === 'approved') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none font-medium"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="published">Published</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none font-medium"
              >
                <option value="all">All Types</option>
                <option value="lesson">Lesson</option>
                <option value="template">Template</option>
                <option value="module">Module</option>
                <option value="course">Course</option>
                <option value="resource">Resource</option>
                <option value="activity">Activity</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content List */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-gray-900">Recent Content</h2>
                {content.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">No content found</p>
                  </div>
                ) : (
                  content.slice(0, 10).map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleContentClick(item._id)}
                      className="bg-white rounded-xl shadow-lg border-2 p-5 cursor-pointer hover:shadow-xl transition-all border-gray-100 hover:border-purple-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(item.status)}`}>
                              {item.status.toUpperCase()}
                            </span>
                            {item.performance && (
                              <span className={`text-xs font-bold ${getPerformanceColor(item.performance.engagementScore)}`}>
                                Score: {item.performance.engagementScore}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{item.type}</span>
                            <span>•</span>
                            <span>{item.category}</span>
                            {item.ageRating && (
                              <>
                                <span>•</span>
                                <span>Age: {item.ageRating}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {item.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(item._id);
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRejectingContentId(item._id);
                                setShowRejectModal(true);
                              }}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Content Status Distribution</h3>
                  <div className="space-y-3">
                    {stats && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Approved</span>
                          <span className="font-bold text-green-600">{stats.approved || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Pending Review</span>
                          <span className="font-bold text-yellow-600">{stats.pendingReview || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Rejected</span>
                          <span className="font-bold text-red-600">{stats.rejected || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Published</span>
                          <span className="font-bold text-blue-600">{stats.published || 0}</span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>

                {analytics && analytics.summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Views</span>
                        <span className="font-bold text-purple-600">{analytics.summary.totalViews || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Completions</span>
                        <span className="font-bold text-green-600">{analytics.summary.totalCompletions || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Engagement</span>
                        <span className="font-bold text-blue-600">{analytics.summary.avgEngagementScore || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Completion Rate</span>
                        <span className="font-bold text-indigo-600">{analytics.summary.overallCompletionRate || 0}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pending Review Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-3">
            {content.filter(c => c.status === 'pending' || c.status === 'under_review').length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center"
              >
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">No pending content</p>
              </motion.div>
            ) : (
              content
                .filter(c => c.status === 'pending' || c.status === 'under_review')
                .map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg border-2 p-5 border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{item.type} • {item.category}</span>
                          {item.ageRating && <span>• Age: {item.ageRating}</span>}
                          {item.createdBy && <span>• By: {item.createdBy.fullName || item.createdBy.email}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(item._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectingContentId(item._id);
                            setShowRejectModal(true);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleContentClick(item._id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        )}

        {/* Approved Content Tab */}
        {activeTab === 'approved' && (
          <div className="space-y-3">
            {content.filter(c => c.status === 'approved' || c.status === 'published').length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center"
              >
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">No approved content</p>
              </motion.div>
            ) : (
              content
                .filter(c => c.status === 'approved' || c.status === 'published')
                .map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleContentClick(item._id)}
                    className="bg-white rounded-xl shadow-lg border-2 p-5 cursor-pointer hover:shadow-xl transition-all border-gray-100 hover:border-green-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{item.title}</h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(item.status)}`}>
                            {item.status.toUpperCase()}
                          </span>
                          {item.performance && (
                            <span className={`text-xs font-bold ${getPerformanceColor(item.performance.engagementScore)}`}>
                              Score: {item.performance.engagementScore}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{item.type} • {item.category}</span>
                          {item.ageRating && <span>• Age: {item.ageRating}</span>}
                          {item.performance && (
                            <>
                              <span>• {item.performance.views || 0} views</span>
                              <span>• {item.performance.completions || 0} completions</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContentClick(item._id);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Top Performing Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-green-600" />
                Top Performing Content
              </h2>
              <div className="space-y-3">
                {analytics.topContent?.slice(0, 10).map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.type} • {item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-black ${getPerformanceColor(item.performance?.engagementScore || 0)}`}>
                          {item.performance?.engagementScore || 0}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.performance?.views || 0} views • {item.performance?.completions || 0} completions
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Distribution */}
            {analytics.performanceDistribution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <BarChart className="w-7 h-7 text-purple-600" />
                  Performance Distribution
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200 text-center">
                    <p className="text-2xl font-black text-green-600">{analytics.performanceDistribution.excellent || 0}</p>
                    <p className="text-sm font-semibold text-gray-700">Excellent</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-center">
                    <p className="text-2xl font-black text-blue-600">{analytics.performanceDistribution.good || 0}</p>
                    <p className="text-sm font-semibold text-gray-700">Good</p>
                  </div>
                  <div className="p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200 text-center">
                    <p className="text-2xl font-black text-yellow-600">{analytics.performanceDistribution.fair || 0}</p>
                    <p className="text-sm font-semibold text-gray-700">Fair</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-center">
                    <p className="text-2xl font-black text-red-600">{analytics.performanceDistribution.poor || 0}</p>
                    <p className="text-sm font-semibold text-gray-700">Poor</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Age & Region Restrictions Tab */}
        {activeTab === 'restrictions' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Globe className="w-7 h-7 text-blue-600" />
                Age Appropriateness & Region Restrictions
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  View and manage age ratings and regional restrictions for content. Filter content by age rating or check region-specific access.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <select
                    value={filters.ageRating}
                    onChange={(e) => setFilters({ ...filters, ageRating: e.target.value, page: 1 })}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="all">All Age Ratings</option>
                    <option value="all">All Ages</option>
                    <option value="3+">3+</option>
                    <option value="7+">7+</option>
                    <option value="10+">10+</option>
                    <option value="13+">13+</option>
                    <option value="16+">16+</option>
                    <option value="18+">18+</option>
                  </select>
                  <select
                    value={filters.region}
                    onChange={(e) => setFilters({ ...filters, region: e.target.value, page: 1 })}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="all">All Regions</option>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="EU">Europe</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  {content
                    .filter(c => {
                      if (filters.ageRating !== 'all' && c.ageRating !== filters.ageRating) return false;
                      return true;
                    })
                    .map((item) => (
                      <div
                        key={item._id}
                        className="p-4 rounded-xl bg-white border-2 border-gray-100"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                              <span>{item.type} • {item.category}</span>
                              {item.ageRating && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">
                                  Age: {item.ageRating}
                                </span>
                              )}
                              {item.blockedRegions && item.blockedRegions.length > 0 && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-bold">
                                  Blocked in {item.blockedRegions.length} regions
                                </span>
                              )}
                            </div>
                            {item.regionAccess && !item.regionAccess.allowed && (
                              <p className="text-xs text-red-600 mb-2">
                                Restricted: {item.regionAccess.reason}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleContentClick(item._id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all text-sm"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Content Detail Sidebar */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Content Details</h2>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedContent.title}</h3>
                  <p className="text-gray-700">{selectedContent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getStatusColor(selectedContent.status)}`}>
                      {selectedContent.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Type</p>
                    <p className="font-bold text-gray-900">{selectedContent.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Age Rating</p>
                    <p className="font-bold text-gray-900">{selectedContent.ageRating || 'Not set'}</p>
                  </div>
                  {selectedContent.performance && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Engagement Score</p>
                      <p className={`font-bold ${getPerformanceColor(selectedContent.performance.engagementScore)}`}>
                        {selectedContent.performance.engagementScore}
                      </p>
                    </div>
                  )}
                </div>

                {selectedContent.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleApprove(selectedContent._id)}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setRejectingContentId(selectedContent._id);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-4">Reject Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:outline-none"
                    placeholder="Explain why this content is being rejected..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
                  >
                    Reject Content
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionReason('');
                      setRejectingContentId(null);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGovernance;

