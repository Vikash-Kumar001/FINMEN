import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Rocket,
    Zap,
    Flame,
    ChevronRight,
    Play,
    Target,
    Award,
    Calendar
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const QuickStart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [xpEarned, setXpEarned] = useState(0);
    const [activitiesCompleted, setActivitiesCompleted] = useState(2);
    
    const [favoriteActivities, setFavoriteActivities] = useState([]);

    useEffect(() => {
        // Fetch user data and favorite activities from API
        const fetchData = async () => {
            try {
                // Fetch user stats
                const statsResponse = await api.get('/api/student/stats');
                setXpEarned(statsResponse.data.weeklyXp || 0);
                setActivitiesCompleted(statsResponse.data.dailyActivitiesCompleted || 0);
                
                // Fetch favorite activities
                const activitiesResponse = await api.get('/api/student/favorite-activities');
                const activitiesData = activitiesResponse.data;
                
                // Map the icons based on activity type
                const activitiesWithIcons = activitiesData.map(activity => {
                    let icon;
                    switch(activity.type) {
                        case 'mood':
                            icon = <Flame className="w-6 h-6 text-orange-500" />;
                            break;
                        case 'games':
                            icon = <Play className="w-6 h-6 text-purple-500" />;
                            break;
                        case 'journal':
                            icon = <Target className="w-6 h-6 text-blue-500" />;
                            break;
                        default:
                            icon = <Zap className="w-6 h-6 text-green-500" />;
                    }
                    return { ...activity, icon };
                });
                
                setFavoriteActivities(activitiesWithIcons);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Set default values if fetch fails
                setFavoriteActivities([]);
            }
        };
        
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Quick Start
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Jump into your favorite activities and track your progress
                </p>
            </motion.div>

            {/* Favorite Activities Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Jump into your favorite activity
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {favoriteActivities.map((activity, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`bg-gradient-to-r ${activity.gradient} rounded-xl p-5 text-white cursor-pointer shadow-lg`}
                            onClick={() => navigate(activity.path)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/20 rounded-lg p-2">
                                    {activity.icon}
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/70" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">{activity.title}</h3>
                            <p className="text-sm text-white/80">{activity.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-medium shadow-md inline-flex items-center"
                        onClick={() => navigate("/student/dashboard")}
                    >
                        <Rocket className="w-4 h-4 mr-2" />
                        Start Now
                    </motion.button>
                </div>
            </motion.div>

            {/* Weekly Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                >
                    <div className="flex items-center mb-4">
                        <Calendar className="w-5 h-5 text-indigo-500 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            This Week
                        </h2>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                                XP earned
                            </p>
                            <div className="flex items-center">
                                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                                    +{xpEarned} XP
                                </span>
                            </div>
                        </div>
                        
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full px-4 py-2">
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                Week {Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 52 + 1}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Daily Goal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Flame className="w-5 h-5 text-orange-500 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Daily Goal
                            </h2>
                        </div>
                        
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-full px-4 py-2">
                            <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                🔥 Great job!
                            </span>
                        </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        Complete 3 activities
                    </p>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" 
                            style={{ width: `${(activitiesCompleted / 3) * 100}%` }}
                        ></div>
                    </div>
                    
                    <div className="mt-2 text-right">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {activitiesCompleted}/3 Done
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default QuickStart;