import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
    User,
    ArrowUp,
    ArrowDown,
    Minus,
    Play,
    GamepadIcon,
    CheckCircle,
    Calendar
} from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import api from "../../utils/api";

const Leaderboard = () => {
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('weekly');
    const [challenges, setChallenges] = useState([]);
    const [games, setGames] = useState([]);
    const [showPlayOptions, setShowPlayOptions] = useState(null);
    const { socket } = useSocket();

    // Fetch challenges and games data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch active challenges
                const challengesResponse = await api.get('/api/challenges/active');
                setChallenges(challengesResponse.data);
                
                // Fetch games
                const gamesResponse = await api.get('/api/game/games');
                setGames(gamesResponse.data);
            } catch (error) {
                console.error('Error fetching play options:', error);
            }
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        if (!socket) return;
        setLoading(true);
        try {
            socket.emit('student:leaderboard:subscribe', { period: selectedPeriod });
        } catch (err) {
            console.error("❌ Error subscribing to leaderboard:", err.message);
            setLoading(false);
            return;
        }

        const handleData = (payload) => {
            // Accept both legacy array and new { period, leaderboard }
            const list = Array.isArray(payload) ? payload : Array.isArray(payload?.leaderboard) ? payload.leaderboard : [];
            setLeaders(list);
            setLoading(false);
        };

        socket.on('student:leaderboard:data', handleData);
        return () => {
            try { socket.off('student:leaderboard:data', handleData); } catch {}
        };
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
            return { icon: <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />, text: `+${change}`, color: "text-green-500" };
        } else if (change < 0) {
            return { icon: <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />, text: `${change}`, color: "text-red-500" };
        }
        return { icon: <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />, text: "0", color: "text-gray-400" };
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
    
    // Navigation functions
    const navigateToChallenge = () => {
        navigate('/student/challenges');
    };
    
    const navigateToGame = (gameId) => {
        navigate(`/student/games/${gameId}`);
    };
    
    // navigateToDailyChallenge removed - daily challenges functionality removed
    
    const togglePlayOptions = (userId) => {
        setShowPlayOptions(showPlayOptions === userId ? null : userId);
    };

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
    const hasTopThree = Array.isArray(leaders) && leaders.filter(l => l && l.name && l.xp !== undefined).length >= 3;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

                {/* Floating trophies */}
                <motion.div
                    className="absolute top-1/4 left-1/3 text-yellow-400 opacity-60 hidden md:block"
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
                    className="absolute top-2/3 right-1/4 text-purple-400 opacity-50 hidden md:block"
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
                    className="absolute bottom-1/3 left-2/3 text-green-400 opacity-40 hidden md:block"
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
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold transition-all ${selectedPeriod === period
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
                        className="mb-8 sm:mb-12"
                    >
                        <div className="flex items-end justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                            {/* Second Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-xl">
                                    <span className="text-white font-black text-xl sm:text-2xl">2</span>
                                </div>
                                <div className="bg-gradient-to-r from-gray-400 to-slate-400 h-16 w-16 sm:h-24 sm:w-24 rounded-t-3xl flex items-center justify-center mx-auto shadow-xl">
                                    <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800">{leaders[1]?.name || '-'}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                        {leaders[1]?.xp ?? 0} XP
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
                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-2xl relative">
                                    <span className="text-white font-black text-2xl sm:text-3xl">1</span>
                                    <motion.div
                                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                                    </motion.div>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-20 w-20 sm:h-32 sm:w-28 rounded-t-3xl flex items-center justify-center mx-auto shadow-2xl">
                                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">{leaders[0]?.name || '-'}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                        {leaders[0]?.xp ?? 0} XP
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
                                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-xl">
                                    <span className="text-white font-black text-xl sm:text-2xl">3</span>
                                </div>
                                <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-16 w-16 sm:h-20 sm:w-24 rounded-t-3xl flex items-center justify-center mx-auto shadow-xl">
                                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800">{leaders[2]?.name || '-'}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                        {leaders[2]?.xp ?? 0} XP
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
                                className={`bg-white/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${isTopThree ? 'ring-2 ring-yellow-200' : ''}`}
                            >
                                {isTopThree && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />
                                )}

                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
                                    {/* Rank Badge */}
                                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${getRankBadge(index + 1)} flex items-center justify-center shadow-lg relative flex-shrink-0`}>
                                        <span className="text-white font-black text-base sm:text-xl">#{index + 1}</span>
                                        {isTopThree && (
                                            <div className="absolute -top-1 -right-1">
                                                {getRankIcon(index + 1)}
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                                                {user.name}
                                            </h3>
                                            {isTopThree && (
                                                <div className="flex items-center gap-1">
                                                    <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                                                    <span className="text-xs font-semibold text-orange-600 hidden sm:inline">HOT</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 truncate">
                                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {user.email}
                                        </p>
                                    </div>

                                    {/* Position Change and XP */}
                                    <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="flex items-center gap-1">
                                            {position.icon}
                                            <span className={`text-xs sm:text-sm font-semibold ${position.color}`}>
                                                {position.text}
                                            </span>
                                        </div>

                                        {/* XP */}
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-indigo-600 font-bold">
                                                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="text-base sm:text-lg">{user.xp} XP</span>
                                            </div>
                                            <div className="text-xs text-gray-500">Experience</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Achievement badges and Play button */}
                                <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
                                    <div className="flex flex-wrap gap-2">
                                        {isTopThree && (
                                            <>
                                                <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Star className="w-3 h-3" />
                                                    Elite Player
                                                </div>
                                                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Zap className="w-3 h-3" />
                                                    High Scorer
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    {/* Play Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => togglePlayOptions(index)}
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                                    >
                                        <Play className="w-3 h-3" />
                                        Play Now
                                    </motion.button>
                                    
                                    {/* Play Options Dropdown */}
                                    {showPlayOptions === index && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-20"
                                            style={{ top: '100%' }}
                                        >
                                            <div className="flex flex-col gap-1 min-w-[150px]">
                                                {challenges.length > 0 && (
                                                    <button 
                                                        onClick={() => navigateToChallenge(challenges[0]._id)}
                                                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left"
                                                    >
                                                        <Target className="w-4 h-4 text-indigo-500" />
                                                        Weekly Challenge
                                                    </button>
                                                )}
                                                
                                                {/* Daily Challenge button removed - functionality removed */}
                                                
                                                {games.length > 0 && (
                                                    <button 
                                                        onClick={() => navigateToGame(games[0]._id)}
                                                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left"
                                                    >
                                                        <GamepadIcon className="w-4 h-4 text-purple-500" />
                                                        Play Game
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Empty State */}
                {leaders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 sm:py-12"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">No Champions Yet</h3>
                        <p className="text-sm sm:text-base text-gray-500">Be the first to claim your spot on the leaderboard!</p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            {challenges.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigateToChallenge(challenges[0]._id)}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Target className="w-4 h-4" />
                                    Weekly Challenge
                                </motion.button>
                            )}
                            
                            {/* Daily Challenge button removed - functionality removed */}
                            
                            {games.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigateToGame(games[0]._id)}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <GamepadIcon className="w-4 h-4" />
                                    Play Game
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Motivational Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-8 sm:mt-12"
                >
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl font-semibold text-sm sm:text-lg">
                        <Target className="w-4 h-4 sm:w-6 sm:h-6" />
                        <span className="hidden xs:inline">Climb the ranks and become a legend! 🚀</span>
                        <span className="xs:hidden">Become a legend! 🚀</span>
                        <Rocket className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Leaderboard;