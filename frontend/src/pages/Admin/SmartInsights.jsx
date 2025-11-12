import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Sparkles, AlertTriangle, CheckCircle, Lightbulb, RefreshCw,
  ArrowRight, Filter, Calendar, Zap, TrendingDown, TrendingUp,
  Bell, Eye, Target, MessageSquare, Send, AlertCircle,
  School, Users, Activity, FileText, Clock, Award, XCircle,
  Play, Settings, Download, Share2, Info
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const SmartInsights = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    timeRange: 'week'
  });

  // State for each section
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Alerts state
  const [alerts, setAlerts] = useState([]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      
      const res = await api.get('/api/admin/smart-insights', {
        params: {
          timeRange: filters.timeRange
        }
      });
      
      if (res.data.success && res.data.data) {
        setSummary(res.data.data.summary);
        setInsights(res.data.data.insights?.insights || []);
        setAnomalies(res.data.data.anomalies?.anomalies || []);
        setRecommendations(res.data.data.recommendations?.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching smart insights:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load smart insights');
      }
    } finally {
      setLoading(false);
    }
  }, [filters.timeRange]);

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 60 seconds (insights don't need to refresh as frequently)
    const interval = setInterval(fetchAllData, 60000);
    
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Socket.IO real-time updates and alerts
  useEffect(() => {
    if (socket?.socket) {
      const handleInsightsUpdate = (data) => {
        if (data.type === 'insights') {
          setInsights(data.data.insights || []);
        } else if (data.type === 'anomalies') {
          setAnomalies(data.data.anomalies || []);
        } else if (data.type === 'recommendations') {
          setRecommendations(data.data.recommendations || []);
        }
        fetchAllData();
      };

      const handleAnomalyAlert = (data) => {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'anomaly',
          severity: 'critical',
          message: data.message,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
        
        toast.error(data.message, {
          duration: 5000,
          icon: '⚠️'
        });
      };

      const handleSummaryUpdate = (data) => {
        setSummary(data);
      };

      socket.socket.on('smart:insights:update', handleInsightsUpdate);
      socket.socket.on('smart:anomaly:alert', handleAnomalyAlert);
      socket.socket.on('smart:insights:summary', handleSummaryUpdate);
      
      return () => {
        socket.socket.off('smart:insights:update', handleInsightsUpdate);
        socket.socket.off('smart:anomaly:alert', handleAnomalyAlert);
        socket.socket.off('smart:insights:summary', handleSummaryUpdate);
      };
    }
  }, [socket, fetchAllData]);

  const handleExecuteAction = async (recommendation) => {
    try {
      // This would call an API to execute the action
      // For now, we'll just show a toast
      toast.success(`Executing: ${recommendation.action}`, {
        duration: 3000
      });
      
      // Mark as executed
      setRecommendations(prev => prev.map(r => 
        r.id === recommendation.id 
          ? { ...r, executed: true, executedAt: new Date().toISOString() }
          : r
      ));
    } catch (error) {
      console.error('Error executing action:', error);
      toast.error('Failed to execute action');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'from-indigo-500 to-purple-600', subtitle }) => (
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

  const InsightCard = ({ insight, index }) => {
    const priorityColors = {
      critical: 'from-red-500 to-pink-600',
      high: 'from-orange-500 to-amber-600',
      medium: 'from-yellow-500 to-orange-600',
      low: 'from-blue-500 to-cyan-600'
    };

    const priorityIcons = {
      critical: AlertTriangle,
      high: AlertCircle,
      medium: Bell,
      low: Info
    };

    const IconComponent = priorityIcons[insight.priority] || Info;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
          insight.priority === 'critical' ? 'border-red-300 bg-red-50/30' :
          insight.priority === 'high' ? 'border-orange-300 bg-orange-50/30' :
          insight.priority === 'medium' ? 'border-yellow-300 bg-yellow-50/30' :
          'border-blue-300 bg-blue-50/30'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${priorityColors[insight.priority] || priorityColors.low}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-black text-gray-900">{insight.title}</h3>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${
                  insight.priority === 'critical' ? 'bg-red-600' :
                  insight.priority === 'high' ? 'bg-orange-600' :
                  insight.priority === 'medium' ? 'bg-yellow-600' :
                  'bg-blue-600'
                }`}>
                  {insight.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 font-medium mb-3">{insight.message}</p>
              
              {insight.details && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {Object.entries(insight.details).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm font-bold text-gray-900">
                        {typeof value === 'object' ? JSON.stringify(value).substring(0, 20) + '...' : value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {insight.recommendedActions && insight.recommendedActions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Recommended Actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.recommendedActions.map((action, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-medium">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
  ];

  if (loading && !summary && insights.length === 0 && anomalies.length === 0 && recommendations.length === 0) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <Brain className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Smart Insights & Recommendations</h1>
                  <p className="text-lg text-white/90">AI-powered insights to transform data into decisions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAllData}
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
        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-900">Critical Alerts</h3>
            </div>
            <div className="space-y-2">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center gap-2 text-sm text-red-800">
                  <AlertCircle className="w-4 h-4" />
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {tab.label}
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
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none font-medium"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && summary && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Insights"
                value={summary.totalInsights || 0}
                icon={Sparkles}
                color="from-purple-500 to-pink-600"
              />
              <StatCard
                title="Anomalies Detected"
                value={summary.totalAnomalies || 0}
                icon={AlertTriangle}
                color="from-red-500 to-orange-600"
                subtitle={`${summary.criticalItems || 0} critical`}
              />
              <StatCard
                title="Recommendations"
                value={summary.totalRecommendations || 0}
                icon={Lightbulb}
                color="from-yellow-500 to-amber-600"
                subtitle={`${summary.autoExecutableActions || 0} auto-executable`}
              />
              <StatCard
                title="Critical Items"
                value={summary.criticalItems || 0}
                icon={AlertCircle}
                color="from-red-500 to-pink-600"
                subtitle="Require immediate attention"
              />
            </div>

            {/* Recent Insights Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-purple-600" />
                Recent AI Insights
              </h2>
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight, idx) => (
                  <InsightCard key={insight.id || idx} insight={insight} index={idx} />
                ))}
                {insights.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No insights generated yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <InsightCard key={insight.id || idx} insight={insight} index={idx} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
              >
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-medium">No insights generated yet</p>
                <p className="text-sm text-gray-500 mt-2">Insights will appear as data is analyzed</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Anomalies Tab */}
        {activeTab === 'anomalies' && (
          <div className="space-y-6">
            {anomalies.length > 0 ? (
              anomalies.map((anomaly, idx) => (
                <motion.div
                  key={anomaly.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
                    anomaly.severity === 'critical' ? 'border-red-300 bg-red-50/30' :
                    anomaly.severity === 'high' ? 'border-orange-300 bg-orange-50/30' :
                    'border-yellow-300 bg-yellow-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${
                        anomaly.severity === 'critical' ? 'from-red-500 to-pink-600' :
                        anomaly.severity === 'high' ? 'from-orange-500 to-amber-600' :
                        'from-yellow-500 to-orange-600'
                      }`}>
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-black text-gray-900">{anomaly.title}</h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${
                            anomaly.severity === 'critical' ? 'bg-red-600' :
                            anomaly.severity === 'high' ? 'bg-orange-600' :
                            'bg-yellow-600'
                          }`}>
                            {anomaly.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium mb-3">{anomaly.description}</p>
                        
                        {anomaly.details && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {Object.entries(anomaly.details).map(([key, value]) => (
                              <div key={key} className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {typeof value === 'object' ? JSON.stringify(value).substring(0, 20) + '...' : value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {anomaly.recommendedActions && anomaly.recommendedActions.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Recommended Actions:</p>
                            <div className="flex flex-wrap gap-2">
                              {anomaly.recommendedActions.map((action, i) => (
                                <span key={i} className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-medium">
                                  {action}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
              >
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <p className="text-gray-600 font-medium">No anomalies detected</p>
                <p className="text-sm text-gray-500 mt-2">System is operating normally</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {recommendations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    title="Total Recommendations"
                    value={recommendations.length}
                    icon={Lightbulb}
                    color="from-yellow-500 to-amber-600"
                  />
                  <StatCard
                    title="Auto-Executable"
                    value={recommendations.filter(r => r.autoExecutable && !r.executed).length}
                    icon={Zap}
                    color="from-green-500 to-emerald-600"
                  />
                  <StatCard
                    title="Manual Actions"
                    value={recommendations.filter(r => !r.autoExecutable && !r.executed).length}
                    icon={Settings}
                    color="from-blue-500 to-cyan-600"
                  />
                  <StatCard
                    title="Executed"
                    value={recommendations.filter(r => r.executed).length}
                    icon={CheckCircle}
                    color="from-purple-500 to-pink-600"
                  />
                </div>

                <div className="space-y-4">
                  {recommendations.map((recommendation, idx) => (
                    <motion.div
                      key={recommendation.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
                        recommendation.executed ? 'border-green-300 bg-green-50/30 opacity-75' :
                        recommendation.priority === 'critical' ? 'border-red-300 bg-red-50/30' :
                        recommendation.priority === 'high' ? 'border-orange-300 bg-orange-50/30' :
                        'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${
                            recommendation.executed ? 'from-green-500 to-emerald-600' :
                            recommendation.priority === 'critical' ? 'from-red-500 to-pink-600' :
                            recommendation.priority === 'high' ? 'from-orange-500 to-amber-600' :
                            'from-blue-500 to-cyan-600'
                          }`}>
                            <Lightbulb className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-lg font-bold text-gray-900">{recommendation.action}</p>
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${
                                recommendation.priority === 'critical' ? 'bg-red-600' :
                                recommendation.priority === 'high' ? 'bg-orange-600' :
                                recommendation.priority === 'medium' ? 'bg-yellow-600' :
                                'bg-blue-600'
                              }`}>
                                {recommendation.priority.toUpperCase()}
                              </span>
                              {recommendation.autoExecutable && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold">
                                  AUTO
                                </span>
                              )}
                              {recommendation.executed && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  EXECUTED
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Category: <span className="font-semibold capitalize">{recommendation.category}</span></p>
                            {recommendation.insightId && (
                              <p className="text-xs text-gray-500">Related to insight: {recommendation.insightId}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {recommendation.autoExecutable && !recommendation.executed && (
                            <button
                              onClick={() => handleExecuteAction(recommendation)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Execute
                            </button>
                          )}
                          <button
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
              >
                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-medium">No recommendations available</p>
                <p className="text-sm text-gray-500 mt-2">Recommendations will be generated based on insights and anomalies</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartInsights;

