import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    BarChart3,
    Clock,
    Zap,
    Award,
    Target,
    CheckCircle,
    TrendingUp,
    Star,
    ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const ThisWeek = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [xpEarned, setXpEarned] = useState(0);
    const [weeklyActivities, setWeeklyActivities] = useState([]);
    const [weeklyGoals, setWeeklyGoals] = useState([]);
    
    // Days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // Adjust Sunday from 0 to 6
    
    useEffect(() => {
        // Fetch user data from API
        const fetchData = async () => {
            try {
                // Fetch weekly activities
                const activitiesResponse = await api.get('/api/student/weekly-activities');
                setWeeklyActivities(activitiesResponse.data);
                
                // Fetch weekly goals
                const goalsResponse = await api.get('/api/student/weekly-goals');
                const goalsData = goalsResponse.data;
                
                // Map the icons based on goal type
                const goalsWithIcons = goalsData.map(goal => {
                    let icon;
                    switch(goal.type) {
                        case 'activities':
                            icon = <Target className="w-5 h-5 text-purple-500" />;
                            break;
                        case 'xp':
                            icon = <Zap className="w-5 h-5 text-yellow-500" />;
                            break;
                        case 'mood':
                            icon = <Star className="w-5 h-5 text-orange-500" />;
                            break;
                        default:
                            icon = <CheckCircle className="w-5 h-5 text-blue-500" />;
                    }
                    return { ...goal, icon };
                });
                
                setWeeklyGoals(goalsWithIcons);
            } catch (error) {
                console.error('Error fetching weekly data:', error);
                // Set empty arrays if fetch fails
                setWeeklyActivities([]);
                setWeeklyGoals([]);
            }
        };
        
        fetchData();
    }, [currentDayIndex]);

    // Calculate total XP whenever weeklyActivities changes
    useEffect(() => {
        const totalXP = weeklyActivities.reduce((sum, activity) => sum + activity.xp, 0);
        setXpEarned(totalXP);
    }, [weeklyActivities]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    This Week
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Track your weekly progress and achievements
                </p>
            </motion.div>

            {/* Weekly Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
            >
                <div className="flex items-center mb-6">
                    <Calendar className="w-6 h-6 text-indigo-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Weekly Summary
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* XP Earned */}
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/20 rounded-lg p-2">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium bg-white/20 rounded-full px-3 py-1">
                                This Week
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">+{xpEarned} XP</h3>
                        <p className="text-sm text-white/80">earned so far</p>
                    </div>

                    {/* Streak */}
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-5 text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/20 rounded-lg p-2">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium bg-white/20 rounded-full px-3 py-1">
                                Streak
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{user?.streak || 0} Days</h3>
                        <p className="text-sm text-white/80">current streak</p>
                    </div>

                    {/* Achievements */}
                    <div className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl p-5 text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/20 rounded-lg p-2">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium bg-white/20 rounded-full px-3 py-1">
                                Achievements
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{user?.newAchievements || 0} New</h3>
                        <p className="text-sm text-white/80">unlocked this week</p>
                    </div>
                </div>
            </motion.div>

            {/* Daily Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
            >
                <div className="flex items-center mb-6">
                    <BarChart3 className="w-6 h-6 text-indigo-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Daily Activity
                    </h2>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {weeklyActivities.map((day, index) => (
                        <div 
                            key={index} 
                            className={`flex flex-col items-center p-3 rounded-lg ${index === currentDayIndex ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700/30'}`}
                        >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {day.day.substring(0, 3)}
                            </span>
                            <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${day.completed ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}
                            >
                                {day.completed ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <Clock className="w-5 h-5" />
                                )}
                            </div>
                            <span className={`text-xs font-medium ${day.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {day.completed ? `+${day.xp} XP` : 'Pending'}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Weekly Goals */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            >
                <div className="flex items-center mb-6">
                    <Target className="w-6 h-6 text-indigo-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Weekly Goals
                    </h2>
                </div>

                <div className="space-y-5">
                    {weeklyGoals.map((goal, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="mr-3">
                                        {goal.icon}
                                    </div>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {goal.title}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {goal.progress}/{goal.total}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div 
                                    className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2.5 rounded-full" 
                                    style={{ width: `${(goal.progress / goal.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium shadow-md inline-flex items-center"
                        onClick={() => navigate("/student/dashboard")}
                    >
                        View All Activities
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default ThisWeek;