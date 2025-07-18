import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertCircle,
    Users,
    GraduationCap,
    UserCheck,
    Heart,
    TrendingUp,
    Filter,
    Download,
    ChevronDown,
    ChevronUp,
    RefreshCw,
} from "lucide-react";
import { CSVLink } from "react-csv";
import { toast } from "react-hot-toast";
import { logActivity } from "../../services/activityService";
import { fetchAnalyticsData } from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const StatCard = ({ title, value, icon, gradient }) => (
    <motion.div
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50"
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ duration: 0.3 }}
    >
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${gradient}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-600 font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    </motion.div>
);

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        timeRange: 'all',
        userType: 'all',
        department: 'all',
    });
    const [expandedRow, setExpandedRow] = useState(null);
    const { user } = useAuth();

    // Load analytics data
    const loadAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchAnalyticsData(filters);
            const data = response.data || response;
            setStats(data);
        } catch (error) {
            console.error('Error loading analytics:', error);
            setError(error.message || 'Failed to fetch analytics data');
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Refresh data
    const refreshData = useCallback(async () => {
        setRefreshing(true);
        await loadAnalytics();
        setRefreshing(false);
        toast.success('Analytics refreshed successfully');
    }, [loadAnalytics]);

    // Log page view
    useEffect(() => {
        logActivity({
            activityType: "page_view",
            description: "Viewed Admin Analytics dashboard",
            metadata: {
                page: "/admin/analytics",
                timestamp: new Date().toISOString(),
            },
            pageUrl: window.location.pathname,
        });
        loadAnalytics();
    }, [loadAnalytics]);

    // Process analytics data for charts and table
    const processedData = useMemo(() => {
        if (!stats) return { moodData: [], missionData: [], chartData: { mood: {}, mission: {} } };

        const moodData = stats.moodStats?.map(item => ({
            name: item._id,
            count: item.count,
        })) || [];

        const missionData = stats.missionStats?.map(item => ({
            name: item._id,
            count: item.count,
        })) || [];

        const moodChartData = {
            labels: moodData.map(item => item.name),
            datasets: [{
                label: 'Mood Count',
                data: moodData.map(item => item.count),
                backgroundColor: 'rgba(79, 70, 229, 0.6)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
                borderRadius: 4,
            }],
        };

        const missionChartData = {
            labels: missionData.map(item => item.name),
            datasets: [{
                label: 'Mission Count',
                data: missionData.map(item => item.count),
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
                borderRadius: 4,
            }],
        };

        return { moodData, missionData, chartData: { mood: moodChartData, mission: missionChartData } };
    }, [stats]);

    // CSV export data
    const csvHeaders = [
        { label: "Metric", key: "metric" },
        { label: "Value", key: "value" },
    ];

    const csvData = stats
        ? [
              { metric: "Total Users", value: stats.totalUsers },
              { metric: "Total Students", value: stats.totalStudents },
              { metric: "Total Educators", value: stats.totalEducators },
              { metric: "Total Mood Logs", value: stats.totalMoods },
              ...(stats.moodStats?.map(item => ({
                  metric: `Mood: ${item._id}`,
                  value: item.count,
              })) || []),
              ...(stats.missionStats?.map(item => ({
                  metric: `Mission Level: ${item._id}`,
                  value: item.count,
              })) || []),
          ]
        : [];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
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
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">Platform Analytics</h2>
                                <p className="text-gray-600 text-lg font-medium">
                                    In-depth insights into platform performance
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
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
                            <CSVLink
                                data={csvData}
                                headers={csvHeaders}
                                filename={`analytics_${new Date().toISOString().split('T')[0]}.csv`}
                                className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </CSVLink>
                        </div>
                    </div>
                </motion.div>

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

                {loading ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="animate-pulse"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
                            ))}
                        </div>
                        <div className="h-96 bg-slate-200 rounded-2xl mb-8"></div>
                        <div className="h-96 bg-slate-200 rounded-2xl"></div>
                    </motion.div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                title="Total Users"
                                value={stats.totalUsers}
                                icon={<Users className="w-5 h-5" />}
                                gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
                            />
                            <StatCard
                                title="Total Students"
                                value={stats.totalStudents}
                                icon={<GraduationCap className="w-5 h-5" />}
                                gradient="bg-gradient-to-r from-green-500 to-emerald-500"
                            />
                            <StatCard
                                title="Total Educators"
                                value={stats.totalEducators}
                                icon={<UserCheck className="w-5 h-5" />}
                                gradient="bg-gradient-to-r from-purple-500 to-violet-500"
                            />
                            <StatCard
                                title="Total Mood Logs"
                                value={stats.totalMoods}
                                icon={<Heart className="w-5 h-5" />}
                                gradient="bg-gradient-to-r from-pink-500 to-rose-500"
                            />
                        </div>

                        {/* Controls Section */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 mb-8"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div className="relative flex-1 max-w-md">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={filters.timeRange}
                                        onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    >
                                        <option value="all">All Time</option>
                                        <option value="week">Last Week</option>
                                        <option value="month">Last Month</option>
                                        <option value="quarter">Last Quarter</option>
                                    </select>
                                </div>
                                <div className="relative flex-1 max-w-md">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={filters.userType}
                                        onChange={(e) => setFilters(prev => ({ ...prev, userType: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    >
                                        <option value="all">All Users</option>
                                        <option value="student">Students</option>
                                        <option value="educator">Educators</option>
                                    </select>
                                </div>
                                <div className="relative flex-1 max-w-md">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={filters.department}
                                        onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    >
                                        <option value="all">All Departments</option>
                                        {stats?.departmentStats?.map(dept => (
                                            <option key={dept._id} value={dept._id}>
                                                {dept._id} ({dept.count})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                                    className="px-4 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-2"
                                >
                                    {viewMode === 'grid' ? <Users className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                    {viewMode === 'grid' ? 'Table View' : 'Grid View'}
                                </motion.button>
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
                                        <p className="text-sm text-gray-600">
                                            Additional filters can be applied to refine analytics data.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50"
                                >
                                    <h3 className="text-xl font-semibold mb-4 text-slate-800">
                                        Mood Distribution
                                    </h3>
                                    <div style={{ height: '300px' }}>
                                        <Bar
                                            data={processedData.chartData.mood}
                                            options={{
                                                scales: {
                                                    x: {
                                                        grid: { display: false },
                                                        ticks: { color: '#64748b' },
                                                    },
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: { color: 'rgba(0, 0, 0, 0.1)' },
                                                        ticks: { color: '#64748b' },
                                                    },
                                                },
                                                plugins: {
                                                    legend: { display: false },
                                                    tooltip: {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        titleColor: '#1e293b',
                                                        bodyColor: '#1e293b',
                                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                                        borderWidth: 1,
                                                        cornerRadius: 8,
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </motion.div>
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50"
                                >
                                    <h3 className="text-xl font-semibold mb-4 text-slate-800">
                                        Mission Completion (By Level)
                                    </h3>
                                    <div style={{ height: '300px' }}>
                                        <Bar
                                            data={processedData.chartData.mission}
                                            options={{
                                                scales: {
                                                    x: {
                                                        grid: { display: false },
                                                        ticks: { color: '#64748b' },
                                                    },
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: { color: 'rgba(0, 0, 0, 0.1)' },
                                                        ticks: { color: '#64748b' },
                                                    },
                                                },
                                                plugins: {
                                                    legend: { display: false },
                                                    tooltip: {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        titleColor: '#1e293b',
                                                        bodyColor: '#1e293b',
                                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                                        borderWidth: 1,
                                                        cornerRadius: 8,
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Table View */}
                        {viewMode === 'table' && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-x-auto"
                            >
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="p-4 text-left text-sm font-medium text-gray-700">
                                                Metric
                                            </th>
                                            <th className="p-4 text-left text-sm font-medium text-gray-700">
                                                Value
                                            </th>
                                            <th className="p-4 text-left text-sm font-medium text-gray-700">
                                                Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {csvData.map((row, index) => (
                                            <React.Fragment key={index}>
                                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="p-4">{row.metric}</td>
                                                    <td className="p-4">{row.value}</td>
                                                    <td className="p-4">
                                                        <button
                                                            onClick={() =>
                                                                setExpandedRow(
                                                                    expandedRow === index ? null : index
                                                                )
                                                            }
                                                            className="text-gray-500 hover:text-indigo-500"
                                                        >
                                                            {expandedRow === index ? (
                                                                <ChevronUp className="w-5 h-5" />
                                                            ) : (
                                                                <ChevronDown className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                                <AnimatePresence>
                                                    {expandedRow === index && (
                                                        <tr>
                                                            <td
                                                                colSpan="3"
                                                                className="p-4 bg-gray-50"
                                                            >
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{
                                                                        height: 'auto',
                                                                        opacity: 1,
                                                                    }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                >
                                                                    <p className="text-sm text-gray-600">
                                                                        {row.metric.includes('Mood')
                                                                            ? `Represents the count of ${row.metric} logged in the selected time range.`
                                                                            : row.metric.includes(
                                                                                  'Mission'
                                                                              )
                                                                            ? `Represents the count of ${row.metric} completed in the selected time range.`
                                                                            : `Total count for ${row.metric} in the selected time range.`}
                                                                    </p>
                                                                </motion.div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </AnimatePresence>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminAnalytics;