import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { 
    ArrowLeft, 
    Trophy, 
    Timer, 
    Coins, 
    Lock, 
    Play,
    Puzzle,
    Users,
    Calendar,
    Lightbulb,
    Star,
    TrendingUp,
    Zap,
    Gamepad2,
    Brain,
    Wallet,
    Heart,
    Shield,
    Globe,
    Target,
    BookOpen,
    GraduationCap,
    HandHeart,
    ShoppingCart,
    BarChart4,
    Cpu,
    Camera,
    Smartphone,
    UserX,
    Eye,
    Smile,
    MessageSquare,
    Flag,
    RefreshCw,
    Award,
    Palette,
    Home,
    Leaf,
    Sun,
    Droplets,
    Cloud,
    Book
} from "lucide-react";


import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import gameCompletionService from "../../services/gameCompletionService";

const GameCategoryPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { category, ageGroup } = useParams();
    const [userAge, setUserAge] = useState(null);
    const [completedGames, setCompletedGames] = useState(new Set());
    const [gameCompletionStatus, setGameCompletionStatus] = useState({});
    
    // Calculate user's age from date of birth
    const calculateUserAge = (dob) => {
        if (!dob) return null;
        
        const dobDate = typeof dob === 'string' ? new Date(dob) : new Date(dob);
        if (isNaN(dobDate.getTime())) return null;
        
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        
        return age;
    };
    
    // Check if user can access a specific game based on age
    const canAccessGame = (gameAgeGroup, userAge) => {
        if (userAge === null) return false;
        
        // For sustainability category, no age restrictions
        if (category === 'sustainability') {
            return true;
        }
        
        switch (gameAgeGroup) {
            case 'kids':
                // Kids games: accessible to users under 18, locked for 18+
                return userAge < 18;
            case 'teens':
                // Teens games: accessible to all users
                return true;
            case 'adults':
                // Adult games: only accessible to users 18 and above
                return userAge >= 18;
            case 'solar-and-city':
            case 'water-and-recycle':
            case 'carbon-and-climate':
            case 'water-and-energy':
                // Sustainability subcategories: accessible to all users
                return true;
            default:
                return true;
        }
    };
    
    // Check if a specific game is unlocked based on completion sequence
    const isGameUnlocked = (gameIndex) => {
        // First game is always unlocked
        if (gameIndex === 0) return true;
        
        // For finance, brain health, UVLS, DCOS, Moral Values, AI For All, EHE, CRGC, and Sustainability kids and teens games, check if previous game is completed
        if ((category === 'financial-literacy' || category === 'brain-health' || category === 'uvls' || category === 'digital-citizenship' || category === 'moral-values' || category === 'ai-for-all' || category === 'entrepreneurship' || category === 'civic-responsibility' || category === 'sustainability') && (ageGroup === 'kids' || ageGroup === 'teens' || ageGroup === 'solar-and-city' || ageGroup === 'water-and-recycle' || ageGroup === 'carbon-and-climate' || ageGroup === 'water-and-energy')) {
            const previousGameId = getGameIdByIndex(gameIndex - 1);
            return gameCompletionStatus[previousGameId] || false;
        }
        
        // For other categories, unlock all games (existing behavior)
        return true;
    };
    // Check if a game is fully completed and should be locked
    const isGameFullyCompleted = (gameId) => {
        return gameCompletionStatus[gameId] === true;
    };
    
    // Get game ID by index for sequential unlocking
    const getGameIdByIndex = (index) => {
        if (category === 'financial-literacy' && ageGroup === 'kids') {
            const gameIds = [
                'finance-kids-1', 'finance-kids-2', 'finance-kids-3', 'finance-kids-4', 'finance-kids-5',
                'finance-kids-6', 'finance-kids-7', 'finance-kids-8', 'finance-kids-9', 'finance-kids-10',
                'finance-kids-11', 'finance-kids-12', 'finance-kids-13', 'finance-kids-14', 'finance-kids-15',
                'finance-kids-16', 'finance-kids-17', 'finance-kids-18', 'finance-kids-19', 'finance-kids-20'
            ];
            return gameIds[index];
        } else if (category === 'financial-literacy' && ageGroup === 'teens') {
            const gameIds = [
                'finance-teens-1', 'finance-teens-2', 'finance-teens-3', 'finance-teens-4', 'finance-teens-5',
                'finance-teens-6', 'finance-teens-7', 'finance-teens-8', 'finance-teens-9', 'finance-teens-10',
                'finance-teens-11', 'finance-teens-12', 'finance-teens-13', 'finance-teens-14', 'finance-teens-15',
                'finance-teens-16', 'finance-teens-17', 'finance-teens-18', 'finance-teens-19', 'finance-teens-20'
            ];
            return gameIds[index];
        } else if (category === 'brain-health' && ageGroup === 'kids') {
            const gameIds = [
                'brain-kids-1', 'brain-kids-2', 'brain-kids-3', 'brain-kids-4', 'brain-kids-5',
                'brain-kids-6', 'brain-kids-7', 'brain-kids-8', 'brain-kids-9', 'brain-kids-10',
                'brain-kids-11', 'brain-kids-12', 'brain-kids-13', 'brain-kids-14', 'brain-kids-15',
                'brain-kids-16', 'brain-kids-17', 'brain-kids-18', 'brain-kids-19', 'brain-kids-20'
            ];
            return gameIds[index];
        } else if (category === 'brain-health' && ageGroup === 'teens') {
            const gameIds = [
                'brain-teens-1', 'brain-teens-2', 'brain-teens-3', 'brain-teens-4', 'brain-teens-5',
                'brain-teens-6', 'brain-teens-7', 'brain-teens-8', 'brain-teens-9', 'brain-teens-10',
                'brain-teens-11', 'brain-teens-12', 'brain-teens-13', 'brain-teens-14', 'brain-teens-15',
                'brain-teens-16', 'brain-teens-17', 'brain-teens-18', 'brain-teens-19', 'brain-teens-20'
            ];
            return gameIds[index];
        } else if (category === 'uvls' && ageGroup === 'kids') {
            const gameIds = [
                'uvls-kids-1', 'uvls-kids-2', 'uvls-kids-3', 'uvls-kids-4', 'uvls-kids-5',
                'uvls-kids-6', 'uvls-kids-7', 'uvls-kids-8', 'uvls-kids-9', 'uvls-kids-10',
                'uvls-kids-11', 'uvls-kids-12', 'uvls-kids-13', 'uvls-kids-14', 'uvls-kids-15',
                'uvls-kids-16', 'uvls-kids-17', 'uvls-kids-18', 'uvls-kids-19', 'uvls-kids-20'
            ];
            return gameIds[index];
        } else if (category === 'uvls' && ageGroup === 'teens') {
            const gameIds = [
                'uvls-teen-1', 'uvls-teen-2', 'uvls-teen-3', 'uvls-teen-4', 'uvls-teen-5',
                'uvls-teen-6', 'uvls-teen-7', 'uvls-teen-8', 'uvls-teen-9', 'uvls-teen-10',
                'uvls-teen-11', 'uvls-teen-12', 'uvls-teen-13', 'uvls-teen-14', 'uvls-teen-15',
                'uvls-teen-16', 'uvls-teen-17', 'uvls-teen-18', 'uvls-teen-19', 'uvls-teen-20'
            ];
            return gameIds[index];
        } else if (category === 'digital-citizenship' && ageGroup === 'kids') {
            const gameIds = [
                'dcos-kids-1', 'dcos-kids-2', 'dcos-kids-3', 'dcos-kids-4', 'dcos-kids-5',
                'dcos-kids-6', 'dcos-kids-7', 'dcos-kids-8', 'dcos-kids-9', 'dcos-kids-10',
                'dcos-kids-11', 'dcos-kids-12', 'dcos-kids-13', 'dcos-kids-14', 'dcos-kids-15',
                'dcos-kids-16', 'dcos-kids-17', 'dcos-kids-18', 'dcos-kids-19', 'dcos-kids-20'
            ];
            return gameIds[index];
        } else if (category === 'digital-citizenship' && ageGroup === 'teens') {
            const gameIds = [
                'dcos-teen-1', 'dcos-teen-2', 'dcos-teen-3', 'dcos-teen-4', 'dcos-teen-5',
                'dcos-teen-6', 'dcos-teen-7', 'dcos-teen-8', 'dcos-teen-9', 'dcos-teen-10',
                'dcos-teen-11', 'dcos-teen-12', 'dcos-teen-13', 'dcos-teen-14', 'dcos-teen-15',
                'dcos-teen-16', 'dcos-teen-17', 'dcos-teen-18', 'dcos-teen-19', 'dcos-teen-20'
            ];
            return gameIds[index];
        } else if (category === 'moral-values' && ageGroup === 'kids') {
            const gameIds = [
                'moral-kids-1', 'moral-kids-2', 'moral-kids-3', 'moral-kids-4', 'moral-kids-5',
                'moral-kids-6', 'moral-kids-7', 'moral-kids-8', 'moral-kids-9', 'moral-kids-10',
                'moral-kids-11', 'moral-kids-12', 'moral-kids-13', 'moral-kids-14', 'moral-kids-15',
                'moral-kids-16', 'moral-kids-17', 'moral-kids-18', 'moral-kids-19', 'moral-kids-20'
            ];
            return gameIds[index];
        } else if (category === 'moral-values' && ageGroup === 'teens') {
            const gameIds = [
                'moral-teen-1', 'moral-teen-2', 'moral-teen-3', 'moral-teen-4', 'moral-teen-5',
                'moral-teen-6', 'moral-teen-7', 'moral-teen-8', 'moral-teen-9', 'moral-teen-10',
                'moral-teen-11', 'moral-teen-12', 'moral-teen-13', 'moral-teen-14', 'moral-teen-15',
                'moral-teen-16', 'moral-teen-17', 'moral-teen-18', 'moral-teen-19', 'moral-teen-20'
            ];
            return gameIds[index];
        } else if (category === 'ai-for-all' && ageGroup === 'kids') {
            const gameIds = [
                'ai-kids-1', 'ai-kids-2', 'ai-kids-3', 'ai-kids-4', 'ai-kids-5',
                'ai-kids-6', 'ai-kids-7', 'ai-kids-8', 'ai-kids-9', 'ai-kids-10',
                'ai-kids-11', 'ai-kids-12', 'ai-kids-13', 'ai-kids-14', 'ai-kids-15',
                'ai-kids-16', 'ai-kids-17', 'ai-kids-18', 'ai-kids-19', 'ai-kids-20'
            ];
            return gameIds[index];
        } else if (category === 'ai-for-all' && ageGroup === 'teens') {
            const gameIds = [
                'ai-teen-1', 'ai-teen-2', 'ai-teen-3', 'ai-teen-4', 'ai-teen-5',
                'ai-teen-6', 'ai-teen-7', 'ai-teen-8', 'ai-teen-9', 'ai-teen-10',
                'ai-teen-11', 'ai-teen-12', 'ai-teen-13', 'ai-teen-14', 'ai-teen-15',
                'ai-teen-16', 'ai-teen-17', 'ai-teen-18', 'ai-teen-19', 'ai-teen-20'
            ];
            return gameIds[index];
        } else if (category === 'entrepreneurship' && ageGroup === 'kids') {
            const gameIds = [
                'ehe-kids-1', 'ehe-kids-2', 'ehe-kids-3', 'ehe-kids-4', 'ehe-kids-5',
                'ehe-kids-6', 'ehe-kids-7', 'ehe-kids-8', 'ehe-kids-9', 'ehe-kids-10',
                'ehe-kids-11', 'ehe-kids-12', 'ehe-kids-13', 'ehe-kids-14', 'ehe-kids-15',
                'ehe-kids-16', 'ehe-kids-17', 'ehe-kids-18', 'ehe-kids-19', 'ehe-kids-20'
            ];
            return gameIds[index];
        } else if (category === 'entrepreneurship' && ageGroup === 'teens') {
            const gameIds = [
                'ehe-teen-1', 'ehe-teen-2', 'ehe-teen-3', 'ehe-teen-4', 'ehe-teen-5',
                'ehe-teen-6', 'ehe-teen-7', 'ehe-teen-8', 'ehe-teen-9', 'ehe-teen-10',
                'ehe-teen-11', 'ehe-teen-12', 'ehe-teen-13', 'ehe-teen-14', 'ehe-teen-15',
                'ehe-teen-16', 'ehe-teen-17', 'ehe-teen-18', 'ehe-teen-19', 'ehe-teen-20'
            ];
            return gameIds[index];
        } else if (category === 'civic-responsibility' && ageGroup === 'kids') {
            const gameIds = [
                'crgc-kids-1', 'crgc-kids-2', 'crgc-kids-3', 'crgc-kids-4', 'crgc-kids-5',
                'crgc-kids-6', 'crgc-kids-7', 'crgc-kids-8', 'crgc-kids-9', 'crgc-kids-10',
                'crgc-kids-11', 'crgc-kids-12', 'crgc-kids-13', 'crgc-kids-14', 'crgc-kids-15',
                'crgc-kids-16', 'crgc-kids-17', 'crgc-kids-18', 'crgc-kids-19', 'crgc-kids-20'
            ];
            return gameIds[index];
        } else if (category === 'civic-responsibility' && ageGroup === 'teens') {
            const gameIds = [
                'crgc-teen-1', 'crgc-teen-2', 'crgc-teen-3', 'crgc-teen-4', 'crgc-teen-5',
                'crgc-teen-6', 'crgc-teen-7', 'crgc-teen-8', 'crgc-teen-9', 'crgc-teen-10',
                'crgc-teen-11', 'crgc-teen-12', 'crgc-teen-13', 'crgc-teen-14', 'crgc-teen-15',
                'crgc-teen-16', 'crgc-teen-17', 'crgc-teen-18', 'crgc-teen-19', 'crgc-teen-20'
            ];
            return gameIds[index];
        } else if (category === 'sustainability') {
            // For sustainability subcategories, we'll use different IDs based on the ageGroup
            if (ageGroup === 'solar-and-city') {
                const gameIds = [
                    'sustainability-solar-1', 'sustainability-solar-2', 'sustainability-solar-3', 'sustainability-solar-4',
                    'sustainability-solar-5', 'sustainability-solar-6', 'sustainability-solar-7', 'sustainability-solar-8',
                    'sustainability-solar-9', 'sustainability-solar-10', 'sustainability-solar-11', 'sustainability-solar-12',
                    'sustainability-solar-13', 'sustainability-solar-14', 'sustainability-solar-15', 'sustainability-solar-16',
                    'sustainability-solar-17', 'sustainability-solar-18', 'sustainability-solar-19', 'sustainability-solar-20'
                ];
                return gameIds[index];
            } else if (ageGroup === 'water-and-recycle') {
                const gameIds = [
                    'sustainability-water-1', 'sustainability-water-2', 'sustainability-water-3', 'sustainability-water-4',
                    'sustainability-water-5', 'sustainability-water-6', 'sustainability-water-7', 'sustainability-water-8',
                    'sustainability-water-9', 'sustainability-water-10', 'sustainability-water-11', 'sustainability-water-12',
                    'sustainability-water-13', 'sustainability-water-14', 'sustainability-water-15', 'sustainability-water-16',
                    'sustainability-water-17', 'sustainability-water-18', 'sustainability-water-19', 'sustainability-water-20'
                ];
                return gameIds[index];
            } else if (ageGroup === 'carbon-and-climate') {
                const gameIds = [
                    'sustainability-carbon-1', 'sustainability-carbon-2', 'sustainability-carbon-3', 'sustainability-carbon-4',
                    'sustainability-carbon-5', 'sustainability-carbon-6', 'sustainability-carbon-7', 'sustainability-carbon-8',
                    'sustainability-carbon-9', 'sustainability-carbon-10', 'sustainability-carbon-11', 'sustainability-carbon-12',
                    'sustainability-carbon-13', 'sustainability-carbon-14', 'sustainability-carbon-15', 'sustainability-carbon-16',
                    'sustainability-carbon-17', 'sustainability-carbon-18', 'sustainability-carbon-19', 'sustainability-carbon-20'
                ];
                return gameIds[index];
            } else if (ageGroup === 'water-and-energy') {
                const gameIds = [
                    'sustainability-energy-1', 'sustainability-energy-2', 'sustainability-energy-3', 'sustainability-energy-4',
                    'sustainability-energy-5', 'sustainability-energy-6', 'sustainability-energy-7', 'sustainability-energy-8',
                    'sustainability-energy-9', 'sustainability-energy-10', 'sustainability-energy-11', 'sustainability-energy-12',
                    'sustainability-energy-13', 'sustainability-energy-14', 'sustainability-energy-15', 'sustainability-energy-16',
                    'sustainability-energy-17', 'sustainability-energy-18', 'sustainability-energy-19', 'sustainability-energy-20'
                ];
                return gameIds[index];
            } else {
                // Default case
                const gameIds = [
                    'sustainability-1', 'sustainability-2', 'sustainability-3', 'sustainability-4'
                ];
                return gameIds[index];
            }
        }
        return null;
    };
    
    // Get category icon based on category name
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'financial-literacy': <Wallet className="w-6 h-6" />,
            'brain-health': <Brain className="w-6 h-6" />,
            'uvls': <HandHeart className="w-6 h-6" />,
            'digital-citizenship': <Globe className="w-6 h-6" />,
            'moral-values': <Heart className="w-6 h-6" />,
            'ai-for-all': <Cpu className="w-6 h-6" />,
            'health-male': <Shield className="w-6 h-6" />,
            'health-female': <Shield className="w-6 h-6" />,
            'entrepreneurship': <Target className="w-6 h-6" />,
            'civic-responsibility': <Globe className="w-6 h-6" />,
            'sustainability': <Leaf className="w-6 h-6" />
        };
        
        return iconMap[categoryName] || <Gamepad2 className="w-6 h-6" />;
    };
    
    // Get category title based on category name
    const getCategoryTitle = (categoryName) => {
        const titleMap = {
            'financial-literacy': 'Financial Literacy',
            'brain-health': 'Brain Health',
            'uvls': 'UVLS (Life Skills & Values)',

            'digital-citizenship': 'Digital Citizenship & Online Safety',
            'moral-values': 'Moral Values',
            'ai-for-all': 'AI for All',
            'health-male': 'Health - Male',
            'health-female': 'Health - Female',
            'entrepreneurship': 'Entrepreneurship & Higher Education',
            'civic-responsibility': 'Civic Responsibility & Global Citizenship',
            'sustainability': 'Sustainability'
        };
        
        return titleMap[categoryName] || categoryName;
    };
    
    // Get age group title
    const getAgeGroupTitle = (ageGroup) => {
        const titleMap = {
            'kids': 'Kids Games',
            'teens': 'Teen Games',
            'adults': 'Adult Games',
            'solar-and-city': 'Solar & City Games',
            'water-and-recycle': 'Water & Recycle Games',
            'carbon-and-climate': 'Carbon & Climate Games',
            'water-and-energy': 'Water & Energy Games'
        };
        
        return titleMap[ageGroup] || ageGroup;
    };
    
    // Load game completion status
    const loadGameCompletionStatus = async () => {
        try {
            // For finance, brain health, UVLS, DCOS, Moral Values, AI For All, EHE, CRGC, and Sustainability kids games, load completion status
            if ((category === 'financial-literacy' || category === 'brain-health' || category === 'uvls' || category === 'digital-citizenship' || category === 'moral-values' || category === 'ai-for-all' || category === 'entrepreneurship' || category === 'civic-responsibility' || category === 'sustainability') && (ageGroup === 'kids' || ageGroup === 'teens' || ageGroup === 'solar-and-city' || ageGroup === 'water-and-recycle' || ageGroup === 'carbon-and-climate' || ageGroup === 'water-and-energy')) {
                const status = {};
                // For all categories, we have 20 games
                const maxGames = 20;
                for (let i = 0; i < maxGames; i++) {
                    const gameId = getGameIdByIndex(i);
                    if (gameId) {
                        const isCompleted = await gameCompletionService.isGameCompleted(gameId);
                        status[gameId] = isCompleted;
                    }
                }
                setGameCompletionStatus(status);
            }
        } catch (error) {
            console.error('Failed to load game completion status:', error);
        }
    };
    
    useEffect(() => {
        loadGameCompletionStatus();
        
        // Listen for game completion events
        const handleGameCompleted = () => {
            if ((category === 'financial-literacy' || category === 'brain-health' || category === 'uvls' || category === 'sustainability') && (ageGroup === 'kids' || ageGroup === 'teens' || ageGroup === 'solar-and-city' || ageGroup === 'water-and-recycle' || ageGroup === 'carbon-and-climate' || ageGroup === 'water-and-energy')) {
                // Reload game completion status when a game is completed
                loadGameCompletionStatus();
            }
        };
        
        window.addEventListener('gameCompleted', handleGameCompleted);
        
        return () => {
            window.removeEventListener('gameCompleted', handleGameCompleted);
        };
    }, [category, ageGroup]);
    // Generate mock games data
    const generateGamesData = () => {
        const games = [];
        const difficulties = ['Easy', 'Medium', 'Hard'];
        const icons = [<Gamepad2 />, <Trophy />, <Star />, <Zap />, <Target />, <BookOpen />, <GraduationCap />];
        
        // Special case for financial literacy kids games - replace first 20 with real games
        if (category === 'financial-literacy' && ageGroup === 'kids') {
            // Add our 20 real finance games instead of mock games
            const realGames = [
                {
                    id: 'finance-kids-1',
                    title: 'Piggy Bank Story',
                    description: 'You get ₹10. Do you save ₹5 or spend all?',
                    icon: <Wallet className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-1'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/piggy-bank-story',
                    index: 0
                },
                {
                    id: 'finance-kids-2',
                    title: 'Quiz on Saving',
                    description: 'Best saver? (a) Spends all, (b) Saves part, (c) Wastes money',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-kids-2'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/quiz-on-saving',
                    index: 1
                },
                {
                    id: 'finance-kids-3',
                    title: 'Reflex Savings',
                    description: 'Tap quickly for "Save" words, avoid "Waste" words',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-kids-3'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/reflex-savings',
                    index: 2
                },
                {
                    id: 'finance-kids-4',
                    title: 'Puzzle: Save or Spend',
                    description: 'Match "Piggy Bank → Save, Ice Cream → Spend"',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-4'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/puzzle-save-or-spend',
                    index: 3
                },
                {
                    id: 'finance-kids-5',
                    title: 'Birthday Money Story',
                    description: 'You get birthday gift money. Do you save some?',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-5'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/birthday-money-story',
                    index: 4
                },
                {
                    id: 'finance-kids-6',
                    title: 'Poster: Saving Habit',
                    description: 'Create/select poster: "Save First, Spend Later"',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7 min',
                    coins: 0,
                    xp: 15,
                    completed: gameCompletionStatus['finance-kids-6'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/poster-saving-habit',
                    index: 5
                },
                {
                    id: 'finance-kids-7',
                    title: 'Journal of Saving',
                    description: 'Write: "One thing I saved money for is ___"',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-7'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/journal-of-saving',
                    index: 6
                },
                {
                    id: 'finance-kids-8',
                    title: 'Shop Story',
                    description: 'You see candy. Do you buy or save for toy later?',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-8'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/shop-story',
                    index: 7
                },
                {
                    id: 'finance-kids-9',
                    title: 'Reflex Money Choice',
                    description: 'Tap for "Deposit," for "Throw Away"',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-kids-9'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/reflex-money-choice',
                    index: 8
                },
                {
                    id: 'finance-kids-10',
                    title: 'Badge: Saver Kid',
                    description: 'Save in 5 scenarios to earn your badge',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 0,
                    xp: 20,
                    completed: gameCompletionStatus['finance-kids-10'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/badge-saver-kid',
                    index: 9
                },
                {
                    id: 'finance-kids-11',
                    title: 'Ice Cream Story',
                    description: 'You have ₹10. Spend on ice cream now or save for toy?',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-11'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/ice-cream-story',
                    index: 10
                },
                {
                    id: 'finance-kids-12',
                    title: 'Quiz on Spending',
                    description: 'Best spending habit? (a) Buy without thinking, (b) Compare and choose, (c) Borrow for fun',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-kids-12'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/quiz-on-spending',
                    index: 11
                },
                {
                    id: 'finance-kids-13',
                    title: 'Reflex Spending',
                    description: 'Tap for "Plan Purchase," for "Impulse Buy"',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-kids-13'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/reflex-spending',
                    index: 12
                },
                {
                    id: 'finance-kids-14',
                    title: 'Puzzle: Smart vs Waste',
                    description: 'Match "Notebook → Need, Extra Candy → Waste"',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-14'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/puzzle-smart-vs-waste',
                    index: 13
                },
                {
                    id: 'finance-kids-15',
                    title: 'Shop Story 2',
                    description: 'You see two pens: one costly, one affordable. Which to buy wisely?',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-15'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/shop-story-2',
                    index: 14
                },
                {
                    id: 'finance-kids-16',
                    title: 'Poster: Smart Shopping',
                    description: 'Create/select poster: "Think Before You Spend"',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7 min',
                    coins: 0,
                    xp: 15,
                    completed: gameCompletionStatus['finance-kids-16'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/poster-smart-shopping',
                    index: 15
                },
                {
                    id: 'finance-kids-17',
                    title: 'Journal of Smart Buy',
                    description: 'Write: "One smart thing I bought was ___"',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-17'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/journal-of-smart-buy',
                    index: 16
                },
                {
                    id: 'finance-kids-18',
                    title: 'Candy Offer Story',
                    description: 'Offer says "Buy 1, Get 1 Free." Do you need it?',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-kids-18'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/candy-offer-story',
                    index: 17
                },
                {
                    id: 'finance-kids-19',
                    title: 'Reflex Needs First',
                    description: 'Tap for "Books," for "Unneeded Toys"',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-kids-19'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/reflex-needs-first',
                    index: 18
                },
                {
                    id: 'finance-kids-20',
                    title: 'Badge: Smart Spender Kid',
                    description: 'Make 5 wise spending decisions',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 0,
                    xp: 20,
                    completed: gameCompletionStatus['finance-kids-20'] || false,
                    isSpecial: true,
                    path: '/student/finance/kids/badge-smart-spender-kid',
                    index: 19
                }
            ];
            
            // Add our real games first
            games.push(...realGames);
            
            // No need for additional mock games since we have 20 real games
        } else if (category === 'financial-literacy' && ageGroup === 'teens') {
            // Add our 20 real teen finance games
            const realTeenGames = [
                {
                    id: 'finance-teens-1',
                    title: 'Pocket Money Story',
                    description: 'You receive pocket money. Do you save a portion or spend it all?',
                    icon: <Wallet className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-teens-1'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/pocket-money-story',
                    index: 0
                },
                {
                    id: 'finance-teens-2',
                    title: 'Quiz on Savings Rate',
                    description: 'What percentage of income should you save? (a) 0%, (b) 10%, (c) 20%+',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-teens-2'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/quiz-on-savings-rate',
                    index: 1
                },
                {
                    id: 'finance-teens-3',
                    title: 'Reflex Smart Saver',
                    description: 'Tap quickly for "Save" words, avoid "Waste" words',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-teens-3'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/reflex-smart-saver',
                    index: 2
                },
                {
                    id: 'finance-teens-4',
                    title: 'Puzzle of Saving Goals',
                    description: 'Match saving goals with timeframes',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-teens-4'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/puzzle-of-saving-goals',
                    index: 3
                },
                {
                    id: 'finance-teens-5',
                    title: 'Salary Story',
                    description: 'You get your first part-time job salary. How do you manage it?',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-teens-5'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/salary-story',
                    index: 4
                },
                {
                    id: 'finance-teens-6',
                    title: 'Debate: Save vs Spend',
                    description: 'Participate in a debate on saving vs spending',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7 min',
                    coins: 0,
                    xp: 15,
                    completed: gameCompletionStatus['finance-teens-6'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/debate-save-vs-spend',
                    index: 5
                },
                {
                    id: 'finance-teens-7',
                    title: 'Journal of Saving Goal',
                    description: 'Write about your personal saving goals',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-teens-7'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/journal-of-saving-goal',
                    index: 6
                },
                {
                    id: 'finance-teens-8',
                    title: 'Simulation: Monthly Money',
                    description: 'Manage a monthly budget with income and expenses',
                    icon: <BarChart4 className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['finance-teens-8'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/simulation-monthly-money',
                    index: 7
                },
                {
                    id: 'finance-teens-9',
                    title: 'Reflex: Wise Use',
                    description: 'Tap for wise financial decisions, avoid impulsive choices',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-teens-9'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/reflex-wise-use',
                    index: 8
                },
                {
                    id: 'finance-teens-10',
                    title: 'Badge: Smart Saver',
                    description: 'Earn your badge for completing saving challenges',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 0,
                    xp: 20,
                    completed: gameCompletionStatus['finance-teens-10'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/badge-smart-saver',
                    index: 9
                },
                {
                    id: 'finance-teens-11',
                    title: 'Allowance Story',
                    description: 'You receive weekly allowance. How do you allocate it?',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-teens-11'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/allowance-story',
                    index: 10
                },
                {
                    id: 'finance-teens-12',
                    title: 'Spending Quiz',
                    description: 'Test your knowledge on smart spending habits',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-teens-12'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/spending-quiz',
                    index: 11
                },
                {
                    id: 'finance-teens-13',
                    title: 'Reflex: Wise Choices',
                    description: 'Make quick decisions between needs and wants',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-teens-13'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/reflex-wise-choices',
                    index: 12
                },
                {
                    id: 'finance-teens-14',
                    title: 'Puzzle: Smart Spending',
                    description: 'Match spending concepts with their definitions',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-teens-14'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/puzzle-smart-spending',
                    index: 13
                },
                {
                    id: 'finance-teens-15',
                    title: 'Party Story',
                    description: 'Plan a party within budget constraints',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-teens-15'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/party-story',
                    index: 14
                },
                {
                    id: 'finance-teens-16',
                    title: 'Debate: Needs vs Wants',
                    description: 'Debate the difference between needs and wants',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7 min',
                    coins: 0,
                    xp: 15,
                    completed: gameCompletionStatus['finance-teens-16'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/debate-needs-vs-wants',
                    index: 15
                },
                {
                    id: 'finance-teens-17',
                    title: 'Journal of Spending',
                    description: 'Reflect on your spending habits',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['finance-teens-17'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/journal-of-spending',
                    index: 16
                },
                {
                    id: 'finance-teens-18',
                    title: 'Simulation: Shopping Mall',
                    description: 'Make purchasing decisions in a shopping mall simulation',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['finance-teens-18'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/simulation-shopping-mall',
                    index: 17
                },
                {
                    id: 'finance-teens-19',
                    title: 'Reflex: Control',
                    description: 'Practice spending control with quick decisions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['finance-teens-19'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/reflex-control',
                    index: 18
                },
                {
                    id: 'finance-teens-20',
                    title: 'Badge: Smart Spender Teen',
                    description: 'Earn your badge for completing all teen finance challenges',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 0,
                    xp: 20,
                    completed: gameCompletionStatus['finance-teens-20'] || false,
                    isSpecial: true,
                    path: '/student/finance/teen/badge-smart-spender-teen',
                    index: 19
                }
            ];
            
            // Add our real teen games
            games.push(...realTeenGames);
        } else if (category === 'brain-health' && ageGroup === 'kids') {
            // Add our 20 real brain health games for kids
            const realBrainGames = [
                {
                    id: 'brain-kids-1',
                    title: 'Water Story',
                    description: 'Learn why water is important for brain health',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-1'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/water-story',
                    index: 0
                },
                {
                    id: 'brain-kids-2',
                    title: 'Quiz on Brain Food',
                    description: 'Test your knowledge of brain-healthy foods',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-kids-2'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/quiz-on-brain-food',
                    index: 1
                },
                {
                    id: 'brain-kids-3',
                    title: 'Reflex Brain Boost',
                    description: 'Tap quickly for brain-boosting activities',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-kids-3'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/reflex-brain-boost',
                    index: 2
                },
                {
                    id: 'brain-kids-4',
                    title: 'Puzzle of Brain Care',
                    description: 'Match brain care activities with their benefits',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-4'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/puzzle-of-brain-care',
                    index: 3
                },
                {
                    id: 'brain-kids-5',
                    title: 'Breakfast Story',
                    description: 'Learn why breakfast is important for brain function',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-5'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/breakfast-story',
                    index: 4
                },
                {
                    id: 'brain-kids-6',
                    title: 'Poster: Brain Health',
                    description: 'Create or select a brain health poster',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7 min',
                    coins: 0,
                    xp: 15,
                    completed: gameCompletionStatus['brain-kids-6'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/poster-brain-health',
                    index: 5
                },
                {
                    id: 'brain-kids-7',
                    title: 'Journal of Habits',
                    description: 'Reflect on brain-healthy habits',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-7'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/journal-of-habits',
                    index: 6
                },
                {
                    id: 'brain-kids-8',
                    title: 'Sports Story',
                    description: 'Learn how sports benefit brain health',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-8'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/sports-story',
                    index: 7
                },
                {
                    id: 'brain-kids-9',
                    title: 'Reflex Daily Habit',
                    description: 'Practice identifying good daily habits',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-kids-9'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/reflex-daily-habit',
                    index: 8
                },
                {
                    id: 'brain-kids-10',
                    title: 'Badge: Brain Care Kid',
                    description: 'Earn your badge for completing brain health challenges',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 0,
                    xp: 20,
                    completed: gameCompletionStatus['brain-kids-10'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/badge-brain-care-kid',
                    index: 9
                },
                {
                    id: 'brain-kids-11',
                    title: 'Classroom Story',
                    description: 'Learn how to stay focused in class',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-11'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/classroom-story',
                    index: 10
                },
                {
                    id: 'brain-kids-12',
                    title: 'Quiz on Focus',
                    description: 'Test your knowledge of focus techniques',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-kids-12'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/quiz-on-focus',
                    index: 11
                },
                {
                    id: 'brain-kids-13',
                    title: 'Reflex Attention',
                    description: 'Practice attention-boosting actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-kids-13'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/reflex-attention',
                    index: 12
                },
                {
                    id: 'brain-kids-14',
                    title: 'Puzzle of Focus',
                    description: 'Match focus concepts with their effects',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-14'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/puzzle-of-focus',
                    index: 13
                },
                {
                    id: 'brain-kids-15',
                    title: 'Homework Story',
                    description: 'Learn how to focus while doing homework',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-15'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/homework-story',
                    index: 14
                },
                {
                    id: 'brain-kids-16',
                    title: 'Poster: Focus Matters',
                    description: 'Create or select a focus poster',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7 min',
                    coins: 0,
                    xp: 15,
                    completed: gameCompletionStatus['brain-kids-16'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/poster-focus-matters',
                    index: 15
                },
                {
                    id: 'brain-kids-17',
                    title: 'Journal of Focus',
                    description: 'Reflect on focus strategies',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-17'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/journal-of-focus',
                    index: 16
                },
                {
                    id: 'brain-kids-18',
                    title: 'Game Story',
                    description: 'Learn to balance games and study time',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-kids-18'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/game-story',
                    index: 17
                },
                {
                    id: 'brain-kids-19',
                    title: 'Reflex Quick Attention',
                    description: 'Test your quick attention reflexes',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-kids-19'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/reflex-quick-attention',
                    index: 18
                },
                {
                    id: 'brain-kids-20',
                    title: 'Badge: Focus Kid',
                    description: 'Earn your badge for completing focus challenges',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 0,
                    xp: 20,
                    completed: gameCompletionStatus['brain-kids-20'] || false,
                    isSpecial: true,
                    path: '/student/brain/kids/badge-focus-kid',
                    index: 19
                }
            ];
            
            // Add our real brain games
            games.push(...realBrainGames);
        } else if (category === 'brain-health' && ageGroup === 'teens') {
            // Add our 20 real brain health games for teens
            const realTeenBrainGames = [
                {
                    id: 'brain-teens-1',
                    title: 'Exercise Story',
                    description: 'Learn how daily exercise benefits brain health',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-teens-1'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/exercise-story',
                    index: 0
                },
                {
                    id: 'brain-teens-2',
                    title: 'Quiz on Habits',
                    description: 'Test your knowledge of brain-healthy habits',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-teens-2'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/quiz-on-habits',
                    index: 1
                },
                {
                    id: 'brain-teens-3',
                    title: 'Reflex Mind Check',
                    description: 'Tap quickly for mind-boosting actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-teens-3'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/reflex-mind-check',
                    index: 2
                },
                {
                    id: 'brain-teens-4',
                    title: 'Puzzle: Brain Fuel',
                    description: 'Match brain fuels with their sources or benefits',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-teens-4'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/puzzle-brain-fuel',
                    index: 3
                },
                {
                    id: 'brain-teens-5',
                    title: 'Junk Food Story',
                    description: 'Learn how junk food affects brain function',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-teens-5'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/junk-food-story',
                    index: 4
                },
                {
                    id: 'brain-teens-6',
                    title: 'Debate: Brain vs Body',
                    description: 'Participate in a debate on brain vs body health',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7 min',
                    coins: 10,
                    xp: 15,
                    completed: gameCompletionStatus['brain-teens-6'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/debate-brain-vs-body',
                    index: 5
                },
                {
                    id: 'brain-teens-7',
                    title: 'Journal of Brain Fitness',
                    description: 'Reflect on daily brain fitness habits',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-teens-7'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/journal-of-brain-fitness',
                    index: 6
                },
                {
                    id: 'brain-teens-8',
                    title: 'Simulation: Daily Routine',
                    description: 'Choose the best daily routine for brain health',
                    icon: <BarChart4 className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['brain-teens-8'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/simulation-daily-routine',
                    index: 7
                },
                {
                    id: 'brain-teens-9',
                    title: 'Reflex Brain Boost',
                    description: 'Tap for brain-boosting foods, avoid harmful ones',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-teens-9'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/reflex-brain-boost',
                    index: 8
                },
                {
                    id: 'brain-teens-10',
                    title: 'Badge: Brain Health Hero',
                    description: 'Earn your badge for completing brain health practices',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 0,
                    xp: 20,
                    completed: gameCompletionStatus['brain-teens-10'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/badge-brain-health-hero',
                    index: 9
                },
                {
                    id: 'brain-teens-11',
                    title: 'Exam Story',
                    description: 'Learn how distractions affect exam performance',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-teens-11'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/exam-story',
                    index: 10
                },
                {
                    id: 'brain-teens-12',
                    title: 'Quiz on Attention',
                    description: 'Test your knowledge of attention boosters',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-teens-12'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/quiz-on-attention',
                    index: 11
                },
                {
                    id: 'brain-teens-13',
                    title: 'Reflex Concentration',
                    description: 'Practice concentration-boosting actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-teens-13'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/reflex-concentration',
                    index: 12
                },
                {
                    id: 'brain-teens-14',
                    title: 'Puzzle of Distractions',
                    description: 'Match environments with their effects on focus',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-teens-14'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/puzzle-of-distractions',
                    index: 13
                },
                {
                    id: 'brain-teens-15',
                    title: 'Social Media Story',
                    description: 'Learn how social media affects focus',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-teens-15'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/social-media-story',
                    index: 14
                },
                {
                    id: 'brain-teens-16',
                    title: 'Debate: Multitask vs Focus',
                    description: 'Debate the effectiveness of multitasking',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7 min',
                    coins: 10,
                    xp: 15,
                    completed: gameCompletionStatus['brain-teens-16'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/debate-multitask-vs-focus',
                    index: 15
                },
                {
                    id: 'brain-teens-17',
                    title: 'Journal of Attention',
                    description: 'Reflect on attention strategies',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['brain-teens-17'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/journal-of-attention',
                    index: 16
                },
                {
                    id: 'brain-teens-18',
                    title: 'Simulation: Study Plan',
                    description: 'Choose the best study environment',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['brain-teens-18'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/simulation-study-plan',
                    index: 17
                },
                {
                    id: 'brain-teens-19',
                    title: 'Reflex Distraction Alert',
                    description: 'Practice focus-boosting actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['brain-teens-19'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/reflex-distraction-alert',
                    index: 18
                },
                {
                    id: 'brain-teens-20',
                    title: 'Badge: Focus Hero',
                    description: 'Earn your badge for conquering distraction challenges',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 0,
                    xp: 20,
                    completed: gameCompletionStatus['brain-teens-20'] || false,
                    isSpecial: true,
                    path: '/student/brain/teen/badge-focus-hero',
                    index: 19
                }
            ];
            
            // Add our real teen brain games
            games.push(...realTeenBrainGames);
        } else if (category === 'uvls' && ageGroup === 'kids') {
            // Add our 10 real UVLS Kids games
            const realUVLSGames = [
                {
                    id: 'uvls-kids-1',
                    title: 'Share Your Toy',
                    description: 'Practice simple sharing in play',
                    icon: <HandHeart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-1'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/share-your-toy',
                    index: 0
                },
                {
                    id: 'uvls-kids-2',
                    title: 'Feelings Quiz',
                    description: 'Recognize caregiving actions',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-kids-2'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/feelings-quiz',
                    index: 1
                },
                {
                    id: 'uvls-kids-3',
                    title: 'Kind Reflex',
                    description: 'Rapidly identify kind vs mean actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-kids-3'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/kind-reflex',
                    index: 2
                },
                {
                    id: 'uvls-kids-4',
                    title: 'Match Faces',
                    description: 'Link facial expressions to feelings',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-4'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/match-faces',
                    index: 3
                },
                {
                    id: 'uvls-kids-5',
                    title: 'Spot Help',
                    description: 'Notice peers who need help',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-5'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/spot-help',
                    index: 4
                },
                {
                    id: 'uvls-kids-6',
                    title: 'Kind Poster',
                    description: 'Express compassion visually',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '10-12 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['uvls-kids-6'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/kind-poster',
                    index: 5
                },
                {
                    id: 'uvls-kids-7',
                    title: 'Mini Journal',
                    description: 'Put helping into words (very short)',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-7'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/mini-journal',
                    index: 6
                },
                {
                    id: 'uvls-kids-8',
                    title: 'Comfort Roleplay',
                    description: 'Choose kind phrases to comfort a sad peer',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-8'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/comfort-roleplay',
                    index: 7
                },
                {
                    id: 'uvls-kids-9',
                    title: 'Share Reflex',
                    description: 'Reinforce sharing cue recognition',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-kids-9'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/share-reflex',
                    index: 8
                },
                {
                    id: 'uvls-kids-10',
                    title: 'Little Empath Badge',
                    description: 'Encourage consistent small acts of empathy',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: 'Cumulative',
                    coins: 3,
                    xp: 20,
                    completed: gameCompletionStatus['uvls-kids-10'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/little-empath-badge',
                    index: 9
                },
                {
                    id: 'uvls-kids-11',
                    title: 'Greet the New Kid',
                    description: 'Model welcoming behaviour',
                    icon: <HandHeart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-11'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/greet-the-new-kid',
                    index: 10
                },
                {
                    id: 'uvls-kids-12',
                    title: 'Polite Words Quiz',
                    description: 'Identify polite language',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-kids-12'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/polite-words-quiz',
                    index: 11
                },
                {
                    id: 'uvls-kids-13',
                    title: 'Respect Tap',
                    description: 'Spot respectful actions quickly',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-kids-13'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/respect-tap',
                    index: 12
                },
                {
                    id: 'uvls-kids-14',
                    title: 'Inclusion Match',
                    description: 'Link inclusive acts to positive outcomes',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-14'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/inclusion-match',
                    index: 13
                },
                {
                    id: 'uvls-kids-15',
                    title: 'Invite to Play',
                    description: 'Practice inviting someone to join',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-15'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/invite-to-play',
                    index: 14
                },
                {
                    id: 'uvls-kids-16',
                    title: 'Inclusion Poster',
                    description: 'Visualize "everyone belongs"',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '10-12 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['uvls-kids-16'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/inclusion-poster',
                    index: 15
                },
                {
                    id: 'uvls-kids-17',
                    title: 'Inclusion Journal',
                    description: 'Reflect on an inclusion act (one line)',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-17'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/inclusion-journal',
                    index: 16
                },
                {
                    id: 'uvls-kids-18',
                    title: 'Invite Roleplay',
                    description: 'Choose inviting phrases to include shy students',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-kids-18'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/invite-roleplay',
                    index: 17
                },
                {
                    id: 'uvls-kids-19',
                    title: 'Respect Signals',
                    description: 'Recognize respect signals (eye contact, listening)',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '3-4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-kids-19'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/respect-signals',
                    index: 18
                },
                {
                    id: 'uvls-kids-20',
                    title: 'Inclusive Kid Badge',
                    description: 'Reinforce repeated inclusive actions',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: 'Cumulative',
                    coins: 3,
                    xp: 20,
                    completed: gameCompletionStatus['uvls-kids-20'] || false,
                    isSpecial: true,
                    path: '/student/uvls/kids/inclusive-kid-badge',
                    index: 19
                }
            ];
            
            // Add our real UVLS games
            games.push(...realUVLSGames);
        } else if (category === 'uvls' && ageGroup === 'teens') {
            // Add our 20 real UVLS Teen games
            const realUVLSTeenGames = [
                {
                    id: 'uvls-teen-1',
                    title: 'Listen Deep',
                    description: 'Respond supportively to a peer sharing a personal problem',
                    icon: <HandHeart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-teen-1'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/listen-deep',
                    index: 0
                },
                {
                    id: 'uvls-teen-2',
                    title: 'Empathy Quiz',
                    description: 'Distinguish empathy vs sympathy in scenarios',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-teen-2'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/empathy-quiz',
                    index: 1
                },
                {
                    id: 'uvls-teen-3',
                    title: 'Perspective Puzzle',
                    description: 'Map responses to how they help others',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-teen-3'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/perspective-puzzle',
                    index: 2
                },
                {
                    id: 'uvls-teen-4',
                    title: 'Walk in Shoes Simulation',
                    description: 'Experience choices as a marginalized student',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8-10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['uvls-teen-4'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/walk-in-shoes',
                    index: 3
                },
                {
                    id: 'uvls-teen-5',
                    title: 'Empathy Debate',
                    description: 'Argue for school empathy curriculum',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '20-30 min',
                    coins: 5,
                    xp: 20,
                    completed: gameCompletionStatus['uvls-teen-5'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/empathy-debate',
                    index: 4
                },
                {
                    id: 'uvls-teen-6',
                    title: 'Reflective Journal',
                    description: 'Write reflecting on understanding someone different',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '10-12 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-teen-6'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/reflective-journal',
                    index: 5
                },
                {
                    id: 'uvls-teen-7',
                    title: 'Peer Support Roleplay',
                    description: 'Practice a peer-support conversation',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['uvls-teen-7'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/peer-support-roleplay',
                    index: 6
                },
                {
                    id: 'uvls-teen-8',
                    title: 'Case-Response Puzzle',
                    description: 'Choose best empathetic responses in a multi-part case',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-teen-8'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/case-response-puzzle',
                    index: 7
                },
                {
                    id: 'uvls-teen-9',
                    title: 'Spot Distress Reflex',
                    description: 'Rapidly detect subtle distress cues',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '3-5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-teen-9'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/spot-distress-reflex',
                    index: 8
                },
                {
                    id: 'uvls-teen-10',
                    title: 'Empathy Champion Badge',
                    description: 'Complete 5 teen empathy tasks',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: 'Cumulative',
                    coins: 3,
                    xp: 20,
                    completed: gameCompletionStatus['uvls-teen-10'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/empathy-champion-badge',
                    index: 9
                },
                {
                    id: 'uvls-teen-11',
                    title: 'Cultural Greeting',
                    description: 'Choose respectful greeting for different cultural contexts',
                    icon: <HandHeart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-teen-11'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/cultural-greeting',
                    index: 10
                },
                {
                    id: 'uvls-teen-12',
                    title: 'Inclusion Quiz',
                    description: 'Identify inclusive school actions/policies',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-teen-12'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/inclusion-quiz',
                    index: 11
                },
                {
                    id: 'uvls-teen-13',
                    title: 'Accessibility Puzzle',
                    description: 'Match accommodations to student needs',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-teen-13'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/accessibility-puzzle',
                    index: 12
                },
                {
                    id: 'uvls-teen-14',
                    title: 'Inclusive Class Simulation',
                    description: 'Design an activity that allows participation for all',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '10-12 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['uvls-teen-14'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/inclusive-class-simulation',
                    index: 13
                },
                {
                    id: 'uvls-teen-15',
                    title: 'Respect Debate',
                    description: 'Debate whether respect equals agreement',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '20 min',
                    coins: 5,
                    xp: 20,
                    completed: gameCompletionStatus['uvls-teen-15'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/respect-debate',
                    index: 14
                },
                {
                    id: 'uvls-teen-16',
                    title: 'Inclusion Journal',
                    description: 'Describe when you challenged exclusion & outcome',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '10 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['uvls-teen-16'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/inclusion-journal',
                    index: 15
                },
                {
                    id: 'uvls-teen-17',
                    title: 'Correcting Bias Roleplay',
                    description: 'Practice calling out bias respectfully',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8-10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['uvls-teen-17'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/correcting-bias-roleplay',
                    index: 16
                },
                {
                    id: 'uvls-teen-18',
                    title: 'Name Respect Reflex',
                    description: 'Identify correct pronunciation & respond respectfully',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['uvls-teen-18'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/name-respect-reflex',
                    index: 17
                },
                {
                    id: 'uvls-teen-19',
                    title: 'Policy Case Puzzle',
                    description: 'Recommend inclusive policy actions for a school case',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['uvls-teen-19'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/policy-case-puzzle',
                    index: 18
                },
                {
                    id: 'uvls-teen-20',
                    title: 'Respect Leader Badge',
                    description: 'Complete 5 inclusion leadership tasks',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: 'Variable',
                    coins: 3,
                    xp: 25,
                    completed: gameCompletionStatus['uvls-teen-20'] || false,
                    isSpecial: true,
                    path: '/student/uvls/teen/respect-leader-badge',
                    index: 19
                }
            ];
            
            // Add our real UVLS Teen games
            games.push(...realUVLSTeenGames);
        } else if (category === 'digital-citizenship' && ageGroup === 'kids') {
            // Add our 20 real DCOS Kids games
            const realDCOSKidsGames = [
                {
                    id: 'dcos-kids-1',
                    title: 'Strong Password Reflex',
                    description: 'Choose between weak and strong passwords',
                    icon: <Lock className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['dcos-kids-1'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/strong-password-reflex',
                    index: 0
                },
                {
                    id: 'dcos-kids-2',
                    title: 'Stranger Chat Story',
                    description: 'Learn not to share personal info online',
                    icon: <Shield className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-5 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-kids-2'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/stranger-chat-story',
                    index: 1
                },
                {
                    id: 'dcos-kids-3',
                    title: 'Photo Share Quiz',
                    description: 'Should you post personal photos online?',
                    icon: <Camera className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-4 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['dcos-kids-3'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/photo-share-quiz',
                    index: 2
                },
                {
                    id: 'dcos-kids-4',
                    title: 'Personal Info Puzzle',
                    description: 'Match items to Private or Okay to Share',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-6 min',
                    coins: 3,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-kids-4'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/personal-info-puzzle',
                    index: 3
                },
                {
                    id: 'dcos-kids-5',
                    title: 'Game Invite Reflex',
                    description: 'Accept from friends, decline from strangers',
                    icon: <Gamepad2 className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-4 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-kids-5'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/game-invite-reflex',
                    index: 4
                },
                {
                    id: 'dcos-kids-6',
                    title: 'Safety Poster Task',
                    description: 'Create a safety message poster',
                    icon: <Palette className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-kids-6'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/safety-poster',
                    index: 5
                },
                {
                    id: 'dcos-kids-7',
                    title: 'Family Rules Story',
                    description: 'Follow family device rules',
                    icon: <Home className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-kids-7'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/family-rules-story',
                    index: 6
                },
                {
                    id: 'dcos-kids-8',
                    title: 'Device Sharing Quiz',
                    description: 'Is it safe to share your device with strangers?',
                    icon: <Smartphone className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['dcos-kids-8'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/device-sharing-quiz',
                    index: 7
                },
                {
                    id: 'dcos-kids-9',
                    title: 'Online Friend Reflex',
                    description: 'Never meet someone you only know online',
                    icon: <UserX className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-kids-9'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/online-friend-reflex',
                    index: 8
                },
                {
                    id: 'dcos-kids-10',
                    title: 'Safe User Badge',
                    description: 'Complete 5 safety habits to earn badge',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-8 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['dcos-kids-10'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/safe-user-badge',
                    index: 9
                },
                {
                    id: 'dcos-kids-11',
                    title: 'Spot the Bully Quiz',
                    description: 'Identify bullying behavior',
                    icon: <Eye className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['dcos-kids-11'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/spot-bully-quiz',
                    index: 10
                },
                {
                    id: 'dcos-kids-12',
                    title: 'Kind Words Reflex',
                    description: 'Tap kind words, avoid rude ones',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['dcos-kids-12'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/kind-words-reflex',
                    index: 11
                },
                {
                    id: 'dcos-kids-13',
                    title: 'Smile Story',
                    description: 'Choose to be kind to others',
                    icon: <Smile className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-kids-13'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/smile-story',
                    index: 12
                },
                {
                    id: 'dcos-kids-14',
                    title: 'Gossip Puzzle',
                    description: 'Connect gossip to hurt feelings',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-6 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-kids-14'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/gossip-puzzle',
                    index: 13
                },
                {
                    id: 'dcos-kids-15',
                    title: 'Playground Bystander',
                    description: 'Help a child being bullied',
                    icon: <HandHeart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-kids-15'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/playground-bystander',
                    index: 14
                },
                {
                    id: 'dcos-kids-16',
                    title: 'Cyberbully Report',
                    description: 'Report mean comments to adults',
                    icon: <Flag className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-kids-16'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/cyberbully-report',
                    index: 15
                },
                {
                    id: 'dcos-kids-17',
                    title: 'Role Swap Simulation',
                    description: 'Experience how bullying feels',
                    icon: <RefreshCw className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '8-10 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['dcos-kids-17'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/role-swap',
                    index: 16
                },
                {
                    id: 'dcos-kids-18',
                    title: 'Journal of Kindness',
                    description: 'Write about your kind act',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-kids-18'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/kindness-journal',
                    index: 17
                },
                {
                    id: 'dcos-kids-19',
                    title: 'Friendship Reflex',
                    description: 'Stand with your friend when needed',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-5 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-kids-19'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/friendship-reflex',
                    index: 18
                },
                {
                    id: 'dcos-kids-20',
                    title: 'Kind Friend Badge',
                    description: 'Complete 5 kindness acts to earn badge',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-8 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['dcos-kids-20'] || false,
                    isSpecial: true,
                    path: '/student/dcos/kids/kind-friend-badge',
                    index: 19
                }
            ];
            
            // Add our real DCOS Kids games
            games.push(...realDCOSKidsGames);
        } else if (category === 'digital-citizenship' && ageGroup === 'teens') {
            // Add our 20 real DCOS Teen games
            const realDCOSTeenGames = [
                {
                    id: 'dcos-teen-1',
                    title: 'Password Sharing Story',
                    description: 'Never share your password with anyone',
                    icon: <Lock className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-teen-1'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/password-sharing-story',
                    index: 0
                },
                {
                    id: 'dcos-teen-2',
                    title: 'Privacy Settings Quiz',
                    description: 'Should profiles be public or private?',
                    icon: <Shield className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-teen-2'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/privacy-settings-quiz',
                    index: 1
                },
                {
                    id: 'dcos-teen-3',
                    title: 'OTP Fraud Reflex',
                    description: 'Detect and block OTP scams',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-teen-3'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/otp-fraud-reflex',
                    index: 2
                },
                {
                    id: 'dcos-teen-4',
                    title: 'Profile Picture Simulation',
                    description: 'Choose safe profile picture - cartoon vs photo',
                    icon: <Camera className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-teen-4'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/profile-picture-simulation',
                    index: 3
                },
                {
                    id: 'dcos-teen-5',
                    title: 'Social Media Journal',
                    description: 'What info is okay to share online?',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-teen-5'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/social-media-journal',
                    index: 4
                },
                {
                    id: 'dcos-teen-6',
                    title: 'Data Consent Quiz',
                    description: 'App permissions - what is safe to allow?',
                    icon: <Smartphone className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-teen-6'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/data-consent-quiz',
                    index: 5
                },
                {
                    id: 'dcos-teen-7',
                    title: 'Fake Friend Story',
                    description: 'Stranger claims to know your friend',
                    icon: <UserX className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-teen-7'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/fake-friend-story',
                    index: 6
                },
                {
                    id: 'dcos-teen-8',
                    title: 'Safety Reflex',
                    description: 'Detect and report scam ads',
                    icon: <Eye className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-teen-8'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/safety-reflex',
                    index: 7
                },
                {
                    id: 'dcos-teen-9',
                    title: 'Debate: Online Friends',
                    description: 'Is it safe to meet online friends in real life?',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '15-20 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['dcos-teen-9'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/debate-stage-online-friends',
                    index: 8
                },
                {
                    id: 'dcos-teen-10',
                    title: 'Online Safety Badge',
                    description: 'Complete 5 teen safety acts',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['dcos-teen-10'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/online-safety-badge',
                    index: 9
                },
                {
                    id: 'dcos-teen-11',
                    title: 'Cyberbully Reflex',
                    description: 'Block and report hurtful comments',
                    icon: <Shield className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-teen-11'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/cyberbully-reflex',
                    index: 10
                },
                {
                    id: 'dcos-teen-12',
                    title: 'Peer Pressure Story',
                    description: 'Friends want you to join trolling',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-teen-12'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/peer-pressure-story',
                    index: 11
                },
                {
                    id: 'dcos-teen-13',
                    title: 'Gossip Chain Simulation',
                    description: 'Rumor spreads across 3 chats - stop it',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['dcos-teen-13'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/gossip-chain-simulation',
                    index: 12
                },
                {
                    id: 'dcos-teen-14',
                    title: 'Debate: Trolling',
                    description: 'Is trolling funny? Build your argument',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '15-20 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['dcos-teen-14'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/debate-stage-trolling',
                    index: 13
                },
                {
                    id: 'dcos-teen-15',
                    title: 'Diversity Quiz',
                    description: 'Defend friend mocked for their accent',
                    icon: <Globe className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-teen-15'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/diversity-quiz',
                    index: 14
                },
                {
                    id: 'dcos-teen-16',
                    title: 'Encourage Roleplay',
                    description: 'Classmate cyberbullied - encourage & report',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['dcos-teen-16'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/encourage-roleplay',
                    index: 15
                },
                {
                    id: 'dcos-teen-17',
                    title: 'Empathy Journal',
                    description: 'How would I feel if trolled?',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-teen-17'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/empathy-journal',
                    index: 16
                },
                {
                    id: 'dcos-teen-18',
                    title: 'Anti-Bully Reflex',
                    description: 'Stand up when troll messages flash',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['dcos-teen-18'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/anti-bully-reflex',
                    index: 17
                },
                {
                    id: 'dcos-teen-19',
                    title: 'Upstander Simulation',
                    description: 'Group trolling victim - defend them',
                    icon: <HandHeart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 12,
                    completed: gameCompletionStatus['dcos-teen-19'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/upstander-simulation',
                    index: 18
                },
                {
                    id: 'dcos-teen-20',
                    title: 'Courage Badge',
                    description: 'Complete 5 anti-bullying acts',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['dcos-teen-20'] || false,
                    isSpecial: true,
                    path: '/student/dcos/teen/courage-badge',
                    index: 19
                }
            ];
            
            // Add our real DCOS Teen games
            games.push(...realDCOSTeenGames);
        } else if (category === 'moral-values' && ageGroup === 'kids') {
            // Add our 20 real Moral Values Kids games
            const realMoralKidsGames = [
                {
                    id: 'moral-kids-1',
                    title: 'Lost Pencil Story',
                    description: 'Return what you find',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-1'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/lost-pencil-story',
                    index: 0
                },
                {
                    id: 'moral-kids-2',
                    title: 'Homework Quiz',
                    description: 'Lying about homework - is it honest?',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['moral-kids-2'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/homework-quiz',
                    index: 1
                },
                {
                    id: 'moral-kids-3',
                    title: 'Truth Reflex',
                    description: 'Tap truth or lie words',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-4 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-kids-3'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/truth-reflex',
                    index: 2
                },
                {
                    id: 'moral-kids-4',
                    title: 'Puzzle of Trust',
                    description: 'Match Truth to Trust, Lie to Trouble',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-6 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-4'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/puzzle-of-trust',
                    index: 3
                },
                {
                    id: 'moral-kids-5',
                    title: 'Cheating Story',
                    description: 'Friend wants you to cheat',
                    icon: <Shield className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-5'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/cheating-story',
                    index: 4
                },
                {
                    id: 'moral-kids-6',
                    title: 'Poster of Honesty',
                    description: 'Create honesty is best poster',
                    icon: <Palette className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-kids-6'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/poster-of-honesty',
                    index: 5
                },
                {
                    id: 'moral-kids-7',
                    title: 'Journal of Truth',
                    description: 'Write about telling the truth',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-7'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/journal-of-truth',
                    index: 6
                },
                {
                    id: 'moral-kids-8',
                    title: 'Candy Shop Story',
                    description: 'Return extra candy to shopkeeper',
                    icon: <ShoppingCart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-8'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/candy-shop-story',
                    index: 7
                },
                {
                    id: 'moral-kids-9',
                    title: 'Reflex Quick Choice',
                    description: 'Fast truth or lie tapping',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-4 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-kids-9'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/reflex-quick-choice',
                    index: 8
                },
                {
                    id: 'moral-kids-10',
                    title: 'Badge: Truthful Kid',
                    description: 'Complete 5 honesty acts',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-8 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['moral-kids-10'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/badge-truthful-kid',
                    index: 9
                },
                {
                    id: 'moral-kids-11',
                    title: 'Respect Elders Story',
                    description: 'Help grandpa right away',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-11'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/respect-elders-story',
                    index: 10
                },
                {
                    id: 'moral-kids-12',
                    title: 'Polite Words Quiz',
                    description: 'Identify polite language',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-5 min',
                    coins: 3,
                    xp: 8,
                    completed: gameCompletionStatus['moral-kids-12'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/polite-words-quiz',
                    index: 11
                },
                {
                    id: 'moral-kids-13',
                    title: 'Reflex Respect',
                    description: 'Tap kind or rude words',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-4 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-kids-13'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/reflex-respect',
                    index: 12
                },
                {
                    id: 'moral-kids-14',
                    title: 'Puzzle: Respect Match',
                    description: 'Listen = Respect, Mock = Hurt',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-6 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-14'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/puzzle-respect-match',
                    index: 13
                },
                {
                    id: 'moral-kids-15',
                    title: 'Teacher Greeting Story',
                    description: 'Greet teacher when they enter',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-15'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/teacher-greeting-story',
                    index: 14
                },
                {
                    id: 'moral-kids-16',
                    title: 'Gratitude Poster',
                    description: 'Create a thank you poster',
                    icon: <Palette className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-kids-16'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/gratitude-poster',
                    index: 15
                },
                {
                    id: 'moral-kids-17',
                    title: 'Journal of Gratitude',
                    description: 'Today I thanked ___ for ___',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-17'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/journal-of-gratitude',
                    index: 16
                },
                {
                    id: 'moral-kids-18',
                    title: 'Playground Respect Story',
                    description: 'Include smaller child in game',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-kids-18'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/playground-respect-story',
                    index: 17
                },
                {
                    id: 'moral-kids-19',
                    title: 'Reflex Help',
                    description: 'Tap help when needed',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-5 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-kids-19'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/reflex-help',
                    index: 18
                },
                {
                    id: 'moral-kids-20',
                    title: 'Badge: Respect Kid',
                    description: 'Complete 5 respect actions',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['moral-kids-20'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/kids/badge-respect-kid',
                    index: 19
                }
            ];
            
            // Add our real Moral Values Kids games
            games.push(...realMoralKidsGames);
        } else if (category === 'moral-values' && ageGroup === 'teens') {
            // Add our 20 real Moral Values Teen games
            const realMoralTeenGames = [
                {
                    id: 'moral-teen-1',
                    title: "Friend's Lie Story",
                    description: 'Refuse to lie for friend',
                    icon: <Shield className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-teen-1'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/friend-lie-story',
                    index: 0
                },
                {
                    id: 'moral-teen-2',
                    title: 'White Lie Quiz',
                    description: 'Can small lies be harmless?',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-teen-2'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/white-lie-quiz',
                    index: 1
                },
                {
                    id: 'moral-teen-3',
                    title: 'Reflex: Spot Fake',
                    description: 'Identify fake news quickly',
                    icon: <Eye className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-teen-3'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/reflex-spot-fake',
                    index: 2
                },
                {
                    id: 'moral-teen-4',
                    title: 'Puzzle of Integrity',
                    description: 'Integrity = Doing right when unseen',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-teen-4'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/puzzle-of-integrity',
                    index: 3
                },
                {
                    id: 'moral-teen-5',
                    title: 'Bribe Simulation',
                    description: 'Refuse bribe and report it',
                    icon: <Shield className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '7-9 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['moral-teen-5'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/bribe-simulation',
                    index: 4
                },
                {
                    id: 'moral-teen-6',
                    title: 'Debate: Lying for Friend',
                    description: 'Is lying okay to protect a friend?',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '15-20 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['moral-teen-6'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/debate-lying-for-friend',
                    index: 5
                },
                {
                    id: 'moral-teen-7',
                    title: 'Integrity Journal',
                    description: 'Write about telling a hard truth',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-teen-7'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/integrity-journal',
                    index: 6
                },
                {
                    id: 'moral-teen-8',
                    title: 'Exam Cheating Story',
                    description: 'Resist temptation to cheat',
                    icon: <GraduationCap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-teen-8'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/exam-cheating-story',
                    index: 7
                },
                {
                    id: 'moral-teen-9',
                    title: 'Roleplay: Truthful Leader',
                    description: 'Lead group with honesty',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['moral-teen-9'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/roleplay-truthful-leader',
                    index: 8
                },
                {
                    id: 'moral-teen-10',
                    title: 'Badge: Integrity Hero',
                    description: 'Complete 5 integrity dilemmas',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['moral-teen-10'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/badge-integrity-hero',
                    index: 9
                },
                {
                    id: 'moral-teen-11',
                    title: 'Debate: Obey or Question',
                    description: 'Respect vs blind obedience',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '15-20 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['moral-teen-11'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/debate-obey-or-question',
                    index: 10
                },
                {
                    id: 'moral-teen-12',
                    title: 'Gratitude Story',
                    description: 'Thank friend for sharing notes',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-teen-12'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/gratitude-story',
                    index: 11
                },
                {
                    id: 'moral-teen-13',
                    title: 'Reflex: Politeness',
                    description: 'Tap polite vs rude phrases',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-teen-13'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/reflex-politeness',
                    index: 12
                },
                {
                    id: 'moral-teen-14',
                    title: 'Puzzle of Gratitude',
                    description: 'Thanks → Smile, Ignore → Hurt',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-teen-14'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/puzzle-of-gratitude',
                    index: 13
                },
                {
                    id: 'moral-teen-15',
                    title: 'Service Story',
                    description: 'Return dropped money to conductor',
                    icon: <Coins className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-teen-15'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/service-story',
                    index: 14
                },
                {
                    id: 'moral-teen-16',
                    title: 'Respect Journal',
                    description: 'This week I showed respect by...',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['moral-teen-16'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/respect-journal',
                    index: 15
                },
                {
                    id: 'moral-teen-17',
                    title: 'Debate: Respect Teachers',
                    description: 'Argue rudely with teachers?',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '15-20 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['moral-teen-17'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/debate-respect-teachers',
                    index: 16
                },
                {
                    id: 'moral-teen-18',
                    title: 'Roleplay: Respect Leader',
                    description: 'Lead by listening to everyone',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['moral-teen-18'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/roleplay-respect-leader',
                    index: 17
                },
                {
                    id: 'moral-teen-19',
                    title: 'Reflex: Gratitude',
                    description: 'Spot thank you vs rude emojis',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['moral-teen-19'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/reflex-gratitude',
                    index: 18
                },
                {
                    id: 'moral-teen-20',
                    title: 'Badge: Gratitude Hero',
                    description: 'Complete 5 gratitude acts',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['moral-teen-20'] || false,
                    isSpecial: true,
                    path: '/student/moral-values/teen/badge-gratitude-hero',
                    index: 19
                }
            ];
            
            // Add our real Moral Values Teen games
            games.push(...realMoralTeenGames);
        } else if (category === 'ai-for-all' && ageGroup === 'kids') {
            // Add our 20 real AI For All Kids games
            const realAIKidsGames = [
                {
                    id: 'ai-kids-1',
                    title: 'Spot the Pattern',
                    description: 'Find what comes next in the pattern',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ai-kids-1'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/spot-the-pattern',
                    index: 0
                },
                {
                    id: 'ai-kids-2',
                    title: 'Cat or Dog Game',
                    description: 'Sort images into cat or dog',
                    icon: <Eye className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-kids-2'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/cat-or-dog-game',
                    index: 1
                },
                {
                    id: 'ai-kids-3',
                    title: 'Sorting Colors',
                    description: 'Drag objects to correct color boxes',
                    icon: <Palette className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-kids-3'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/sorting-colors',
                    index: 2
                },
                {
                    id: 'ai-kids-4',
                    title: 'True or False AI Quiz',
                    description: 'AI means Artificial Intelligence?',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '3-5 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-kids-4'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/true-false-ai-quiz',
                    index: 3
                },
                {
                    id: 'ai-kids-5',
                    title: 'Emoji Classifier',
                    description: 'Sort emojis into happy or sad buckets',
                    icon: <Smile className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-kids-5'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/emoji-classifier',
                    index: 4
                },
                {
                    id: 'ai-kids-6',
                    title: 'Self-Driving Car Game',
                    description: 'Help AI car respond to traffic lights',
                    icon: <Cpu className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ai-kids-6'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/self-driving-car',
                    index: 5
                },
                {
                    id: 'ai-kids-7',
                    title: 'Pattern Finder Puzzle',
                    description: 'Find missing numbers in sequences',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ai-kids-7'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/pattern-finder-puzzle',
                    index: 6
                },
                {
                    id: 'ai-kids-8',
                    title: 'Robot Helper Story',
                    description: 'Learn to appreciate AI helpers',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-kids-8'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/robot-helper-story',
                    index: 7
                },
                {
                    id: 'ai-kids-9',
                    title: 'Spam vs Not Spam',
                    description: 'Filter emails like AI does',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-kids-9'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/spam-vs-not-spam',
                    index: 8
                },
                {
                    id: 'ai-kids-10',
                    title: 'Siri/Alexa Quiz',
                    description: 'Learn about AI assistants',
                    icon: <Cpu className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-kids-10'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/siri-alexa-quiz',
                    index: 9
                },
                {
                    id: 'ai-kids-11',
                    title: 'AI in Games',
                    description: 'Who controls video game enemies?',
                    icon: <Gamepad2 className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-kids-11'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/ai-in-games',
                    index: 10
                },
                {
                    id: 'ai-kids-12',
                    title: 'Match AI Tools',
                    description: 'Identify which tools use AI',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ai-kids-12'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/match-ai-tools',
                    index: 11
                },
                {
                    id: 'ai-kids-13',
                    title: 'Pattern Music Game',
                    description: 'Repeat rhythm patterns',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ai-kids-13'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/pattern-music-game',
                    index: 12
                },
                {
                    id: 'ai-kids-14',
                    title: 'Robot Vision Game',
                    description: 'Help robot see apple vs banana',
                    icon: <Eye className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-kids-14'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/robot-vision-game',
                    index: 13
                },
                {
                    id: 'ai-kids-15',
                    title: 'Smart Home Story',
                    description: 'How AI controls smart homes',
                    icon: <Home className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-kids-15'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/smart-home-story',
                    index: 14
                },
                {
                    id: 'ai-kids-16',
                    title: 'Train the Robot',
                    description: 'Teach robot what food is',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-kids-16'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/train-the-robot',
                    index: 15
                },
                {
                    id: 'ai-kids-17',
                    title: 'Prediction Puzzle',
                    description: 'Predict what comes next',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ai-kids-17'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/prediction-puzzle',
                    index: 16
                },
                {
                    id: 'ai-kids-18',
                    title: 'Friendly AI Quiz',
                    description: 'Should AI help people?',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-kids-18'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/friendly-ai-quiz',
                    index: 17
                },
                {
                    id: 'ai-kids-19',
                    title: 'Robot Emotion Story',
                    description: 'Show empathy with AI',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-kids-19'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/robot-emotion-story',
                    index: 18
                },
                {
                    id: 'ai-kids-20',
                    title: 'Recommendation Game',
                    description: 'How AI recommends content',
                    icon: <Star className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ai-kids-20'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/kids/recommendation-game',
                    index: 19
                }
            ];
            
            // Add our real AI For All Kids games
            games.push(...realAIKidsGames);
        } else if (category === 'ai-for-all' && ageGroup === 'teens') {
            // Add our 20 real AI For All Teen games
            const realAITeenGames = [
                {
                    id: 'ai-teen-1',
                    title: 'What is AI? Quiz',
                    description: 'Define what AI stands for',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-teen-1'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/what-is-ai-quiz',
                    index: 0
                },
                {
                    id: 'ai-teen-2',
                    title: 'Pattern Prediction Puzzle',
                    description: 'Predict the next number in sequences',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ai-teen-2'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/pattern-prediction-puzzle',
                    index: 1
                },
                {
                    id: 'ai-teen-3',
                    title: 'Image Classifier Game',
                    description: 'Sort images into categories',
                    icon: <Eye className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-teen-3'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/image-classifier-game',
                    index: 2
                },
                {
                    id: 'ai-teen-4',
                    title: 'Human vs AI Quiz',
                    description: 'Is Google Translate powered by AI?',
                    icon: <Cpu className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-teen-4'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/human-vs-ai-quiz',
                    index: 3
                },
                {
                    id: 'ai-teen-5',
                    title: 'Predict the Next Word',
                    description: 'Complete sentences like GPT does',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ai-teen-5'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/predict-next-word',
                    index: 4
                },
                {
                    id: 'ai-teen-6',
                    title: 'Self-Driving Car Reflex',
                    description: 'React fast to traffic lights',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ai-teen-6'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/self-driving-car-reflex',
                    index: 5
                },
                {
                    id: 'ai-teen-7',
                    title: 'Sorting Emotions Game',
                    description: 'Classify emotions from emojis',
                    icon: <Smile className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-teen-7'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/sorting-emotions-game',
                    index: 6
                },
                {
                    id: 'ai-teen-8',
                    title: 'True or False AI Quiz',
                    description: 'Is a calculator AI?',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-teen-8'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/true-false-ai-quiz',
                    index: 7
                },
                {
                    id: 'ai-teen-9',
                    title: 'Chatbot Simulation',
                    description: 'Have a conversation with an AI bot',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ai-teen-9'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/chatbot-simulation',
                    index: 8
                },
                {
                    id: 'ai-teen-10',
                    title: 'AI in Gaming Story',
                    description: 'Who controls video game enemies?',
                    icon: <Gamepad2 className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-teen-10'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/ai-in-gaming-story',
                    index: 9
                },
                {
                    id: 'ai-teen-11',
                    title: 'Pattern Music Reflex',
                    description: 'Repeat rhythm patterns',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ai-teen-11'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/pattern-music-reflex',
                    index: 10
                },
                {
                    id: 'ai-teen-12',
                    title: 'Computer Vision Basics',
                    description: 'Identify objects with AI eyes',
                    icon: <Eye className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-teen-12'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/computer-vision-basics',
                    index: 11
                },
                {
                    id: 'ai-teen-13',
                    title: 'AI in Smartphones Quiz',
                    description: 'Does face unlock use AI?',
                    icon: <Smartphone className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-teen-13'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/ai-in-smartphones-quiz',
                    index: 12
                },
                {
                    id: 'ai-teen-14',
                    title: 'Prediction Story',
                    description: 'How AI forecasts weather',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['ai-teen-14'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/prediction-story',
                    index: 13
                },
                {
                    id: 'ai-teen-15',
                    title: 'Machine vs Human Reflex',
                    description: 'Identify Human or AI quickly',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 20,
                    xp: 20,
                    completed: gameCompletionStatus['ai-teen-15'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/machine-vs-human-reflex',
                    index: 14
                },
                {
                    id: 'ai-teen-16',
                    title: 'Language AI Quiz',
                    description: 'Is Google Translate an AI?',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-teen-16'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/language-ai-quiz',
                    index: 15
                },
                {
                    id: 'ai-teen-17',
                    title: 'Simple Algorithm Puzzle',
                    description: 'Arrange steps to solve a problem',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ai-teen-17'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/simple-algorithm-puzzle',
                    index: 16
                },
                {
                    id: 'ai-teen-18',
                    title: 'Smart Home Story',
                    description: 'How AI controls smart homes',
                    icon: <Home className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['ai-teen-18'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/smart-home-story',
                    index: 17
                },
                {
                    id: 'ai-teen-19',
                    title: 'Recommendation Simulation',
                    description: 'How AI recommends content',
                    icon: <Star className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ai-teen-19'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/recommendation-simulation',
                    index: 18
                },
                {
                    id: 'ai-teen-20',
                    title: 'AI Everywhere Quiz',
                    description: 'Understand AI\'s reach in our world',
                    icon: <Globe className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ai-teen-20'] || false,
                    isSpecial: true,
                    path: '/student/ai-for-all/teen/ai-everywhere-quiz',
                    index: 19
                }
            ];
            
            // Add our real AI For All Teen games
            games.push(...realAITeenGames);
        } else if (category === 'entrepreneurship' && ageGroup === 'kids') {
            // Add our 20 real EHE Kids games
            const realEHEKidsGames = [
                {
                    id: 'ehe-kids-1',
                    title: 'Doctor Story',
                    description: 'Learn about doctor\'s job',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-1'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/doctor-story',
                    index: 0
                },
                {
                    id: 'ehe-kids-2',
                    title: 'Quiz on Jobs',
                    description: 'Match people to their jobs',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-kids-2'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/quiz-on-jobs',
                    index: 1
                },
                {
                    id: 'ehe-kids-3',
                    title: 'Reflex Job Match',
                    description: 'Quick matching of jobs to workplaces',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-3'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/reflex-job-match',
                    index: 2
                },
                {
                    id: 'ehe-kids-4',
                    title: 'Puzzle: Who Does What?',
                    description: 'Match jobs to their tasks',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-kids-4'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/puzzle-who-does-what',
                    index: 3
                },
                {
                    id: 'ehe-kids-5',
                    title: 'Dream Job Story',
                    description: 'Find the job that fits your passion',
                    icon: <Star className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-5'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/dream-job-story',
                    index: 4
                },
                {
                    id: 'ehe-kids-6',
                    title: 'Poster: My Dream Job',
                    description: 'Create your dream job poster',
                    icon: <Palette className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '8-10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-kids-6'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/poster-my-dream-job',
                    index: 5
                },
                {
                    id: 'ehe-kids-7',
                    title: 'Journal of Jobs',
                    description: 'Write about your future career',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-kids-7'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/journal-of-jobs',
                    index: 6
                },
                {
                    id: 'ehe-kids-8',
                    title: 'School Helper Story',
                    description: 'Who keeps school safe?',
                    icon: <Shield className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-8'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/school-helper-story',
                    index: 7
                },
                {
                    id: 'ehe-kids-9',
                    title: 'Reflex Career Check',
                    description: 'Quick career facts check',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-9'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/reflex-career-check',
                    index: 8
                },
                {
                    id: 'ehe-kids-10',
                    title: 'Badge: Career Explorer Kid',
                    description: 'Complete career exploration',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-kids-10'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/badge-career-explorer',
                    index: 9
                },
                {
                    id: 'ehe-kids-11',
                    title: 'Idea Story',
                    description: 'Start your lemonade business',
                    icon: <Lightbulb className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-11'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/idea-story',
                    index: 10
                },
                {
                    id: 'ehe-kids-12',
                    title: 'Quiz on Skills',
                    description: 'What skills help entrepreneurs?',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-12'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/quiz-on-skills',
                    index: 11
                },
                {
                    id: 'ehe-kids-13',
                    title: 'Reflex Skill Check',
                    description: 'Identify good entrepreneur skills',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-13'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/reflex-skill-check',
                    index: 12
                },
                {
                    id: 'ehe-kids-14',
                    title: 'Puzzle: Match Skills',
                    description: 'Match roles to their actions',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-kids-14'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/puzzle-match-skills',
                    index: 13
                },
                {
                    id: 'ehe-kids-15',
                    title: 'Teamwork Story',
                    description: 'Learn the power of collaboration',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-15'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/teamwork-story',
                    index: 14
                },
                {
                    id: 'ehe-kids-16',
                    title: 'Poster: Skills for Success',
                    description: 'Create success formula poster',
                    icon: <Palette className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '8-10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-kids-16'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/poster-skills-for-success',
                    index: 15
                },
                {
                    id: 'ehe-kids-17',
                    title: 'Journal of Skills',
                    description: 'Reflect on skills to improve',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-kids-17'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/journal-of-skills',
                    index: 16
                },
                {
                    id: 'ehe-kids-18',
                    title: 'Risk Story',
                    description: 'Build courage by trying new things',
                    icon: <TrendingUp className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-18'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/risk-story',
                    index: 17
                },
                {
                    id: 'ehe-kids-19',
                    title: 'Reflex Innovation',
                    description: 'Identify innovation mindset',
                    icon: <Lightbulb className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-kids-19'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/reflex-innovation',
                    index: 18
                },
                {
                    id: 'ehe-kids-20',
                    title: 'Badge: Young Innovator',
                    description: 'Master entrepreneur skills',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-kids-20'] || false,
                    isSpecial: true,
                    path: '/student/ehe/kids/badge-young-innovator',
                    index: 19
                }
            ];
            
            // Add our real EHE Kids games
            games.push(...realEHEKidsGames);
        } else if (category === 'entrepreneurship' && ageGroup === 'teens') {
            // Add our 20 real EHE Teen games
            const realEHETeenGames = [
                {
                    id: 'ehe-teen-1',
                    title: 'Career Story',
                    description: 'Match passion to career path',
                    icon: <Star className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-teen-1'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/career-story',
                    index: 0
                },
                {
                    id: 'ehe-teen-2',
                    title: 'Quiz on Careers',
                    description: 'Test your career knowledge',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 3,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-teen-2'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/quiz-on-careers',
                    index: 1
                },
                {
                    id: 'ehe-teen-3',
                    title: 'Reflex Teen Career',
                    description: 'Quick career matching',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-teen-3'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/reflex-teen-career',
                    index: 2
                },
                {
                    id: 'ehe-teen-4',
                    title: 'Puzzle: Career Match',
                    description: 'Match careers to responsibilities',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-teen-4'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/puzzle-career-match',
                    index: 3
                },
                {
                    id: 'ehe-teen-5',
                    title: 'Passion Story',
                    description: 'Find career that matches passion',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-teen-5'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/passion-story',
                    index: 4
                },
                {
                    id: 'ehe-teen-6',
                    title: 'Debate: One Career or Many?',
                    description: 'Discuss career exploration',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '8-10 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['ehe-teen-6'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/debate-one-career-or-many',
                    index: 5
                },
                {
                    id: 'ehe-teen-7',
                    title: 'Journal of Career Choice',
                    description: 'Write about career interests',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-teen-7'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/journal-of-career-choice',
                    index: 6
                },
                {
                    id: 'ehe-teen-8',
                    title: 'Simulation: Career Fair',
                    description: 'Practice professional networking',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-teen-8'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/simulation-career-fair',
                    index: 7
                },
                {
                    id: 'ehe-teen-9',
                    title: 'Reflex Future Check',
                    description: 'Quick career facts verification',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-teen-9'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/reflex-future-check',
                    index: 8
                },
                {
                    id: 'ehe-teen-10',
                    title: 'Badge: Career Aware Teen',
                    description: 'Career exploration achievement',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-teen-10'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/badge-career-aware-teen',
                    index: 9
                },
                {
                    id: 'ehe-teen-11',
                    title: 'Opportunity Story',
                    description: 'Spot business opportunities',
                    icon: <Lightbulb className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-teen-11'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/opportunity-story',
                    index: 10
                },
                {
                    id: 'ehe-teen-12',
                    title: 'Quiz on Entrepreneur Traits',
                    description: 'Key success traits',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-teen-12'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/quiz-on-entrepreneur-traits',
                    index: 11
                },
                {
                    id: 'ehe-teen-13',
                    title: 'Reflex Teen Skills',
                    description: 'Identify entrepreneur traits',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-teen-13'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/reflex-teen-skills',
                    index: 12
                },
                {
                    id: 'ehe-teen-14',
                    title: 'Puzzle: Match Traits',
                    description: 'Match entrepreneur traits to actions',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-teen-14'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/puzzle-match-traits',
                    index: 13
                },
                {
                    id: 'ehe-teen-15',
                    title: 'Failure Story',
                    description: 'Learn resilience from failure',
                    icon: <TrendingUp className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-teen-15'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/failure-story',
                    index: 14
                },
                {
                    id: 'ehe-teen-16',
                    title: 'Debate: Born or Made?',
                    description: 'Are entrepreneurs born or made?',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '8-10 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['ehe-teen-16'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/debate-born-or-made',
                    index: 15
                },
                {
                    id: 'ehe-teen-17',
                    title: 'Journal of Strengths',
                    description: 'Reflect on entrepreneur strengths',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['ehe-teen-17'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/journal-of-strengths',
                    index: 16
                },
                {
                    id: 'ehe-teen-18',
                    title: 'Simulation: Team Project',
                    description: 'Resolve team conflicts',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-teen-18'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/simulation-team-project',
                    index: 17
                },
                {
                    id: 'ehe-teen-19',
                    title: 'Reflex Teen Innovator',
                    description: 'Identify innovation behaviors',
                    icon: <Lightbulb className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['ehe-teen-19'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/reflex-teen-innovator',
                    index: 18
                },
                {
                    id: 'ehe-teen-20',
                    title: 'Badge: Future Entrepreneur',
                    description: 'Master entrepreneur skills',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['ehe-teen-20'] || false,
                    isSpecial: true,
                    path: '/student/ehe/teen/badge-future-entrepreneur',
                    index: 19
                }
            ];
            
            // Add our real EHE Teen games
            games.push(...realEHETeenGames);
        } else if (category === 'civic-responsibility' && ageGroup === 'teen') {
            // Add our real CRGC Teen games
            games.push(...realCRGCTeenGames);
        } else if (category === 'civic-responsibility' && ageGroup === 'kids') {
            // Add our 20 real CRGC Kids games
            const realCRGCKidsGames = [
                {
                    id: 'crgc-kids-1',
                    title: "Friend's Sad Story",
                    description: 'Comfort a friend in need',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-1'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/friends-sad-story',
                    index: 0
                },
                {
                    id: 'crgc-kids-2',
                    title: 'Quiz on Empathy',
                    description: 'What does empathy mean?',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-2'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/quiz-on-empathy',
                    index: 1
                },
                {
                    id: 'crgc-kids-3',
                    title: 'Reflex Kindness',
                    description: 'Identify kind actions quickly',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-3'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/reflex-kindness',
                    index: 2
                },
                {
                    id: 'crgc-kids-4',
                    title: 'Kindness in Action',
                    description: 'Practice kindness in real life',
                    icon: <Hand className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-4'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/kindness-in-action',
                    index: 3
                },
                {
                    id: 'crgc-kids-5',
                    title: 'Empathy in Stories',
                    description: 'Find empathy in stories',
                    icon: <Book className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-5'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/empathy-in-stories',
                    index: 4
                },
                {
                    id: 'crgc-kids-6',
                    title: 'Kindness Challenge',
                    description: 'Complete kindness challenges',
                    icon: <Trophy className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-6'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/kindness-challenge',
                    index: 5
                },
                {
                    id: 'crgc-kids-7',
                    title: 'Empathy Quiz',
                    description: 'Test your empathy skills',
                    icon: <QuestionMarkCircle className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-7'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/empathy-quiz',
                    index: 6
                },
                {
                    id: 'crgc-kids-8',
                    title: 'Kindness Stories',
                    description: 'Read stories about kindness',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-8'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/kindness-stories',
                    index: 7
                },
                {
                    id: 'crgc-kids-9',
                    title: 'Empathy Role Play',
                    description: 'Practice empathy in role play',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-9'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/empathy-role-play',
                    index: 8
                },
                {
                    id: 'crgc-kids-10',
                    title: 'Kindness Journal',
                    description: 'Write about kindness',
                    icon: <Pencil className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-10'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/kindness-journal',
                    index: 9
                },
                {
                    id: 'crgc-kids-11',
                    title: 'Empathy Scenarios',
                    description: 'Identify empathy in scenarios',
                    icon: <ClipboardList className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-11'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/empathy-scenarios',
                    index: 10
                },
                {
                    id: 'crgc-kids-12',
                    title: 'Kindness Actions',
                    description: 'List kind actions',
                    icon: <List className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-12'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/kindness-actions',
                    index: 11
                },
                {
                    id: 'crgc-kids-13',
                    title: 'Empathy Stories',
                    description: 'Write empathy stories',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-13'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/empathy-stories',
                    index: 12
                },
                {
                    id: 'crgc-kids-14',
                    title: 'Kindness Reflection',
                    description: 'Reflect on kindness',
                    icon: <Sparkles className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-14'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/kindness-reflection',
                    index: 13
                },
                {
                    id: 'crgc-kids-15',
                    title: 'Empathy Role Play',
                    description: 'Practice empathy in role play',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-15'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/empathy-role-play',
                    index: 14
                },
                {
                    id: 'crgc-kids-16',
                    title: 'Kindness Journal',
                    description: 'Write about kindness',
                    icon: <Pencil className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-16'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/kindness-journal',
                    index: 15
                },
                {
                    id: 'crgc-kids-17',
                    title: 'Empathy Scenarios',
                    description: 'Identify empathy in scenarios',
                    icon: <ClipboardList className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-17'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/empathy-scenarios',
                    index: 16
                },
                {
                    id: 'crgc-kids-18',
                    title: 'Kindness Actions',
                    description: 'List kind actions',
                    icon: <List className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-18'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/kindness-actions',
                    index: 17
                },
                {
                    id: 'crgc-kids-19',
                    title: 'Empathy Stories',
                    description: 'Write empathy stories',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-19'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/empathy-stories',
                    index: 18
                },
                {
                    id: 'crgc-kids-20',
                    title: 'Kindness Reflection',
                    description: 'Reflect on kindness',
                    icon: <Sparkles className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-3'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/reflex-kindness',
                    index: 2
                },
                {
                    id: 'crgc-kids-4',
                    title: 'Puzzle: Match Feelings',
                    description: 'Match emotions to expressions',
                    icon: <Smile className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['crgc-kids-4'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/puzzle-match-feelings',
                    index: 3
                },
                {
                    id: 'crgc-kids-5',
                    title: 'Animal Story',
                    description: 'Show compassion to animals',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-5'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/animal-story',
                    index: 4
                },
                {
                    id: 'crgc-kids-6',
                    title: 'Poster: Be Kind Always',
                    description: 'Create kindness superpower poster',
                    icon: <Palette className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '8-10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['crgc-kids-6'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/poster-be-kind-always',
                    index: 5
                },
                {
                    id: 'crgc-kids-7',
                    title: 'Journal of Empathy',
                    description: 'Write about showing kindness',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['crgc-kids-7'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/journal-of-empathy',
                    index: 6
                },
                {
                    id: 'crgc-kids-8',
                    title: 'Bully Story',
                    description: 'Stand up against bullying',
                    icon: <Shield className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-8'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/bully-story',
                    index: 7
                },
                {
                    id: 'crgc-kids-9',
                    title: 'Reflex Help Alert',
                    description: 'Choose helpful actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-9'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/reflex-help-alert',
                    index: 8
                },
                {
                    id: 'crgc-kids-10',
                    title: 'Badge: Kind Kid',
                    description: 'Master empathy skills',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['crgc-kids-10'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/badge-kind-kid',
                    index: 9
                },
                {
                    id: 'crgc-kids-11',
                    title: 'Classroom Story',
                    description: 'Respect different languages',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-11'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/classroom-story',
                    index: 10
                },
                {
                    id: 'crgc-kids-12',
                    title: 'Quiz on Respect',
                    description: 'What does respect mean?',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-12'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/quiz-on-respect',
                    index: 11
                },
                {
                    id: 'crgc-kids-13',
                    title: 'Reflex Respect',
                    description: 'Identify respectful actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-13'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/reflex-respect',
                    index: 12
                },
                {
                    id: 'crgc-kids-14',
                    title: 'Puzzle: Respect Match',
                    description: 'Match respect to people',
                    icon: <Target className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['crgc-kids-14'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/puzzle-respect-match',
                    index: 13
                },
                {
                    id: 'crgc-kids-15',
                    title: 'Gender Story',
                    description: 'Everyone can play everything',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-15'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/gender-story',
                    index: 14
                },
                {
                    id: 'crgc-kids-16',
                    title: 'Poster: Respect All',
                    description: 'Every voice matters',
                    icon: <Palette className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '8-10 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['crgc-kids-16'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/poster-respect-all',
                    index: 15
                },
                {
                    id: 'crgc-kids-17',
                    title: 'Journal of Respect',
                    description: 'Write about showing respect',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['crgc-kids-17'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/journal-of-respect',
                    index: 16
                },
                {
                    id: 'crgc-kids-18',
                    title: 'Disability Story',
                    description: 'Include everyone equally',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-18'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/disability-story',
                    index: 17
                },
                {
                    id: 'crgc-kids-19',
                    title: 'Reflex Inclusion',
                    description: 'Choose inclusive actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-kids-19'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/reflex-inclusion',
                    index: 18
                },
                {
                    id: 'crgc-kids-20',
                    title: 'Badge: Respect Kid',
                    description: 'Complete respect examples',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['crgc-kids-20'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/kids/badge-respect-kid',
                    index: 19
                }
            ];
            
            // Add our real CRGC Kids games
            games.push(...realCRGCKidsGames);
        } else if (category === 'civic-responsibility' && ageGroup === 'teens') {
            // Add our 20 real CRGC Teen games
            const realCRGCTeenGames = [
                {
                    id: 'crgc-teen-1',
                    title: 'Stranger Story',
                    description: 'Help an elderly stranger',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-1'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/stranger-story',
                    index: 0
                },
                {
                    id: 'crgc-teen-2',
                    title: 'Quiz on Compassion',
                    description: 'What does compassion mean?',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-2'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/quiz-on-compassion',
                    index: 1
                },
                {
                    id: 'crgc-teen-3',
                    title: 'Reflex Teen Compassion',
                    description: 'Identify compassionate actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-3'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/reflex-teen-compassion',
                    index: 2
                },
                {
                    id: 'crgc-teen-4',
                    title: 'Puzzle: Kind Acts',
                    description: 'Match compassionate actions',
                    icon: <Puzzle className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['crgc-teen-4'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/puzzle-kind-acts',
                    index: 3
                },
                {
                    id: 'crgc-teen-5',
                    title: 'Refugee Story',
                    description: 'Welcome someone new',
                    icon: <Globe className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-5'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/refugee-story',
                    index: 4
                },
                {
                    id: 'crgc-teen-6',
                    title: 'Debate: Kindness = Weakness?',
                    description: 'Argue your position',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '15-20 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['crgc-teen-6'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/debate-kindness-weakness',
                    index: 5
                },
                {
                    id: 'crgc-teen-7',
                    title: 'Journal of Compassion',
                    description: 'Reflect on kind acts',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['crgc-teen-7'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/journal-of-compassion',
                    index: 6
                },
                {
                    id: 'crgc-teen-8',
                    title: 'Simulation: Hospital Visit',
                    description: 'Support a sick classmate',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-8'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/simulation-hospital-visit',
                    index: 7
                },
                {
                    id: 'crgc-teen-9',
                    title: 'Reflex Global Empathy',
                    description: 'Show global compassion',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-9'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/reflex-global-empathy',
                    index: 8
                },
                {
                    id: 'crgc-teen-10',
                    title: 'Badge: Compassion Leader',
                    description: 'Complete 5 compassionate acts',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['crgc-teen-10'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/badge-compassion-leader',
                    index: 9
                },
                {
                    id: 'crgc-teen-11',
                    title: 'Cultural Story',
                    description: 'Respect different religions',
                    icon: <Globe className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-11'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/cultural-story',
                    index: 10
                },
                {
                    id: 'crgc-teen-12',
                    title: 'Quiz on Inclusion',
                    description: 'Understanding inclusion',
                    icon: <Brain className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-12'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/quiz-on-inclusion',
                    index: 11
                },
                {
                    id: 'crgc-teen-13',
                    title: 'Reflex Teen Respect',
                    description: 'Identify respectful actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-13'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/reflex-teen-respect',
                    index: 12
                },
                {
                    id: 'crgc-teen-14',
                    title: 'Puzzle: Inclusion Acts',
                    description: 'Match inclusive actions',
                    icon: <Puzzle className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['crgc-teen-14'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/puzzle-inclusion-acts',
                    index: 13
                },
                {
                    id: 'crgc-teen-15',
                    title: 'Religion Story',
                    description: 'Respect different prayers',
                    icon: <Heart className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-15'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/religion-story',
                    index: 14
                },
                {
                    id: 'crgc-teen-16',
                    title: 'Debate: Equality for All?',
                    description: 'Argue for equal treatment',
                    icon: <MessageSquare className="w-6 h-6" />,
                    difficulty: 'Hard',
                    duration: '15-20 min',
                    coins: 10,
                    xp: 20,
                    completed: gameCompletionStatus['crgc-teen-16'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/debate-equality-for-all',
                    index: 15
                },
                {
                    id: 'crgc-teen-17',
                    title: 'Journal of Inclusion',
                    description: 'Reflect on including others',
                    icon: <BookOpen className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '6-8 min',
                    coins: 5,
                    xp: 12,
                    completed: gameCompletionStatus['crgc-teen-17'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/journal-of-inclusion',
                    index: 16
                },
                {
                    id: 'crgc-teen-18',
                    title: 'Simulation: School Event',
                    description: 'Practice inclusion',
                    icon: <Users className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '5-7 min',
                    coins: 5,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-18'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/simulation-school-event',
                    index: 17
                },
                {
                    id: 'crgc-teen-19',
                    title: 'Reflex Teen Inclusion',
                    description: 'Recognize inclusive actions',
                    icon: <Zap className="w-6 h-6" />,
                    difficulty: 'Medium',
                    duration: '4-6 min',
                    coins: 3,
                    xp: 10,
                    completed: gameCompletionStatus['crgc-teen-19'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/reflex-teen-inclusion',
                    index: 18
                },
                {
                    id: 'crgc-teen-20',
                    title: 'Badge: Inclusion Leader',
                    description: 'Complete inclusion actions',
                    icon: <Award className="w-6 h-6" />,
                    difficulty: 'Easy',
                    duration: '2-3 min',
                    coins: 3,
                    xp: 15,
                    completed: gameCompletionStatus['crgc-teen-20'] || false,
                    isSpecial: true,
                    path: '/student/civic-responsibility/teen/badge-inclusion-leader',
                    index: 19
                }
            ];
            
            // Add our real CRGC Teen games
            games.push(...realCRGCTeenGames);
        } else if (category === 'sustainability') {
            // For sustainability, we need to check the ageGroup to determine which subcategory we're in
            if (ageGroup === 'solar-and-city') {
                const solarAndCityGames = [
                    {
                        id: 'sustainability-1',
                        title: 'Solar & City Challenge',
                        description: 'Learn about solar energy and sustainable cities',
                        icon: <Sun className="w-6 h-6" />,
                        difficulty: 'Easy',
                        duration: '5 min',
                        coins: 5,
                        xp: 10,
                        completed: gameCompletionStatus['sustainability-1'] || false,
                        isSpecial: true,
                        path: '/student/sustainability/solar-and-city/test-solar-game',
                        index: 0
                    }
                    // Add more games here as they are created
                ];
                games.push(...solarAndCityGames);
            } else if (ageGroup === 'water-and-recycle') {
                const waterAndRecycleGames = [
                    {
                        id: 'sustainability-2',
                        title: 'Water & Recycle Challenge',
                        description: 'Learn about water conservation and recycling',
                        icon: <Droplets className="w-6 h-6" />,
                        difficulty: 'Easy',
                        duration: '5 min',
                        coins: 5,
                        xp: 10,
                        completed: gameCompletionStatus['sustainability-2'] || false,
                        isSpecial: true,
                        path: '/student/sustainability/water-and-recycle/test-water-recycle-game',
                        index: 0
                    }
                    // Add more games here as they are created
                ];
                games.push(...waterAndRecycleGames);
            } else if (ageGroup === 'carbon-and-climate') {
                const carbonAndClimateGames = [
                    {
                        id: 'sustainability-3',
                        title: 'Carbon & Climate Challenge',
                        description: 'Learn about carbon footprints and climate change',
                        icon: <Cloud className="w-6 h-6" />,
                        difficulty: 'Medium',
                        duration: '6 min',
                        coins: 5,
                        xp: 10,
                        completed: gameCompletionStatus['sustainability-3'] || false,
                        isSpecial: true,
                        path: '/student/sustainability/carbon-and-climate/test-carbon-game',
                        index: 0
                    }
                    // Add more games here as they are created
                ];
                games.push(...carbonAndClimateGames);
            } else if (ageGroup === 'water-and-energy') {
                const waterAndEnergyGames = [
                    {
                        id: 'sustainability-4',
                        title: 'Water & Energy Challenge',
                        description: 'Learn about the connection between water and energy',
                        icon: <Zap className="w-6 h-6" />,
                        difficulty: 'Medium',
                        duration: '6 min',
                        coins: 5,
                        xp: 10,
                        completed: gameCompletionStatus['sustainability-4'] || false,
                        isSpecial: true,
                        path: '/student/sustainability/water-and-energy/test-water-energy-game',
                        index: 0
                    }
                    // Add more games here as they are created
                ];
                games.push(...waterAndEnergyGames);
            } else {
                // Default case if no specific ageGroup is matched
                const defaultSustainabilityGames = [
                    {
                        id: 'sustainability-1',
                        title: 'Solar & City Challenge',
                        description: 'Learn about solar energy and sustainable cities',
                        icon: <Leaf className="w-6 h-6" />,
                        difficulty: 'Easy',
                        duration: '5 min',
                        coins: 5,
                        xp: 10,
                        completed: gameCompletionStatus['sustainability-1'] || false,
                        isSpecial: true,
                        path: '/student/sustainability/solar-and-city/test-solar-game',
                        index: 0
                    }
                ];
                games.push(...defaultSustainabilityGames);
            }
        } else {
            // For all other categories, generate 20 mock games instead of 200
            for (let i = 1; i <= 20; i++) {
                const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
                const icon = icons[Math.floor(Math.random() * icons.length)];
                
                games.push({
                    id: `${ageGroup}-${i}`,
                    title: `${getAgeGroupTitle(ageGroup)} Game ${i}`,
                    description: `An engaging ${difficulty.toLowerCase()} game that helps improve your skills in ${getCategoryTitle(category)}.`,
                    icon: icon,
                    difficulty: difficulty,
                    duration: `${Math.floor(Math.random() * 10) + 1}-${Math.floor(Math.random() * 10) + 1} min`,
                    coins: Math.floor(Math.random() * 10) + 1,
                    xp: Math.floor(Math.random() * 10) + 1,
                    completed: gameCompletionStatus[`${ageGroup}-${i}`] || false,
                    isSpecial: false,
                    path: `/student/${category}/${ageGroup}/game-${i}`,
                    index: i - 1
                });
            }
        }
        
        return games;
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    const [games, setGames] = useState([]);
    
    useEffect(() => {
        setGames(generateGamesData());
    }, [gameCompletionStatus]);
    
    useEffect(() => {
        if (user?.dateOfBirth) {
            const age = calculateUserAge(user.dateOfBirth);
            setUserAge(age);
        }
    }, [user]);
    
    // Check if this age group is accessible
    const isAccessible = canAccessGame(ageGroup, userAge);
    const isLocked = !isAccessible;
    
    // Check if unlock requirements are met
    const unlockRequirements = () => {
        if (ageGroup === 'teens' && userAge < 13) {
            return "Complete all 20 finance related games from Kids section first.";
        } else if (ageGroup === 'adults' && userAge < 18) {
            return `Available at age 18. You are ${userAge} years old.`;
        }
        // Additional adult unlocking requirements can be added here
        return "";
    };
    
    const requirements = unlockRequirements();
    
    // Handle game play
    const handlePlayGame = (game) => {
        if (isLocked) {
            toast.error(requirements || "This section is locked.", {
                duration: 4000,
                position: "bottom-center",
                icon: "🔒"
            });
            return;
        }
        
        // Check if game is unlocked for sequential play (for finance, brain health, UVLS, DCOS, Moral Values, AI For All, EHE, and CRGC kids and teens games)
        if ((category === 'financial-literacy' || category === 'brain-health' || category === 'uvls' || category === 'digital-citizenship' || category === 'moral-values' || category === 'ai-for-all' || category === 'entrepreneurship' || category === 'civic-responsibility') && (ageGroup === 'kids' || ageGroup === 'teens')) {
            if (!isGameUnlocked(game.index)) {
                toast.error("Complete the previous game first to unlock this game!", {
                    duration: 4000,
                    position: "bottom-center",
                    icon: "🔒"
                });
                return;
            }
            
            // Check if game is already fully completed and should be locked
            if (isGameFullyCompleted(game.id)) {
                toast.error("You've already collected all HealCoins for this game. Game is now locked!", {
                    duration: 4000,
                    position: "bottom-center",
                    icon: "🔒"
                });
                return;
            }
        }
        
        // Special handling for financial literacy kids and teens games
        if (game.isSpecial && game.path) {
            navigate(game.path);
            return;
        }
        
        // In a real app, this would navigate to the actual game
        toast.success(`Starting ${game.title}...`, {
            duration: 2000,
            position: "bottom-center",
            icon: "🎮"
        });
        
        // Simulate game completion for demo
        setTimeout(() => {
            setCompletedGames(prev => new Set([...prev, game.id]));
            toast.success(`Completed ${game.title}! +${game.coins} coins, +${game.xp} XP`, {
                duration: 3000,
                position: "bottom-center",
                icon: "🏆"
            });
        }, 1000);
    };
    
    // Get difficulty color
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'from-green-400 to-emerald-500';
            case 'Medium': return 'from-yellow-400 to-orange-500';
            case 'Hard': return 'from-red-400 to-pink-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/student/dashboard")}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            {getCategoryIcon(category)}
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                {getCategoryTitle(category)}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {getAgeGroupTitle(ageGroup)} - 20 Games
                            </p>
                        </div>
                    </div>
                    
                    {isLocked && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg mb-6"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Lock className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Locked</h3>
                            </div>
                            <p className="text-lg">{requirements}</p>
                        </motion.div>
                    )}
                </motion.div>
                
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Gamepad2 className="w-5 h-5 text-indigo-500" />
                            <span className="text-gray-600 font-medium">Total Games</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">20</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-600 font-medium">Completed</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {(category === 'financial-literacy' || category === 'brain-health' || category === 'uvls' || category === 'digital-citizenship' || category === 'moral-values' || category === 'ai-for-all' || category === 'entrepreneurship' || category === 'civic-responsibility' || category === 'sustainability') && (ageGroup === 'kids' || ageGroup === 'teens')
                                ? Object.values(gameCompletionStatus).filter(status => status).length 
                                : completedGames.size}
                        </p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Coins className="w-5 h-5 text-green-500" />
                            <span className="text-gray-600 font-medium">Coins Earned</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {(category === 'financial-literacy' || category === 'brain-health' || category === 'uvls' || category === 'digital-citizenship' || category === 'moral-values' || category === 'ai-for-all' || category === 'entrepreneurship' || category === 'civic-responsibility' || category === 'sustainability') && (ageGroup === 'kids' || ageGroup === 'teens')
                                ? Object.values(gameCompletionStatus).filter(status => status).length * 3
                                : completedGames.size * 3}
                        </p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-purple-500" />
                            <span className="text-gray-600 font-medium">XP Gained</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {(category === 'financial-literacy' || category === 'brain-health' || category === 'uvls' || category === 'digital-citizenship' || category === 'moral-values' || category === 'ai-for-all' || category === 'entrepreneurship' || category === 'civic-responsibility' || category === 'sustainability') && (ageGroup === 'kids' || ageGroup === 'teens')
                                ? Object.values(gameCompletionStatus).filter(status => status).length * 20
                                : completedGames.size * 20}
                        </p>
                    </div>
                </motion.div>
                
                {/* Games Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {games.map((game, index) => {
                        const isUnlocked = (category === 'financial-literacy' || category === 'brain-health' || category === 'uvls' || category === 'digital-citizenship' || category === 'moral-values' || category === 'ai-for-all' || category === 'entrepreneurship' || category === 'civic-responsibility' || category === 'sustainability') && (ageGroup === 'kids' || ageGroup === 'teens')
                            ? isGameUnlocked(index) 
                            : true;
                        const isFullyCompleted = (category === 'financial-literacy' || category === 'brain-health' || category === 'uvls' || category === 'digital-citizenship' || category === 'moral-values' || category === 'ai-for-all' || category === 'entrepreneurship' || category === 'civic-responsibility' || category === 'sustainability') && (ageGroup === 'kids' || ageGroup === 'teens')
                            ? isGameFullyCompleted(game.id)
                            : false;
                        const isLocked = isFullyCompleted || (!isUnlocked);
                        
                        return (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                                whileHover={{ y: isUnlocked ? -5 : 0 }}
                                className={`group rounded-2xl p-6 shadow-md border transition-all duration-300 relative overflow-hidden ${
                                    isLocked
                                        ? 'bg-white border-gray-200 cursor-not-allowed'
                                        : 'bg-white border-gray-100 hover:shadow-lg cursor-pointer'
                                }`}
                                onClick={() => !isLocked && handlePlayGame(game)}
                            >
                                {/* Locked overlay for additional visual indication */}
                                {isLocked && (
                                    <div className="absolute inset-0 bg-transparent flex items-center justify-center rounded-2xl">
                                        <Lock className="w-8 h-8 text-gray-500" />
                                    </div>
                                )}
                                
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getDifficultyColor(game.difficulty)} flex items-center justify-center text-white shadow-md`}>
                                        {game.icon}
                                    </div>
                                    {game.completed && !isFullyCompleted && (
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <Trophy className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    {isFullyCompleted && (
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                                            <Trophy className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    {isLocked && !isFullyCompleted && (
                                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center relative z-10">
                                            <Lock className="w-4 h-4 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                                
                                <h3 className={`text-lg font-bold mb-2 ${
                                    isLocked ? 'text-gray-500' : 'text-gray-900'
                                }`}>
                                    {game.title}
                                </h3>
                                
                                <p className={`text-sm mb-4 line-clamp-2 ${
                                    isLocked ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {game.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                        isLocked 
                                            ? 'bg-gray-200 text-gray-500' 
                                            : `bg-gradient-to-r ${getDifficultyColor(game.difficulty)} text-white`
                                    }`}>
                                        <Target className="w-3 h-3" />
                                        {game.difficulty}
                                    </div>
                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                        isLocked 
                                            ? 'bg-gray-200 text-gray-500' 
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        <Timer className="w-3 h-3" />
                                        {game.duration}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center gap-1 text-sm font-semibold ${
                                            isLocked ? 'text-gray-400' : 'text-green-600'
                                        }`}>
                                            <Coins className="w-4 h-4" />
                                            <span>{game.coins}</span>
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm font-semibold ${
                                            isLocked ? 'text-gray-400' : 'text-purple-600'
                                        }`}>
                                            <Zap className="w-4 h-4" />
                                            <span>{game.xp}</span>
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        isLocked
                                            ? 'bg-gray-200'
                                            : 'bg-indigo-100'
                                    }`}>
                                        {isLocked ? (
                                            <Lock className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <Play className="w-4 h-4 text-indigo-600" />
                                        )}
                                    </div>
                                </div>
                                
                                {/* Hover tooltip for locked games */}
                                {isLocked && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 text-white text-xs py-2 px-3 text-center rounded-b-2xl transform translate-y-full transition-transform duration-200 group-hover:translate-y-0">
                                        {isFullyCompleted 
                                            ? "Game completed! All HealCoins collected."
                                            : "Complete the previous game to unlock"}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default GameCategoryPage;