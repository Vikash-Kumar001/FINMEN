import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthUtils";
import { useWallet } from "../context/WalletContext";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Avatar from "./Avatar";
import {
    Bell,
    Wallet,
    ChevronDown,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    Home,
    BarChart3,
    TrendingUp,
    Gift,
    MessageSquare,
    AlertCircle,
    Zap,
    Users,
    Mail,
    CheckCircle,
    FileText
} from "lucide-react";


const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const { wallet } = useWallet();
    const socket = useSocket();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const profileMenuRef = useRef(null);

    // Function to normalize avatar URL (utility kept for future use)
    // eslint-disable-next-line no-unused-vars
    const normalizeAvatarUrl = (src) => {
        const apiBaseUrl = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000';
        if (!src) return '/default-avatar.png';
        if (src.startsWith('http')) return src;
        if (src.startsWith('/uploads/')) return `${apiBaseUrl}${src}`;
        return src; // e.g. /avatars/... served by frontend
    };

    const getDashboardLabel = () => {
        switch (user?.role) {
            case "admin": return "Admin Dashboard";
            case "parent": return "Parent Dashboard";
            case "seller": return "Seller Dashboard";
            case "csr": return "CSR Dashboard";
            case "school_admin": return "School Admin Dashboard";
            case "school_teacher": return "Teacher Dashboard";
            case "school_student": return "Student Dashboard";
            case "school_parent": return "Parent Dashboard";
            case "student":
            default: return "Student Dashboard";
        }
    };

    const handleDashboardRedirect = () => {
        if (!user) return;
        const paths = {
            admin: "/admin/dashboard",
            parent: "/parent/overview",
            seller: "/seller/dashboard",
            csr: "/csr/dashboard",
            school_admin: "/school/admin/dashboard",
            school_teacher: "/school-teacher/overview",
            school_student: "/student/dashboard",
            school_parent: "/school-parent/dashboard",
            student: "/student/dashboard"
        };
        navigate(paths[user.role] || paths.student);
    };

    const navigationItems = (user?.role === "student" || user?.role === "school_student") ? [
        { icon: <Home className="w-5 h-5" />, label: "Dashboard", onClick: handleDashboardRedirect },
        { icon: <TrendingUp className="w-5 h-5" />, label: "Challenges", onClick: () => navigate("/student/challenge") },
        { icon: <Zap className="w-5 h-5" />, label: "Daily Challenges", onClick: () => navigate("/student/daily-challenges") }
    ] : user?.role === "parent" ? [
        { icon: <Home className="w-5 h-5" />, label: "Overview", onClick: handleDashboardRedirect },
        { icon: <Users className="w-5 h-5" />, label: "Children", onClick: () => navigate("/parent/children") },
        { icon: <Mail className="w-5 h-5" />, label: "Messages", onClick: () => navigate("/parent/messages") },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", onClick: () => navigate("/parent/settings") }
    ] : user?.role === "admin" ? [
        { icon: <Home className="w-5 h-5" />, label: "Dashboard", onClick: handleDashboardRedirect },
        { icon: <User className="w-5 h-5" />, label: "Users", onClick: () => navigate("/admin/users") },
        { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", onClick: () => navigate("/admin/analytics") },
        { icon: <AlertCircle className="w-5 h-5" />, label: "Approvals", onClick: () => navigate("/admin/pending-approvals") }
    ] : user?.role === "school_admin" ? [
        { icon: <Home className="w-5 h-5" />, label: "Overview", onClick: handleDashboardRedirect },
        { icon: <Users className="w-5 h-5" />, label: "Students", onClick: () => navigate("/school/admin/students") },
        { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", onClick: () => navigate("/school/admin/analytics") },
        { icon: <CheckCircle className="w-5 h-5" />, label: "Approvals", onClick: () => navigate("/school/admin/approvals") },
        { icon: <FileText className="w-5 h-5" />, label: "Templates", onClick: () => navigate("/school/admin/templates") },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", onClick: () => navigate("/school/admin/settings") }
    ] : user?.role === "school_teacher" ? [
        { icon: <Home className="w-5 h-5" />, label: "Overview", onClick: handleDashboardRedirect },
        { icon: <Users className="w-5 h-5" />, label: "Students", onClick: () => navigate("/school-teacher/students") },
        { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", onClick: () => navigate("/school-teacher/analytics") },
        { icon: <Mail className="w-5 h-5" />, label: "Messages", onClick: () => navigate("/school-teacher/messages") },
        { icon: <CheckCircle className="w-5 h-5" />, label: "Tasks", onClick: () => navigate("/school-teacher/tasks") },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", onClick: () => navigate("/school-teacher/settings") }
    ] : [
        { icon: <Home className="w-5 h-5" />, label: "Dashboard", onClick: handleDashboardRedirect }
    ];

    const profileMenuItems = [
        { icon: <User className="w-5 h-5" />, label: "Profile", onClick: () => navigate(`/${user?.role}/profile`) },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", onClick: () => navigate(`/${user?.role}/settings`) },
        { icon: <LogOut className="w-5 h-5" />, label: "Sign Out", onClick: logoutUser, danger: true }
    ];

    const profileMenuVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setShowProfileMenu(false);
            if (showMobileMenu && !event.target.closest('.mobile-menu-button')) setShowMobileMenu(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showProfileMenu, showMobileMenu]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            // Only fetch if user is authenticated
            const token = localStorage.getItem('finmen_token');
            if (!token) {
                setUnreadCount(0);
                return;
            }

            try {
                const response = await api.get('/api/notifications/unread-count');
                if (response.status === 200) setUnreadCount(response.data.count || 0);
            } catch (error) {
                // Don't log auth errors as they're handled by the interceptor
                if (error.response?.status !== 401) {
                    console.error("Error fetching unread count:", error);
                }
                setUnreadCount(0);
            }
        };

        // Only fetch if user exists
        if (user) {
            fetchUnreadCount();
        } else {
            setUnreadCount(0);
        }

        if (socket?.socket && user) {
            socket.socket.on('student:notifications:update', fetchUnreadCount);
            return () => socket.socket.off('student:notifications:update', fetchUnreadCount);
        }
    }, [socket, user]);

    return (
        <>
            <header className="w-full bg-white shadow-lg sticky top-0 z-50">
                {/* Subtle gradient border at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex items-center justify-between sm:gap-4 gap-0 h-16 sm:h-20">
                        {/* Logo/Brand */}
                        <motion.div
                            className="flex-shrink-0 flex items-center cursor-pointer"
                            onClick={handleDashboardRedirect}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                                animate={{
                                    boxShadow: [
                                        '0 4px 20px rgba(139, 92, 246, 0.3)',
                                        '0 4px 40px rgba(139, 92, 246, 0.5)',
                                        '0 4px 20px rgba(139, 92, 246, 0.3)'
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
                            </motion.div>
                            <div className="ml-0 sm:ml-3">
                                <h1 className="hidden lg:block text-lg sm:text-xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">WiseStudent</h1>
                                <p className="hidden lg:block text-xs text-gray-600 font-semibold">{getDashboardLabel()}</p>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 flex-1 justify-center max-w-3xl">
                            {navigationItems.map((item, index) => (
                                <motion.button
                                    key={index}
                                    onClick={item.onClick}
                                    className="flex items-center gap-1.5 px-2.5 lg:px-3 xl:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 duration-200 shadow-md hover:shadow-lg cursor-pointer"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <div className="w-4 h-4 lg:w-4.5 lg:h-4.5">{item.icon}</div>
                                    <span className="hidden lg:inline whitespace-nowrap">{item.label}</span>
                                </motion.button>
                            ))}
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                            {user && (
                                <>
                                    {user.role === "student" && (
                                        <motion.button
                                            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 border-2 border-yellow-500 cursor-pointer"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => navigate("/student/wallet")}
                                        >
                                            <Wallet className="w-4 h-4" />
                                            <span className="font-black">{wallet?.balance || 0}</span>
                                            <span className="hidden sm:inline text-xs">Coins</span>
                                        </motion.button>
                                    )}

                                    {(user.role === "student" || user.role === "admin") && (
                                        <motion.button
                                            className="relative p-2 sm:p-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                            whileHover={{ scale: 1.08, rotate: -10 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/${user.role}/notifications`)}
                                        >
                                            <Bell className="w-5 h-5" />
                                            {unreadCount > 0 && (
                                                <motion.span
                                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </motion.span>
                                            )}
                                        </motion.button>
                                    )}

                                    {/* Profile Menu */}
                                    <div className="relative" ref={profileMenuRef}>
                                        <motion.button
                                            className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowProfileMenu(!showProfileMenu);
                                            }}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <div className="relative">
                                                <Avatar
                                                    user={user}
                                                    size="xsmall"
                                                    className=""
                                                />
                                                <motion.div
                                                    className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-lg"
                                                    animate={{ scale: [1, 1.3, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            </div>
                                            <div className="hidden xl:block text-left">
                                                <p className="text-xs font-bold text-gray-900 leading-tight">{user.name?.split(' ')[0] || "User"}</p>
                                                <p className="text-xs text-gray-600 font-medium capitalize leading-tight">{user.role?.replace('_', ' ')}</p>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                        </motion.button>
                                        <AnimatePresence>
                                            {showProfileMenu && (
                                                <motion.div
                                                    variants={profileMenuVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className="absolute right-0 mt-3 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 overflow-hidden"
                                                >
                                                    <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <Avatar
                                                                user={user}
                                                                size="medium"
                                                                className="border-2 rounded-full border-white shadow-xl ring-4 ring-indigo-100"
                                                            />
                                                            <div>
                                                                <p className="text-sm sm:text-base font-bold text-gray-900">{user.name}</p>
                                                                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <motion.span
                                                            className="inline-block text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg"
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            {user.role === "student" ? "🎓 Student Account" :
                                                                user.role === "parent" ? "👨‍👩‍👧 Parent Account" :
                                                                    user.role === "seller" ? "🛍️ Seller Account" :
                                                                        user.role === "csr" ? "🤝 CSR Account" :
                                                                            user.role === "school_admin" ? "🏫 School Admin Account" :
                                                                                user.role === "school_teacher" ? "👨‍🏫 Teacher Account" :
                                                                                    user.role === "school_student" ? "📚 Student Account" :
                                                                                        user.role === "school_parent" ? "👪 Parent Account" :
                                                                                            "⚡ Admin Account"}
                                                        </motion.span>
                                                    </div>
                                                    {profileMenuItems.map((item, index) => (
                                                        <motion.button
                                                            key={index}
                                                            onClick={() => {
                                                                item.onClick();
                                                                setShowProfileMenu(false);
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-semibold transition-all duration-200 ${item.danger
                                                                    ? 'text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50'
                                                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                                                                }`}
                                                            whileHover={{ x: 5, scale: 1.02 }}
                                                        >
                                                            {item.icon}
                                                            <span>{item.label}</span>
                                                        </motion.button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <motion.button
                                className="md:hidden p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-lg transition-all duration-200 shadow-sm mobile-menu-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMobileMenu(!showMobileMenu);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden border-t-2 border-gray-200 bg-white shadow-lg"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navigationItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => {
                                            item.onClick();
                                            setShowMobileMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-gray-700 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 border-2 border-gray-200 hover:border-transparent rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg"
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Navbar;