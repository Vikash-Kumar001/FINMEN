import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    RefreshCw,
    Users,
    Clock,
    TrendingUp,
    TrendingDown,
    Activity,
    PieChart,
    LineChart,
    Calendar,
    Filter,
    Download,
    Share2,
    Zap,
    Eye,
    MousePointer,
    Clock3,
    Award,
    BookOpen,
    MessageSquare,
    Heart,
    Database,
    Bell,
} from "lucide-react";

const RealTimeAnalytics = () => {
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState("week");
    const [viewMode, setViewMode] = useState("overview");
    const [refreshInterval, setRefreshInterval] = useState(30); // seconds
    const [lastUpdated, setLastUpdated] = useState(
        new Date().toLocaleTimeString()
    );
    const [analyticsData, setAnalyticsData] = useState({
        engagementRate: 78,
        activeStudents: 42,
        averageSessionTime: "18:32",
        completionRate: 84,
        topPerformers: 12,
        strugglingStudents: 5,
        contentEngagement: [
            { name: "Lesson 1", views: 156, completions: 142, rating: 4.8 },
            { name: "Lesson 2", views: 134, completions: 118, rating: 4.6 },
            { name: "Lesson 3", views: 112, completions: 98, rating: 4.7 },
            { name: "Lesson 4", views: 98, completions: 82, rating: 4.5 },
        ],
        realtimeUsers: 28,
        deviceBreakdown: {
            mobile: 45,
            tablet: 15,
            desktop: 40,
        },
        peakHours: [
            { hour: "9 AM", count: 32 },
            { hour: "10 AM", count: 45 },
            { hour: "11 AM", count: 38 },
            { hour: "12 PM", count: 25 },
            { hour: "1 PM", count: 18 },
            { hour: "2 PM", count: 28 },
            { hour: "3 PM", count: 42 },
        ],
    });

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date().toLocaleTimeString());

            // Simulate data fluctuations
            setAnalyticsData((prev) => ({
                ...prev,
                realtimeUsers: Math.floor(Math.random() * 10) + 25,
                engagementRate: Math.min(
                    100,
                    prev.engagementRate + (Math.random() > 0.5 ? 1 : -1)
                ),
                activeStudents: Math.max(
                    1,
                    prev.activeStudents + (Math.random() > 0.7 ? 1 : -1)
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
            alert("Analytics data would be exported");
            setLoading(false);
        }, 800);
    };

    const handleShareReport = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Share report dialog would open");
            setLoading(false);
        }, 800);
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
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black">
                                <span className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
                                    Real-time Analytics
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg font-medium mt-2">
                                Advanced analytics with real-time engagement metrics
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefreshData}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
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
                                            Live Data
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
                                            {analyticsData.realtimeUsers} active users
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
                                        className="bg-white/80 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                id: "engagement",
                                label: "Engagement",
                                icon: <MousePointer className="w-4 h-4" />,
                            },
                            {
                                id: "performance",
                                label: "Performance",
                                icon: <Award className="w-4 h-4" />,
                            },
                            {
                                id: "content",
                                label: "Content",
                                icon: <BookOpen className="w-4 h-4" />,
                            },
                            {
                                id: "time",
                                label: "Time Analysis",
                                icon: <Clock3 className="w-4 h-4" />,
                            },
                            {
                                id: "communication",
                                label: "Communication",
                                icon: <MessageSquare className="w-4 h-4" />,
                            },
                            {
                                id: "wellness",
                                label: "Wellness",
                                icon: <Heart className="w-4 h-4" />,
                            },
                        ].map((mode) => (
                            <motion.button
                                key={mode.id}
                                onClick={() => setViewMode(mode.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${viewMode === mode.id
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
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
                            Key Metrics
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                {
                                    title: "Engagement Rate",
                                    value: `${analyticsData.engagementRate}%`,
                                    icon: <Activity className="w-6 h-6 text-white" />,
                                    change: "+2.4%",
                                    trend: "up",
                                    color: "from-blue-500 to-indigo-500",
                                },
                                {
                                    title: "Active Students",
                                    value: analyticsData.activeStudents,
                                    icon: <Users className="w-6 h-6 text-white" />,
                                    change: "+5",
                                    trend: "up",
                                    color: "from-purple-500 to-violet-500",
                                },
                                {
                                    title: "Avg. Session Time",
                                    value: analyticsData.averageSessionTime,
                                    icon: <Clock className="w-6 h-6 text-white" />,
                                    change: "+1:24",
                                    trend: "up",
                                    color: "from-orange-500 to-amber-500",
                                },
                                {
                                    title: "Completion Rate",
                                    value: `${analyticsData.completionRate}%`,
                                    icon: <Award className="w-6 h-6 text-white" />,
                                    change: "-1.2%",
                                    trend: "down",
                                    color: "from-emerald-500 to-green-500",
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
                                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                            )}
                                            <span
                                                className={`text-sm font-medium ${metric.trend === "up"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {metric.change} since last {dateRange}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Content Engagement */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-indigo-500" />
                            Content Engagement
                        </h2>
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                                                Content
                                            </th>
                                            <th className="text-center py-3 px-4 text-gray-600 font-semibold">
                                                Views
                                            </th>
                                            <th className="text-center py-3 px-4 text-gray-600 font-semibold">
                                                Completions
                                            </th>
                                            <th className="text-center py-3 px-4 text-gray-600 font-semibold">
                                                Rating
                                            </th>
                                            <th className="text-center py-3 px-4 text-gray-600 font-semibold">
                                                Engagement
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analyticsData.contentEngagement.map((content, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4 font-medium text-gray-800">
                                                    {content.name}
                                                </td>
                                                <td className="py-3 px-4 text-center text-gray-700">
                                                    {content.views}
                                                </td>
                                                <td className="py-3 px-4 text-center text-gray-700">
                                                    {content.completions}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-amber-500 font-medium">
                                                            {content.rating}
                                                        </span>
                                                        <span className="text-amber-500 ml-1">★</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div
                                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full"
                                                            style={{
                                                                width: `${(content.completions / content.views) * 100
                                                                    }%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>

                    {/* Peak Hours & Device Breakdown */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                    >
                        {/* Peak Hours */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-orange-500" />
                                Peak Activity Hours
                            </h2>
                            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                                <div className="h-64 flex items-end justify-between gap-2">
                                    {analyticsData.peakHours.map((hour, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div
                                                className="w-12 bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-lg"
                                                style={{ height: `${(hour.count / 50) * 100}%` }}
                                            ></div>
                                            <span className="text-xs font-medium text-gray-600 mt-2">
                                                {hour.hour}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Device Breakdown */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <PieChart className="w-6 h-6 text-purple-500" />
                                Device Breakdown
                            </h2>
                            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                                <div className="flex items-center justify-center h-64">
                                    <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                                        {/* Mobile Segment */}
                                        <div
                                            className="absolute inset-0 bg-purple-500"
                                            style={{
                                                clipPath: `polygon(50% 50%, 50% 0%, ${50 +
                                                    50 *
                                                    Math.cos(
                                                        ((analyticsData.deviceBreakdown.mobile / 100) *
                                                            360 *
                                                            Math.PI) /
                                                        180
                                                    )
                                                    }% ${50 -
                                                    50 *
                                                    Math.sin(
                                                        ((analyticsData.deviceBreakdown.mobile / 100) *
                                                            360 *
                                                            Math.PI) /
                                                        180
                                                    )
                                                    }%, 50% 0%)`,
                                            }}
                                        ></div>
                                        {/* Tablet Segment */}
                                        <div
                                            className="absolute inset-0 bg-indigo-500"
                                            style={{
                                                clipPath: `polygon(50% 50%, ${50 +
                                                    50 *
                                                    Math.cos(
                                                        ((analyticsData.deviceBreakdown.mobile / 100) *
                                                            360 *
                                                            Math.PI) /
                                                        180
                                                    )
                                                    }% ${50 -
                                                    50 *
                                                    Math.sin(
                                                        ((analyticsData.deviceBreakdown.mobile / 100) *
                                                            360 *
                                                            Math.PI) /
                                                        180
                                                    )
                                                    }%, ${50 +
                                                    50 *
                                                    Math.cos(
                                                        (((analyticsData.deviceBreakdown.mobile +
                                                            analyticsData.deviceBreakdown.tablet) /
                                                            100) *
                                                            360 *
                                                            Math.PI) /
                                                        180
                                                    )
                                                    }% ${50 -
                                                    50 *
                                                    Math.sin(
                                                        (((analyticsData.deviceBreakdown.mobile +
                                                            analyticsData.deviceBreakdown.tablet) /
                                                            100) *
                                                            360 *
                                                            Math.PI) /
                                                        180
                                                    )
                                                    }%)`,
                                            }}
                                        ></div>
                                        {/* Desktop Segment */}
                                        <div
                                            className="absolute inset-0 bg-blue-500"
                                            style={{
                                                clipPath: `polygon(50% 50%, ${50 +
                                                    50 *
                                                    Math.cos(
                                                        (((analyticsData.deviceBreakdown.mobile +
                                                            analyticsData.deviceBreakdown.tablet) /
                                                            100) *
                                                            360 *
                                                            Math.PI) /
                                                        180
                                                    )
                                                    }% ${50 -
                                                    50 *
                                                    Math.sin(
                                                        (((analyticsData.deviceBreakdown.mobile +
                                                            analyticsData.deviceBreakdown.tablet) /
                                                            100) *
                                                            360 *
                                                            Math.PI) /
                                                        180
                                                    )
                                                    }%, 50% 0%)`,
                                            }}
                                        ></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                                <span className="text-lg font-bold text-gray-800">
                                                    {analyticsData.realtimeUsers}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-6 mt-4">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-gray-600">
                                            Mobile ({analyticsData.deviceBreakdown.mobile}%)
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-gray-600">
                                            Tablet ({analyticsData.deviceBreakdown.tablet}%)
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-gray-600">
                                            Desktop ({analyticsData.deviceBreakdown.desktop}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Refresh Interval Settings */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-indigo-500" />
                                Data Refresh Settings
                            </h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="text-gray-600">Auto-refresh interval:</div>
                                <div className="flex gap-2">
                                    {[5, 15, 30, 60].map((seconds) => (
                                        <button
                                            key={seconds}
                                            onClick={() => setRefreshInterval(seconds)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium ${refreshInterval === seconds
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            {seconds}s
                                        </button>
                                    ))}
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                        Receive alerts for significant changes
                                    </span>
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                        <input
                                            type="checkbox"
                                            name="toggle"
                                            id="alert-toggle"
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                        />
                                        <label
                                            htmlFor="alert-toggle"
                                            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                        ></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-10"
                >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <BarChart3 className="w-6 h-6" />
                        <span>
                            Real-time Analytics • Data-Driven Decisions • Better Outcomes 📊
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RealTimeAnalytics;
