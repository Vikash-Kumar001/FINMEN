import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Heart, TrendingUp, MapPin, Calendar, Download,
  Share2, Mail, BarChart3, PieChart, Globe, Award,
  Target, Zap, FileText, Filter, Eye, Star, Gift,
  BookOpen, Brain, DollarSign, Activity, Clock,
  CheckCircle, ArrowUp, ArrowDown, Percent
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

const CSRDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);

  // Enhanced impact data
  const [impactData] = useState({
    studentsImpacted: 25420,
    itemsDistributed: 18750,
    totalValueFunded: 4850000,
    schoolsReached: 345,
    monthlyGrowth: 22.5,
    regionsActive: 15,
    discountsFunded: 1250000,
    avgDiscountPerStudent: 190
  });

  // Module-wise impact with detailed metrics
  const [moduleProgress] = useState({
    finance: { 
      progress: 78, 
      students: 18500, 
      completion: 85,
      improvementMetrics: {
        savingHabits: 82, // % improved saving habits
        budgetingSkills: 76,
        investmentAwareness: 68
      },
      topAchievements: ['Budget Master', 'Savings Champion', 'Investment Explorer']
    },
    mental: { 
      progress: 82, 
      students: 21200, 
      completion: 90,
      improvementMetrics: {
        wellnessScores: 88, // % improved wellness scores
        stressManagement: 79,
        emotionalIntelligence: 85
      },
      topAchievements: ['Mindfulness Master', 'Stress Buster', 'Emotion Expert']
    },
    values: { 
      progress: 65, 
      students: 16800, 
      completion: 75,
      improvementMetrics: {
        honestyScores: 89, // % improved honesty/ethical scores
        empathyLevels: 83,
        responsibilityIndex: 77
      },
      topAchievements: ['Honesty Hero', 'Empathy Expert', 'Responsibility Champion']
    },
    ai: { 
      progress: 58, 
      students: 14900, 
      completion: 70,
      improvementMetrics: {
        codingSkills: 72, // % started coding/skill exercises
        problemSolving: 81,
        logicalThinking: 75
      },
      topAchievements: ['Code Explorer', 'Logic Master', 'Problem Solver']
    }
  });

  // Regional data with detailed breakdown
  const [regionalData] = useState([
    { 
      region: 'Maharashtra', 
      students: 4200, 
      schools: 65, 
      impact: 95,
      itemsDistributed: 3200,
      valueFunded: 850000,
      topCategories: ['Stationery', 'Uniforms', 'Food']
    },
    { 
      region: 'Karnataka', 
      students: 3800, 
      schools: 58, 
      impact: 92,
      itemsDistributed: 2900,
      valueFunded: 720000,
      topCategories: ['Uniforms', 'Stationery', 'Food']
    },
    { 
      region: 'Tamil Nadu', 
      students: 3500, 
      schools: 52, 
      impact: 89,
      itemsDistributed: 2650,
      valueFunded: 680000,
      topCategories: ['Food', 'Stationery', 'Uniforms']
    },
    { 
      region: 'Delhi NCR', 
      students: 3200, 
      schools: 48, 
      impact: 87,
      itemsDistributed: 2400,
      valueFunded: 620000,
      topCategories: ['Stationery', 'Food', 'Uniforms']
    },
    { 
      region: 'Gujarat', 
      students: 2900, 
      schools: 42, 
      impact: 85,
      itemsDistributed: 2200,
      valueFunded: 580000,
      topCategories: ['Uniforms', 'Food', 'Stationery']
    }
  ]);

  // Chart configurations
  const impactTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Students Impacted',
        data: [15500, 17200, 19800, 21200, 23100, 25420],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Items Distributed',
        data: [8200, 10100, 12200, 14100, 16800, 18750],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Value Funded (₹ in lakhs)',
        data: [25, 32, 38, 42, 46, 48.5],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const moduleDistribution = {
    labels: ['Finance', 'Mental Wellness', 'Values', 'AI Skills'],
    datasets: [{
      data: [78, 82, 65, 58],
      backgroundColor: ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  const regionalImpactData = {
    labels: regionalData.map(r => r.region),
    datasets: [{
      label: 'Students Reached',
      data: regionalData.map(r => r.students),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2
    }]
  };

  const skillsRadarData = {
    labels: ['Problem Solving', 'Financial Literacy', 'Emotional Intelligence', 'Critical Thinking', 'Communication', 'Leadership'],
    datasets: [{
      label: 'Skill Development (%)',
      data: [85, 78, 82, 75, 80, 70],
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: 'rgba(139, 92, 246, 1)',
      pointBackgroundColor: 'rgba(139, 92, 246, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
    }]
  };

  const handleExportReport = (format) => {
    setLoading(true);
    setTimeout(() => {
      toast.success(`Impact report exported as ${format.toUpperCase()}`, {
        duration: 3000,
        icon: '📊'
      });
      setLoading(false);
    }, 1500);
  };

  const handleShareReport = () => {
    toast.success('Report shared with partners via email', {
      duration: 3000,
      icon: '📤'
    });
  };

  const handleScheduleReport = () => {
    toast.success('Monthly auto-reports scheduled successfully', {
      duration: 3000,
      icon: '📅'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CSR Impact Dashboard
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Measuring social impact of wellness and financial literacy initiatives
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExportReport('pdf')}
                disabled={loading}
                className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExportReport('excel')}
                disabled={loading}
                className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShareReport}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share Report
              </motion.button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 bg-white p-4 rounded-2xl shadow-md">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Regions</option>
              {regionalData.map(region => (
                <option key={region.region} value={region.region}>{region.region}</option>
              ))}
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </motion.div>

        {/* Impact Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-green-500" />
              <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                +{impactData.monthlyGrowth}%
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {impactData.studentsImpacted.toLocaleString()}
            </div>
            <div className="text-gray-600">Students Benefitted</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <Gift className="w-8 h-8 text-blue-500" />
              <div className="text-sm text-blue-600 font-medium">This Month</div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {impactData.itemsDistributed.toLocaleString()}
            </div>
            <div className="text-gray-600">Items Distributed</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-purple-500" />
              <div className="text-sm text-purple-600 font-medium">Total Impact</div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ₹{(impactData.totalValueFunded / 100000).toFixed(1)}L
            </div>
            <div className="text-gray-600">Value Funded</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-orange-500" />
              <div className="text-sm text-orange-600 font-medium">Nationwide</div>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {impactData.schoolsReached}
            </div>
            <div className="text-gray-600">Schools Reached</div>
          </div>
        </motion.div>

        {/* Module-wise Impact with Detailed Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Enhanced Module Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Module-wise Impact Analysis
            </h3>
            <div className="space-y-6">
              {Object.entries(moduleProgress).map(([module, data]) => (
                <div key={module} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {module === 'finance' && <DollarSign className="w-4 h-4 text-green-500" />}
                      {module === 'mental' && <Heart className="w-4 h-4 text-purple-500" />}
                      {module === 'values' && <Star className="w-4 h-4 text-yellow-500" />}
                      {module === 'ai' && <Brain className="w-4 h-4 text-red-500" />}
                      <span className="font-medium capitalize">
                        {module === 'mental' ? 'Mental Wellness' : module}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{data.progress}%</div>
                      <div className="text-xs text-gray-500">{data.students.toLocaleString()} students</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.progress}%` }}
                      transition={{ duration: 1, delay: 0.1 }}
                      className={`h-2 rounded-full ${
                        module === 'finance' ? 'bg-green-500' :
                        module === 'mental' ? 'bg-purple-500' :
                        module === 'values' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                  
                  {/* Improvement Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(data.improvementMetrics).map(([metric, value]) => (
                      <div key={metric} className="bg-gray-50 p-2 rounded text-center">
                        <div className="font-bold">{value}%</div>
                        <div className="text-gray-600 capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    Completion Rate: {data.completion}% | Top: {data.topAchievements.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Development Radar */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Overall Skills Development
            </h3>
            <div className="h-64">
              <Radar
                data={skillsRadarData}
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
        </motion.div>

        {/* Visual Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Impact Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Impact Trend Analysis
            </h3>
            <div className="h-64">
              <Line
                data={impactTrendData}
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

          {/* Regional Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Regional Impact Distribution
            </h3>
            <div className="h-64">
              <Bar
                data={regionalImpactData}
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
        </motion.div>

        {/* Enhanced Regional Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Detailed Regional Impact Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Region/State</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Students</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Schools</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Items Distributed</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Value Funded</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Impact Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Top Categories</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {regionalData.map((region, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{region.region}</td>
                    <td className="px-6 py-4">{region.students.toLocaleString()}</td>
                    <td className="px-6 py-4">{region.schools}</td>
                    <td className="px-6 py-4">{region.itemsDistributed.toLocaleString()}</td>
                    <td className="px-6 py-4">₹{(region.valueFunded / 100000).toFixed(1)}L</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${region.impact}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{region.impact}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {region.topCategories.map((category, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Auto-Email Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Automated Reporting & Sharing
            </h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScheduleReport}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-200 transition-colors"
              >
                Configure Schedule
              </motion.button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Weekly Impact Reports</span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Comprehensive weekly impact summary with key metrics and achievements
              </p>
              <div className="text-xs text-green-600 mb-2">
                Next: Monday, Jan 13, 2025
              </div>
              <div className="text-xs text-gray-600">
                Recipients: Partners, Sponsors, Board Members
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Monthly Detailed Analytics</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                In-depth monthly progress reports with regional breakdowns and trends
              </p>
              <div className="text-xs text-blue-600 mb-2">
                Next: Feb 1, 2025
              </div>
              <div className="text-xs text-gray-600">
                Recipients: CSR Teams, Management, Auditors
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Quarterly Impact Stories</span>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                Success stories, case studies, and comprehensive impact assessment
              </p>
              <div className="text-xs text-purple-600 mb-2">
                Next: Apr 1, 2025
              </div>
              <div className="text-xs text-gray-600">
                Recipients: Media, Stakeholders, Public Reports
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-4">Export & Sharing Options</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExportReport('pdf')}
                className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <FileText className="w-4 h-4 mx-auto mb-1" />
                PDF Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExportReport('excel')}
                className="p-3 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
              >
                <BarChart3 className="w-4 h-4 mx-auto mb-1" />
                Excel Data
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExportReport('powerpoint')}
                className="p-3 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
              >
                <Eye className="w-4 h-4 mx-auto mb-1" />
                Presentation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShareReport}
                className="p-3 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <Share2 className="w-4 h-4 mx-auto mb-1" />
                Share Now
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-lg font-semibold text-gray-800">Generating Report...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CSRDashboard;