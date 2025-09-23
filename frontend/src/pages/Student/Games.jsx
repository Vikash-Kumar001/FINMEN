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
    ArrowLeft,
    Dog,
    Palette,
    CheckSquare,
    Smile,
    Car,
    Puzzle,
    Bot,
    MailWarning,
    Mic,
    Link2,
    Music,
    Camera,
    Home,
    Cpu,
    LineChart,
    Gift,
    Wand2,
    Eye,
    BadgeCheck,
    TrafficCone,
    Map,
    Youtube,
    Refrigerator,
    MessageCircle,
    SmilePlus,
    UserCheck,
    Volume2,
    Stethoscope,
    Languages,
    CloudSun,
    Watch,
    ScanLine,
    Sprout,
    Paintbrush,
    Banknote,
    Newspaper,
    HeartPulse
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
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [userStats, setUserStats] = useState({
        gamesPlayed: 0,
        coinsEarned: 0,
        achievements: [],
        currentStreak: 0,
        walletBalance: 0
    });
    
    // Define the four pillars with 8 filter categories each, each having one sample game
    const gamePillars = [
        {
            id: 'ai-education',
            title: 'AI Education Games',
            icon: <GraduationCap className="w-8 h-8" />,
            color: 'from-blue-500 to-indigo-600',
            description: 'Learn AI concepts through interactive games',
            totalFilters: 8,
            filters: [
                { 
                    name: 'AI Basics & Pattern Recognition', 
                    games: [
                        { title: 'Spot the Pattern', key: 'spot-the-pattern', icon: <Brain className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/spot-the-pattern' },
                        { title: 'Cat or Dog', key: 'cat-or-dog', icon: <Dog className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/cat-or-dog' },
                        { title: 'Sorting Colors', key: 'sorting-colors', icon: <Palette className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/sorting-colors' },
                        { title: 'True or False AI Quiz', key: 'true-or-false-ai-quiz', icon: <CheckSquare className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/true-or-false-ai-quiz' },
                        { title: 'Emoji Classifier', key: 'emoji-classifier', icon: <Smile className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/emoji-classifier' },
                        { title: 'Self-Driving Car Game', key: 'self-driving-car-game', icon: <Car className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/self-driving-car-game' },
                        { title: 'Pattern Finding Puzzle', key: 'pattern-finding-puzzle', icon: <Puzzle className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/pattern-finding-puzzle' },
                        { title: 'Robot Helper Story', key: 'robot-helper-story', icon: <Bot className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/robot-helper-story' },
                        { title: 'Spam vs Not Spam', key: 'spam-vs-not-spam', icon: <MailWarning className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/spam-vs-not-spam' },
                        { title: 'Siri/Alexa Quiz', key: 'siri-alexa-quiz', icon: <Mic className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/siri-alexa-quiz' },
                        { title: 'AI in Games', key: 'ai-in-games', icon: <Gamepad2 className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-in-games' },
                        { title: 'Match AI Tools', key: 'match-ai-tools', icon: <Link2 className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/match-ai-tools' },
                        { title: 'Pattern Music Game', key: 'pattern-music-game', icon: <Music className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/pattern-music-game' },
                        { title: 'Robot Vision Game', key: 'robot-vision-game', icon: <Camera className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/robot-vision-game' },
                        { title: 'Smart Home Story', key: 'smart-home-story', icon: <Home className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/smart-home-story' },
                        { title: 'Train the Robot', key: 'train-the-robot', icon: <Cpu className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/train-the-robot' },
                        { title: 'Prediction Puzzle', key: 'prediction-puzzle', icon: <LineChart className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/prediction-puzzle' },
                        { title: 'Friendly AI Quiz', key: 'friendly-ai-quiz', icon: <Users className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/friendly-ai-quiz' },
                        { title: 'Robot Emotion Story', key: 'robot-emotion-story', icon: <Heart className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/robot-emotion-story' },
                        { title: 'Recommendation Game', key: 'recommendation-game', icon: <Gift className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/recommendation-game' },
                        { title: 'AI or Not Quiz', key: 'ai-or-not-quiz', icon: <BookOpen className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-or-not-quiz' },
                        { title: 'Robot Helper Reflex', key: 'robot-helper-reflex', icon: <Wand2 className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/robot-helper-reflex' },
                        { title: 'Match AI Uses', key: 'match-ai-uses', icon: <Eye className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/match-ai-uses' },
                        { title: 'Sorting Animals', key: 'sorting-animals', icon: <ShoppingCart className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/sorting-animals' },
                        { title: 'AI Basics Badge', key: 'ai-basics-badge', icon: <BadgeCheck className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-basics-badge' }
                    ]
                },
                { 
                    name: 'AI in daily life & applications',
                    games: [
                        { title: 'Traffic Light AI', key: 'traffic-light-ai', icon: <TrafficCone className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/traffic-light-ai' },
                        { title: 'AI in Maps Story', key: 'ai-in-maps-story', icon: <Map className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-in-maps-story' },
                        { title: 'Voice Assistant Quiz', key: 'voice-assistant-quiz', icon: <Mic className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/voice-assistant-quiz' },
                        { title: 'Youtube Recommendation Game', key: 'youtube-recommendation-game', icon: <Youtube className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/youtube-recommendation-game' },
                        { title: 'Smart Fridge Story', key: 'smart-fridge-story', icon: <Refrigerator className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/smart-fridge-story' },
                        { title: 'Chatbot Friend', key: 'chatbot-friend', icon: <MessageCircle className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/chatbot-friend' },
                        { title: 'Face Unlock Game', key: 'face-unlock-game', icon: <SmilePlus className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/face-unlock-game' },
                        { title: 'AI or Human Quiz', key: 'ai-or-human-quiz', icon: <UserCheck className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-or-human-quiz' },
                        { title: 'Smart Speaker Story', key: 'smart-speaker-story', icon: <Volume2 className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/smart-speaker-story' },
                        { title: 'AI Doctor Simulation', key: 'ai-doctor-simulation', icon: <Stethoscope className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-doctor-simulation' },
                        { title: 'Robot Vacuum Game', key: 'robot-vacuum-game', icon: <Bot className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/robot-vacuum-game' },
                        { title: 'AI Translator Quiz', key: 'ai-translator-quiz', icon: <Languages className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-translator-quiz' },
                        { title: 'Weather Prediction Story', key: 'weather-prediction-story', icon: <CloudSun className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/weather-prediction-story' },
                        { title: 'Smartwatch Game', key: 'smartwatch-game', icon: <Watch className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/smartwatch-game' },
                        { title: 'Online Shopping AI', key: 'online-shopping-ai', icon: <ShoppingCart className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/online-shopping-ai' },
                        { title: 'Airport Scanner Story', key: 'airport-scanner-story', icon: <ScanLine className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/airport-scanner-story' },
                        { title: 'Smart Farming Quiz', key: 'smart-farming-quiz', icon: <Sprout className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/smart-farming-quiz' },
                        { title: 'AI Artist Game', key: 'ai-artist-game', icon: <Paintbrush className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-artist-game' },
                        { title: 'Music AI Story', key: 'music-ai-story', icon: <Music className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/music-ai-story' },
                        { title: 'AI in Banking Quiz', key: 'ai-in-banking-quiz', icon: <Banknote className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-in-banking-quiz' },
                        { title: 'Smart City Traffic Game', key: 'smart-city-traffic-game', icon: <Car className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/smart-city-traffic-game' },
                        { title: 'AI News Story', key: 'ai-news-story', icon: <Newspaper className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-news-story' },
                        { title: 'AI Doctor Quiz', key: 'ai-doctor-quiz', icon: <HeartPulse className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-doctor-quiz' },
                        { title: 'Smart Home Lights Game', key: 'smart-home-lights-game', icon: <Lightbulb className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/smart-home-lights-game' },
                        { title: 'AI Daily Life Badge', key: 'ai-daily-life-badge', icon: <Award className="w-6 h-6" />, difficulty: 'Easy', duration: '10-20 min', coins: 30, route: '/student/games/ai/ai-daily-life-badge' }
                    ]
                },
                { name: 'How AI learns - Data, Training & Errors', game: { title: 'Train & Tweak', description: 'Balance data and fix model errors.', icon: <Brain className="w-6 h-6" />, difficulty: 'Medium', duration: '15 min', coins: 45, route: '/student/games/ai/train-and-tweak' } },
                { name: 'AI ethics, safety & future', game: { title: 'Ethics Navigator', description: 'Make safe, fair AI choices.', icon: <Compass className="w-6 h-6" />, difficulty: 'Medium', duration: '14 min', coins: 40, route: '/student/games/ai/ethics-navigator' } },
                { name: 'AI Basics & Pattern Recognition Advanced', game: { title: 'Advanced Patterns', description: 'Classify complex sequences.', icon: <Target className="w-6 h-6" />, difficulty: 'Hard', duration: '18 min', coins: 60, route: '/student/games/ai/advanced-patterns' } },
                { name: 'AI in daily life & applications Advanced', game: { title: 'Automation Architect', description: 'Design AI workflows for tasks.', icon: <Lightbulb className="w-6 h-6" />, difficulty: 'Hard', duration: '20 min', coins: 65, route: '/student/games/ai/automation-architect' } },
                { name: 'How AI learns - Data, Training & Errors Advanced', game: { title: 'Hyper Tuner', description: 'Tune models and handle bias.', icon: <Brain className="w-6 h-6" />, difficulty: 'Hard', duration: '22 min', coins: 70, route: '/student/games/ai/hyper-tuner' } },
                { name: 'AI ethics, safety & future Advanced', game: { title: 'Future Foresight', description: 'Anticipate AI impact scenarios.', icon: <Compass className="w-6 h-6" />, difficulty: 'Medium', duration: '16 min', coins: 50, route: '/student/games/ai/future-foresight' } }
            ]
        },
        {
            id: 'brain-health',
            title: 'Brain Health Games',
            icon: <Brain className="w-8 h-8" />,
            color: 'from-purple-500 to-pink-600',
            description: 'Improve mental wellness and cognitive abilities',
            totalFilters: 8,
            filters: [
                { name: 'Memory & Focus Basics', game: { title: 'Focus Finder', description: 'Sharpen short-term memory.', icon: <Focus className="w-6 h-6" />, difficulty: 'Easy', duration: '10 min', coins: 30, route: '/student/games/brain/focus-finder' } },
                { name: 'Stress & Mindfulness Basics', game: { title: 'Calm Counter', description: 'Breathe and balance attention.', icon: <Wind className="w-6 h-6" />, difficulty: 'Easy', duration: '8 min', coins: 25, route: '/student/games/brain/calm-counter' } },
                { name: 'Cognitive Skills & Problem Solving', game: { title: 'Logic Ladder', description: 'Solve layered puzzles.', icon: <Target className="w-6 h-6" />, difficulty: 'Medium', duration: '14 min', coins: 40, route: '/student/games/brain/logic-ladder' } },
                { name: 'Habits, Sleep & Brain Care', game: { title: 'Habit Hero', description: 'Build healthy routines.', icon: <Heart className="w-6 h-6" />, difficulty: 'Medium', duration: '12 min', coins: 35, route: '/student/games/brain/habit-hero' } },
                { name: 'Memory & Focus Advanced', game: { title: 'Memory Matrix', description: 'Recall complex patterns.', icon: <BookOpen className="w-6 h-6" />, difficulty: 'Hard', duration: '18 min', coins: 55, route: '/student/games/brain/memory-matrix' } },
                { name: 'Stress & Mindfulness Advanced', game: { title: 'Zen Mastery', description: 'Sustain calm under load.', icon: <Wind className="w-6 h-6" />, difficulty: 'Hard', duration: '16 min', coins: 50, route: '/student/games/brain/zen-mastery' } },
                { name: 'Cognitive Skills Advanced', game: { title: 'Cortex Challenge', description: 'Multi-step reasoning quests.', icon: <Brain className="w-6 h-6" />, difficulty: 'Hard', duration: '20 min', coins: 65, route: '/student/games/brain/cortex-challenge' } },
                { name: 'Brain Care & Lifestyle Advanced', game: { title: 'Sleep Strategist', description: 'Optimize recovery cycles.', icon: <Heart className="w-6 h-6" />, difficulty: 'Medium', duration: '15 min', coins: 45, route: '/student/games/brain/sleep-strategist' } }
            ]
        },
        {
            id: 'moral-values',
            title: 'Moral Values Games',
            icon: <Heart className="w-8 h-8" />,
            color: 'from-green-500 to-emerald-600',
            description: 'Build character and learn ethical decision making',
            totalFilters: 8,
            filters: [
                { name: 'Empathy & Kindness Basics', game: { title: 'Kindness Quest', description: 'Practice everyday empathy.', icon: <HandHeart className="w-6 h-6" />, difficulty: 'Easy', duration: '10 min', coins: 30, route: '/student/games/values/kindness-quest' } },
                { name: 'Honesty & Integrity Basics', game: { title: 'Truth Trail', description: 'Choose honesty in dilemmas.', icon: <Compass className="w-6 h-6" />, difficulty: 'Easy', duration: '12 min', coins: 35, route: '/student/games/values/truth-trail' } },
                { name: 'Responsibility & Self-Discipline', game: { title: 'Task Tactician', description: 'Own actions and outcomes.', icon: <Target className="w-6 h-6" />, difficulty: 'Medium', duration: '14 min', coins: 40, route: '/student/games/values/task-tactician' } },
                { name: 'Community & Respect', game: { title: 'Community Builder', description: 'Respect and teamwork.', icon: <Users className="w-6 h-6" />, difficulty: 'Medium', duration: '15 min', coins: 42, route: '/student/games/values/community-builder' } },
                { name: 'Empathy & Kindness Advanced', game: { title: 'Deep Empathy', description: 'Understand perspectives.', icon: <HandHeart className="w-6 h-6" />, difficulty: 'Hard', duration: '18 min', coins: 55, route: '/student/games/values/deep-empathy' } },
                { name: 'Honesty & Integrity Advanced', game: { title: 'Integrity Inspector', description: 'Hold the line under pressure.', icon: <Compass className="w-6 h-6" />, difficulty: 'Hard', duration: '20 min', coins: 60, route: '/student/games/values/integrity-inspector' } },
                { name: 'Ethical Decision-Making Advanced', game: { title: 'Ethics Lab', description: 'Weigh trade-offs wisely.', icon: <BookOpen className="w-6 h-6" />, difficulty: 'Hard', duration: '22 min', coins: 70, route: '/student/games/values/ethics-lab' } },
                { name: 'Leadership & Citizenship Advanced', game: { title: 'Civic Champion', description: 'Lead by example.', icon: <Users className="w-6 h-6" />, difficulty: 'Medium', duration: '16 min', coins: 48, route: '/student/games/values/civic-champion' } }
            ]
        },
        {
            id: 'finance',
            title: 'Finance Games',
            icon: <DollarSign className="w-8 h-8" />,
            color: 'from-yellow-500 to-orange-600',
            description: 'Master financial literacy and money management',
            totalFilters: 8,
            filters: [
                { name: 'Budgeting & Planning Basics', game: { title: 'Budget Buddy', description: 'Plan simple budgets.', icon: <BarChart4 className="w-6 h-6" />, difficulty: 'Easy', duration: '12 min', coins: 35, route: '/student/games/finance/budget-buddy' } },
                { name: 'Saving & Goals Basics', game: { title: 'Goal Grower', description: 'Set and reach goals.', icon: <PiggyBank className="w-6 h-6" />, difficulty: 'Easy', duration: '10 min', coins: 30, route: '/student/games/finance/goal-grower' } },
                { name: 'Smart Spending & Needs vs Wants', game: { title: 'Smart Shopper', description: 'Choose wisely while buying.', icon: <ShoppingCart className="w-6 h-6" />, difficulty: 'Medium', duration: '15 min', coins: 45, route: '/student/games/finance/smart-shopper' } },
                { name: 'Earning, Careers & Entrepreneurship', game: { title: 'Career Crafter', description: 'Explore earning paths.', icon: <TrendingUp className="w-6 h-6" />, difficulty: 'Medium', duration: '14 min', coins: 42, route: '/student/games/finance/career-crafter' } },
                { name: 'Budgeting & Planning Advanced', game: { title: 'Pro Planner', description: 'Balance complex budgets.', icon: <BarChart4 className="w-6 h-6" />, difficulty: 'Hard', duration: '18 min', coins: 58, route: '/student/games/finance/pro-planner' } },
                { name: 'Investing & Risk Advanced', game: { title: 'Risk Ranger', description: 'Allocate assets & risks.', icon: <TrendingUp className="w-6 h-6" />, difficulty: 'Hard', duration: '22 min', coins: 70, route: '/student/games/finance/risk-ranger' } },
                { name: 'Credit, Taxes & Banking Advanced', game: { title: 'Credit Captain', description: 'Manage credit & tax basics.', icon: <DollarSign className="w-6 h-6" />, difficulty: 'Hard', duration: '20 min', coins: 65, route: '/student/games/finance/credit-captain' } },
                { name: 'Financial Decisions & Ethics Advanced', game: { title: 'Ethical Earner', description: 'Make fair money choices.', icon: <Compass className="w-6 h-6" />, difficulty: 'Medium', duration: '16 min', coins: 48, route: '/student/games/finance/ethical-earner' } }
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

    // Reset selectedFilter when pillar changes
    useEffect(() => {
        setSelectedFilter(null);
    }, [selectedPillar]);

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
                            <div className="text-2xl font-bold text-gray-800">50+</div>
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
                                                    {pillar.totalFilters} Filters
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

                            {/* Selected Pillar Filters */}
                            {gamePillars.filter(p => p.id === selectedPillar).map(pillar => (
                                <div key={pillar.id}>
                                    <div className="text-center mb-8">
                                        <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${pillar.color} text-white px-6 py-3 rounded-full shadow-lg mb-4`}>
                                            {pillar.icon}
                                            <h2 className="text-2xl font-bold">{pillar.title}</h2>
                                        </div>
                                        <p className="text-gray-600 text-lg">{pillar.description}</p>
                                    </div>

                                    {/* Filter Buttons - max two rows (4 columns) */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                        {pillar.filters.map((filter) => (
                                            <motion.button
                                                key={filter.name}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setSelectedFilter(filter.name)}
                                                className={`px-3 py-2 rounded-xl text-sm font-semibold shadow-md transition-all ${selectedFilter === filter.name ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
                                            >
                                                {filter.name}
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Selected Filter's Games */}
                                    {(() => {
                                        const active = pillar.filters.find(f => f.name === selectedFilter) || pillar.filters[0];
                                        // For AI Basics & Pattern Recognition, show 25 cards in 5x5 grid
                                        if (pillar.id === 'ai-education' && active.games) {
                                            return (
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                    {active.games.map((game, idx) => (
                                                        <motion.div
                                                            key={game.key}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                                                            whileHover={{ scale: 1.03, y: -3 }}
                                                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/40 cursor-pointer"
                                                            onClick={() => handleGameClick(game)}
                                                        >
                                                            <div className="flex items-start gap-3 mb-3">
                                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${pillar.color} flex items-center justify-center text-white shadow-lg`}>
                                                                    {game.icon}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">
                                                                        {game.title}
                                                                    </h3>
                                                                    <div className={`inline-block bg-gradient-to-r ${getDifficultyColor(game.difficulty)} text-white px-2 py-0.5 rounded-full text-[10px] font-bold`}>
                                                                        {game.difficulty}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                                <div className="flex items-center gap-1">
                                                                    <Timer className="w-3 h-3" />
                                                                    {game.duration}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-yellow-700 font-semibold">
                                                                    <Coins className="w-3 h-3" />
                                                                    +{game.coins}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        // Default: single game card for other filters
                                        const game = active.game;
                                        return (
                                            <motion.div
                                                key={active.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                whileHover={{ scale: 1.02, y: -3 }}
                                                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40"
                                            >
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${pillar.color} flex items-center justify-center text-white shadow-lg`}>
                                                        {game.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-800 mb-1">
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
                                                    <motion.button
                                                        whileHover={{ x: 5 }}
                                                        className="flex items-center gap-1 text-indigo-600 font-semibold text-sm"
                                                        onClick={() => handleGameClick(game)}
                                                    >
                                                        <Play className="w-4 h-4" />
                                                        Play
                                                        <ChevronRight className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        );
                                    })()}
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