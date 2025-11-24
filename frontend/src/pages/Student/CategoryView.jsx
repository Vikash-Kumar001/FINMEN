import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Zap,
    ChevronRight,
    Lock,
    Sparkles,
    Star,
    AlertTriangle,
    X
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { mockFeatures } from "../../data/mockFeatures";
import { logActivity } from "../../services/activityService";
import { toast } from "react-hot-toast";

export default function CategoryView() {
    const { categorySlug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [featureCards, setFeatureCards] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAgeRestrictionModal, setShowAgeRestrictionModal] = useState(false);
    const [restrictedUserAge, setRestrictedUserAge] = useState(null);
    const [restrictedCategorySlug, setRestrictedCategorySlug] = useState(null);
    const [restrictionType, setRestrictionType] = useState(null); // 'adult' or 'kids'
    console.log("featuresCrad,", featureCards);

    const categories = [
        { key: "finance", label: "Financial Literacy", color: "from-blue-500 to-cyan-500" },
        { key: "wellness", label: "Brain Health", color: "from-green-500 to-emerald-500" },
        { key: "personal", label: "UVLS (Life Skills & Values)", color: "from-orange-500 to-red-500" },
        { key: "education", label: "Digital Citizenship & Online Safety", color: "from-yellow-500 to-amber-500" },
        { key: "creativity", label: "Moral Values", color: "from-pink-500 to-rose-500" },
        { key: "entertainment", label: "AI for All", color: "from-indigo-500 to-purple-500" },
        { key: "social", label: "Health - Male", color: "from-teal-500 to-cyan-500" },
        { key: "competition", label: "Health - Female", color: "from-red-500 to-orange-500" },
        { key: "rewards", label: "Entrepreneurship & Higher Education", color: "from-lime-500 to-green-500" },
        { key: "shopping", label: "Civic Responsibility & Global Citizenship", color: "from-fuchsia-500 to-purple-500" },
        { key: "sustainability", label: "Sustainability", color: "from-green-500 to-emerald-500" },
        { key: "challenges", label: "Challenges", color: "from-violet-500 to-purple-500" },
    ];

    useEffect(() => {
        // Convert slug back to category
        const category = categories.find(cat => 
            cat.label.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[()&]/g, '')
                .replace(/--+/g, '-') === categorySlug
        );

        if (category) {
            setCategoryInfo(category);
            
            // Special handling for Sustainability category
            if (category.key === 'sustainability') {
                // Create specific game cards for Sustainability
                const sustainabilityCards = [
                    {
                        id: 'sustainability-1',
                        title: 'Solar & City Games',
                        description: 'Learn about solar energy and sustainable cities',
                        icon: '☀️',
                        path: '/games/sustainability/solar-and-city',
                        color: 'bg-yellow-500',
                        category: 'sustainability',
                        xpReward: 45
                    },
                    {
                        id: 'sustainability-2',
                        title: 'Waste & Recycle Games',
                        description: 'Learn about waste conservation and recycling',
                        icon: '💧',
                        path: '/games/sustainability/waste-and-recycle',
                        color: 'bg-blue-500',
                        category: 'sustainability',
                        xpReward: 45
                    },
                    {
                        id: 'sustainability-3',
                        title: 'Carbon & Climate Games',
                        description: 'Learn about carbon footprints and climate change',
                        icon: '🌍',
                        path: '/games/sustainability/carbon-and-climate',
                        color: 'bg-gray-500',
                        category: 'sustainability',
                        xpReward: 45
                    },
                    {
                        id: 'sustainability-4',
                        title: 'Water & Energy Games',
                        description: 'Learn about the connection between water and energy',
                        icon: '⚡',
                        path: '/games/sustainability/water-and-energy',
                        color: 'bg-green-500',
                        category: 'sustainability',
                        xpReward: 45
                    }
                ];
                setFeatureCards(sustainabilityCards);
            } else {
                // Filter cards by category for other categories
                let filtered = mockFeatures.filter((card) => card.category === category.key);
                
                // Special handling for Digital Citizenship & Online Safety category
                // Remove the "Financial Literacy" card to ensure game cards appear first
                if (category.key === 'education' && categorySlug === 'digital-citizenship-online-safety') {
                    filtered = filtered.filter((card) => card.title !== "Financial Literacy");
                }
                
                // Special handling for Health - Female category
                // Remove the "Leaderboard" card
                if (category.key === 'competition' && categorySlug === 'health-female') {
                    filtered = filtered.filter((card) => card.title !== "Leaderboard");
                }
                
                // Special handling for Financial Literacy category
                // Move "Financial Quiz" card to the end
                if (category.key === 'finance' && categorySlug === 'financial-literacy') {
                    const financialQuizCard = filtered.find((card) => card.title === "Financial Quiz");
                    const otherCards = filtered.filter((card) => card.title !== "Financial Quiz");
                    if (financialQuizCard) {
                        filtered = [...otherCards, financialQuizCard];
                    }
                }
                
                setFeatureCards(filtered);
            }
        } else {
            // Invalid category, redirect to dashboard
            navigate('/student/dashboard');
        }
        
        setLoading(false);
    }, [categorySlug, navigate]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (showAgeRestrictionModal) {
            // Save the current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            
            return () => {
                // Restore scroll position when modal closes
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [showAgeRestrictionModal]);

    const handleNavigate = (path, featureTitle) => {
        if (path && typeof path === "string") {
            logActivity({
                activityType: "navigation",
                description: `Navigated to: ${featureTitle || path}`,
                metadata: {
                    featurePath: path,
                    featureTitle: featureTitle,
                    fromPage: `category-${categorySlug}`,
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
            
            navigate(path);
        }
    };

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

    const getGameAccessStatus = () => {
        const userAge = calculateUserAge(user?.dateOfBirth || user?.dob);
        return { userAge };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
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

    if (loading || !categoryInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    {/* Back Button */}
                    <motion.button
                        onClick={() => navigate('/student/dashboard')}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-6 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-gray-800">Back to Dashboard</span>
                    </motion.button>

                    {/* Category Header */}
                    <div className="text-center">
                        <motion.div
                            className={`inline-block bg-gradient-to-r ${categoryInfo.color} text-white px-8 py-4 rounded-3xl shadow-2xl mb-4`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black flex items-center gap-3">
                                <span>{categoryInfo.label}</span>
                                <Sparkles className="w-8 h-8" />
                            </h1>
                        </motion.div>
                        <p className="text-lg text-gray-600 mt-2">
                            Explore {featureCards.length} amazing {featureCards.length === 1 ? 'activity' : 'activities'} in this category
                        </p>
                    </div>
                </motion.div>

                {/* Cards Grid */}
                {featureCards.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {featureCards.map((card, i) => {
                            const cardKey = card.id ? `${card.id}-${i}` : `${card.title}-${card.category}-${i}`;
                            const isGameCard = ['Kids Games', 'Teen Games', 'Adult Games'].includes(card.title);
                            const gameAccess = getGameAccessStatus();
                            const userAge = gameAccess.userAge;
                            
                            let isDisabled = false;
                            let disabledMessage = "";
                            let lockReason = "";
                            
                            if (isGameCard && userAge !== null) {
                                // Check age restrictions for game cards
                                // Below 14: Only Kids and Teen games
                                // 14-17: All games (Kids, Teen, Adult)
                                // 18+: Only Teen and Adult games
                                if (card.title === "Adult Games" && userAge < 14) {
                                    isDisabled = true;
                                    disabledMessage = "Age restriction applies";
                                    lockReason = "14+";
                                } else if (card.title === "Teen Games" && userAge < 13) {
                                    isDisabled = true;
                                    disabledMessage = "Age restriction applies";
                                    lockReason = "13+";
                                } else if (card.title === "Kids Games" && userAge >= 18) {
                                    isDisabled = true;
                                    disabledMessage = "Available for learners under 18";
                                    lockReason = "Under 18";
                                }
                            }
                            
                            return (
                                <motion.div
                                    key={cardKey}
                                    variants={itemVariants}
                                    whileHover={isDisabled ? {} : {
                                        scale: 1.05,
                                        y: -8,
                                        transition: { duration: 0.2 },
                                    }}
                                    whileTap={isDisabled ? {} : { scale: 0.95 }}
                                    className={`group relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={() => {
                                        if (isDisabled) {
                                            // Show professional modal for age restrictions
                                            if (card.title === "Adult Games" && userAge !== null && userAge < 14) {
                                                setRestrictedUserAge(userAge);
                                                setRestrictedCategorySlug(categorySlug);
                                                setRestrictionType('adult');
                                                setShowAgeRestrictionModal(true);
                                            } else if (card.title === "Kids Games" && userAge !== null && userAge >= 18) {
                                                setRestrictedUserAge(userAge);
                                                setRestrictedCategorySlug(categorySlug);
                                                setRestrictionType('kids');
                                                setShowAgeRestrictionModal(true);
                                            } else {
                                                toast.error(disabledMessage, {
                                                    duration: 4000,
                                                    position: "bottom-center",
                                                    icon: "🔒"
                                                });
                                            }
                                            return;
                                        }
                                        
                                        toast.success(`Loading ${card.title}...`, {
                                            duration: 2000,
                                            position: "bottom-center",
                                            icon: "🚀"
                                        });
                                        handleNavigate(card.path, card.title);
                                    }}
                                >
                                    <div className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 transition-all duration-300 relative overflow-hidden h-full ${
                                        isDisabled 
                                            ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300' 
                                            : 'hover:shadow-2xl'
                                    }`}>
                                        {isDisabled && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center z-10">
                                                <div className="bg-black/20 backdrop-blur-sm rounded-full p-4 flex flex-col items-center">
                                                    <Lock className="w-8 h-8 text-white" />
                                                    {lockReason && (
                                                        <span className="text-white text-xs mt-1 font-medium">{lockReason}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-r from-${card.color.replace('bg-', '')} to-${card.color.replace('bg-', '')}/70 opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                        />

                                        <div className="relative z-10 flex flex-col items-center text-center h-full">
                                            <motion.div
                                                className={`w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                                                    isDisabled ? 'grayscale opacity-70' : ''
                                                }`}
                                                whileHover={isDisabled ? {} : { rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <span className="text-2xl">{card.icon}</span>
                                            </motion.div>

                                            <h3 className={`text-lg font-bold mb-2 ${
                                                isDisabled ? 'text-gray-500' : 'text-gray-800'
                                            }`}>
                                                {card.title}
                                            </h3>

                                            <p className={`text-sm mb-4 flex-1 ${
                                                isDisabled ? 'text-gray-500' : 'text-gray-600'
                                            }`}>
                                                {card.description}
                                            </p>

                                            <div className="flex items-center justify-between w-full">
                                                <div className={`flex items-center gap-1 text-xs font-semibold ${
                                                    isDisabled ? 'text-gray-500' : 'text-indigo-600'
                                                }`}>
                                                    <Zap className="w-4 h-4" />
                                                    <span>+{card.xpReward} XP</span>
                                                </div>
                                                {isDisabled ? (
                                                    <Lock className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <Star className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">No activities found</h3>
                        <p className="text-gray-500">Check back soon for more content!</p>
                    </motion.div>
                )}

                {/* Motivational Footer */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg animate-pulse">
                        <Sparkles className="w-6 h-6" />
                        <span>Keep learning and growing! 🚀</span>
                        <Sparkles className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Age Restriction Modal */}
            <AnimatePresence>
                {showAgeRestrictionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAgeRestrictionModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-red-200 relative overflow-hidden"
                        >
                            {/* Red Warning Header */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-full">
                                        <AlertTriangle className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Age Restriction Notice</h3>
                                </div>
                                <button
                                    onClick={() => setShowAgeRestrictionModal(false)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="mb-4">
                                    {restrictionType === 'adult' ? (
                                        <>
                                            <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                Thank you for your interest in accessing our Adult Games content{categoryInfo ? ` in ${categoryInfo.label}` : ''}. 
                                                We appreciate your enthusiasm for learning!
                                            </p>
                                            <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                <strong className="text-red-600">Age Requirement:</strong> This content is 
                                                designed for users who are <strong>14 years of age or older</strong>. 
                                                Our age restrictions are in place to ensure that all content is 
                                                age-appropriate and aligns with educational standards.
                                            </p>
                                            {restrictedUserAge !== null && (
                                                <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                    Your current age is <strong className="text-red-600">{restrictedUserAge} years</strong>. 
                                                    You will be eligible to access this content when you reach 14 years of age.
                                                </p>
                                            )}
                                            <p className="text-gray-700 text-base leading-relaxed">
                                                In the meantime, we encourage you to explore our <strong>Kids Games</strong> and 
                                                <strong> Teen Games</strong> sections{categoryInfo ? ` in ${categoryInfo.label}` : ''}, which are specifically tailored to your age group 
                                                and offer engaging, educational experiences designed to support your learning journey.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                Thank you for your interest in accessing our Kids Games content{categoryInfo ? ` in ${categoryInfo.label}` : ''}. 
                                                We appreciate your enthusiasm for learning!
                                            </p>
                                            <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                <strong className="text-red-600">Age Requirement:</strong> This content is 
                                                specifically designed for learners <strong>under 18 years of age</strong>. 
                                                Our age restrictions are in place to ensure that all content is 
                                                age-appropriate and aligns with educational standards for younger learners.
                                            </p>
                                            {restrictedUserAge !== null && (
                                                <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                    Your current age is <strong className="text-red-600">{restrictedUserAge} years</strong>. 
                                                    This content is optimized for younger learners and may not provide the appropriate 
                                                    level of challenge or engagement for your age group.
                                                </p>
                                            )}
                                            <p className="text-gray-700 text-base leading-relaxed">
                                                We encourage you to explore our <strong>Teen Games</strong> and 
                                                <strong> Adult Games</strong> sections{categoryInfo ? ` in ${categoryInfo.label}` : ''}, which are specifically tailored to your age group 
                                                and offer more advanced, engaging educational experiences designed to support your learning journey.
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowAgeRestrictionModal(false);
                                            if (restrictedCategorySlug) {
                                                navigate(`/student/dashboard/${restrictedCategorySlug}`);
                                            } else {
                                                navigate('/student/dashboard');
                                            }
                                        }}
                                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        {restrictionType === 'adult' ? 'Explore Kids & Teen Games' : 'Explore Teen & Adult Games'}
                                    </button>
                                    <button
                                        onClick={() => setShowAgeRestrictionModal(false)}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}