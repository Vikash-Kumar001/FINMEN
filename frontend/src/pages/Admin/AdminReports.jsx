import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Download, Share2, Filter, Calendar, RefreshCw,
  Users, Building, TrendingUp, Activity, CheckCircle, XCircle,
  AlertTriangle, BarChart3, PieChart, LineChart, Database,
  Clock, Target, Award, Globe, Zap, Eye
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const AdminReports = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState('overview');
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    timeRange: 'month',
    startDate: '',
    endDate: '',
    reportType: 'comprehensive'
  });

  useEffect(() => {
    fetchReportData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchReportData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [activeReport, filters.timeRange]);

  useEffect(() => {
    if (socket?.socket) {
      const handleStatsUpdate = (data) => {
        // Refresh reports when stats update
        fetchReportData();
      };
      
      socket.socket.on('admin:stats:update', handleStatsUpdate);
      
      return () => {
        socket.socket.off('admin:stats:update', handleStatsUpdate);
      };
    }
  }, [socket]);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        reportType: activeReport,
        timeRange: filters.timeRange,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await api.get(`/api/admin/reports?${params}`);
      setReportData(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load report data');
      }
    } finally {
      setLoading(false);
    }
  }, [activeReport, filters]);

  const handleExport = async (format = 'pdf') => {
    try {
      setGenerating(true);
      const params = new URLSearchParams({
        reportType: activeReport,
        timeRange: filters.timeRange,
        format,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await api.get(`/api/admin/reports/export?${params}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admin-report-${activeReport}-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    } finally {
      setGenerating(false);
    }
  };

  const reportTypes = [
    { id: 'overview', label: 'Platform Overview', icon: BarChart3, color: 'from-blue-500 to-cyan-600' },
    { id: 'users', label: 'User Analytics', icon: Users, color: 'from-green-500 to-emerald-600' },
    { id: 'schools', label: 'School Reports', icon: Building, color: 'from-purple-500 to-pink-600' },
    { id: 'activity', label: 'Activity Reports', icon: Activity, color: 'from-orange-500 to-amber-600' },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle, color: 'from-indigo-500 to-purple-600' },
    { id: 'financial', label: 'Financial Summary', icon: Award, color: 'from-teal-500 to-cyan-600' }
  ];

  const StatCard = ({ title, value, icon: Icon, trend, subtitle, color = 'from-indigo-500 to-purple-600' }) => (
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

  if (loading && !reportData) {
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

  const data = reportData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <FileText className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Admin Reports</h1>
                  <p className="text-lg text-white/90">Comprehensive platform analytics and insights</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchReportData()}
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
        {/* Report Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveReport(type.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeReport === type.id
                      ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {type.label}
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
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filters:</span>
            </div>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none font-medium"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                placeholder="Start Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                placeholder="End Date"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => handleExport('pdf')}
                disabled={generating}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                {generating ? 'Generating...' : 'Export PDF'}
              </button>
              <button
                onClick={() => handleExport('csv')}
                disabled={generating}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                disabled={generating}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export JSON
              </button>
            </div>
          </div>
        </motion.div>

        {/* Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Users"
            value={data.totalUsers || data.overview?.totalUsers || 0}
            icon={Users}
            color="from-blue-500 to-cyan-600"
            trend={data.userGrowth ? `+${data.userGrowth}%` : null}
            subtitle="Platform users"
          />
          <StatCard
            title="Total Schools"
            value={data.totalSchools || data.overview?.totalSchools || 0}
            icon={Building}
            color="from-purple-500 to-pink-600"
            trend={data.schoolGrowth ? `+${data.schoolGrowth}%` : null}
            subtitle="Active institutions"
          />
          <StatCard
            title="Total Students"
            value={data.totalStudents || data.overview?.totalStudents || 0}
            icon={Users}
            color="from-green-500 to-emerald-600"
            trend={data.studentGrowth ? `+${data.studentGrowth}%` : null}
            subtitle="Active students"
          />
          <StatCard
            title="Activity Rate"
            value={data.activityRate || data.overview?.activityRate || 0}
            icon={Activity}
            color="from-orange-500 to-amber-600"
            trend={data.activityTrend || null}
            subtitle="Last 30 days"
          />
        </div>

        {/* Detailed Report Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-600" />
            {reportTypes.find(r => r.id === activeReport)?.label || 'Report Details'}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Report */}
              {activeReport === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Platform Growth
                    </h3>
                    <p className="text-3xl font-black text-blue-600 mb-2">{data.growthRate || 0}%</p>
                    <p className="text-sm text-gray-600">Growth in selected period</p>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Engagement Rate
                    </h3>
                    <p className="text-3xl font-black text-green-600 mb-2">{data.engagementRate || 0}%</p>
                    <p className="text-sm text-gray-600">Active user engagement</p>
                  </div>
                </div>
              )}

              {/* Users Report */}
              {activeReport === 'users' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">New Users</p>
                      <p className="text-2xl font-black text-indigo-600">{data.newUsers || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
                      <p className="text-2xl font-black text-green-600">{data.activeUsers || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Sessions</p>
                      <p className="text-2xl font-black text-blue-600">{data.totalSessions || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Avg Session</p>
                      <p className="text-2xl font-black text-purple-600">{data.avgSessionTime || 0}m</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Schools Report */}
              {activeReport === 'schools' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Active Schools</p>
                      <p className="text-2xl font-black text-purple-600">{data.activeSchools || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-pink-50 border-2 border-pink-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">New Schools</p>
                      <p className="text-2xl font-black text-pink-600">{data.newSchools || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Regions</p>
                      <p className="text-2xl font-black text-indigo-600">{data.totalRegions || 0}</p>
                    </div>
                  </div>
                  {data.schoolsByRegion && data.schoolsByRegion.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Schools by Region</h3>
                      <div className="space-y-2">
                        {data.schoolsByRegion.slice(0, 10).map((region, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <span className="font-semibold text-gray-700">{region.region || 'Unknown'}</span>
                            <span className="text-lg font-black text-indigo-600">{region.totalSchools || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Activity Report */}
              {activeReport === 'activity' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Activities</p>
                      <p className="text-2xl font-black text-orange-600">{data.totalActivities || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Today's Activities</p>
                      <p className="text-2xl font-black text-amber-600">{data.todayActivities || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Top Activity</p>
                      <p className="text-lg font-black text-yellow-600">{data.topActivity || 'N/A'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-lime-50 border-2 border-lime-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Peak Hour</p>
                      <p className="text-lg font-black text-lime-600">{data.peakHour || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Report */}
              {activeReport === 'compliance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Compliance Rate
                    </h3>
                    <p className="text-3xl font-black text-green-600 mb-2">{data.complianceRate || 99}%</p>
                    <p className="text-sm text-gray-600">GDPR & Privacy compliance</p>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Privacy Incidents
                    </h3>
                    <p className="text-3xl font-black text-red-600 mb-2">{data.privacyIncidents || 0}</p>
                    <p className="text-sm text-gray-600">Active privacy flags</p>
                  </div>
                </div>
              )}

              {/* Financial Report */}
              {activeReport === 'financial' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-teal-50 border-2 border-teal-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-2xl font-black text-teal-600">₹{data.totalRevenue || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-cyan-50 border-2 border-cyan-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Transactions</p>
                      <p className="text-2xl font-black text-cyan-600">{data.totalTransactions || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Avg Transaction</p>
                      <p className="text-2xl font-black text-blue-600">₹{data.avgTransaction || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200">
                      <p className="text-sm font-medium text-gray-600 mb-1">Refunds</p>
                      <p className="text-2xl font-black text-indigo-600">₹{data.totalRefunds || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Default message if no data */}
              {!data || Object.keys(data).length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No data available for this report</p>
                </div>
              ) : null}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReports;
