import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Key, Activity, Webhook, Heart, Plus, Search, Filter, RefreshCw,
  Eye, XCircle, Copy, CheckCircle, AlertTriangle, BarChart3, TrendingUp,
  TrendingDown, Clock, Globe, Shield, Zap, Settings, Download,
  Download as DownloadIcon, Trash2, Edit, AlertCircle, ExternalLink
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const APIControlPlane = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('keys');
  const [stats, setStats] = useState(null);
  const [keys, setKeys] = useState([]);
  const [usageMetrics, setUsageMetrics] = useState(null);
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    keyType: 'all',
    search: '',
    page: 1,
    limit: 20
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/api-control/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/api-control/keys', { params: filters });
      if (res.data.success) {
        setKeys(res.data.data.keys || []);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load API keys');
      }
    }
  }, [filters]);

  const fetchUsageMetrics = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/api-control/usage');
      if (res.data.success) {
        setUsageMetrics(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching usage metrics:', error);
    }
  }, []);

  const fetchWebhookLogs = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/api-control/webhooks');
      if (res.data.success) {
        setWebhookLogs(res.data.data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching webhook logs:', error);
    }
  }, []);

  const fetchIntegrations = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/api-control/integrations');
      if (res.data.success) {
        setIntegrations(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchKeys(), fetchUsageMetrics(), fetchWebhookLogs(), fetchIntegrations()])
      .finally(() => setLoading(false));
    
    // Socket.IO listeners
    if (socket?.socket) {
      const handlers = {
        'api:key:created': () => {
          toast.success('API key created');
          fetchKeys();
          fetchStats();
        },
        'api:key:revoked': () => {
          toast.success('API key revoked');
          fetchKeys();
          fetchStats();
        },
        'api:integration:created': () => {
          toast.success('Integration monitor created');
          fetchIntegrations();
        },
        'api:integration:health:checked': () => {
          fetchIntegrations();
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
  }, [fetchStats, fetchKeys, fetchUsageMetrics, fetchWebhookLogs, fetchIntegrations, socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'keys') fetchKeys();
      else if (activeTab === 'metrics') fetchUsageMetrics();
      else if (activeTab === 'webhooks') fetchWebhookLogs();
      else if (activeTab === 'integrations') fetchIntegrations();
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleCreateKey = async (formData) => {
    try {
      const res = await api.post('/api/admin/api-control/keys', formData);
      toast.success('API key created successfully');
      setShowKeyModal(false);
      setSelectedKey(res.data.data);
      fetchKeys();
      fetchStats();
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error(error.response?.data?.message || 'Failed to create API key');
    }
  };

  const handleRevokeKey = async (keyId, reason) => {
    try {
      await api.post(`/api/admin/api-control/keys/${keyId}/revoke`, { reason });
      toast.success('API key revoked successfully');
      fetchKeys();
      fetchStats();
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast.error(error.response?.data?.message || 'Failed to revoke API key');
    }
  };

  const handleCopyKey = (key) => {
    // Note: In production, you'd need to get the full key from the server
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCheckHealth = async (integrationId) => {
    try {
      await api.post(`/api/admin/api-control/integrations/${integrationId}/check`);
      toast.success('Health check completed');
      fetchIntegrations();
    } catch (error) {
      console.error('Error checking health:', error);
      toast.error('Failed to check integration health');
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

  if (loading && !stats) {
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
                  <Key className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">API Control Plane</h1>
                  <p className="text-lg text-white/90">API keys, usage metrics, webhooks & integration health</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (activeTab === 'keys') setShowKeyModal(true);
                    else if (activeTab === 'integrations') setShowIntegrationModal(true);
                  }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {activeTab === 'keys' ? 'New API Key' : 'New Integration'}
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
              title="Active API Keys"
              value={stats.keys?.active || 0}
              icon={Key}
              color="from-blue-500 to-cyan-600"
              subtitle={`${stats.keys?.total || 0} total`}
            />
            <StatCard
              title="API Requests"
              value={stats.usage?.total || 0}
              icon={Activity}
              color="from-green-500 to-emerald-600"
              subtitle={`${stats.usage?.failed || 0} failed`}
            />
            <StatCard
              title="Webhooks"
              value={stats.webhooks?.total || 0}
              icon={Webhook}
              color="from-purple-500 to-pink-600"
              subtitle={`${stats.webhooks?.failed || 0} failed`}
            />
            <StatCard
              title="Integrations"
              value={stats.integrations?.total || 0}
              icon={Heart}
              color="from-orange-500 to-amber-600"
              subtitle={`${stats.integrations?.unhealthy || 0} unhealthy`}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-6">
          <div className="flex border-b-2 border-gray-200 overflow-x-auto">
            {[
              { id: 'keys', label: 'API Keys', icon: Key },
              { id: 'metrics', label: 'Usage Metrics', icon: BarChart3 },
              { id: 'webhooks', label: 'Webhook Logs', icon: Webhook },
              { id: 'integrations', label: 'Integrations', icon: Heart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-b-4 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'keys' && (
          <APIKeysTab
            keys={keys}
            filters={filters}
            setFilters={setFilters}
            onRevoke={handleRevokeKey}
            onCopy={handleCopyKey}
            copiedKey={copiedKey}
          />
        )}

        {activeTab === 'metrics' && (
          <UsageMetricsTab metrics={usageMetrics} />
        )}

        {activeTab === 'webhooks' && (
          <WebhookLogsTab logs={webhookLogs} />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsTab
            integrations={integrations}
            onCheckHealth={handleCheckHealth}
          />
        )}

        {/* Modals */}
        {showKeyModal && (
          <APIKeyModal
            onClose={() => setShowKeyModal(false)}
            onCreate={handleCreateKey}
            onSuccess={(key) => {
              setSelectedKey(key);
              setShowKeyModal(false);
            }}
          />
        )}

        {showIntegrationModal && (
          <IntegrationModal
            onClose={() => setShowIntegrationModal(false)}
            onCreate={async (formData) => {
              try {
                await api.post('/api/admin/api-control/integrations', formData);
                toast.success('Integration monitor created');
                setShowIntegrationModal(false);
                fetchIntegrations();
              } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to create integration');
              }
            }}
          />
        )}

        {/* New Key Success Modal */}
        {selectedKey && (
          <NewKeySuccessModal
            key={selectedKey._id}
            apiKey={selectedKey}
            onClose={() => setSelectedKey(null)}
            onCopy={handleCopyKey}
          />
        )}
      </div>
    </div>
  );
};

// API Keys Tab Component
const APIKeysTab = ({ keys, filters, setFilters, onRevoke, onCopy, copiedKey }) => (
  <div className="space-y-4">
    {/* Filters */}
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Key Type</label>
          <select
            value={filters.keyType}
            onChange={(e) => setFilters({ ...filters, keyType: e.target.value, page: 1 })}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
          >
            <option value="all">All Types</option>
            <option value="live">Live</option>
            <option value="test">Test</option>
            <option value="development">Development</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search keys..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Keys List */}
    <div className="space-y-3">
      {keys.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
          <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No API keys found</p>
        </div>
      ) : (
        keys.map((key) => (
          <motion.div
            key={key._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-black text-gray-900">{key.keyName}</h3>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    key.status === 'active' ? 'bg-green-100 text-green-800' :
                    key.status === 'revoked' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {key.status}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800">
                    {key.keyType}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{key.description || 'No description'}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg">
                    {key.apiKey}
                  </span>
                  <button
                    onClick={() => onCopy(key.apiKey)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    {copiedKey === key.apiKey ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span>Scopes: {key.scopes?.join(', ') || 'none'}</span>
                  <span>•</span>
                  <span>Rate Limit: {key.rateLimit?.requestsPerMinute || 0}/min</span>
                  <span>•</span>
                  <span>Usage: {key.usage?.totalRequests || 0} requests</span>
                  {key.usage?.lastUsed && (
                    <>
                      <span>•</span>
                      <span>Last Used: {new Date(key.usage.lastUsed).toLocaleString()}</span>
                    </>
                  )}
                </div>
              </div>
              {key.status === 'active' && (
                <button
                  onClick={() => {
                    const reason = prompt('Enter revocation reason:');
                    if (reason) onRevoke(key._id, reason);
                  }}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-bold hover:bg-red-200 transition-all flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Revoke
                </button>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  </div>
);

// Usage Metrics Tab Component
const UsageMetricsTab = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">No usage metrics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600">Total Requests</span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-gray-900">{metrics.totalRequests || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.successfulRequests || 0} successful
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600">Success Rate</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-black text-gray-900">{metrics.successRate || 0}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.failedRequests || 0} failed
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600">Avg Response Time</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-gray-900">{metrics.averageResponseTime || 0}ms</p>
        </div>
      </div>

      {/* Top Endpoints */}
      {metrics.topEndpoints?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-xl font-black text-gray-900 mb-4">Top Endpoints</h3>
          <div className="space-y-2">
            {metrics.topEndpoints.map((endpoint, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-semibold text-gray-700">{endpoint._id || endpoint.endpoint}</span>
                <span className="font-black text-gray-900">{endpoint.count || 0} requests</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Webhook Logs Tab Component
const WebhookLogsTab = ({ logs }) => (
  <div className="space-y-3">
    {logs.length === 0 ? (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
        <Webhook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">No webhook logs found</p>
      </div>
    ) : (
      logs.map((log) => (
        <motion.div
          key={log._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-black text-gray-900">{log.eventName}</h3>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  log.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  log.status === 'failed' ? 'bg-red-100 text-red-800' :
                  log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {log.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">URL: {log.webhookUrl}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Event: {log.eventType}</span>
                <span>•</span>
                <span>Attempts: {log.totalAttempts || 0}</span>
                {log.sentAt && (
                  <>
                    <span>•</span>
                    <span>Sent: {new Date(log.sentAt).toLocaleString()}</span>
                  </>
                )}
              </div>
            </div>
            {log.responseCode && (
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                log.responseCode >= 200 && log.responseCode < 300 ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {log.responseCode}
              </span>
            )}
          </div>
        </motion.div>
      ))
    )}
  </div>
);

// Integrations Tab Component
const IntegrationsTab = ({ integrations, onCheckHealth }) => (
  <div className="space-y-3">
    {integrations.length === 0 ? (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">No integrations found</p>
      </div>
    ) : (
      integrations.map((integration) => (
        <motion.div
          key={integration._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-black text-gray-900">{integration.integrationName}</h3>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  integration.status === 'healthy' ? 'bg-green-100 text-green-800' :
                  integration.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                  integration.status === 'down' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {integration.status}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800">
                  {integration.integrationType}
                </span>
              </div>
              {integration.provider && (
                <p className="text-sm text-gray-600 mb-3">Provider: {integration.provider}</p>
              )}
              {integration.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Response Time:</span>
                    <p className="font-bold text-gray-900">{integration.metrics.responseTime || 0}ms</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Success Rate:</span>
                    <p className="font-bold text-gray-900">{integration.metrics.successRate || 0}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Uptime:</span>
                    <p className="font-bold text-gray-900">{integration.metrics.uptime || 0}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Failures:</span>
                    <p className="font-bold text-gray-900">{integration.metrics.consecutiveFailures || 0}</p>
                  </div>
                </div>
              )}
              {integration.alerts?.filter(a => !a.resolved).length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border-2 border-red-200">
                  <p className="text-sm font-semibold text-red-800 mb-1">Active Alerts:</p>
                  {integration.alerts.filter(a => !a.resolved).map((alert, idx) => (
                    <p key={idx} className="text-xs text-red-600">• {alert.message}</p>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => onCheckHealth(integration._id)}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-bold hover:bg-blue-200 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Check
            </button>
          </div>
        </motion.div>
      ))
    )}
  </div>
);

// API Key Modal Component
const APIKeyModal = ({ onClose, onCreate, onSuccess }) => {
  const [form, setForm] = useState({
    keyName: '',
    description: '',
    keyType: 'development',
    scopes: ['read'],
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000
    },
    expiresAt: ''
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
          <h2 className="text-2xl font-black text-gray-900">Create API Key</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Key Name *</label>
            <input
              type="text"
              required
              value={form.keyName}
              onChange={(e) => setForm({ ...form, keyName: e.target.value })}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Key Type</label>
              <select
                value={form.keyType}
                onChange={(e) => setForm({ ...form, keyType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="development">Development</option>
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expires At (optional)</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Scopes</label>
            <div className="flex flex-wrap gap-2">
              {['read', 'write', 'admin', 'webhook', 'reporting', 'analytics'].map((scope) => (
                <label key={scope} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.scopes.includes(scope)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, scopes: [...form.scopes, scope] });
                      } else {
                        setForm({ ...form, scopes: form.scopes.filter(s => s !== scope) });
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm font-semibold text-gray-700 capitalize">{scope}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Requests/Min</label>
              <input
                type="number"
                value={form.rateLimit.requestsPerMinute}
                onChange={(e) => setForm({
                  ...form,
                  rateLimit: { ...form.rateLimit, requestsPerMinute: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Requests/Hour</label>
              <input
                type="number"
                value={form.rateLimit.requestsPerHour}
                onChange={(e) => setForm({
                  ...form,
                  rateLimit: { ...form.rateLimit, requestsPerHour: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Requests/Day</label>
              <input
                type="number"
                value={form.rateLimit.requestsPerDay}
                onChange={(e) => setForm({
                  ...form,
                  rateLimit: { ...form.rateLimit, requestsPerDay: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
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
              Create Key
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// New Key Success Modal
const NewKeySuccessModal = ({ apiKey, onClose, onCopy }) => {
  const fullKey = apiKey.apiKey; // In production, fetch full key from server
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">API Key Created</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Your API Key (save this - it won't be shown again):</p>
          <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
            <code className="flex-1 font-mono text-sm">{fullKey}</code>
            <button
              onClick={() => onCopy(fullKey)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Integration Modal Component
const IntegrationModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    integrationName: '',
    integrationType: 'api',
    provider: '',
    endpoint: '',
    checkInterval: 300000
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
          <h2 className="text-2xl font-black text-gray-900">Add Integration Monitor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Integration Name *</label>
            <input
              type="text"
              required
              value={form.integrationName}
              onChange={(e) => setForm({ ...form, integrationName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Integration Type</label>
              <select
                value={form.integrationType}
                onChange={(e) => setForm({ ...form, integrationType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="api">API</option>
                <option value="webhook">Webhook</option>
                <option value="sso">SSO</option>
                <option value="payment">Payment</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
              <input
                type="text"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                placeholder="e.g., Stripe, Twilio"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Endpoint/URL</label>
            <input
              type="text"
              value={form.endpoint}
              onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
              placeholder="https://api.example.com/health"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
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
              Create Monitor
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default APIControlPlane;

