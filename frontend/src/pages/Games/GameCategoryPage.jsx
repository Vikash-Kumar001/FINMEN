import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    Trophy, 
    Timer, 
    Coins, 
    Lock, 
    Play,
    Users,
    Calendar,
    Star,
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
    Cpu
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
            default:
                return true;
        }
    };
    
    // Check if a specific game is unlocked based on completion sequence
    const isGameUnlocked = (gameIndex) => {
        // First game is always unlocked
        if (gameIndex === 0) return true;
        
        // For finance and brain health kids and teens games, check if previous game is completed
        if ((category === 'financial-literacy' || category === 'brain-health') && (ageGroup === 'kids' || ageGroup === 'teens')) {
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
            'civic-responsibility': <Globe className="w-6 h-6" />
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
            'civic-responsibility': 'Civic Responsibility & Global Citizenship'
        };
        
        return titleMap[categoryName] || categoryName;
    };
    
    // Get age group title
    const getAgeGroupTitle = (ageGroup) => {
        const titleMap = {
            'kids': 'Kids Games',
            'teens': 'Teen Games',
            'adults': 'Adult Games'
        };
        
        return titleMap[ageGroup] || ageGroup;
    };
    
    // Load game completion status
    const loadGameCompletionStatus = async () => {
        try {
            // For finance kids games, load completion status
            if ((category === 'financial-literacy' || category === 'brain-health') && (ageGroup === 'kids' || ageGroup === 'teens')) {
                const status = {};
                for (let i = 0; i < 20; i++) {
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
        const handleGameCompleted = (event) => {
            if ((category === 'financial-literacy' || category === 'brain-health') && (ageGroup === 'kids' || ageGroup === 'teens')) {
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
                    duration: `${Math.floor(Math.random() * 10) + 5}-${Math.floor(Math.random() * 10) + 10} min`,
                    coins: Math.floor(Math.random() * 50) + 20,
                    xp: Math.floor(Math.random() * 30) + 10,
                    completed: completedGames.has(`${ageGroup}-${i}`)
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
        } else if (ageGroup === 'adults' && userAge >= 18 && !areKidsGamesCompleted() && !areTeenGamesCompleted()) {
            return "Complete all games from Kids and Teen sections first.";
        } else if (ageGroup === 'adults' && userAge >= 18 && !areTeenGamesCompleted()) {
            return "Complete all games from Teen section first.";
        }
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
        
        // Check if game is unlocked for sequential play (for finance and brain health kids and teens games)
        if ((category === 'financial-literacy' || category === 'brain-health') && (ageGroup === 'kids' || ageGroup === 'teens')) {
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
                            {(category === 'financial-literacy' || category === 'brain-health') && (ageGroup === 'kids' || ageGroup === 'teens')
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
                            {(category === 'financial-literacy' || category === 'brain-health') && (ageGroup === 'kids' || ageGroup === 'teens')
                                ? Object.values(gameCompletionStatus).filter(status => status).length * 35
                                : completedGames.size * 35}
                        </p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-purple-500" />
                            <span className="text-gray-600 font-medium">XP Gained</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {(category === 'financial-literacy' || category === 'brain-health') && (ageGroup === 'kids' || ageGroup === 'teens')
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
                        const isUnlocked = (category === 'financial-literacy' || category === 'brain-health') && (ageGroup === 'kids' || ageGroup === 'teens')
                            ? isGameUnlocked(index) 
                            : true;
                        const isFullyCompleted = (category === 'financial-literacy' || category === 'brain-health') && (ageGroup === 'kids' || ageGroup === 'teens')
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