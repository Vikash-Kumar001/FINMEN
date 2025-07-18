import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Crown,
    Medal,
    Star,
    Flame,
    Zap,
    TrendingUp,
    Award,
    Sparkles,
    Target,
    Shield,
    Rocket,
    ChevronUp,
    ChevronDown,
    Coins,
    User,
    ArrowUp,
    ArrowDown,
    Minus
} from "lucide-react";
import { useSocket } from "../../context/SocketContext";

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('weekly');
    const socket = useSocket();

    useEffect(() => {
        if (socket && socket.socket) {
            setLoading(true);
            // Subscribe to leaderboard updates
            try {
                socket.socket.emit('student:leaderboard:subscribe', { period: selectedPeriod });
            } catch (err) {
                console.error("❌ Error subscribing to leaderboard:", err.message);
                setLoading(false);
                return;
            }
            
            const handleData = (data) => {
                setLeaders(Array.isArray(data) ? data : []);
                setLoading(false);
            };
            
            try {
                socket.socket.on('student:leaderboard:data', handleData);
            } catch (err) {
                console.error("❌ Error setting up leaderboard data listener:", err.message);
                setLoading(false);
            }
            
            // Cleanup on unmount or period change
            return () => {
                try {
                    if (socket && socket.socket) {
                        socket.socket.off('student:leaderboard:data', handleData);
                    }
                } catch (err) {
                    console.error("❌ Error removing leaderboard data listener:", err.message);
                }
            };
        }
    }, [socket, selectedPeriod]);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
            case 2: return <Medal className="w-6 h-6 text-gray-400" />;
            case 3: return <Award className="w-6 h-6 text-amber-600" />;
            default: return <Trophy className="w-5 h-5 text-gray-500" />;
        }
    };

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1: return "bg-gradient-to-r from-yellow-400 to-orange-400";
            case 2: return "bg-gradient-to-r from-gray-400 to-slate-400";
            case 3: return "bg-gradient-to-r from-amber-400 to-orange-400";
            default: return "bg-gradient-to-r from-blue-400 to-purple-400";
        }
    };

    const getPositionChange = (user) => {
        // This will be calculated based on previous leaderboard data
        // which will be included in the API response
        const change = user.positionChange || 0;
        
        if (change > 0) {
            return { icon: <ArrowUp className="w-4 h-4 text-green-500" />, text: `+${change}`, color: "text-green-500" };
        } else if (change < 0) {
            return { icon: <ArrowDown className="w-4 h-4 text-red-500" />, text: `${change}`, color: "text-red-500" };
        }
        return { icon: <Minus className="w-4 h-4 text-gray-400" />, text: "0", color: "text-gray-400" };
    };

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

    const periods = ['daily', 'weekly', 'monthly', 'all-time'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse mx-auto mb-4"></div>
                        <div className="h-8 bg-gray-300 rounded animate-pulse w-64 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-48 mx-auto"></div>
                    </div>
                    <div className="space-y-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-300 rounded w-48"></div>
                                    </div>
                                    <div className="w-20 h-8 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Only show top 3 podium if there are at least 3 valid leaders
    const hasTopThree = Array.isArray(leaders) && leaders.filter(l => l && l.name && l.balance !== undefined).length >= 3;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

                {/* Floating trophies */}
                <motion.div
                    className="absolute top-1/4 left-1/3 text-yellow-400 opacity-60"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Trophy className="w-6 h-6" />
                </motion.div>
                <motion.div
                    className="absolute top-2/3 right-1/4 text-purple-400 opacity-50"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                >
                    <Star className="w-5 h-5" />
                </motion.div>
                <motion.div
                    className="absolute bottom-1/3 left-2/3 text-green-400 opacity-40"
                    animate={{
                        y: [0, -25, 0],
                        scale: [1, 0.8, 1]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                >
                    <Medal className="w-6 h-6" />
                </motion.div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        className="relative inline-block"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-purple-400 animate-bounce delay-300">
                            <Star className="w-5 h-5" />
                        </div>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center justify-center gap-2 text-center">
                        <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                            Champions Arena
                        </span>
                        <span className="text-black dark:text-white">🏆</span>
                    </h1>

                    <p className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide mb-6">
                        Battle for the top spot and claim your glory! ⚡
                    </p>

                    {/* Period Selector */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {periods.map((period) => (
                            <motion.button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full font-semibold transition-all ${selectedPeriod === period
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                                        : 'bg-white/80 text-gray-700 hover:bg-white shadow-md'
                                    }`}
                            >
                                {period.charAt(0).toUpperCase() + period.slice(1).replace('-', ' ')}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Top 3 Podium */}
                {hasTopThree && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-12"
                    >
                        <div className="flex items-end justify-center gap-4 mb-8">
                            {/* Second Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl">
                                    <span className="text-white font-black text-2xl">2</span>
                                </div>
                                <div className="bg-gradient-to-r from-gray-400 to-slate-400 h-24 w-24 rounded-t-3xl flex items-center justify-center mx-auto shadow-xl">
                                    <Medal className="w-8 h-8 text-white" />
                                </div>
                                <div className="mt-3">
                                    <h3 className="font-bold text-gray-800">{leaders[1]?.name || '-'}</h3>
                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Coins className="w-4 h-4" />
                                        ₹{leaders[1]?.balance ?? 0}
                                    </p>
                                </div>
                            </motion.div>

                            {/* First Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-center"
                            >
                                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xl relative">
                                    <span className="text-white font-black text-3xl">1</span>
                                    <motion.div
                                        className="absolute -top-2 -right-2"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Crown className="w-8 h-8 text-yellow-300" />
                                    </motion.div>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-32 w-28 rounded-t-3xl flex items-center justify-center mx-auto shadow-2xl">
                                    <Trophy className="w-10 h-10 text-white" />
                                </div>
                                <div className="mt-3">
                                    <h3 className="font-bold text-gray-800 text-lg">{leaders[0]?.name || '-'}</h3>
                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Coins className="w-4 h-4" />
                                        ₹{leaders[0]?.balance ?? 0}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Third Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl">
                                    <span className="text-white font-black text-2xl">3</span>
                                </div>
                                <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-20 w-24 rounded-t-3xl flex items-center justify-center mx-auto shadow-xl">
                                    <Award className="w-8 h-8 text-white" />
                                </div>
                                <div className="mt-3">
                                    <h3 className="font-bold text-gray-800">{leaders[2]?.name || '-'}</h3>
                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Coins className="w-4 h-4" />
                                        ₹{leaders[2]?.balance ?? 0}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Leaderboard List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {leaders.map((user, index) => {
                        const position = getPositionChange(user);
                        const isTopThree = index < 3;

                        return (
                            <motion.div
                                key={user.id || index}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.02,
                                    y: -2,
                                    transition: { duration: 0.2 }
                                }}
                                className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${isTopThree ? 'ring-2 ring-yellow-200' : ''
                                    }`}
                            >
                                {isTopThree && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />
                                )}

                                <div className="flex items-center gap-4">
                                    {/* Rank Badge */}
                                    <div className={`w-14 h-14 rounded-2xl ${getRankBadge(index + 1)} flex items-center justify-center shadow-lg relative`}>
                                        <span className="text-white font-black text-xl">#{index + 1}</span>
                                        {isTopThree && (
                                            <div className="absolute -top-1 -right-1">
                                                {getRankIcon(index + 1)}
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {user.name}
                                            </h3>
                                            {isTopThree && (
                                                <div className="flex items-center gap-1">
                                                    <Flame className="w-4 h-4 text-orange-500" />
                                                    <span className="text-xs font-semibold text-orange-600">HOT</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {user.email}
                                        </p>
                                    </div>

                                    {/* Position Change */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            {position.icon}
                                            <span className={`text-sm font-semibold ${position.color}`}>
                                                {position.text}
                                            </span>
                                        </div>

                                        {/* Balance */}
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-green-600 font-bold">
                                                <Coins className="w-5 h-5" />
                                                <span className="text-lg">₹{user.balance}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">HealCoins</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Achievement badges for top performers */}
                                {isTopThree && (
                                    <div className="mt-3 flex gap-2">
                                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            Elite Player
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            High Scorer
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Empty State */}
                {leaders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No Champions Yet</h3>
                        <p className="text-gray-500">Be the first to claim your spot on the leaderboard!</p>
                        <div className="mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Start Playing
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Motivational Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-12"
                >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <Target className="w-6 h-6" />
                        <span>Climb the ranks and become a legend! 🚀</span>
                        <Rocket className="w-6 h-6" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Leaderboard;