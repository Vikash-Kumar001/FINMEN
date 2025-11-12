import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Shield,
  CheckCircle2,
  Star,
  TrendingUp,
  Zap,
  Award,
  Users,
  Sparkles,
  Lock,
  Download,
  Filter,
  Calendar,
  Receipt,
  ArrowRight,
  BadgeCheck,
  Clock,
  AlertCircle,
} from 'lucide-react';
import SubscriptionManagement from '../../components/Student/SubscriptionManagement';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const PaymentPage = () => {
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'history'
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all', 'completed', 'pending', 'failed'

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPaymentHistory();
    }
  }, [activeTab, historyFilter]);

  const fetchPaymentHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await api.get('/api/subscription/history');
      if (response.data.success) {
        let history = response.data.subscriptions || [];
        
        // Filter history based on selected filter
        if (historyFilter !== 'all') {
          history = history.filter(sub => {
            const status = sub.status?.toLowerCase();
            if (historyFilter === 'completed') return status === 'active';
            if (historyFilter === 'pending') return status === 'pending';
            if (historyFilter === 'failed') return status === 'cancelled' || status === 'expired';
            return true;
          });
        }
        
        setPaymentHistory(history);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast.error('Failed to load payment history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const downloadReceipt = async (transaction) => {
    if (transaction.receiptUrl) {
      window.open(transaction.receiptUrl, '_blank');
    } else {
      toast.error('Receipt not available');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle2 },
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-300', icon: AlertCircle },
      expired: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: AlertCircle },
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status?.toUpperCase() || 'PENDING'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-4 shadow-sm">
            <Shield className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Secure Payment Gateway</span>
            <BadgeCheck className="w-4 h-4 text-green-600" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Unlock unlimited access to all learning pillars, games, and premium features
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { icon: Shield, text: '256-bit SSL Encryption', color: 'from-blue-500 to-cyan-500' },
            { icon: Lock, text: 'Secure Payment', color: 'from-green-500 to-emerald-500' },
            { icon: CheckCircle2, text: 'Money Back Guarantee', color: 'from-purple-500 to-pink-500' },
            { icon: Zap, text: 'Instant Activation', color: 'from-orange-500 to-red-500' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 text-white text-center shadow-lg`}
            >
              <item.icon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs font-semibold">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 mb-8 overflow-hidden"
        >
          <div className="flex border-b border-gray-200">
            {[
              { id: 'plans', label: 'Subscription Plans', icon: Star },
              { id: 'history', label: 'Payment History', icon: Receipt },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'plans' && (
                <motion.div
                  key="plans"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SubscriptionManagement />
                </motion.div>
              )}
              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Filter */}
                  <div className="flex items-center gap-4 mb-6">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <div className="flex gap-2 flex-wrap">
                      {['all', 'completed', 'pending', 'failed'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setHistoryFilter(filter)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            historyFilter === filter
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* History List */}
                  {historyLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                  ) : paymentHistory.length > 0 ? (
                    <div className="space-y-4">
                      {paymentHistory.map((sub, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-bold text-gray-900">{sub.planName}</h4>
                                {getStatusBadge(sub.status)}
                              </div>
                              <div className="flex items-center gap-6 text-sm text-gray-600">
                                {sub.transactions && sub.transactions.length > 0 && (
                                  <>
                                    <span className="font-semibold">
                                      ₹{sub.transactions[0]?.amount?.toLocaleString() || sub.amount?.toLocaleString() || '0'}
                                    </span>
                                    {sub.transactions[0]?.paymentDate && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(sub.transactions[0].paymentDate).toLocaleDateString('en-IN', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    )}
                                  </>
                                )}
                                {sub.startDate && (
                                  <span>
                                    Started: {new Date(sub.startDate).toLocaleDateString('en-IN', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                            {sub.transactions?.[0]?.receiptUrl && (
                              <button
                                onClick={() => downloadReceipt(sub.transactions[0])}
                                className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                                title="Download Receipt"
                              >
                                <Download className="w-5 h-5 text-purple-600" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Receipt className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No payment history found</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards, UPI, Net Banking, and digital wallets through our secure payment gateway.',
              },
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
              },
              {
                q: 'Will I get a refund?',
                a: 'We offer a 7-day money-back guarantee. If you\'re not satisfied, contact us within 7 days for a full refund.',
              },
              {
                q: 'How does auto-renewal work?',
                a: 'Your subscription will automatically renew at the end of each billing period. You can disable auto-renewal anytime from your account settings.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="p-4 bg-gray-50 rounded-xl"
              >
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
