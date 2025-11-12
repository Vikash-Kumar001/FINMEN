import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, Upload, Download, RefreshCw, CheckCircle, XCircle,
  Link, GraduationCap, ArrowRight, Filter, Search, Calendar,
  UserPlus, Settings, FileText, AlertCircle, Zap, Building,
  Mail, Phone, User, ArrowLeft, Play, Eye, FileSpreadsheet,
  UserCheck, ArrowUpCircle, ArrowDownCircle, Clock, Target, BarChart3
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const LifecycleManagement = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  
  // Bulk onboarding state
  const [bulkUsers, setBulkUsers] = useState([]);
  const [bulkOptions, setBulkOptions] = useState({
    organizationId: '',
    tenantId: '',
    defaultRole: '',
    sendWelcomeEmail: false,
    skipDuplicates: true,
    updateExisting: false
  });
  
  // HRIS sync state
  const [hrisData, setHrisData] = useState([]);
  const [hrisOptions, setHrisOptions] = useState({
    organizationId: '',
    tenantId: '',
    updateExisting: true,
    deactivateMissing: false
  });
  
  // Graduation/Promotion state
  const [promotionData, setPromotionData] = useState({
    organizationId: '',
    tenantId: '',
    academicYear: new Date().getFullYear(),
    promoteFromClass: '',
    promoteToClass: '',
    graduateClass: '',
    dryRun: true
  });
  
  // Parent-Student linking state
  const [linkData, setLinkData] = useState({
    parentEmail: '',
    studentEmail: '',
    verifyByEmail: true,
    autoCreate: false
  });
  const [bulkLinkData, setBulkLinkData] = useState([]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/lifecycle/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (socket?.socket) {
      const handleStatsUpdate = (data) => {
        setStats(data);
      };

      const handleBulkOnboardComplete = (result) => {
        toast.success(`Bulk onboarding: ${result.created} created, ${result.updated} updated`, {
          duration: 5000
        });
        fetchStats();
      };

      const handleHRISSyncComplete = (result) => {
        toast.success(`HRIS sync: ${result.synced} teachers synced`, {
          duration: 5000
        });
        fetchStats();
      };

      socket.socket.on('lifecycle:stats:update', handleStatsUpdate);
      socket.socket.on('lifecycle:bulk-onboard:complete', handleBulkOnboardComplete);
      socket.socket.on('lifecycle:hris:sync:complete', handleHRISSyncComplete);
      
      return () => {
        socket.socket.off('lifecycle:stats:update', handleStatsUpdate);
        socket.socket.off('lifecycle:bulk-onboard:complete', handleBulkOnboardComplete);
        socket.socket.off('lifecycle:hris:sync:complete', handleHRISSyncComplete);
      };
    }
  }, [socket, fetchStats]);

  const handleFileUpload = (file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',').map(v => v.trim());
          const obj = {};
          headers.forEach((header, idx) => {
            obj[header] = values[idx] || '';
          });
          data.push(obj);
        }
        
        if (type === 'bulk') {
          setBulkUsers(data);
          toast.success(`Loaded ${data.length} users from CSV`);
        } else if (type === 'hris') {
          setHrisData(data);
          toast.success(`Loaded ${data.length} teachers from HRIS`);
        } else if (type === 'link') {
          setBulkLinkData(data);
          toast.success(`Loaded ${data.length} parent-student links from CSV`);
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Error parsing CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleBulkOnboard = async () => {
    if (bulkUsers.length === 0) {
      toast.error('Please upload or enter user data');
      return;
    }
    
    try {
      setLoading(true);
      const res = await api.post('/api/admin/lifecycle/bulk-onboard', {
        users: bulkUsers,
        options: bulkOptions
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
        setBulkUsers([]);
        fetchStats();
      }
    } catch (error) {
      console.error('Error bulk onboarding:', error);
      toast.error(error.response?.data?.message || 'Failed to bulk onboard users');
    } finally {
      setLoading(false);
    }
  };

  const handleHRISSync = async () => {
    if (hrisData.length === 0) {
      toast.error('Please upload HRIS data');
      return;
    }
    
    try {
      setLoading(true);
      const res = await api.post('/api/admin/lifecycle/hris/sync', {
        hrisData,
        options: hrisOptions
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
        setHrisData([]);
        fetchStats();
      }
    } catch (error) {
      console.error('Error syncing HRIS:', error);
      toast.error(error.response?.data?.message || 'Failed to sync HRIS data');
    } finally {
      setLoading(false);
    }
  };

  const handleGraduationPromotion = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/admin/lifecycle/graduation-promotion', promotionData);
      
      if (res.data.success) {
        const { promoted, graduated } = res.data.data;
        if (promotionData.dryRun) {
          toast.success(`Dry run: ${promoted} would be promoted, ${graduated} would be graduated`);
        } else {
          toast.success(res.data.message);
          fetchStats();
        }
      }
    } catch (error) {
      console.error('Error processing graduation/promotion:', error);
      toast.error(error.response?.data?.message || 'Failed to process graduation/promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkParentStudent = async () => {
    if (!linkData.parentEmail || !linkData.studentEmail) {
      toast.error('Parent and student emails are required');
      return;
    }
    
    try {
      setLoading(true);
      const res = await api.post('/api/admin/lifecycle/link-parent-student', {
        parentData: { email: linkData.parentEmail },
        studentData: { email: linkData.studentEmail },
        options: {
          verifyByEmail: linkData.verifyByEmail,
          autoCreate: linkData.autoCreate
        }
      });
      
      if (res.data.success) {
        toast.success('Parent and student linked successfully!');
        setLinkData({
          parentEmail: '',
          studentEmail: '',
          verifyByEmail: true,
          autoCreate: false
        });
        fetchStats();
      }
    } catch (error) {
      console.error('Error linking parent-student:', error);
      toast.error(error.response?.data?.message || 'Failed to link parent and student');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkLink = async () => {
    if (bulkLinkData.length === 0) {
      toast.error('Please upload link data');
      return;
    }
    
    try {
      setLoading(true);
      const linkDataList = bulkLinkData.map(row => ({
        parentEmail: row.parentEmail || row.parent_email,
        studentEmail: row.studentEmail || row.student_email,
        parentData: {
          name: row.parentName || row.parent_name,
          phone: row.parentPhone || row.parent_phone
        },
        studentData: {
          name: row.studentName || row.student_name,
          phone: row.studentPhone || row.student_phone
        }
      }));
      
      const res = await api.post('/api/admin/lifecycle/bulk-link-parent-student', {
        linkDataList,
        options: {
          verifyByEmail: true,
          autoCreate: true
        }
      });
      
      if (res.data.success) {
        toast.success(`Bulk linking completed: ${res.data.data.linked} links created`);
        setBulkLinkData([]);
        fetchStats();
      }
    } catch (error) {
      console.error('Error bulk linking:', error);
      toast.error(error.response?.data?.message || 'Failed to bulk link');
    } finally {
      setLoading(false);
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'bulk-onboard', label: 'Bulk Onboarding', icon: UserPlus },
    { id: 'hris', label: 'HRIS Sync', icon: Building },
    { id: 'graduation', label: 'Graduation & Promotion', icon: GraduationCap },
    { id: 'linking', label: 'Parent-Student Linking', icon: Link }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <Users className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">User Lifecycle Management</h1>
                  <p className="text-lg text-white/90">Systematic user onboarding, role assignment & automation</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchStats}
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
              title="Total Users"
              value={stats.totalUsers || 0}
              icon={Users}
              color="from-blue-500 to-cyan-600"
            />
            <StatCard
              title="Students"
              value={stats.byRole?.students || 0}
              icon={User}
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              title="Teachers"
              value={stats.byRole?.teachers || 0}
              icon={Building}
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              title="Bulk Imported"
              value={stats.bulkImported || 0}
              icon={Upload}
              color="from-orange-500 to-amber-600"
              subtitle={`${stats.hrisSynced || 0} HRIS synced`}
            />
          </div>
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

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-indigo-600" />
                Lifecycle Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">By Role</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-bold text-blue-600">{stats.byRole?.students || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Teachers:</span>
                      <span className="font-bold text-green-600">{stats.byRole?.teachers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Parents:</span>
                      <span className="font-bold text-purple-600">{stats.byRole?.parents || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Pending Verifications</p>
                  <p className="text-2xl font-black text-orange-600">{stats.pendingVerifications || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Parent-Student links</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Automation Status</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Bulk Imported:</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>HRIS Synced:</span>
                      <span className="font-bold text-green-600">{stats.hrisSynced || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bulk Onboarding Tab */}
        {activeTab === 'bulk-onboard' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <UserPlus className="w-7 h-7 text-blue-600" />
                Bulk User Onboarding
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'bulk');
                      }
                    }}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    CSV format: email, name, fullName, phone, dateOfBirth, role, registrationNumber
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Default Role</label>
                    <select
                      value={bulkOptions.defaultRole}
                      onChange={(e) => setBulkOptions({ ...bulkOptions, defaultRole: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Auto-detect</option>
                      <option value="school_student">School Student</option>
                      <option value="school_teacher">School Teacher</option>
                      <option value="school_parent">School Parent</option>
                      <option value="school_admin">School Admin</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bulkOptions.sendWelcomeEmail}
                        onChange={(e) => setBulkOptions({ ...bulkOptions, sendWelcomeEmail: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-semibold text-gray-700">Send Welcome Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bulkOptions.updateExisting}
                        onChange={(e) => setBulkOptions({ ...bulkOptions, updateExisting: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-semibold text-gray-700">Update Existing</span>
                    </label>
                  </div>
                </div>
                
                {bulkUsers.length > 0 && (
                  <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Preview: {bulkUsers.length} users loaded
                    </p>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {bulkUsers.slice(0, 5).map((user, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          {user.email} - {user.name || user.fullName}
                        </div>
                      ))}
                      {bulkUsers.length > 5 && (
                        <p className="text-xs text-gray-500">... and {bulkUsers.length - 5} more</p>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleBulkOnboard}
                  disabled={loading || bulkUsers.length === 0}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Bulk Onboard {bulkUsers.length > 0 ? `${bulkUsers.length} Users` : 'Users'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* HRIS Sync Tab */}
        {activeTab === 'hris' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Building className="w-7 h-7 text-green-600" />
                HRIS Teacher Roster Sync
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload HRIS Data (CSV)
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'hris');
                      }
                    }}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    CSV format: email, name, employeeId, department, designation, phone
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hrisOptions.updateExisting}
                      onChange={(e) => setHrisOptions({ ...hrisOptions, updateExisting: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-gray-700">Update Existing Teachers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hrisOptions.deactivateMissing}
                      onChange={(e) => setHrisOptions({ ...hrisOptions, deactivateMissing: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-gray-700">Deactivate Missing</span>
                  </label>
                </div>
                
                {hrisData.length > 0 && (
                  <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Preview: {hrisData.length} teachers loaded
                    </p>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {hrisData.slice(0, 5).map((teacher, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          {teacher.email} - {teacher.name || teacher.fullName} ({teacher.employeeId || teacher.id})
                        </div>
                      ))}
                      {hrisData.length > 5 && (
                        <p className="text-xs text-gray-500">... and {hrisData.length - 5} more</p>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleHRISSync}
                  disabled={loading || hrisData.length === 0}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Sync {hrisData.length > 0 ? `${hrisData.length} Teachers` : 'HRIS Data'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Graduation & Promotion Tab */}
        {activeTab === 'graduation' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <GraduationCap className="w-7 h-7 text-purple-600" />
                Graduation & Class Promotion
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Promote From Class</label>
                    <input
                      type="text"
                      value={promotionData.promoteFromClass}
                      onChange={(e) => setPromotionData({ ...promotionData, promoteFromClass: e.target.value })}
                      placeholder="e.g., 10"
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Promote To Class</label>
                    <input
                      type="text"
                      value={promotionData.promoteToClass}
                      onChange={(e) => setPromotionData({ ...promotionData, promoteToClass: e.target.value })}
                      placeholder="e.g., 11"
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Graduate Class</label>
                    <input
                      type="text"
                      value={promotionData.graduateClass}
                      onChange={(e) => setPromotionData({ ...promotionData, graduateClass: e.target.value })}
                      placeholder="e.g., 12"
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                    <input
                      type="number"
                      value={promotionData.academicYear}
                      onChange={(e) => setPromotionData({ ...promotionData, academicYear: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={promotionData.dryRun}
                    onChange={(e) => setPromotionData({ ...promotionData, dryRun: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-semibold text-gray-700">Dry Run (Preview only, no changes)</span>
                </div>
                
                <button
                  onClick={handleGraduationPromotion}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5" />
                      {promotionData.dryRun ? 'Preview Changes' : 'Process Graduation & Promotion'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Parent-Student Linking Tab */}
        {activeTab === 'linking' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Link className="w-7 h-7 text-indigo-600" />
                Parent-Student Linking
              </h2>
              
              <div className="space-y-6">
                {/* Single Link */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Single Link</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Email</label>
                      <input
                        type="email"
                        value={linkData.parentEmail}
                        onChange={(e) => setLinkData({ ...linkData, parentEmail: e.target.value })}
                        placeholder="parent@example.com"
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Student Email</label>
                      <input
                        type="email"
                        value={linkData.studentEmail}
                        onChange={(e) => setLinkData({ ...linkData, studentEmail: e.target.value })}
                        placeholder="student@example.com"
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={linkData.autoCreate}
                        onChange={(e) => setLinkData({ ...linkData, autoCreate: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-semibold text-gray-700">Auto-create if missing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={linkData.verifyByEmail}
                        onChange={(e) => setLinkData({ ...linkData, verifyByEmail: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-semibold text-gray-700">Verify by Email</span>
                    </label>
                  </div>
                  <button
                    onClick={handleLinkParentStudent}
                    disabled={loading || !linkData.parentEmail || !linkData.studentEmail}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Link className="w-5 h-5" />
                        Link Parent & Student
                      </>
                    )}
                  </button>
                </div>
                
                {/* Bulk Link */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Bulk Link</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload CSV File
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleFileUpload(e.target.files[0], 'link');
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      CSV format: parentEmail, studentEmail, parentName, studentName
                    </p>
                  </div>
                  
                  {bulkLinkData.length > 0 && (
                    <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Preview: {bulkLinkData.length} links loaded
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={handleBulkLink}
                    disabled={loading || bulkLinkData.length === 0}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Bulk Link {bulkLinkData.length > 0 ? `${bulkLinkData.length} Pairs` : 'Parent-Student'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifecycleManagement;

