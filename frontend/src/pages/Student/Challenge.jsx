import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    Trophy, 
    Award, 
    CheckCircle, 
    Clock, 
    Zap, 
    Target, 
    ChevronRight, 
    Calendar,
    TrendingUp,
    Flame,
    Star,
    Coins,
    Timer,
    Sparkles,
    Play
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
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

const Challenge = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const socket = useSocket();
    const [loading, setLoading] = useState(true);
    const [challenges, setChallenges] = useState([]);
    const [progress, setProgress] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [hoveredChallenge, setHoveredChallenge] = useState(null);
    
    // Map icon names to components
    const iconMap = {
        "Target": <Target className="w-8 h-8" />,
        "Coins": <Coins className="w-8 h-8" />,
        "TrendingUp": <TrendingUp className="w-8 h-8" />,
        "Zap": <Zap className="w-8 h-8" />,
        "Calendar": <Calendar className="w-8 h-8" />,
        "Flame": <Flame className="w-8 h-8" />,
        "Star": <Star className="w-8 h-8" />,
        "Trophy": <Trophy className="w-8 h-8" />,
        "Award": <Award className="w-8 h-8" />,
        "CheckCircle": <CheckCircle className="w-8 h-8" />,
        "Clock": <Clock className="w-8 h-8" />,
        "Timer": <Timer className="w-8 h-8" />,
        "Sparkles": <Sparkles className="w-8 h-8" />,
        "Play": <Play className="w-8 h-8" />
    };
    
    // State for user's challenge progress
    const [userProgress, setUserProgress] = useState({});
    const [completedToday, setCompletedToday] = useState(0);
    const [dayStreak, setDayStreak] = useState(0);
    
    // Generate categories dynamically from challenges
    const [categories, setCategories] = useState(["all"]);
    
    // Update categories when challenges change
    useEffect(() => {
        if (challenges.length > 0) {
            const uniqueCategories = [...new Set(challenges.map(challenge => challenge.category))];
            setCategories(["all", ...uniqueCategories]);
        }
    }, [challenges]);
    
    // Difficulty colors
    const difficultyColors = {
        "Easy": "from-green-400 to-emerald-400",
        "Medium": "from-yellow-400 to-orange-400",
        "Hard": "from-red-400 to-pink-400"
    };
    
    useEffect(() => {
        // Fetch challenges from API
        const fetchChallenges = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/challenges/active');
                const data = response.data;
                
                // Process the challenges to add the icon component
                const processedChallenges = data.map(challenge => ({
                    ...challenge,
                    icon: iconMap[challenge.iconName] || <Target className="w-8 h-8" />,
                    gradient: challenge.gradientColors || 'from-indigo-400 to-purple-400'
                }));
                
                setChallenges(processedChallenges);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching challenges:', error);
                setChallenges([]);
                setLoading(false);
            }
        };
        
        fetchChallenges();
    }, []);
    
    useEffect(() => {
        // Fetch user's challenge progress
        const fetchUserProgress = async () => {
            if (!user) return;
            
            try {
                const response = await api.get('/api/challenges/progress');
                const data = response.data;
                setUserProgress(data.progress || {});
                setCompletedToday(data.completedToday || 0);
                setDayStreak(data.streak || 0);
            } catch (error) {
                console.error('Error fetching user progress:', error);
            }
        };
        
        fetchUserProgress();
        
        // Connect to socket for real-time updates
        if (socket && socket.socket && user) {
            try {
                socket.socket.emit('student:challenges:subscribe', { studentId: user._id });
            } catch (err) {
                console.error("❌ Error subscribing to challenges:", err.message);
            }
            
            try {
                socket.socket.on('student:challenges:progress', data => {
                    setUserProgress(prev => ({ ...prev, ...data.progress }));
                    if (data.completedToday !== undefined) setCompletedToday(data.completedToday);
                    if (data.streak !== undefined) setDayStreak(data.streak);
                });
            } catch (err) {
                console.error("❌ Error setting up challenge progress listener:", err.message);
            }
            
            return () => {
                try {
                    if (socket && socket.socket) {
                        socket.socket.off('student:challenges:progress');
                    }
                } catch (err) {
                    console.error("❌ Error removing challenge progress listener:", err.message);
                }
            };
        }
    }, [socket, user]);
    
    const filteredChallenges = selectedCategory === "all" 
        ? challenges 
        : challenges.filter(challenge => challenge.category === selectedCategory);
    
    const handleChallengeStart = async (challengeId) => {
        try {
            const response = await api.post(`/api/challenges/start/${challengeId}`);
            const data = response.data;
            
            // Update local state with the new progress
            setUserProgress(prev => ({
                ...prev,
                [challengeId]: data.progress
            }));
            
            // Show a success message or navigate to a detail page
            // For now, we'll just log the success
            console.log(`Started challenge ${challengeId} successfully`);
        } catch (error) {
            console.error('Error starting challenge:', error);
        }
    };
    
    const calculateProgress = (challengeId, totalSteps) => {
        // If we have progress for this challenge, use it
        if (userProgress && userProgress[challengeId]) {
            const { currentStep, completedSteps } = userProgress[challengeId];
            const stepsCompleted = currentStep + completedSteps.length;
            return Math.round((stepsCompleted / totalSteps) * 100);
        }
        // Otherwise return 0 (not started)
        return 0;
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
                            <span className="text-black dark:text-white">🏆</span>
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                                Daily Challenges
                            </span>
                        </h1>

                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-pink-400 animate-bounce delay-300">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </motion.div>
                    <motion.p 
                        className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Complete challenges to earn <span className="font-bold text-yellow-500 bg-yellow-100 px-2 py-1 rounded-full">XP</span> and <span className="font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded-full">HealCoins</span>! ✨
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
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{challenges.length}</div>
                            <div className="text-sm text-gray-600">Active Challenges</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{completedToday}</div>
                            <div className="text-sm text-gray-600">Completed Today</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Flame className="w-8 h-8" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{dayStreak}</div>
                            <div className="text-sm text-gray-600">Day Streak</div>
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

                {/* Challenges Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    >
                        {filteredChallenges.map((challenge, i) => (
                            <motion.div
                                key={challenge._id}
                                variants={itemVariants}
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -8,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="group cursor-pointer relative"
                                onClick={() => handleChallengeStart(challenge._id)}
                                onMouseEnter={() => setHoveredChallenge(i)}
                                onMouseLeave={() => setHoveredChallenge(null)}
                            >
                                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full">
                                    <div className={`absolute inset-0 bg-gradient-to-r ${challenge.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                    
                                    {/* Difficulty Badge */}
                                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${difficultyColors[challenge.difficulty]} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                                        {challenge.difficulty}
                                    </div>

                                    <div className="relative z-10">
                                        {/* Challenge Icon */}
                                        <motion.div
                                            className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${challenge.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            {challenge.icon}
                                        </motion.div>

                                        {/* Challenge Info */}
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                                {challenge.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                                {challenge.description}
                                            </p>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {challenge.category}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Timer className="w-3 h-3" />
                                                    {challenge.estimatedTime}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Progress</span>
                                                <span>
                                                    {userProgress && userProgress[challenge._id] ? 
                                                        `${userProgress[challenge._id].currentStep + 
                                                          (userProgress[challenge._id].completedSteps?.length || 0)}` : 
                                                        '0'}
                                                    /{challenge.completionSteps} steps
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full bg-gradient-to-r ${challenge.gradient}`}
                                                    style={{ width: `${calculateProgress(challenge._id, challenge.completionSteps)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Benefits (shown on hover) */}
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ 
                                                opacity: hoveredChallenge === i ? 1 : 0,
                                                height: hoveredChallenge === i ? "auto" : 0
                                            }}
                                            className="mb-4 overflow-hidden"
                                        >
                                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl">
                                                <div className="text-xs font-semibold text-indigo-600 mb-1">Benefits:</div>
                                                <div className="space-y-1">
                                                    {challenge.benefits.map((benefit, idx) => (
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
                                                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                    <Zap className="w-4 h-4" />
                                                    +{challenge.xpReward} XP
                                                </div>
                                                <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                    <Coins className="w-4 h-4" />
                                                    +{challenge.coinReward}
                                                </div>
                                            </div>
                                            <motion.div 
                                                className="flex items-center gap-1 text-indigo-600 font-semibold text-sm"
                                                whileHover={{ x: 5 }}
                                            >
                                                <Play className="w-4 h-4" />
                                                {userProgress && userProgress[challenge._id] ? 'Continue' : 'Start'}
                                                <ChevronRight className="w-4 h-4" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Motivational Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-6 h-6" />
                        </motion.div>
                        <span>Challenge yourself daily to build better financial habits! 💪</span>
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                        >
                            <Award className="w-6 h-6" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Challenge;