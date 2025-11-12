import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Map, TrendingUp, Activity, School, Download, Scale, Plus,
  RefreshCw, Search, Filter, Eye, Edit, CheckCircle, XCircle,
  AlertTriangle, Clock, Globe, BarChart3, Users, Building,
  Calendar, FileText, Shield, Play, Pause, ArrowRight
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const AdminPlatform = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('network');
  const [networkMap, setNetworkMap] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [onboardings, setOnboardings] = useState([]);
  const [dataExports, setDataExports] = useState([]);
  const [policyStats, setPolicyStats] = useState(null);
  const [policyRequests, setPolicyRequests] = useState([]);

  const fetchNetworkMap = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/platform/network-map');
      if (res.data.success) {
        setNetworkMap(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching network map:', error);
    }
  }, []);

  const fetchBenchmarks = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/platform/benchmarks');
      if (res.data.success) {
        setBenchmarks(res.data.data.benchmarks || []);
      }
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
    }
  }, []);

  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/platform/telemetry');
      if (res.data.success) {
        setTelemetry(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching telemetry:', error);
    }
  }, []);

  const fetchOnboardings = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/platform/onboarding');
      if (res.data.success) {
        setOnboardings(res.data.data.onboardings || []);
      }
    } catch (error) {
      console.error('Error fetching onboardings:', error);
    }
  }, []);

  const fetchDataExports = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/platform/data-export');
      if (res.data.success) {
        setDataExports(res.data.data.exports || []);
      }
    } catch (error) {
      console.error('Error fetching data exports:', error);
    }
  }, []);

  const fetchPolicyStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/platform/policy-legal/stats');
      if (res.data.success) {
        setPolicyStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching policy stats:', error);
    }
  }, []);

  const fetchPolicyRequests = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/platform/policy-legal/requests');
      if (res.data.success) {
        setPolicyRequests(res.data.data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching policy requests:', error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchNetworkMap(),
      fetchBenchmarks(),
      fetchTelemetry(),
      fetchOnboardings(),
      fetchDataExports(),
      fetchPolicyStats(),
      fetchPolicyRequests()
    ]).finally(() => setLoading(false));

    if (socket?.socket) {
      const handlers = {
        'network:map:updated': () => fetchNetworkMap(),
        'benchmark:created': () => fetchBenchmarks(),
        'telemetry:updated': () => fetchTelemetry(),
        'onboarding:created': () => fetchOnboardings(),
        'data:export:created': () => fetchDataExports(),
        'policy:legal:request:created': () => {
          fetchPolicyStats();
          fetchPolicyRequests();
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
  }, [socket, fetchNetworkMap, fetchBenchmarks, fetchTelemetry, fetchOnboardings, fetchDataExports, fetchPolicyStats, fetchPolicyRequests]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'network') fetchNetworkMap();
      else if (activeTab === 'benchmarks') fetchBenchmarks();
      else if (activeTab === 'telemetry') fetchTelemetry();
      else if (activeTab === 'onboarding') fetchOnboardings();
      else if (activeTab === 'exports') fetchDataExports();
      else if (activeTab === 'policy') {
        fetchPolicyStats();
        fetchPolicyRequests();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab]);

  if (loading) {
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
      <div className="bg-gradient-to-r from-gray-700 via-slate-700 to-zinc-700 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <Activity className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Platform Management</h1>
                  <p className="text-lg text-white/90">Network, benchmarks, telemetry, onboarding & compliance</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-6">
          <div className="flex border-b-2 border-gray-200 overflow-x-auto">
            {[
              { id: 'network', label: 'Network Map', icon: Map },
              { id: 'benchmarks', label: 'Benchmarks', icon: TrendingUp },
              { id: 'telemetry', label: 'Telemetry', icon: Activity },
              { id: 'onboarding', label: 'Onboarding', icon: School },
              { id: 'exports', label: 'Data Export', icon: Download },
              { id: 'policy', label: 'Policy & Legal', icon: Scale }
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

        {activeTab === 'network' && <NetworkMapTab data={networkMap} />}
        {activeTab === 'benchmarks' && <BenchmarksTab benchmarks={benchmarks} />}
        {activeTab === 'telemetry' && <TelemetryTab data={telemetry} />}
        {activeTab === 'onboarding' && <OnboardingTab onboardings={onboardings} />}
        {activeTab === 'exports' && <DataExportTab exports={dataExports} />}
        {activeTab === 'policy' && <PolicyLegalTab stats={policyStats} requests={policyRequests} />}
      </div>
    </div>
  );
};

// Network Map Tab
const NetworkMapTab = ({ data }) => {
  if (!data) {
    return <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
      <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 font-semibold">No network map data available</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-2xl font-black text-gray-900">{data.totalSchools || 0}</h3>
              <p className="text-sm font-semibold text-gray-700">Total Schools</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-2xl font-black text-gray-900">{data.totalCountries || 0}</h3>
              <p className="text-sm font-semibold text-gray-700">Countries</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Building className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-2xl font-black text-gray-900">{data.totalStates || 0}</h3>
              <p className="text-sm font-semibold text-gray-700">Regions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
        <h3 className="text-xl font-black text-gray-900 mb-4">Regional Distribution</h3>
        <div className="space-y-3">
          {data.regions?.map((region, idx) => (
            <div key={idx} className="p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-black text-gray-900">{region.region}</h4>
                <span className="text-sm font-bold text-gray-600">{region.totalSchools} schools</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Students:</span>
                  <span className="font-bold ml-2">{region.totalStudents}</span>
                </div>
                <div>
                  <span className="text-gray-600">Teachers:</span>
                  <span className="font-bold ml-2">{region.totalTeachers}</span>
                </div>
                <div>
                  <span className="text-gray-600">Adoption:</span>
                  <span className="font-bold ml-2">{region.adoptionRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Benchmarks Tab
const BenchmarksTab = ({ benchmarks }) => (
  <div className="space-y-4">
    {benchmarks.length === 0 ? (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">No benchmarks found</p>
      </div>
    ) : (
      benchmarks.map((benchmark) => (
        <motion.div
          key={benchmark._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-black text-gray-900">{benchmark.benchmarkName}</h3>
              <p className="text-sm text-gray-600 capitalize">{benchmark.benchmarkType}</p>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-bold">
              Avg: {benchmark.networkAverage?.toFixed(1)}%
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-600">Min:</span>
              <span className="font-bold ml-2">{benchmark.networkMin?.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Max:</span>
              <span className="font-bold ml-2">{benchmark.networkMax?.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Median:</span>
              <span className="font-bold ml-2">{benchmark.networkMedian?.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Std Dev:</span>
              <span className="font-bold ml-2">{benchmark.networkStdDev?.toFixed(1)}</span>
            </div>
          </div>
        </motion.div>
      ))
    )}
  </div>
);

// Telemetry Tab
const TelemetryTab = ({ data }) => {
  if (!data) {
    return <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
      <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 font-semibold">No telemetry data available</p>
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-lg font-black text-gray-900 mb-3">Overall Health</h3>
          <div className={`text-3xl font-black ${
            data.overallHealth === 'healthy' ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.overallHealth}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-lg font-black text-gray-900 mb-3">Total Services</h3>
          <div className="text-3xl font-black text-gray-900">{data.totalServices || 0}</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-lg font-black text-gray-900 mb-3">Critical Services</h3>
          <div className="text-3xl font-black text-red-600">{data.criticalServices || 0}</div>
        </div>
      </div>

      <div className="space-y-4">
        {data.services?.map((service, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-900">{service.serviceName}</h3>
              <span className={`px-4 py-2 rounded-lg font-bold ${
                service.status === 'healthy' ? 'bg-green-100 text-green-800' :
                service.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {service.status}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Response Time:</span>
                <span className="font-bold ml-2">{service.averageMetrics?.responseTime?.toFixed(0) || 0}ms</span>
              </div>
              <div>
                <span className="text-gray-600">Error Rate:</span>
                <span className="font-bold ml-2">{service.averageMetrics?.errorRate?.toFixed(2) || 0}%</span>
              </div>
              <div>
                <span className="text-gray-600">CPU:</span>
                <span className="font-bold ml-2">{service.averageMetrics?.cpuUsage?.toFixed(1) || 0}%</span>
              </div>
              <div>
                <span className="text-gray-600">Memory:</span>
                <span className="font-bold ml-2">{service.averageMetrics?.memoryUsage?.toFixed(1) || 0}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Onboarding Tab
const OnboardingTab = ({ onboardings }) => (
  <div className="space-y-4">
    {onboardings.length === 0 ? (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
        <School className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">No onboarding records found</p>
      </div>
    ) : (
      onboardings.map((onboarding) => (
        <motion.div
          key={onboarding._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-black text-gray-900">{onboarding.schoolName}</h3>
              <p className="text-sm text-gray-600">{onboarding.region}, {onboarding.country}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                onboarding.status === 'completed' ? 'bg-green-100 text-green-800' :
                onboarding.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {onboarding.status}
              </span>
              {onboarding.trialStatus && (
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  onboarding.trialStatus === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {onboarding.trialStatus}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Progress:</span>
              <span className="font-bold ml-2">{onboarding.progress || 0}%</span>
            </div>
            <div>
              <span className="text-gray-600">Trial Days:</span>
              <span className="font-bold ml-2">{onboarding.trialDays || 0}</span>
            </div>
            {onboarding.trialEndDate && (
              <div>
                <span className="text-gray-600">Trial Ends:</span>
                <span className="font-bold ml-2">{new Date(onboarding.trialEndDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))
    )}
  </div>
);

// Data Export Tab
const DataExportTab = ({ exports }) => (
  <div className="space-y-4">
    {exports.length === 0 ? (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
        <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">No data exports found</p>
      </div>
    ) : (
      exports.map((export_) => (
        <motion.div
          key={export_._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-black text-gray-900">{export_.exportName}</h3>
              <p className="text-sm text-gray-600 capitalize">{export_.exportType} • {export_.format}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
              export_.status === 'completed' ? 'bg-green-100 text-green-800' :
              export_.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {export_.status}
            </span>
          </div>
          {export_.status === 'processing' && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${export_.progress || 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">Progress: {export_.progress || 0}%</p>
            </div>
          )}
          {export_.fileUrl && (
            <a
              href={export_.fileUrl}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          )}
        </motion.div>
      ))
    )}
  </div>
);

// Policy & Legal Tab
const PolicyLegalTab = ({ stats, requests }) => (
  <div className="space-y-6">
    {stats && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-lg font-black text-gray-900 mb-3">Consent Rate</h3>
          <div className="text-3xl font-black text-green-600">{stats.consentRate?.toFixed(1) || 0}%</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-lg font-black text-gray-900 mb-3">Granted Consents</h3>
          <div className="text-3xl font-black text-gray-900">{stats.grantedConsents || 0}</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-lg font-black text-gray-900 mb-3">Pending Deletions</h3>
          <div className="text-3xl font-black text-orange-600">{stats.pendingDeletions || 0}</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-lg font-black text-gray-900 mb-3">Legal Holds</h3>
          <div className="text-3xl font-black text-red-600">{stats.activeLegalHolds || 0}</div>
        </div>
      </div>
    )}

    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
      <h3 className="text-xl font-black text-gray-900 mb-4">Recent Requests</h3>
      <div className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No requests found</p>
        ) : (
          requests.slice(0, 10).map((request) => (
            <div key={request._id} className="p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 capitalize">{request.requestType.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-gray-600">
                    {request.userId?.name || request.organizationId?.name || 'System'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  request.status === 'active' ? 'bg-green-100 text-green-800' :
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default AdminPlatform;

