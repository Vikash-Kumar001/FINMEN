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

const featureCards = [
    {
        title: "Mood Tracker",
        icon: <Smile className="w-8 h-8" />,
        path: "/student/mood-tracker",
        gradient: "from-pink-400 via-rose-400 to-red-400",
        description: "Track emotions daily",
        xpReward: 25,
        category: "wellness",
    },
    {
        title: "Mini Games",
        icon: <Gamepad2 className="w-8 h-8" />,
        path: "/student/games",
        gradient: "from-purple-400 via-violet-400 to-indigo-400",
        description: "Play & earn rewards",
        xpReward: 50,
        category: "entertainment",
    },
    {
        title: "Journal",
        icon: <Book className="w-8 h-8" />,
        path: "/student/journal",
        gradient: "from-amber-400 via-orange-400 to-red-400",
        description: "Write your thoughts",
        xpReward: 30,
        category: "creativity",
    },
    {
        title: "Wallet",
        icon: <Wallet className="w-8 h-8" />,
        path: "/student/wallet",
        gradient: "from-green-400 via-emerald-400 to-teal-400",
        description: "Manage HealCoins",
        xpReward: 10,
        category: "finance",
    },
    {
        title: "Rewards",
        icon: <Gift className="w-8 h-8" />,
        path: "/student/rewards",
        gradient: "from-red-400 via-pink-400 to-rose-400",
        description: "Claim achievements",
        xpReward: 20,
        category: "rewards",
    },
    {
        title: "Marketplace",
        icon: <Diamond className="w-8 h-8" />,
        path: "/student/redeem",
        gradient: "from-blue-400 via-cyan-400 to-teal-400",
        description: "Redeem cool items",
        xpReward: 15,
        category: "shopping",
    },
    {
        title: "Leaderboard",
        icon: <Trophy className="w-8 h-8" />,
        path: "/student/leaderboard",
        gradient: "from-yellow-400 via-orange-400 to-red-400",
        description: "Global rankings",
        xpReward: 35,
        category: "competition",
    },
    {
        title: "Notifications",
        icon: <Bell className="w-8 h-8" />,
        path: "/student/notifications",
        gradient: "from-teal-400 via-cyan-400 to-blue-400",
        description: "Stay connected",
        xpReward: 10,
        category: "social",
    },
    {
        title: "Profile",
        icon: <User className="w-8 h-8" />,
        path: "/student/profile",
        gradient: "from-violet-400 via-purple-400 to-indigo-400",
        description: "Customize avatar",
        xpReward: 20,
        category: "personal",
    },
    {
        title: "Settings",
        icon: <Settings className="w-8 h-8" />,
        path: "/student/settings",
        gradient: "from-gray-400 via-slate-400 to-zinc-400",
        description: "Game preferences",
        xpReward: 5,
        category: "system",
    },
    {
        title: "Breathing",
        icon: <Heart className="w-8 h-8" />,
        path: "/student/breathing",
        gradient: "from-sky-400 via-blue-400 to-indigo-400",
        description: "Mindful moments",
        xpReward: 40,
        category: "wellness",
    },
    {
        title: "Challenges",
        icon: <Target className="w-8 h-8" />,
        path: "/student/challenges",
        gradient: "from-orange-400 via-red-400 to-pink-400",
        description: "Weekly quests",
        xpReward: 100,
        category: "challenges",
    },
];

const achievements = [
    {
        icon: <Flame className="w-6 h-6" />,
        title: "Hot Streak",
        description: "12 days in a row!",
    },
    {
        icon: <Crown className="w-6 h-6" />,
        title: "Top Performer",
        description: "Rank #23 globally",
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Wellness Guardian",
        description: "100 mood checks",
    },
    {
        icon: <Rocket className="w-6 h-6" />,
        title: "Level Up!",
        description: "Reached Level 7",
    },
];

export default function StudentDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { wallet } = useWallet();
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

    // Load student stats with error handling and real data
    const loadStats = React.useCallback(async () => {
        try {
            setLoading(true);
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
            // Optionally handle error UI here
            console.error("❌ Failed to load student stats", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleNavigate = (path) => {
        if (path && typeof path === "string") {
            navigate(path);
        } else {
            navigate("/student");
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
                            onClick={() => handleNavigate(card.path)}
                        >
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full">
                                <div
                                    className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                />

                                <div className="relative z-10 flex flex-col items-center text-center h-full">
                                    <motion.div
                                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {card.icon}
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
                        >
                            Start Now
                        </motion.button>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-3xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart3 className="w-8 h-8" />
                            <h3 className="text-xl font-bold">This Week</h3>
                        </div>
                        <p className="text-green-100 text-sm mb-4">
                            +{stats.weeklyXP} XP earned
                        </p>
                        <div className="text-2xl font-bold">🔥 Great job!</div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-3xl text-white shadow-xl">
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

                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-3xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Clock className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Today's Mood</h3>
                        </div>
                        <p className="text-pink-100 text-sm mb-4">How are you feeling?</p>
                        <div
                            className="text-4xl cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => handleNavigate("/student/mood-tracker")}
                        >
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
