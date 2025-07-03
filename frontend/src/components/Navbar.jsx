import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Bell, 
    User, 
    Settings, 
    LogOut, 
    Menu, 
    X, 
    Sparkles,
    ChevronDown,
    Target,
    Award,
    Heart,
    Activity,
    Users,
    Gift,
    TrendingUp
} from "lucide-react";
// Removed: import Profile from "../pages/Profile";

export default function Navbar() {
    const { user, logoutUser } = useAuth();
    const socket = useSocket();
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    const [dropdown, setDropdown] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
        setDropdown(false);
        setMobileMenu(false);
    };

    const getInitials = (email) => (email ? email[0].toUpperCase() : "?");

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification) => {
            setNotifications(prev => prev + 1);
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, [socket]);

    // Hide Navbar on login and register pages
    const hideNavbarRoutes = ["/login", "/register"];
    if (hideNavbarRoutes.includes(location.pathname)) return null;

    if (!user) return null;

    // Navigation items for quick access
    const quickNavItems = [
        { icon: Target, label: "Goals", path: "/goals", color: "from-blue-500 to-blue-600" },
        { icon: Activity, label: "Activities", path: "/activities", color: "from-green-500 to-green-600" },
        { icon: Award, label: "Achievements", path: "/achievements", color: "from-purple-500 to-purple-600" },
        { icon: Users, label: "Community", path: "/community", color: "from-pink-500 to-pink-600" },
    ];

    // Animation variants
    const navVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const logoVariants = {
        hover: {
            scale: 1.05,
            rotate: [0, -5, 5, 0],
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        }
    };

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: {
                duration: 0.2
            }
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const mobileMenuVariants = {
        hidden: {
            x: "100%",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        visible: {
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const notificationVariants = {
        pulse: {
            scale: [1, 1.2, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <>
            <motion.header
                className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                    scrolled 
                        ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg' 
                        : 'bg-white/90 backdrop-blur-xl border-b border-gray-100'
                }`}
                variants={navVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo Section */}
                        <motion.div 
                            className="flex items-center gap-3 cursor-pointer"
                            variants={logoVariants}
                            whileHover="hover"
                            onClick={() => navigate("/dashboard")}
                        >
                            <div className="relative">
                                <motion.div
                                    className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                                    whileHover={{ 
                                        boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.04)" 
                                    }}
                                >
                                    <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                </motion.div>
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 blur"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.2, 0.4, 0.2]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                                    Gamified
                                </span>
                                <motion.span 
                                    className="text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Wellness Hub
                                </motion.span>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-2">
                            {/* Quick Navigation Items */}
                            {quickNavItems.map((item) => (
                                <motion.button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className="relative px-4 py-2 text-gray-600 hover:text-gray-900 rounded-xl font-medium transition-all duration-300 hover:bg-gray-50 group"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <item.icon className="w-4 h-4" />
                                        <span className="hidden xl:inline">{item.label}</span>
                                    </span>
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 rounded-xl`}
                                        whileHover={{ opacity: 0.1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.button>
                            ))}
                            {/* Dashboard Button removed */}
                            <motion.div 
                                className="relative cursor-pointer ml-4"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <motion.div
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-300"
                                    onClick={() => {
                                        navigate("/notifications");
                                        setNotifications(0);
                                    }}
                                >
                                    <Bell className="w-5 h-5" />
                                </motion.div>
                                
                                <AnimatePresence>
                                    {notifications > 0 && (
                                        <motion.div
                                            className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1"
                                            variants={notificationVariants}
                                            animate="pulse"
                                            exit={{ scale: 0, opacity: 0 }}
                                        >
                                            {notifications}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            {/* User Profile Dropdown */}
                            <div className="relative ml-2" ref={dropdownRef}>
                                <motion.button
                                    onClick={() => setDropdown(!dropdown)}
                                    className="flex items-center gap-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-900 transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {user?.picture ? (
                                        <img
                                            src={user.picture}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-lg border-2 border-blue-200 object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            {getInitials(user?.email)}
                                        </div>
                                    )}
                                    <span className="font-medium text-sm max-w-24 truncate hidden sm:block">
                                        {user?.name || user?.email}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: dropdown ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </motion.div>
                                </motion.button>

                                <AnimatePresence>
                                    {dropdown && (
                                        <motion.div
                                            className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
                                            variants={dropdownVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                        >
                                            <div className="p-2">
                                                {/* Profile Info */}
                                                <div className="px-4 py-4 border-b border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        {user?.picture ? (
                                                            <img
                                                                src={user.picture}
                                                                alt="avatar"
                                                                className="w-12 h-12 rounded-xl border-2 border-blue-200 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                                {getInitials(user?.email)}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                                {user?.name || "User"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {user?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Quick Stats */}
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <div className="grid grid-cols-3 gap-3 text-center">
                                                        <div>
                                                            <div className="text-lg font-bold text-blue-600">12</div>
                                                            <div className="text-xs text-gray-500">Level</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-green-600">1.2K</div>
                                                            <div className="text-xs text-gray-500">Points</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-purple-600">28</div>
                                                            <div className="text-xs text-gray-500">Streak</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Menu Items */}
                                                <div className="py-2">
                                                    <motion.button
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                                                        onClick={() => {
                                                            setDropdown(false);
                                                            navigate("/profile");
                                                        }}
                                                        whileHover={{ x: 4 }}
                                                    >
                                                        <User className="w-4 h-4" />
                                                        <span className="text-sm font-medium">View Profile</span>
                                                    </motion.button>
                                                    <motion.button
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                                                        onClick={() => {
                                                            setDropdown(false);
                                                            navigate("/settings");
                                                        }}
                                                        whileHover={{ x: 4 }}
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Settings</span>
                                                    </motion.button>
                                                    <motion.button
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                        onClick={handleLogout}
                                                        whileHover={{ x: 4 }}
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Logout</span>
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </nav>

                        {/* Mobile Menu Button */}
                        <motion.button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="lg:hidden w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AnimatePresence mode="wait">
                                {mobileMenu ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenu && (
                    <motion.div
                        className="fixed inset-0 z-40 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setMobileMenu(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Mobile Menu */}
                        <motion.div
                            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white border-l border-gray-200 shadow-2xl"
                            variants={mobileMenuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        {user?.picture ? (
                                            <img
                                                src={user.picture}
                                                alt="avatar"
                                                className="w-12 h-12 rounded-xl border-2 border-blue-200 object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                {getInitials(user?.email)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-900 font-semibold truncate">
                                                {user?.name || "User"}
                                            </p>
                                            <p className="text-gray-500 text-sm truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Quick Stats Mobile */}
                                    <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                                        <div className="py-2 px-3 bg-blue-50 rounded-lg">
                                            <div className="text-lg font-bold text-blue-600">12</div>
                                            <div className="text-xs text-gray-500">Level</div>
                                        </div>
                                        <div className="py-2 px-3 bg-green-50 rounded-lg">
                                            <div className="text-lg font-bold text-green-600">1.2K</div>
                                            <div className="text-xs text-gray-500">Points</div>
                                        </div>
                                        <div className="py-2 px-3 bg-purple-50 rounded-lg">
                                            <div className="text-lg font-bold text-purple-600">28</div>
                                            <div className="text-xs text-gray-500">Streak</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 p-6 space-y-2">
                                    {quickNavItems.map((item) => (
                                        <motion.button
                                            key={item.path}
                                            onClick={() => {
                                                navigate(item.path);
                                                setMobileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-4 px-4 py-4 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </motion.button>
                                    ))}

                                    <motion.button
                                        onClick={() => {
                                            navigate("/notifications");
                                            setNotifications(0);
                                            setMobileMenu(false);
                                        }}
                                        className="w-full flex items-center gap-4 px-4 py-4 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="relative">
                                            <Bell className="w-5 h-5" />
                                            {notifications > 0 && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                                            )}
                                        </div>
                                        <span className="font-medium">Notifications</span>
                                        {notifications > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                {notifications}
                                            </span>
                                        )}
                                    </motion.button>

                                    <motion.button
                                        onClick={() => {
                                            navigate("/profile");
                                            setMobileMenu(false);
                                        }}
                                        className="w-full flex items-center gap-4 px-4 py-4 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">View Profile</span>
                                    </motion.button>

                                    <motion.button
                                        onClick={() => {
                                            navigate("/settings");
                                            setMobileMenu(false);
                                        }}
                                        className="w-full flex items-center gap-4 px-4 py-4 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span className="font-medium">Settings</span>
                                    </motion.button>
                                </div>

                                {/* Footer */}
                                <div className="p-6 border-t border-gray-100">
                                    <motion.button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-4 px-4 py-4 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Logout</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}