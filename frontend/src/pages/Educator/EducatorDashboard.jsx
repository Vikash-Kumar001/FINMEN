import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BarChart3,
  BookOpen,
  Gift,
  Award,
  MessageSquare,
  Heart,
  AlertCircle,
  TrendingUp,
  FileText,
  Settings,
  Headphones,
  Plus,
  Bell,
  Download,
  Clock,
  Crown,
  Zap,
  Filter,
  ChevronRight,
  GraduationCap,
  Activity,
  ArrowUp,
  Trophy,
  Star,
  Sparkles,
  Search,
  ChevronDown,
  Calendar,
  PieChart,
  LineChart,
  Map,
  Shield,
  Database,
  Wifi,
  Mail,
  Phone,
} from "lucide-react";

const EducatorDashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("week");
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics((prev) => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString(),
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const featureCards = [
    {
      title: "Student Management",
      icon: <Users className="w-8 h-8" />,
      path: "/educator/students",
      gradient: "from-blue-400 via-indigo-400 to-purple-400",
      description: "Monitor and manage student profiles, progress, and activities",
      category: "management",
      features: ["View student profiles", "Track progress", "Manage groups"],
      action: () => handleNavigate("/educator/students"),
    },
    {
      title: "Real-time Analytics",
      icon: <BarChart3 className="w-8 h-8" />,
      path: "/educator/analytics",
      gradient: "from-green-400 via-emerald-400 to-teal-400",
      description: "Advanced analytics with real-time engagement metrics",
      category: "analytics",
      features: ["Live dashboards", "Custom reports", "Predictive insights"],
      action: () => handleNavigate("/educator/analytics"),
    },
    {
      title: "Curriculum Builder",
      icon: <BookOpen className="w-8 h-8" />,
      path: "/educator/curriculum",
      gradient: "from-orange-400 via-red-400 to-pink-400",
      description: "Create and manage personalized learning paths",
      category: "tools",
      features: ["Lesson planning", "Progress tracking", "Assessment tools"],
      action: () => handleNavigate("/educator/curriculum"),
    },
    {
      title: "Smart Rewards System",
      icon: <Gift className="w-8 h-8" />,
      path: "/educator/rewards",
      gradient: "from-purple-400 via-violet-400 to-indigo-400",
      description: "AI-powered reward recommendations and management",
      category: "rewards",
      features: ["Auto-rewards", "Custom badges", "Achievement tracking"],
      action: () => handleNavigate("/educator/rewards"),
    },
    {
      title: "Assessment Hub",
      icon: <Award className="w-8 h-8" />,
      path: "/educator/assessments",
      gradient: "from-yellow-400 via-orange-400 to-red-400",
      description: "Comprehensive assessment tools and rubrics",
      category: "assessment",
      features: ["Auto-grading", "Rubric builder", "Peer assessments"],
      action: () => handleNavigate("/educator/assessments"),
    },
    {
      title: "Communication Center",
      icon: <MessageSquare className="w-8 h-8" />,
      path: "/educator/communication",
      gradient: "from-pink-400 via-rose-400 to-red-400",
      description: "Multi-channel communication with students and parents",
      category: "communication",
      features: ["Instant messaging", "Video calls", "Announcements"],
      action: () => handleNavigate("/educator/communication"),
    },
    {
      title: "Wellness Monitor",
      icon: <Heart className="w-8 h-8" />,
      path: "/educator/wellness",
      gradient: "from-cyan-400 via-blue-400 to-indigo-400",
      description: "AI-powered mental health and wellness tracking",
      category: "wellness",
      features: ["Mood tracking", "Stress alerts", "Wellness reports"],
      action: () => handleNavigate("/educator/wellness"),
    },
    {
      title: "Smart Alerts",
      icon: <AlertCircle className="w-8 h-8" />,
      path: "/educator/alerts",
      gradient: "from-red-400 via-orange-400 to-yellow-400",
      description: "Intelligent early warning system with ML predictions",
      category: "alerts",
      features: ["Predictive alerts", "Risk assessment", "Intervention plans"],
      action: () => handleNavigate("/educator/alerts"),
    },
    {
      title: "Progress Analytics",
      icon: <TrendingUp className="w-8 h-8" />,
      path: "/educator/progress",
      gradient: "from-emerald-400 via-green-400 to-teal-400",
      description: "Advanced progress tracking with AI insights",
      category: "tracking",
      features: ["Learning curves", "Skill mapping", "Goal tracking"],
      action: () => handleNavigate("/educator/progress"),
    },
    {
      title: "Resource Library",
      icon: <FileText className="w-8 h-8" />,
      path: "/educator/resources",
      gradient: "from-indigo-400 via-blue-400 to-cyan-400",
      description: "Curated educational resources with smart recommendations",
      category: "resources",
      features: ["Smart search", "Collections", "Sharing tools"],
      action: () => handleNavigate("/educator/resources"),
    },
    {
      title: "System Settings",
      icon: <Settings className="w-8 h-8" />,
      path: "/educator/settings",
      gradient: "from-gray-400 via-slate-400 to-zinc-400",
      description: "Advanced configuration and personalization options",
      category: "system",
      features: ["Role management", "Privacy settings", "Integrations"],
      action: () => handleNavigate("/educator/settings"),
    },
    {
      title: "AI Support Assistant",
      icon: <Headphones className="w-8 h-8" />,
      path: "/educator/support",
      gradient: "from-violet-400 via-purple-400 to-indigo-400",
      description: "24/7 AI-powered support with contextual help",
      category: "support",
      features: ["Live chat", "Knowledge base", "Video tutorials"],
      action: () => handleNavigate("/educator/support"),
    },
  ];

  const categories = [
    "all",
    "management",
    "analytics",
    "tools",
    "rewards",
    "assessment",
    "communication",
    "wellness",
    "alerts",
    "tracking",
    "resources",
    "system",
    "support",
  ];

  const quickActions = [
    {
      title: "Create Assignment",
      icon: <Plus className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
      action: () => handleQuickAction("create_assignment"),
    },
    {
      title: "Send Announcement",
      icon: <Bell className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      action: () => handleQuickAction("send_announcement"),
    },
    {
      title: "Generate Report",
      icon: <Download className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      action: () => handleQuickAction("generate_report"),
    },
    {
      title: "Review Alerts",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      action: () => handleQuickAction("review_alerts"),
    },
  ];

  const filteredCards = selectedCategory === "all"
    ? featureCards
    : featureCards.filter((card) => card.category === selectedCategory);

  const searchFilteredCards = searchTerm
    ? filteredCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredCards;

  // Event handlers
  const handleNavigate = (path) => {
    setLoading(true);
    navigate(path);
    setTimeout(() => setLoading(false), 1000); // Simulate loading for UX
  };

  const handleQuickAction = (action) => {
    setLoading(true);
    console.log(`Executing quick action: ${action}`);
    setTimeout(() => {
      setLoading(false);
      switch (action) {
        case "create_assignment":
          alert("Assignment creation modal would open");
          break;
        case "send_announcement":
          alert("Announcement composer would open");
          break;
        case "generate_report":
          alert("Report generation would start");
          break;
        case "review_alerts":
          alert("Alerts review panel would open");
          break;
        default:
          alert(`Action: ${action} executed`);
      }
    }, 800);
  };

  const handleRefreshData = () => {
    setLoading(true);
    console.log("Refreshing dashboard data...");
    setTimeout(() => {
      setLoading(false);
      setAnalytics({
        ...analytics,
        lastUpdated: new Date().toLocaleTimeString(),
      });
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-lg font-semibold text-gray-800">
                Loading...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black flex items-center gap-2">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                    Educator Command Center
                  </span>
                  <span className="text-black">👩‍🏫</span>
                </h1>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefreshData}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Database className="w-5 h-5" />
                <span>Refresh Data</span>
              </motion.button>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
                >
                  <Bell className="w-6 h-6 text-gray-700" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>

          <motion.p
            className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Advanced AI-Powered Education Management Platform ✨
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tools, students, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    System Online
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Secure</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Last updated: {analytics.lastUpdated || "Now"}
                </div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-white/80 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                disabled={loading}
                className={`bg-gradient-to-r ${action.color} p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {action.icon}
                <span className="font-semibold">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Filter className="w-6 h-6 text-purple-500" />
            Advanced Tools & Features
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white shadow-md"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
        >
          {searchFilteredCards.map((card, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -8,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={card.action}
              className="group cursor-pointer relative"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="relative z-10 flex flex-col items-center text-center h-full">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {card.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {card.description}
                  </p>
                  <div className="w-full space-y-2">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {card.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
            <GraduationCap className="w-6 h-6" />
            <span>Powered by AI • Designed for Educators • Built for Success 🚀</span>
            <Heart className="w-6 h-6" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EducatorDashboard;
