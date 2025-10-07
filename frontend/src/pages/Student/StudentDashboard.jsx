import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
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
    Lock,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../context/WalletContext";
import { fetchStudentAchievements } from "../../services/studentService";
import { logActivity } from "../../services/activityService";
import { 
    fetchStudentDashboardData, 
    fetchNotifications,
    markNotificationAsRead,
    refreshDashboardData,
    cacheDashboardData
} from "../../services/dashboardService";
import { toast } from "react-hot-toast";
import { mockFeatures } from "../../data/mockFeatures";
import { useSocket } from '../../context/SocketContext';

export default function StudentDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { wallet } = useWallet();
    const [featureCards, setFeatureCards] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
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
    const { socket } = useSocket();
    
    // Calculate user's age from date of birth
    const calculateUserAge = (dob) => {
        if (!dob) return null;
        
        // Handle both string and Date object formats
        const dobDate = typeof dob === 'string' ? new Date(dob) : new Date(dob);
        if (isNaN(dobDate.getTime())) return null;
        
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        
        // Adjust if birthday hasn't occurred this year yet
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        
        return age;
    };
    
    // Check if user can access a specific game based on age and completion
    const canAccessGame = (gameType, userAge) => {
        if (userAge === null) return false;
        
        switch (gameType) {
            case 'kids':
                // Kids games: accessible to all users
                return true;
            case 'teens':
                // Teens games: accessible to all users
                return true;
            case 'adults':
                // Adult games: accessible to users 18 and above
                return userAge >= 18;
            default:
                return true;
        }
    };
    
    // Check if kids games are completed (in a real app, this would check actual completion)
    const areKidsGamesCompleted = () => {
        // For demo purposes, we'll simulate this with a simple check
        // In a real implementation, this would check the user's game progress
        return false; // Will be updated to check actual completion of 20 games
    };
    
    // Check if teen games are completed (in a real app, this would check actual completion)
    const areTeenGamesCompleted = () => {
        // For demo purposes, we'll simulate this with a simple check
        // In a real implementation, this would check the user's game progress
        return false; // Will be updated to check actual completion of 20 games
    };
    
    // Get game access status for the current user
    const getGameAccessStatus = () => {
        const userAge = calculateUserAge(user?.dateOfBirth || user?.dob);
        if (userAge === null) return {};
        
        return {
            userAge,
        };
    };
    
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
    // Load comprehensive dashboard data
    const loadDashboardData = React.useCallback(async () => {
        try {
            setLoading(true);

            // Log dashboard data loading activity
            logActivity({
                activityType: "data_fetch",
                description: "Loading comprehensive dashboard data",
                metadata: {
                    action: "load_dashboard_data",
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });

            // Fetch all dashboard data using the new service
            const data = await fetchStudentDashboardData();
            setDashboardData(data);
            
            // Update individual state with fetched data
            if (data.stats) {
                setStats({
                    xp: data.stats.xp || 0,
                    level: data.stats.level || 1,
                    nextLevelXp: data.stats.nextLevelXp || 100,
                    todayMood: data.stats.todayMood || "😊",
                    streak: data.stats.streak || 0,
                    rank: data.stats.rank || 0,
                    weeklyXP: data.stats.weeklyXP || 0,
                });
            }
            
            if (data.achievements) {
                setAchievements(data.achievements);
            }
            
            if (data.activities) {
                setRecentActivities(data.activities);
            }
            
            if (data.challenges) {
                // Handle daily challenges data structure
                const challengesData = Array.isArray(data.challenges) 
                    ? data.challenges.map(item => item.challenge || item)
                    : [];
                setChallenges(challengesData);
            }

            // Cache the dashboard data
            cacheDashboardData('student', data);
            
        } catch (err) {
            // Log error activity
            logActivity({
                activityType: "error",
                description: "Failed to load dashboard data",
                metadata: {
                    errorMessage: err.message || "Unknown error",
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
            
            // Show error toast
            toast.error("Could not load dashboard data. Please try again later.", {
                duration: 3000,
                position: "top-center",
                icon: "❌"
            });
            
            console.error("❌ Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load notifications
    const loadNotifications = React.useCallback(async () => {
        try {
            const notificationData = await fetchNotifications('student', true);
            setNotifications(notificationData);
        } catch (err) {
            console.error("❌ Failed to load notifications", err);
        }
    }, []);

    // Handle notification click
    const handleNotificationClick = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            // Refresh notifications
            loadNotifications();
            
            toast.success("Notification marked as read", {
                duration: 2000,
                position: "bottom-center",
                icon: "✅"
            });
        } catch (err) {
            console.error("❌ Failed to mark notification as read", err);
        }
    };

    // Refresh dashboard data
    const handleRefreshData = async () => {
        try {
            setLoading(true);
            const refreshedData = await refreshDashboardData('student');
            setDashboardData(refreshedData);
            
            // Update stats with refreshed data
            if (refreshedData.stats) {
                setStats({
                    xp: refreshedData.stats.xp || 0,
                    level: refreshedData.stats.level || 1,
                    nextLevelXp: refreshedData.stats.nextLevelXp || 100,
                    todayMood: refreshedData.stats.todayMood || "😊",
                    streak: refreshedData.stats.streak || 0,
                    rank: refreshedData.stats.rank || 0,
                    weeklyXP: refreshedData.stats.weeklyXP || 0,
                });
            }
            
            toast.success("Dashboard data refreshed!", {
                duration: 2000,
                position: "top-center",
                icon: "🔄"
            });
        } catch (err) {
            console.error("Error refreshing data:", err.message);
            toast.error("Failed to refresh data", {
                duration: 3000,
                position: "top-center",
                icon: "❌"
            });
        } finally {
            setLoading(false);
        }
    };

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
        loadDashboardData();
        loadNotifications();
    }, [loadDashboardData]);

    useEffect(() => {
        if (!socket) return;
        
        const handleGameCompleted = (data) => {
            setStats((prev) => ({ ...prev, streak: data.streak }));
            toast.success(`🎮 Game completed! +${data.coinsEarned} HealCoins`);
        };
        
        const handleChallengeCompleted = (data) => {
            setStats((prev) => ({ ...prev, streak: prev.streak + 1 }));
            toast.success(`🏆 Challenge completed! +${data.rewards?.coins || 0} HealCoins, +${data.rewards?.xp || 0} XP`);
            
            // Trigger leaderboard update
            socket.emit('xp-updated');
        };
        
        const handleLevelUp = (data) => {
            setStats((prev) => ({ 
                ...prev, 
                level: data.newLevel, 
                xp: data.totalXP 
            }));
            toast.success(
                <div>
                    <p>🎉 Level Up! You're now Level {data.newLevel}!</p>
                    <p>+{data.coinsEarned} HealCoins bonus!</p>
                </div>
            );
        };
        
        socket.on('game-completed', handleGameCompleted);
        socket.on('challenge-completed', handleChallengeCompleted);
        socket.on('level-up', handleLevelUp);
        
        return () => {
            socket.off('game-completed', handleGameCompleted);
            socket.off('challenge-completed', handleChallengeCompleted);
            socket.off('level-up', handleLevelUp);
        };
    }, [socket]);

    const categories = [
        { key: "all", label: "All" },
        { key: "finance", label: "Financial Literacy" },
        { key: "wellness", label: "Brain Health" },
        { key: "personal", label: "UVLS (Life Skills & Values)" },
        { key: "education", label: "Digital Citizenship & Online Safety" },
        { key: "creativity", label: "Moral Values" },
        { key: "entertainment", label: "AI for All" },
        { key: "social", label: "Health - Male" },
        { key: "competition", label: "Health - Female" },
        { key: "rewards", label: "Entrepreneurship & Higher Education" },
        { key: "shopping", label: "Civic Responsibility & Global Citizenship" },
        { key: "challenges", label: "Challenges" },
    ];

    const filteredCards =
        selectedCategory === "all"
            ? featureCards.filter((card) => 
                !(card.title === "Kids Games" || 
                  card.title === "Teen Games" || 
                  card.title === "Adult Games")
              )
            : selectedCategory === "challenges"
                ? featureCards.filter((card) => card.category === selectedCategory)
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
                        
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefreshData}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-full font-medium shadow-md inline-flex items-center"
                        >
                            <ArrowUp className="w-4 h-4 mr-2" />
                            Refresh Data
                        </motion.button>
                    </motion.div>
                    
                    {/* Notifications Badge */}
                    {notifications.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2 }}
                            className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-6 py-3 rounded-full shadow-lg border border-red-200 cursor-pointer"
                            onClick={() => handleNotificationClick(notifications[0]?.id)}
                        >
                            <Bell className="w-4 h-4" />
                            <span className="font-semibold">{notifications.length} new notification{notifications.length !== 1 ? 's' : ''}</span>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 1.5 }}
                            >
                                🔔
                            </motion.div>
                        </motion.div>
                    )}
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
                                key={category.key}
                                onClick={() => setSelectedCategory(category.key)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full font-semibold transition-all ${selectedCategory === category.key
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                                        : "bg-white/80 text-gray-700 hover:bg-white shadow-md"
                                    }`}
                            >
                                {category.label}
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
                    {filteredCards.map((card, i) => {
                        // Create a unique key for each card
                        const cardKey = card.id ? `${card.id}-${i}` : `${card.title}-${card.category}-${i}`;
                        
                        // Check if this is a game card
                        const isGameCard = ['Kids Games', 'Teen Games', 'Adult Games'].includes(card.title);
                        const gameAccess = getGameAccessStatus();
                        const userAge = gameAccess.userAge;
                        
                        // Determine if the game is playable based on age and completion
                        let isDisabled = false;
                        let disabledMessage = "";
                        let lockReason = "";
                        
                        if (isGameCard && userAge !== null) {
                            if (userAge < 13) {
                                // 0-13.9 years old category
                                if (card.title === 'Kids Games') {
                                    // Kids games: always accessible
                                    isDisabled = false;
                                } else if (card.title === 'Teen Games') {
                                    // Teen games: accessible only after completing kids games
                                    if (!areKidsGamesCompleted()) {
                                        isDisabled = true;
                                        disabledMessage = "Complete all 20 finance related games from Kids section first.";
                                        lockReason = "Completion Required";
                                    }
                                } else if (card.title === 'Adult Games') {
                                    // Adult games: locked until 18
                                    isDisabled = true;
                                    disabledMessage = `Available at age 18. You are ${userAge} years old.`;
                                    lockReason = "Age Restricted";
                                }
                            } else if (userAge >= 13 && userAge <= 17) {
                                // 14-17.9 years old category
                                if (card.title === 'Kids Games') {
                                    // Kids games: accessible
                                    isDisabled = false;
                                } else if (card.title === 'Teen Games') {
                                    // Teen games: accessible
                                    isDisabled = false;
                                } else if (card.title === 'Adult Games') {
                                    // Adult games: accessible only after completing teen games
                                    if (!areTeenGamesCompleted()) {
                                        isDisabled = true;
                                        disabledMessage = "Complete all games from Teen section first.";
                                        lockReason = "Completion Required";
                                    }
                                }
                            } else if (userAge >= 18) {
                                // 18 and above category
                                if (card.title === 'Kids Games') {
                                    // Kids games: locked for lifetime
                                    isDisabled = true;
                                    disabledMessage = "Kids Games are only available for users under 18 years old.";
                                    lockReason = "Age Restricted";
                                } else if (card.title === 'Teen Games') {
                                    // Teen games: accessible
                                    isDisabled = false;
                                } else if (card.title === 'Adult Games') {
                                    // Adult games: accessible
                                    isDisabled = false;
                                }
                            }
                        }
                        
                        return (
                            <motion.div
                                key={cardKey}
                                variants={itemVariants}
                                whileHover={isDisabled ? {} : {
                                    scale: 1.05,
                                    y: -8,
                                    transition: { duration: 0.2 },
                                }}
                                whileTap={isDisabled ? {} : { scale: 0.95 }}
                                className={`group relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={() => {
                                    if (isDisabled) {
                                        toast.error(disabledMessage, {
                                            duration: 4000,
                                            position: "bottom-center",
                                            icon: "🔒"
                                        });
                                        return;
                                    }
                                    
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
                                <div className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 transition-all duration-300 relative overflow-hidden h-full ${
                                    isDisabled 
                                        ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300' 
                                        : 'hover:shadow-2xl'
                                }`}>
                                    {isDisabled && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center z-10">
                                            <div className="bg-black/20 backdrop-blur-sm rounded-full p-4 flex flex-col items-center">
                                                <Lock className="w-8 h-8 text-white" />
                                                {lockReason && (
                                                    <span className="text-white text-xs mt-1 font-medium">{lockReason}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-r from-${card.color.replace('bg-', '')} to-${card.color.replace('bg-', '')}/70 opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                    />

                                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                                        <motion.div
                                            className={`w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                                                isDisabled ? 'grayscale opacity-70' : ''
                                            }`}
                                            whileHover={isDisabled ? {} : { rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <span className="text-2xl">{card.icon}</span>
                                        </motion.div>

                                        <h3 className={`text-lg font-bold mb-2 ${
                                            isDisabled ? 'text-gray-500' : 'text-gray-800'
                                        }`}>
                                            {card.title}
                                        </h3>

                                        <p className={`text-sm mb-4 flex-1 ${
                                            isDisabled ? 'text-gray-500' : 'text-gray-600'
                                        }`}>
                                            {card.description}
                                        </p>

                                        <div className="flex items-center justify-between w-full">
                                            <div className={`flex items-center gap-1 text-xs font-semibold ${
                                                isDisabled ? 'text-gray-500' : 'text-indigo-600'
                                            }`}>
                                                <Zap className="w-4 h-4" />
                                                <span>+{card.xpReward} XP</span>
                                            </div>
                                            {isDisabled ? (
                                                <Lock className="w-4 h-4 text-gray-500" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                            )}
                                        </div>
                                        
                                        {isDisabled && userAge !== null && (
                                            <div className="mt-3 text-xs text-gray-600 text-center bg-white/50 rounded-lg p-2">
                                                <span className="font-medium">{disabledMessage}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Recent Activities and Challenges Section */}
                {(recentActivities.length > 0 || challenges.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                    >
                        {/* Recent Activities */}
                        {recentActivities.length > 0 && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-500" />
                                    Recent Activities
                                </h3>
                                <div className="space-y-3">
                                    {recentActivities.slice(0, 5).map((activity, i) => (
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
                        )}
                        
                        {/* Active Challenges */}
                        {challenges.length > 0 && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Active Challenges
                                </h3>
                                <div className="space-y-3">
                                    {challenges.slice(0, 3).map((challenge, i) => (
                                        <div 
                                            key={i} 
                                            className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors"
                                            onClick={() => {
                                                // Log challenge click
                                                logActivity({
                                                    activityType: "ui_interaction",
                                                    description: `Clicked active challenge: ${challenge.title || challenge.name}`,
                                                    metadata: {
                                                        action: "active_challenge_click",
                                                        challengeId: challenge._id,
                                                        challengeTitle: challenge.title || challenge.name,
                                                        timestamp: new Date().toISOString()
                                                    },
                                                    pageUrl: window.location.pathname
                                                });
                                                
                                                // Navigate to daily challenges page
                                                toast.success(`Starting challenge: ${challenge.title || challenge.name}!`, {
                                                    duration: 2000,
                                                    position: "bottom-center",
                                                    icon: "🏆"
                                                });
                                                handleNavigate('/student/daily-challenges', 'Daily Challenges');
                                            }}
                                        >
                                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {challenge.title || challenge.name || `Daily Challenge - ${new Date().toISOString().split('T')[0]}`}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {challenge.description || 'Complete this daily challenge to earn rewards!'}
                                                </p>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div 
                                                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                                                        style={{ width: `${challenge.progress || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-green-600 font-semibold">
                                                +{challenge.coinReward || 15} 🪙
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            logActivity({
                                                activityType: "ui_interaction",
                                                description: "Clicked View All Challenges button",
                                                metadata: {
                                                    action: "view_all_challenges",
                                                    section: "active_challenges",
                                                    timestamp: new Date().toISOString()
                                                },
                                                pageUrl: window.location.pathname
                                            });
                                            
                                            toast.success("Let's complete some challenges!", {
                                                duration: 2000,
                                                position: "bottom-center",
                                                icon: "🎯"
                                            });
                                            handleNavigate('/student/daily-challenges', 'Daily Challenges');
                                        }}
                                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                                    >
                                        View All Challenges
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

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
                    
                    {/* Debug Info - Hidden unless dashboardData exists */}
                    {dashboardData && import.meta.env.DEV && (
                        <div className="mt-4 text-xs text-gray-500">
                            <p>Dashboard data loaded: {new Date().toLocaleTimeString()}</p>
                            <p>Activities: {dashboardData.activities?.length || 0}, Challenges: {dashboardData.challenges?.length || 0}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
