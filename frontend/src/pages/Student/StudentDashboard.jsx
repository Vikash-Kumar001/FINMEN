import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Smile,
    Gamepad2,
    Book,
    Wallet,
    Gift,
    Bell,
    TrendingUp,
    User,
    Settings,
    Heart,
    Star,
    Flame,
    Trophy,
    Calendar,
    ArrowUp,
    Sparkles,
    Zap,
    Target,
    Award,
    Crown,
    Rocket,
    Shield,
    Diamond,
    ChevronRight,
    Play,
    BarChart3,
    Clock,
    Coins,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWallet } from "../../context/WalletContext";
import { fetchStudentStats } from "../../services/userService";
import { fetchStudentFeatures, fetchStudentAchievements } from "../../services/studentService";
import { logActivity } from "../../services/activityService";
import { toast } from "react-hot-toast";
import { mockFeatures } from "../../data/mockFeatures";

export default function StudentDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { wallet } = useWallet();
    const [featureCards, setFeatureCards] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [stats, setStats] = useState({
        xp: 0,
        level: 1,
        nextLevelXp: 100,
        todayMood: "😊",
        streak: 0,
        rank: 0,
        weeklyXP: 0,
    });
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    
    // Track dashboard page view
    useEffect(() => {
        // Log dashboard view activity
        logActivity({
            activityType: "page_view",
            description: "Viewed student dashboard",
            metadata: {
                page: "/student/dashboard",
                timestamp: new Date().toISOString()
            },
            pageUrl: window.location.pathname
        });
        
        // Welcome toast for returning users
        if (user?.name) {
            toast.success(`Welcome back, ${user.name}! 🎮`, {
                duration: 3000,
                position: "top-center",
                icon: "👋"
            });
        }
    }, [user]);
    
    useEffect(() => {
        // Directly use mockFeatures data to ensure all financial literacy pages are linked
        setFeatureCards(mockFeatures);
        setLoading(false);
    }, []);
    
    useEffect(() => {
        // Fetch achievements using service
        const getAchievements = async () => {
            try {
                const data = await fetchStudentAchievements();
                setAchievements(data);
            } catch (error) {
                console.error('Error fetching achievements:', error);
                setAchievements([]);
            } finally {
                setLoading(false);
            }
        };
        
        getAchievements();
    }, []);

    // Load student stats with error handling and real data
    const loadStats = React.useCallback(async () => {
        try {
            setLoading(true);
            
            // Log stats loading activity
            logActivity({
                activityType: "data_fetch",
                description: "Loaded student dashboard stats",
                metadata: {
                    action: "load_stats",
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
            
            const res = await fetchStudentStats();
            if (res && (res.xp !== undefined || res.data)) {
                // Support both direct and nested data
                const data = res.data || res;
                setStats({
                    xp: data.xp || 0,
                    level: data.level || 1,
                    nextLevelXp: data.nextLevelXp || 100,
                    todayMood: data.todayMood || "😊",
                    streak: data.streak || 0,
                    rank: data.rank || 0,
                    weeklyXP: data.weeklyXP || 0,
                });
            }
        } catch (err) {
            // Log error activity
            logActivity({
                activityType: "error",
                description: "Failed to load student stats",
                metadata: {
                    errorMessage: err.message || "Unknown error",
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
            
            // Show error toast
            toast.error("Could not load your stats. Please try again later.", {
                duration: 3000,
                position: "top-center",
                icon: "❌"
            });
            
            console.error("❌ Failed to load student stats", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleNavigate = (path, featureTitle) => {
        if (path && typeof path === "string") {
            console.log("Navigating to:", path);
            
            // Log feature usage activity
            logActivity({
                activityType: "navigation",
                description: `Navigated to: ${featureTitle || path}`,
                metadata: {
                    featurePath: path,
                    featureTitle: featureTitle,
                    fromPage: "dashboard",
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
            
            navigate(path);
        } else {
            console.log("Invalid path, navigating to default");
            navigate("/student/dashboard");
        }
    };

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const categories = [
        "all",
        "wellness",
        "entertainment",
        "creativity",
        "finance",
        "education",
        "rewards",
        "shopping",
        "competition",
        "social",
        "personal",
        "challenges",
    ];

    const filteredCards =
        selectedCategory === "all"
            ? featureCards
            : featureCards.filter((card) => card.category === selectedCategory);
    
    console.log("Selected Category:", selectedCategory);
    console.log("Filtered Cards:", filteredCards);
    console.log("All Feature Cards:", featureCards);

    const progressPercentage = (stats.xp / stats.nextLevelXp) * 100;

    // Animation variants
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

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

                {/* Floating geometric shapes */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-6 h-6 bg-yellow-400 rounded-full opacity-60"
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
                    className="absolute top-2/3 right-1/4 w-4 h-4 bg-pink-400 rotate-45 opacity-50"
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
                    className="absolute bottom-1/3 left-2/3 w-8 h-8 bg-blue-400 rounded-full opacity-40"
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
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                                {loading
                                    ? "Game On, Player!"
                                    : `Game On, ${user?.name || "Player"}!`}
                            </span>
                            <span className="text-black dark:text-white drop-shadow-sm">
                                🎮
                            </span>
                        </h1>
                        {/* Sparkle effects around the title */}
                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-pink-400 animate-bounce delay-300">
                            <Star className="w-5 h-5" />
                        </div>
                    </motion.div>
                    <motion.p
                        className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Level up your life, one quest at a time ✨
                    </motion.p>

                    {/* Welcome back message for returning users */}
                    {!loading && user?.name && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full shadow-lg border border-green-200"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, delay: 1.2 }}
                            >
                                👋
                            </motion.div>
                            <span className="font-semibold">Welcome back, {user.name}!</span>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, delay: 1.5 }}
                            >
                                🚀
                            </motion.div>
                        </motion.div>
                    )}
                    
                    {/* Quick Access Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="mt-4 flex flex-wrap gap-3 justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigate('/student/quick-start', 'Quick Start')}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full font-medium shadow-md inline-flex items-center"
                        >
                            <Rocket className="w-4 h-4 mr-2" />
                            Quick Start
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigate('/student/this-week', 'This Week')}
                            className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-5 py-2 rounded-full font-medium shadow-md inline-flex items-center"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            This Week
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigate('/student/daily-goal', 'Daily Goal')}
                            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2 rounded-full font-medium shadow-md inline-flex items-center"
                        >
                            <Flame className="w-4 h-4 mr-2" />
                            Daily Goal
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Player Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/8 to-pink-500/8" />

                    {loading ? (
                        <div className="relative z-10 animate-pulse">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-300 rounded-2xl"></div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-gray-300 rounded mb-2 w-24"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-2 w-16"></div>
                                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-200 p-4 rounded-2xl h-20"></div>
                                    <div className="bg-gray-200 p-4 rounded-2xl h-20"></div>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-12 h-12 bg-gray-300 rounded-xl"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                            {/* Level Progress */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <motion.div
                                        className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {stats.level}
                                    </motion.div>
                                    <motion.div
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        <Crown className="w-4 h-4 text-yellow-800" />
                                    </motion.div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                        Level {stats.level}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2 font-medium">
                                        {stats.xp.toLocaleString()}/
                                        {stats.nextLevelXp.toLocaleString()} XP
                                    </p>
                                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative shadow-sm"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-full" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-2xl text-center shadow-lg border border-orange-200"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Flame className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm font-bold text-orange-700">
                                            Streak
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-orange-600">
                                        {stats.streak}
                                    </div>
                                    <div className="text-xs text-orange-500 font-medium">
                                        days
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl text-center shadow-lg border border-green-200"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Coins className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-bold text-green-700">
                                            Coins
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-green-600">
                                        {wallet?.balance || 0}
                                    </div>
                                    <div className="text-xs text-green-500 font-medium">
                                        HealCoins
                                    </div>
                                </motion.div>
                            </div>

                            {/* Achievement Badges */}
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                                {achievements.map((achievement, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-xl shadow-lg cursor-pointer group relative border border-yellow-300"
                                        onClick={() => {
                                            // Log achievement badge interaction
                            logActivity({
                                activityType: "ui_interaction",
                                description: `Viewed achievement: ${achievement.title}`,
                                metadata: {
                                    achievementTitle: achievement.title,
                                    achievementDescription: achievement.description,
                                    section: "achievement_badges",
                                    timestamp: new Date().toISOString()
                                },
                                pageUrl: window.location.pathname
                            });
                            
                            // Show toast for achievement view
                            toast.success(`${achievement.title} - ${achievement.description}`, {
                                duration: 3000,
                                position: "bottom-center",
                                icon: "🏆"
                            });
                                        }}
                                    >
                                        <div className="text-white">{achievement.icon}</div>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-50 shadow-xl">
                                            <div className="font-bold">{achievement.title}</div>
                                            <div className="text-gray-300">
                                                {achievement.description}
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
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
                    {filteredCards.map((card, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                y: -8,
                                transition: { duration: 0.2 },
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group cursor-pointer relative"
                            onClick={() => {
                                // Log feature card click with detailed metadata
                                logActivity({
                                    activityType: "ui_interaction",
                                    description: `Selected feature: ${card.title}`,
                                    metadata: {
                                        featureTitle: card.title,
                                        featureCategory: card.category,
                                        featurePath: card.path,
                                        xpReward: card.xpReward,
                                        section: "feature_cards",
                                        timestamp: new Date().toISOString()
                                    },
                                    pageUrl: window.location.pathname
                                });
                                
                                // Show toast for feature selection
                                toast.success(`Loading ${card.title}...`, {
                                    duration: 2000,
                                    position: "bottom-center",
                                    icon: "🚀"
                                });
                                handleNavigate(card.path, card.title);
                            }}
                        >
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full">
                                <div
                                    className={`absolute inset-0 bg-gradient-to-r from-${card.color.replace('bg-', '')} to-${card.color.replace('bg-', '')}/70 opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                />

                                <div className="relative z-10 flex flex-col items-center text-center h-full">
                                    <motion.div
                                        className={`w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <span className="text-2xl">{card.icon}</span>
                                    </motion.div>

                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        {card.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-4 flex-1">
                                        {card.description}
                                    </p>

                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                                            <Zap className="w-4 h-4" />
                                            <span>+{card.xpReward} XP</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
                >
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-3xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Play className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Quick Start</h3>
                        </div>
                        <p className="text-purple-100 text-sm mb-4">
                            Jump into your favorite activity
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all"
                            onClick={() => {
                                // Log quick action button click
                            logActivity({
                                activityType: "ui_interaction",
                                description: "Clicked Quick Start button",
                                metadata: {
                                    action: "quick_start_button",
                                    section: "quick_actions",
                                    timestamp: new Date().toISOString()
                                },
                                pageUrl: window.location.pathname
                            });
                            
                            // Show toast for quick start
                            toast.success("Starting your journey!", {
                                duration: 2000,
                                position: "bottom-center",
                                icon: "🚀"
                            });
                                handleNavigate('/student/quick-start', 'Quick Start');
                            }}
                        >
                            Start Now
                        </motion.button>
                    </div>

                    <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-3xl text-white shadow-xl cursor-pointer"
                        onClick={() => {
                            // Log this week card click
                            logActivity({
                                activityType: "ui_interaction",
                                description: "Clicked This Week card",
                                metadata: {
                                    action: "this_week_card",
                                    section: "quick_actions",
                                    weeklyXP: stats.weeklyXP,
                                    timestamp: new Date().toISOString()
                                },
                                pageUrl: window.location.pathname
                            });
                            
                            // Show toast for this week view
                            toast.success(`You earned +${stats.weeklyXP} XP this week!`, {
                                duration: 2000,
                                position: "bottom-center",
                                icon: "📊"
                            });
                            handleNavigate('/student/this-week', 'This Week');
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart3 className="w-8 h-8" />
                            <h3 className="text-xl font-bold">This Week</h3>
                        </div>
                        <p className="text-green-100 text-sm mb-4">
                            +{stats.weeklyXP} XP earned
                        </p>
                        <div className="text-2xl font-bold">🔥 Great job!</div>
                    </div>

                    <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-3xl text-white shadow-xl cursor-pointer"
                        onClick={() => {
                            // Log daily goal card click
                            logActivity({
                                activityType: "ui_interaction",
                                description: "Clicked Daily Goal card",
                                metadata: {
                                    action: "daily_goal_card",
                                    section: "quick_actions",
                                    timestamp: new Date().toISOString()
                                },
                                pageUrl: window.location.pathname
                            });
                            
                            // Show toast for daily goal
                            toast.success("Let's achieve your daily goal!", {
                                duration: 2000,
                                position: "bottom-center",
                                icon: "🎯"
                            });
                            handleNavigate('/student/daily-goal', 'Daily Goal');
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Daily Goal</h3>
                        </div>
                        <p className="text-orange-100 text-sm mb-4">
                            Complete 3 activities
                        </p>
                        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                            <div className="bg-white h-2 rounded-full w-2/3" />
                        </div>
                        <div className="text-sm">2/3 Done</div>
                    </div>

                    <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-3xl text-white shadow-xl cursor-pointer"
                        onClick={() => {
                            // Log challenges card click
                            logActivity({
                                activityType: "ui_interaction",
                                description: "Clicked Challenges card",
                                metadata: {
                                    action: "challenges_card",
                                    section: "quick_actions",
                                    timestamp: new Date().toISOString()
                                },
                                pageUrl: window.location.pathname
                            });
                            
                            // Show toast for challenges
                            toast.success("Ready for a challenge?", {
                                duration: 2000,
                                position: "bottom-center",
                                icon: "🏆"
                            });
                            handleNavigate('/student/challenge', 'Challenges');
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Trophy className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Challenges</h3>
                        </div>
                        <p className="text-blue-100 text-sm mb-4">
                            Complete daily challenges
                        </p>
                        <div className="text-2xl font-bold">🏆 Win rewards!</div>
                    </div>

                    <div 
                        className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-3xl text-white shadow-xl cursor-pointer"
                        onClick={() => {
                            // Log mood tracker card click
                            logActivity({
                                activityType: "ui_interaction",
                                description: "Clicked Today's Mood card",
                                metadata: {
                                    action: "mood_tracker_card",
                                    section: "quick_actions",
                                    currentMood: stats.todayMood,
                                    timestamp: new Date().toISOString()
                                },
                                pageUrl: window.location.pathname
                            });
                            
                            // Show toast for mood tracking
                            toast.success(`Current mood: ${stats.mood}. Let's update it!`, {
                                duration: 2000,
                                position: "bottom-center",
                                icon: "😊"
                            });
                            handleNavigate("/student/mood-tracker", "Today's Mood");
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Clock className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Today's Mood</h3>
                        </div>
                        <p className="text-pink-100 text-sm mb-4">How are you feeling?</p>
                        <div className="text-4xl hover:scale-110 transition-transform">
                            {stats.todayMood}
                        </div>
                    </div>
                </motion.div>

                {/* Motivational Footer */}
                <div className="text-center mt-10">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg animate-pulse">
                        <Sparkles className="w-6 h-6" />
                        <span>Every small step counts! Keep going champion! 🚀</span>
                        <Sparkles className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}
