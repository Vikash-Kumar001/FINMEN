import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle,
  RefreshCw, Search, Filter, BarChart3, Target, Users, Building, Calendar,
  Award, Activity, Shield, Zap, ArrowRight, Eye, Download, Plus,
  GraduationCap, BookOpen, Clock, DollarSign, UserCheck, AlertCircle,
  Lightbulb, FileText, TrendingUp as TrendUp
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const PredictiveModels = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [filters, setFilters] = useState({
    predictionType: 'all',
    targetType: 'all',
    search: '',
    page: 1,
    limit: 20
  });

  const fetchPredictions = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/predictive', { params: filters });
      if (res.data.success) {
        setPredictions(res.data.data.predictions || []);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load predictions');
      }
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/predictive/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPredictions(), fetchStats()])
      .finally(() => setLoading(false));
    
    // Socket.IO listeners
    if (socket?.socket) {
      const handlers = {
        'prediction:school:risk:generated': (data) => {
          toast.success('School risk prediction generated');
          fetchPredictions();
          fetchStats();
        },
        'prediction:renewal:generated': (data) => {
          toast.success('Renewal prediction generated');
          fetchPredictions();
          fetchStats();
        },
        'prediction:cheating:detected': (data) => {
          toast.warning('Cheating detection completed');
          fetchPredictions();
          fetchStats();
        },
        'prediction:training:identified': (data) => {
          toast.success('Training needs identified');
          fetchPredictions();
          fetchStats();
        },
        'prediction:workload:forecasted': (data) => {
          toast.success('Workload forecast generated');
          fetchPredictions();
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
  }, [fetchPredictions, fetchStats, socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPredictions();
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleGeneratePrediction = async (type, targetId) => {
    try {
      let endpoint = '';
      if (type === 'school_performance') {
        endpoint = `/api/admin/predictive/school/${targetId}/risk`;
      } else if (type === 'subscription_renewal') {
        endpoint = `/api/admin/predictive/organization/${targetId}/renewal`;
      } else if (type === 'training_need') {
        endpoint = `/api/admin/predictive/teacher/${targetId}/training`;
      } else if (type === 'workload_forecast') {
        endpoint = `/api/admin/predictive/workload/forecast${targetId ? `/${targetId}` : ''}`;
      }
      
      if (endpoint) {
        await api.post(endpoint);
        toast.success('Prediction generated successfully');
        fetchPredictions();
        fetchStats();
      }
    } catch (error) {
      console.error('Error generating prediction:', error);
      toast.error(error.response?.data?.message || 'Failed to generate prediction');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'from-red-500 to-pink-600';
    if (score >= 40) return 'from-orange-500 to-amber-600';
    return 'from-green-500 to-emerald-600';
  };

  const getResultLabel = (result) => {
    const labels = {
      high_risk: 'High Risk',
      medium_risk: 'Medium Risk',
      low_risk: 'Low Risk',
      likely_to_renew: 'Likely to Renew',
      moderate_renewal: 'Moderate Renewal',
      unlikely_to_renew: 'Unlikely to Renew',
      suspicious: 'Suspicious',
      moderate_suspicion: 'Moderate Suspicion',
      normal: 'Normal',
      high_need: 'High Need',
      moderate_need: 'Moderate Need',
      low_need: 'Low Need',
      high: 'High Workload',
      normal_workload: 'Normal Workload',
      low: 'Low Workload'
    };
    return labels[result] || result;
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

  if (loading && !predictions.length && !stats) {
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
                  <Brain className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Predictive Performance Models</h1>
                  <p className="text-lg text-white/90">AI-powered predictions for smarter decision making</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchPredictions}
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
              title="Total Predictions"
              value={stats.total || 0}
              icon={Brain}
              color="from-gray-500 to-slate-600"
            />
            <StatCard
              title="High Risk Schools"
              value={stats.highRiskSchools || 0}
              icon={AlertTriangle}
              color="from-red-500 to-pink-600"
            />
            <StatCard
              title="Suspicious Exams"
              value={stats.suspiciousExams || 0}
              icon={Shield}
              color="from-orange-500 to-amber-600"
            />
            <StatCard
              title="Training Needed"
              value={stats.teachersNeedingTraining || 0}
              icon={GraduationCap}
              color="from-blue-500 to-cyan-600"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-6">
          <div className="flex border-b-2 border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'school_risk', label: 'School Risk', icon: Building },
              { id: 'renewal', label: 'Renewal', icon: DollarSign },
              { id: 'cheating', label: 'Cheating Detection', icon: Shield },
              { id: 'training', label: 'Training Needs', icon: GraduationCap },
              { id: 'workload', label: 'Workload Forecast', icon: Calendar }
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
        {activeTab === 'overview' && (
          <PredictionsOverview
            predictions={predictions}
            stats={stats}
            onViewDetails={setSelectedPrediction}
            filters={filters}
            setFilters={setFilters}
          />
        )}

        {activeTab === 'school_risk' && (
          <SchoolRiskTab
            predictions={predictions.filter(p => p.predictionType === 'school_performance')}
            onGenerate={(orgId) => handleGeneratePrediction('school_performance', orgId)}
          />
        )}

        {activeTab === 'renewal' && (
          <RenewalTab
            predictions={predictions.filter(p => p.predictionType === 'subscription_renewal')}
            onGenerate={(orgId) => handleGeneratePrediction('subscription_renewal', orgId)}
          />
        )}

        {activeTab === 'cheating' && (
          <CheatingTab
            predictions={predictions.filter(p => p.predictionType === 'cheating_detection')}
          />
        )}

        {activeTab === 'training' && (
          <TrainingTab
            predictions={predictions.filter(p => p.predictionType === 'training_need')}
            onGenerate={(teacherId) => handleGeneratePrediction('training_need', teacherId)}
          />
        )}

        {activeTab === 'workload' && (
          <WorkloadTab
            predictions={predictions.filter(p => p.predictionType === 'workload_forecast')}
            onGenerate={(orgId) => handleGeneratePrediction('workload_forecast', orgId)}
          />
        )}

        {/* Prediction Details Modal */}
        {selectedPrediction && (
          <PredictionDetailsModal
            prediction={selectedPrediction}
            onClose={() => setSelectedPrediction(null)}
          />
        )}
      </div>
    </div>
  );
};

// Predictions Overview Component
const PredictionsOverview = ({ predictions, stats, onViewDetails, filters, setFilters }) => (
  <div className="space-y-4">
    {/* Filters */}
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Prediction Type</label>
          <select
            value={filters.predictionType}
            onChange={(e) => setFilters({ ...filters, predictionType: e.target.value, page: 1 })}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none font-medium"
          >
            <option value="all">All Types</option>
            <option value="school_performance">School Performance</option>
            <option value="subscription_renewal">Subscription Renewal</option>
            <option value="cheating_detection">Cheating Detection</option>
            <option value="training_need">Training Needs</option>
            <option value="workload_forecast">Workload Forecast</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search predictions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Predictions List */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {predictions.length === 0 ? (
        <div className="col-span-full bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No predictions found</p>
        </div>
      ) : (
        predictions.map((prediction) => (
          <PredictionCard
            key={prediction._id}
            prediction={prediction}
            onClick={() => onViewDetails(prediction)}
          />
        ))
      )}
    </div>
  </div>
);

// Prediction Card Component
const PredictionCard = ({ prediction, onClick }) => {
  const getScoreColor = (score) => {
    if (score >= 70) return 'from-red-500 to-pink-600';
    if (score >= 40) return 'from-orange-500 to-amber-600';
    return 'from-green-500 to-emerald-600';
  };

  const getTypeIcon = (type) => {
    const icons = {
      school_performance: Building,
      subscription_renewal: DollarSign,
      cheating_detection: Shield,
      training_need: GraduationCap,
      workload_forecast: Calendar
    };
    return icons[type] || Brain;
  };

  const Icon = getTypeIcon(prediction.predictionType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 cursor-pointer hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${getScoreColor(prediction.prediction.score)}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 capitalize">
              {prediction.predictionType.replace(/_/g, ' ')}
            </h3>
            <p className="text-sm text-gray-600">
              {prediction.targetType} - {new Date(prediction.predictedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
          prediction.prediction.score >= 70 ? 'bg-red-100 text-red-800' :
          prediction.prediction.score >= 40 ? 'bg-orange-100 text-orange-800' :
          'bg-green-100 text-green-800'
        }`}>
          {prediction.prediction.score}
        </span>
      </div>
      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-700 mb-1">Prediction</p>
        <p className="text-base font-bold text-gray-900 capitalize">
          {prediction.prediction.result.replace(/_/g, ' ')}
        </p>
      </div>
      {prediction.recommendations?.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Lightbulb className="w-4 h-4" />
          {prediction.recommendations.length} recommendation(s)
        </div>
      )}
    </motion.div>
  );
};

// School Risk Tab
const SchoolRiskTab = ({ predictions, onGenerate }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-gray-900">School Performance Risk</h2>
        <button
          onClick={() => {
            const orgId = prompt('Enter Organization ID:');
            if (orgId) onGenerate(orgId);
          }}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Generate Prediction
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No school risk predictions found
          </div>
        ) : (
          predictions.map((prediction) => (
            <SchoolRiskCard key={prediction._id} prediction={prediction} />
          ))
        )}
      </div>
    </div>
  </div>
);

const SchoolRiskCard = ({ prediction }) => (
  <div className="p-5 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-red-50 to-pink-50">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-black text-gray-900">School Risk Analysis</h3>
      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
        prediction.prediction.score >= 70 ? 'bg-red-600 text-white' :
        prediction.prediction.score >= 40 ? 'bg-orange-600 text-white' :
        'bg-green-600 text-white'
      }`}>
        Score: {prediction.prediction.score}
      </span>
    </div>
    <p className="text-sm font-bold text-gray-700 mb-3 capitalize">
      {prediction.prediction.result.replace(/_/g, ' ')}
    </p>
    {prediction.factors?.length > 0 && (
      <div className="space-y-1 mb-3">
        {prediction.factors.slice(0, 3).map((factor, idx) => (
          <div key={idx} className="text-xs text-gray-600">
            • {factor.factor}: {factor.value}
          </div>
        ))}
      </div>
    )}
    {prediction.recommendations?.length > 0 && (
      <div className="mt-3 pt-3 border-t-2 border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-1">Recommendations:</p>
        <p className="text-xs text-gray-600">{prediction.recommendations[0].description}</p>
      </div>
    )}
  </div>
);

// Renewal Tab
const RenewalTab = ({ predictions, onGenerate }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-gray-900">Subscription Renewal Predictions</h2>
        <button
          onClick={() => {
            const orgId = prompt('Enter Organization ID:');
            if (orgId) onGenerate(orgId);
          }}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Generate Prediction
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((prediction) => (
          <RenewalCard key={prediction._id} prediction={prediction} />
        ))}
      </div>
    </div>
  </div>
);

const RenewalCard = ({ prediction }) => (
  <div className="p-5 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-black text-gray-900">Renewal Probability</h3>
      <span className="text-2xl font-black text-green-600">
        {Math.round((prediction.prediction.probability || prediction.prediction.score / 100) * 100)}%
      </span>
    </div>
    <p className="text-sm font-bold text-gray-700 mb-3 capitalize">
      {prediction.prediction.result.replace(/_/g, ' ')}
    </p>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
      <div
        className="bg-green-600 h-2 rounded-full"
        style={{ width: `${(prediction.prediction.probability || prediction.prediction.score / 100) * 100}%` }}
      />
    </div>
  </div>
);

// Cheating Tab
const CheatingTab = ({ predictions }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
      <h2 className="text-2xl font-black text-gray-900 mb-4">Cheating Detection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((prediction) => (
          <CheatingCard key={prediction._id} prediction={prediction} />
        ))}
      </div>
    </div>
  </div>
);

const CheatingCard = ({ prediction }) => (
  <div className={`p-5 rounded-xl border-2 ${
    prediction.prediction.score >= 50 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
  }`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-black text-gray-900">Suspicion Analysis</h3>
      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
        prediction.prediction.score >= 50 ? 'bg-red-600 text-white' :
        'bg-gray-600 text-white'
      }`}>
        {prediction.prediction.score}
      </span>
    </div>
    <p className="text-sm font-bold text-gray-700 capitalize mb-3">
      {prediction.prediction.result.replace(/_/g, ' ')}
    </p>
    {prediction.factors?.map((factor, idx) => (
      <div key={idx} className="text-xs text-gray-600 mb-1">
        • {factor.factor}: {factor.value}
      </div>
    ))}
  </div>
);

// Training Tab
const TrainingTab = ({ predictions, onGenerate }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-gray-900">Teacher Training Needs</h2>
        <button
          onClick={() => {
            const teacherId = prompt('Enter Teacher ID:');
            if (teacherId) onGenerate(teacherId);
          }}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Analyze Teacher
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((prediction) => (
          <TrainingCard key={prediction._id} prediction={prediction} />
        ))}
      </div>
    </div>
  </div>
);

const TrainingCard = ({ prediction }) => (
  <div className="p-5 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-black text-gray-900">Training Assessment</h3>
      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
        prediction.prediction.score >= 50 ? 'bg-orange-600 text-white' :
        'bg-blue-600 text-white'
      }`}>
        {prediction.prediction.score}
      </span>
    </div>
    <p className="text-sm font-bold text-gray-700 capitalize mb-3">
      {prediction.prediction.result.replace(/_/g, ' ')}
    </p>
    {prediction.recommendations?.map((rec, idx) => (
      <div key={idx} className="text-xs text-gray-600 mb-2">
        <strong>{rec.action}:</strong> {rec.description}
      </div>
    ))}
  </div>
);

// Workload Tab
const WorkloadTab = ({ predictions, onGenerate }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-gray-900">Workload Forecast</h2>
        <button
          onClick={() => {
            const orgId = prompt('Enter Organization ID (leave empty for system-wide):') || null;
            onGenerate(orgId);
          }}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Generate Forecast
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((prediction) => (
          <WorkloadCard key={prediction._id} prediction={prediction} />
        ))}
      </div>
    </div>
  </div>
);

