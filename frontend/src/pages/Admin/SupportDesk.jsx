import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Headphones, AlertTriangle, CheckCircle, Clock, RefreshCw,
  Filter, Search, ArrowRight, Zap, Brain, Target, TrendingUp,
  Users, MessageSquare, FileText, Settings, Eye, Play, XCircle,
  AlertCircle, Calendar, Tag, Building, User, Mail, Phone,
  ArrowLeft, Send, Lightbulb, Timer, Activity, BarChart3,
  Ticket, ArrowUpCircle, ArrowDownCircle, Star
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const SupportDesk = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    department: 'all',
    sourceDashboard: 'all',
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'priority',
    sortOrder: 'desc'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    sourceDashboard: 'student',
    category: '',
    severity: 'medium'
  });
  const [alerts, setAlerts] = useState([]);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/support-desk', { params: filters });
      if (res.data.success) {
        setTickets(res.data.data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load tickets');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/support-desk/stats', {
        params: { timeRange: 'month' }
      });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTickets();
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchTickets, fetchStats]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (socket?.socket) {
      const handleTicketsUpdate = (data) => {
        setTickets(data.tickets || []);
        fetchTickets();
      };

      const handleTicketNew = (ticket) => {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'new',
          ticket,
          message: `New ticket: ${ticket.ticketNumber}`,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
        
        toast.success(`New ticket: ${ticket.ticketNumber}`, {
          duration: 4000,
          icon: '🎫'
        });
        fetchTickets();
      };

      const handleTicketAlert = (data) => {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'alert',
          severity: data.severity,
          message: data.message,
          ticket: data.ticket,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
        
        toast.error(data.message, {
          duration: 6000,
          icon: '⚠️'
        });
        fetchTickets();
      };

      const handleTicketUpdated = (ticket) => {
        if (selectedTicket && selectedTicket._id === ticket._id) {
          setSelectedTicket(ticket);
        }
        fetchTickets();
      };

      socket.socket.on('support:tickets:update', handleTicketsUpdate);
      socket.socket.on('support:ticket:new', handleTicketNew);
      socket.socket.on('support:ticket:alert', handleTicketAlert);
      socket.socket.on('support:ticket:updated', handleTicketUpdated);
      
      return () => {
        socket.socket.off('support:tickets:update', handleTicketsUpdate);
        socket.socket.off('support:ticket:new', handleTicketNew);
        socket.socket.off('support:ticket:alert', handleTicketAlert);
        socket.socket.off('support:ticket:updated', handleTicketUpdated);
      };
    }
  }, [socket, selectedTicket, fetchTickets]);

  const handleTicketClick = async (ticketId) => {
    try {
      const res = await api.get(`/api/admin/support-desk/${ticketId}`);
      if (res.data.success) {
        setSelectedTicket(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      toast.error('Failed to load ticket details');
    }
  };

  const handleUpdateTicket = async (ticketId, updateData) => {
    try {
      const res = await api.put(`/api/admin/support-desk/${ticketId}`, updateData);
      if (res.data.success) {
        toast.success('Ticket updated successfully!');
        fetchTickets();
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(res.data.data);
        }
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to update ticket');
    }
  };

  const handleRouteTicket = async (ticketId) => {
    try {
      const res = await api.post(`/api/admin/support-desk/${ticketId}/route`);
      if (res.data.success) {
        toast.success(`Ticket routed to ${res.data.data.department} department`);
        fetchTickets();
      }
    } catch (error) {
      console.error('Error routing ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to route ticket');
    }
  };

  const handleCreateTicket = async () => {
    try {
      const res = await api.post('/api/admin/support-desk', {
        ...newTicket,
        organizationId: null
      });
      if (res.data.success) {
        toast.success('Ticket created successfully!');
        setShowCreateModal(false);
        setNewTicket({
          subject: '',
          description: '',
          sourceDashboard: 'student',
          category: '',
          severity: 'medium'
        });
        fetchTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-red-800';
      case 'high': return 'from-orange-600 to-orange-800';
      case 'medium': return 'from-yellow-600 to-yellow-800';
      case 'low': return 'from-blue-600 to-blue-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getSLAStatusColor = (status) => {
    switch (status) {
      case 'breached': return 'text-red-600 bg-red-100 border-red-300';
      case 'at_risk': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'on_time': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'waiting_for_customer': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    } else if (hours < 24) {
      return `${Math.round(hours)}h`;
    } else {
      return `${Math.round(hours / 24)}d`;
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

  if (loading && !tickets.length && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <Headphones className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">AI-Powered Support Desk</h1>
                  <p className="text-lg text-white/90">Unified ticketing & escalation management</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchTickets}
                  disabled={loading}
                  className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Ticket className="w-5 h-5" />
                  New Ticket
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
        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-bold text-orange-900">Active Alerts</h3>
              </div>
              <button
                onClick={() => setAlerts([])}
                className="text-orange-600 hover:text-orange-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center gap-2 text-sm text-orange-800">
                  <AlertCircle className="w-4 h-4" />
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Tickets"
              value={stats.total || 0}
              icon={Ticket}
              color="from-blue-500 to-cyan-600"
              subtitle={`${stats.open || 0} open`}
            />
            <StatCard
              title="Open Tickets"
              value={stats.open || 0}
              icon={AlertCircle}
              color="from-orange-500 to-amber-600"
            />
            <StatCard
              title="Resolution Rate"
              value={`${stats.resolutionRate || 0}%`}
              icon={Target}
              color="from-green-500 to-emerald-600"
              subtitle={`${stats.resolved || 0} resolved`}
            />
            <StatCard
              title="Avg Resolution"
              value={formatTime(stats.avgResolutionTimeHours || 0)}
              icon={Clock}
              color="from-purple-500 to-pink-600"
              subtitle={`${stats.slaBreaches || 0} SLA breaches`}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_for_customer">Waiting</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value, page: 1 })}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium"
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value, page: 1 })}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium"
                >
                  <option value="all">All Departments</option>
                  <option value="billing">Billing</option>
                  <option value="security">Security</option>
                  <option value="technical">Technical</option>
                  <option value="product">Product</option>
                  <option value="support">Support</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </motion.div>

            {/* Tickets */}
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
                >
                  <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">No tickets found</p>
                </motion.div>
              ) : (
                tickets.map((ticket) => (
                  <motion.div
                    key={ticket._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleTicketClick(ticket._id)}
                    className={`bg-white rounded-xl shadow-lg border-2 p-5 cursor-pointer hover:shadow-xl transition-all ${
                      selectedTicket?._id === ticket._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-gray-900">{ticket.ticketNumber || ticket.ticketId}</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getSeverityColor(ticket.severity)} text-white`}>
                            {ticket.severity?.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(ticket.status)}`}>
                            {ticket.status?.replace('_', ' ').toUpperCase()}
                          </span>
                          {ticket.priorityScore && (
                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800">
                              Score: {ticket.priorityScore}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{ticket.subject || ticket.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {ticket.description || ticket.message || 'No description provided'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {ticket.sourceDashboard?.replace('_', ' ')}
                          </span>
                          {ticket.assignedToDepartment && (
                            <span className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              {ticket.assignedToDepartment}
                            </span>
                          )}
                          {ticket.sla && (
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getSLAStatusColor(ticket.sla.status)}`}>
                              <Timer className="w-4 h-4" />
                              {ticket.sla.remainingHours >= 0 
                                ? `${formatTime(ticket.sla.remainingHours)} left`
                                : `${formatTime(-ticket.sla.remainingHours)} over`
                              }
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {!ticket.assignedToDepartment && ticket.canAutoRoute && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRouteTicket(ticket._id);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                        >
                          <Zap className="w-4 h-4" />
                          Auto-Route
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Ticket Details Sidebar */}
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 sticky top-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Ticket Details</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Ticket Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Ticket Number</p>
                  <p className="text-lg font-bold text-gray-900">{selectedTicket.ticketNumber || selectedTicket.ticketId}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Subject</p>
                  <p className="text-base text-gray-900">{selectedTicket.subject || selectedTicket.title}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Description</p>
                  <p className="text-base text-gray-700 whitespace-pre-wrap">{selectedTicket.description || selectedTicket.message || 'No description'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Severity</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold bg-gradient-to-r ${getSeverityColor(selectedTicket.severity)} text-white`}>
                      {selectedTicket.severity?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                {selectedTicket.sla && (
                  <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Timer className="w-4 h-4" />
                      SLA Status: <span className={getSLAStatusColor(selectedTicket.sla.status).split(' ')[0]}>
                        {selectedTicket.sla.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>Elapsed: {formatTime(selectedTicket.sla.elapsedHours)}</span>
                      <span>Target: {formatTime(selectedTicket.sla.targetHours)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          selectedTicket.sla.status === 'breached' ? 'bg-red-600' :
                          selectedTicket.sla.status === 'at_risk' ? 'bg-orange-600' :
                          selectedTicket.sla.status === 'warning' ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(selectedTicket.sla.progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Breach Time: {new Date(selectedTicket.sla.breachTime).toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedTicket.routing && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Department</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg text-sm font-bold bg-blue-100 text-blue-800">
                        {selectedTicket.routing.department}
                      </span>
                      {selectedTicket.routing.confidence && (
                        <span className="text-xs text-gray-500">
                          Confidence: {Math.round(selectedTicket.routing.confidence * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Suggestions */}
              {selectedTicket.suggestions && selectedTicket.suggestions.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">AI Resolution Suggestions</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedTicket.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-purple-50 border-2 border-purple-200">
                        <p className="text-sm text-gray-700 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          {suggestion.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateTicket(selectedTicket._id, { status: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_for_customer">Waiting for Customer</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={selectedTicket.severity}
                  onChange={(e) => handleUpdateTicket(selectedTicket._id, { severity: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                {!selectedTicket.assignedToDepartment && (
                  <button
                    onClick={() => handleRouteTicket(selectedTicket._id)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Auto-Route Ticket
                  </button>
                )}
                <button
                  onClick={() => {
                    handleUpdateTicket(selectedTicket._id, {
                      status: 'resolved',
                      resolutionNotes: 'Resolved by admin'
                    });
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Resolved
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Create New Ticket</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter ticket subject"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="Describe the issue..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Source Dashboard</label>
                  <select
                    value={newTicket.sourceDashboard}
                    onChange={(e) => setNewTicket({ ...newTicket, sourceDashboard: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="school_admin">School Admin</option>
                    <option value="csr">CSR</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
                  <select
                    value={newTicket.severity}
                    onChange={(e) => setNewTicket({ ...newTicket, severity: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateTicket}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Create Ticket
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
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
  );
};

export default SupportDesk;

