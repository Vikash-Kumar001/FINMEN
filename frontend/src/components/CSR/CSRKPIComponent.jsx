import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, School, Target, TrendingUp, DollarSign, Award,
  FileText, RefreshCw, Download, BarChart3, PieChart,
  CheckCircle, Clock, Percent, ArrowUp, ArrowDown,
  BookOpen, Brain, Heart, Star, Activity, Calendar
} from 'lucide-react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import csrKPIService from '../../services/csrKPIService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const CSRKPIComponent = ({ filters = {} }) => {
  const [kpiData, setKpiData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Load KPI data
  const loadKPIData = async () => {
    setLoading(true);
    try {
      const response = await csrKPIService.getKPIs(filters);
      setKpiData(response.data);
    } catch (error) {
      console.error('Error loading KPI data:', error);
      toast.error('Failed to load KPI data');
    } finally {
      setLoading(false);
    }
  };

  // Load trends data
  const loadTrendsData = async () => {
    try {
      const response = await csrKPIService.getKPITrends(filters);
      setTrendsData(response.data);
    } catch (error) {
      console.error('Error loading trends data:', error);
    }
  };

  // Refresh KPIs
  const handleRefreshKPIs = async () => {
    setRefreshing(true);
    try {
      await csrKPIService.refreshKPIs(filters);
      await loadKPIData();
      toast.success('KPIs refreshed successfully');
    } catch (error) {
      console.error('Error refreshing KPIs:', error);
      toast.error('Failed to refresh KPIs');
    } finally {
      setRefreshing(false);
    }
  };

  // Export KPIs
  const handleExportKPIs = async (format) => {
    try {
      await csrKPIService.downloadKPIs(format, filters);
      toast.success(`KPIs exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting KPIs:', error);
      toast.error('Failed to export KPIs');
    }
  };

  useEffect(() => {
    loadKPIData();
    loadTrendsData();
  }, [filters]);

  if (loading && !kpiData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No KPI data available</p>
      </div>
    );
  }

  // Chart data configurations
  const campaignCompletionChart = {
    labels: kpiData.campaigns?.map(c => c.campaignName) || [],
    datasets: [{
      data: kpiData.campaigns?.map(c => c.completionRate) || [],
      backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  const budgetBreakdownChart = {
    labels: kpiData.budgetMetrics?.budgetBreakdown?.map(b => b.category) || [],
    datasets: [{
      data: kpiData.budgetMetrics?.budgetBreakdown?.map(b => b.amount) || [],
      backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
      borderWidth: 0
    }]
  };

  const nepCompetenciesChart = {
    labels: kpiData.nepCompetencies?.competenciesByModule?.map(c => c.module) || [],
    datasets: [{
      label: 'NEP Competencies Coverage (%)',
      data: kpiData.nepCompetencies?.competenciesByModule?.map(c => c.coveragePercentage) || [],
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: 'rgba(139, 92, 246, 1)',
      pointBackgroundColor: 'rgba(139, 92, 246, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
    }]
  };

  const monthlySpendingChart = {
    labels: kpiData.budgetMetrics?.monthlySpending?.map(m => m.month) || [],
    datasets: [
      {
        label: 'Rewards',
        data: kpiData.budgetMetrics?.monthlySpending?.map(m => m.rewards) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      {
        label: 'Admin Fees',
        data: kpiData.budgetMetrics?.monthlySpending?.map(m => m.admin) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Operational',
        data: kpiData.budgetMetrics?.monthlySpending?.map(m => m.operational) || [],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* KPI Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">CSR Key Performance Indicators</h2>
          <p className="text-gray-600">Comprehensive metrics for social impact measurement</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefreshKPIs}
            disabled={refreshing}
            className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExportKPIs('csv')}
            className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExportKPIs('json')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <FileText className="w-4 h-4" />
            Export JSON
          </motion.button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Schools & Students Reached */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between mb-4">
            <School className="w-8 h-8 text-blue-500" />
            <div className="text-sm text-blue-600 font-medium">Coverage</div>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {kpiData.schoolsReached?.totalSchools || 0}
          </div>
          <div className="text-gray-600 text-sm">Schools Reached</div>
          <div className="mt-2 text-sm text-gray-500">
            {kpiData.studentsReached?.totalStudents || 0} students
          </div>
        </motion.div>

        {/* Campaign Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-green-500" />
            <div className="text-sm text-green-600 font-medium">Completion</div>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {kpiData.campaigns?.length > 0 ? 
              Math.round(kpiData.campaigns.reduce((sum, c) => sum + c.completionRate, 0) / kpiData.campaigns.length) : 0}%
          </div>
          <div className="text-gray-600 text-sm">Avg Completion Rate</div>
          <div className="mt-2 text-sm text-gray-500">
            {kpiData.campaigns?.length || 0} campaigns
          </div>
        </motion.div>

        {/* Engagement Lift */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div className="text-sm text-purple-600 font-medium flex items-center gap-1">
              {kpiData.engagementMetrics?.engagementLift >= 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              Lift
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {kpiData.engagementMetrics?.engagementLift?.toFixed(1) || 0}%
          </div>
          <div className="text-gray-600 text-sm">Engagement Lift</div>
          <div className="mt-2 text-sm text-gray-500">
            vs baseline
          </div>
        </motion.div>

        {/* Budget Spent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-orange-500" />
            <div className="text-sm text-orange-600 font-medium">Budget</div>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ₹{((kpiData.budgetMetrics?.rewardsSpent || 0) + (kpiData.budgetMetrics?.adminFees || 0) / 100000).toFixed(1)}L
          </div>
          <div className="text-gray-600 text-sm">Total Spent</div>
          <div className="mt-2 text-sm text-gray-500">
            ₹{(kpiData.budgetMetrics?.remainingBudget / 100000 || 0).toFixed(1)}L remaining
          </div>
        </motion.div>

        {/* Certificates & NEP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-red-500" />
            <div className="text-sm text-red-600 font-medium">Impact</div>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {kpiData.certificates?.totalIssued || 0}
          </div>
          <div className="text-gray-600 text-sm">Certificates Issued</div>
          <div className="mt-2 text-sm text-gray-500">
            {kpiData.nepCompetencies?.coveragePercentage?.toFixed(1) || 0}% NEP coverage
          </div>
        </motion.div>
      </div>

      {/* Detailed Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Completion Rates */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Campaign Completion Rates
          </h3>
          <div className="h-64">
            <Doughnut
              data={campaignCompletionChart}
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

        {/* Budget Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
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

        {/* Monthly Spending Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Monthly Spending Trend
          </h3>
          <div className="h-64">
            <Bar
              data={monthlySpendingChart}
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

        {/* NEP Competencies Coverage */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            NEP Competencies Coverage
          </h3>
          <div className="h-64">
            <Radar
              data={nepCompetenciesChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { display: false },
                    grid: { color: 'rgba(0,0,0,0.1)' }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Campaign Details Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Campaign Performance Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Campaign</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Participants</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Completed</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Completion Rate</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kpiData.campaigns?.map((campaign, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{campaign.campaignName}</td>
                  <td className="px-6 py-4">{campaign.totalParticipants}</td>
                  <td className="px-6 py-4">{campaign.completedParticipants}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${campaign.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{campaign.completionRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {campaign.startDate && new Date(campaign.startDate).toLocaleDateString()} - 
                    {campaign.endDate && new Date(campaign.endDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CSRKPIComponent;
