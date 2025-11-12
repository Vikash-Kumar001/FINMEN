import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Send, Mail, Smartphone, Bell, Calendar, Filter,
  Search, RefreshCw, Plus, Edit, Eye, BarChart3, TrendingUp, TrendingDown,
  Users, Target, Clock, AlertCircle, CheckCircle, XCircle, FileText,
  Settings, Zap, Globe, Building, User, ArrowRight, Download,
  PieChart, Activity, Shield, Sparkles
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const CommunicationSuite = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('broadcast');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    messageType: 'all',
    search: '',
    page: 1,
    limit: 20
  });

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/communication/messages', { params: filters });
      if (res.data.success) {
        setMessages(res.data.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load messages');
      }
    }
  }, [filters]);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/communication/templates');
      if (res.data.success) {
        setTemplates(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/communication/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/communication/analytics');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMessages(), fetchTemplates(), fetchStats(), fetchAnalytics()])
      .finally(() => setLoading(false));
    
    // Socket.IO listeners
    if (socket?.socket) {
      const handlers = {
        'communication:broadcast:sent': () => {
          toast.success('Broadcast sent successfully');
          fetchMessages();
          fetchStats();
        },
        'communication:reminder:created': () => {
          toast.success('Reminder created successfully');
          fetchMessages();
          fetchStats();
        },
        'communication:template:created': () => {
          toast.success('Template created successfully');
          fetchTemplates();
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
  }, [fetchMessages, fetchTemplates, fetchStats, fetchAnalytics, socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
      fetchStats();
      fetchAnalytics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSendBroadcast = async (formData) => {
    try {
      await api.post('/api/admin/communication/broadcast', formData);
      toast.success('Broadcast sent successfully');
      setShowBroadcastModal(false);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error(error.response?.data?.message || 'Failed to send broadcast');
    }
  };

  const handleCreateReminder = async (formData) => {
    try {
      await api.post('/api/admin/communication/reminder', formData);
      toast.success('Reminder created successfully');
      setShowReminderModal(false);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error(error.response?.data?.message || 'Failed to create reminder');
    }
  };

  const handleCreateTemplate = async (formData) => {
    try {
      await api.post('/api/admin/communication/templates', formData);
      toast.success('Template created successfully');
      setShowTemplateModal(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error(error.response?.data?.message || 'Failed to create template');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'from-blue-500 to-cyan-600', subtitle, trend }) => (
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
          <span className={`text-sm font-bold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  if (loading && !messages.length && !stats) {
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
                  <MessageSquare className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Communication Suite</h1>
                  <p className="text-lg text-white/90">Unified messaging, reminders, and delivery analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Broadcast
                </button>
                <button
                  onClick={() => setShowReminderModal(true)}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  Create Reminder
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
              title="Total Messages"
              value={stats.totalMessages || 0}
              icon={MessageSquare}
              color="from-blue-500 to-cyan-600"
              subtitle={`${stats.sentMessages || 0} sent`}
            />
            <StatCard
              title="Scheduled"
              value={stats.scheduledMessages || 0}
              icon={Calendar}
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              title="Templates"
              value={stats.totalTemplates || 0}
              icon={FileText}
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              title="Draft Messages"
              value={stats.draftMessages || 0}
              icon={Edit}
              color="from-gray-500 to-slate-600"
            />
          </div>
        )}

        {/* Analytics Summary */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-6"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-blue-600" />
              Delivery Analytics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Delivery Rate</p>
                <p className="text-2xl font-black text-blue-600">{analytics.deliveryRate || 0}%</p>
                <p className="text-xs text-gray-500">{analytics.delivered || 0} delivered</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Open Rate</p>
                <p className="text-2xl font-black text-green-600">{analytics.openRate || 0}%</p>
                <p className="text-xs text-gray-500">{analytics.opened || 0} opened</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Click Rate</p>
                <p className="text-2xl font-black text-purple-600">{analytics.clickRate || 0}%</p>
                <p className="text-xs text-gray-500">{analytics.clicked || 0} clicked</p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Failures</p>
                <p className="text-2xl font-black text-red-600">{analytics.failed || 0}</p>
                <p className="text-xs text-gray-500">{analytics.totalSent || 0} total sent</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-6">
          <div className="flex border-b-2 border-gray-200 overflow-x-auto">
            {['broadcast', 'reminders', 'templates', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-6 py-4 font-bold transition-all whitespace-nowrap ${
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

        {/* Tab Content */}
        {activeTab === 'broadcast' && (
          <BroadcastMessages
            messages={messages}
            filters={filters}
            setFilters={setFilters}
            templates={templates}
          />
        )}

        {activeTab === 'reminders' && (
          <Reminders messages={messages.filter(m => m.messageType === 'reminder')} />
        )}

        {activeTab === 'templates' && (
          <Templates
            templates={templates}
            onCreateTemplate={() => setShowTemplateModal(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard analytics={analytics} />
        )}

        {/* Modals */}
        {showBroadcastModal && (
          <BroadcastModal
            onClose={() => setShowBroadcastModal(false)}
            onSend={handleSendBroadcast}
            templates={templates}
          />
        )}

        {showReminderModal && (
          <ReminderModal
            onClose={() => setShowReminderModal(false)}
            onCreate={handleCreateReminder}
          />
        )}

        {showTemplateModal && (
          <TemplateModal
            onClose={() => setShowTemplateModal(false)}
            onCreate={handleCreateTemplate}
          />
        )}
      </div>
    </div>
  );
};

// Broadcast Messages Component
const BroadcastMessages = ({ messages, filters, setFilters, templates }) => (
  <div className="space-y-4">
    {/* Filters */}
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4">
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
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
          <select
            value={filters.messageType}
            onChange={(e) => setFilters({ ...filters, messageType: e.target.value, page: 1 })}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
          >
            <option value="all">All Types</option>
            <option value="broadcast">Broadcast</option>
            <option value="reminder">Reminder</option>
            <option value="notification">Notification</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Messages List */}
    <div className="space-y-3">
      {messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No messages found</p>
        </div>
      ) : (
        messages.map((message) => (
          <motion.div
            key={message._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 mb-1">{message.subject}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{message.message}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {message.stats?.totalRecipients || 0} recipients
                  </span>
                  <span className="flex items-center gap-1">
                    {message.channels?.map(channel => {
                      const icons = {
                        email: Mail,
                        sms: Smartphone,
                        push: Bell
                      };
                      const Icon = icons[channel] || MessageSquare;
                      return <Icon key={channel} className="w-4 h-4" />;
                    })}
                  </span>
                  {message.scheduledAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(message.scheduledAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                message.status === 'sent' ? 'bg-green-100 text-green-800' :
                message.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                message.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {message.status}
              </span>
            </div>
          </motion.div>
        ))
      )}
    </div>
  </div>
);

// Reminders Component
const Reminders = ({ messages }) => (
  <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
    <h2 className="text-2xl font-black text-gray-900 mb-4">Automated Reminders</h2>
    <div className="space-y-3">
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reminders configured</p>
      ) : (
        messages.map((message) => (
          <div key={message._id} className="p-4 rounded-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">{message.subject}</h3>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-bold">
                {message.reminderConfig?.reminderType || 'reminder'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{message.message}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Frequency: {message.reminderConfig?.frequency || 'once'}</span>
              <span>Sent: {message.reminderConfig?.reminderCount || 0}/{message.reminderConfig?.maxReminders || 0}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// Templates Component
const Templates = ({ templates, onCreateTemplate }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-black text-gray-900">Templates</h2>
      <button
        onClick={onCreateTemplate}
        className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        New Template
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.length === 0 ? (
        <div className="col-span-full bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold mb-4">No templates found</p>
          <button
            onClick={onCreateTemplate}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
          >
            Create First Template
          </button>
        </div>
      ) : (
        templates.map((template) => (
          <div key={template._id} className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <h3 className="text-lg font-black text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{template.description || 'No description'}</p>
            <div className="flex items-center gap-2 mb-3">
              {template.channels?.map(channel => {
                const icons = { email: Mail, sms: Smartphone, push: Bell };
                const Icon = icons[channel] || MessageSquare;
                return <Icon key={channel} className="w-4 h-4 text-gray-500" />;
              })}
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">
              {template.category}
            </span>
          </div>
        ))
      )}
    </div>
  </div>
);

// Analytics Dashboard Component
const AnalyticsDashboard = ({ analytics }) => (
  <div className="space-y-6">
    {analytics && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <h3 className="font-bold text-gray-700 mb-3">By Channel</h3>
            <div className="space-y-2">
              {analytics.byChannel?.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">{item._id}</span>
                  <span className="font-black text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <h3 className="font-bold text-gray-700 mb-3">By Status</h3>
            <div className="space-y-2">
              {analytics.byStatus?.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">{item._id}</span>
                  <span className="font-black text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <h3 className="font-bold text-gray-700 mb-3">Performance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Delivery</span>
                  <span className="font-bold">{analytics.deliveryRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analytics.deliveryRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Open</span>
                  <span className="font-bold">{analytics.openRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${analytics.openRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Click</span>
                  <span className="font-bold">{analytics.clickRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${analytics.clickRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);

// Broadcast Modal Component
const BroadcastModal = ({ onClose, onSend, templates }) => {
  const [form, setForm] = useState({
    subject: '',
    message: '',
    recipientType: 'all',
    channels: ['email'],
    priority: 'normal',
    scheduledAt: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Send Broadcast</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows="6"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Recipients</label>
              <select
                value={form.recipientType}
                onChange={(e) => setForm({ ...form, recipientType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="all">All Users</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="parents">Parents</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Channels</label>
            <div className="flex gap-4">
              {['email', 'sms', 'push'].map((channel) => (
                <label key={channel} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.channels.includes(channel)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, channels: [...form.channels, channel] });
                      } else {
                        setForm({ ...form, channels: form.channels.filter(c => c !== channel) });
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm font-semibold text-gray-700 capitalize">{channel}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule (optional)</label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
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
              Send Broadcast
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Reminder Modal Component
const ReminderModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    subject: '',
    message: '',
    reminderType: 'fee',
    recipientType: 'all',
    channels: ['email'],
    frequency: 'once',
    interval: 1,
    maxReminders: 3,
    scheduledAt: ''
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
          <h2 className="text-2xl font-black text-gray-900">Create Reminder</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reminder Type *</label>
            <select
              required
              value={form.reminderType}
              onChange={(e) => setForm({ ...form, reminderType: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            >
              <option value="fee">Fee Reminder</option>
              <option value="exam">Exam Notice</option>
              <option value="attendance">Attendance Alert</option>
              <option value="assignment">Assignment Due</option>
              <option value="event">Event Reminder</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows="6"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Reminders</label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.maxReminders}
                onChange={(e) => setForm({ ...form, maxReminders: parseInt(e.target.value) })}
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
              Create Reminder
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Template Modal Component
const TemplateModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'general',
    subject: '',
    body: '',
    channels: ['email']
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
          <h2 className="text-2xl font-black text-gray-900">Create Template</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            >
              <option value="general">General</option>
              <option value="fee_reminder">Fee Reminder</option>
              <option value="exam_notice">Exam Notice</option>
              <option value="attendance_alert">Attendance Alert</option>
              <option value="announcement">Announcement</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Body *</label>
            <textarea
              required
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows="8"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              placeholder="Use {{variable}} for placeholders"
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
              Create Template
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CommunicationSuite;