const WorkloadCard = ({ prediction }) => (
  <div className="p-5 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-black text-gray-900">Workload Forecast</h3>
      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white">
        {prediction.prediction.result}
      </span>
    </div>
    {prediction.metrics && (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Predicted Messages:</span>
          <span className="font-bold">{Math.round(prediction.metrics.predictedMessages || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Predicted Tickets:</span>
          <span className="font-bold">{Math.round(prediction.metrics.predictedTickets || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Workload:</span>
          <span className="font-bold">{Math.round(prediction.metrics.totalWorkload || 0)}</span>
        </div>
      </div>
    )}
  </div>
);

// Prediction Details Modal
const PredictionDetailsModal = ({ prediction, onClose }) => {
  const getScoreColor = (score) => {
    if (score >= 70) return 'from-red-500 to-pink-600';
    if (score >= 40) return 'from-orange-500 to-amber-600';
    return 'from-green-500 to-emerald-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Prediction Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Prediction Result */}
          <div className={`p-6 rounded-xl bg-gradient-to-br ${getScoreColor(prediction.prediction.score)} text-white`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black">Prediction Result</h3>
              <span className="text-3xl font-black">{prediction.prediction.score}</span>
            </div>
            <p className="text-lg font-bold capitalize">
              {prediction.prediction.result.replace(/_/g, ' ')}
            </p>
            {prediction.prediction.confidence && (
              <p className="text-sm mt-2">Confidence: {prediction.prediction.confidence}%</p>
            )}
          </div>

          {/* Factors */}
          {prediction.factors?.length > 0 && (
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-3">Influencing Factors</h3>
              <div className="space-y-2">
                {prediction.factors.map((factor, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">{factor.factor}</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        factor.impact === 'negative' ? 'bg-red-100 text-red-800' :
                        factor.impact === 'positive' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {factor.impact}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Value: {factor.value}</span>
                      <span>Weight: {factor.weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {prediction.recommendations?.length > 0 && (
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-3">Recommendations</h3>
              <div className="space-y-2">
                {prediction.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{rec.action}</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        rec.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{rec.description}</p>
                    <p className="text-xs text-gray-600">Impact: {rec.estimatedImpact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {prediction.metrics && Object.keys(prediction.metrics).length > 0 && (
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-3">Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(prediction.metrics).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs font-semibold text-gray-600 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-lg font-black text-gray-900">
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PredictiveModels;

