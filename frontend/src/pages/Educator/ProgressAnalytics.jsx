import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    RefreshCw,
    Users,
    Clock,
    Activity,
    PieChart,
    LineChart,
    Calendar,
    Filter,
    Download,
    Share2,
    Zap,
    Eye,
    Target,
    Award,
    BookOpen,
    Brain,
    Map,
    Flag,
    BarChart3,
    ArrowUp,
    ArrowDown,
    CheckCircle,
    AlertCircle,
    Database,
    Wifi,
    Sparkles,
    Lightbulb,
    Layers,
    Compass,
    GitBranch,
    Milestone,
} from "lucide-react";

const ProgressAnalytics = () => {
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState("week");
    const [viewMode, setViewMode] = useState("overview");
    const [refreshInterval, setRefreshInterval] = useState(30); // seconds
    const [lastUpdated, setLastUpdated] = useState(
        new Date().toLocaleTimeString()
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAIInsights, setShowAIInsights] = useState(false);

    // Sample data
    const [progressData, setProgressData] = useState({
        overallCompletion: 72,
        skillMastery: 68,
        goalAchievement: 84,
        learningPace: "Above Average",
        studentsAtRisk: 5,
        topPerformers: 12,
        skillGaps: 3,
        recentMilestones: 8,
        skillBreakdown: [
            { name: "Financial Literacy", mastery: 78, trend: "up", gap: 22 },
            { name: "Budgeting", mastery: 82, trend: "up", gap: 18 },
            { name: "Saving", mastery: 65, trend: "down", gap: 35 },
            { name: "Investing", mastery: 42, trend: "up", gap: 58 },
            { name: "Credit Management", mastery: 58, trend: "up", gap: 42 },
            { name: "Tax Planning", mastery: 36, trend: "down", gap: 64 },
        ],
        learningCurves: [
            { week: 1, average: 10, advanced: 15, struggling: 5 },
            { week: 2, average: 18, advanced: 25, struggling: 8 },
            { week: 3, average: 25, advanced: 35, struggling: 12 },
            { week: 4, average: 32, advanced: 48, struggling: 15 },
            { week: 5, average: 40, advanced: 60, struggling: 18 },
            { week: 6, average: 45, advanced: 72, struggling: 22 },
        ],
        studentProgress: [
            {
                id: 1,
                name: "Emma Johnson",
                avatar: "https://i.pravatar.cc/150?img=1",
                overallProgress: 87,
                skillLevels: {
                    "Financial Literacy": 92,
                    "Budgeting": 88,
                    "Saving": 85,
                    "Investing": 78,
                    "Credit Management": 90,
                    "Tax Planning": 75,
                },
                learningPace: "Fast",
                recentActivity: "Completed Advanced Investing module",
                lastActive: "2 hours ago",
                goals: [
                    { name: "Master Budgeting", progress: 88, deadline: "Next week" },
                    { name: "Complete Investing Course", progress: 78, deadline: "2 weeks" },
                ],
                trend: "up",
            },
            {
                id: 2,
                name: "Liam Wilson",
                avatar: "https://i.pravatar.cc/150?img=2",
                overallProgress: 65,
                skillLevels: {
                    "Financial Literacy": 70,
                    "Budgeting": 75,
                    "Saving": 68,
                    "Investing": 45,
                    "Credit Management": 60,
                    "Tax Planning": 40,
                },
                learningPace: "Average",
                recentActivity: "Started Credit Management module",
                lastActive: "1 day ago",
                goals: [
                    { name: "Improve Saving Skills", progress: 68, deadline: "3 weeks" },
                    { name: "Begin Tax Planning", progress: 40, deadline: "1 month" },
                ],
                trend: "steady",
            },
            {
                id: 3,
                name: "Olivia Martinez",
                avatar: "https://i.pravatar.cc/150?img=3",
                overallProgress: 42,
                skillLevels: {
                    "Financial Literacy": 55,
                    "Budgeting": 48,
                    "Saving": 40,
                    "Investing": 25,
                    "Credit Management": 35,
                    "Tax Planning": 20,
                },
                learningPace: "Slow",
                recentActivity: "Struggling with Budgeting concepts",
                lastActive: "3 days ago",
                goals: [
                    { name: "Complete Basic Budgeting", progress: 48, deadline: "Overdue" },
                    { name: "Start Saving Module", progress: 40, deadline: "This week" },
                ],
                trend: "down",
            },
        ],
        aiInsights: [
            {
                title: "Learning Pattern Detected",
                description: "Students perform better on financial concepts when practical examples are provided.",
                recommendation: "Increase real-world examples in investing modules.",
                confidence: 92,
                impact: "high",
            },
            {
                title: "Skill Gap Alert",
                description: "25% of students struggle with tax planning fundamentals.",
                recommendation: "Consider creating supplementary materials for tax basics.",
                confidence: 88,
                impact: "medium",
            },
            {
                title: "Goal Achievement Insight",
                description: "Students with explicit weekly goals show 34% higher completion rates.",
                recommendation: "Implement weekly goal-setting prompts for all students.",
                confidence: 95,
                impact: "high",
            },
        ],
    });

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date().toLocaleTimeString());

            // Simulate data fluctuations
            setProgressData((prev) => ({
                ...prev,
                overallCompletion: Math.min(
                    100,
                    prev.overallCompletion + (Math.random() > 0.7 ? 1 : -1)
                ),
                skillMastery: Math.min(
                    100,
                    prev.skillMastery + (Math.random() > 0.6 ? 1 : -1)
                ),
            }));
        }, refreshInterval * 1000);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    const handleRefreshData = () => {
        setLoading(true);
        setTimeout(() => {
            setLastUpdated(new Date().toLocaleTimeString());
            setLoading(false);
        }, 800);
    };

    const handleExportData = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Progress analytics data would be exported");
            setLoading(false);
        }, 800);
    };

    const handleShareReport = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Share progress report dialog would open");
            setLoading(false);
        }, 800);
    };

    const handleGenerateAIInsights = () => {
        setLoading(true);
        setTimeout(() => {
            setShowAIInsights(true);
            setLoading(false);
        }, 1200);
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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                            <span className="text-lg font-semibold text-gray-800">
                                Loading...
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-lime-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
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
                                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                                    Progress Analytics
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg font-medium mt-2">
                                Advanced progress tracking with AI insights
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefreshData}
                                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Refresh</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExportData}
                                className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-gray-100"
                            >
                                <Download className="w-5 h-5" />
                                <span>Export</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShareReport}
                                className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-gray-100"
                            >
                                <Share2 className="w-5 h-5" />
                                <span>Share</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* System Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-semibold text-gray-700">
                                            AI Analytics Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-gray-600">
                                            Auto-refresh: {refreshInterval}s
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm text-gray-600">
                                            {progressData.studentProgress.length} students tracked
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-600">
                                        Last updated: {lastUpdated}
                                    </div>
                                    <select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        className="bg-white/80 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                </motion.div>

                {/* View Mode Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap gap-2 justify-center">
                        {[
                            {
                                id: "overview",
                                label: "Overview",
                                icon: <Eye className="w-4 h-4" />,
                            },
                            {
                                id: "learning-curves",
                                label: "Learning Curves",
                                icon: <LineChart className="w-4 h-4" />,
                            },
                            {
                                id: "skill-mapping",
                                label: "Skill Mapping",
                                icon: <Map className="w-4 h-4" />,
                            },
                            {
                                id: "goal-tracking",
                                label: "Goal Tracking",
                                icon: <Target className="w-4 h-4" />,
                            },
                            {
                                id: "student-progress",
                                label: "Student Progress",
                                icon: <Users className="w-4 h-4" />,
                            },
                            {
                                id: "ai-insights",
                                label: "AI Insights",
                                icon: <Sparkles className="w-4 h-4" />,
                            },
                        ].map((mode) => (
                            <motion.button
                                key={mode.id}
                                onClick={() => setViewMode(mode.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${viewMode === mode.id
                                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                                        : "bg-white/80 text-gray-700 hover:bg-white shadow-md"
                                    }`}
                            >
                                {mode.icon}
                                {mode.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Analytics Dashboard */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Key Metrics */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            Key Progress Metrics
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                {
                                    title: "Overall Completion",
                                    value: `${progressData.overallCompletion}%`,
                                    icon: <CheckCircle className="w-6 h-6 text-white" />,
                                    change: "+3.2%",
                                    trend: "up",
                                    color: "from-emerald-500 to-green-500",
                                },
                                {
                                    title: "Skill Mastery",
                                    value: `${progressData.skillMastery}%`,
                                    icon: <Award className="w-6 h-6 text-white" />,
                                    change: "+1.8%",
                                    trend: "up",
                                    color: "from-blue-500 to-indigo-500",
                                },
                                {
                                    title: "Goal Achievement",
                                    value: `${progressData.goalAchievement}%`,
                                    icon: <Target className="w-6 h-6 text-white" />,
                                    change: "+5.4%",
                                    trend: "up",
                                    color: "from-purple-500 to-violet-500",
                                },
                                {
                                    title: "Learning Pace",
                                    value: progressData.learningPace,
                                    icon: <Activity className="w-6 h-6 text-white" />,
                                    change: "+2.1%",
                                    trend: "up",
                                    color: "from-orange-500 to-amber-500",
                                },
                            ].map((metric, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-gray-500 text-sm font-medium">
                                                    {metric.title}
                                                </p>
                                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                                    {metric.value}
                                                </h3>
                                            </div>
                                            <div
                                                className={`bg-gradient-to-r ${metric.color} p-3 rounded-xl`}
                                            >
                                                {metric.icon}
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            {metric.trend === "up" ? (
                                                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                                            )}
                                            <span
                                                className={`text-sm font-medium ${metric.trend === "up"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {metric.change} from last {dateRange}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Secondary Metrics */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-blue-500" />
                            Progress Indicators
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                {
                                    title: "Students at Risk",
                                    value: progressData.studentsAtRisk,
                                    icon: <AlertCircle className="w-5 h-5" />,
                                    color: "bg-red-100 text-red-600",
                                    action: "View Details",
                                },
                                {
                                    title: "Top Performers",
                                    value: progressData.topPerformers,
                                    icon: <Award className="w-5 h-5" />,
                                    color: "bg-purple-100 text-purple-600",
                                    action: "View Students",
                                },
                                {
                                    title: "Skill Gaps Identified",
                                    value: progressData.skillGaps,
                                    icon: <GitBranch className="w-5 h-5" />,
                                    color: "bg-amber-100 text-amber-600",
                                    action: "View Skills",
                                },
                                {
                                    title: "Recent Milestones",
                                    value: progressData.recentMilestones,
                                    icon: <Milestone className="w-5 h-5" />,
                                    color: "bg-emerald-100 text-emerald-600",
                                    action: "View All",
                                },
                            ].map((metric, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${metric.color}`}>
                                            {metric.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">{metric.title}</p>
                                            <p className="text-2xl font-bold">{metric.value}</p>
                                        </div>
                                    </div>
                                    <button className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                                        {metric.action}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Learning Curves Chart (Placeholder) */}
                    {viewMode === "learning-curves" && (
                        <motion.div variants={itemVariants} className="mb-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <LineChart className="w-5 h-5 text-blue-500" />
                                    Learning Curves Over Time
                                </h3>
                                <div className="h-80 w-full bg-gray-50 rounded-xl flex items-center justify-center">
                                    <p className="text-gray-400 text-center">
                                        [Learning curves chart visualization would appear here]
                                        <br />
                                        <span className="text-sm">
                                            Showing progression of different student groups over {dateRange}
                                        </span>
                                    </p>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    {progressData.learningCurves.map((point, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-gray-500">Week {point.week}</p>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-blue-600">Advanced:</span>
                                                    <span className="text-xs font-medium">{point.advanced}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-green-600">Average:</span>
                                                    <span className="text-xs font-medium">{point.average}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-orange-600">Struggling:</span>
                                                    <span className="text-xs font-medium">{point.struggling}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Skill Mapping (Placeholder) */}
                    {viewMode === "skill-mapping" && (
                        <motion.div variants={itemVariants} className="mb-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Map className="w-5 h-5 text-purple-500" />
                                    Skill Mastery Mapping
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <p className="text-gray-400 text-center">
                                            [Skill heatmap visualization would appear here]
                                            <br />
                                            <span className="text-sm">
                                                Showing mastery levels across different skill domains
                                            </span>
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-700">Skill Breakdown</h4>
                                        {progressData.skillBreakdown.map((skill, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium">{skill.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold">{skill.mastery}%</span>
                                                        {skill.trend === "up" ? (
                                                            <ArrowUp className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <ArrowDown className="w-4 h-4 text-red-500" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2.5 rounded-full"
                                                        style={{ width: `${skill.mastery}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Skill gap: {skill.gap}%
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Goal Tracking (Placeholder) */}
                    {viewMode === "goal-tracking" && (
                        <motion.div variants={itemVariants} className="mb-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-red-500" />
                                    Goal Achievement Tracking
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 h-80 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <p className="text-gray-400 text-center">
                                            [Goal progress visualization would appear here]
                                            <br />
                                            <span className="text-sm">
                                                Showing completion rates and time-to-achievement
                                            </span>
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-700">Top Class Goals</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">Complete Financial Basics</span>
                                                <span className="text-sm font-bold text-emerald-600">92%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-2.5 rounded-full"
                                                    style={{ width: "92%" }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Due: Next week
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">Master Budgeting</span>
                                                <span className="text-sm font-bold text-blue-600">78%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full"
                                                    style={{ width: "78%" }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Due: 2 weeks
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">Investing Fundamentals</span>
                                                <span className="text-sm font-bold text-amber-600">45%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full"
                                                    style={{ width: "45%" }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Due: 1 month
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Student Progress */}
                    {viewMode === "student-progress" && (
                        <motion.div variants={itemVariants} className="mb-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-500" />
                                    Individual Student Progress
                                </h3>
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {progressData.studentProgress.map((student) => (
                                        <motion.div
                                            key={student.id}
                                            whileHover={{ scale: 1.01 }}
                                            className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={student.avatar}
                                                        alt={student.name}
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                    />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">{student.name}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            Last active: {student.lastActive}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-lg font-bold">{student.overallProgress}%</span>
                                                        {student.trend === "up" ? (
                                                            <ArrowUp className="w-4 h-4 text-green-500" />
                                                        ) : student.trend === "down" ? (
                                                            <ArrowDown className="w-4 h-4 text-red-500" />
                                                        ) : (
                                                            <Activity className="w-4 h-4 text-amber-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">Overall Progress</p>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                                    <div
                                                        className={`h-2.5 rounded-full ${student.trend === "up" ? "bg-gradient-to-r from-emerald-500 to-green-500" : student.trend === "down" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-amber-500 to-yellow-500"}`}
                                                        style={{ width: `${student.overallProgress}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500">{student.recentActivity}</p>
                                            </div>
                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                {student.goals.map((goal, idx) => (
                                                    <div key={idx} className="bg-white p-2 rounded-lg text-xs">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium truncate" title={goal.name}>
                                                                {goal.name.length > 15 ? `${goal.name.substring(0, 15)}...` : goal.name}
                                                            </span>
                                                            <span className="font-bold">{goal.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                            <div
                                                                className="bg-blue-500 h-1.5 rounded-full"
                                                                style={{ width: `${goal.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <p className="text-gray-400 mt-1 text-[10px]">
                                                            Due: {goal.deadline}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* AI Insights */}
                    {viewMode === "ai-insights" && (
                        <motion.div variants={itemVariants} className="mb-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-amber-500" />
                                        AI-Powered Progress Insights
                                    </h3>
                                    {!showAIInsights && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleGenerateAIInsights}
                                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                        >
                                            <Lightbulb className="w-5 h-5" />
                                            <span>Generate Insights</span>
                                        </motion.button>
                                    )}
                                </div>

                                {showAIInsights ? (
                                    <div className="space-y-6">
                                        {progressData.aiInsights.map((insight, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.2 }}
                                                className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl text-white">
                                                        <Lightbulb className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                                                            {insight.title}
                                                        </h4>
                                                        <p className="text-gray-600 mb-3">{insight.description}</p>
                                                        <div className="bg-white p-3 rounded-lg border border-amber-100">
                                                            <p className="text-gray-800 font-medium flex items-center gap-2">
                                                                <Compass className="w-4 h-4 text-emerald-500" />
                                                                Recommendation:
                                                            </p>
                                                            <p className="text-gray-600 mt-1">
                                                                {insight.recommendation}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-medium text-gray-500">
                                                                    Confidence:
                                                                </span>
                                                                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                                                    <div
                                                                        className="bg-emerald-500 h-1.5 rounded-full"
                                                                        style={{ width: `${insight.confidence}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-xs font-bold">
                                                                    {insight.confidence}%
                                                                </span>
                                                            </div>
                                                            <span
                                                                className={`text-xs font-medium px-2 py-1 rounded-full ${insight.impact === "high"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : insight.impact === "medium"
                                                                            ? "bg-amber-100 text-amber-700"
                                                                            : "bg-blue-100 text-blue-700"
                                                                    }`}
                                                            >
                                                                {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-60 flex flex-col items-center justify-center text-center">
                                        <Sparkles className="w-12 h-12 text-gray-300 mb-3" />
                                        <p className="text-gray-400 max-w-md">
                                            Click "Generate Insights" to have our AI analyze student progress data and provide actionable recommendations.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Overview Dashboard (Default View) */}
                    {viewMode === "overview" && (
                        <motion.div variants={itemVariants} className="mb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Learning Curves Summary */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <LineChart className="w-5 h-5 text-blue-500" />
                                        Learning Curves
                                    </h3>
                                    <div className="h-40 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                                        <p className="text-gray-400 text-center text-sm">
                                            [Learning curve visualization]
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Advanced Students</span>
                                            <span className="text-sm font-medium">28%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Average Pace</span>
                                            <span className="text-sm font-medium">54%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Needs Support</span>
                                            <span className="text-sm font-medium">18%</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                        View Detailed Analysis
                                    </button>
                                </div>

                                {/* Skill Mapping Summary */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Map className="w-5 h-5 text-purple-500" />
                                        Skill Mapping
                                    </h3>
                                    <div className="h-40 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                                        <p className="text-gray-400 text-center text-sm">
                                            [Skill distribution visualization]
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Highest Mastery</span>
                                            <span className="text-sm font-medium">Budgeting (82%)</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Lowest Mastery</span>
                                            <span className="text-sm font-medium">Tax Planning (36%)</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Improving Fastest</span>
                                            <span className="text-sm font-medium">Investing (+8%)</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
                                        View Skill Details
                                    </button>
                                </div>

                                {/* Goal Tracking Summary */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-red-500" />
                                        Goal Tracking
                                    </h3>
                                    <div className="h-40 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                                        <p className="text-gray-400 text-center text-sm">
                                            [Goal completion visualization]
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">On Track</span>
                                            <span className="text-sm font-medium">68%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">At Risk</span>
                                            <span className="text-sm font-medium">22%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Overdue</span>
                                            <span className="text-sm font-medium">10%</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                                        Manage Goals
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProgressAnalytics;