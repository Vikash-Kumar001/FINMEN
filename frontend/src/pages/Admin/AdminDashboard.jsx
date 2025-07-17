import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "../../context/SocketContext";
import { useNotification } from "../../context/NotificationContext";
import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaGift,
    FaUsers,
    FaChartPie,
} from "react-icons/fa";
import {
    Shield,
    Users,
    GraduationCap,
    Gift,
    BarChart3,
    Clock,
    AlertCircle,
    Sparkles,
    TrendingUp,
    Crown,
    Settings,
    Bell,
    ChevronRight,
    Eye,
    UserCheck,
    Star,
    Lock,
    Database,
    Activity,
    FileText,
} from "lucide-react";
import AdminStatsPanel from "./AdminStatsPanel";
import AllStudents from "./AllStudents";
import AllEducator from "./AllEducator";
import AdminRedemptions from "./AdminRedemptions";
import AdminAnalytics from "./AdminAnalytics";
import AdminUsersPanel from "./AdminUsersPanel";
import PendingEducators from "./PendingEducators";
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("admin-notification", (data) => {
            notify(data?.message || "🔔 New admin notification received");
            setNotifications((prev) => [data?.message, ...prev.slice(0, 4)]);
        });

        socket.on("system-status-update", (status) => {
            setSystemStatus(status || "Operational");
        });

        return () => {
            socket.off("admin-notification");
            socket.off("system-status-update");
        };
    }, [socket, notify]);

    const tabConfig = [
        {
            id: "overview",
            title: "System Overview",
            icon: <BarChart3 className="w-5 h-5" />,
            gradient: "from-blue-600 to-indigo-600",
            description: "Comprehensive system performance metrics",
        },
        {
            id: "students",
            title: "Student Management",
            icon: <GraduationCap className="w-5 h-5" />,
            gradient: "from-green-600 to-emerald-600",
            description: "Manage student accounts and profiles",
        },
        {
            id: "educators",
            title: "Educator Management",
            icon: <FaChalkboardTeacher className="w-5 h-5" />,
            gradient: "from-purple-600 to-violet-600",
            description: "Oversee educator registrations and roles",
        },
        {
            id: "educator-tracker",
            title: "Educator Monitoring",
            icon: <Eye className="w-5 h-5" />,
            gradient: "from-teal-600 to-emerald-600",
            description: "Real-time educator activity tracking",
        },
        {
            id: "pending",
            title: "Approval Queue",
            icon: <Clock className="w-5 h-5" />,
            gradient: "from-orange-600 to-red-600",
            description: "Review pending requests and applications",
        },
        {
            id: "redemptions",
            title: "Reward Redemptions",
            icon: <Gift className="w-5 h-5" />,
            gradient: "from-pink-600 to-rose-600",
            description: "Manage and approve reward claims",
        },
        {
            id: "analytics",
            title: "Advanced Analytics",
            icon: <TrendingUp className="w-5 h-5" />,
            gradient: "from-cyan-600 to-blue-600",
            description: "In-depth platform analytics and trends",
        },
        {
            id: "users",
            title: "Admin Access",
            icon: <Shield className="w-5 h-5" />,
            gradient: "from-gray-600 to-slate-600",
            description: "Control admin user permissions",
        },
        {
            id: "settings",
            title: "System Configuration",
            icon: <Settings className="w-5 h-5" />,
            gradient: "from-amber-600 to-yellow-600",
            description: "Customize platform settings and policies",
        },
        {
            id: "security",
            title: "Security Management",
            icon: <Lock className="w-5 h-5" />,
            gradient: "from-red-600 to-orange-600",
            description: "Monitor and enhance security protocols",
        },
        {
            id: "audit",
            title: "Audit Logs",
            icon: <Activity className="w-5 h-5" />,
            gradient: "from-teal-600 to-cyan-600",
            description: "Track system and user activities",
        },
        {
            id: "data",
            title: "Data Management",
            icon: <Database className="w-5 h-5" />,
            gradient: "from-indigo-600 to-purple-600",
            description: "Handle data backups and migrations",
        },
        {
            id: "reports",
            title: "Reports Generation",
            icon: <FileText className="w-5 h-5" />,
            gradient: "from-green-600 to-lime-600",
            description: "Generate detailed operational reports",
        },
    ];

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
                return <PendingEducators />;
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

    const activeTabConfig = tabConfig.find((tab) => tab.id === activeTab);

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

    const pulseVariants = {
        animate: {
            scale: [1, 1.02, 1],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-15 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-10 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 p-6 lg:p-8 max-w-8xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10"
                >
                    <motion.div
                        className="relative inline-block"
                        variants={pulseVariants}
                        animate="animate"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 flex items-center justify-center gap-4">
                            <motion.div
                                className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Shield className="w-8 h-8 text-white" />
                            </motion.div>
                            <span className="bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                                Admin Control Center
                            </span>
                        </h1>
                        <motion.p
                            className="text-gray-600 text-lg sm:text-xl font-semibold tracking-wide"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Empower your administrative oversight with advanced tools
                        </motion.p>
                    </motion.div>
                </motion.div>

                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200 mb-8 relative overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${activeTabConfig?.gradient} opacity-5`} />
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className={`w-16 h-16 rounded-lg bg-gradient-to-r ${activeTabConfig?.gradient} flex items-center justify-center text-white shadow-md`}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTabConfig?.icon}
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {activeTabConfig?.title}
                                    </h2>
                                    <p className="text-gray-600">{activeTabConfig?.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-3 h-3 bg-green-500 rounded-full"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-sm text-gray-600 font-medium">
                                    {systemStatus}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-10"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                        {tabConfig.map((tab) => (
                            <motion.button
                                key={tab.id}
                                variants={itemVariants}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${activeTab === tab.id
                                        ? "bg-white shadow-xl border border-indigo-200"
                                        : "bg-white/80 hover:bg-white shadow-md hover:shadow-xl"
                                    }`}
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${activeTab === tab.id ? "opacity-5" : ""
                                        }`}
                                />
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <motion.div
                                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tab.gradient} flex items-center justify-center text-white mb-3 shadow-md group-hover:shadow-lg transition-all duration-300 ${activeTab === tab.id ? "scale-110" : ""
                                            }`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {tab.icon}
                                    </motion.div>
                                    <h3
                                        className={`text-sm font-semibold transition-colors ${activeTab === tab.id ? "text-indigo-700" : "text-gray-700"
                                            }`}
                                    >
                                        {tab.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">{tab.description}</p>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl border border-gray-200 overflow-hidden"
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

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Eye className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Real-Time Insights</h3>
                        </div>
                        <p className="text-indigo-100 text-sm mb-4">
                            Access live platform performance data
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab("analytics")}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-all"
                        >
                            View Analytics
                        </motion.button>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 rounded-2xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <UserCheck className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Approval Workflow</h3>
                        </div>
                        <p className="text-emerald-100 text-sm mb-4">
                            Manage pending approvals efficiently
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab("pending")}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-all"
                        >
                            Handle Approvals
                        </motion.button>
                    </div>

                    <div className="bg-gradient-to-br from-amber-600 to-yellow-600 p-6 rounded-2xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Settings className="w-8 h-8" />
                            <h3 className="text-xl font-bold">System Control</h3>
                        </div>
                        <p className="text-amber-100 text-sm mb-4">
                            Adjust platform configurations
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab("settings")}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-all"
                        >
                            Configure Now
                        </motion.button>
                    </div>
                </motion.div>

                <div className="text-center mt-10">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-700 to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-base">
                        <Crown className="w-5 h-5" />
                        <span>{`System Status: ${systemStatus} as of ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`}</span>
                        <motion.div
                            className="w-2 h-2 bg-green-500 rounded-full"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </div>

                {notifications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl shadow-md"
                    >
                        <h4 className="flex items-center gap-2 text-yellow-800 font-semibold mb-2">
                            <Bell className="w-5 h-5" />
                            Recent Notifications
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            {notifications.map((msg, index) => (
                                <li key={index} className="flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" />
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;