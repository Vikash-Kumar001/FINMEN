import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Users,
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
    Settings,
    ChevronDown,
    ChevronRight,
    Star,
    Sparkles,
    Cpu,
    Layers,
    Share2,
    HelpCircle,
    Bell,
    Mail,
    Phone,
    Video,
    Send,
    FileText,
    Megaphone,
    UserPlus,
    Bookmark,
    AlertCircle,
    CheckCircle,
    Paperclip,
    Mic,
    Image,
    Smile,
    Calendar as CalendarIcon,
} from "lucide-react";

const CommunicationCenter = () => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showAnnouncementComposer, setShowAnnouncementComposer] = useState(false);
    const [dateRange, setDateRange] = useState("week");
    const [lastUpdated, setLastUpdated] = useState(
        new Date().toLocaleTimeString()
    );

    // Sample data
    const messages = [
        {
            id: 1,
            title: "Weekly Progress Update",
            description: "Summary of student progress for the week",
            type: "announcement",
            category: "updates",
            status: "sent",
            recipients: 48,
            readCount: 32,
            responseCount: 12,
            createdAt: "2023-10-05",
            lastUpdated: "2023-10-05",
            scheduledFor: null,
            tags: ["weekly", "progress", "all-students"],
        },
        {
            id: 2,
            title: "Upcoming Financial Literacy Workshop",
            description: "Details about the workshop scheduled for next week",
            type: "event",
            category: "events",
            status: "scheduled",
            recipients: 75,
            readCount: 0,
            responseCount: 0,
            createdAt: "2023-10-08",
            lastUpdated: "2023-10-08",
            scheduledFor: "2023-10-15 09:00",
            tags: ["workshop", "event", "financial-literacy"],
        },
        {
            id: 3,
            title: "Parent-Teacher Conference Reminder",
            description: "Reminder about upcoming parent-teacher conferences",
            type: "reminder",
            category: "parents",
            status: "draft",
            recipients: 0,
            readCount: 0,
            responseCount: 0,
            createdAt: "2023-10-12",
            lastUpdated: "2023-10-12",
            scheduledFor: "2023-10-20 15:00",
            tags: ["parents", "conference", "reminder"],
        },
        {
            id: 4,
            title: "Budget Challenge Results",
            description: "Results and feedback for the monthly budget challenge",
            type: "feedback",
            category: "results",
            status: "sent",
            recipients: 42,
            readCount: 38,
            responseCount: 15,
            createdAt: "2023-09-28",
            lastUpdated: "2023-09-28",
            scheduledFor: null,
            tags: ["results", "budget", "challenge"],
        },
        {
            id: 5,
            title: "New Learning Resources Available",
            description: "Announcement about new financial learning resources",
            type: "announcement",
            category: "resources",
            status: "sent",
            recipients: 48,
            readCount: 25,
            responseCount: 8,
            createdAt: "2023-10-01",
            lastUpdated: "2023-10-01",
            scheduledFor: null,
            tags: ["resources", "learning", "announcement"],
        },
        {
            id: 6,
            title: "Student Group Assignment",
            description: "New group assignments for the investment project",
            type: "assignment",
            category: "groups",
            status: "scheduled",
            recipients: 36,
            readCount: 0,
            responseCount: 0,
            createdAt: "2023-09-25",
            lastUpdated: "2023-10-02",
            scheduledFor: "2023-10-10 10:00",
            tags: ["groups", "assignment", "project"],
        },
    ];

    const templates = [
        {
            id: 1,
            title: "Weekly Progress Update",
            description: "Template for sending weekly progress updates to students",
            type: "announcement",
            lastUsed: "2023-10-05",
        },
        {
            id: 2,
            title: "Event Announcement",
            description: "Template for announcing upcoming events and workshops",
            type: "event",
            lastUsed: "2023-09-20",
        },
        {
            id: 3,
            title: "Parent Communication",
            description: "Template for communicating with parents about student progress",
            type: "parent",
            lastUsed: "2023-10-01",
        },
    ];

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date().toLocaleTimeString());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateMessage = () => {
        setSelectedMessage(null);
        setShowMessageModal(true);
    };

    const handleEditMessage = (message) => {
        setSelectedMessage(message);
        setShowMessageModal(true);
    };

    const handleDeleteMessage = (id) => {
        setLoading(true);
        setTimeout(() => {
            // Simulate API call
            console.log(`Deleting message with ID: ${id}`);
            setLoading(false);
            // In a real app, you would update the state after successful deletion
        }, 800);
    };

    const handleOpenAnnouncementComposer = (message = null) => {
        setSelectedMessage(message);
        setShowAnnouncementComposer(true);
    };

    const handleRefreshData = () => {
        setLoading(true);
        setTimeout(() => {
            setLastUpdated(new Date().toLocaleTimeString());
            setLoading(false);
        }, 800);
    };

    const handleExportMessages = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Messages would be exported");
            setLoading(false);
        }, 800);
    };

    const handleGenerateReport = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Communication report would be generated");
            setLoading(false);
        }, 800);
    };

    // Filter messages based on search term and category
    const filteredMessages = messages.filter(
        (message) =>
            (filterCategory === "all" || message.category === filterCategory) &&
            (message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.tags.some((tag) =>
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
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
                            <span className="text-lg font-semibold text-gray-800">
                                Loading...
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-fuchsia-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
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
                                <span className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                                    Communication Center
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg font-medium mt-2">
                                Multi-channel communication with students and parents
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefreshData}
                                className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Refresh</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExportMessages}
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
                                        <Mail className="w-4 h-4 text-pink-500" />
                                        <span className="text-sm text-gray-600">
                                            Email Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm text-gray-600">
                                            Messaging Enabled
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
                                        className="bg-white/80 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                                placeholder="Search messages by title, description, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800 placeholder-gray-500"
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
                        <Sparkles className="w-6 h-6 text-pink-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCreateMessage}
                            className="bg-gradient-to-r from-pink-500 to-fuchsia-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <MessageSquare className="w-6 h-6" />
                            <span className="font-semibold">New Message</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenAnnouncementComposer()}
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Megaphone className="w-6 h-6" />
                            <span className="font-semibold">Create Announcement</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Schedule Meeting would open")}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <CalendarIcon className="w-6 h-6" />
                            <span className="font-semibold">Schedule Meeting</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert("Communication Settings would open")}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <Settings className="w-6 h-6" />
                            <span className="font-semibold">Communication Settings</span>
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
                            <Filter className="w-6 h-6 text-fuchsia-500" />
                            Message Library
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-pink-100 text-pink-600" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                </div>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-pink-100 text-pink-600" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                <div className="w-5 h-5 flex flex-col gap-0.5">
                                    <div className="h-1 bg-current rounded-sm"></div>
                                    <div className="h-1 bg-current rounded-sm"></div>
                                    <div className="h-1 bg-current rounded-sm"></div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {["all", "updates", "events", "parents", "results", "resources", "groups"].map(
                            (category) => (
                                <motion.button
                                    key={category}
                                    onClick={() => setFilterCategory(category)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all ${filterCategory === category
                                        ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg"
                                        : "bg-white/80 text-gray-700 hover:bg-white shadow-md"
                                        }`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </motion.button>
                            )
                        )}
                    </div>
                </motion.div>

                {/* Messages Grid/List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" : "space-y-4 mb-8"}
                >
                    {filteredMessages.length > 0 ? (
                        filteredMessages.map((message) => (
                            <motion.div
                                key={message.id}
                                variants={itemVariants}
                                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden ${viewMode === "list" ? "flex" : ""}`}
                            >
                                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${message.status === "sent"
                                                            ? "bg-green-100 text-green-700"
                                                            : message.status === "scheduled"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {message.status.charAt(0).toUpperCase() +
                                                        message.status.slice(1)}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${message.type === "announcement"
                                                            ? "bg-pink-100 text-pink-700"
                                                            : message.type === "event"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : message.type === "reminder"
                                                                    ? "bg-indigo-100 text-indigo-700"
                                                                    : message.type === "feedback"
                                                                        ? "bg-teal-100 text-teal-700"
                                                                        : "bg-orange-100 text-orange-700"
                                                        }`}
                                                >
                                                    {message.type.charAt(0).toUpperCase() +
                                                        message.type.slice(1)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {message.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {message.description}
                                            </p>
                                        </div>
                                        {viewMode === "grid" && (
                                            <div
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${message.type === "announcement"
                                                        ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white"
                                                        : message.type === "event"
                                                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                                            : message.type === "reminder"
                                                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                                                : message.type === "feedback"
                                                                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                                                                    : "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                                                    }`}
                                            >
                                                {message.type === "announcement" ? (
                                                    <Megaphone className="w-6 h-6" />
                                                ) : message.type === "event" ? (
                                                    <CalendarIcon className="w-6 h-6" />
                                                ) : message.type === "reminder" ? (
                                                    <Bell className="w-6 h-6" />
                                                ) : message.type === "feedback" ? (
                                                    <MessageSquare className="w-6 h-6" />
                                                ) : (
                                                    <FileText className="w-6 h-6" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Recipients</span>
                                            <span className="font-semibold text-gray-700">
                                                {message.recipients}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Read</span>
                                            <span className="font-semibold text-gray-700">
                                                {message.readCount > 0
                                                    ? `${Math.round((message.readCount / message.recipients) * 100)}%`
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Responses</span>
                                            <span className="font-semibold text-gray-700">
                                                {message.responseCount}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">
                                                {message.scheduledFor ? "Scheduled" : "Sent"}
                                            </span>
                                            <span className="font-semibold text-gray-700">
                                                {message.scheduledFor
                                                    ? message.scheduledFor.split(" ")[0]
                                                    : message.lastUpdated}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {message.tags.map((tag, index) => (
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
                                            Created: {message.createdAt}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditMessage(message)}
                                                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(message.id)}
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
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                                    <Search className="w-8 h-8 text-pink-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    No messages found
                                </h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Try adjusting your search or filter criteria, or create a new
                                    message.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCreateMessage}
                                    className="mt-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Create Message</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Message Templates Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Layers className="w-6 h-6 text-purple-500" />
                        Message Templates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {templates.map((template) => (
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
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${template.type === "announcement"
                                            ? "bg-pink-100 text-pink-700"
                                            : template.type === "event"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}>
                                        {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">
                                        Last used: {template.lastUsed}
                                    </span>
                                    <button
                                        onClick={() => handleOpenAnnouncementComposer()}
                                        className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Use</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {/* Create New Template Card */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-center cursor-pointer"
                            onClick={() => handleOpenAnnouncementComposer()}
                        >
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                Create New Template
                            </h3>
                            <p className="text-sm text-gray-600">
                                Design a reusable template for your communications
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Communication Channels */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-12"
                >
                    <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 rounded-2xl p-8 shadow-xl text-white">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-yellow-300" />
                                    Multi-Channel Communication
                                </h2>
                                <p className="mb-6">
                                    Reach students and parents through their preferred communication channels.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold">Email Notifications</h3>
                                            <p className="text-sm text-white/80">
                                                Send formatted emails with attachments
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold">In-App Messaging</h3>
                                            <p className="text-sm text-white/80">
                                                Real-time chat with read receipts
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold">SMS Alerts</h3>
                                            <p className="text-sm text-white/80">
                                                Send text messages for urgent communications
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold">Video Conferencing</h3>
                                            <p className="text-sm text-white/80">
                                                Schedule and host virtual meetings
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => alert("Channel Settings would open")}
                                    className="bg-white text-purple-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Channel Settings</span>
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
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <MessageSquare className="w-6 h-6" />
                        <span>Instant messaging • Video calls • Announcements 💬</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CommunicationCenter;