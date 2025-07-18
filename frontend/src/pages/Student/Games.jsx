import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    Brain, 
    Heart, 
    Smile, 
    HandHeart, 
    Zap, 
    Trophy, 
    Target, 
    Clock, 
    Star, 
    Crown, 
    Sparkles,
    Play,
    Award,
    ChevronRight,
    Timer,
    Coins,
    Medal,
    Gamepad2,
    Focus,
    Lightbulb,
    Wind
} from "lucide-react";
import api from "../../utils/api";

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

export default function Games() {
    const navigate = useNavigate();
    const [gamesList, setGamesList] = useState([]);
    const [categories, setCategories] = useState(["all"]);
    const [difficultyColors, setDifficultyColors] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [hoveredGame, setHoveredGame] = useState(null);
    
    useEffect(() => {
        // Fetch games data from API
        const fetchGames = async () => {
            try {
                const response = await api.get('/api/games');
                setGamesList(response.data);
            } catch (error) {
                console.error('Error fetching games:', error);
                // Set empty array if fetch fails
                setGamesList([]);
            }
        };
        
        fetchGames();
    }, []);
    
    useEffect(() => {
        // Fetch categories and difficulty colors from API
        const fetchCategoriesAndDifficulties = async () => {
            try {
                const categoriesResponse = await api.get('/api/games/categories');
                setCategories(["all", ...categoriesResponse.data]);
                
                const difficultiesResponse = await api.get('/api/games/difficulties');
                setDifficultyColors(difficultiesResponse.data);
            } catch (error) {
                console.error('Error fetching categories and difficulties:', error);
                // Set default values if fetch fails
                setCategories(["all", "cognitive", "mindfulness", "emotional"]);
                setDifficultyColors({
                    "Easy": "from-green-400 to-emerald-400",
                    "Medium": "from-yellow-400 to-orange-400",
                    "Hard": "from-red-400 to-pink-400"
                });
            }
        };
        
        fetchCategoriesAndDifficulties();
    }, []);

    const filteredGames = selectedCategory === "all" 
        ? gamesList 
        : gamesList.filter(game => game.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
                
                {/* Floating elements */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-6 h-6 bg-yellow-400 rounded-full opacity-60"
                    animate={{ 
                        y: [0, -20, 0], 
                        x: [0, 10, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                />
                <motion.div
                    className="absolute top-2/3 right-1/4 w-4 h-4 bg-pink-400 rotate-45 opacity-50"
                    animate={{ 
                        y: [0, -15, 0], 
                        rotate: [45, 225, 45]
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        className="relative inline-block"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center justify-center gap-2 text-center">
                            <span className="text-black dark:text-white">🎮</span>
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                                Gamified Activities
                            </span>
                        </h1>

                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-pink-400 animate-bounce delay-300">
                            <Gamepad2 className="w-5 h-5" />
                        </div>
                    </motion.div>
                    <motion.p 
                        className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Play mindful games and earn <span className="font-bold text-yellow-500 bg-yellow-100 px-2 py-1 rounded-full">HealCoins</span> to stay motivated! ✨
                    </motion.p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/8 to-pink-500/8" />
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{gamesList.length}</div>
                            <div className="text-sm text-gray-600">Games Available</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Coins className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{gamesList.reduce((sum, game) => sum + game.reward, 0)}</div>
                            <div className="text-sm text-gray-600">Total Coins</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Clock className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">5-12</div>
                            <div className="text-sm text-gray-600">Minutes Each</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Star className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">100%</div>
                            <div className="text-sm text-gray-600">Fun Guaranteed</div>
                        </div>
                    </div>
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
                                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                                    selectedCategory === category
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                        : 'bg-white/80 text-gray-700 hover:bg-white shadow-md'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Games Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                >
                    {filteredGames.map((game, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ 
                                scale: 1.05, 
                                y: -8,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group cursor-pointer relative"
                            onClick={() => navigate(game.route)}
                            onMouseEnter={() => setHoveredGame(i)}
                            onMouseLeave={() => setHoveredGame(null)}
                        >
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full">
                                <div className={`absolute inset-0 bg-gradient-to-r ${game.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                
                                {/* Difficulty Badge */}
                                <div className={`absolute top-4 right-4 bg-gradient-to-r ${difficultyColors[game.difficulty]} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                                    {game.difficulty}
                                </div>

                                <div className="relative z-10">
                                    {/* Game Icon */}
                                    <motion.div
                                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${game.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {game.icon}
                                    </motion.div>

                                    {/* Game Info */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {game.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                            {game.description}
                                        </p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                {game.tag}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Timer className="w-3 h-3" />
                                                {game.estimatedTime}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Benefits (shown on hover) */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ 
                                            opacity: hoveredGame === i ? 1 : 0,
                                            height: hoveredGame === i ? "auto" : 0
                                        }}
                                        className="mb-4 overflow-hidden"
                                    >
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl">
                                            <div className="text-xs font-semibold text-indigo-600 mb-1">Benefits:</div>
                                            <div className="space-y-1">
                                                {game.benefits.map((benefit, idx) => (
                                                    <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                        {benefit}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                <Coins className="w-4 h-4" />
                                                +{game.reward}
                                            </div>
                                        </div>
                                        <motion.div 
                                            className="flex items-center gap-1 text-indigo-600 font-semibold text-sm"
                                            whileHover={{ x: 5 }}
                                        >
                                            <Play className="w-4 h-4" />
                                            Play Now
                                            <ChevronRight className="w-4 h-4" />
                                        </motion.div>
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
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-3xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Lightbulb className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Daily Challenge</h3>
                        </div>
                        <p className="text-purple-100 text-sm mb-4">Complete 3 games today for bonus rewards!</p>
                        <div className="flex items-center gap-2">
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full w-1/3" />
                            </div>
                            <span className="text-sm">1/3</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-3xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Award className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Achievements</h3>
                        </div>
                        <p className="text-green-100 text-sm mb-4">Unlock special badges and rewards</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all"
                        >
                            View All
                        </motion.button>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-3xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Weekly Goal</h3>
                        </div>
                        <p className="text-orange-100 text-sm mb-4">Play 15 games this week</p>
                        <div className="flex items-center gap-2">
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full w-3/5" />
                            </div>
                            <span className="text-sm">9/15</span>
                        </div>
                    </div>
                </motion.div>

                {/* Motivational Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-6 h-6" />
                        </motion.div>
                        <span>Ready to level up your wellbeing? Let's play! 🎮</span>
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                        >
                            <Crown className="w-6 h-6" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}