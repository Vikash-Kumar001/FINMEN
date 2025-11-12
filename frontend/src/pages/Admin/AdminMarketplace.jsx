import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Store, TrendingUp, Download, Star, CheckCircle, Clock, XCircle, 
  Filter, Search, RefreshCw, Eye, AlertCircle, Package, Zap, Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';

const AdminMarketplace = () => {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);
  const socket = useSocket();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/marketplace').catch(() => ({ data: { data: null } }));
      
      if (res.data?.data) {
        setModules(res.data.data.modules || []);
        setStats(res.data.data.stats || null);
      }
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load marketplace data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  // Real-time Socket.IO updates
  useEffect(() => {
    if (socket?.socket) {
      const handleModuleUpdate = (data) => {
        setModules(prev => prev.map(m =>
          m.id === data.moduleId
            ? { ...m, ...data }
            : m
        ));
        fetchData(); // Refresh stats
      };

      socket.socket.on('admin:marketplace:update', handleModuleUpdate);
      return () => {
        socket.socket.off('admin:marketplace:update', handleModuleUpdate);
      };
    }
  }, [socket, fetchData]);

  const handleApprove = async (moduleId) => {
    try {
      await api.put(`/api/marketplace/${moduleId}/approve`);
      toast.success('Module approved successfully');
      fetchData();
    } catch (error) {
      console.error('Error approving module:', error);
      toast.error('Failed to approve module');
    }
  };

  const handleReject = async (moduleId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await api.put(`/api/marketplace/${moduleId}/reject`, { reason });
      toast.success('Module rejected');
      fetchData();
    } catch (error) {
      console.error('Error rejecting module:', error);
      toast.error('Failed to reject module');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'from-green-400 to-emerald-500';
      case 'approved': return 'from-blue-400 to-cyan-500';
      case 'pending': return 'from-yellow-400 to-orange-500';
      case 'rejected': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-slate-500';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'approved': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesStatus = filterStatus === 'all' || module.status === filterStatus;
    const matchesType = filterType === 'all' || module.type === filterType;
    const matchesSearch = searchQuery === '' || 
      module.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </motion.div>
  );

  if (loading && !modules.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white py-16 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                <Store className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-2">Marketplace Management</h1>
                <p className="text-lg text-white/90">Manage modules, approve listings, and monitor marketplace activity</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-6 h-6" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Modules"
              value={stats.totalModules || 0}
              icon={Package}
              color="from-blue-500 to-cyan-600"
            />
            <StatCard
              title="Pending Approvals"
              value={stats.pendingApprovals || 0}
              icon={Clock}
              color="from-yellow-500 to-orange-600"
            />
            <StatCard
              title="Active Modules"
              value={stats.activeModules || 0}
              icon={CheckCircle}
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              title="Total Downloads"
              value={stats.totalDownloads || 0}
              icon={Download}
              color="from-purple-500 to-pink-600"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="inavora">Inavora</option>
              <option value="third-party">Third Party</option>
            </select>
          </div>
        </div>

        {/* Modules List */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
          {filteredModules.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No modules found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredModules.map((module, idx) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-gray-900">{module.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBg(module.status)}`}>
                          {module.status}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold capitalize">
                          {module.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          <span className="font-semibold">{module.downloads || 0}</span>
                          <span>downloads</span>
                        </div>
                        {module.rating > 0 && (
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{module.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {module.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(module.id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(module.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedModule(module)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        View
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6 border-b-2 border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">{selectedModule.name}</h2>
              <button
                onClick={() => setSelectedModule(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getStatusBg(selectedModule.status)}`}>
                  {selectedModule.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Type</h3>
                <p className="text-gray-900 capitalize">{selectedModule.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Downloads</h3>
                <p className="text-gray-900">{selectedModule.downloads || 0}</p>
              </div>
              {selectedModule.rating > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">Rating</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-900 font-semibold">{selectedModule.rating}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminMarketplace;

