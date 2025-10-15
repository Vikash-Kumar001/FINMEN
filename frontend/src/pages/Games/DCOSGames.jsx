import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Lock,
    Shield,
    Zap,
    Trophy,
    Clock,
    Star,
    Sparkles,
    CheckCircle,
    Play,
    Target,
    Award
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { logActivity } from "../../services/activityService";

export default function DCOSGames() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalGames: 0, completedGames: 0 });

    useEffect(() => {
        fetchDCOSGames();
        
        // Log page view
        logActivity({
            activityType: "page_view",
            description: "Viewed DCOS Games page",
            metadata: {
                page: "/games/dcos",
                timestamp: new Date().toISOString()
            },
            pageUrl: window.location.pathname
        });
    }, []);

    const fetchDCOSGames = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/game/dcos-games');
            setGames(response.data.games || []);
            setStats({
                totalGames: response.data.totalGames || 0,
                completedGames: response.data.completedGames || 0
            });
        } catch (error) {
            console.error('Error fetching DCOS games:', error);
            toast.error('Failed to load games');
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'from-green-400 to-emerald-500';
            case 'medium': return 'from-yellow-400 to-orange-500';
            case 'hard': return 'from-red-400 to-rose-500';
            default: return 'from-gray-400 to-slate-500';
        }
    };

    const getDifficultyIcon = (difficulty) => {
        switch (difficulty) {
            case 'easy': return '⭐';
            case 'medium': return '⭐⭐';
            case 'hard': return '⭐⭐⭐';
            default: return '⭐';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Animated Background Shapes */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-20 blur-3xl"
                    animate={{ 
                        scale: [1, 1.3, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-20 blur-3xl"
                    animate={{ 
                        scale: [1, 1.2, 1],
                        x: [0, -40, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full opacity-15 blur-3xl"
                    animate={{ 
                        scale: [1, 1.4, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    {/* Back Button */}
                    <motion.button
                        onClick={() => navigate('/student/dashboard')}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-8 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-gray-800">Back to Dashboard</span>
                    </motion.button>

                    {/* Page Title */}
                    <div className="text-center">
                        <motion.div
                            className="inline-block"
                            animate={{ 
                                y: [0, -10, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <span className="text-8xl mb-4 inline-block">🔒</span>
                        </motion.div>
                        <h1 className="text-5xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Digital Citizenship & Online Safety
                        </h1>
                        <p className="text-xl text-gray-600 font-medium mb-6">
                            Master the skills to stay safe and responsible online! 🛡️
                        </p>

                        {/* Stats Bar */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex flex-wrap gap-4 justify-center"
                        >
                            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                                <span className="text-sm text-gray-600 mr-2">Total Games:</span>
                                <span className="font-black text-indigo-600 text-lg">{stats.totalGames}</span>
                            </div>
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3 rounded-full shadow-lg text-white">
                                <span className="text-sm mr-2">Completed:</span>
                                <span className="font-black text-lg">{stats.completedGames}/{stats.totalGames}</span>
                            </div>
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-full shadow-lg text-white">
                                <span className="text-sm mr-2">Progress:</span>
                                <span className="font-black text-lg">
                                    {stats.totalGames > 0 ? Math.round((stats.completedGames / stats.totalGames) * 100) : 0}%
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Games Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white/50 rounded-3xl h-80 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {games.map((game, index) => {
                            const isCompleted = game.progress?.completed;

                            return (
                                <motion.div
                                    key={game.id}
                                    initial={{ opacity: 0, y: 50, rotateX: -20 }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    transition={{ 
                                        delay: index * 0.1,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{ 
                                        y: -15,
                                        scale: 1.03,
                                        rotateY: 5,
                                        transition: { duration: 0.3 }
                                    }}
                                    className="relative group cursor-pointer"
                                    style={{ perspective: '1000px' }}
                                    onClick={() => {
                                        toast.success(`Starting ${game.title}...`, {
                                            icon: game.icon,
                                            duration: 2000
                                        });
                                        
                                        logActivity({
                                            activityType: "navigation",
                                            description: `Started DCOS game: ${game.title}`,
                                            metadata: {
                                                gameId: game.id,
                                                gameTitle: game.title,
                                                timestamp: new Date().toISOString()
                                            },
                                            pageUrl: window.location.pathname
                                        });
                                        
                                        // Navigate to game (you can create individual game pages)
                                        // navigate(`/games/dcos/${game.id}`);
                                    }}
                                >
                                    {/* 3D Card */}
                                    <div 
                                        className={`relative bg-gradient-to-br ${game.color.replace('from-', 'from-').replace('to-', 'to-')}/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:shadow-3xl border-2 border-white/50`}
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            minHeight: '400px'
                                        }}
                                    >
                                        {/* Completed Badge */}
                                        {isCompleted && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="absolute top-4 right-4 bg-gradient-to-br from-green-400 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-20"
                                            >
                                                <CheckCircle className="w-8 h-8 text-white" />
                                            </motion.div>
                                        )}

                                        {/* Animated Glow Effect */}
                                        <motion.div
                                            className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                                        />

                                        {/* Top Section - Icon */}
                                        <div className={`relative bg-gradient-to-br ${game.color} p-8`}>
                                            <motion.div
                                                className="text-center"
                                                whileHover={{ scale: 1.1, rotate: 10 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <span className="text-8xl drop-shadow-2xl">{game.icon}</span>
                                            </motion.div>
                                            
                                            {/* Difficulty Badge */}
                                            <div className="absolute top-4 left-4">
                                                <div className={`bg-gradient-to-r ${getDifficultyColor(game.difficulty)} px-4 py-2 rounded-full shadow-lg`}>
                                                    <span className="text-white font-bold text-xs">
                                                        {getDifficultyIcon(game.difficulty)} {game.difficulty.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 bg-white/80 backdrop-blur-sm">
                                            <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                                                {game.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 leading-relaxed">
                                                {game.description}
                                            </p>

                                            {/* Skills Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {game.skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs font-semibold"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Game Info */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl">
                                                    <Clock className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-semibold text-gray-700">{game.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl">
                                                    <Zap className="w-4 h-4 text-yellow-600" />
                                                    <span className="text-sm font-semibold text-gray-700">+{game.xpReward} XP</span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            {game.progress && (
                                                <div className="mb-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-semibold text-gray-600">Progress</span>
                                                        <span className="text-xs font-bold text-indigo-600">
                                                            {game.progress.levelsCompleted}/{game.progress.totalLevels || 1}
                                                        </span>
                                                    </div>
                                                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full bg-gradient-to-r ${game.color}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ 
                                                                width: `${((game.progress.levelsCompleted / (game.progress.totalLevels || 1)) * 100)}%` 
                                                            }}
                                                            transition={{ duration: 1, delay: index * 0.1 }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Play Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                                                    isCompleted
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                        : `bg-gradient-to-r ${game.color}`
                                                }`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    {isCompleted ? (
                                                        <>
                                                            <Trophy className="w-5 h-5" />
                                                            <span>Play Again</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="w-5 h-5" />
                                                            <span>Start Game</span>
                                                        </>
                                                    )}
                                                </div>
                                            </motion.button>
                                        </div>

                                        {/* Hover Glow Effect */}
                                        <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                                            style={{
                                                boxShadow: `0 0 60px 10px ${game.color.includes('blue') ? 'rgba(59, 130, 246, 0.5)' : 
                                                            game.color.includes('red') ? 'rgba(239, 68, 68, 0.5)' :
                                                            game.color.includes('purple') ? 'rgba(168, 85, 247, 0.5)' :
                                                            game.color.includes('green') ? 'rgba(34, 197, 94, 0.5)' :
                                                            'rgba(99, 102, 241, 0.5)'}`
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Achievement Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-indigo-200"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-gray-800 mb-4 flex items-center justify-center gap-3">
                            <Award className="w-8 h-8 text-indigo-600" />
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Your DCOS Mastery
                            </span>
                            <Sparkles className="w-8 h-8 text-yellow-500" />
                        </h2>
                        
                        {/* Progress Circle */}
                        <div className="flex justify-center items-center gap-12 flex-wrap">
                            {/* Circular Progress */}
                            <div className="relative w-48 h-48">
                                <svg className="w-48 h-48 transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth="12"
                                    />
                                    <motion.circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        fill="none"
                                        stroke="url(#gradient-dcos)"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 88}
                                        initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                        animate={{ 
                                            strokeDashoffset: 2 * Math.PI * 88 * (1 - (stats.completedGames / stats.totalGames || 0))
                                        }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="gradient-dcos" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="50%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#ec4899" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {stats.totalGames > 0 ? Math.round((stats.completedGames / stats.totalGames) * 100) : 0}%
                                    </span>
                                    <span className="text-sm font-semibold text-gray-600 mt-2">Complete</span>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl text-center shadow-lg"
                                >
                                    <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-3xl font-black text-blue-700">{stats.completedGames}</div>
                                    <div className="text-xs font-semibold text-blue-600">Completed</div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl text-center shadow-lg"
                                >
                                    <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <div className="text-3xl font-black text-purple-700">
                                        {stats.totalGames - stats.completedGames}
                                    </div>
                                    <div className="text-xs font-semibold text-purple-600">Remaining</div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Motivational Message */}
                        {stats.completedGames === stats.totalGames && stats.totalGames > 0 ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1, type: "spring" }}
                                className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full inline-block shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">🏆</span>
                                    <span className="font-black text-lg">DCOS Master! You've completed all games!</span>
                                    <span className="text-3xl">🎉</span>
                                </div>
                            </motion.div>
                        ) : (
                            <p className="mt-6 text-gray-600 font-medium text-lg">
                                Keep going! Complete all {stats.totalGames} games to become a DCOS Master! 🚀
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Safety Tips Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 shadow-xl border-2 border-blue-200">
                        <Shield className="w-12 h-12 text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Strong Passwords</h3>
                        <p className="text-sm text-gray-600">Use unique passwords with letters, numbers, and symbols</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 shadow-xl border-2 border-purple-200">
                        <Lock className="w-12 h-12 text-purple-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Privacy Matters</h3>
                        <p className="text-sm text-gray-600">Think before sharing personal information online</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-xl border-2 border-green-200">
                        <Star className="w-12 h-12 text-green-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Be Kind Online</h3>
                        <p className="text-sm text-gray-600">Treat others with respect in digital spaces</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

