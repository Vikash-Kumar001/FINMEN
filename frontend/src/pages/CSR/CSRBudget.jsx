import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, DollarSign, TrendingUp, BarChart3, PieChart,
  Calendar, Filter, Download, Eye, Edit, Plus, Target, Coins
} from 'lucide-react';
import BudgetTransactionComponent from '../../components/CSR/BudgetTransactionComponent';
import budgetTransactionService from '../../services/budgetTransactionService';

const CSRBudget = () => {
  const [budgetStats, setBudgetStats] = useState({
    healCoinsPool: 0,
    totalTransactions: 0,
    rewardsDistributed: 0,
    adminFees: 0
  });
  const [loading, setLoading] = useState(true);

  // Load budget statistics
  const loadBudgetStats = async () => {
    setLoading(true);
    try {
      const response = await budgetTransactionService.getBudgetSummary();
      const data = response.data;
      
      setBudgetStats({
        healCoinsPool: data.healCoinsBalance || 0,
        totalTransactions: data.totalTransactions || 0,
        rewardsDistributed: data.rewardsDistributed || 0,
        adminFees: data.adminFees || 0
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
                className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
              >
                Budget & Transactions
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2 flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5 text-violet-500" />
                Track HealCoins funding, spending, and financial transactions
              </motion.p>
            </div>
          </div>

          {/* Transaction Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: 'HealCoins Pool',
                value: loading ? '...' : `${(budgetStats.healCoinsPool / 1000).toFixed(1)}K`,
                change: '+8% this month',
                icon: Coins,
                color: 'from-violet-500 to-purple-500',
                bgColor: 'from-violet-50 to-purple-50',
                borderColor: 'border-violet-200'
              },
              {
                title: 'Total Transactions',
                value: loading ? '...' : budgetStats.totalTransactions.toLocaleString(),
                change: '+156 this week',
                icon: CreditCard,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50',
                borderColor: 'border-blue-200'
              },
              {
                title: 'Rewards Distributed',
                value: loading ? '...' : `₹${(budgetStats.rewardsDistributed / 100000).toFixed(1)}L`,
                change: '+12% increase',
                icon: Target,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50',
                borderColor: 'border-green-200'
              },
              {
                title: 'Admin Fees',
                value: loading ? '...' : `₹${(budgetStats.adminFees / 100000).toFixed(1)}L`,
                change: budgetStats.rewardsDistributed > 0 ? `${Math.round((budgetStats.adminFees / budgetStats.rewardsDistributed) * 100)}% of total` : '0% of total',
                icon: TrendingUp,
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

        {/* Transaction Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            Transaction Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'HealCoins Funding',
                description: 'Track CSR payments and HealCoins allocation',
                icon: DollarSign,
                color: 'from-emerald-500 to-teal-500'
              },
              {
                title: 'Reward Distribution',
                description: 'Monitor student rewards and incentives',
                icon: Target,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Admin Fees',
                description: 'Track platform and operational costs',
                icon: TrendingUp,
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Spend Analytics',
                description: 'Detailed spending breakdown and reports',
                icon: PieChart,
                color: 'from-orange-500 to-red-500'
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

        {/* Budget Transaction Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <BudgetTransactionComponent
            filters={{
              period: 'month',
              region: 'all'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CSRBudget;
