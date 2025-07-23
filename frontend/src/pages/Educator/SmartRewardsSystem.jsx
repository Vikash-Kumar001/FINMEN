import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Gift,
  Star,
  Trophy,
  Medal,
  Zap,
  Plus,
  Search,
  Filter,
  Users,
  UserPlus,
  Download,
  Upload,
  Settings,
  Edit,
  Trash2,
  Copy,
  Save,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Clock,
  BarChart,
  PieChart,
  List,
  Grid,
  Sparkles,
  Lightbulb,
  Cpu,
  RefreshCw,
  Bell,
} from "lucide-react";

const SmartRewardsSystem = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Sample data
  const rewards = [
    {
      id: 1,
      title: "Financial Wizard Badge",
      description: "Awarded for completing all basic financial literacy modules",
      type: "badge",
      category: "achievement",
      pointValue: 50,
      image: "🏆",
      criteria: "Complete all 5 financial literacy modules with 80% or higher",
      autoAward: true,
      createdAt: "2023-10-05",
      awarded: 28,
      tags: ["achievement", "module completion", "financial literacy"],
    },
    {
      id: 2,
      title: "Savings Champion",
      description: "Recognizes consistent saving behavior in simulation",
      type: "badge",
      category: "behavior",
      pointValue: 30,
      image: "💰",
      criteria: "Save virtual money consistently for 4 weeks",
      autoAward: true,
      createdAt: "2023-10-08",
      awarded: 42,
      tags: ["behavior", "savings", "consistency"],
    },
    {
      id: 3,
      title: "Investment Guru",
      description: "For exceptional performance in investment challenges",
      type: "badge",
      category: "achievement",
      pointValue: 75,
      image: "📈",
      criteria: "Achieve 15% ROI in investment simulation",
      autoAward: true,
      createdAt: "2023-10-12",
      awarded: 15,
      tags: ["achievement", "investment", "challenge"],
    },
    {
      id: 4,
      title: "Budget Master",
      description: "Excellence in creating and maintaining budgets",
      type: "badge",
      category: "skill",
      pointValue: 40,
      image: "📊",
      criteria: "Create 3 different budget plans and follow them for 2 weeks",
      autoAward: false,
      createdAt: "2023-10-15",
      awarded: 23,
      tags: ["skill", "budgeting", "planning"],
    },
    {
      id: 5,
      title: "Financial Essay Contest Winner",
      description: "Awarded to winners of the monthly financial essay contest",
      type: "achievement",
      category: "contest",
      pointValue: 100,
      image: "🏅",
      criteria: "Selected by educators as a top essay submission",
      autoAward: false,
      createdAt: "2023-10-18",
      awarded: 3,
      tags: ["contest", "writing", "recognition"],
    },
    {
      id: 6,
      title: "Perfect Attendance",
      description: "Never missed a financial literacy session",
      type: "badge",
      category: "behavior",
      pointValue: 25,
      image: "✅",
      criteria: "Attend all scheduled sessions for a month",
      autoAward: true,
      createdAt: "2023-10-20",
      awarded: 37,
      tags: ["behavior", "attendance", "consistency"],
    },
  ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "achievement", name: "Achievements" },
    { id: "behavior", name: "Behaviors" },
    { id: "skill", name: "Skills" },
    { id: "contest", name: "Contests" },
  ];

  const rewardTypes = [
    { id: "badge", name: "Badge" },
    { id: "certificate", name: "Certificate" },
    { id: "points", name: "Points" },
    { id: "achievement", name: "Achievement" },
    { id: "privilege", name: "Privilege" },
  ];

  const aiRecommendations = [
    {
      id: "rec1",
      title: "Consistency Streak",
      description: "Reward students who log in 5 days in a row",
      reasoning: "Encourages daily engagement with the platform",
      type: "badge",
      suggestedPointValue: 20,
      confidence: 92,
    },
    {
      id: "rec2",
      title: "Peer Helper",
      description: "For students who assist peers in financial challenges",
      reasoning: "Promotes collaboration and knowledge sharing",
      type: "badge",
      suggestedPointValue: 35,
      confidence: 87,
    },
    {
      id: "rec3",
      title: "Comeback Kid",
      description: "For improving performance after initial struggles",
      reasoning: "Motivates persistence and resilience",
      type: "achievement",
      suggestedPointValue: 50,
      confidence: 85,
    },
  ];

  // Filter rewards based on search and category
  const filteredRewards = rewards.filter(
    (reward) =>
      (filterCategory === "all" || reward.category === filterCategory) &&
      (searchTerm === "" ||
        reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Simulate loading notifications
  useEffect(() => {
    const newNotifications = [
      {
        id: 1,
        message: "5 students earned the 'Financial Wizard Badge' today",
        time: "2 hours ago",
        read: false,
      },
      {
        id: 2,
        message: "New AI reward recommendation available",
        time: "5 hours ago",
        read: false,
      },
      {
        id: 3,
        message: "Monthly reward statistics report is ready",
        time: "1 day ago",
        read: true,
      },
    ];
    setNotifications(newNotifications);
  }, []);

  const handleCreateReward = () => {
    setSelectedReward(null);
    setShowRewardModal(true);
  };

  const handleEditReward = (reward) => {
    setSelectedReward(reward);
    setShowRewardModal(true);
  };

  const handleDeleteReward = (id) => {
    if (window.confirm("Are you sure you want to delete this reward?")) {
      // Delete logic would go here
      alert(`Reward ${id} would be deleted`);
    }
  };

  const handleDuplicateReward = (reward) => {
    alert(`Reward "${reward.title}" would be duplicated`);
  };

  const handleSaveReward = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowRewardModal(false);
      setSelectedReward(null);
      alert("Reward saved successfully!");
    }, 800);
  };

  const handleApplyAIRecommendation = (recommendation) => {
    setSelectedReward({
      ...recommendation,
      pointValue: recommendation.suggestedPointValue,
      autoAward: true,
      category: recommendation.type === "badge" ? "achievement" : "behavior",
    });
    setShowRewardModal(true);
    setShowAIRecommendations(false);
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
    hidden: { y: 20, opacity: 0 },
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
              <span className="text-lg font-semibold text-gray-800">
                Loading...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedReward ? "Edit Reward" : "Create New Reward"}
                </h2>
                <button
                  onClick={() => setShowRewardModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Reward Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter reward title"
                      defaultValue={selectedReward?.title || ""}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-32"
                      placeholder="Enter reward description"
                      defaultValue={selectedReward?.description || ""}
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Reward Type
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue={selectedReward?.type || "badge"}
                      >
                        {rewardTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Category
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue={selectedReward?.category || "achievement"}
                      >
                        {categories
                          .filter((cat) => cat.id !== "all")
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Point Value
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. 50"
                        defaultValue={selectedReward?.pointValue || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Emoji/Icon
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. 🏆 or 🌟"
                        defaultValue={selectedReward?.image || ""}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Award Criteria
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-32"
                      placeholder="Describe what students need to do to earn this reward"
                      defaultValue={selectedReward?.criteria || ""}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter tags separated by commas"
                      defaultValue={selectedReward?.tags?.join(", ") || ""}
                    />
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoAward"
                        defaultChecked={selectedReward?.autoAward || false}
                        className="form-checkbox h-5 w-5 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <label
                        htmlFor="autoAward"
                        className="text-gray-700 font-medium"
                      >
                        Auto-award based on criteria
                      </label>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 ml-7">
                      System will automatically award this to students when they
                      meet the criteria
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 mt-4">
                    <div className="flex items-start gap-3">
                      <Cpu className="text-orange-500 w-6 h-6 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-800 mb-1">
                          AI Optimization Suggestions
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Our AI suggests this reward would be more effective
                          with a slightly higher point value (50-75 points) based
                          on student engagement patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowRewardModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReward}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Reward
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Recommendations Modal */}
      {showAIRecommendations && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles className="text-orange-500 w-6 h-6" />
                  AI-Powered Reward Recommendations
                </h2>
                <button
                  onClick={() => setShowAIRecommendations(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-6 border border-orange-100">
                <p className="text-gray-700">
                  Based on your students' activity patterns, learning progress,
                  and engagement metrics, our AI system has generated the
                  following reward recommendations to boost motivation and
                  participation.
                </p>
              </div>

              <div className="space-y-4">
                {aiRecommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg">
                            {recommendation.type === "badge" ? (
                              <Award className="w-6 h-6" />
                            ) : (
                              <Trophy className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {recommendation.title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {recommendation.description}
                            </p>
                          </div>
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {recommendation.confidence}% Match
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="text-amber-500 w-5 h-5 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-800">AI Reasoning</h4>
                            <p className="text-gray-600 text-sm">
                              {recommendation.reasoning}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Suggested Type:</span>{" "}
                            <span className="capitalize">{recommendation.type}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Point Value:</span>{" "}
                            {recommendation.suggestedPointValue} points
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() =>
                            handleApplyAIRecommendation(recommendation)
                          }
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Create This Reward
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <div className="text-gray-500 text-sm">
                Recommendations are updated weekly based on new student data
              </div>
              <button
                onClick={() => setShowAIRecommendations(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-red-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black">
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                  Smart Rewards System
                </span>
              </h1>
              <p className="text-gray-600 text-lg font-medium mt-2">
                AI-powered reward recommendations and management
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateReward}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Reward</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAIRecommendations(true)}
                className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-gray-100"
              >
                <Sparkles className="w-5 h-5 text-orange-500" />
                <span>AI Recommendations</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-gray-100"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </motion.button>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-700 p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </motion.button>
                {notifications.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-orange-50" : ""}`}
                        onClick={() => {
                          setNotifications(
                            notifications.map((n) =>
                              n.id === notification.id ? { ...n, read: true } : n
                            )
                          );
                        }}
                      >
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search rewards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="text-gray-500 w-5 h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-orange-100 text-orange-600" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-orange-100 text-orange-600" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* AI Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-orange-500" />
            AI Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div className="bg-white/20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">New</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Reward Optimization</h3>
                <p className="text-white/80 mb-4">
                  AI analysis suggests increasing badge rewards for collaborative
                  activities to boost peer learning.
                </p>
                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <BarChart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="bg-green-100 rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-green-700">+12%</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Engagement Impact
                </h3>
                <p className="text-gray-600 mb-4">
                  Students with rewards show 12% higher engagement in financial
                  activities.
                </p>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm">
                  <PieChart className="w-4 h-4" />
                  View Analytics
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="bg-amber-100 rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-amber-700">Top 3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Most Effective Rewards
                </h3>
                <p className="text-gray-600 mb-4">
                  Investment Guru, Savings Champion, and Budget Master drive the
                  most engagement.
                </p>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4" />
                  View Rewards
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Auto-Rewards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            Auto-Rewards
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Active Automated Rewards</h3>
                <p className="text-gray-600">
                  These rewards are automatically assigned when students meet the criteria
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh Status
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Reward</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Type</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Points</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Awarded</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Last Awarded</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards
                    .filter((reward) => reward.autoAward)
                    .map((reward) => (
                      <tr key={reward.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{reward.image}</div>
                            <div>
                              <div className="font-medium text-gray-800">{reward.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {reward.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="capitalize">{reward.type}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {reward.pointValue}
                        </td>
                        <td className="py-3 px-4 text-center">{reward.awarded}</td>
                        <td className="py-3 px-4 text-center text-gray-500">
                          Yesterday
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                            Active
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditReward(reward)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateReward(reward)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReward(reward.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Custom Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-500" />
            Custom Badges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards
              .filter((reward) => reward.type === "badge")
              .map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => handleEditReward(badge)}
                >
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                  <div className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="text-5xl">{badge.image}</div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                      {badge.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                      {badge.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-500">{badge.pointValue} points</div>
                      <div className="text-orange-600 font-medium">
                        {badge.awarded} awarded
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

            {/* Add New Badge Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 flex items-center justify-center"
              onClick={handleCreateReward}
            >
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Create New Badge
                </h3>
                <p className="text-gray-500 text-sm">
                  Design a custom badge for your students
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Achievement Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Achievement Tracking
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                {
                  title: "Total Rewards Issued",
                  value: "248",
                  change: "+32",
                  period: "this month",
                  trend: "up",
                  color: "text-green-500",
                },
                {
                  title: "Most Popular Reward",
                  value: "Savings Champion",
                  subValue: "42 awarded",
                  trend: "neutral",
                },
                {
                  title: "Engagement Rate",
                  value: "87%",
                  change: "+5%",
                  period: "vs last month",
                  trend: "up",
                  color: "text-green-500",
                },
              ].map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </span>
                    {stat.change && (
                      <span
                        className={`flex items-center ${stat.color} text-sm font-medium`}
                      >
                        {stat.trend === "up" ? "↑" : "↓"} {stat.change}
                        <span className="text-gray-500 ml-1">{stat.period}</span>
                      </span>
                    )}
                  </div>
                  {stat.subValue && (
                    <div className="text-sm text-gray-500 mt-1">
                      {stat.subValue}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {[
                  {
                    student: "Alex Johnson",
                    reward: "Financial Wizard Badge",
                    time: "2 hours ago",
                    image: "🏆",
                  },
                  {
                    student: "Jamie Smith",
                    reward: "Savings Champion",
                    time: "Yesterday",
                    image: "💰",
                  },
                  {
                    student: "Taylor Brown",
                    reward: "Perfect Attendance",
                    time: "Yesterday",
                    image: "✅",
                  },
                  {
                    student: "Casey Wilson",
                    reward: "Budget Master",
                    time: "2 days ago",
                    image: "📊",
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{achievement.image}</div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {achievement.student}
                        </div>
                        <div className="text-sm text-gray-500">
                          Earned {achievement.reward}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{achievement.time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-orange-500 hover:text-orange-700 font-medium flex items-center gap-1 mx-auto">
                  View All Achievements
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rewards Grid/List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Gift className="w-6 h-6 text-red-500" />
            All Rewards ({filteredRewards.length})
          </h2>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{reward.image}</div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${reward.autoAward ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          {reward.autoAward ? "Auto" : "Manual"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditReward(reward)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateReward(reward)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReward(reward.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{reward.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {reward.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        {reward.pointValue} points
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {reward.awarded} awarded
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Reward</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Category</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Type</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Points</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Auto</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Awarded</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRewards.map((reward) => (
                    <motion.tr
                      key={reward.id}
                      variants={itemVariants}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{reward.image}</div>
                          <div>
                            <div className="font-medium text-gray-800">{reward.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {reward.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 capitalize">
                        {reward.category}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700 capitalize">
                        {reward.type}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {reward.pointValue}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {reward.autoAward ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">{reward.awarded}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditReward(reward)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateReward(reward)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReward(reward.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination (if needed) */}
        {filteredRewards.length > 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center items-center gap-4 mt-6"
          >
            <button className="p-2 text-gray-600 hover:text-orange-600 disabled:text-gray-300 disabled:cursor-not-allowed">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700">Page 1 of 3</span>
            <button className="p-2 text-gray-600 hover:text-orange-600 disabled:text-gray-300 disabled:cursor-not-allowed">
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SmartRewardsSystem;