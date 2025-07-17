import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { 
    Bell, 
    Wallet, 
    ChevronDown,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    Search,
    Home,
    BookOpen,
    Award,
    BarChart3
} from "lucide-react";
import StudentProgressModal from "../pages/Student/StudentProgressModal";

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const { wallet } = useWallet();
    const socket = useSocket();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showProgressModal, setShowProgressModal] = useState(false);

    const getDashboardLabel = () => {
        switch (user?.role) {
            case "admin":
                return "Admin Dashboard";
            case "educator":
                return "Educator Dashboard";
            case "student":
            default:
                return "Dashboard";
        }
    };

    const handleDashboardRedirect = () => {
        if (!user) return;
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "educator") navigate("/educator/dashboard");
        else navigate("/student/dashboard");
    };

    const handleProgressClick = () => {
        if (user?.role === "student") setShowProgressModal(true);
        else navigate("/student/progress");
    };

    const navigationItems = [
        { icon: <Home className="w-4 h-4" />, label: "Dashboard", onClick: handleDashboardRedirect },
        { icon: <BookOpen className="w-4 h-4" />, label: "Learning", onClick: () => navigate("/student/learning") },
        { icon: <Award className="w-4 h-4" />, label: "Achievements", onClick: () => navigate("/student/achievements") },
        { icon: <BarChart3 className="w-4 h-4" />, label: "Progress", onClick: handleProgressClick }
    ];

    const profileMenuItems = [
        { 
            icon: <User className="w-4 h-4" />, 
            label: "Profile", 
            onClick: () => {
                if (user?.role === "admin") navigate("/admin/profile");
                else if (user?.role === "educator") navigate("/educator/profile");
                else navigate("/student/profile");
            } 
        },
        { 
            icon: <Settings className="w-4 h-4" />, 
            label: "Settings", 
            onClick: () => {
                if (user?.role === "admin") navigate("/admin/settings");
                else if (user?.role === "educator") navigate("/educator/settings");
                else navigate("/student/settings");
            } 
        },
        { icon: <LogOut className="w-4 h-4" />, label: "Sign Out", onClick: logoutUser, danger: true }
    ];

    const profileMenuVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.95, 
            y: -10,
            transition: { duration: 0.15 }
        },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { duration: 0.15 }
        }
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (showProfileMenu || showMobileMenu) {
                setShowProfileMenu(false);
                setShowMobileMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showProfileMenu, showMobileMenu]);

    // Fetch notifications count (unread) on mount and via socket
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API}/notifications/unread-count`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.count || 0);
                }
            } catch {
                setUnreadCount(0);
            }
        };
        fetchUnreadCount();
        // Listen for real-time notification updates
        if (socket) {
            socket.on('student:notifications:update', fetchUnreadCount);
            return () => socket.off('student:notifications:update', fetchUnreadCount);
        }
    }, [socket]);

    return (
        <>
            <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <motion.div
                                className="flex-shrink-0 flex items-center cursor-pointer"
                                onClick={handleDashboardRedirect}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                                    FM
                                </div>
                                <div className="hidden md:block">
                                    <h1 className="text-xl font-semibold text-gray-900">FinMen</h1>
                                    <p className="text-xs text-gray-500 -mt-1">{getDashboardLabel()}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navigationItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={item.onClick}
                                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center space-x-4">
                            {/* Search - Hidden on mobile */}
                            <div className="hidden lg:block">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {user && (
                                <>
                                    {/* Student-specific elements */}
                                    {user.role === "student" && (
                                        <div className="flex items-center space-x-3">
                                            {/* Wallet Balance */}
                                            <motion.button
                                                className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium text-sm hover:bg-green-100 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate("/student/wallet")}
                                            >
                                                <Wallet className="w-4 h-4" />
                                                <span className="hidden sm:block">
                                                    ₹{wallet?.balance || 0}
                                                </span>
                                            </motion.button>

                                            {/* Notifications */}
                                            <motion.button
                                                className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => {
                                                    if (user?.role === "admin") navigate("/admin/notifications");
                                                    else if (user?.role === "educator") navigate("/educator/notifications");
                                                    else navigate("/student/notifications");
                                                }}
                                            >
                                                <Bell className="w-5 h-5" />
                                                {unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </motion.button>
                                        </div>
                                    )}

                                    {/* Profile Menu */}
                                    <div className="relative">
                                        <motion.button
                                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowProfileMenu(!showProfileMenu);
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <img
                                                src={user.avatar || "/default-avatar.png"}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                            />
                                            <div className="hidden md:block text-left">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name || "User"}
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">
                                                    {user.role}
                                                </div>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </motion.button>

                                        {/* Profile Dropdown */}
                                        <AnimatePresence>
                                            {showProfileMenu && (
                                                <motion.div
                                                    variants={profileMenuVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="px-4 py-2 border-b border-gray-100">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                    
                                                    {profileMenuItems.map((item, index) => (
                                                        <motion.button
                                                            key={index}
                                                            onClick={() => {
                                                                item.onClick();
                                                                setShowProfileMenu(false);
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                                                                item.danger 
                                                                    ? 'text-red-600 hover:bg-red-50' 
                                                                    : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                            whileHover={{ x: 2 }}
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
                                className="md:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMobileMenu(!showMobileMenu);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
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
                            className="md:hidden border-t border-gray-200 bg-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {navigationItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => {
                                            item.onClick();
                                            setShowMobileMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                                        whileHover={{ x: 4 }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                            
                            {/* Mobile Search */}
                            <div className="px-4 py-2 border-t border-gray-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            {showProgressModal && user?.role === "student" && (
                <StudentProgressModal
                    studentId={user._id}
                    onClose={() => setShowProgressModal(false)}
                />
            )}
        </>
    );
};

export default Navbar;