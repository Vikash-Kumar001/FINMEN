import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useSocket } from "../../context/SocketContext";
import { useNotification } from "../../context/NotificationContext";
import {
    Shield,
    Users,
    GraduationCap,
    Gift,
    BarChart3,
    Clock,
    AlertCircle,
    TrendingUp,
    Settings,
    Bell,
    ChevronRight,
    Eye,
    UserCheck,
    Lock,
    Database,
    Activity,
    FileText,
    Search,
    Zap,
    Filter,
    Wifi,
} from "lucide-react";
import { 
    fetchAdminDashboardData,
    fetchAdminStats,
    // eslint-disable-next-line no-unused-vars
    fetchAdminAnalytics, // Reserved for future analytics features
    fetchSystemHealth,
    fetchNotifications,
    refreshDashboardData
} from "../../services/dashboardService";
// eslint-disable-next-line no-unused-vars
import { toast } from "react-hot-toast";
import AdminStatsPanel from "./AdminStatsPanel";
import AllStudents from "./AllStudents";
import AllEducator from "./AllEducator";
import AdminRedemptions from "./AdminRedemptions";
import AdminAnalytics from "./AdminAnalytics";
import AdminUsersPanel from "./AdminUsersPanel";
import PendingEducators from "./PendingEducators";
import PendingApprovals from "./PendingApprovals";
import AdminSettings from "./AdminSettings";
import EducatorTracker from "./EducatorTracker";
import AuditLogs from "./AuditLogs";
import SecurityPanel from "./SecurityPanel";
import DataManagement from "./DataManagement";
import ReportsGenerator from "./ReportsGenerator";

