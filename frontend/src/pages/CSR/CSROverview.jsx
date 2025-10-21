import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Building, DollarSign, Gift, Target, BarChart3,
  Wifi, WifiOff, RefreshCw, Clock, TrendingUp, Activity
} from 'lucide-react';
import CSRKPIComponent from '../../components/CSR/CSRKPIComponent';
import csrOverviewService from '../../services/csrOverviewService';

const CSROverview = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [impactData, setImpactData] = useState(null);
  const [moduleProgress, setModuleProgress] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [showKPIs, setShowKPIs] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  const fetchOverviewData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await csrOverviewService.getOverviewData({
        period: timeRange,
        region: selectedRegion
      });

      if (response.success) {
        setImpactData(response.data.impactData);
        setModuleProgress(response.data.moduleProgress);
        setSkillsData(response.data.skillsData);
        setLastUpdated(response.data.lastUpdated);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error fetching overview data:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange, selectedRegion]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  const handleRefresh = () => {
    fetchOverviewData(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-12">
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
              >
                CSR Overview
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 flex items-center gap-3 max-w-3xl"
              >
                <Target className="w-6 h-6 text-purple-500 flex-shrink-0" />
                Comprehensive view of CSR impact and performance metrics
              </motion.p>
            </div>
            
            {/* Real-time Status and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              {/* Connection Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
              >
                {isConnected ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Wifi className="w-5 h-5" />
                    <span className="text-sm font-semibold">Live</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <WifiOff className="w-5 h-5" />
                    <span className="text-sm font-semibold">Offline</span>
                  </div>
                )}
              </motion.div>
              
              {/* Last Updated */}
              {lastUpdated && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-gray-500 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Updated: {new Date(lastUpdated).toLocaleTimeString()}
                </motion.div>
              )}
              
              {/* Refresh Button */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative flex-1"
            >
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300/50 focus:border-blue-400 transition-all font-medium text-gray-700 cursor-pointer"
              >
                <option value="all">All Regions</option>
                <option value="north">North India</option>
                <option value="south">South India</option>
                <option value="east">East India</option>
                <option value="west">West India</option>
                <option value="central">Central India</option>
              </select>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative flex-1"
            >
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 focus:border-purple-400 transition-all font-medium text-gray-700 cursor-pointer"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowKPIs(!showKPIs)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              {showKPIs ? 'Hide KPIs' : 'Show KPIs'}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-12"
        >
          {showKPIs && (
            <CSRKPIComponent 
              filters={{
                period: timeRange,
                region: selectedRegion
              }}
            />
          )}

          {!showKPIs && (
            <>
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              )}

              {/* Key Metrics Cards */}
              {!loading && impactData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                  {[
                    {
                      title: 'Students Impacted',
                      value: impactData.studentsImpacted?.toLocaleString() || '0',
                      change: `+${impactData.monthlyGrowth?.toFixed(1) || 0}%`,
                      icon: Users,
                      color: 'from-blue-500 to-cyan-500',
                      bgColor: 'from-blue-50 to-cyan-50',
                      borderColor: 'border-blue-200'
                    },
                    {
                      title: 'Schools Reached',
                      value: impactData.schoolsReached?.toLocaleString() || '0',
                      change: '+18.3%',
                      icon: Building,
                      color: 'from-green-500 to-emerald-500',
                      bgColor: 'from-green-50 to-emerald-50',
                      borderColor: 'border-green-200'
                    },
                    {
                      title: 'Total Value Funded',
                      value: `₹${((impactData.totalValueFunded || 0) / 100000).toFixed(1)}L`,
                      change: '+15.7%',
                      icon: DollarSign,
                      color: 'from-purple-500 to-pink-500',
                      bgColor: 'from-purple-50 to-pink-50',
                      borderColor: 'border-purple-200'
                    },
                    {
                      title: 'Items Distributed',
                      value: impactData.itemsDistributed?.toLocaleString() || '0',
                      change: '+31.2%',
                      icon: Gift,
                      color: 'from-orange-500 to-red-500',
                      bgColor: 'from-orange-50 to-red-50',
                      borderColor: 'border-orange-200'
                    }
                  ].map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`bg-gradient-to-br ${metric.bgColor} border-2 ${metric.borderColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className={`p-4 rounded-2xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                              <TrendingUp className="w-4 h-4" />
                              {metric.change}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-3xl font-bold text-gray-800">
                            {metric.value}
                          </h3>
                          <p className="text-gray-600 font-medium">
                            {metric.title}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Module Progress */}
              {!loading && moduleProgress && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Activity className="w-8 h-8 text-purple-500" />
                    <h2 className="text-3xl font-bold text-gray-800">Module Progress</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Object.entries(moduleProgress).map(([module, data], index) => {
                      const moduleColors = {
                        finance: 'from-emerald-500 to-teal-500',
                        mental: 'from-blue-500 to-indigo-500',
                        values: 'from-purple-500 to-pink-500',
                        ai: 'from-orange-500 to-red-500'
                      };
                      
                      const moduleIcons = {
                        finance: DollarSign,
                        mental: Activity,
                        values: Target,
                        ai: BarChart3
                      };
                      
                      const Icon = moduleIcons[module];
                      const colorClass = moduleColors[module];
                      
                      return (
                        <motion.div
                          key={module}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClass} shadow-lg`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 capitalize">
                                {module} Module
                              </h3>
                              <p className="text-sm text-gray-500">
                                {data.progress}% Complete
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Progress</span>
                              <span className="text-sm font-bold text-gray-800">{data.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-1000`}
                                style={{ width: `${data.progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">{data.students} students</span>
                              <span className="text-gray-600">Active participants</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Skills Development Chart */}
              {!loading && skillsData && skillsData.labels?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                    <h2 className="text-3xl font-bold text-gray-800">Skills Development</h2>
                  </div>
                  
                  <div className="h-96">
                    {/* Chart placeholder */}
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Skills Development Chart</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {skillsData.labels.length} skills tracked
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CSROverview;
