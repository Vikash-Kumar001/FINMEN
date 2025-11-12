import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, Search, Filter, CheckCircle, XCircle, Clock, Download,
  Eye, TrendingUp, DollarSign, Calendar, Award, AlertCircle
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const AdminRedemptions = () => {
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [redemptions, setRedemptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchRedemptions();
    fetchStats();
  }, [currentPage, filterStatus, searchTerm]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (socket?.socket) {
      const handleRedemptionUpdate = (data) => {
        setRedemptions(prev => prev.map(r => 
          r._id === data.redemptionId 
            ? { ...r, status: data.status }
            : r
        ));
        fetchStats(); // Refresh stats
      };

      socket.socket.on('redemption:status:update', handleRedemptionUpdate);

      return () => {
        socket.socket.off('redemption:status:update', handleRedemptionUpdate);
      };
    }
  }, [socket]);

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined
      };
      const res = await api.get('/api/admin/redemptions', { params }).catch(() => ({ data: { data: { redemptions: [], pagination: { pages: 1 } } } }));
      setRedemptions(res.data.data?.redemptions || res.data.data || []);
      setTotalPages(res.data.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching redemptions:', error);
      toast.error('Failed to load redemptions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/redemptions/stats').catch(() => ({ data: { data: {} } }));
      setStats(res.data.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/admin/redemptions/${id}/approve`);
      toast.success('Redemption approved');
      fetchRedemptions();
      fetchStats();
    } catch (error) {
      console.error('Error approving redemption:', error);
      toast.error(error.response?.data?.error || 'Failed to approve redemption');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/admin/redemptions/${id}/reject`);
      toast.success('Redemption rejected');
      fetchRedemptions();
      fetchStats();
    } catch (error) {
      console.error('Error rejecting redemption:', error);
      toast.error(error.response?.data?.error || 'Failed to reject redemption');
    }
  };

  const StatCard = ({ title, value, icon: IconComponent, color }) => (
    <div className={`bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2">Redemptions Management 🎁</h1>
            <p className="text-lg text-white/90">Manage student reward redemptions</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Redemptions"
            value={stats.total || 0}
            icon={Gift}
            color="from-blue-500 to-cyan-600"
          />
          <StatCard
            title="Pending"
            value={stats.pending || 0}
            icon={Clock}
            color="from-amber-500 to-orange-600"
          />
          <StatCard
            title="Approved"
            value={stats.approved || 0}
            icon={CheckCircle}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected || 0}
            icon={XCircle}
            color="from-red-500 to-pink-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search redemptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Redemptions List */}
        <div className="space-y-4">
          {redemptions.length > 0 ? (
            redemptions.map((redemption, index) => (
              <motion.div
                key={redemption._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{redemption.rewardName || 'Reward'}</h3>
                    <p className="text-sm text-gray-600">{redemption.studentName || 'Unknown Student'}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    redemption.status === 'approved' ? 'bg-green-100 text-green-700' :
                    redemption.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {redemption.status || 'Pending'}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Points</p>
                    <p className="font-semibold">{redemption.points || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Date</p>
                    <p className="font-semibold">{new Date(redemption.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Email</p>
                    <p className="font-semibold">{redemption.studentEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Value</p>
                    <p className="font-semibold">₹{redemption.rewardValue || 0}</p>
                  </div>
                </div>
                {redemption.status === 'pending' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApprove(redemption._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(redemption._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No redemptions found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRedemptions;
