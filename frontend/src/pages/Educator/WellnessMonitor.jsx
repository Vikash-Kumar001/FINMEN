import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Heart,
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
    AlertCircle,
    FileText,
    Users,
    Activity,
    Smile,
    Frown,
    Meh,
    TrendingUp,
    TrendingDown,
    Bell,
    Brain,
    Shield,
} from "lucide-react";

const WellnessMonitor = () => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showInterventionForm, setShowInterventionForm] = useState(false);
    const [dateRange, setDateRange] = useState("week");
    const [lastUpdated, setLastUpdated] = useState(
        new Date().toLocaleTimeString()
    );

    // Sample data
    const students = [
        {
            id: 1,
            name: "Emma Johnson",
            avatar: "https://i.pravatar.cc/150?img=1",
            grade: "10th",
            moodTrend: "stable",
            stressLevel: "low",
            moodScore: 4.2,
            lastMood: "😊",
            moodHistory: [4, 4, 5, 4, 3, 4, 4],
            journalEntries: 12,
            interventions: 0,
            lastActive: "2023-10-21",
            wellnessFlags: [],
            tags: ["consistent", "positive", "engaged"],
        },
        {
            id: 2,
            name: "Liam Wilson",
            avatar: "https://i.pravatar.cc/150?img=2",
            grade: "9th",
            moodTrend: "declining",
            stressLevel: "high",
            moodScore: 2.8,
            lastMood: "😢",
            moodHistory: [4, 3, 3, 2, 2, 2, 3],
            journalEntries: 8,
            interventions: 1,
            lastActive: "2023-10-20",
            wellnessFlags: ["mood decline", "high stress"],
            tags: ["needs support", "follow up"],
        },
        {
            id: 3,
            name: "Sophia Martinez",
            avatar: "https://i.pravatar.cc/150?img=3",
            grade: "11th",
            moodTrend: "improving",
            stressLevel: "medium",
            moodScore: 3.7,
            lastMood: "😊",
            moodHistory: [2, 2, 3, 3, 3, 4, 4],
            journalEntries: 15,
            interventions: 2,
            lastActive: "2023-10-21",
            wellnessFlags: ["previous intervention"],
            tags: ["improving", "responsive"],
        },
        {
            id: 4,
            name: "Noah Brown",
            avatar: "https://i.pravatar.cc/150?img=4",
            grade: "10th",
            moodTrend: "fluctuating",
            stressLevel: "medium",
            moodScore: 3.2,
            lastMood: "😐",
            moodHistory: [4, 2, 4, 3, 2, 4, 3],
            journalEntries: 10,
            interventions: 1,
            lastActive: "2023-10-19",
            wellnessFlags: ["mood swings"],
            tags: ["inconsistent", "monitor"],
        },
        {
            id: 5,
            name: "Olivia Davis",
            avatar: "https://i.pravatar.cc/150?img=5",
            grade: "9th",
            moodTrend: "stable",
            stressLevel: "low",
            moodScore: 4.0,
            lastMood: "😄",
            moodHistory: [4, 4, 3, 4, 4, 5, 4],
            journalEntries: 18,
            interventions: 0,
            lastActive: "2023-10-21",
            wellnessFlags: [],
            tags: ["consistent", "engaged", "positive"],
        },
        {
            id: 6,
            name: "Ethan Taylor",
            avatar: "https://i.pravatar.cc/150?img=6",
            grade: "11th",
            moodTrend: "critical",
            stressLevel: "very high",
            moodScore: 1.8,
            lastMood: "😠",
            moodHistory: [3, 2, 2, 1, 1, 2, 1],
            journalEntries: 5,
            interventions: 3,
            lastActive: "2023-10-18",
            wellnessFlags: ["critical mood", "urgent attention", "counselor referral"],
            tags: ["urgent", "intervention", "support needed"],
        },
    ];

    const interventionTemplates = [
        {
            id: 1,
            title: "Stress Management Resources",
            description: "Curated resources for managing academic stress",
            type: "resources",
            lastUsed: "2023-10-15",
        },
        {
            id: 2,
            title: "Wellness Check-in Meeting",
            description: "One-on-one meeting template for student wellness check",
            type: "meeting",
            lastUsed: "2023-10-18",
        },
        {
            id: 3,
            title: "Counselor Referral",
            description: "Template for referring students to school counselor",
            type: "referral",
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

    const handleViewStudentDetails = (student) => {
        setSelectedStudent(student);
        setShowStudentModal(true);
    };

    const handleCreateIntervention = (student = null) => {
        setSelectedStudent(student);
        setShowInterventionForm(true);
    };

    const handleDeleteIntervention = (id) => {
        setLoading(true);
        setTimeout(() => {
            // Simulate API call
            console.log(`Deleting intervention with ID: ${id}`);
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
            alert("Wellness data would be exported");
            setLoading(false);
        }, 800);
    };

    const handleGenerateReport = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Wellness report would be generated");
            setLoading(false);
        }, 800);
    };

    // Filter students based on search term and category
    const filteredStudents = students.filter(
        (student) =>
            (filterCategory === "all" ||
                (filterCategory === "flagged" && student.wellnessFlags.length > 0) ||
                (filterCategory === "stable" && student.moodTrend === "stable") ||
                (filterCategory === "declining" && (student.moodTrend === "declining" || student.moodTrend === "critical")) ||
                (filterCategory === "improving" && student.moodTrend === "improving")) &&
            (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.tags.some((tag) =>
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
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50 relative overflow-hidden">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
                            <span className="text-lg font-semibold text-gray-800">
                                Loading...
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
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
                                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                                    Wellness Monitor
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg font-medium mt-2">
                                AI-powered mental health and wellness tracking
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefreshData}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
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
                                        <Brain className="w-4 h-4 text-cyan-500" />
                                        <span className="text-sm text-gray-600">
                                            AI Analysis Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <span className="text-sm text-gray-600">
                                            Alert System Enabled
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
                                        className="bg-white/80 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                                placeholder="Search students by name or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 placeholder-gray-500"
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
                        <Sparkles className="w-6 h-6 text-cyan-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCreateIntervention()}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Plus className="w-6 h-6" />
                            <span className="font-semibold">Create Intervention</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Wellness survey would be created")}
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <FileText className="w-6 h-6" />
                            <span className="font-semibold">Create Wellness Survey</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Stress management resources would be sent")}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <MessageSquare className="w-6 h-6" />
                            <span className="font-semibold">Send Resources</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Wellness alert settings would open")}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
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
                            <Filter className="w-6 h-6 text-indigo-500" />
                            Student Wellness Status
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-white shadow-md" : "bg-transparent"}`}
                            >
                                <Grid className={`w-5 h-5 ${viewMode === "grid" ? "text-cyan-500" : "text-gray-400"}`} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-white shadow-md" : "bg-transparent"}`}
                            >
                                <List className={`w-5 h-5 ${viewMode === "list" ? "text-cyan-500" : "text-gray-400"}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setFilterCategory("all")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "all" ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200"}`}
                        >
                            All Students
                        </button>
                        <button
                            onClick={() => setFilterCategory("flagged")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "flagged" ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200"}`}
                        >
                            Flagged
                        </button>
                        <button
                            onClick={() => setFilterCategory("declining")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "declining" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200"}`}
                        >
                            Declining
                        </button>
                        <button
                            onClick={() => setFilterCategory("improving")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "improving" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200"}`}
                        >
                            Improving
                        </button>
                        <button
                            onClick={() => setFilterCategory("stable")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium ${filterCategory === "stable" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200"}`}
                        >
                            Stable
                        </button>
                    </div>

                    {/* Students Grid/List View */}
                    {filteredStudents.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                        >
                            {filteredStudents.map((student) => (
                                <motion.div
                                    key={student.id}
                                    variants={itemVariants}
                                    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden ${viewMode === "list" ? "flex items-center" : ""}`}
                                >
                                    <div className={`p-6 ${viewMode === "list" ? "flex items-center justify-between w-full" : ""}`}>
                                        <div className={`${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
                                            <div className={`${viewMode === "list" ? "flex-shrink-0" : "mb-4 flex justify-between items-start"}`}>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={student.avatar}
                                                        alt={student.name}
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                                    />
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                                                        <p className="text-sm text-gray-500">{student.grade} Grade</p>
                                                    </div>
                                                </div>
                                                {!viewMode === "list" && student.wellnessFlags.length > 0 && (
                                                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                        {student.wellnessFlags.length} flags
                                                    </span>
                                                )}
                                            </div>

                                            {viewMode === "list" ? (
                                                <div className="flex items-center gap-6 ml-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">{student.lastMood}</span>
                                                        <div>
                                                            <div className="text-sm font-medium">
                                                                Mood Score: {student.moodScore.toFixed(1)}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs">
                                                                {student.moodTrend === "improving" && (
                                                                    <>
                                                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                                                        <span className="text-green-500">Improving</span>
                                                                    </>
                                                                )}
                                                                {student.moodTrend === "declining" && (
                                                                    <>
                                                                        <TrendingDown className="w-3 h-3 text-orange-500" />
                                                                        <span className="text-orange-500">Declining</span>
                                                                    </>
                                                                )}
                                                                {student.moodTrend === "stable" && (
                                                                    <>
                                                                        <Activity className="w-3 h-3 text-blue-500" />
                                                                        <span className="text-blue-500">Stable</span>
                                                                    </>
                                                                )}
                                                                {student.moodTrend === "fluctuating" && (
                                                                    <>
                                                                        <Activity className="w-3 h-3 text-purple-500" />
                                                                        <span className="text-purple-500">Fluctuating</span>
                                                                    </>
                                                                )}
                                                                {student.moodTrend === "critical" && (
                                                                    <>
                                                                        <AlertCircle className="w-3 h-3 text-red-500" />
                                                                        <span className="text-red-500">Critical</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="text-sm font-medium">Stress: {student.stressLevel}</div>
                                                        <div className="text-xs text-gray-500">{student.journalEntries} journal entries</div>
                                                    </div>

                                                    {student.wellnessFlags.length > 0 && (
                                                        <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                            {student.wellnessFlags.length} flags
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">{student.lastMood}</span>
                                                            <div>
                                                                <div className="text-sm font-medium">
                                                                    Mood Score: {student.moodScore.toFixed(1)}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-xs">
                                                                    {student.moodTrend === "improving" && (
                                                                        <>
                                                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                                                            <span className="text-green-500">Improving</span>
                                                                        </>
                                                                    )}
                                                                    {student.moodTrend === "declining" && (
                                                                        <>
                                                                            <TrendingDown className="w-3 h-3 text-orange-500" />
                                                                            <span className="text-orange-500">Declining</span>
                                                                        </>
                                                                    )}
                                                                    {student.moodTrend === "stable" && (
                                                                        <>
                                                                            <Activity className="w-3 h-3 text-blue-500" />
                                                                            <span className="text-blue-500">Stable</span>
                                                                        </>
                                                                    )}
                                                                    {student.moodTrend === "fluctuating" && (
                                                                        <>
                                                                            <Activity className="w-3 h-3 text-purple-500" />
                                                                            <span className="text-purple-500">Fluctuating</span>
                                                                        </>
                                                                    )}
                                                                    {student.moodTrend === "critical" && (
                                                                        <>
                                                                            <AlertCircle className="w-3 h-3 text-red-500" />
                                                                            <span className="text-red-500">Critical</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium">Stress Level</div>
                                                            <div className="text-sm font-bold">
                                                                {student.stressLevel === "low" && <span className="text-green-500">Low</span>}
                                                                {student.stressLevel === "medium" && <span className="text-yellow-500">Medium</span>}
                                                                {student.stressLevel === "high" && <span className="text-orange-500">High</span>}
                                                                {student.stressLevel === "very high" && <span className="text-red-500">Very High</span>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1 h-6">
                                                        {student.moodHistory.map((mood, index) => {
                                                            let bgColor = "bg-gray-200";
                                                            if (mood >= 4) bgColor = "bg-green-400";
                                                            else if (mood >= 3) bgColor = "bg-blue-400";
                                                            else if (mood >= 2) bgColor = "bg-yellow-400";
                                                            else bgColor = "bg-red-400";

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`${bgColor} h-full flex-1 rounded-sm first:rounded-l-md last:rounded-r-md`}
                                                                    title={`Day ${index + 1}: ${mood}/5`}
                                                                ></div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="flex justify-between text-sm text-gray-500">
                                                        <div>{student.journalEntries} journal entries</div>
                                                        <div>Last active: {student.lastActive}</div>
                                                    </div>

                                                    {student.wellnessFlags.length > 0 && (
                                                        <div className="mt-3">
                                                            <div className="text-xs font-semibold text-red-600 mb-1">Wellness Flags:</div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {student.wellnessFlags.map((flag, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full"
                                                                    >
                                                                        {flag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex flex-wrap gap-1 mt-3">
                                                        {student.tags.map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className={`${viewMode === "list" ? "flex-shrink-0 flex gap-2" : "mt-4 flex gap-2"}`}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleViewStudentDetails(student)}
                                                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Details</span>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleCreateIntervention(student)}
                                                className="flex-1 bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                <span>Intervene</span>
                                            </motion.button>
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
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/50"
                        >
                            <div className="flex flex-col items-center justify-center gap-3">
                                <Search className="w-12 h-12 text-gray-300" />
                                <h3 className="text-xl font-bold text-gray-700">No students found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    No students match your current search criteria. Try adjusting your filters or search term.
                                </p>
                            </div>
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
                        <FileText className="w-6 h-6 text-blue-500" />
                        Intervention Templates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {interventionTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/50"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-bold text-gray-800">{template.title}</h3>
                                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                                        {template.type}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Last used: {template.lastUsed}</span>
                                    <button className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                                        Use Template
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 shadow-lg border border-cyan-100 flex flex-col items-center justify-center gap-3 text-center"
                        >
                            <Plus className="w-8 h-8 text-cyan-500" />
                            <h3 className="text-lg font-bold text-gray-800">Create New Template</h3>
                            <p className="text-gray-600 text-sm">
                                Design a custom intervention template for specific wellness needs
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* AI Wellness Tools */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-purple-500" />
                        AI-Powered Wellness Tools
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-gradient-to-r from-purple-400 to-indigo-400 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Mood Analysis</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                AI-powered analysis of mood patterns and trends with early warning detection
                            </p>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Journal Insights</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Natural language processing to extract key insights from student journal entries
                            </p>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-gradient-to-r from-green-400 to-emerald-400 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Risk Prediction</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Predictive analytics to identify students who may need additional support
                            </p>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-gradient-to-r from-amber-400 to-orange-400 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Recommendation Engine</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Personalized wellness resource recommendations based on student needs
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-center text-gray-500 text-sm"
                >
                    <p>Wellness Monitor • AI-powered mental health and wellness tracking</p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-cyan-500" /> Mood tracking
                        </span>
                        <span className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-red-500" /> Stress alerts
                        </span>
                        <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4 text-blue-500" /> Wellness reports
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WellnessMonitor;