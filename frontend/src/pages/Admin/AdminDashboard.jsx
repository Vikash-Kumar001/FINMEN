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
} from "lucide-react";

import AdminStatsPanel from "./AdminStatsPanel";
import AllStudents from "./AllStudents";
import AllEducator from "./AllEducator";
import AdminRedemptions from "./AdminRedemptions";
import AdminAnalytics from "./AdminAnalytics";
import AdminUsersPanel from "./AdminUsersPanel";
import PendingEducators from "./PendingEducators";

const AdminDashboard = () => {
    const socket = useSocket();
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("admin-notification", (data) => {
            notify(data?.message || "🔔 Admin notification received");
        });

        return () => {
            socket.off("admin-notification");
        };
    }, [socket, notify]);

    const tabConfig = [
        {
            id: "overview",
            title: "Overview",
            icon: <BarChart3 className="w-5 h-5" />,
            gradient: "from-blue-500 to-indigo-500",
            description: "System overview",
        },
        {
            id: "students",
            title: "Students",
            icon: <GraduationCap className="w-5 h-5" />,
            gradient: "from-green-500 to-emerald-500",
            description: "Manage students",
        },
        {
            id: "educators",
            title: "Educators",
            icon: <FaChalkboardTeacher className="w-5 h-5" />,
            gradient: "from-purple-500 to-violet-500",
            description: "Educator management",
        },
        {
            id: "pending",
            title: "Pending",
            icon: <Clock className="w-5 h-5" />,
            gradient: "from-orange-500 to-red-500",
            description: "Pending approvals",
        },
        {
            id: "redemptions",
            title: "Redemptions",
            icon: <Gift className="w-5 h-5" />,
            gradient: "from-pink-500 to-rose-500",
            description: "Reward redemptions",
        },
        {
            id: "analytics",
            title: "Analytics",
            icon: <TrendingUp className="w-5 h-5" />,
            gradient: "from-cyan-500 to-blue-500",
            description: "Data insights",
        },
        {
            id: "users",
            title: "Admin Users",
            icon: <Shield className="w-5 h-5" />,
            gradient: "from-gray-500 to-slate-500",
            description: "Admin management",
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
            case "pending":
                return <PendingEducators />;
            case "redemptions":
                return <AdminRedemptions />;
            case "analytics":
                return <AdminAnalytics />;
            case "users":
                return <AdminUsersPanel />;
            default:
                return <AdminStatsPanel />;
        }
    };

    const activeTabConfig = tabConfig.find(tab => tab.id === activeTab);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-15 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-10 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-slate-200 to-gray-200 rounded-full opacity-15 blur-3xl animate-pulse delay-2000" />

                {/* Floating geometric shapes */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-4 h-4 bg-indigo-400 rounded-full opacity-60"
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-2/3 right-1/4 w-3 h-3 bg-purple-400 rotate-45 opacity-50"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [45, 225, 45],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
                <motion.div
                    className="absolute bottom-1/3 left-2/3 w-6 h-6 bg-slate-400 rounded-full opacity-40"
                    animate={{
                        y: [0, -25, 0],
                        scale: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        className="relative inline-block"
                        variants={pulseVariants}
                        animate="animate"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center justify-center gap-3">
                            <motion.div
                                className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Shield className="w-8 h-8 text-white" />
                            </motion.div>
                            <span className="bg-gradient-to-r from-slate-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
                                Admin Dashboard
                            </span>
                        </h1>
                        
                        {/* Sparkle effects around the title */}
                        <div className="absolute -top-2 -right-2 text-indigo-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-purple-400 animate-bounce delay-300">
                            <Star className="w-5 h-5" />
                        </div>
                    </motion.div>
                    
                    <motion.p
                        className="text-slate-600 text-lg sm:text-xl font-medium tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Manage your platform with precision and insight 🎯
                    </motion.p>
                </motion.div>

                {/* Current Section Info */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 relative overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${activeTabConfig?.gradient} opacity-5`} />
                        
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${activeTabConfig?.gradient} flex items-center justify-center text-white shadow-lg`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTabConfig?.icon}
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1">
                                        {activeTabConfig?.title}
                                    </h2>
                                    <p className="text-slate-600 font-medium">
                                        {activeTabConfig?.description}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-3 h-3 bg-green-400 rounded-full"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-sm text-slate-600 font-medium">Live</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Navigation Tabs */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-8"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                        {tabConfig.map((tab, index) => (
                            <motion.button
                                key={tab.id}
                                variants={itemVariants}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? "bg-white shadow-xl border-2 border-indigo-200"
                                        : "bg-white/80 hover:bg-white shadow-lg hover:shadow-xl"
                                }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                                    activeTab === tab.id ? "opacity-5" : ""
                                }`} />
                                
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <motion.div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tab.gradient} flex items-center justify-center text-white mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                                            activeTab === tab.id ? "scale-110" : ""
                                        }`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {tab.icon}
                                    </motion.div>
                                    
                                    <h3 className={`text-sm font-bold transition-colors ${
                                        activeTab === tab.id ? "text-indigo-700" : "text-slate-700"
                                    }`}>
                                        {tab.title}
                                    </h3>
                                    
                                    <p className="text-xs text-slate-500 mt-1 leading-tight">
                                        {tab.description}
                                    </p>
                                    
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

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 overflow-hidden"
                >
                    {loading ? (
                        <div className="p-8 animate-pulse">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-slate-200 rounded-2xl h-32"></div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 lg:p-8">
                            {renderSection()}
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-3xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Eye className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Quick View</h3>
                        </div>
                        <p className="text-indigo-100 text-sm mb-4">
                            Access key metrics instantly
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all"
                        >
                            View Now
                        </motion.button>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-3xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <UserCheck className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Approve</h3>
                        </div>
                        <p className="text-emerald-100 text-sm mb-4">
                            Review pending requests
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab("pending")}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all"
                        >
                            Review
                        </motion.button>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-3xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Settings className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Settings</h3>
                        </div>
                        <p className="text-orange-100 text-sm mb-4">
                            Configure system settings
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all"
                        >
                            Configure
                        </motion.button>
                    </div>
                </motion.div>

                {/* Status Footer */}
                <div className="text-center mt-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-600 to-indigo-600 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <Crown className="w-6 h-6" />
                        <span>System running smoothly • All services operational</span>
                        <motion.div
                            className="w-2 h-2 bg-green-400 rounded-full"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;