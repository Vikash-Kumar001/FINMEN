import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import {
    Download,
    Eye,
    MessageCircle,
    Search,
    Filter,
    Users,
    Award,
    Coins,
    TrendingUp,
    Grid3X3,
    List,
    RefreshCw,
    Plus,
    Settings,
    BarChart3,
    Zap,
    Crown,
    Star,
    Activity,
    Calendar,
    Mail,
    User,
    ChevronDown,
    ChevronRight,
    ArrowUpDown,
    Shield,
    Database,
    Wifi,
    LineChart,
} from "lucide-react";
import { CSVLink } from "react-csv";
import StudentProgressModal from "../Student/StudentProgressModal";

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterBy, setFilterBy] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [bulkAction, setBulkAction] = useState("");
    const [dateRange, setDateRange] = useState("week");
    const [lastUpdated, setLastUpdated] = useState(
        new Date().toLocaleTimeString()
    );

    // Real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date().toLocaleTimeString());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const res = await api.get("/api/educators/students");
                setStudents(res.data);
                setFiltered(res.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        let result = students;

        // Apply search filter
        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(
                (s) =>
                    s.name.toLowerCase().includes(lower) ||
                    s.email.toLowerCase().includes(lower)
            );
        }

        // Apply category filter
        if (filterBy !== "all") {
            switch (filterBy) {
                case "active":
                    result = result.filter(
                        (s) =>
                            s.lastActive &&
                            new Date(s.lastActive) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    );
                    break;
                case "high-performers":
                    result = result.filter((s) => (s.xp || 0) > 1000);
                    break;
                case "needs-attention":
                    result = result.filter((s) => (s.xp || 0) < 100);
                    break;
                default:
                    break;
            }
        }

        // Apply sorting
        result = [...result].sort((a, b) => {
            let aValue = a[sortBy] || 0;
            let bValue = b[sortBy] || 0;

            if (sortBy === "name") {
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFiltered(result);
    }, [search, students, filterBy, sortBy, sortOrder]);

    const handleViewProgress = (id) => {
        setSelectedStudentId(id);
    };

    const handleFeedback = (studentId) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert(`Opening feedback interface for student ID: ${studentId}`);
        }, 800);
    };

    const handleRefreshData = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setLastUpdated(new Date().toLocaleTimeString());
        }, 1500);
    };

    const handleBulkAction = () => {
        if (selectedStudents.length === 0) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert(
                `Bulk action "${bulkAction}" applied to ${selectedStudents.length} students`
            );
            setSelectedStudents([]);
            setBulkAction("");
        }, 1000);
    };

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const headers = [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "XP", key: "xp" },
        { label: "HealCoins", key: "healCoins" },
        { label: "Last Active", key: "lastActive" },
        { label: "Progress", key: "progress" },
    ];

    const getStudentLevel = (xp) => {
        if (xp >= 2000)
            return {
                level: "Expert",
                color: "from-purple-500 to-pink-500",
                icon: <Crown className="w-4 h-4" />,
            };
        if (xp >= 1000)
            return {
                level: "Advanced",
                color: "from-blue-500 to-indigo-500",
                icon: <Star className="w-4 h-4" />,
            };
        if (xp >= 500)
            return {
                level: "Intermediate",
                color: "from-green-500 to-emerald-500",
                icon: <Award className="w-4 h-4" />,
            };
        return {
            level: "Beginner",
            color: "from-gray-500 to-gray-600",
            icon: <User className="w-4 h-4" />,
        };
    };

    const filterOptions = [
        {
            value: "all",
            label: "All Students",
            icon: <Users className="w-4 h-4" />,
        },
        {
            value: "active",
            label: "Recently Active",
            icon: <Activity className="w-4 h-4" />,
        },
        {
            value: "high-performers",
            label: "High Performers",
            icon: <TrendingUp className="w-4 h-4" />,
        },
        {
            value: "needs-attention",
            label: "Needs Attention",
            icon: <Shield className="w-4 h-4" />,
        },
    ];

    const sortOptions = [
        { value: "name", label: "Name" },
        { value: "xp", label: "XP Points" },
        { value: "healCoins", label: "HealCoins" },
        { value: "lastActive", label: "Last Active" },
    ];

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
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Users className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Student Management
                                </h1>
                                <p className="text-gray-600 text-lg font-medium">
                                    Monitor, track, and support your students' journey
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefreshData}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Refresh</span>
                            </motion.button>

                            <CSVLink
                                data={filtered.map((s) => ({
                                    name: s.name,
                                    email: s.email,
                                    xp: s.xp || 0,
                                    healCoins: s.healCoins || 0,
                                    lastActive: s.lastActive || "N/A",
                                    progress: s.progress || 0,
                                }))}
                                headers={headers}
                                filename={`students-${new Date().toISOString().split("T")[0]
                                    }.csv`}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <Download size={16} />
                                <span>Export CSV</span>
                            </CSVLink>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-gray-700">
                                        System Online
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-gray-600">
                                        {students.length} Students
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-600">
                                        {filtered.length} Filtered
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

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search students by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filter Controls */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <select
                                        value={filterBy}
                                        onChange={(e) => setFilterBy(e.target.value)}
                                        className="bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8"
                                    >
                                        {filterOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>

                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                Sort by {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                                    }
                                    className="bg-white/80 p-3 rounded-xl shadow-md border border-white/50 hover:bg-white transition-all duration-300"
                                >
                                    <ArrowUpDown className="w-5 h-5 text-gray-600" />
                                </motion.button>

                                <div className="flex items-center gap-2 bg-white/80 rounded-xl p-1 shadow-md border border-white/50">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid"
                                                ? "bg-indigo-500 text-white shadow-md"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Grid3X3 className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list"
                                                ? "bg-indigo-500 text-white shadow-md"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <List className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedStudents.length > 0 && (
                            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-indigo-700">
                                            {selectedStudents.length} student
                                            {selectedStudents.length > 1 ? "s" : ""} selected
                                        </span>
                                        <select
                                            value={bulkAction}
                                            onChange={(e) => setBulkAction(e.target.value)}
                                            className="bg-white border border-indigo-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Select action...</option>
                                            <option value="send_message">Send Message</option>
                                            <option value="assign_task">Assign Task</option>
                                            <option value="add_to_group">Add to Group</option>
                                            <option value="export_data">Export Data</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleBulkAction}
                                            disabled={!bulkAction}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                                        >
                                            Apply
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedStudents([])}
                                            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                                        >
                                            Clear
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Students Display */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                    }
                >
                    {filtered.map((student) => {
                        const level = getStudentLevel(student.xp || 0);
                        const isSelected = selectedStudents.includes(student._id);

                        return (
                            <motion.div
                                key={student._id}
                                variants={itemVariants}
                                whileHover={{
                                    scale: viewMode === "grid" ? 1.02 : 1.01,
                                    y: viewMode === "grid" ? -4 : -2,
                                }}
                                className={`group cursor-pointer relative ${viewMode === "grid"
                                        ? "bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                                        : "bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50 hover:shadow-lg transition-all duration-300"
                                    }`}
                            >
                                {/* Selection Checkbox */}
                                <div className="absolute top-4 right-4 z-10">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleStudentSelection(student._id);
                                        }}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected
                                                ? "bg-indigo-500 border-indigo-500 text-white"
                                                : "border-gray-300 hover:border-indigo-400"
                                            }`}
                                    >
                                        {isSelected && <span className="text-xs">✓</span>}
                                    </motion.button>
                                </div>

                                {viewMode === "grid" ? (
                                    // Grid View
                                    <div className="text-center">
                                        <div className="relative mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto shadow-lg">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div
                                                className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r ${level.color} rounded-full flex items-center justify-center text-white shadow-md`}
                                            >
                                                {level.icon}
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-lg text-gray-800 mb-1">
                                            {student.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {student.email}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Zap className="w-4 h-4 text-yellow-500" />
                                                    XP
                                                </span>
                                                <span className="font-semibold">{student.xp || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Coins className="w-4 h-4 text-yellow-600" />
                                                    Coins
                                                </span>
                                                <span className="font-semibold">
                                                    {student.healCoins || 0}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${level.color} text-white shadow-md mb-4`}
                                        >
                                            {level.icon}
                                            {level.level}
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleViewProgress(student._id)}
                                                className="flex-1 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-2 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <Eye size={16} className="mr-1" />
                                                Progress
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleFeedback(student._id)}
                                                className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <MessageCircle size={16} className="mr-1" />
                                                Feedback
                                            </motion.button>
                                            <Link 
                                                to={`/educator/student/${student._id}/activity`}
                                                className="mt-2 w-full"
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <LineChart size={16} className="mr-1" />
                                                    Activity Tracker
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    // List View
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div
                                                className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${level.color} rounded-full flex items-center justify-center text-white shadow-md`}
                                            >
                                                {level.icon}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-800">
                                                {student.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">{student.email}</p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Zap className="w-4 h-4 text-yellow-500" />
                                                    <span className="font-semibold">
                                                        {student.xp || 0}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">XP</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Coins className="w-4 h-4 text-yellow-600" />
                                                    <span className="font-semibold">
                                                        {student.healCoins || 0}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">Coins</div>
                                            </div>
                                            <div
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${level.color} text-white shadow-md`}
                                            >
                                                {level.icon}
                                                {level.level}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleViewProgress(student._id)}
                                                className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <Eye size={16} className="mr-1" />
                                                Progress
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleFeedback(student._id)}
                                                className="flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <MessageCircle size={16} className="mr-1" />
                                                Feedback
                                            </motion.button>
                                            <Link to={`/educator/student/${student._id}/activity`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300"
                                                >
                                                    <LineChart size={16} className="mr-1" />
                                                    Activity
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Student Progress Modal */}
                {selectedStudentId && (
                    <StudentProgressModal
                        studentId={selectedStudentId}
                        onClose={() => setSelectedStudentId(null)}
                    />
                )}
            </div>
        </div>
    );
}