const AdminDashboard = () => {
    const socket = useSocket();
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [systemStatus, setSystemStatus] = useState("Operational");
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [adminStats, setAdminStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalEducators: 0,
        pendingEducators: 0,
        redemptions: 0
    });
    const [systemHealth, setSystemHealth] = useState({});
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    
    // Load comprehensive admin dashboard data
    const loadAdminDashboardData = React.useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch comprehensive admin data
            const data = await fetchAdminDashboardData();
            setDashboardData(data);
            
            // Update individual state with fetched data
            if (data.stats) {
                setAdminStats(data.stats);
            }
            
            if (data.systemHealth) {
                setSystemHealth(data.systemHealth);
                setSystemStatus(data.systemHealth.status || "Operational");
            }
            
            if (data.recentActivity) {
                setRecentActivity(data.recentActivity);
            }
            
            toast.success("Admin dashboard loaded successfully!", {
                duration: 2000,
                position: "top-center",
                icon: "✅"
            });
            
        } catch (err) {
            console.error("❌ Failed to load admin dashboard data", err);
            
            // Load individual components with fallback
            try {
                const statsData = await fetchAdminStats();
                setAdminStats(statsData);
            } catch (statsErr) {
                console.warn("Using default admin stats due to API error:", statsErr.message);
            }
            
            try {
                const healthData = await fetchSystemHealth();
                setSystemHealth(healthData);
                setSystemStatus(healthData.status || "Operational");
            } catch (healthErr) {
                console.warn("Could not load system health data:", healthErr.message);
            }
            
            try {
                const notificationData = await fetchNotifications('admin', true);
                setNotifications(notificationData);
            } catch (notificationErr) {
                console.warn("Could not load admin notifications:", notificationErr.message);
            }
            
            toast.error("Some admin features may not be available. Please try refreshing.", {
                duration: 3000,
                position: "top-center",
                icon: "⚠️"
            });
        } finally {
            setLoading(false);
        }
    }, []);
    
    // Refresh admin dashboard data
    const handleRefreshData = async () => {
        try {
            setLoading(true);
            const refreshedData = await refreshDashboardData('admin');
            setDashboardData(refreshedData);
            
            // Update all data with refreshed information
            if (refreshedData.stats) setAdminStats(refreshedData.stats);
            if (refreshedData.systemHealth) {
                setSystemHealth(refreshedData.systemHealth);
                setSystemStatus(refreshedData.systemHealth.status || "Operational");
            }
            if (refreshedData.recentActivity) setRecentActivity(refreshedData.recentActivity);
            
            toast.success("Admin dashboard refreshed!", {
                duration: 2000,
                position: "top-center",
                icon: "🔄"
            });
        } catch (err) {
            console.error("Error refreshing admin data:", err.message);
            toast.error("Failed to refresh admin data", {
                duration: 3000,
                position: "top-center",
                icon: "❌"
            });
        } finally {
            setLoading(false);
        }
    };
    
    // Initial data load
    useEffect(() => {
        loadAdminDashboardData();
    }, [loadAdminDashboardData]);

    useEffect(() => {
        if (!socket || !socket.socket) return;

        // Safely add event listeners
        try {
            socket.socket.on("admin-notification", (data) => {
                notify(data?.message || "🔔 New admin notification received");
                setNotifications((prev) => [data?.message, ...prev.slice(0, 4)]);
            });

            socket.socket.on("system-status-update", (status) => {
                setSystemStatus(status || "Operational");
            });
        } catch (err) {
            console.error("❌ Error setting up socket listeners:", err.message);
        }

        return () => {
            // Safely remove event listeners during cleanup
            try {
                if (socket && socket.socket) {
                    socket.socket.off("admin-notification");
                    socket.socket.off("system-status-update");
                }
            } catch (err) {
                console.error("❌ Error cleaning up socket listeners:", err.message);
            }
        };
    }, [socket, notify]);

    // Real-time data simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemStatus((prev) => prev); // Update to match EducatorDashboard's real-time feel
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const tabConfig = [
        {
            id: "overview",
            title: "System Overview",
            icon: <BarChart3 className="w-8 h-8" />,
            gradient: "from-blue-400 via-indigo-400 to-purple-400",
            description: "Comprehensive system performance metrics",
            category: "overview",
            features: ["System metrics", "Performance overview", "Quick stats"],
        },
        {
            id: "students",
            title: "Student Management",
            icon: <GraduationCap className="w-8 h-8" />,
            gradient: "from-green-400 via-emerald-400 to-teal-400",
            description: "Manage student accounts and profiles",
            category: "management",
            features: [
                "Profile management",
                "Progress tracking",
                "Group assignments",
            ],
        },
        {
            id: "educators",
            title: "Educator Management",
            icon: <Users className="w-8 h-8" />,
            gradient: "from-purple-400 via-violet-400 to-indigo-400",
            description: "Manage all educator accounts",
            category: "management",
            features: ["Educator overview", "Account management", "Activity tracking"],
        },
        {
            id: "educator-tracker",
            title: "Educator Monitoring",
            icon: <Eye className="w-8 h-8" />,
            gradient: "from-teal-400 via-cyan-400 to-blue-400",
            description: "Real-time educator activity tracking",
            category: "tracking",
            features: ["Live monitoring", "Activity reports", "Performance insights"],
        },
        {
            id: "pending",
            title: "Approval Queue",
            icon: <Clock className="w-8 h-8" />,
            gradient: "from-orange-400 via-red-400 to-pink-400",
            description: "Review all stakeholder registrations",
            category: "management",
            features: ["All stakeholder approvals", "Real-time updates", "Bulk actions"],
        },
        {
            id: "redemptions",
            title: "Reward Redemptions",
            icon: <Gift className="w-8 h-8" />,
            gradient: "from-pink-400 via-rose-400 to-red-400",
            description: "Manage and approve reward claims",
            category: "rewards",
            features: ["Reward tracking", "Approval system", "Redemption history"],
        },
        {
            id: "analytics",
            title: "Advanced Analytics",
            icon: <TrendingUp className="w-8 h-8" />,
            gradient: "from-cyan-400 via-blue-400 to-indigo-400",
            description: "In-depth platform analytics and trends",
            category: "analytics",
            features: ["Trend analysis", "Custom reports", "Data visualization"],
        },
        {
            id: "users",
            title: "Admin Access",
            icon: <Shield className="w-8 h-8" />,
            gradient: "from-gray-400 via-slate-400 to-zinc-400",
            description: "Control admin user permissions",
            category: "system",
            features: ["Permission management", "Role settings", "Access control"],
        },
        {
            id: "settings",
            title: "System Configuration",
            icon: <Settings className="w-8 h-8" />,
            gradient: "from-amber-400 via-yellow-400 to-orange-400",
            description: "Customize platform settings and policies",
            category: "system",
            features: ["Platform settings", "Policy management", "Integrations"],
        },
        {
            id: "security",
            title: "Security Management",
            icon: <Lock className="w-8 h-8" />,
            gradient: "from-red-400 via-orange-400 to-yellow-400",
            description: "Monitor and enhance security protocols",
            category: "security",
            features: ["Security logs", "Threat detection", "Access monitoring"],
        },
        {
            id: "audit",
            title: "Audit Logs",
            icon: <Activity className="w-8 h-8" />,
            gradient: "from-teal-400 via-cyan-400 to-blue-400",
            description: "Track system and user activities",
            category: "tracking",
            features: ["Activity logs", "User tracking", "System events"],
        },
        {
            id: "data",
            title: "Data Management",
            icon: <Database className="w-8 h-8" />,
            gradient: "from-indigo-400 via-blue-400 to-cyan-400",
            description: "Handle data backups and migrations",
            category: "system",
            features: ["Data backups", "Migration tools", "Storage management"],
        },
        {
            id: "reports",
            title: "Reports Generation",
            icon: <FileText className="w-8 h-8" />,
            gradient: "from-green-400 via-lime-400 to-emerald-400",
            description: "Generate detailed operational reports",
            category: "analytics",
            features: ["Report templates", "Export options", "Custom reports"],
        },
    ];

    const quickActions = [
        {
            title: "Approve Stakeholders",
            icon: <UserCheck className="w-6 h-6" />,
            color: "from-blue-500 to-indigo-500",
            action: () => setActiveTab("pending"),
        },
        {
            title: "Generate Report",
            icon: <FileText className="w-6 h-6" />,
            color: "from-green-500 to-emerald-500",
            action: () => handleQuickAction("generate_report"),
        },
        {
            title: "Review Security Alerts",
            icon: <AlertCircle className="w-6 h-6" />,
            color: "from-red-500 to-orange-500",
            action: () => handleQuickAction("review_alerts"),
        },
        {
            title: "Configure Settings",
            icon: <Settings className="w-6 h-6" />,
            color: "from-amber-500 to-yellow-500",
            action: () => handleQuickAction("configure_settings"),
        },
    ];

    const categories = [
        "all",
        "management",
        "tracking",
        "rewards",
        "analytics",
        "system",
        "security",
    ];

    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredTabs = searchTerm
        ? tabConfig.filter(
            (tab) =>
                tab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tab.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : tabConfig.filter(
            (tab) => selectedCategory === "all" || tab.category === selectedCategory
        );

    const renderSection = () => {
        switch (activeTab) {
            case "overview":
                return <AdminStatsPanel />;
            case "students":
                return <AllStudents />;
            case "educators":
                return <AllEducator />;
            case "educator-tracker":
                return <EducatorTracker />;
            case "pending":
                return <PendingApprovals />;
            case "redemptions":
                return <AdminRedemptions />;
            case "analytics":
                return <AdminAnalytics />;
            case "users":
                return <AdminUsersPanel />;
            case "settings":
                return <AdminSettings />;
            case "security":
                return <SecurityPanel />;
            case "audit":
                return <AuditLogs />;
            case "data":
                return <DataManagement />;
            case "reports":
                return <ReportsGenerator />;
            default:
                return <AdminStatsPanel />;
        }
    };

    const handleQuickAction = (action) => {
        setLoading(true);
        console.log(`Executing quick action: ${action}`);
        setTimeout(() => {
            setLoading(false);
            switch (action) {
                case "approve_stakeholders":
                    setActiveTab("pending");
                    break;
                case "generate_report":
                    alert("Report generation would start");
                    break;
                case "review_alerts":
                    alert("Security alerts review panel would open");
                    break;
                case "configure_settings":
                    alert("Settings configuration panel would open");
                    break;
                default:
                    alert(`Action: ${action} executed`);
            }
        }, 800);
    };

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
        hidden: { y: 30, opacity: 0 },
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
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="relative inline-block"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black flex items-center gap-2">
                                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                                        Admin Command Center
                                    </span>
                                    <span className="text-black">🛡️</span>
                                </h1>
                            </motion.div>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefreshData}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <Database className="w-5 h-5" />
                                <span>Refresh Data</span>
                            </motion.button>

                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
                                >
                                    <Bell className="w-6 h-6 text-gray-700" />
                                    {notifications.length > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {notifications.length}
                                            </span>
                                        </div>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <motion.p
                        className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Advanced AI-Powered Administrative Platform ✨
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search tools, users, or features..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* System Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-gray-700">
                                        {systemStatus}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Wifi className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-gray-600">Connected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-600">Secure</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    Users: {adminStats.totalUsers} | Health: {systemHealth.status || "OK"}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Admin Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40">
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Students</p>
                                    <p className="text-2xl font-bold text-gray-800">{adminStats.totalStudents}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40">
                            <div className="flex items-center gap-3">
                                <GraduationCap className="w-8 h-8 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Educators</p>
                                    <p className="text-2xl font-bold text-gray-800">{adminStats.totalEducators}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40">
                            <div className="flex items-center gap-3">
                                <Clock className="w-8 h-8 text-orange-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Pending Approvals</p>
                                    <p className="text-2xl font-bold text-gray-800">{adminStats.pendingEducators}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40">
                            <div className="flex items-center gap-3">
                                <Gift className="w-8 h-8 text-purple-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Redemptions</p>
                                    <p className="text-2xl font-bold text-gray-800">{adminStats.redemptions}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Recent Activity */}
                {recentActivity.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8"
                    >
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                Recent System Activity ({recentActivity.length})
                            </h3>
                            <div className="space-y-3">
                                {recentActivity.slice(0, 5).map((activity, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">
                                                {activity.description || activity.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(activity.timestamp || activity.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* Debug Info */}
                {dashboardData && import.meta.env.DEV && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8"
                    >
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-gray-600 mb-2">Admin Debug Info (Dev Mode)</h4>
                            <div className="text-xs text-gray-500">
                                <p>Dashboard data loaded: {new Date().toLocaleTimeString()}</p>
                                <p>System status: {systemStatus}</p>
                                <p>Analytics available: {dashboardData.analytics ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={action.action}
                                disabled={loading}
                                className={`bg-gradient-to-r ${action.color} p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {action.icon}
                                <span className="font-semibold">{action.title}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Filter className="w-6 h-6 text-purple-500" />
                        Advanced Tools & Features
                    </h2>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full font-semibold transition-all ${selectedCategory === category
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                                        : "bg-white/80 text-gray-700 hover:bg-white shadow-md"
                                    }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Feature Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                >
                    {filteredTabs.map((tab, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                y: -8,
                                transition: { duration: 0.2 },
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(tab.id)}
                            className="group cursor-pointer relative"
                        >
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full">
                                <div
                                    className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                />
                                <div className="relative z-10 flex flex-col items-center text-center h-full">
                                    <motion.div
                                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tab.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {tab.icon}
                                    </motion.div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        {tab.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 flex-1">
                                        {tab.description}
                                    </p>
                                    <div className="w-full space-y-2">
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {tab.features.map((feature, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <ChevronRight
                                                className={`w-4 h-4 transition-colors ${activeTab === tab.id
                                                        ? "text-indigo-500"
                                                        : "text-gray-400 group-hover:text-indigo-500"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl border border-gray-200 overflow-hidden mb-8"
                >
                    {loading ? (
                        <div className="p-8 animate-pulse">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-gray-200 rounded-xl h-40"></div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 lg:p-8">{renderSection()}</div>
                    )}
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-10"
                >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <Shield className="w-6 h-6" />
                        <span>
                            Powered by AI • Designed for Admins • Built for Control 🚀
                        </span>
                        <Lock className="w-6 h-6" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
