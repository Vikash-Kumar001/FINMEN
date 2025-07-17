import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Award,
    CheckCircle,
    FileText,
    Users,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Download,
    Upload,
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
    ArrowRight,
    ArrowLeft,
    Star,
    MessageSquare,
    Zap,
    Sparkles,
    Cpu,
    Layers,
    Share2,
    HelpCircle,
    Bell,
} from "lucide-react";

const AssessmentHub = () => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [showRubricBuilder, setShowRubricBuilder] = useState(false);
    const [dateRange, setDateRange] = useState("week");
    const [lastUpdated, setLastUpdated] = useState(
        new Date().toLocaleTimeString()
    );

    // Sample data
    const assessments = [
        {
            id: 1,
            title: "Financial Literacy Quiz",
            description: "Basic concepts of personal finance and money management",
            type: "quiz",
            category: "finance",
            status: "published",
            questions: 15,
            autoGraded: true,
            averageScore: 82,
            completions: 48,
            createdAt: "2023-10-05",
            lastUpdated: "2023-10-15",
            duration: "20 mins",
            tags: ["finance", "quiz", "beginner"],
        },
        {
            id: 2,
            title: "Budgeting Case Study",
            description: "Practical application of budgeting principles",
            type: "assignment",
            category: "budgeting",
            status: "published",
            questions: 5,
            autoGraded: false,
            averageScore: 78,
            completions: 36,
            createdAt: "2023-10-08",
            lastUpdated: "2023-10-18",
            duration: "45 mins",
            tags: ["budgeting", "case study", "intermediate"],
        },
        {
            id: 3,
            title: "Investment Strategies Project",
            description: "Group project on developing investment strategies",
            type: "project",
            category: "investment",
            status: "draft",
            questions: 1,
            autoGraded: false,
            averageScore: 0,
            completions: 0,
            createdAt: "2023-10-12",
            lastUpdated: "2023-10-20",
            duration: "1 week",
            tags: ["investment", "project", "advanced"],
        },
        {
            id: 4,
            title: "Credit Management Assessment",
            description: "Evaluation of credit management knowledge",
            type: "test",
            category: "credit",
            status: "published",
            questions: 25,
            autoGraded: true,
            averageScore: 75,
            completions: 42,
            createdAt: "2023-09-28",
            lastUpdated: "2023-10-10",
            duration: "30 mins",
            tags: ["credit", "test", "intermediate"],
        },
        {
            id: 5,
            title: "Savings Goals Reflection",
            description: "Self-reflection on personal savings goals",
            type: "reflection",
            category: "savings",
            status: "published",
            questions: 8,
            autoGraded: false,
            averageScore: 90,
            completions: 39,
            createdAt: "2023-10-01",
            lastUpdated: "2023-10-12",
            duration: "25 mins",
            tags: ["savings", "reflection", "beginner"],
        },
        {
            id: 6,
            title: "Peer Budget Review",
            description: "Students review each other's budget plans",
            type: "peer-assessment",
            category: "budgeting",
            status: "published",
            questions: 6,
            autoGraded: false,
            averageScore: 85,
            completions: 32,
            createdAt: "2023-09-25",
            lastUpdated: "2023-10-08",
            duration: "40 mins",
            tags: ["budgeting", "peer review", "intermediate"],
        },
    ];

    const rubricTemplates = [
        {
            id: 1,
            title: "Financial Analysis Rubric",
            description: "Criteria for evaluating financial analysis assignments",
            criteria: 5,
            maxScore: 20,
            lastUsed: "2023-10-15",
        },
        {
            id: 2,
            title: "Budget Project Rubric",
            description: "Evaluation framework for budget planning projects",
            criteria: 4,
            maxScore: 16,
            lastUsed: "2023-10-18",
        },
        {
            id: 3,
            title: "Investment Presentation Rubric",
            description: "Criteria for assessing investment strategy presentations",
            criteria: 6,
            maxScore: 24,
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

    const handleCreateAssessment = () => {
        setSelectedAssessment(null);
        setShowAssessmentModal(true);
    };

    const handleEditAssessment = (assessment) => {
        setSelectedAssessment(assessment);
        setShowAssessmentModal(true);
    };

    const handleDeleteAssessment = (id) => {
        setLoading(true);
        setTimeout(() => {
            // Simulate API call
            console.log(`Deleting assessment with ID: ${id}`);
            setLoading(false);
            // In a real app, you would update the state after successful deletion
        }, 800);
    };

    const handleOpenRubricBuilder = (assessment = null) => {
        setSelectedAssessment(assessment);
        setShowRubricBuilder(true);
    };

    const handleRefreshData = () => {
        setLoading(true);
        setTimeout(() => {
            setLastUpdated(new Date().toLocaleTimeString());
            setLoading(false);
        }, 800);
    };

    const handleExportAssessments = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Assessments would be exported");
            setLoading(false);
        }, 800);
    };

    const handleGenerateReport = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Assessment report would be generated");
            setLoading(false);
        }, 800);
    };

    // Filter assessments based on search term and category
    const filteredAssessments = assessments.filter(
        (assessment) =>
            (filterCategory === "all" || assessment.category === filterCategory) &&
            (assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assessment.tags.some((tag) =>
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                            <span className="text-lg font-semibold text-gray-800">
                                Loading...
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-red-200 to-orange-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
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
                                <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                                    Assessment Hub
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg font-medium mt-2">
                                Comprehensive assessment tools and rubrics
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefreshData}
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Refresh</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExportAssessments}
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
                                        <Cpu className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm text-gray-600">
                                            Auto-grading Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-gray-600">
                                            Peer Review Enabled
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
                                        className="bg-white/80 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                                placeholder="Search assessments by title, description, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800 placeholder-gray-500"
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
                        <Zap className="w-6 h-6 text-yellow-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCreateAssessment}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Plus className="w-6 h-6" />
                            <span className="font-semibold">Create Assessment</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenRubricBuilder()}
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Layers className="w-6 h-6" />
                            <span className="font-semibold">Rubric Builder</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Peer Review Setup would open")}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Users className="w-6 h-6" />
                            <span className="font-semibold">Setup Peer Review</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Auto-grading Settings would open")}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Settings className="w-6 h-6" />
                            <span className="font-semibold">Auto-grading Settings</span>
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
                            Assessment Library
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-orange-100 text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-orange-100 text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {["all", "finance", "budgeting", "investment", "credit", "savings"].map(
                            (category) => (
                                <motion.button
                                    key={category}
                                    onClick={() => setFilterCategory(category)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all ${filterCategory === category
                                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                                        : "bg-white/80 text-gray-700 hover:bg-white shadow-md"
                                        }`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </motion.button>
                            )
                        )}
                    </div>
                </motion.div>

                {/* Assessments Grid/List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" : "space-y-4 mb-8"}
                >
                    {filteredAssessments.length > 0 ? (
                        filteredAssessments.map((assessment) => (
                            <motion.div
                                key={assessment.id}
                                variants={itemVariants}
                                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden ${viewMode === "list" ? "flex" : ""}`}
                            >
                                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${assessment.status === "published"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {assessment.status.charAt(0).toUpperCase() +
                                                        assessment.status.slice(1)}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${assessment.type === "quiz"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : assessment.type === "assignment"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : assessment.type === "project"
                                                                    ? "bg-indigo-100 text-indigo-700"
                                                                    : assessment.type === "test"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : assessment.type === "reflection"
                                                                            ? "bg-teal-100 text-teal-700"
                                                                            : "bg-orange-100 text-orange-700"
                                                        }`}
                                                >
                                                    {assessment.type.charAt(0).toUpperCase() +
                                                        assessment.type.slice(1)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {assessment.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {assessment.description}
                                            </p>
                                        </div>
                                        {viewMode === "grid" && (
                                            <div
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${assessment.autoGraded
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                                        : "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                                                    }`}
                                            >
                                                {assessment.autoGraded ? (
                                                    <Cpu className="w-6 h-6" />
                                                ) : (
                                                    <Users className="w-6 h-6" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Questions</span>
                                            <span className="font-semibold text-gray-700">
                                                {assessment.questions}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Duration</span>
                                            <span className="font-semibold text-gray-700">
                                                {assessment.duration}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Avg. Score</span>
                                            <span className="font-semibold text-gray-700">
                                                {assessment.averageScore > 0
                                                    ? `${assessment.averageScore}%`
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Completions</span>
                                            <span className="font-semibold text-gray-700">
                                                {assessment.completions}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {assessment.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            Updated: {assessment.lastUpdated}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditAssessment(assessment)}
                                                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAssessment(assessment.id)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            variants={itemVariants}
                            className="col-span-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 text-center"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Search className="w-8 h-8 text-yellow-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    No assessments found
                                </h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Try adjusting your search or filter criteria, or create a new
                                    assessment.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCreateAssessment}
                                    className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Create Assessment</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Rubric Templates Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Layers className="w-6 h-6 text-purple-500" />
                        Rubric Templates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {rubricTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
                            >
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    {template.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {template.description}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
                                    <span>{template.criteria} criteria</span>
                                    <span>Max score: {template.maxScore}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">
                                        Last used: {template.lastUsed}
                                    </span>
                                    <button
                                        onClick={() => handleOpenRubricBuilder()}
                                        className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {/* Create New Rubric Template Card */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-center cursor-pointer"
                            onClick={() => handleOpenRubricBuilder()}
                        >
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                Create New Rubric
                            </h3>
                            <p className="text-sm text-gray-600">
                                Design a custom rubric for your assessments
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* AI-Powered Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-12"
                >
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-xl text-white">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-yellow-300" />
                                    AI-Powered Assessment Tools
                                </h2>
                                <p className="mb-6">
                                    Leverage artificial intelligence to create, grade, and analyze
                                    assessments more efficiently.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold">Auto-generated Questions</h3>
                                            <p className="text-sm text-white/80">
                                                Create assessment questions based on your curriculum
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold">Smart Grading</h3>
                                            <p className="text-sm text-white/80">
                                                Automatically grade open-ended responses with AI
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold">Performance Insights</h3>
                                            <p className="text-sm text-white/80">
                                                Get AI-powered insights on student performance
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold">Personalized Feedback</h3>
                                            <p className="text-sm text-white/80">
                                                Generate tailored feedback for each student
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => alert("AI Assessment Tools would open")}
                                    className="bg-white text-purple-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
                                >
                                    <Cpu className="w-5 h-5" />
                                    <span>Explore AI Tools</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-10"
                >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <Award className="w-6 h-6" />
                        <span>Auto-grading • Rubric builder • Peer assessments 📝</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AssessmentHub;