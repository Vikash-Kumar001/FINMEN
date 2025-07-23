import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    Search, 
    Download, 
    Filter, 
    ChevronDown,
    ChevronUp,
    X,
    Mail,
    Phone,
    UserPlus,
    CheckCircle,
    XCircle,
    RefreshCw,
    Settings,
    Send,
    UserCheck,
    UserX,
    Trash2,
    Shield,
    Calendar,
    AlertCircle
} from "lucide-react";
import { CSVLink } from "react-csv";
import { toast } from "react-hot-toast";
import { logActivity } from "../../services/activityService";
import { 
    getPendingEducators, 
    approveEducator, 
    blockEducator, 
    fetchAllEducators,
    deleteEducator,
    exportEducatorData,
    fetchEducatorStats,
    sendBulkEducatorMessage,
    createEducatorAccount
} from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";

export default function AdminEducatorPanel() {
    const [educators, setEducators] = useState([]);
    const [filteredEducators, setFilteredEducators] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEducators, setSelectedEducators] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showAddEducator, setShowAddEducator] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({
        status: 'pending', // Default to pending for this panel
        department: 'all',
        lastActive: 'all'
    });
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        pending: 0,
        blocked: 0,
        newThisWeek: 0,
        departmentDistribution: {}
    });
    const [bulkMessage, setBulkMessage] = useState({
        show: false,
        subject: '',
        message: '',
        recipients: []
    });
    const [newEducator, setNewEducator] = useState({
        name: '',
        email: '',
        department: '',
        phone: ''
    });
    const [expandedCard, setExpandedCard] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    const { user } = useAuth();

    // Calculate comprehensive stats
    const calculateStats = useCallback((educatorData) => {
        const totalEducators = educatorData.length;
        const activeEducators = educatorData.filter(e => e.status === 'active').length;
        const pendingEducators = educatorData.filter(e => e.status === 'pending').length;
        const blockedEducators = educatorData.filter(e => e.status === 'blocked').length;
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newThisWeek = educatorData.filter(e => 
            new Date(e.createdAt) >= oneWeekAgo
        ).length;
        
        const departmentDistribution = educatorData.reduce((acc, educator) => {
            const deptName = educator.department || 'Unassigned';
            acc[deptName] = (acc[deptName] || 0) + 1;
            return acc;
        }, {});
        
        setStats({
            total: totalEducators,
            active: activeEducators,
            pending: pendingEducators,
            blocked: blockedEducators,
            newThisWeek,
            departmentDistribution
        });
    }, []);

    // Load educators data
    const loadEducators = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPendingEducators(); // Focus on pending educators
            const data = response.data || response;
            setEducators(data);
            setFilteredEducators(data);
            calculateStats(data);
        } catch (error) {
            console.error('Error loading educators:', error);
            setError(error.message || 'Failed to fetch educator data');
            toast.error('Failed to load educators');
        } finally {
            setLoading(false);
        }
    }, [calculateStats]);

    // Refresh data
    const refreshData = useCallback(async () => {
        setRefreshing(true);
        await loadEducators();
        setRefreshing(false);
        toast.success('Data refreshed successfully');
    }, [loadEducators]);

    // Log page view
    useEffect(() => {
        logActivity({
            activityType: "page_view",
            description: "Viewed Admin Educator Panel",
            metadata: {
                page: "/admin/educators/pending",
                timestamp: new Date().toISOString()
            },
            pageUrl: window.location.pathname
        });
        loadEducators();
    }, [loadEducators]);

    // Filter and sort educators
    const processedEducators = useMemo(() => {
        let filtered = [...educators];

        // Apply search filter
        if (search) {
            filtered = filtered.filter(educator => 
                educator.name?.toLowerCase().includes(search.toLowerCase()) ||
                educator.email?.toLowerCase().includes(search.toLowerCase()) ||
                educator.department?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply filters
        if (filters.status !== 'all') {
            filtered = filtered.filter(educator => educator.status === filters.status);
        }
        
        if (filters.department !== 'all') {
            filtered = filtered.filter(educator => educator.department === filters.department);
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
                filtered = filtered.filter(educator => new Date(educator.lastActive) >= cutoff);
            }
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'lastActive':
                    aValue = new Date(a.lastActive || 0);
                    bValue = new Date(b.lastActive || 0);
                    break;
                case 'department':
                    aValue = a.department || '';
                    bValue = b.department || '';
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
    }, [educators, search, filters, sortBy, sortOrder]);

    // Update filtered educators
    useEffect(() => {
        setFilteredEducators(processedEducators);
    }, [processedEducators]);

    // Handle educator actions
    const handleEducatorAction = async (action, educatorId, data = {}) => {
        try {
            setActionLoading(prev => ({ ...prev, [educatorId]: true }));
            
            switch (action) {
                case 'approve':
                    await approveEducator(educatorId);
                    setEducators(prev => prev.filter(e => e._id !== educatorId));
                    setFilteredEducators(prev => prev.filter(e => e._id !== educatorId));
                    toast.success('Educator approved successfully');
                    break;
                case 'block':
                    await blockEducator(educatorId);
                    setEducators(prev => prev.filter(e => e._id !== educatorId));
                    setFilteredEducators(prev => prev.filter(e => e._id !== educatorId));
                    toast.success('Educator blocked successfully');
                    break;
                case 'delete':
                    if (window.confirm('Are you sure you want to delete this educator?')) {
                        await deleteEducator(educatorId);
                        setEducators(prev => prev.filter(e => e._id !== educatorId));
                        setFilteredEducators(prev => prev.filter(e => e._id !== educatorId));
                        toast.success('Educator deleted successfully');
                    }
                    break;
                default:
                    break;
            }
            
            logActivity({
                activityType: "admin_action",
                description: `Performed ${action} on educator`,
                metadata: {
                    action,
                    educatorId,
                    data,
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
            
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
            toast.error(`Failed to ${action} educator`);
        } finally {
            setActionLoading(prev => ({ ...prev, [educatorId]: false }));
        }
    };

    // Handle bulk actions
    const handleBulkAction = async (action) => {
        if (selectedEducators.length === 0) {
            toast.error('Please select educators first');
            return;
        }

        try {
            switch (action) {
                case 'message':
                    setBulkMessage({
                        show: true,
                        subject: '',
                        message: '',
                        recipients: selectedEducators
                    });
                    break;
                case 'approve':
                    await Promise.all(selectedEducators.map(id => approveEducator(id)));
                    setEducators(prev => prev.filter(e => !selectedEducators.includes(e._id)));
                    setFilteredEducators(prev => prev.filter(e => !selectedEducators.includes(e._id)));
                    toast.success(`Approved ${selectedEducators.length} educators`);
                    break;
                case 'block':
                    await Promise.all(selectedEducators.map(id => blockEducator(id)));
                    setEducators(prev => prev.filter(e => !selectedEducators.includes(e._id)));
                    setFilteredEducators(prev => prev.filter(e => !selectedEducators.includes(e._id)));
                    toast.success(`Blocked ${selectedEducators.length} educators`);
                    break;
                case 'delete':
                    if (window.confirm(`Delete ${selectedEducators.length} educators?`)) {
                        await Promise.all(selectedEducators.map(id => deleteEducator(id)));
                        setEducators(prev => prev.filter(e => !selectedEducators.includes(e._id)));
                        setFilteredEducators(prev => prev.filter(e => !selectedEducators.includes(e._id)));
                        toast.success(`Deleted ${selectedEducators.length} educators`);
                    }
                    break;
                default:
                    break;
            }
            setSelectedEducators([]);
        } catch (error) {
            console.error('Bulk action error:', error);
            toast.error('Failed to perform bulk action');
        }
    };

    // Handle educator creation
    const handleCreateEducator = async (e) => {
        e.preventDefault();
        try {
            await createEducatorAccount(newEducator);
            toast.success('Educator account created successfully');
            setShowAddEducator(false);
            setNewEducator({ name: '', email: '', department: '', phone: '' });
            await loadEducators();
        } catch (error) {
            console.error('Error creating educator:', error);
            toast.error('Failed to create educator account');
        }
    };

    // Handle bulk message sending
    const handleSendBulkMessage = async () => {
        try {
            await sendBulkEducatorMessage({
                recipients: bulkMessage.recipients,
                subject: bulkMessage.subject,
                message: bulkMessage.message
            });
            toast.success(`Message sent to ${bulkMessage.recipients.length} educators`);
            setBulkMessage({ show: false, subject: '', message: '', recipients: [] });
        } catch (error) {
            console.error('Error sending bulk message:', error);
            toast.error('Failed to send message');
        }
    };

    // CSV export headers
    const csvHeaders = [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Department", key: "department" },
        { label: "Status", key: "status" },
        { label: "Last Active", key: "lastActive" },
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
                                    Pending Educators
                                </span>
                                <Users className="text-indigo-600 w-10 h-10" />
                            </h1>
                            <p className="text-gray-600 text-lg font-medium">
                                Manage pending educator registrations
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
                                onClick={() => setShowAddEducator(true)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add Educator
                            </motion.button>
                            
                            {filteredEducators.length > 0 && (
                                <CSVLink
                                    data={filteredEducators}
                                    headers={csvHeaders}
                                    filename={`pending_educators_${new Date().toISOString().split('T')[0]}.csv`}
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
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Pending</p>
                                    <p className="text-3xl font-black text-indigo-600">{stats.pending}</p>
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
                                    <p className="text-gray-600 text-sm font-medium">New This Week</p>
                                    <p className="text-3xl font-black text-green-600">{stats.newThisWeek}</p>
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
                                    <p className="text-gray-600 text-sm font-medium">Active</p>
                                    <p className="text-3xl font-black text-orange-600">{stats.active}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-orange-500" />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Blocked</p>
                                    <p className="text-3xl font-black text-red-600">{stats.blocked}</p>
                                </div>
                                <XCircle className="w-8 h-8 text-red-500" />
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
                                placeholder="Search educators..."
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
                                {viewMode === 'grid' ? <Users className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                {viewMode === 'grid' ? 'Table' : 'Grid'}
                            </motion.button>

                            {selectedEducators.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowBulkActions(!showBulkActions)}
                                    className="px-4 py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Bulk Actions ({selectedEducators.length})
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="active">Active</option>
                                            <option value="blocked">Blocked</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                        <select
                                            value={filters.department}
                                            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="all">All Departments</option>
                                            {Object.keys(stats.departmentDistribution).map(deptName => (
                                                <option key={deptName} value={deptName}>{deptName}</option>
                                            ))}
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
                                        onClick={() => handleBulkAction('approve')}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        Approve
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleBulkAction('block')}
                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <UserX className="w-4 h-4" />
                                        Block
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

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3 mb-8"
                    >
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        <p className="text-red-700">{error}</p>
                    </motion.div>
                )}

                {/* Add Educator Modal */}
                <AnimatePresence>
                    {showAddEducator && (
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
                                    <h2 className="text-2xl font-bold">Add New Educator</h2>
                                    <button onClick={() => setShowAddEducator(false)}>
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>
                                <form onSubmit={handleCreateEducator}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                value={newEducator.name}
                                                onChange={(e) => setNewEducator(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={newEducator.email}
                                                onChange={(e) => setNewEducator(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <input
                                                type="text"
                                                value={newEducator.department}
                                                onChange={(e) => setNewEducator(prev => ({ ...prev, department: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                value={newEducator.phone}
                                                onChange={(e) => setNewEducator(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddEducator(false)}
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

                {/* Educators Display */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
                    </div>
                ) : filteredEducators.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No educators found matching your criteria.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredEducators.map(educator => (
                            <motion.div
                                key={educator._id}
                                variants={cardVariants}
                                className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedEducators.includes(educator._id)}
                                            onChange={() => {
                                                setSelectedEducators(prev =>
                                                    prev.includes(educator._id)
                                                        ? prev.filter(id => id !== educator._id)
                                                        : [...prev, educator._id]
                                                );
                                            }}
                                            className="h-5 w-5 text-indigo-600"
                                        />
                                        <h3 className="text-lg font-bold truncate">{educator.name}</h3>
                                    </div>
                                    <button
                                        onClick={() => setExpandedCard(expandedCard === educator._id ? null : educator._id)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        {expandedCard === educator._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> {educator.email}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> {educator.department || 'Unassigned'}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Status: {educator.status}
                                    </p>
                                </div>
                                <AnimatePresence>
                                    {expandedCard === educator._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-4 border-t border-gray-200 pt-4"
                                        >
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" /> 
                                                    Last Active: {new Date(educator.lastActive).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" /> 
                                                    Join Date: {new Date(educator.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <Shield className="w-4 h-4" /> 
                                                    Institution: {educator.institution || 'Not provided'}
                                                </p>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                {educator.status !== 'active' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleEducatorAction('approve', educator._id)}
                                                        disabled={actionLoading[educator._id]}
                                                        className="px-3 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                        Approve
                                                    </motion.button>
                                                )}
                                                {educator.status !== 'blocked' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleEducatorAction('block', educator._id)}
                                                        disabled={actionLoading[educator._id]}
                                                        className="px-3 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                        Block
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleEducatorAction('delete', educator._id)}
                                                    disabled={actionLoading[educator._id]}
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
                                            checked={selectedEducators.length === filteredEducators.length && filteredEducators.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedEducators(filteredEducators.map(e => e._id));
                                                } else {
                                                    setSelectedEducators([]);
                                                }
                                            }}
                                            className="h-5 w-5 text-indigo-600"
                                        />
                                    </th>
                                    {['name', 'email', 'department', 'status', 'lastActive'].map(field => (
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
                                {filteredEducators.map(educator => (
                                    <tr key={educator._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedEducators.includes(educator._id)}
                                                onChange={() => {
                                                    setSelectedEducators(prev =>
                                                        prev.includes(educator._id)
                                                            ? prev.filter(id => id !== educator._id)
                                                            : [...prev, educator._id]
                                                    );
                                                }}
                                                className="h-5 w-5 text-indigo-600"
                                            />
                                        </td>
                                        <td className="p-4">{educator.name}</td>
                                        <td className="p-4">{educator.email}</td>
                                        <td className="p-4">{educator.department || 'Unassigned'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                educator.status === 'active' ? 'bg-green-100 text-green-800' :
                                                educator.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {educator.status}
                                            </span>
                                        </td>
                                        <td className="p-4">{new Date(educator.lastActive).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {educator.status !== 'active' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleEducatorAction('approve', educator._id)}
                                                        disabled={actionLoading[educator._id]}
                                                        className="px-3 py-1 bg-green-500 text-white rounded-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                        Approve
                                                    </motion.button>
                                                )}
                                                {educator.status !== 'blocked' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleEducatorAction('block', educator._id)}
                                                        disabled={actionLoading[educator._id]}
                                                        className="px-3 py-1 bg-orange-500 text-white rounded-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                        Block
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleEducatorAction('delete', educator._id)}
                                                    disabled={actionLoading[educator._id]}
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