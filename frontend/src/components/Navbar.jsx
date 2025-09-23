import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthUtils";
import { useWallet } from "../context/WalletContext";
import { useSocket } from "../context/SocketContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
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
    BarChart3,
    HelpCircle,
    TrendingUp,
    Gift,
    Calendar,
    FileText,
    Briefcase,
    MessageSquare,
    AlertCircle,
    Zap
} from "lucide-react";


const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const { wallet } = useWallet();
    const socket = useSocket();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showHelpMenu, setShowHelpMenu] = useState(false);
    const profileMenuRef = useRef(null);
    const helpMenuRef = useRef(null);

    // Function to normalize avatar URL
    const apiBaseUrl = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000';
    const normalizeAvatarUrl = (src) => {
        if (!src) return '/default-avatar.png';
        if (src.startsWith('http')) return src;
        if (src.startsWith('/uploads/')) return `${apiBaseUrl}${src}`;
        return src; // e.g. /avatars/... served by frontend
    };

    const getDashboardLabel = () => {
        switch (user?.role) {
            case "admin": return "Admin Dashboard";
            case "educator": return "Educator Dashboard";
            case "student":
            default: return "Student Dashboard";
        }
    };

    const handleDashboardRedirect = () => {
        if (!user) return;
        const paths = {
            admin: "/admin/dashboard",
            educator: "/educator/dashboard",
            student: "/student/dashboard"
        };
        navigate(paths[user.role] || paths.student);
    };

    const navigationItems = user?.role === "student" ? [
        { icon: <Home className="w-5 h-5" />, label: "Dashboard", onClick: handleDashboardRedirect },
        { icon: <TrendingUp className="w-5 h-5" />, label: "Challenges", onClick: () => navigate("/student/challenge") },
        { icon: <Zap className="w-5 h-5" />, label: "Daily Challenges", onClick: () => navigate("/student/daily-challenges") },
        { icon: <Calendar className="w-5 h-5" />, label: "This Week", onClick: () => navigate("/student/this-week") }
    ] : user?.role === "educator" ? [
        { icon: <Home className="w-5 h-5" />, label: "Dashboard", onClick: handleDashboardRedirect },
        { icon: <User className="w-5 h-5" />, label: "Students", onClick: () => navigate("/educator/students") },
        { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", onClick: () => navigate("/educator/analytics") },
        { icon: <Gift className="w-5 h-5" />, label: "Rewards", onClick: () => navigate("/educator/rewards") },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Communication", onClick: () => navigate("/educator/communication") }
    ] : [
        { icon: <Home className="w-5 h-5" />, label: "Dashboard", onClick: handleDashboardRedirect },
        { icon: <User className="w-5 h-5" />, label: "Users", onClick: () => navigate("/admin/users") },
        { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", onClick: () => navigate("/admin/analytics") },
        { icon: <AlertCircle className="w-5 h-5" />, label: "Approvals", onClick: () => navigate("/admin/pending-educators") }
    ];

    const profileMenuItems = [
        { icon: <User className="w-5 h-5" />, label: "Profile", onClick: () => navigate(`/${user?.role}/profile`) },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", onClick: () => navigate(`/${user?.role}/settings`) },
        { icon: <LogOut className="w-5 h-5" />, label: "Sign Out", onClick: logoutUser, danger: true }
    ];

    const helpMenuItems = [
        { icon: <FileText className="w-5 h-5" />, label: "Documentation", onClick: () => window.open("#", "_blank") },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Support Chat", onClick: () => navigate("/student/support") },
        { icon: <Briefcase className="w-5 h-5" />, label: "Financial Resources", onClick: () => navigate("/learn/financial-literacy") },
    ];

    const profileMenuVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setShowProfileMenu(false);
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) setShowHelpMenu(false);
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
            <header className="w-full bg-gray-100 border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo/Brand */}
                        <motion.div
                            className="flex-shrink-0 flex items-center cursor-pointer"
                            onClick={handleDashboardRedirect}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="ml-2 sm:ml-3">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">WiseStudent</h1>
                                <p className="hidden sm:block text-xs sm:text-sm text-gray-600">{getDashboardLabel()}</p>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
                            {navigationItems.map((item, index) => (
                                <motion.button
                                    key={index}
                                    onClick={item.onClick}
                                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </motion.button>
                            ))}
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">

                            {/* Help Menu */}
                            <div className="relative" ref={helpMenuRef}>
                                <motion.button
                                    className="p-2 sm:p-2.5 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition-all duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowHelpMenu(!showHelpMenu);
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.button>
                                <AnimatePresence>
                                    {showHelpMenu && (
                                        <motion.div
                                            variants={profileMenuVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            className="absolute right-0 mt-1.5 sm:mt-2 w-52 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                                        >
                                            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 bg-gray-50">
                                                <p className="text-xs sm:text-sm font-medium text-gray-900">Help & Resources</p>
                                            </div>
                                            {helpMenuItems.map((item, index) => (
                                                <motion.button
                                                    key={index}
                                                    onClick={() => {
                                                        item.onClick();
                                                        setShowHelpMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                                                    whileHover={{ x: 3 }}
                                                >
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {user && (
                                <>
                                    {user.role === "student" && (
                                        <motion.button
                                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg font-medium text-xs sm:text-sm shadow-md hover:bg-green-600 transition-all duration-200"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => navigate("/student/wallet")}
                                        >
                                            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="hidden sm:block">₹{wallet?.balance || 0}</span>
                                        </motion.button>
                                    )}

                                    {(user.role === "student" || user.role === "educator" || user.role === "admin") && (
                                        <motion.button
                                            className="relative p-2 sm:p-2.5 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition-all duration-200"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/${user.role}/notifications`)}
                                        >
                                            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </motion.button>
                                    )}

                                    {/* Profile Menu */}
                                    <div className="relative" ref={profileMenuRef}>
                                        <motion.button
                                            className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowProfileMenu(!showProfileMenu);
                                            }}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={user.avatar || "/default-avatar.png"}
                                                    alt="Profile"
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-indigo-100 shadow-md"
                                                />
                                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div className="hidden md:block text-left">
                                                <p className="text-xs sm:text-sm font-medium text-gray-900">{user.name || "User"}</p>
                                                <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                                            </div>
                                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        </motion.button>
                                        <AnimatePresence>
                                            {showProfileMenu && (
                                                <motion.div
                                                    variants={profileMenuVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className="absolute right-0 mt-1.5 sm:mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                                                >
                                                    <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
                                                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                            <img
                                                                src={user.avatar || "/default-avatar.png"}
                                                                alt="Profile"
                                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-md"
                                                            />
                                                            <div>
                                                                <p className="text-xs sm:text-sm font-semibold text-gray-900">{user.name}</p>
                                                                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <span className="inline-block text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-indigo-100 text-indigo-800 rounded-full">
                                                            {user.role === "student" ? "Student Account" : user.role === "educator" ? "Educator Account" : "Admin Account"}
                                                        </span>
                                                    </div>
                                                    {profileMenuItems.map((item, index) => (
                                                        <motion.button
                                                            key={index}
                                                            onClick={() => {
                                                                item.onClick();
                                                                setShowProfileMenu(false);
                                                            }}
                                                            className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm transition-all duration-200 ${
                                                                item.danger
                                                                    ? 'text-red-600 hover:bg-red-50'
                                                                    : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                            whileHover={{ x: 3 }}
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
                                className="md:hidden p-2 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition-all duration-200 mobile-menu-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMobileMenu(!showMobileMenu);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {showMobileMenu ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
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
                            className="md:hidden border-t border-gray-200 bg-white shadow-lg"
                        >
                            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1.5 sm:space-y-2">
                                {navigationItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => {
                                            item.onClick();
                                            setShowMobileMenu(false);
                                        }}
                                        className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                                        whileHover={{ x: 4 }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </motion.button>
                                ))}
                            </div>



                            {/* <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-200">
                                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Help & Resources</p>
                                {helpMenuItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => {
                                            item.onClick();
                                            setShowMobileMenu(false);
                                        }}
                                        className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                                        whileHover={{ x: 4 }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </motion.button>
                                ))}
                            </div> */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>


        </>
    );
};

export default Navbar;