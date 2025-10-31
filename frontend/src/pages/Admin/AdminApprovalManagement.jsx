import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, CheckCircle, XCircle, Clock, AlertCircle, Lock, Eye,
  FileText, Plus, Search, Filter, Calendar, User, Check, X, Sparkles, Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const AdminApprovalManagement = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRequest, setExpandedRequest] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [requestsResponse, statsResponse] = await Promise.all([
        api.get('/api/admin/approvals/requests', {
          params: filterStatus !== 'all' ? { status: filterStatus } : {}
        }),
        api.get('/api/admin/approvals/stats')
      ]);

      setRequests(requestsResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load approval requests');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (requestId, comments = '') => {
    try {
      await api.put(`/api/admin/approvals/requests/${requestId}/approve`, { comments });
      toast.success('Request approved');
      fetchData();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    const reasonInput = prompt('Please provide a reason for rejection:');
    if (!reasonInput) return;

    try {
      await api.put(`/api/admin/approvals/requests/${requestId}/reject`, { reason: reasonInput });
      toast.success('Request rejected');
      fetchData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const handleAccessData = async (requestId) => {
    try {
      const response = await api.post(`/api/admin/approvals/requests/${requestId}/access`, { fields: [] });
      setShowAccessModal(response.data.data);
      toast.success('Data accessed successfully');
      fetchData();
    } catch (error) {
      console.error('Error accessing data:', error);
      toast.error('Failed to access data');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'from-green-400 to-emerald-500';
      case 'rejected': return 'from-red-400 to-pink-500';
      case 'pending': return 'from-yellow-400 to-orange-500';
      case 'expired': return 'from-gray-400 to-slate-500';
      default: return 'from-gray-400 to-slate-500';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'expired': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getApprovalProgress = (request) => {
    const approvals = request.approvedBy || [];
    return { current: approvals.length, required: 2 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                <Shield className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-2">Approval Management</h1>
                <p className="text-lg text-white/90">Dual-approval system for sensitive data access</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-6 h-6" />
              New Request
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900">{stats.totalRequests}</div>
                  <div className="text-sm text-gray-600 font-semibold">Total Requests</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-yellow-600">{stats.pendingApprovals}</div>
                  <div className="text-sm text-gray-600 font-semibold">Pending</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-green-600">{stats.byStatus?.approved || 0}</div>
                  <div className="text-sm text-gray-600 font-semibold">Approved</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-red-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-red-600">{stats.byStatus?.rejected || 0}</div>
                  <div className="text-sm text-gray-600 font-semibold">Rejected</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Filter className="w-6 h-6 text-indigo-600" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </motion.div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request, idx) => {
            const progress = getApprovalProgress(request);
            const isExpanded = expandedRequest === request._id;

            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all border-l-4 border-l-indigo-500"
                onClick={() => setExpandedRequest(isExpanded ? null : request._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-black text-gray-900 capitalize">
                        {request.approvalType.replace(/_/g, ' ')}
                      </h3>
                      <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border-2 ${getStatusBg(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                      <span className="px-4 py-1.5 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 border-2 border-blue-200 capitalize">
                        {request.targetType}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold">{request.requestedBy?.name || 'Unknown'}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold">{new Date(request.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    {request.status === 'pending' && (
                      <div className="mb-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-yellow-600" />
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all"
                              style={{ width: `${(progress.current / progress.required) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {progress.current} of {progress.required} approvals
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {request.status === 'approved' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccessData(request._id);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                      >
                        <Eye className="w-5 h-5" />
                        Access Data
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t-2 border-gray-200"
                  >
                    <div className="space-y-4">
                      <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                        <h4 className="font-black text-gray-900 mb-2 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          Justification
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{request.justification}</p>
                      </div>

                      {request.approvedBy && request.approvedBy.length > 0 && (
                        <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                          <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Approvals ({request.approvedBy.length})
                          </h4>
                          <div className="space-y-2">
                            {request.approvedBy.map((approval, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-3 border-2 border-green-200">
                                <Check className="w-5 h-5 text-green-600" />
                                <div className="flex-1">
                                  <span className="font-bold text-gray-900">{approval.admin?.name}</span>
                                  <span className="text-sm text-gray-600 ml-2">
                                    {new Date(approval.approvedAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(request._id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                            >
                              <Check className="w-5 h-5" />
                              Approve Request
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(request._id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                            >
                              <X className="w-5 h-5" />
                              Reject Request
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {requests.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-20 text-center border-2 border-gray-100">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-16 h-16 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">No Approval Requests</h3>
              <p className="text-gray-600 text-lg mb-6">All approval requests have been processed</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <CreateApprovalModal onClose={() => setShowCreateModal(false)} onSuccess={fetchData} />
      )}

      {/* Data Access Modal */}
      {showAccessModal && (
        <DataAccessModal data={showAccessModal} onClose={() => setShowAccessModal(null)} />
      )}
    </div>
  );
};

// Create Approval Modal Component
const CreateApprovalModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    approvalType: 'student_data_drilldown',
    targetType: 'student',
    targetId: '',
    justification: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/approvals/requests', formData);
      toast.success('Approval request created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create approval request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full border-4 border-indigo-300 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Zap className="w-8 h-8 text-indigo-600" />
            Create Approval Request
          </h3>
          <button onClick={onClose} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Approval Type</label>
            <select
              required
              value={formData.approvalType}
              onChange={(e) => setFormData({...formData, approvalType: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all font-semibold"
            >
              <option value="student_data_drilldown">Student Data Drilldown</option>
              <option value="export_data">Export Data</option>
              <option value="delete_user">Delete User</option>
              <option value="modify_settings">Modify Settings</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Target Type</label>
            <select
              required
              value={formData.targetType}
              onChange={(e) => setFormData({...formData, targetType: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all font-semibold"
            >
              <option value="student">Student</option>
              <option value="school">School</option>
              <option value="organization">Organization</option>
              <option value="platform">Platform</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Target ID</label>
            <input
              type="text"
              required
              value={formData.targetId}
              onChange={(e) => setFormData({...formData, targetId: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all"
              placeholder="Enter ID"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Justification</label>
            <textarea
              required
              value={formData.justification}
              onChange={(e) => setFormData({...formData, justification: e.target.value})}
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all"
              placeholder="Provide a detailed justification for accessing this data..."
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
            >
              <Plus className="w-5 h-5" />
              Create Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Data Access Modal Component
const DataAccessModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-green-300 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-green-600" />
            Access Granted Data
          </h3>
          <button onClick={onClose} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminApprovalManagement;
