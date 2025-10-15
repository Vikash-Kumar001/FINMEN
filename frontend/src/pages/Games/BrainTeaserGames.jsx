import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Trophy,
    Clock,
    Sparkles,
    CheckCircle,
    Play,
    Brain,
    Star,
    Target,
    Award,
    Flame
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { logActivity } from "../../services/activityService";

export default function BrainTeaserGames() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalGames: 0, completedGames: 0, totalXPAvailable: 0 });
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchBrainGames();
        
        logActivity({
            activityType: "page_view",
            description: "Viewed Brain Teaser Games page",
            metadata: {
                page: "/games/brain-teaser",
                timestamp: new Date().toISOString()
            },
            pageUrl: window.location.pathname
        });
    }, []);

    const fetchBrainGames = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/game/brain-teaser-games');
            setGames(response.data.games || []);
            setStats({
                totalGames: response.data.totalGames || 0,
                completedGames: response.data.completedGames || 0,
                totalXPAvailable: response.data.totalXPAvailable || 0
            });
        } catch (error) {
            console.error('Error fetching brain games:', error);
            toast.error('Failed to load games');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', 'Memory', 'Logic', 'Language', 'Math', 'Spatial', 'Speed', 'Patterns', 'Focus'];
    
    const filteredGames = selectedCategory === 'all' 
        ? games 
        : games.filter(g => g.category === selectedCategory);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'from-green-400 to-emerald-500';
            case 'medium': return 'from-yellow-400 to-orange-500';
            case 'hard': return 'from-red-400 to-rose-500';
            default: return 'from-gray-400 to-slate-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
            {/* Animated Neuron Network Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-40"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            scale: [1, 2, 1],
                            opacity: [0.2, 0.6, 0.2],
                            x: [0, Math.random() * 50 - 25, 0],
                            y: [0, Math.random() * 50 - 25, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <motion.button
                        onClick={() => navigate('/student/dashboard')}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-8 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-gray-800">Back to Dashboard</span>
                    </motion.button>

                    {/* Title with Brain Animation */}
                    <div className="text-center">
                        <motion.div
                            className="flex items-center justify-center gap-4 mb-6"
                            animate={{ 
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Brain className="w-20 h-20 text-purple-600" />
                            </motion.div>
                            <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                                Brain Teasers
                            </h1>
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-16 h-16 text-yellow-500" />
                            </motion.div>
                        </motion.div>
                        <p className="text-xl text-gray-600 font-medium mb-8">
                            Challenge your mind with engaging puzzles and brain games! 🧠✨
                        </p>

                        {/* Category Filter Chips */}
                        <div className="flex flex-wrap gap-3 justify-center mb-6">
                            {categories.map((cat, index) => (
                                <motion.button
                                    key={cat}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-full font-bold text-sm shadow-lg transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                            : 'bg-white/80 text-gray-700 hover:bg-white'
                                    }`}
                                >
                                    {cat === 'all' ? '🎯 All' : cat}
                                </motion.button>
                            ))}
                        </div>

                        {/* Stats Dashboard */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex flex-wrap gap-4 justify-center"
                        >
                            <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-6 py-3 rounded-2xl shadow-xl text-white">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    <span className="text-sm font-semibold">{stats.completedGames}/{stats.totalGames} Completed</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 px-6 py-3 rounded-2xl shadow-xl text-white">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    <span className="text-sm font-semibold">
                                        {Math.round((stats.completedGames / stats.totalGames || 0) * 100)}% Mastery
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-green-400 to-emerald-400 px-6 py-3 rounded-2xl shadow-xl text-white">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    <span className="text-sm font-semibold">{stats.totalGames} Fun Games</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Games in Hexagonal/Unique Layout */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white/50 rounded-3xl h-72 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {filteredGames.map((game, index) => {
                            const isCompleted = game.progress?.completed;
                            const categoryColors = {
                                Memory: 'border-purple-400',
                                Logic: 'border-blue-400',
                                Language: 'border-green-400',
                                Math: 'border-orange-400',
                                Spatial: 'border-teal-400',
                                Speed: 'border-yellow-400',
                                Patterns: 'border-indigo-400',
                                Focus: 'border-pink-400'
                            };

                            return (
                                <motion.div
                                    key={game.id}
                                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 20,
                                        delay: index * 0.08
                                    }}
                                    whileHover={{ 
                                        scale: 1.08,
                                        y: -10,
                                        rotate: [0, -2, 2, 0],
                                        transition: { duration: 0.3 }
                                    }}
                                    className="relative cursor-pointer group"
                                    onClick={() => {
                                        toast.success(`Starting ${game.title}...`, {
                                            icon: game.icon,
                                            duration: 2000
                                        });
                                        
                                        logActivity({
                                            activityType: "navigation",
                                            description: `Started Brain game: ${game.title}`,
                                            metadata: {
                                                gameId: game.id,
                                                gameTitle: game.title,
                                                category: game.category,
                                                timestamp: new Date().toISOString()
                                            },
                                            pageUrl: window.location.pathname
                                        });
                                        
                                        // Navigate to game play page
                                        navigate(`/games/brain-teaser/${game.id}`);
                                    }}
                                >
                                    {/* Hexagonal-inspired Card */}
                                    <div className={`relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border-4 ${categoryColors[game.category] || 'border-gray-400'} transition-all duration-300 group-hover:shadow-3xl`}>
                                        {/* Completion Crown */}
                                        {isCompleted && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="absolute top-2 right-2 z-20"
                                            >
                                                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                                                    <span className="text-lg">👑</span>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Animated Background Pattern */}
                                        <motion.div
                                            className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10`}
                                            animate={{
                                                backgroundPosition: ['0% 0%', '100% 100%'],
                                            }}
                                            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                                        />

                                        {/* Top Icon Section */}
                                        <div className="relative p-6 flex flex-col items-center">
                                            <motion.div
                                                className="relative mb-4"
                                                whileHover={{ scale: 1.2, rotate: 360 }}
                                                transition={{ type: "spring", stiffness: 200 }}
                                            >
                                                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${game.color} flex items-center justify-center text-5xl shadow-2xl`}>
                                                    {game.icon}
                                                </div>
                                                <motion.div
                                                    className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    style={{
                                                        background: `conic-gradient(from 0deg, transparent, ${game.color.includes('purple') ? '#a855f7' : 
                                                            game.color.includes('blue') ? '#3b82f6' :
                                                            game.color.includes('green') ? '#22c55e' :
                                                            game.color.includes('orange') ? '#f97316' : '#6366f1'}, transparent)`,
                                                        filter: 'blur(10px)'
                                                    }}
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                />
                                            </motion.div>

                                            {/* Difficulty Badge */}
                                            <div className={`px-4 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(game.difficulty)} text-white text-xs font-bold shadow-md mb-3`}>
                                                {game.difficulty.toUpperCase()}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-black text-gray-800 text-center mb-2 group-hover:text-purple-600 transition-colors">
                                                {game.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-gray-600 text-center mb-4 leading-snug px-2">
                                                {game.description}
                                            </p>

                                            {/* Category Tag */}
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${game.color} text-white shadow-md mb-4`}>
                                                {game.category}
                                            </span>

                                            {/* Info Row */}
                                            <div className="flex gap-3 mb-4 w-full justify-center">
                                                <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg">
                                                    <Clock className="w-3 h-3 text-blue-600" />
                                                    <span className="text-xs font-semibold text-blue-700">{game.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-lg">
                                                    <Star className="w-3 h-3 text-purple-600" />
                                                    <span className="text-xs font-semibold text-purple-700">Fun</span>
                                                </div>
                                            </div>

                                            {/* Progress */}
                                            {game.progress && (
                                                <div className="w-full mb-3">
                                                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                                                        <span>Progress</span>
                                                        <span>{game.progress.levelsCompleted}/{game.progress.totalLevels || 1}</span>
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
                                                className={`w-full py-3 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                                                    isCompleted
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                        : `bg-gradient-to-r ${game.color}`
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <>
                                                        <CheckCircle className="w-5 h-5" />
                                                        <span>Replay</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="w-5 h-5" />
                                                        <span>Play Now</span>
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Brain Power Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 relative"
                >
                    {/* Glowing Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-orange-400/20 rounded-3xl blur-3xl" />
                    
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-purple-200">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                🧠 Your Brain Power
                            </h2>
                            <p className="text-gray-600 font-medium">Track your cognitive mastery</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            {/* Circular Progress */}
                            <div className="flex justify-center">
                                <div className="relative w-48 h-48">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="16"
                                        />
                                        <motion.circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="none"
                                            stroke="url(#brain-gradient)"
                                            strokeWidth="16"
                                            strokeLinecap="round"
                                            strokeDasharray={2 * Math.PI * 88}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                            animate={{ 
                                                strokeDashoffset: 2 * Math.PI * 88 * (1 - (stats.completedGames / stats.totalGames || 0))
                                            }}
                                            transition={{ duration: 2.5, ease: "easeOut" }}
                                        />
                                        <defs>
                                            <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#a855f7" />
                                                <stop offset="50%" stopColor="#ec4899" />
                                                <stop offset="100%" stopColor="#f97316" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span 
                                            className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {Math.round((stats.completedGames / stats.totalGames || 0) * 100)}%
                                        </motion.span>
                                        <span className="text-sm font-semibold text-gray-600">Complete</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-3xl text-center shadow-lg"
                                >
                                    <Award className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                                    <div className="text-4xl font-black text-purple-700 mb-1">{stats.completedGames}</div>
                                    <div className="text-sm font-bold text-purple-600">Games Mastered</div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: -2 }}
                                    className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-3xl text-center shadow-lg"
                                >
                                    <Flame className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                                    <div className="text-4xl font-black text-blue-700 mb-1">{stats.totalGames - stats.completedGames}</div>
                                    <div className="text-sm font-bold text-blue-600">To Conquer</div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-3xl text-center shadow-lg"
                                >
                                    <Sparkles className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                                    <div className="text-4xl font-black text-yellow-700 mb-1">{stats.totalGames}</div>
                                    <div className="text-sm font-bold text-yellow-600">Fun Challenges</div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: -2 }}
                                    className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-3xl text-center shadow-lg"
                                >
                                    <Star className="w-10 h-10 text-green-600 mx-auto mb-3" />
                                    <div className="text-4xl font-black text-green-700 mb-1">
                                        {Math.round((stats.completedGames / stats.totalGames || 0) * 100)}%
                                    </div>
                                    <div className="text-sm font-bold text-green-600">Brain Power</div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Achievement Message */}
                        {stats.completedGames === stats.totalGames && stats.totalGames > 0 && (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 1, type: "spring" }}
                                className="mt-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white px-8 py-5 rounded-full inline-block shadow-2xl"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl">🧠</span>
                                    <span className="font-black text-xl">Brain Master Unlocked! 🏆</span>
                                    <span className="text-4xl">✨</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Brain Benefits Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {[
                        { title: 'Boost Memory', icon: '🧩', color: 'from-purple-400 to-pink-400', desc: 'Enhance recall abilities' },
                        { title: 'Sharp Logic', icon: '🎯', color: 'from-blue-400 to-cyan-400', desc: 'Improve reasoning skills' },
                        { title: 'Quick Thinking', icon: '⚡', color: 'from-yellow-400 to-orange-400', desc: 'Speed up decisions' },
                        { title: 'Focus Power', icon: '👁️', color: 'from-green-400 to-emerald-400', desc: 'Increase concentration' }
                    ].map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 + i * 0.1 }}
                            whileHover={{ y: -5, scale: 1.05 }}
                            className={`bg-gradient-to-br ${benefit.color} rounded-3xl p-6 text-white shadow-xl text-center`}
                        >
                            <span className="text-5xl mb-3 inline-block">{benefit.icon}</span>
                            <h4 className="font-black text-lg mb-2">{benefit.title}</h4>
                            <p className="text-sm text-white/90">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Motivational Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-10 py-5 rounded-full shadow-2xl font-bold text-lg">
                        <Sparkles className="w-7 h-7" />
                        <span>Train your brain daily for maximum results! 🚀</span>
                        <Sparkles className="w-7 h-7" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

