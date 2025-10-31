import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Clock, XCircle, Shield, Activity,
  TrendingUp, Eye, User, Calendar, Flag, Plus, Filter, Search,
  ExternalLink, Send, Check, X, Bell, Zap, Flame
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const IncidentManagement = () => {
  const { ticketNumber } = useParams();
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [expandedIncident, setExpandedIncident] = useState(null);

  const fetchIncidents = useCallback(async () => {
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterSeverity !== 'all') params.severity = filterSeverity;

      const response = await api.get('/api/incidents', { params });
      setIncidents(response.data.data);

      // Auto-expand if viewing specific ticket
      if (ticketNumber) {
        const incident = response.data.data.find(i => i.ticketNumber === ticketNumber);
        if (incident) setExpandedIncident(incident._id);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterSeverity, ticketNumber]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/incidents/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResolveIncident = async (incidentId) => {
    const notes = prompt('Enter resolution notes:');
    if (!notes) return;

    try {
      await api.put(`/api/incidents/${incidentId}/resolve`, { resolutionNotes: notes });
      toast.success('Incident resolved successfully');
      fetchIncidents();
      fetchStats();
    } catch (error) {
      console.error('Error resolving incident:', error);
      toast.error('Failed to resolve incident');
    }
  };

  const handleAssignIncident = async (incidentId, userId) => {
    try {
      await api.put(`/api/incidents/${incidentId}/assign`, { assignedTo: userId });
      toast.success('Incident assigned successfully');
      fetchIncidents();
    } catch (error) {
      console.error('Error assigning incident:', error);
      toast.error('Failed to assign incident');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'investigating': return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'resolved': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'closed': return <XCircle className="w-6 h-6 text-gray-600" />;
      default: return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-pink-500';
      case 'high': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 text-white py-16 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                <Activity className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-2">Incident Management</h1>
                <p className="text-lg text-white/90">Monitor and respond to platform incidents in real-time</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-6 h-6" />
              Create Incident
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600 font-semibold">Total</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-red-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-red-600">{stats.open}</div>
                  <div className="text-sm text-gray-600 font-semibold">Open</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-yellow-600">{stats.investigating}</div>
                  <div className="text-sm text-gray-600 font-semibold">Investigating</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-green-600">{stats.resolved}</div>
                  <div className="text-sm text-gray-600 font-semibold">Resolved</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Flag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-purple-600">{stats.critical}</div>
                  <div className="text-sm text-gray-600 font-semibold">Critical</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Filter className="w-6 h-6 text-red-600" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </motion.div>

        {/* Incidents List */}
        <div className="space-y-4">
          {incidents.map((incident, idx) => {
            const isExpanded = expandedIncident === incident._id;

            return (
              <motion.div
                key={incident._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all border-l-4 bg-gradient-to-r ${
                  isExpanded 
                    ? `border-l-indigo-500 from-indigo-50 to-white` 
                    : `border-l-${getSeverityColor(incident.severity).split(' ')[1]}`
                }`}
                onClick={() => setExpandedIncident(isExpanded ? null : incident._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(incident.status)}
                      <h3 className="text-xl font-black text-gray-900">{incident.title}</h3>
                      <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border-2 ${getSeverityBg(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className="px-4 py-1.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 border-2 border-gray-200">
                        #{incident.ticketNumber}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 text-base leading-relaxed">{incident.description}</p>

                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">{new Date(incident.createdAt).toLocaleString()}</span>
                      </span>
                      {incident.assignedTo && (
                        <span className="flex items-center gap-2">
                          <User className="w-5 h-5 text-indigo-600" />
                          <span className="font-semibold text-gray-700">{incident.assignedTo.name}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {incident.incidentType === 'sla_breach' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/admin/incidents/${incident.ticketNumber}`, '_blank');
                        }}
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
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
                      {/* SLA Metrics */}
                      {incident.slaMetrics && (
                        <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                          <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-600" />
                            SLA Breach Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Latency</span>
                              <div className="text-2xl font-black text-gray-900">
                                {incident.slaMetrics.latency}ms
                              </div>
                              <span className="text-xs text-gray-500">Threshold: {incident.slaMetrics.thresholdLatency}ms</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Error Rate</span>
                              <div className="text-2xl font-black text-gray-900">
                                {incident.slaMetrics.errorRate}%
                              </div>
                              <span className="text-xs text-gray-500">Threshold: {incident.slaMetrics.thresholdErrorRate}%</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Breach Duration</span>
                              <div className="text-2xl font-black text-gray-900">
                                {incident.slaMetrics.breachDuration}s
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Endpoint</span>
                              <div className="text-lg font-bold text-gray-900 truncate">
                                {incident.slaMetrics.apiEndpoint || 'Global'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Privacy Details */}
                      {incident.privacyDetails && (
                        <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200">
                          <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-600" />
                            Privacy Incident Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Affected Users</span>
                              <div className="text-2xl font-black text-red-600">
                                {incident.privacyDetails.affectedUsers || 'Unknown'}
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Data Types</span>
                              <div className="text-lg font-bold text-gray-900">
                                {incident.privacyDetails.dataTypes.join(', ') || 'Unknown'}
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Exposure</span>
                              <div className="text-lg font-bold text-gray-900">
                                {incident.privacyDetails.potentialExposure || 'Unknown'}
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                              <span className="text-sm font-semibold text-gray-600">Containment</span>
                              <div className="text-lg font-bold text-red-600">
                                {incident.privacyDetails.containmentStatus?.replace('_', ' ').toUpperCase() || 'Unknown'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Resolution Notes */}
                      {incident.resolutionNotes && (
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                          <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            Resolution Notes
                          </h4>
                          <p className="text-gray-700 leading-relaxed">{incident.resolutionNotes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {incident.status !== 'resolved' && incident.status !== 'closed' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResolveIncident(incident._id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                            >
                              <Check className="w-5 h-5" />
                              Resolve Incident
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedIncident(null);
                                setExpandedIncident(incident._id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                            >
                              <User className="w-5 h-5" />
                              Assign
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

          {incidents.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-20 text-center border-2 border-gray-100">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">No Incidents Found</h3>
              <p className="text-gray-600 text-lg">All systems operational</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Incident Modal */}
      {showCreateModal && (
        <CreateIncidentModal onClose={() => setShowCreateModal(false)} onSuccess={fetchIncidents} />
      )}
    </div>
  );
};

// Create Incident Modal Component
const CreateIncidentModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    incidentType: 'other',
    severity: 'medium',
    title: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/incidents', formData);
      toast.success('Incident created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Failed to create incident');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full border-4 border-red-300 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Flame className="w-8 h-8 text-red-600" />
            Create Incident
          </h3>
          <button onClick={onClose} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Incident Type</label>
            <select
              required
              value={formData.incidentType}
              onChange={(e) => setFormData({...formData, incidentType: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all font-semibold"
            >
              <option value="sla_breach">SLA Breach</option>
              <option value="privacy_incident">Privacy Incident</option>
              <option value="security_breach">Security Breach</option>
              <option value="data_breach">Data Breach</option>
              <option value="performance_issue">Performance Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Severity</label>
            <select
              required
              value={formData.severity}
              onChange={(e) => setFormData({...formData, severity: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all font-semibold"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all"
              placeholder="Brief incident description"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all"
              placeholder="Detailed incident description"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
            >
              <Plus className="w-5 h-5" />
              Create Incident
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

export default IncidentManagement;
