import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Target, Zap, DollarSign, FileText, CheckCircle,
  TrendingUp, CreditCard, Users, ArrowRight, Star, Activity,
  Globe, Award, Building, Heart, Brain, BookOpen, RefreshCw,
  Calendar, MapPin, Clock, ChevronRight, Sparkles, Trophy
} from 'lucide-react';
import { csrOverviewService } from '../../services/csrOverviewService';

const CSRDashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overviewData, setOverviewData] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [liveStats, setLiveStats] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('🔄 Fetching CSR dashboard data...');

      // Fetch all data in parallel
      const [overviewResponse, realTimeResponse, activityResponse, liveStatsResponse] = await Promise.all([
        csrOverviewService.getOverviewData({ period: 'month' }),
        csrOverviewService.getRealTimeMetrics(),
        csrOverviewService.getRecentActivity(10),
        csrOverviewService.getLiveStats()
      ]);

      console.log('📊 Overview data:', overviewResponse.data);
      console.log('⚡ Real-time metrics:', realTimeResponse.data);
      console.log('📈 Activity data:', activityResponse.data);
      console.log('📊 Live stats:', liveStatsResponse.data);

      setOverviewData(overviewResponse.data);
      setRealTimeMetrics(realTimeResponse.data);
      setRecentActivity(activityResponse.data);
      setLiveStats(liveStatsResponse.data);

      console.log('✅ Dashboard data updated successfully');
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Dynamic dashboard sections with real data
  const dashboardSections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Comprehensive view of CSR impact and performance metrics',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      path: '/csr/overview',
      stats: { 
        value: overviewData?.studentsImpacted?.toLocaleString() || '0', 
        label: 'Students Impacted' 
      }
    },
    {
      id: 'campaigns',
      title: 'Campaigns',
      description: 'Manage and monitor all CSR campaigns and initiatives',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      path: '/csr/campaigns',
      stats: { 
        value: liveStats?.activeCampaigns?.toString() || '0', 
        label: 'Active Campaigns' 
      }
    },
    {
      id: 'campaign-wizard',
      title: 'Campaign Wizard',
      description: 'Create and manage comprehensive CSR campaigns with advanced analytics',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200',
      path: '/csr/campaign-wizard',
      stats: { value: '7', label: 'Step Process' }
    },
    {
      id: 'financial',
      title: 'Financial Management',
      description: 'Manage CSR payments, budgets, and financial analytics',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      path: '/csr/financial',
      stats: { 
        value: overviewData?.totalValueFunded ? `₹${(overviewData.totalValueFunded / 100000).toFixed(1)}L` : '₹0L', 
        label: 'Total Budget' 
      }
    },
    {
      id: 'reports',
      title: 'CSR Reports',
      description: 'Generate comprehensive branded PDF reports with all CSR metrics',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      path: '/csr/reports',
      stats: { 
        value: overviewData?.itemsDistributed?.toString() || '0', 
        label: 'Items Distributed' 
      }
    },
    {
      id: 'approvals',
      title: 'Campaign Approvals',
      description: 'Manage campaign approval workflows and school consent processes',
      icon: CheckCircle,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50',
      borderColor: 'border-indigo-200',
      path: '/csr/approvals',
      stats: { 
        value: liveStats?.pendingApprovals?.toString() || '0', 
        label: 'Pending Approvals' 
      }
    },
    {
      id: 'budget-tracking',
      title: 'Live Budget Tracking',
      description: 'Real-time budget monitoring with spend vs remaining and threshold warnings',
      icon: TrendingUp,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-200',
      path: '/csr/budget-tracking',
      stats: { 
        value: overviewData?.monthlyGrowth ? `+${overviewData.monthlyGrowth.toFixed(1)}%` : '+0%', 
        label: 'Monthly Growth' 
      }
    },
    {
      id: 'budget',
      title: 'Budget & Transactions',
      description: 'Track HealCoins funding, spending, and financial transactions',
      icon: CreditCard,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'from-violet-50 to-purple-50',
      borderColor: 'border-violet-200',
      path: '/csr/budget',
      stats: { 
        value: recentActivity?.length?.toString() || '0', 
        label: 'Recent Activities' 
      }
    },
    {
      id: 'cobranding',
      title: 'Co-branding & Legal',
      description: 'Manage co-branding assets, legal documents, and partnership agreements',
      icon: Users,
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'from-amber-50 to-yellow-50',
      borderColor: 'border-amber-200',
      path: '/csr/cobranding',
      stats: { 
        value: overviewData?.regionsActive?.toString() || '0', 
        label: 'Active Regions' 
      }
    }
  ];

  // Dynamic quick stats based on real data
  const quickStats = [
    {
      title: 'Students Impacted',
      value: overviewData?.studentsImpacted?.toLocaleString() || '0',
      change: overviewData?.monthlyGrowth ? `+${overviewData.monthlyGrowth.toFixed(1)}%` : '+0%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Schools Reached',
      value: overviewData?.schoolsReached?.toString() || '0',
      change: '+12.3%',
      icon: Building,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Value Funded',
      value: overviewData?.totalValueFunded ? `₹${(overviewData.totalValueFunded / 100000).toFixed(1)}L` : '₹0L',
      change: '+15.7%',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Active Users',
      value: liveStats?.activeUsers?.toString() || '0',
      change: '+8.2%',
      icon: Activity,
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Loading Dashboard</h2>
          <p className="text-gray-500">Fetching your CSR impact data...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchDashboardData()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
              >
                CSR Impact Dashboard
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Comprehensive CSR management platform for measuring social impact of wellness and financial literacy initiatives
              </motion.p>
            </div>
            
            {/* Refresh Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={refreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'text-purple-600' : 'text-gray-600'}`} />
              </motion.div>
              <span className="text-sm font-semibold text-gray-700">
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </motion.button>
          </div>

          {/* Live Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-8 mb-8"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live Data</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last updated: {overviewData?.lastUpdated ? new Date(overviewData.lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{overviewData?.regionsActive || 0} Active Regions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Activity className="w-4 h-4" />
              <span>{liveStats?.activeUsers || 0} Active Users</span>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.title}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Real-time Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Live Activity Feed
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Real-time</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {recentActivity.slice(0, 6).map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.color === 'blue' ? 'bg-blue-500' :
                        activity.color === 'green' ? 'bg-green-500' :
                        activity.color === 'orange' ? 'bg-orange-500' :
                        activity.color === 'purple' ? 'bg-purple-500' : 'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.location}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {dashboardSections.map((section, index) => {
            const Icon = section.icon;
            const isActive = location.pathname === section.path;
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group"
              >
                <Link to={section.path}>
                  <div className={`relative bg-gradient-to-br ${section.bgColor} border-2 ${section.borderColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full overflow-hidden ${
                    isActive ? 'ring-4 ring-purple-300 ring-opacity-50' : ''
                  }`}>
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full"
                        style={{
                          background: `radial-gradient(circle at 20% 80%, ${section.color.split(' ')[1]} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${section.color.split(' ')[3]} 0%, transparent 50%)`
                        }}
                      />
                    </div>

                    {/* Icon and Stats */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <motion.div 
                        className={`p-4 rounded-2xl bg-gradient-to-r ${section.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 5 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="text-right">
                        <motion.div 
                          className="text-2xl font-bold text-gray-800"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                        >
                          {section.stats.value}
                        </motion.div>
                        <div className="text-sm text-gray-600">{section.stats.label}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6 relative z-10">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {section.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-sm font-semibold text-gray-500 group-hover:text-purple-600 transition-colors duration-300">
                        Explore Section
                      </span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-all duration-300" />
                      </motion.div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div 
                        className="absolute top-4 right-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                      </motion.div>
                    )}

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="w-full h-full"
                style={{
                  background: "linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4, #10b981)",
                  backgroundSize: "400% 400%"
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.h3 
                className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </motion.div>
                Ready to Make an Impact?
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 }}
              >
                Transform lives through comprehensive CSR initiatives. Start your journey with powerful analytics and seamless campaign management.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/csr/campaign-wizard"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="w-5 h-5" />
                    Create Campaign
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/csr/overview"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    <BarChart3 className="w-5 h-5" />
                    View Analytics
                  </Link>
                </motion.div>
              </motion.div>

              {/* Success Metrics */}
              <motion.div 
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{overviewData?.studentsImpacted?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-gray-500">Students Impacted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{overviewData?.schoolsReached || '0'}</div>
                  <div className="text-sm text-gray-500">Schools Reached</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{overviewData?.itemsDistributed || '0'}</div>
                  <div className="text-sm text-gray-500">Items Distributed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{overviewData?.regionsActive || '0'}</div>
                  <div className="text-sm text-gray-500">Active Regions</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CSRDashboard;