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
    Book,
    Hand
} from "lucide-react";


import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import gameCompletionService from "../../services/gameCompletionService";
import { financegGameIdsKids, getFinanceKidsGames } from "./GameCatagories/finance-literacy/kidGamesData";
import { financegGameIdsTeen, getFinanceTeenGames } from "./GameCatagories/finance-literacy/teenGamesData";
import { brainGamesKidsIds, getBrainKidsGames } from "./GameCatagories/brain-health/kidGamesData";
import { brainGamesTeenIds, getBrainTeenGames } from "./GameCatagories/brain-health/teenGamesData";
import { getUvlsKidsGames, uvlsGamesKidsIds } from "./GameCatagories/uvls/kidGamesData";
import { getUvlsTeenGames, uvlsGamesTeenIds } from "./GameCatagories/uvls/teenGamesData";
import {  dcosGamesKidsIds, getDcosKidsGames } from "./GameCatagories/digital-citizenship/kidGamesData";
import { dcosGamesTeenIds, getDcosTeenGames } from "./GameCatagories/digital-citizenship/teenGamesData";
import { getMoralKidsGames, moralGamesKidsIds } from "./GameCatagories/moral-values/kidGamesData";
import { getMoralTeenGames, moralGamesTeenIds } from "./GameCatagories/moral-values/teenGamesData";
import { aiGamesKidsIds, getAiKidsGames } from "./GameCatagories/ai-for-all/kidGamesData";
import { aiGamesTeenIds, getAiTeenGames } from "./GameCatagories/ai-for-all/teenGamesData";
import { eheGamesKidsIds, getEheKidsGames } from "./GameCatagories/Ehe/kidGamesData";
import { eheGamesTeenIds, getEheTeenGames } from "./GameCatagories/Ehe/teenGamesData";
import { civicGamesKidsIds, getCivicKidsGames } from "./GameCatagories/civic-responsibility/kidGamesData";
import { civicGamesTeenIds, getCivicTeenGames } from "./GameCatagories/civic-responsibility/teenGamesData";

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
            const gameIds = financegGameIdsKids;
            return gameIds[index];
        } else if (category === 'financial-literacy' && ageGroup === 'teens') {
            const gameIds = financegGameIdsTeen;
            return gameIds[index];
        } else if (category === 'brain-health' && ageGroup === 'kids') {
            const gameIds = brainGamesKidsIds;
            return gameIds[index];
        } else if (category === 'brain-health' && ageGroup === 'teens') {
            const gameIds = brainGamesTeenIds;
            return gameIds[index];
        } else if (category === 'uvls' && ageGroup === 'kids') {
            const gameIds = uvlsGamesKidsIds;
            return gameIds[index];
        } else if (category === 'uvls' && ageGroup === 'teens') {
            const gameIds = uvlsGamesTeenIds;
            return gameIds[index];
        } else if (category === 'digital-citizenship' && ageGroup === 'kids') {
            const gameIds = dcosGamesKidsIds;
            return gameIds[index];
        } else if (category === 'digital-citizenship' && ageGroup === 'teens') {
            const gameIds = dcosGamesTeenIds;
            return gameIds[index];
        } else if (category === 'moral-values' && ageGroup === 'kids') {
            const gameIds = moralGamesKidsIds;
            return gameIds[index];
        } else if (category === 'moral-values' && ageGroup === 'teens') {
            const gameIds = moralGamesTeenIds;
            return gameIds[index];
        } else if (category === 'ai-for-all' && ageGroup === 'kids') {
            const gameIds = aiGamesKidsIds;
            return gameIds[index];
        } else if (category === 'ai-for-all' && ageGroup === 'teens') {
            const gameIds = aiGamesTeenIds;
            return gameIds[index];
        } else if (category === 'entrepreneurship' && ageGroup === 'kids') {
            const gameIds = eheGamesKidsIds;
            return gameIds[index];
        } else if (category === 'entrepreneurship' && ageGroup === 'teens') {
            const gameIds = eheGamesTeenIds;
            return gameIds[index];
        } else if (category === 'civic-responsibility' && ageGroup === 'kids') {
            const gameIds = civicGamesKidsIds;
            return gameIds[index];
        } else if (category === 'civic-responsibility' && ageGroup === 'teens') {
            const gameIds = civicGamesTeenIds;
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

        // eslint-disable-next-line
    }, [category, ageGroup]);
    // Generate mock games data
    const generateGamesData = () => {
        const games = [];
        const difficulties = ['Easy', 'Medium', 'Hard'];
        const icons = [<Gamepad2 />, <Trophy />, <Star />, <Zap />, <Target />, <BookOpen />, <GraduationCap />];
        
        // Special case for financial literacy kids games - replace first 20 with real games
        if (category === 'financial-literacy' && ageGroup === 'kids') {
            // Add our 20 real finance games instead of mock games
            const realGames = getFinanceKidsGames(gameCompletionStatus)
            
            // Add our real games first
            games.push(...realGames);
            
            // No need for additional mock games since we have 20 real games
        } else if (category === 'financial-literacy' && ageGroup === 'teens') {
            // Add our 20 real teen finance games
            const realTeenGames = getFinanceTeenGames(gameCompletionStatus)
            
            // Add our real teen games
            games.push(...realTeenGames);
        } else if (category === 'brain-health' && ageGroup === 'kids') {
            // Add our 20 real brain health games for kids
            const realBrainGames = getBrainKidsGames(gameCompletionStatus)
            
            // Add our real brain games
            games.push(...realBrainGames);
        } else if (category === 'brain-health' && ageGroup === 'teens') {
            // Add our 20 real brain health games for teens
            const realTeenBrainGames = getBrainTeenGames(gameCompletionStatus);
            
            // Add our real teen brain games
            games.push(...realTeenBrainGames);
        } else if (category === 'uvls' && ageGroup === 'kids') {
            // Add our 10 real UVLS Kids games
            const realUVLSGames = getUvlsKidsGames(gameCompletionStatus);
            
            // Add our real UVLS games
            games.push(...realUVLSGames);
        } else if (category === 'uvls' && ageGroup === 'teens') {
            // Add our 20 real UVLS Teen games
            const realUVLSTeenGames = getUvlsTeenGames(gameCompletionStatus);
            
            // Add our real UVLS Teen games
            games.push(...realUVLSTeenGames);
        } else if (category === 'digital-citizenship' && ageGroup === 'kids') {
            // Add our 20 real DCOS Kids games
            const realDCOSKidsGames = getDcosKidsGames(gameCompletionStatus)
            
            // Add our real DCOS Kids games
            games.push(...realDCOSKidsGames);
        } else if (category === 'digital-citizenship' && ageGroup === 'teens') {
            // Add our 20 real DCOS Teen games
            const realDCOSTeenGames = getDcosTeenGames(gameCompletionStatus);
            
            // Add our real DCOS Teen games
            games.push(...realDCOSTeenGames);
        } else if (category === 'moral-values' && ageGroup === 'kids') {
            // Add our 20 real Moral Values Kids games
            const realMoralKidsGames = getMoralKidsGames(gameCompletionStatus);
            
            // Add our real Moral Values Kids games
            games.push(...realMoralKidsGames);
        } else if (category === 'moral-values' && ageGroup === 'teens') {
            // Add our 20 real Moral Values Teen games
            const realMoralTeenGames = getMoralTeenGames(gameCompletionStatus);
            
            // Add our real Moral Values Teen games
            games.push(...realMoralTeenGames);
        } else if (category === 'ai-for-all' && ageGroup === 'kids') {
            // Add our 20 real AI For All Kids games
            const realAIKidsGames = getAiKidsGames(gameCompletionStatus);
            
            // Add our real AI For All Kids games
            games.push(...realAIKidsGames);
        } else if (category === 'ai-for-all' && ageGroup === 'teens') {
            // Add our 20 real AI For All Teen games
            const realAITeenGames = getAiTeenGames(gameCompletionStatus);
            
            // Add our real AI For All Teen games
            games.push(...realAITeenGames);
        } else if (category === 'entrepreneurship' && ageGroup === 'kids') {
            // Add our 20 real EHE Kids games
            const realEHEKidsGames = getEheKidsGames(gameCompletionStatus);
            
            // Add our real EHE Kids games
            games.push(...realEHEKidsGames);
        } else if (category === 'entrepreneurship' && ageGroup === 'teens') {
            // Add our 20 real EHE Teen games
            const realEHETeenGames = getEheTeenGames(gameCompletionStatus);
            
            // Add our real EHE Teen games
            games.push(...realEHETeenGames);
        } else if (category === 'civic-responsibility' && ageGroup === 'kids') {
            // Add our 20 real CRGC Kids games
            const realCRGCKidsGames = getCivicKidsGames(gameCompletionStatus);
            
            // Add our real CRGC Kids games
            games.push(...realCRGCKidsGames);
        } else if (category === 'civic-responsibility' && ageGroup === 'teens') {
            // Add our 20 real CRGC Teen games
            const realCRGCTeenGames = getCivicTeenGames(gameCompletionStatus);
            
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
    // eslint-disable-next-line
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