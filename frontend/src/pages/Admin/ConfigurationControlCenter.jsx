import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings, ToggleLeft, ToggleRight, Plus, Search, Filter, RefreshCw,
  Globe, Users, Building, Target, Percent, Zap, Clock, AlertCircle,
  CheckCircle, XCircle, Edit, Eye, Trash2, Save, X, TrendingUp,
  BarChart3, Activity, MapPin, Shield, Sparkles, ArrowRight,
  Calendar, FileText, Key, Lock, Unlock
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const ConfigurationControlCenter = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [flags, setFlags] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    enabled: 'all',
    search: '',
    page: 1,
    limit: 50
  });
  const [editForm, setEditForm] = useState({});

  const fetchFlags = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/configuration', { params: filters });
      if (res.data.success) {
        setFlags(res.data.data.flags || []);
      }
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load feature flags');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/configuration/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
    fetchStats();
    
    // Socket.IO listener for real-time updates
    if (socket?.socket) {
      const handlers = {
        'config:feature:created': (data) => {
          toast.success(`New feature flag created: ${data.name}`);
          fetchFlags();
          fetchStats();
        },
        'config:feature:updated': (data) => {
          toast.success(`Feature flag updated: ${data.name}`);
          fetchFlags();
          fetchStats();
        },
        'config:feature:toggled': (data) => {
          toast.success(`Feature flag ${data.enabled ? 'enabled' : 'disabled'}: ${data.name}`);
          fetchFlags();
          fetchStats();
        },
        'config:rollout:updated': (data) => {
          toast.success(`Rollout updated for: ${data.name}`);
          fetchFlags();
          fetchStats();
        },
        'config:regional:updated': (data) => {
          toast.success(`Regional override updated for: ${data.name}`);
          fetchFlags();
          fetchStats();
        }
      };
      
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.socket.on(event, handler);
      });
      
      return () => {
        Object.keys(handlers).forEach(event => {
          socket.socket.off(event);
        });
      };
    }
  }, [fetchFlags, fetchStats, socket]);

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchFlags();
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (flagId, currentEnabled) => {
    try {
      await api.post(`/api/admin/configuration/${flagId}/toggle`, {
        enabled: !currentEnabled,
        reason: `Toggled by admin`
      });
      toast.success(`Feature ${!currentEnabled ? 'enabled' : 'disabled'}`);
      fetchFlags();
      fetchStats();
    } catch (error) {
      console.error('Error toggling feature:', error);
      toast.error('Failed to toggle feature');
    }
  };

  const handleUpdateRollout = async (flagId, percentage) => {
    try {
      await api.put(`/api/admin/configuration/${flagId}/rollout`, {
        percentage,
        reason: `Rollout percentage updated to ${percentage}%`
      });
      toast.success(`Rollout percentage updated to ${percentage}%`);
      fetchFlags();
    } catch (error) {
      console.error('Error updating rollout:', error);
      toast.error('Failed to update rollout percentage');
    }
  };

  const handleCreateFlag = async (formData) => {
    try {
      await api.post('/api/admin/configuration', formData);
      toast.success('Feature flag created successfully');
      setShowCreateModal(false);
      fetchFlags();
      fetchStats();
    } catch (error) {
      console.error('Error creating feature flag:', error);
      toast.error(error.response?.data?.message || 'Failed to create feature flag');
    }
  };

  const handleEditFlag = async (flagId, updates) => {
    try {
      await api.put(`/api/admin/configuration/${flagId}`, updates);
      toast.success('Feature flag updated successfully');
      setShowEditModal(false);
      setSelectedFlag(null);
      fetchFlags();
      fetchStats();
    } catch (error) {
      console.error('Error updating feature flag:', error);
      toast.error(error.response?.data?.message || 'Failed to update feature flag');
    }
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

  const getCategoryColor = (category) => {
    const colors = {
      feature: 'from-blue-500 to-cyan-600',
      experiment: 'from-purple-500 to-pink-600',
      beta: 'from-orange-500 to-amber-600',
      maintenance: 'from-gray-500 to-slate-600',
      security: 'from-red-500 to-pink-600',
      integration: 'from-green-500 to-emerald-600',
      ui: 'from-indigo-500 to-purple-600',
      api: 'from-teal-500 to-cyan-600'
    };
    return colors[category] || 'from-gray-500 to-slate-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading && !flags.length && !stats) {
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
                  <Settings className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Configuration Control Center</h1>
                  <p className="text-lg text-white/90">LaunchDarkly-style feature flags & configuration management</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  New Flag
                </button>
                <button
                  onClick={fetchFlags}
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
              title="Total Flags"
              value={stats.total || 0}
              icon={Settings}
              color="from-gray-500 to-slate-600"
            />
            <StatCard
              title="Enabled"
              value={stats.enabled || 0}
              icon={ToggleRight}
              color="from-green-500 to-emerald-600"
              subtitle={`${stats.disabled || 0} disabled`}
            />
            <StatCard
              title="Active Experiments"
              value={stats.activeExperiments || 0}
              icon={BarChart3}
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              title="Regional Overrides"
              value={stats.regionalOverrides || 0}
              icon={Globe}
              color="from-blue-500 to-cyan-600"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-6">
          <div className="flex border-b-2 border-gray-200">
            {['overview', 'flags', 'experiments', 'beta', 'regional'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-bold transition-all ${
                  activeTab === tab
                    ? 'text-gray-900 border-b-4 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
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
                <option value="feature">Feature</option>
                <option value="experiment">Experiment</option>
                <option value="beta">Beta</option>
                <option value="maintenance">Maintenance</option>
                <option value="security">Security</option>
                <option value="integration">Integration</option>
                <option value="ui">UI</option>
                <option value="api">API</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Enabled</label>
              <select
                value={filters.enabled}
                onChange={(e) => setFilters({ ...filters, enabled: e.target.value, page: 1 })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
              >
                <option value="all">All</option>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flags..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Flags List */}
        {activeTab === 'overview' || activeTab === 'flags' ? (
          <div className="space-y-4">
            {flags.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center"
              >
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold mb-4">No feature flags found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
                >
                  Create First Flag
                </button>
              </motion.div>
            ) : (
              flags.map((flag) => (
                <motion.div
                  key={flag._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(flag.status)}`}>
                            {flag.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getCategoryColor(flag.category)} text-white`}>
                            {flag.category}
                          </span>
                          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-800">
                            {flag.key}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">{flag.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{flag.description || 'No description'}</p>
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Percent className="w-4 h-4" />
                            Rollout: {flag.rolloutPercentage}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {flag.rolloutType.replace('_', ' ')}
                          </span>
                          {flag.regionalOverrides?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {flag.regionalOverrides.length} regions
                            </span>
                          )}
                          {flag.experiments?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              {flag.experiments.length} experiments
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggle(flag._id || flag.key, flag.enabled)}
                          className={`p-3 rounded-lg transition-all ${
                            flag.enabled
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={flag.enabled ? 'Disable' : 'Enable'}
                        >
                          {flag.enabled ? (
                            <ToggleRight className="w-6 h-6" />
                          ) : (
                            <ToggleLeft className="w-6 h-6" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFlag(flag);
                            setEditForm(flag);
                            setShowEditModal(true);
                          }}
                          className="p-3 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Rollout Slider */}
                    {flag.enabled && (
                      <div className="mt-4 pt-4 border-t-2 border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-700">Rollout Percentage</label>
                          <span className="text-sm font-bold text-gray-900">{flag.rolloutPercentage}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={flag.rolloutPercentage}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            handleUpdateRollout(flag._id || flag.key, newValue);
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : activeTab === 'experiments' ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <p className="text-gray-600">Experiments management - Coming soon</p>
          </div>
        ) : activeTab === 'beta' ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <p className="text-gray-600">Beta access management - Coming soon</p>
          </div>
        ) : activeTab === 'regional' ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <p className="text-gray-600">Regional overrides management - Coming soon</p>
          </div>
        ) : null}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateFlagModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateFlag}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedFlag && (
          <EditFlagModal
            flag={selectedFlag}
            onClose={() => {
              setShowEditModal(false);
              setSelectedFlag(null);
            }}
            onUpdate={handleEditFlag}
          />
        )}
      </div>
    </div>
  );
};

// Create Flag Modal Component
const CreateFlagModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    key: '',
    name: '',
    description: '',
    category: 'feature',
    enabled: false,
    rolloutPercentage: 0,
    rolloutType: 'global',
    configuration: {},
    tags: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Create Feature Flag</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Key *</label>
            <input
              type="text"
              required
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              placeholder="feature.awesome_new_feature"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Awesome New Feature"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what this feature flag controls..."
              rows="3"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="feature">Feature</option>
                <option value="experiment">Experiment</option>
                <option value="beta">Beta</option>
                <option value="maintenance">Maintenance</option>
                <option value="security">Security</option>
                <option value="integration">Integration</option>
                <option value="ui">UI</option>
                <option value="api">API</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rollout Type</label>
              <select
                value={form.rolloutType}
                onChange={(e) => setForm({ ...form, rolloutType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="global">Global</option>
                <option value="percentage">Percentage</option>
                <option value="specific_orgs">Specific Orgs</option>
                <option value="specific_users">Specific Users</option>
                <option value="regional">Regional</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-700">Enable immediately</span>
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              Create Flag
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Edit Flag Modal Component
const EditFlagModal = ({ flag, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    name: flag.name || '',
    description: flag.description || '',
    category: flag.category || 'feature',
    enabled: flag.enabled || false,
    rolloutPercentage: flag.rolloutPercentage || 0,
    rolloutType: flag.rolloutType || 'global',
    configuration: flag.configuration || {}
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(flag._id || flag.key, form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Edit Feature Flag</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Key</label>
            <input
              type="text"
              value={flag.key}
              disabled
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="feature">Feature</option>
                <option value="experiment">Experiment</option>
                <option value="beta">Beta</option>
                <option value="maintenance">Maintenance</option>
                <option value="security">Security</option>
                <option value="integration">Integration</option>
                <option value="ui">UI</option>
                <option value="api">API</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rollout Type</label>
              <select
                value={form.rolloutType}
                onChange={(e) => setForm({ ...form, rolloutType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="global">Global</option>
                <option value="percentage">Percentage</option>
                <option value="specific_orgs">Specific Orgs</option>
                <option value="specific_users">Specific Users</option>
                <option value="regional">Regional</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-700">Enabled</span>
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              Update Flag
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ConfigurationControlCenter;

