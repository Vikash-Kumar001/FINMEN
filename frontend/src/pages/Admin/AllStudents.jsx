import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    Search, 
    Download, 
    Filter, 
    SortAsc, 
    SortDesc,
    Eye,
    Edit,
    Trash2,
    UserPlus,
    Trophy,
    TrendingUp,
    Calendar,
    Clock,
    Star,
    Award,
    Zap,
    Target,
    BarChart3,
    PieChart,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Activity,
    Crown,
    Flame,
    ChevronDown,
    ChevronUp,
    X,
    Plus,
    FileText,
    AlertCircle,
    CheckCircle,
    XCircle,
    Sparkles,
    BookOpen,
    Settings,
    MoreHorizontal,
    ExternalLink,
    Send,
    Bell,
    Shield,
    UserCheck,
    UserX,
    Coins
} from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import { CSVLink } from "react-csv";
import { toast } from "react-hot-toast";
import { logActivity } from "../../services/activityService";
import { 
    fetchAllStudents, 
    updateStudentStatus, 
    deleteStudent, 
    exportStudentData,
    fetchStudentStats,
    sendBulkMessage,
    createStudentAccount
} from "../../services/adminService";

export default function AllStudents() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({
        status: 'all',
        class: 'all',
        xpRange: 'all',
        lastActive: 'all',
        achievements: 'all'
    });
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        topPerformer: null,
        averageXP: 0,
        totalXP: 0,
        newThisWeek: 0,
        classDistribution: {}
    });
    const [bulkMessage, setBulkMessage] = useState({
        show: false,
        subject: '',
        message: '',
        recipients: []
    });
    const [newStudent, setNewStudent] = useState({
        name: '',
        email: '',
        class: '',
        phone: '',
        parentEmail: ''
    });
    const [expandedCard, setExpandedCard] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    const socket = useSocket();
    const { user } = useAuth();

    // Real-time socket connection
    useEffect(() => {
        if (socket && socket.socket && user) {
            try {
                socket.socket.emit('admin:students:subscribe', { adminId: user._id });
            } catch (err) {
                console.error("❌ Error subscribing to admin students:", err.message);
            }
            
            socket.socket.on('admin:students:data', (data) => {
                setStudents(data);
                setLoading(false);
            });
            
            socket.socket.on('admin:students:update', (updatedData) => {
                setStudents(updatedData);
                calculateStats(updatedData);
            });
            
            socket.socket.on('admin:student:status_changed', (data) => {
                setStudents(prev => prev.map(student => 
                    student._id === data.studentId 
                        ? { ...student, status: data.status, lastActive: data.lastActive }
                        : student
                ));
                toast.success(`Student status updated: ${data.status}`);
            });
            
            socket.socket.on('admin:student:deleted', (data) => {
                setStudents(prev => prev.filter(student => student._id !== data.studentId));
                toast.success('Student removed successfully');
            });
            
            return () => {
                try {
                    if (socket && socket.socket) {
                        socket.socket.off('admin:students:data');
                        socket.socket.off('admin:students:update');
                        socket.socket.off('admin:student:status_changed');
                        socket.socket.off('admin:student:deleted');
                    }
                } catch (err) {
                    console.error("❌ Error cleaning up admin students socket listeners:", err.message);
                }
            };
        }
    }, [socket, user]);

    // Log page view
    useEffect(() => {
        logActivity({
            activityType: "page_view",
            description: "Viewed All Students admin dashboard",
            metadata: {
                page: "/admin/students",
                timestamp: new Date().toISOString()
            },
            pageUrl: window.location.pathname
        });
    }, []);

    // Calculate comprehensive stats
    const calculateStats = useCallback((studentData) => {
        const totalStudents = studentData.length;
        const activeStudents = studentData.filter(s => s.status === 'active').length;
        const inactiveStudents = totalStudents - activeStudents;
        
        const topPerformer = studentData.reduce((top, student) => 
            (!top || (student.progress?.xp || 0) > (top.progress?.xp || 0)) ? student : top
        , null);
        
        const totalXP = studentData.reduce((sum, student) => sum + (student.progress?.xp || 0), 0);
        const averageXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newThisWeek = studentData.filter(s => 
            new Date(s.createdAt) >= oneWeekAgo
        ).length;
        
        const classDistribution = studentData.reduce((acc, student) => {
            const className = student.class || 'Unassigned';
            acc[className] = (acc[className] || 0) + 1;
            return acc;
        }, {});
        
        setStats({
            total: totalStudents,
            active: activeStudents,
            inactive: inactiveStudents,
            topPerformer,
            averageXP,
            totalXP,
            newThisWeek,
            classDistribution
        });
    }, []);

    // Load students data
    const loadStudents = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchAllStudents();
            setStudents(response.data || response);
            calculateStats(response.data || response);
        } catch (error) {
            console.error('Error loading students:', error);
            toast.error('Failed to load students data');
        } finally {
            setLoading(false);
        }
    }, [calculateStats]);

    // Refresh data
    const refreshData = useCallback(async () => {
        setRefreshing(true);
        await loadStudents();
        setRefreshing(false);
        toast.success('Data refreshed successfully');
    }, [loadStudents]);

    // Filter and sort students
    const processedStudents = useMemo(() => {
        let filtered = [...students];

        // Apply search filter
        if (search) {
            filtered = filtered.filter(student => 
                student.name?.toLowerCase().includes(search.toLowerCase()) ||
                student.email?.toLowerCase().includes(search.toLowerCase()) ||
                student.class?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply filters
        if (filters.status !== 'all') {
            filtered = filtered.filter(student => student.status === filters.status);
        }
        
        if (filters.class !== 'all') {
            filtered = filtered.filter(student => student.class === filters.class);
        }
        
        if (filters.xpRange !== 'all') {
            const ranges = {
                'low': [0, 100],
                'medium': [101, 500],
                'high': [501, 1000],
                'expert': [1001, Infinity]
            };
            const [min, max] = ranges[filters.xpRange];
            filtered = filtered.filter(student => {
                const xp = student.progress?.xp || 0;
                return xp >= min && xp <= max;
            });
        }

        if (filters.lastActive !== 'all') {
            const now = new Date();
            const ranges = {
                'week': 7,
                'month': 30,
                'quarter': 90
            };
            const days = ranges[filters.lastActive];
            if (days) {
                const cutoff = new Date();
                cutoff.setDate(now.getDate() - days);
                filtered = filtered.filter(student => new Date(student.lastActive) >= cutoff);
            }
        }

        if (filters.achievements !== 'all') {
            const ranges = {
                'none': [0, 0],
                '1-5': [1, 5],
                '6-10': [6, 10],
                '11+': [11, Infinity]
            };
            const [min, max] = ranges[filters.achievements];
            filtered = filtered.filter(student => {
                const count = student.achievements?.length || 0;
                return count >= min && count <= max;
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'xp':
                    aValue = a.progress?.xp || 0;
                    bValue = b.progress?.xp || 0;
                    break;
                case 'level':
                    aValue = a.progress?.level || 1;
                    bValue = b.progress?.level || 1;
                    break;
                case 'lastActive':
                    aValue = new Date(a.lastActive || 0);
                    bValue = new Date(b.lastActive || 0);
                    break;
                case 'class':
                    aValue = a.class || '';
                    bValue = b.class || '';
                    break;
                default:
                    aValue = a[sortBy] || '';
                    bValue = b[sortBy] || '';
            }
            
            if (sortOrder === 'desc') {
                return bValue > aValue ? 1 : -1;
            }
            return aValue > bValue ? 1 : -1;
        });

        return filtered;
    }, [students, search, filters, sortBy, sortOrder]);

    // Handle student actions
    const handleStudentAction = async (action, studentId, data = {}) => {
        try {
            setActionLoading(prev => ({ ...prev, [studentId]: true }));
            
            switch (action) {
                case 'updateStatus':
                    await updateStudentStatus(studentId, data.status);
                    break;
                case 'delete':
                    if (window.confirm('Are you sure you want to delete this student?')) {
                        await deleteStudent(studentId);
                    }
                    break;
                case 'sendMessage':
                    // Handle individual message sending
                    break;
                default:
                    break;
            }
            
            logActivity({
                activityType: "admin_action",
                description: `Performed ${action} on student`,
                metadata: {
                    action,
                    studentId,
                    data,
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
            
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
            toast.error(`Failed to ${action} student`);
        } finally {
            setActionLoading(prev => ({ ...prev, [studentId]: false }));
        }
    };

    // Handle bulk actions
    const handleBulkAction = async (action) => {
        if (selectedStudents.length === 0) {
            toast.error('Please select students first');
            return;
        }

        try {
            switch (action) {
                case 'message':
                    setBulkMessage({
                        show: true,
                        subject: '',
                        message: '',
                        recipients: selectedStudents
                    });
                    break;
                case 'activate':
                    await Promise.all(selectedStudents.map(id => 
                        updateStudentStatus(id, 'active')
                    ));
                    toast.success(`Activated ${selectedStudents.length} students`);
                    break;
                case 'deactivate':
                    await Promise.all(selectedStudents.map(id => 
                        updateStudentStatus(id, 'inactive')
                    ));
                    toast.success(`Deactivated ${selectedStudents.length} students`);
                    break;
                case 'delete':
                    if (window.confirm(`Delete ${selectedStudents.length} students?`)) {
                        await Promise.all(selectedStudents.map(id => deleteStudent(id)));
                        toast.success(`Deleted ${selectedStudents.length} students`);
                    }
                    break;
                default:
                    break;
            }
            setSelectedStudents([]);
        } catch (error) {
            console.error('Bulk action error:', error);
            toast.error('Failed to perform bulk action');
        }
    };

    // Handle student creation
    const handleCreateStudent = async (e) => {
        e.preventDefault();
        try {
            await createStudentAccount(newStudent);
            toast.success('Student account created successfully');
            setShowAddStudent(false);
            setNewStudent({ name: '', email: '', class: '', phone: '', parentEmail: '' });
            await loadStudents();
        } catch (error) {
            console.error('Error creating student:', error);
            toast.error('Failed to create student account');
        }
    };

    // Handle bulk message sending
    const handleSendBulkMessage = async () => {
        try {
            await sendBulkMessage({
                recipients: bulkMessage.recipients,
                subject: bulkMessage.subject,
                message: bulkMessage.message
            });
            toast.success(`Message sent to ${bulkMessage.recipients.length} students`);
            setBulkMessage({ show: false, subject: '', message: '', recipients: [] });
        } catch (error) {
            console.error('Error sending bulk message:', error);
            toast.error('Failed to send message');
        }
    };

    // Load initial data
    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    // Update filtered students
    useEffect(() => {
        setFilteredStudents(processedStudents);
    }, [processedStudents]);

    // CSV export headers
    const csvHeaders = [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Class", key: "class" },
        { label: "XP", key: "progress.xp" },
        { label: "Level", key: "progress.level" },
        { label: "Status", key: "status" },
        { label: "Last Active", key: "lastActive" },
        { label: "Achievements", key: "achievements.length" },
        { label: "Streak", key: "progress.streak" },
        { label: "Join Date", key: "createdAt" }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const cardVariants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
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
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black mb-2 flex items-center gap-3">
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    All Students
                                </span>
                                <Users className="text-indigo-600 w-10 h-10" />
                            </h1>
                            <p className="text-gray-600 text-lg font-medium">
                                Manage and monitor all registered students
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={refreshData}
                                disabled={refreshing}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                {refreshing ? 'Refreshing...' : 'Refresh'}
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddStudent(true)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add Student
                            </motion.button>
                            
                            {filteredStudents.length > 0 && (
                                <CSVLink
                                    data={filteredStudents}
                                    headers={csvHeaders}
                                    filename={`students_${new Date().toISOString().split('T')[0]}.csv`}
                                    className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </CSVLink>
                            )}
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Students</p>
                                    <p className="text-3xl font-black text-indigo-600">{stats.total}</p>
                                </div>
                                <Users className="w-8 h-8 text-indigo-500" />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Active</p>
                                    <p className="text-3xl font-black text-green-600">{stats.active}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Inactive</p>
                                    <p className="text-3xl font-black text-red-600">{stats.inactive}</p>
                                </div>
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Avg XP</p>
                                    <p className="text-3xl font-black text-purple-600">{stats.averageXP}</p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-purple-500" />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">New This Week</p>
                                    <p className="text-3xl font-black text-orange-600">{stats.newThisWeek}</p>
                                </div>
                                <Calendar className="w-8 h-8 text-orange-500" />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Top Performer</p>
                                    <p className="text-lg font-black text-yellow-600 truncate">
                                        {stats.topPerformer?.name || 'N/A'}
                                    </p>
                                </div>
                                <Crown className="w-8 h-8 text-yellow-500" />
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Controls Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                                    showFilters 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                                className="px-4 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-2"
                            >
                                {viewMode === 'grid' ? <BarChart3 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                {viewMode === 'grid' ? 'Table' : 'Grid'}
                            </motion.button>

                            {selectedStudents.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowBulkActions(!showBulkActions)}
                                    className="px-4 py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Bulk Actions ({selectedStudents.length})
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Filters Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-gray-200 pt-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                        <select
                                            value={filters.class}
                                            onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="all">All Classes</option>
                                            {Object.keys(stats.classDistribution).map(className => (
                                                <option key={className} value={className}>{className}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">XP Range</label>
                                        <select
                                            value={filters.xpRange}
                                            onChange={(e) => setFilters(prev => ({ ...prev, xpRange: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="all">All XP</option>
                                            <option value="low">0-100 XP</option>
                                            <option value="medium">101-500 XP</option>
                                            <option value="high">501-1000 XP</option>
                                            <option value="expert">1001+ XP</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Active</label>
                                        <select
                                            value={filters.lastActive}
                                            onChange={(e) => setFilters(prev => ({ ...prev, lastActive: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="all">All Time</option>
                                            <option value="week">Last Week</option>
                                            <option value="month">Last Month</option>
                                            <option value="quarter">Last Quarter</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                                        <select
                                            value={filters.achievements}
                                            onChange={(e) => setFilters(prev => ({ ...prev, achievements: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="all">All Achievements</option>
                                            <option value="none">No Achievements</option>
                                            <option value="1-5">1-5 Achievements</option>
                                            <option value="6-10">6-10 Achievements</option>
                                            <option value="11+">11+ Achievements</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bulk Actions Panel */}
                    <AnimatePresence>
                        {showBulkActions && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-gray-200 pt-6 mt-6"
                            >
                                <div className="flex flex-wrap gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleBulkAction('message')}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Send Message
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleBulkAction('activate')}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        Activate
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleBulkAction('deactivate')}
                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <UserX className="w-4 h-4" />
                                        Deactivate
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleBulkAction('delete')}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Add Student Modal */}
                <AnimatePresence>
                    {showAddStudent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl p-8 w-full max-w-md"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Add New Student</h2>
                                    <button onClick={() => setShowAddStudent(false)}>
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>
                                <form onSubmit={handleCreateStudent}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                value={newStudent.name}
                                                onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={newStudent.email}
                                                onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Class</label>
                                            <input
                                                type="text"
                                                value={newStudent.class}
                                                onChange={(e) => setNewStudent(prev => ({ ...prev, class: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                value={newStudent.phone}
                                                onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                                            <input
                                                type="email"
                                                value={newStudent.parentEmail}
                                                onChange={(e) => setNewStudent(prev => ({ ...prev, parentEmail: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddStudent(false)}
                                            className="px-4 py-2 bg-gray-200 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bulk Message Modal */}
                <AnimatePresence>
                    {bulkMessage.show && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl p-8 w-full max-w-md"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Send Bulk Message</h2>
                                    <button onClick={() => setBulkMessage(prev => ({ ...prev, show: false }))}>
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                                        <input
                                            type="text"
                                            value={bulkMessage.subject}
                                            onChange={(e) => setBulkMessage(prev => ({ ...prev, subject: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Message</label>
                                        <textarea
                                            value={bulkMessage.message}
                                            onChange={(e) => setBulkMessage(prev => ({ ...prev, message: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            rows={4}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setBulkMessage(prev => ({ ...prev, show: false }))}
                                        className="px-4 py-2 bg-gray-200 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendBulkMessage}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Students Display */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No students found matching your criteria.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredStudents.map(student => (
                            <motion.div
                                key={student._id}
                                variants={cardVariants}
                                className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student._id)}
                                            onChange={() => {
                                                setSelectedStudents(prev =>
                                                    prev.includes(student._id)
                                                        ? prev.filter(id => id !== student._id)
                                                        : [...prev, student._id]
                                                );
                                            }}
                                            className="h-5 w-5 text-indigo-600"
                                        />
                                        <h3 className="text-lg font-bold truncate">{student.name}</h3>
                                    </div>
                                    <button
                                        onClick={() => setExpandedCard(expandedCard === student._id ? null : student._id)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        {expandedCard === student._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> {student.email}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" /> {student.class || 'Unassigned'}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Zap className="w-4 h-4" /> XP: {student.progress?.xp || 0}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Trophy className="w-4 h-4" /> Level: {student.progress?.level || 1}
                                    </p>
                                </div>
                                <AnimatePresence>
                                    {expandedCard === student._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-4 border-t border-gray-200 pt-4"
                                        >
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" /> 
                                                    Last Active: {new Date(student.lastActive).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <Award className="w-4 h-4" /> 
                                                    Achievements: {student.achievements?.length || 0}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <Flame className="w-4 h-4" /> 
                                                    Streak: {student.progress?.streak || 0} days
                                                </p>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStudentAction('updateStatus', student._id, { status: student.status === 'active' ? 'inactive' : 'active' })}
                                                    disabled={actionLoading[student._id]}
                                                    className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                                                        student.status === 'active' ? 'bg-orange-500' : 'bg-green-500'
                                                    } text-white`}
                                                >
                                                    {student.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                    {student.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStudentAction('delete', student._id)}
                                                    disabled={actionLoading[student._id]}
                                                    className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="p-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedStudents(filteredStudents.map(s => s._id));
                                                } else {
                                                    setSelectedStudents([]);
                                                }
                                            }}
                                            className="h-5 w-5 text-indigo-600"
                                        />
                                    </th>
                                    {['name', 'email', 'class', 'xp', 'level', 'status', 'lastActive'].map(field => (
                                        <th
                                            key={field}
                                            className="p-4 text-left text-sm font-medium text-gray-700 cursor-pointer"
                                            onClick={() => {
                                                setSortBy(field);
                                                setSortOrder(sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc');
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                                {sortBy === field && (
                                                    sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="p-4 text-left text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student._id)}
                                                onChange={() => {
                                                    setSelectedStudents(prev =>
                                                        prev.includes(student._id)
                                                            ? prev.filter(id => id !== student._id)
                                                            : [...prev, student._id]
                                                    );
                                                }}
                                                className="h-5 w-5 text-indigo-600"
                                            />
                                        </td>
                                        <td className="p-4">{student.name}</td>
                                        <td className="p-4">{student.email}</td>
                                        <td className="p-4">{student.class || 'Unassigned'}</td>
                                        <td className="p-4">{student.progress?.xp || 0}</td>
                                        <td className="p-4">{student.progress?.level || 1}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="p-4">{new Date(student.lastActive).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStudentAction('updateStatus', student._id, { status: student.status === 'active' ? 'inactive' : 'active' })}
                                                    disabled={actionLoading[student._id]}
                                                    className={`px-3 py-1 rounded-lg flex items-center gap-2 ${
                                                        student.status === 'active' ? 'bg-orange-500' : 'bg-green-500'
                                                    } text-white text-sm`}
                                                >
                                                    {student.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                    {student.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStudentAction('delete', student._id)}
                                                    disabled={actionLoading[student._id]}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-lg flex items-center gap-2 text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}