import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, AlertTriangle, CreditCard, BarChart3,
  PieChart, Calendar, Target, Users, Activity, Clock
} from 'lucide-react';
import LiveBudgetTracking from '../../components/CSR/LiveBudgetTracking';
import budgetTrackingService from '../../services/budgetTrackingService';

const CSRBudgetTracking = () => {
  const [budgetStats, setBudgetStats] = useState({
    totalBudget: 0,
    spent: 0,
    remaining: 0,
    alerts: 0
  });
  const [loading, setLoading] = useState(true);

  // Load budget statistics
  const loadBudgetStats = async () => {
    setLoading(true);
    try {
      const response = await budgetTrackingService.getBudgetTracking();
      const data = response.data;
      
      setBudgetStats({
        totalBudget: data.totalBudget || 0,
        spent: data.spent || 0,
        remaining: data.remaining || 0,
        alerts: data.alerts?.length || 0
      });
    } catch (error) {
      console.error('Error loading budget stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"
              >
                Live Budget Tracking
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2 flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5 text-rose-500" />
                Real-time budget monitoring with spend vs remaining and threshold warnings
              </motion.p>
            </div>
          </div>

          {/* Budget Overview Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: 'Total Budget',
                value: loading ? '...' : `₹${(budgetStats.totalBudget / 100000).toFixed(1)}L`,
                change: 'Allocated',
                icon: DollarSign,
                color: 'from-rose-500 to-pink-500',
                bgColor: 'from-rose-50 to-pink-50',
                borderColor: 'border-rose-200'
              },
              {
                title: 'Spent',
                value: loading ? '...' : `₹${(budgetStats.spent / 100000).toFixed(1)}L`,
                change: budgetStats.totalBudget > 0 ? `${Math.round((budgetStats.spent / budgetStats.totalBudget) * 100)}% utilized` : '0% utilized',
                icon: CreditCard,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50',
                borderColor: 'border-blue-200'
              },
              {
                title: 'Remaining',
                value: loading ? '...' : `₹${(budgetStats.remaining / 100000).toFixed(1)}L`,
                change: budgetStats.totalBudget > 0 ? `${Math.round((budgetStats.remaining / budgetStats.totalBudget) * 100)}% left` : '0% left',
                icon: Target,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50',
                borderColor: 'border-green-200'
              },
              {
                title: 'Alerts',
                value: loading ? '...' : budgetStats.alerts.toString(),
                change: '80% threshold',
                icon: AlertTriangle,
                color: 'from-orange-500 to-red-500',
                bgColor: 'from-orange-50 to-red-50',
                borderColor: 'border-orange-200'
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${stat.bgColor} border-2 ${stat.borderColor} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.title}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Budget Tracking Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-500" />
            Live Tracking Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-time Monitoring',
                description: 'Live updates of budget spend and remaining amounts',
                icon: BarChart3,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Threshold Alerts',
                description: 'Automatic warnings when hitting 80% budget threshold',
                icon: AlertTriangle,
                color: 'from-orange-500 to-red-500'
              },
              {
                title: 'Spend Analytics',
                description: 'Detailed breakdown of spending by category and campaign',
                icon: PieChart,
                color: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${feature.color} w-fit mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Live Budget Tracking Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <LiveBudgetTracking
            onShowBudgetAlert={(alert) => console.log('Show budget alert:', alert)}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CSRBudgetTracking;
