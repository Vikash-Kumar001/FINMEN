import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, CreditCard, TrendingUp, PieChart, BarChart3,
  Plus, Download, Eye, Edit, Calendar, Users, Target
} from 'lucide-react';
import CSRFinancialDashboard from '../../components/CSR/CSRFinancialDashboard';
import PaymentModal from '../../components/CSR/PaymentModal';
import csrFinancialService from '../../services/csrFinancialService';

const CSRFinancial = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [financialStats, setFinancialStats] = useState({
    totalBudget: 0,
    healCoinsPool: 0,
    activePayments: 0,
    roi: 0
  });
  const [loading, setLoading] = useState(true);

  // Load financial statistics
  const loadFinancialStats = async () => {
    setLoading(true);
    try {
      const [financialSummary, payments] = await Promise.all([
        csrFinancialService.getFinancialSummary(),
        csrFinancialService.getPayments({ status: 'active' })
      ]);

      setFinancialStats({
        totalBudget: financialSummary.data?.totalBudget || 0,
        healCoinsPool: financialSummary.data?.healCoinsPool || 0,
        activePayments: payments.data?.length || 0,
        roi: financialSummary.data?.roi || 0
      });
    } catch (error) {
      console.error('Error loading financial stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialStats();
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
                className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              >
                Financial Management
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2 flex items-center gap-2"
              >
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Manage CSR payments, budgets, and financial analytics
              </motion.p>
            </div>
          </div>

          {/* Quick Financial Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: 'Total Budget',
                value: loading ? '...' : `₹${(financialStats.totalBudget / 100000).toFixed(1)}L`,
                change: '+0% this quarter',
                icon: DollarSign,
                color: 'from-emerald-500 to-teal-500',
                bgColor: 'from-emerald-50 to-teal-50',
                borderColor: 'border-emerald-200'
              },
              {
                title: 'HealCoins Pool',
                value: loading ? '...' : `${(financialStats.healCoinsPool / 1000000).toFixed(1)}M`,
                change: '+0% increase',
                icon: CreditCard,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50',
                borderColor: 'border-blue-200'
              },
              {
                title: 'Active Payments',
                value: loading ? '...' : financialStats.activePayments.toString(),
                change: '0 pending',
                icon: TrendingUp,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50',
                borderColor: 'border-purple-200'
              },
              {
                title: 'ROI',
                value: loading ? '...' : `${financialStats.roi}%`,
                change: '+0% improvement',
                icon: BarChart3,
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

        {/* Financial Dashboard Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CSRFinancialDashboard
            onShowPaymentModal={() => setShowPaymentModal(true)}
          />
        </motion.div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            onClose={() => setShowPaymentModal(false)}
            onSuccess={() => {
              setShowPaymentModal(false);
              loadFinancialStats(); // Refresh financial stats after payment creation
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CSRFinancial;
