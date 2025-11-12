import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  History, Clock, User, Search, Filter, Download, RefreshCw,
  Eye, ArrowLeft, Calendar, AlertCircle, CheckCircle, XCircle,
  ArrowRight, ChevronDown, ChevronUp, FileText, BarChart3,
  TrendingUp, Shield, Zap, Activity, Globe, Target
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const AuditTimeline = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    performedBy: 'all',
    targetType: 'all',
    actionType: 'all',
    category: 'all',
    severity: 'all',
    search: '',
    page: 1,
    limit: 50
  });
  const [expandedLogs, setExpandedLogs] = useState(new Set());

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/audit-timeline', { params: filters });
      if (res.data.success) {
        setLogs(res.data.data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load audit logs');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/audit-timeline/stats', {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchLogs();
    fetchStats();
    
    // Socket.IO listener for new audit logs
    if (socket?.socket) {
      const handleNewAudit = (data) => {
        toast.success(`New audit log: ${data.action}`);
        fetchLogs();
        fetchStats();
      };
      
      socket.socket.on('admin:audit:new', handleNewAudit);
      
      return () => {
        socket.socket.off('admin:audit:new', handleNewAudit);
      };
    }
  }, [fetchLogs, fetchStats, socket]);

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLogs();
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogClick = async (logId) => {
    try {
      const res = await api.get(`/api/admin/audit-timeline/${logId}`);
      if (res.data.success) {
        setSelectedLog(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching log details:', error);
      toast.error('Failed to load log details');
    }
  };

  const toggleExpand = (logId) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const handleExport = async (format = 'json') => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        format,
        startDate: filters.startDate || '',
        endDate: filters.endDate || ''
      });
      
      const response = await api.get(`/api/admin/audit-timeline/export?${queryParams}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-log-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Audit log exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast.error('Failed to export audit logs');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getActionTypeColor = (actionType) => {
    switch (actionType) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'approve': return 'bg-emerald-100 text-emerald-800';
      case 'reject': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
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

  if (loading && !logs.length && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-gray-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 via-slate-700 to-zinc-700 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <History className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Incident & Audit Timeline</h1>
                  <p className="text-lg text-white/90">Complete audit trail of all admin actions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleExport('csv')}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export JSON
                </button>
                <button
                  onClick={fetchLogs}
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
              title="Total Actions"
              value={stats.total || 0}
              icon={Activity}
              color="from-gray-500 to-slate-600"
            />
            <StatCard
              title="By Category"
              value={stats.byCategory?.length || 0}
              icon={BarChart3}
              color="from-blue-500 to-cyan-600"
              subtitle={`${stats.byActionType?.length || 0} action types`}
            />
            <StatCard
              title="Active Users"
              value={stats.byUser?.length || 0}
              icon={User}
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              title="Recent Actions"
              value={stats.recentActions?.length || 0}
              icon={Clock}
              color="from-green-500 to-emerald-600"
            />
          </div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-black text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Action Type</label>
              <select
                value={filters.actionType}
                onChange={(e) => setFilters({ ...filters, actionType: e.target.value, page: 1 })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
              >
                <option value="all">All Types</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
                <option value="access">Access</option>
                <option value="export">Export</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
              >
                <option value="all">All Categories</option>
                <option value="user">User</option>
                <option value="content">Content</option>
                <option value="organization">Organization</option>
                <option value="payment">Payment</option>
                <option value="approval">Approval</option>
                <option value="incident">Incident</option>
                <option value="support">Support</option>
                <option value="governance">Governance</option>
                <option value="financial">Financial</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Type</label>
              <select
                value={filters.targetType}
                onChange={(e) => setFilters({ ...filters, targetType: e.target.value, page: 1 })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
              >
                <option value="all">All Targets</option>
                <option value="user">User</option>
                <option value="content">Content</option>
                <option value="organization">Organization</option>
                <option value="ticket">Ticket</option>
                <option value="incident">Incident</option>
                <option value="payment">Payment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value, page: 1 })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search actions, users, descriptions..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Audit Timeline */}
        <div className="space-y-4">
          {logs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center"
            >
              <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">No audit logs found</p>
            </motion.div>
          ) : (
            logs.map((log) => {
              const isExpanded = expandedLogs.has(log._id);
              return (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden"
                >
                  <div
                    className="p-5 cursor-pointer hover:bg-gray-50 transition-all"
                    onClick={() => toggleExpand(log._id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getSeverityColor(log.severity)}`}>
                            {log.severity.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getActionTypeColor(log.actionType)}`}>
                            {log.actionType.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800">
                            {log.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{log.action}</h3>
                        <p className="text-sm text-gray-600 mb-2">{log.description || 'No description'}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {log.performedByName || log.performedBy?.fullName || 'Unknown'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {log.targetType} {log.targetId ? `(${log.targetId.toString().slice(-8)})` : ''}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTimestamp(log.timestamp)}
                          </span>
                          {log.ipAddress && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                {log.ipAddress}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogClick(log._id);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t-2 border-gray-200 p-5 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Performed By</p>
                          <p className="text-gray-900">
                            {log.performedByName || log.performedBy?.fullName || 'Unknown'} 
                            ({log.performedByRole || log.performedBy?.role || 'Unknown'})
                          </p>
                          {log.performedByEmail && (
                            <p className="text-gray-600 text-xs">{log.performedByEmail}</p>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Target</p>
                          <p className="text-gray-900">
                            {log.targetType} - {log.targetName || log.targetId?.toString().slice(-8) || 'N/A'}
                          </p>
                          {log.organizationId && (
                            <p className="text-gray-600 text-xs">Org: {log.organizationId?.name || log.organizationId}</p>
                          )}
                        </div>
                        {log.changes && Object.keys(log.changes).length > 0 && (
                          <div className="md:col-span-2">
                            <p className="font-semibold text-gray-700 mb-2">Changes</p>
                            {log.changes.summary && (
                              <p className="text-gray-900 mb-2">{log.changes.summary}</p>
                            )}
                            {log.changes.fieldsChanged && log.changes.fieldsChanged.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {log.changes.fieldsChanged.map((field, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">
                                    {field}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {log.reason && (
                          <div className="md:col-span-2">
                            <p className="font-semibold text-gray-700 mb-1">Reason</p>
                            <p className="text-gray-900">{log.reason}</p>
                          </div>
                        )}
                        {log.requestMethod && (
                          <div>
                            <p className="font-semibold text-gray-700 mb-1">Request</p>
                            <p className="text-gray-900">{log.requestMethod} {log.requestPath}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {logs.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
              disabled={filters.page === 1}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">Page {filters.page}</span>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={logs.length < filters.limit}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Action Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Action Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Main Action Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Action</p>
                    <p className="text-lg font-bold text-gray-900">{selectedLog.action}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Type</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getActionTypeColor(selectedLog.actionType)}`}>
                      {selectedLog.actionType}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Category</p>
                    <p className="font-bold text-gray-900">{selectedLog.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Severity</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold text-white ${getSeverityColor(selectedLog.severity)}`}>
                      {selectedLog.severity}
                    </span>
                  </div>
                </div>

                {/* Performed By */}
                <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Performed By</p>
                  <p className="font-bold text-gray-900">
                    {selectedLog.performedByName || selectedLog.performedBy?.fullName || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">{selectedLog.performedByEmail || selectedLog.performedBy?.email}</p>
                  <p className="text-xs text-gray-500">Role: {selectedLog.performedByRole || selectedLog.performedBy?.role}</p>
                </div>

                {/* Changes */}
                {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
                  <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Changes Made</p>
                    {selectedLog.changes.summary && (
                      <p className="text-gray-900 mb-3">{selectedLog.changes.summary}</p>
                    )}
                    {selectedLog.changes.fieldsChanged && selectedLog.changes.fieldsChanged.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Fields Changed:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedLog.changes.fieldsChanged.map((field, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-200 text-green-900 rounded-lg text-xs font-bold">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedLog.changes.before && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Before:</p>
                        <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                          {JSON.stringify(selectedLog.changes.before, null, 2)}
                        </pre>
                      </div>
                    )}
                    {selectedLog.changes.after && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">After:</p>
                        <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                          {JSON.stringify(selectedLog.changes.after, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Related Actions */}
                {selectedLog.relatedActions && selectedLog.relatedActions.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Related Actions</p>
                    <div className="space-y-2">
                      {selectedLog.relatedActions.slice(0, 5).map((related, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{related.action}</p>
                              <p className="text-xs text-gray-600">{formatTimestamp(related.timestamp)}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getActionTypeColor(related.actionType)}`}>
                              {related.actionType}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Additional Information</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTimeline;

