import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, TrendingUp, Coins, Gift, Crown, Calendar,
  BarChart3, PieChart, Award, Target,
  Bell, Settings, Download, Share2, Heart,
  Brain, DollarSign, Clock, Star, Zap,
  BookOpen, Gamepad2, Trophy, Shield,
  CreditCard, Smartphone, Mail, CheckCircle
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  const [childData, setChildData] = useState(null);
  const [loadingChild, setLoadingChild] = useState(true);

  // Fetch child data on component mount
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const response = await fetch('/api/parent/child', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('finmen_token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setChildData(data);
        } else {
          toast.error('Failed to load child data');
        }
      } catch (error) {
        console.error('Error fetching child data:', error);
        toast.error('Error loading child data');
      } finally {
        setLoadingChild(false);
      }
    };

    fetchChildData();
  }, []);

  // Mock child data structure for when API data is not available
  const [mockChildData] = useState([{
      id: 1,
      name: "Child User",
      age: 12,
      avatar: "👦",
      level: 8,
      totalCoins: 2450,
      currentStreak: 15,
      digitalTwin: {
        finance: { 
          level: 6, 
          progress: 75, 
          weeklyGrowth: 12,
          skillsLearned: ['Budgeting', 'Saving', 'Investment Basics'],
          gamesCompleted: 25,
          timeSpent: 180 // minutes
        },
        mentalWellness: { 
          level: 7, 
          progress: 85, 
          weeklyGrowth: 8,
          skillsLearned: ['Stress Management', 'Mindfulness', 'Emotional Intelligence'],
          gamesCompleted: 30,
          timeSpent: 150
        },
        values: { 
          level: 5, 
          progress: 60, 
          weeklyGrowth: 15,
          skillsLearned: ['Honesty', 'Responsibility', 'Empathy'],
          gamesCompleted: 18,
          timeSpent: 120
        },
        ai: { 
          level: 4, 
          progress: 45, 
          weeklyGrowth: 20,
          skillsLearned: ['Basic Coding', 'Problem Solving', 'Logic'],
          gamesCompleted: 12,
          timeSpent: 90
        }
      },
      progressReport: {
        coinsEarnedWeekly: 340,
        coinsEarnedMonthly: 1200,
        gamesCompletedByPillar: {
          finance: 25,
          mentalWellness: 30,
          values: 18,
          ai: 12
        },
        timeSpentByModule: {
          finance: 180,
          mentalWellness: 150,
          values: 120,
          ai: 90
        },
        strengths: ["Problem Solving", "Financial Planning", "Emotional Intelligence"],
        needsSupport: ["Time Management", "Advanced Coding", "Leadership Skills"]
      },
      walletSummary: {
        itemsRedeemed: [
          { item: "School Shoes", coins: 1200, value: 800, date: "2025-01-05" },
          { item: "Notebook Set", coins: 500, value: 250, date: "2025-01-03" },
          { item: "Art Supplies", coins: 700, value: 350, date: "2024-12-28" }
        ],
        totalValueSaved: 450, // Total savings this month
        monthlySpending: 2400
      },
      recentActivity: [
        { type: "game", title: "Budget Hero", coins: 50, time: "2 hours ago", pillar: "finance" },
        { type: "quiz", title: "Savings Challenge", coins: 30, time: "1 day ago", pillar: "finance" },
        { type: "mood", title: "Daily Check-in", coins: 10, time: "1 day ago", pillar: "mentalWellness" },
        { type: "values", title: "Honesty Quest", coins: 25, time: "2 days ago", pillar: "values" }
      ]
    }]
  );

  // Subscription data
  const [subscriptionData] = useState({
    currentPlan: "Premium Family",
    status: "Active",
    nextBilling: "2025-02-15",
    monthlyPrice: 499,
    features: [
      "Unlimited Access to All Games",
      "Detailed Progress Reports", 
      "Priority Customer Support",
      "Advanced Analytics",
      "Parent-Child Communication Tools"
    ],
    upgradeOptions: [
      {
        name: "Premium Plus",
        price: 799,
        additionalFeatures: ["1-on-1 Counseling Sessions", "Custom Learning Paths", "Advanced AI Tutoring"]
      }
    ]
  });

  // Notifications data
  const [notifications] = useState([
    {
      id: 1,
      type: "achievement",
      title: "Game Completed!",
      message: "Arjun completed 100 Finance games and earned the 'Money Master' badge",
      time: "2 hours ago",
      icon: "🏆"
    },
    {
      id: 2,
      type: "redemption",
      title: "Voucher Redeemed",
      message: "Successfully redeemed School Shoes voucher for 1200 HealCoins",
      time: "1 day ago",
      icon: "🎁"
    },
    {
      id: 3,
      type: "milestone",
      title: "Level Up!",
      message: "Arjun reached Level 8 in overall progress",
      time: "3 days ago",
      icon: "⭐"
    },
    {
      id: 4,
      type: "weekly_report",
      title: "Weekly Report Ready",
      message: "Your child's weekly progress report is now available",
      time: "1 week ago",
      icon: "📊"
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const currentChild = childData || (mockChildData && mockChildData[0]) || null;

  // Show loading state if no child data is available
  if (loadingChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading child data...</p>
        </div>
      </div>
    );
  }

  // Show error state if no child data is available
  if (!currentChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👶</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Child Data Available</h2>
          <p className="text-gray-600">Please link your child's account or contact support.</p>
        </div>
      </div>
    );
  }

  // Enhanced chart configurations
  const growthChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Finance',
        data: [65, 70, 72, 75],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Mental Wellness',
        data: [70, 75, 80, 85],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Values',
        data: [50, 55, 58, 60],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'AI Skills',
        data: [30, 35, 40, 45],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const skillsDistribution = {
    labels: ['Finance', 'Mental Wellness', 'Values', 'AI Skills'],
    datasets: [{
      data: [75, 85, 60, 45],
      backgroundColor: ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  const handleUpgrade = () => {
    toast.success('Redirecting to upgrade page...', {
      duration: 3000,
      icon: '🚀'
    });
  };

  const handleExportReport = () => {
    toast.success('Generating detailed report...', {
      duration: 3000,
      icon: '📊'
    });
  };

  const handleShareReport = () => {
    toast.success('Report shared successfully!', {
      duration: 3000,
      icon: '📤'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Parent Dashboard
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Track your child's growth, justify reward usage, and build trust
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportReport}
                className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Export Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShareReport}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </motion.button>
            </div>
          </div>

          {/* Child Info Display */}
          {loadingChild ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading child data...</span>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{currentChild?.avatar || '👶'}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{currentChild?.name || 'Child'}</h2>
                  <div className="text-gray-600">Level {currentChild?.level || 0} • {currentChild?.currentStreak || 0} day streak</div>
                  {childData?.parentLinked && (
                    <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle className="w-4 h-4" />
                      Linked to your account
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Child Growth & Digital Twin Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Growth Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Digital Twin Growth
              </h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <div className="h-64">
              <Line
                data={growthChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  },
                  scales: {
                    y: { beginAtZero: true, max: 100 }
                  }
                }}
              />
            </div>
          </div>

          {/* Skills Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Skills Distribution
            </h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut
                data={skillsDistribution}
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
        </motion.div>

        {/* Digital Twin Progress Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {currentChild?.digitalTwin && Object.entries(currentChild.digitalTwin).map(([skill, data], index) => (
            <div key={skill} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {skill === 'finance' && <DollarSign className="w-5 h-5 text-green-500" />}
                  {skill === 'mentalWellness' && <Heart className="w-5 h-5 text-purple-500" />}
                  {skill === 'values' && <Star className="w-5 h-5 text-yellow-500" />}
                  {skill === 'ai' && <Brain className="w-5 h-5 text-red-500" />}
                  <h4 className="font-semibold capitalize">{skill.replace('mentalWellness', 'Mental Wellness')}</h4>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  +{data.weeklyGrowth}%
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Level {data.level}</span>
                  <span>{data.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-2 rounded-full ${
                      skill === 'finance' ? 'bg-green-500' :
                      skill === 'mentalWellness' ? 'bg-purple-500' :
                      skill === 'values' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-600">
                  Games: {data.gamesCompleted} | Time: {data.timeSpent}min
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.skillsLearned.slice(0, 2).map((skill, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Progress Report & Wallet Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Enhanced Progress Report */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Detailed Progress Report
            </h3>
            
            {/* Coins Earned */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Coins className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{currentChild?.progressReport?.coinsEarnedWeekly || 0}</div>
                <div className="text-sm text-gray-600">Weekly Coins</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Coins className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{currentChild?.progressReport?.coinsEarnedMonthly || 0}</div>
                <div className="text-sm text-gray-600">Monthly Coins</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {currentChild?.progressReport?.timeSpentByModule ? Object.values(currentChild.progressReport.timeSpentByModule).reduce((a, b) => a + b, 0) : 0}m
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <Target className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{currentChild?.currentStreak || 0}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>

            {/* Games Completed by Pillar */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Games Completed per Pillar</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentChild?.progressReport?.gamesCompletedByPillar && Object.entries(currentChild.progressReport.gamesCompletedByPillar).map(([pillar, count]) => (
                  <div key={pillar} className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="font-bold text-lg">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{pillar.replace('mentalWellness', 'Mental')}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Strengths & Needs Support */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Strengths
                </h4>
                <div className="space-y-2">
                  {currentChild?.progressReport?.strengths?.map((strength, index) => (
                    <div key={index} className="bg-green-50 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Needs Support
                </h4>
                <div className="space-y-2">
                  {currentChild?.progressReport?.needsSupport?.map((need, index) => (
                    <div key={index} className="bg-orange-50 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      {need}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Wallet & Rewards Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-500" />
              Wallet & Rewards
            </h3>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {currentChild?.totalCoins || 0}
              </div>
              <div className="text-gray-600">Current HealCoins</div>
            </div>
            
            {/* Items Redeemed */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Recent Redemptions</h4>
              <div className="space-y-3">
                {currentChild?.walletSummary?.itemsRedeemed?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{item.item}</div>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-600 font-semibold text-sm">-{item.coins} coins</div>
                      <div className="text-green-600 text-xs">₹{item.value} value</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Saved */}
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{currentChild?.walletSummary?.totalValueSaved || 0}</div>
                <div className="text-sm text-green-700">Total Value Saved This Month</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription & Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Enhanced Subscription & Upgrades */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Subscription & Upgrades
            </h3>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{subscriptionData.currentPlan}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {subscriptionData.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Next billing: {subscriptionData.nextBilling} • ₹{subscriptionData.monthlyPrice}/month
              </div>
              <div className="space-y-1">
                {subscriptionData.features.map((feature, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Upgrade Option */}
            <div className="border-2 border-dashed border-purple-300 p-4 rounded-xl mb-4">
              <div className="text-center">
                <h4 className="font-semibold text-purple-600 mb-2">Upgrade to Premium Plus</h4>
                <div className="text-2xl font-bold text-purple-600 mb-2">₹{subscriptionData.upgradeOptions[0].price}/month</div>
                <div className="text-sm text-gray-600 mb-3">
                  Get {subscriptionData.upgradeOptions[0].additionalFeatures.join(', ')}
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold"
            >
              One-Click Upgrade
            </motion.button>
          </div>

          {/* Enhanced Notifications */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Recent Notifications
            </h3>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
                  notification.type === 'achievement' ? 'bg-yellow-50 border-yellow-500' :
                  notification.type === 'redemption' ? 'bg-green-50 border-green-500' :
                  notification.type === 'milestone' ? 'bg-purple-50 border-purple-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="text-lg">{notification.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{notification.title}</div>
                      <div className="text-xs text-gray-600 mb-1">{notification.message}</div>
                      <div className={`text-xs font-medium ${
                        notification.type === 'achievement' ? 'text-yellow-600' :
                        notification.type === 'redemption' ? 'text-green-600' :
                        notification.type === 'milestone' ? 'text-purple-600' :
                        'text-blue-600'
                      }`}>
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Notification Settings */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentDashboard;