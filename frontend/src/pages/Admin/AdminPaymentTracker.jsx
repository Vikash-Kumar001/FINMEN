import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, DollarSign, TrendingUp, TrendingDown, AlertCircle,
  CheckCircle, Clock, XCircle, Filter, Search, Calendar, Eye,
  RefreshCw, Download, PieChart, BarChart3, ArrowUpDown, ArrowRight,
  Building, Users, Zap, FileText, Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const AdminPaymentTracker = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    gateway: 'all',
    startDate: '',
    endDate: '',
    organization: 'all'
  });
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== 'all' && v !== ''))
      };

      const [transactionsRes, statsRes] = await Promise.all([
        api.get('/api/admin/payment-tracker/transactions', { params }),
        api.get('/api/admin/payment-tracker/statistics', { 
          params: filters.startDate || filters.endDate ? {
            startDate: filters.startDate,
            endDate: filters.endDate
          } : {}
        })
      ]);

      setTransactions(transactionsRes.data.data);
      setPagination(transactionsRes.data.pagination);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRefund = async (transactionId) => {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    try {
      await api.post(`/api/admin/payment-tracker/refund/${transactionId}`, { reason });
      toast.success('Refund processed successfully');
      fetchData();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'processing': return 'from-blue-500 to-cyan-500';
      case 'failed': return 'from-red-500 to-pink-500';
      case 'cancelled': return 'from-gray-500 to-slate-500';
      case 'refunded': return 'from-purple-500 to-indigo-500';
      default: return 'from-gray-400 to-slate-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'processing': return <Activity className="w-5 h-5 text-blue-600" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                <CreditCard className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-2">Payment Tracker</h1>
                <p className="text-lg text-white/90">Monitor all platform-wide payment transactions</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-6 h-6" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Statistics Cards */}
        {stats && stats.overall && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900">{stats.overall.totalTransactions}</div>
                  <div className="text-sm text-gray-600 font-semibold">Total Transactions</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-600">{formatCurrency(stats.overall.totalAmount)}</div>
                  <div className="text-sm text-gray-600 font-semibold">Total Revenue</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-green-600">{stats.overall.successRate}%</div>
                  <div className="text-sm text-gray-600 font-semibold">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-orange-600">{stats.overall.failedTransactions}</div>
                  <div className="text-sm text-gray-600 font-semibold">Failed</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <ArrowUpDown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-purple-600">{formatCurrency(stats.overall.totalFees)}</div>
                  <div className="text-sm text-gray-600 font-semibold">Total Fees</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-6 h-6 text-green-600" />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-blue-600" />
              <select
                value={filters.gateway}
                onChange={(e) => handleFilterChange('gateway', e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
              >
                <option value="all">All Gateways</option>
                {stats?.byGateway?.map(gateway => (
                  <option key={gateway._id} value={gateway._id}>{gateway._id}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-purple-600" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-pink-600" />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all"
              />
            </div>

            <button
              onClick={() => {
                setFilters({
                  status: 'all',
                  gateway: 'all',
                  startDate: '',
                  endDate: '',
                  organization: 'all'
                });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
          <div className="p-6 border-b-2 border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <FileText className="w-7 h-7 text-green-600" />
              Payment Transactions ({pagination.total})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Gateway</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction, idx) => (
                  <motion.tr
                    key={transaction._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedTransaction(expandedTransaction === transaction._id ? null : transaction._id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-bold text-gray-900">{transaction.transactionId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{transaction.userId?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600">{transaction.userId?.email || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-green-600 text-lg">{formatCurrency(transaction.amount)}</div>
                      {transaction.processingFee.totalFee > 0 && (
                        <div className="text-xs text-gray-500">Fee: {formatCurrency(transaction.processingFee.totalFee)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">{transaction.gatewayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-1.5 rounded-xl text-sm font-bold bg-gradient-to-r ${getStatusColor(transaction.status)} text-white`}>
                        {transaction.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(transaction.initiatedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(transaction.initiatedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTransaction(expandedTransaction === transaction._id ? null : transaction._id);
                        }}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5 text-green-600" />
                      </button>
                    </td>
                  </motion.tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-16 h-16 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">No Transactions Found</h3>
                      <p className="text-gray-600">No payment transactions match your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Expanded Details */}
          {expandedTransaction && (
            <div className="border-t-2 border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
              {transactions.find(t => t._id === expandedTransaction) && (() => {
                const transaction = transactions.find(t => t._id === expandedTransaction);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-xl border-2 border-gray-100">
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-green-600" />
                        Transaction Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">Transaction ID:</span>
                          <span className="font-bold text-gray-900">{transaction.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">Description:</span>
                          <span className="font-bold text-gray-900">{transaction.description}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">Amount:</span>
                          <span className="font-black text-green-600 text-lg">{formatCurrency(transaction.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">Net Amount:</span>
                          <span className="font-bold text-gray-900">{formatCurrency(transaction.netAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">Gateway:</span>
                          <span className="font-bold text-gray-900">{transaction.gatewayName}</span>
                        </div>
                        {transaction.organizationId && (
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Organization:</span>
                            <span className="font-bold text-gray-900">{transaction.organizationId.name || 'N/A'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-xl border-2 border-gray-100">
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-600" />
                        User Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">Name:</span>
                          <span className="font-bold text-gray-900">{transaction.userId?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">Email:</span>
                          <span className="font-bold text-gray-900">{transaction.userId?.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">Role:</span>
                          <span className="font-bold text-gray-900">{transaction.userId?.role || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-600">Initiated:</span>
                          <span className="font-bold text-gray-900">
                            {new Date(transaction.initiatedAt).toLocaleString()}
                          </span>
                        </div>
                        {transaction.completedAt && (
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Completed:</span>
                            <span className="font-bold text-gray-900">
                              {new Date(transaction.completedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {transaction.refunds && transaction.refunds.length > 0 && (
                      <div className="md:col-span-2 p-6 bg-white rounded-xl border-2 border-purple-200">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                          <ArrowUpDown className="w-6 h-6 text-purple-600" />
                          Refund History
                        </h3>
                        <div className="space-y-3">
                          {transaction.refunds.map((refund, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                              <div>
                                <div className="font-bold text-gray-900">{refund.refundId}</div>
                                <div className="text-sm text-gray-600">{refund.reason}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-black text-purple-600">{formatCurrency(refund.amount)}</div>
                                <div className="text-sm text-gray-600">{refund.status}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="md:col-span-2 flex gap-4">
                      {transaction.status === 'completed' && transaction.refunds?.every(r => r.status !== 'completed') && (
                        <button
                          onClick={() => handleRefund(transaction._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                        >
                          <ArrowUpDown className="w-5 h-5" />
                          Process Refund
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between p-6 border-t-2 border-gray-200">
              <div className="text-sm font-semibold text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold">
                  {pagination.page} / {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentTracker;

