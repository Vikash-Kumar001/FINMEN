import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard,
  Plus, Filter, Download, RefreshCw, Eye, BarChart3,
  PieChart, Calendar, Users, Target, AlertCircle, CheckCircle
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import budgetTransactionService from '../../services/budgetTransactionService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BudgetTransactionComponent = ({ filters = {} }) => {
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [healCoinsBalance, setHealCoinsBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [transactionFilters, setTransactionFilters] = useState({
    page: 1,
    limit: 10,
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  // Load budget summary
  const loadBudgetSummary = async () => {
    setLoading(true);
    try {
      const response = await budgetTransactionService.getBudgetSummary(filters);
      setBudgetSummary(response.data);
    } catch (error) {
      console.error('Error loading budget summary:', error);
      toast.error('Failed to load budget summary');
    } finally {
      setLoading(false);
    }
  };

  // Load transactions
  const loadTransactions = async () => {
    try {
      const response = await budgetTransactionService.getTransactions(transactionFilters);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
    }
  };

  // Load HealCoins balance
  const loadHealCoinsBalance = async () => {
    try {
      const response = await budgetTransactionService.getHealCoinsBalance(filters);
      setHealCoinsBalance(response.data);
    } catch (error) {
      console.error('Error loading HealCoins balance:', error);
    }
  };

  useEffect(() => {
    loadBudgetSummary();
    loadHealCoinsBalance();
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'transactions') {
      loadTransactions();
    }
  }, [activeTab, transactionFilters]);

  // Export transactions
  const handleExportTransactions = async (format) => {
    try {
      await budgetTransactionService.exportTransactions(format, transactionFilters);
      toast.success(`Transactions exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error('Failed to export transactions');
    }
  };

  // Chart data configurations
  const monthlyTrendsChart = budgetSummary?.monthlyTrends ? {
    labels: budgetSummary.monthlyTrends.map(m => `${m.month} ${m.year}`),
    datasets: [
      {
        label: 'Total Spending',
        data: budgetSummary.monthlyTrends.map(m => m.total),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Rewards',
        data: budgetSummary.monthlyTrends.map(m => m.rewards),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  } : null;

  const topCategoriesChart = budgetSummary?.topCategories ? {
    labels: budgetSummary.topCategories.map(c => c._id),
    datasets: [{
      data: budgetSummary.topCategories.map(c => c.totalAmount),
      backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  } : null;

  const budgetBreakdownChart = budgetSummary?.healCoinsSummary ? {
    labels: ['Rewards', 'Admin Fees', 'Operational Costs'],
    datasets: [{
      data: [
        budgetSummary.healCoinsSummary.totalRewards,
        budgetSummary.healCoinsSummary.totalAdminFees,
        budgetSummary.healCoinsSummary.totalOperationalCosts || 0
      ],
      backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6'],
      borderWidth: 0
    }]
  } : null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'healcoins', label: 'HealCoins', icon: Wallet }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Budget & Transactions</h2>
          <p className="text-gray-600">Manage budget, transactions, and HealCoins</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadBudgetSummary()}
            disabled={loading}
            className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExportTransactions('csv')}
            className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 text-green-500" />
                    <div className="text-sm text-green-600 font-medium">Total Funded</div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {budgetSummary?.healCoinsSummary?.totalFunded?.toLocaleString() || 0}
                  </div>
                  <div className="text-gray-600 text-sm">HealCoins</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingDown className="w-8 h-8 text-blue-500" />
                    <div className="text-sm text-blue-600 font-medium">Total Spent</div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {budgetSummary?.healCoinsSummary?.totalSpent?.toLocaleString() || 0}
                  </div>
                  <div className="text-gray-600 text-sm">HealCoins</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-4">
                    <Wallet className="w-8 h-8 text-purple-500" />
                    <div className="text-sm text-purple-600 font-medium">Available</div>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {healCoinsBalance?.availableBalance?.toLocaleString() || 0}
                  </div>
                  <div className="text-gray-600 text-sm">HealCoins</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                    <div className="text-sm text-orange-600 font-medium">Utilization</div>
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {healCoinsBalance?.utilizationRate?.toFixed(1) || 0}%
                  </div>
                  <div className="text-gray-600 text-sm">Rate</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {monthlyTrendsChart && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Monthly Spending Trends
                    </h3>
                    <div className="h-64">
                      <Line
                        data={monthlyTrendsChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'bottom' }
                          },
                          scales: {
                            y: { beginAtZero: true }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {budgetBreakdownChart && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-500" />
                      Budget Breakdown
                    </h3>
                    <div className="h-64">
                      <Doughnut
                        data={budgetBreakdownChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'bottom' }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Top Categories */}
              {topCategoriesChart && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Top Spending Categories
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={topCategoriesChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: { beginAtZero: true }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Transaction Filters */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <select
                    value={transactionFilters.type}
                    onChange={(e) => setTransactionFilters({ ...transactionFilters, type: e.target.value, page: 1 })}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Types</option>
                    <option value="healcoins_funded">HealCoins Funded</option>
                    <option value="healcoins_spent">HealCoins Spent</option>
                    <option value="reward_distribution">Reward Distribution</option>
                    <option value="admin_fee">Admin Fee</option>
                    <option value="operational_cost">Operational Cost</option>
                  </select>

                  <select
                    value={transactionFilters.status}
                    onChange={(e) => setTransactionFilters({ ...transactionFilters, status: e.target.value, page: 1 })}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <input
                    type="date"
                    value={transactionFilters.startDate}
                    onChange={(e) => setTransactionFilters({ ...transactionFilters, startDate: e.target.value, page: 1 })}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Start Date"
                  />

                  <input
                    type="date"
                    value={transactionFilters.endDate}
                    onChange={(e) => setTransactionFilters({ ...transactionFilters, endDate: e.target.value, page: 1 })}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="End Date"
                  />
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Transaction ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">HealCoins</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-mono text-sm">{transaction.transactionId}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {transaction.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold">₹{transaction.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">{transaction.healCoinsAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'healcoins' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Wallet className="w-8 h-8" />
                    <div className="text-sm opacity-90">Total Funded</div>
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {healCoinsBalance?.totalFunded?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm opacity-90">HealCoins</div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingDown className="w-8 h-8" />
                    <div className="text-sm opacity-90">Total Spent</div>
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {healCoinsBalance?.totalSpent?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm opacity-90">HealCoins</div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8" />
                    <div className="text-sm opacity-90">Available</div>
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {healCoinsBalance?.availableBalance?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm opacity-90">HealCoins</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">HealCoins Utilization</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Utilization Rate</span>
                      <span>{healCoinsBalance?.utilizationRate?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${healCoinsBalance?.utilizationRate || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {healCoinsBalance?.totalFunded?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-green-600">Total Funded</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">
                        {healCoinsBalance?.totalSpent?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-red-600">Total Spent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetTransactionComponent;
