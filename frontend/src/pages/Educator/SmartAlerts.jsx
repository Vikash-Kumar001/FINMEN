import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    AlertCircle,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Download,
    RefreshCw,
    Eye,
    Clock,
    Calendar,
    BarChart3,
    PieChart,
    List,
    Grid,
    Settings,
    ChevronDown,
    ChevronRight,
    Star,
    MessageSquare,
    Zap,
    Sparkles,
    Cpu,
    FileText,
    Users,
    Activity,
    TrendingUp,
    TrendingDown,
    Bell,
    Brain,
    Shield,
    ArrowUpRight,
    ArrowDownRight,
    BarChart,
} from "lucide-react";

const SmartAlerts = () => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [showInterventionForm, setShowInterventionForm] = useState(false);
    const [dateRange, setDateRange] = useState("week");
    const [lastUpdated, setLastUpdated] = useState(
        new Date().toLocaleTimeString()
    );

    // Sample data
    const alerts = [
        {
            id: 1,
            title: "Attendance Drop Alert",
            description: "Student has missed 3 consecutive classes",
            type: "attendance",
            severity: "high",
            status: "new",
            student: "Emma Johnson",
            studentId: "S10045",
            grade: "10th",
            createdAt: "2023-10-21",
            predictedRisk: 85,
            trend: "declining",
            metrics: {
                attendance: 65,
                engagement: 48,
                performance: 72
            },
            suggestedActions: ["Schedule meeting", "Contact parents", "Review recent work"],
            tags: ["attendance", "high priority", "intervention needed"],
        },
        {
            id: 2,
            title: "Grade Decline Warning",
            description: "Significant drop in assessment scores over past 2 weeks",
            type: "academic",
            severity: "medium",
            status: "in progress",
            student: "Liam Wilson",
            studentId: "S10062",
            grade: "9th",
            createdAt: "2023-10-20",
            predictedRisk: 68,
            trend: "declining",
            metrics: {
                attendance: 88,
                engagement: 52,
                performance: 61
            },
            suggestedActions: ["Academic support", "Review learning style", "Additional resources"],
            tags: ["academic", "performance", "support needed"],
        },
        {
            id: 3,
            title: "Behavioral Pattern Change",
            description: "Unusual changes in classroom behavior and participation",
            type: "behavioral",
            severity: "medium",
            status: "new",
            student: "Sophia Martinez",
            studentId: "S10078",
            grade: "11th",
            createdAt: "2023-10-21",
            predictedRisk: 72,
            trend: "fluctuating",
            metrics: {
                attendance: 92,
                engagement: 65,
                performance: 78
            },
            suggestedActions: ["Counselor referral", "Classroom adjustments", "Parent conference"],
            tags: ["behavioral", "social", "emotional"],
        },
        {
            id: 4,
            title: "Engagement Decline Alert",
            description: "Significant reduction in class participation and assignment completion",
            type: "engagement",
            severity: "high",
            status: "new",
            student: "Noah Brown",
            studentId: "S10083",
            grade: "10th",
            createdAt: "2023-10-19",
            predictedRisk: 81,
            trend: "declining",
            metrics: {
                attendance: 85,
                engagement: 42,
                performance: 68
            },
            suggestedActions: ["Engagement strategies", "Interest assessment", "Peer collaboration"],
            tags: ["engagement", "motivation", "intervention needed"],
        },
        {
            id: 5,
            title: "Positive Progress Recognition",
            description: "Significant improvement in previously flagged areas",
            type: "positive",
            severity: "low",
            status: "resolved",
            student: "Olivia Davis",
            studentId: "S10091",
            grade: "9th",
            createdAt: "2023-10-18",
            predictedRisk: 25,
            trend: "improving",
            metrics: {
                attendance: 95,
                engagement: 88,
                performance: 92
            },
            suggestedActions: ["Positive reinforcement", "Success celebration", "Continue monitoring"],
            tags: ["positive", "improvement", "success story"],
        },
        {
            id: 6,
            title: "Critical Intervention Required",
            description: "Multiple high-risk indicators across academic and behavioral metrics",
            type: "critical",
            severity: "critical",
            status: "escalated",
            student: "Ethan Taylor",
            studentId: "S10103",
            grade: "11th",
            createdAt: "2023-10-17",
            predictedRisk: 94,
            trend: "critical",
            metrics: {
                attendance: 45,
                engagement: 32,
                performance: 38
            },
            suggestedActions: ["Immediate intervention", "Support team meeting", "Comprehensive plan"],
            tags: ["critical", "multiple concerns", "immediate action"],
        },
    ];

    const interventionTemplates = [
        {
            id: 1,
            title: "Academic Support Plan",
            description: "Structured intervention for academic performance issues",
            type: "academic",
            lastUsed: "2023-10-15",
        },
        {
            id: 2,
            title: "Attendance Improvement Plan",
            description: "Step-by-step process to address attendance concerns",
            type: "attendance",
            lastUsed: "2023-10-18",
        },
        {
            id: 3,
            title: "Behavioral Intervention Strategy",
            description: "Comprehensive approach to address behavioral challenges",
            type: "behavioral",
            lastUsed: "2023-10-10",
        },
    ];

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date().toLocaleTimeString());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleViewAlertDetails = (alert) => {
        setSelectedAlert(alert);
        setShowAlertModal(true);
    };

    const handleCreateIntervention = (alert = null) => {
        setSelectedAlert(alert);
        setShowInterventionForm(true);
    };

    const handleDeleteAlert = (id) => {
        setLoading(true);
        setTimeout(() => {
            // Simulate API call
            console.log(`Deleting alert with ID: ${id}`);
            setLoading(false);
            // In a real app, you would update the state after successful deletion
        }, 800);
    };

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
            alert("Alert data would be exported");
            setLoading(false);
        }, 800);
    };

    const handleGenerateReport = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Alert report would be generated");
            setLoading(false);
        }, 800);
    };

    // Filter alerts based on search term and category
    const filteredAlerts = alerts.filter(
        (alert) =>
            (filterCategory === "all" ||
                (filterCategory === "high" && (alert.severity === "high" || alert.severity === "critical")) ||
                (filterCategory === "medium" && alert.severity === "medium") ||
                (filterCategory === "low" && alert.severity === "low") ||
                (filterCategory === alert.type)) &&
            (alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alert.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alert.tags.some((tag) =>
                    tag.toLowerCase().includes(searchTerm.toLowerCase())
                ))
    );

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
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                            <span className="text-lg font-semibold text-gray-800">
                                Loading...
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-red-200 to-orange-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-amber-200 to-red-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
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
                                <span className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                                    Smart Alerts
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg font-medium mt-2">
                                Intelligent early warning system with ML predictions
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefreshData}
                                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
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
                                onClick={handleGenerateReport}
                                className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-gray-100"
                            >
                                <FileText className="w-5 h-5" />
                                <span>Report</span>
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
                                            System Online
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-red-500" />
                                        <span className="text-sm text-gray-600">
                                            ML Prediction Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-amber-500" />
                                        <span className="text-sm text-gray-600">
                                            Risk Assessment Enabled
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
                                        className="bg-white/80 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search alerts by title, student name, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-red-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCreateIntervention()}
                            className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Plus className="w-6 h-6" />
                            <span className="font-semibold">Create Intervention</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Risk assessment would be created")}
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Activity className="w-6 h-6" />
                            <span className="font-semibold">Risk Assessment</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Batch notifications would be sent")}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Bell className="w-6 h-6" />
                            <span className="font-semibold">Send Notifications</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Alert settings would open")}
                            className="bg-gradient-to-r from-rose-500 to-red-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Settings className="w-6 h-6" />
                            <span className="font-semibold">Alert Settings</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Filter className="w-6 h-6 text-orange-500" />
                            Alert Categories
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-orange-100 text-orange-600" : "bg-white text-gray-400"}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-orange-100 text-orange-600" : "bg-white text-gray-400"}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setFilterCategory("all")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "all" ? "bg-red-500 text-white" : "bg-white text-gray-600"} shadow-md transition-all duration-300`}
                        >
                            All Alerts
                        </button>
                        <button
                            onClick={() => setFilterCategory("high")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "high" ? "bg-red-500 text-white" : "bg-white text-gray-600"} shadow-md transition-all duration-300`}
                        >
                            High Priority
                        </button>
                        <button
                            onClick={() => setFilterCategory("medium")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "medium" ? "bg-red-500 text-white" : "bg-white text-gray-600"} shadow-md transition-all duration-300`}
                        >
                            Medium Priority
                        </button>
                        <button
                            onClick={() => setFilterCategory("low")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "low" ? "bg-red-500 text-white" : "bg-white text-gray-600"} shadow-md transition-all duration-300`}
                        >
                            Low Priority
                        </button>
                        <button
                            onClick={() => setFilterCategory("academic")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "academic" ? "bg-red-500 text-white" : "bg-white text-gray-600"} shadow-md transition-all duration-300`}
                        >
                            Academic
                        </button>
                        <button
                            onClick={() => setFilterCategory("attendance")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "attendance" ? "bg-red-500 text-white" : "bg-white text-gray-600"} shadow-md transition-all duration-300`}
                        >
                            Attendance
                        </button>
                        <button
                            onClick={() => setFilterCategory("behavioral")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "behavioral" ? "bg-red-500 text-white" : "bg-white text-gray-600"} shadow-md transition-all duration-300`}
                        >
                            Behavioral
                        </button>
                        <button
                            onClick={() => setFilterCategory("engagement")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "engagement" ? "bg-red-500 text-white" : "bg-white text-gray-600"} shadow-md transition-all duration-300`}
                        >
                            Engagement
                        </button>
                    </div>

                    {/* Alerts Grid/List View */}
                    {filteredAlerts.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                        >
                            {filteredAlerts.map((alert) => (
                                <motion.div
                                    key={alert.id}
                                    variants={itemVariants}
                                    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden ${viewMode === "list" ? "flex" : ""}`}
                                >
                                    <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${alert.severity === "critical" ? "bg-red-100" : alert.severity === "high" ? "bg-orange-100" : alert.severity === "medium" ? "bg-amber-100" : "bg-green-100"}`}>
                                                    <AlertCircle className={`w-6 h-6 ${alert.severity === "critical" ? "text-red-600" : alert.severity === "high" ? "text-orange-600" : alert.severity === "medium" ? "text-amber-600" : "text-green-600"}`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800">{alert.title}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${alert.severity === "critical" ? "bg-red-100 text-red-600" : alert.severity === "high" ? "bg-orange-100 text-orange-600" : alert.severity === "medium" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
                                                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewAlertDetails(alert)}
                                                    className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAlert(alert.id)}
                                                    className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4">{alert.description}</p>

                                        <div className="flex flex-col gap-3 mb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm font-medium text-gray-700">{alert.student}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{alert.studentId}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-700">Risk Score</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className={`text-sm font-bold ${alert.predictedRisk > 80 ? "text-red-600" : alert.predictedRisk > 60 ? "text-orange-600" : alert.predictedRisk > 40 ? "text-amber-600" : "text-green-600"}`}>
                                                        {alert.predictedRisk}%
                                                    </span>
                                                    {alert.trend === "declining" ? (
                                                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                                                    ) : alert.trend === "improving" ? (
                                                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <BarChart className="w-4 h-4 text-amber-500" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 mt-2">
                                                <div className="bg-gray-50 rounded-lg p-2">
                                                    <div className="text-xs text-gray-500 mb-1">Attendance</div>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-bold ${alert.metrics.attendance > 80 ? "text-green-600" : alert.metrics.attendance > 60 ? "text-amber-600" : "text-red-600"}`}>
                                                            {alert.metrics.attendance}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-2">
                                                    <div className="text-xs text-gray-500 mb-1">Engagement</div>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-bold ${alert.metrics.engagement > 80 ? "text-green-600" : alert.metrics.engagement > 60 ? "text-amber-600" : "text-red-600"}`}>
                                                            {alert.metrics.engagement}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-2">
                                                    <div className="text-xs text-gray-500 mb-1">Performance</div>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-bold ${alert.metrics.performance > 80 ? "text-green-600" : alert.metrics.performance > 60 ? "text-amber-600" : "text-red-600"}`}>
                                                            {alert.metrics.performance}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {alert.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-gray-500">
                                                Created: {alert.createdAt}
                                            </div>
                                            <button
                                                onClick={() => handleCreateIntervention(alert)}
                                                className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                Intervene
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 text-center"
                        >
                            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                No alerts found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                No alerts match your current search and filter criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterCategory("all");
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Reset Filters
                            </button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Intervention Templates */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-amber-500" />
                        Intervention Templates
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {interventionTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-gray-800">{template.title}</h3>
                                    <div className="px-2 py-1 bg-amber-100 text-amber-600 rounded-lg text-xs font-medium">
                                        {template.type}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-500">
                                        Last used: {template.lastUsed}
                                    </div>
                                    <button
                                        onClick={() => alert(`Using template: ${template.title}`)}
                                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        Use Template
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-100 p-6 flex flex-col items-center justify-center text-center"
                        >
                            <Plus className="w-10 h-10 text-amber-500 mb-3" />
                            <h3 className="font-bold text-gray-800 mb-2">Create New Template</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Design a custom intervention template for specific needs
                            </p>
                            <button
                                onClick={() => alert("New template creation would open")}
                                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Create Template
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* AI-Powered Alert Tools */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-red-500" />
                        AI-Powered Alert Tools
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg border border-white/50 p-6"
                        >
                            <div className="bg-red-100 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                <Brain className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Predictive Analytics</h3>
                            <p className="text-gray-600 text-sm">
                                ML algorithms that predict student risk factors before they become problems
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-white/50 p-6"
                        >
                            <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Pattern Recognition</h3>
                            <p className="text-gray-600 text-sm">
                                Identifies concerning patterns in student behavior and performance data
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border border-white/50 p-6"
                        >
                            <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Intervention Suggestions</h3>
                            <p className="text-gray-600 text-sm">
                                AI-generated intervention strategies based on student's specific needs
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-white to-rose-50 rounded-2xl shadow-lg border border-white/50 p-6"
                        >
                            <div className="bg-rose-100 text-rose-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Risk Scoring</h3>
                            <p className="text-gray-600 text-sm">
                                Comprehensive risk assessment with multiple weighted factors and trends
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-center text-gray-500 text-sm"
                >
                    <p>Smart Alerts System • Powered by AI • Early Intervention Platform</p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                            <Shield className="w-4 h-4" /> Privacy Protected
                        </span>
                        <span className="flex items-center gap-1">
                            <Brain className="w-4 h-4" /> ML-Powered
                        </span>
                        <span className="flex items-center gap-1">
                            <Bell className="w-4 h-4" /> Real-time Alerts
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SmartAlerts;