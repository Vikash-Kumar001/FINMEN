import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Brain, 
    Heart, 
    Sparkles,
    Play,
    Award,
    ChevronRight,
    Timer,
    Coins,
    Gamepad2,
    Focus,
    Lightbulb,
    Wind,
    Wallet,
    TrendingUp,
    PiggyBank,
    ShoppingCart,
    BarChart4,
    DollarSign,
    BookOpen,
    GraduationCap,
    Users,
    Compass,
    HandHeart,
    Target,
    ArrowLeft
} from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const selectedPillar = searchParams.get('pillar');
    const [userStats, setUserStats] = useState({
        gamesPlayed: 0,
        coinsEarned: 0,
        achievements: [],
        currentStreak: 0,
        walletBalance: 0
    });
    
    // Define the four pillars with their games
    const gamePillars = [
        {
            id: 'ai-education',
            title: 'AI Education Games',
            icon: <GraduationCap className="w-8 h-8" />,
            color: 'from-blue-500 to-indigo-600',
            description: 'Learn AI concepts through interactive games',
            totalGames: 3,
            games: [
                {
                    title: 'AI Logic Quest',
                    description: 'Learn programming logic and AI fundamentals',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '15 min',
                    coins: 50,
                    route: '/student/games/ai-logic-quest'
                },
                {
                    title: 'Neural Network Builder',
                    description: 'Build and train your own neural networks',
                    icon: <Lightbulb className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '20 min',
                    coins: 75,
                    route: '/student/games/neural-network'
                },
                {
                    title: 'Data Pattern Detective',
                    description: 'Find patterns in data like an AI',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '10 min',
                    coins: 30,
                    route: '/student/games/data-patterns'
                }
            ]
        },
        {
            id: 'brain-health',
            title: 'Brain Health Games',
            icon: <Brain className="w-8 h-8" />,
            color: 'from-purple-500 to-pink-600',
            description: 'Improve mental wellness and cognitive abilities',
            totalGames: 3,
            games: [
                {
                    title: 'MindMaze',
                    description: 'Navigate through cognitive challenges',
                    icon: <Focus className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '12 min',
                    coins: 40,
                    route: '/student/games/mind-maze'
                },
                {
                    title: 'BreatheBalance',
                    description: 'Master breathing techniques for calmness',
                    icon: <Wind className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '8 min',
                    coins: 25,
                    route: '/student/games/breathe-balance'
                },
                {
                    title: 'Memory Palace',
                    description: 'Strengthen your memory with fun exercises',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '18 min',
                    coins: 60,
                    route: '/student/games/memory-palace'
                }
            ]
        },
        {
            id: 'moral-values',
            title: 'Moral Values Games',
            icon: <Heart className="w-8 h-8" />,
            color: 'from-green-500 to-emerald-600',
            description: 'Build character and learn ethical decision making',
            totalGames: 3,
            games: [
                {
                    title: 'Ethics Explorer',
                    description: 'Navigate moral dilemmas and build character',
                    icon: <Compass className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '15 min',
                    coins: 45,
                    route: '/student/games/ethics-explorer'
                },
                {
                    title: 'Kindness Quest',
                    description: 'Spread kindness and learn empathy',
                    icon: <HandHeart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '10 min',
                    coins: 35,
                    route: '/student/games/kindness-quest'
                },
                {
                    title: 'Community Builder',
                    description: 'Learn teamwork and social responsibility',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '20 min',
                    coins: 55,
                    route: '/student/games/community-builder'
                }
            ]
        },
        {
            id: 'finance',
            title: 'Finance Games',
            icon: <DollarSign className="w-8 h-8" />,
            color: 'from-yellow-500 to-orange-600',
            description: 'Master financial literacy and money management',
            totalGames: 4,
            games: [
                {
                    title: 'PiggyBank Builder',
                    description: 'Learn saving strategies and goal setting',
                    icon: <PiggyBank className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '12 min',
                    coins: 40,
                    route: '/student/games/piggy-bank-builder'
                },
                {
                    title: 'ShopSmart',
                    description: 'Make smart purchasing decisions',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '15 min',
                    coins: 50,
                    route: '/student/games/shop-smart'
                },
                {
                    title: 'InvestQuest',
                    description: 'Learn investment basics and portfolio building',
                    icon: <TrendingUp className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '25 min',
                    coins: 70,
                    route: '/student/games/invest-quest'
                },
                {
                    title: 'BudgetHero',
                    description: 'Master budgeting and expense tracking',
                    icon: <BarChart4 className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '18 min',
                    coins: 55,
                    route: '/student/games/budget-hero'
                }
            ]
        }
    ];
    
    // Fetch user stats
    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await api.get('/api/game/user-stats');
                setUserStats({
                    gamesPlayed: response.data.totalGamesPlayed || 0,
                    coinsEarned: response.data.totalCoinsEarned || 0,
                    achievements: response.data.achievements || [],
                    currentStreak: response.data.highestStreak || 0,
                    walletBalance: response.data.currentBalance || 0
                });
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };
        
        fetchUserStats();
    }, []);
    
    // Debug: Track selectedPillar state changes
    useEffect(() => {
        console.log('🔍 selectedPillar state changed to:', selectedPillar);
    }, [selectedPillar]);
    
    const getDifficultyColor = (difficulty) => {
        switch(difficulty.toLowerCase()) {
            case 'easy': return 'from-green-400 to-emerald-400';
            case 'medium': return 'from-yellow-400 to-orange-400';
            case 'hard': return 'from-red-400 to-pink-400';
            default: return 'from-gray-400 to-gray-500';
        }
    };
    
    const handleGameClick = (game) => {
        console.log('🎮 Starting game:', game.title);
        toast.success(`Starting ${game.title}...`);
        navigate(game.route);
    };
    
    const handlePillarClick = (pillar) => {
        console.log('🏛️ Pillar clicked:', pillar.title, 'Current selectedPillar:', selectedPillar);
        const newSelection = selectedPillar === pillar.id ? null : pillar.id;
        console.log('🔄 Setting selectedPillar to:', newSelection);
        
        if (newSelection) {
            setSearchParams({ pillar: newSelection });
        } else {
            setSearchParams({});
        }
    };
    
    const handleBackToPillars = () => {
        console.log('⬅️ Back to pillars clicked. Current selectedPillar:', selectedPillar);
        setSearchParams({});
        console.log('✅ selectedPillar reset to null');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
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
                                Games
                            </span>
                        </h1>
                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </motion.div>
                    <motion.p 
                        className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Play educational games and earn rewards
                    </motion.p>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg font-semibold">
                        <Coins className="w-5 h-5" />
                        <span>+40 XP</span>
                    </div>
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
                                <Gamepad2 className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">13</div>
                            <div className="text-sm text-gray-600">Total Games</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{userStats.walletBalance}</div>
                            <div className="text-sm text-gray-600">HealCoins Balance</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Play className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{userStats.gamesPlayed}</div>
                            <div className="text-sm text-gray-600">Games Played</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Award className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{userStats.achievements.length}</div>
                            <div className="text-sm text-gray-600">Achievements</div>
                        </div>
                    </div>
                </motion.div>

                {/* Game Pillars */}
                <AnimatePresence mode="wait">
                    {!selectedPillar ? (
                        <motion.div
                            key="pillars"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                        >
                            {gamePillars.map((pillar) => (
                                <motion.div
                                    key={pillar.id}
                                    variants={itemVariants}
                                    whileHover={{ 
                                        scale: 1.05, 
                                        y: -8,
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group cursor-pointer relative"
                                    onClick={() => handlePillarClick(pillar)}
                                >
                                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full">
                                        <div className={`absolute inset-0 bg-gradient-to-r ${pillar.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                        
                                        <div className="relative z-10 text-center">
                                            <motion.div
                                                className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${pillar.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                {pillar.icon}
                                            </motion.div>

                                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                                {pillar.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                {pillar.description}
                                            </p>
                                            
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {pillar.totalGames} Games
                                                </div>
                                                <div className="flex items-center gap-1 text-indigo-600 font-semibold text-sm">
                                                    <Play className="w-4 h-4" />
                                                    <span>Play</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="games"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Back Button */}
                            <motion.button
                                onClick={handleBackToPillars}
                                className="mb-6 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded-full shadow-md transition-all"
                                whileHover={{ x: -5 }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Pillars
                            </motion.button>

                            {/* Selected Pillar Games */}
                            {gamePillars.filter(p => p.id === selectedPillar).map(pillar => (
                                <div key={pillar.id}>
                                    <div className="text-center mb-8">
                                        <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${pillar.color} text-white px-6 py-3 rounded-full shadow-lg mb-4`}>
                                            {pillar.icon}
                                            <h2 className="text-2xl font-bold">{pillar.title}</h2>
                                        </div>
                                        <p className="text-gray-600 text-lg">{pillar.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {pillar.games.map((game, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                                                onClick={() => handleGameClick(game)}
                                            >
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${pillar.color} flex items-center justify-center text-white shadow-lg`}>
                                                        {game.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                                            {game.title}
                                                        </h3>
                                                        <div className={`inline-block bg-gradient-to-r ${getDifficultyColor(game.difficulty)} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                                                            {game.difficulty}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                    {game.description}
                                                </p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Timer className="w-4 h-4" />
                                                            {game.duration}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                                                            <Coins className="w-4 h-4" />
                                                            +{game.coins}
                                                        </div>
                                                    </div>
                                                    <motion.div 
                                                        className="flex items-center gap-1 text-indigo-600 font-semibold text-sm"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <Play className="w-4 h-4" />
                                                        Play
                                                        <ChevronRight className="w-4 h-4" />
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Motivational Footer */}
                {!selectedPillar && (
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
                            <span>Choose a pillar and start your learning journey! 🚀</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}