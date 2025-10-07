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

const GameCategoryPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { category, ageGroup } = useParams();
    const [userAge, setUserAge] = useState(null);
    const [completedGames, setCompletedGames] = useState(new Set());
    
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
    
    // Check if kids games are completed (in a real app, this would check actual completion)
    const areKidsGamesCompleted = () => {
        // For demo purposes, we'll simulate this with a simple check
        // In a real implementation, this would check the user's game progress
        return completedGames.size >= 5; // Simulate 5/20 games completed
    };
    
    // Check if teen games are completed (in a real app, this would check actual completion)
    const areTeenGamesCompleted = () => {
        // For demo purposes, we'll simulate this with a simple check
        // In a real implementation, this would check the user's game progress
        return completedGames.size >= 10; // Simulate 10/20 games completed
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/piggy-bank-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/quiz-on-saving'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/reflex-savings'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/puzzle-save-or-spend'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/birthday-money-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/poster-saving-habit'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/journal-of-saving'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/shop-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/reflex-money-choice'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/badge-saver-kid'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/ice-cream-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/quiz-on-spending'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/reflex-spending'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/puzzle-smart-vs-waste'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/shop-story-2'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/poster-smart-shopping'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/journal-of-smart-buy'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/candy-offer-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/reflex-needs-first'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/kids/badge-smart-spender-kid'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/pocket-money-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/quiz-on-savings-rate'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/reflex-smart-saver'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/puzzle-of-saving-goals'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/salary-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/debate-save-vs-spend'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/journal-of-saving-goal'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/simulation-monthly-money'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/reflex-wise-use'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/badge-smart-saver'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/allowance-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/spending-quiz'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/reflex-wise-choices'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/puzzle-smart-spending'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/party-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/debate-needs-vs-wants'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/journal-of-spending'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/simulation-shopping-mall'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/reflex-control'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/finance/teen/badge-smart-spender-teen'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/water-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/quiz-on-brain-food'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/reflex-brain-boost'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/puzzle-of-brain-care'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/breakfast-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/poster-brain-health'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/journal-of-habits'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/sports-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/reflex-daily-habit'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/badge-brain-care-kid'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/classroom-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/quiz-on-focus'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/reflex-attention'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/puzzle-of-focus'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/homework-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/poster-focus-matters'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/journal-of-focus'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/game-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/reflex-quick-attention'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/kids/badge-focus-kid'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/exercise-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/quiz-on-habits'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/reflex-mind-check'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/puzzle-brain-fuel'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/junk-food-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/debate-brain-vs-body'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/journal-of-brain-fitness'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/simulation-daily-routine'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/reflex-brain-boost'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/badge-brain-health-hero'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/exam-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/quiz-on-attention'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/reflex-concentration'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/puzzle-of-distractions'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/social-media-story'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/debate-multitask-vs-focus'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/journal-of-attention'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/simulation-study-plan'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/reflex-distraction-alert'
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
                    completed: false,
                    isSpecial: true,
                    path: '/student/brain/teen/badge-focus-hero'
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
    
    const [games] = useState(generateGamesData());
    
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
        
        // Special handling for financial literacy kids games
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
                        <p className="text-2xl font-bold text-gray-900">{completedGames.size}</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Coins className="w-5 h-5 text-green-500" />
                            <span className="text-gray-600 font-medium">Coins Earned</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{completedGames.size * 35}</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-purple-500" />
                            <span className="text-gray-600 font-medium">XP Gained</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{completedGames.size * 20}</p>
                    </div>
                </motion.div>
                
                {/* Games Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {games.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index }}
                            whileHover={{ y: -5 }}
                            className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 transition-all duration-300 ${
                                isLocked 
                                    ? 'opacity-70 cursor-not-allowed' 
                                    : 'hover:shadow-lg cursor-pointer'
                            }`}
                            onClick={() => handlePlayGame(game)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getDifficultyColor(game.difficulty)} flex items-center justify-center text-white shadow-md`}>
                                    {game.icon}
                                </div>
                                {game.completed && (
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <Trophy className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {game.title}
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {game.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(game.difficulty)} text-white`}>
                                    <Target className="w-3 h-3" />
                                    {game.difficulty}
                                </div>
                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                    <Timer className="w-3 h-3" />
                                    {game.duration}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                                        <Coins className="w-4 h-4" />
                                        <span>{game.coins}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-semibold text-purple-600">
                                        <Zap className="w-4 h-4" />
                                        <span>{game.xp}</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <Play className="w-4 h-4 text-indigo-600" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default GameCategoryPage;