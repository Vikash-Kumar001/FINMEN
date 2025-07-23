import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
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
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showHelpMenu, setShowHelpMenu] = useState(false);
    const searchInputRef = useRef(null);
    const profileMenuRef = useRef(null);
    const helpMenuRef = useRef(null);

    const getDashboardLabel = () => {
        switch (user?.role) {
            case "admin": return "Admin Dashboard";
            case "educator": return "Educator Dashboard";
            case "student":
            default: return "Student Dashboard";
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.length > 2) {
            const mockResults = [
                { id: 1, title: "Financial Literacy", path: "/learn/financial-literacy", type: "Course" },
                { id: 2, title: "Budget Planner", path: "/tools/budget-planner", type: "Tool" },
                { id: 3, title: "Investment Simulator", path: "/games/investment-simulator", type: "Game" },
                { id: 4, title: "Savings Goals", path: "/tools/savings-goals", type: "Tool" },
            ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
            
            setSearchResults(mockResults);
            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
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

    const handleProgressClick = () => {
        if (user?.role === "student") setShowProgressModal(true);
        else navigate("/student/progress");
    };

    const navigationItems = user?.role === "student" ? [
        { icon: <Home className="w-5 h-5" />, label: "Dashboard", onClick: handleDashboardRedirect },
        { icon: <TrendingUp className="w-5 h-5" />, label: "Challenges", onClick: () => navigate("/student/challenge") },
        { icon: <Calendar className="w-5 h-5" />, label: "This Week", onClick: () => navigate("/student/this-week") },
        { icon: <BarChart3 className="w-5 h-5" />, label: "Progress", onClick: handleProgressClick }
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
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) setShowSearchResults(false);
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) setShowHelpMenu(false);
            if (showMobileMenu && !event.target.closest('.mobile-menu-button')) setShowMobileMenu(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showProfileMenu, showMobileMenu, showSearchResults]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await api.get('/api/notifications/unread-count');
                if (response.status === 200) setUnreadCount(response.data.count || 0);
            } catch {
                setUnreadCount(0);
            }
        };
        fetchUnreadCount();
        if (socket?.socket) {
            socket.socket.on('student:notifications:update', fetchUnreadCount);
            return () => socket.socket.off('student:notifications:update', fetchUnreadCount);
        }
    }, [socket]);

    return (
        <>
            <header className="w-full bg-gray-100 border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo/Brand */}
                        <motion.div
                            className="flex-shrink-0 flex items-center cursor-pointer"
                            onClick={handleDashboardRedirect}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="ml-3">
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">FinMen</h1>
                                <p className="text-sm text-gray-600">{getDashboardLabel()}</p>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-4">
                            {navigationItems.map((item, index) => (
                                <motion.button
                                    key={index}
                                    onClick={item.onClick}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </motion.button>
                            ))}
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative" ref={searchInputRef}>
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
                                />
                                <AnimatePresence>
                                    {showSearchResults && searchResults.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                                                <p className="text-xs font-medium text-gray-500">Search Results</p>
                                            </div>
                                            {searchResults.map((result) => (
                                                <Link
                                                    key={result.id}
                                                    to={result.path}
                                                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-all duration-200"
                                                    onClick={() => {
                                                        setShowSearchResults(false);
                                                        setSearchQuery("");
                                                    }}
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{result.title}</p>
                                                        <p className="text-xs text-gray-500">{result.type}</p>
                                                    </div>
                                                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{result.type}</span>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Help Menu */}
                            <div className="relative" ref={helpMenuRef}>
                                <motion.button
                                    className="p-2.5 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition-all duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowHelpMenu(!showHelpMenu);
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <HelpCircle className="w-6 h-6" />
                                </motion.button>
                                <AnimatePresence>
                                    {showHelpMenu && (
                                        <motion.div
                                            variants={profileMenuVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                                <p className="text-sm font-medium text-gray-900">Help & Resources</p>
                                            </div>
                                            {helpMenuItems.map((item, index) => (
                                                <motion.button
                                                    key={index}
                                                    onClick={() => {
                                                        item.onClick();
                                                        setShowHelpMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
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
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm shadow-md hover:bg-green-600 transition-all duration-200"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => navigate("/student/wallet")}
                                        >
                                            <Wallet className="w-5 h-5" />
                                            <span className="hidden sm:block">₹{wallet?.balance || 0}</span>
                                        </motion.button>
                                    )}

                                    {(user.role === "student" || user.role === "educator" || user.role === "admin") && (
                                        <motion.button
                                            className="relative p-2.5 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition-all duration-200"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/${user.role}/notifications`)}
                                        >
                                            <Bell className="w-6 h-6" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </motion.button>
                                    )}

                                    {/* Profile Menu */}
                                    <div className="relative" ref={profileMenuRef}>
                                        <motion.button
                                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
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
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 shadow-md"
                                                />
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div className="hidden md:block text-left">
                                                <p className="text-sm font-medium text-gray-900">{user.name || "User"}</p>
                                                <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                                            </div>
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </motion.button>
                                        <AnimatePresence>
                                            {showProfileMenu && (
                                                <motion.div
                                                    variants={profileMenuVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                                                >
                                                    <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <img
                                                                src={user.avatar || "/default-avatar.png"}
                                                                alt="Profile"
                                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                                            />
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <span className="inline-block text-xs px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
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
                                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
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
                                className="md:hidden p-2.5 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition-all duration-200 mobile-menu-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMobileMenu(!showMobileMenu);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                            className="md:hidden border-t border-gray-200 bg-white shadow-lg"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navigationItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => {
                                            item.onClick();
                                            setShowMobileMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                                        whileHover={{ x: 4 }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="px-4 py-4 border-t border-gray-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="px-4 py-4 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-500 mb-3">Help & Resources</p>
                                {helpMenuItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => {
                                            item.onClick();
                                            setShowMobileMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                                        whileHover={{ x: 4 }}
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