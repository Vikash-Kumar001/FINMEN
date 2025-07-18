import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Flame,
    Award,
    CheckCircle,
    Clock,
    Zap,
    Target,
    ChevronRight,
    Calendar,
    TrendingUp
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { logActivity } from "../../services/activityService";
import { toast } from "react-toastify";
import api from "../../utils/api";

const DailyGoal = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activitiesCompleted, setActivitiesCompleted] = useState(2);
    const [dailyActivities, setDailyActivities] = useState([]);
    
    useEffect(() => {
        // Log page view when component mounts
        logActivity({
            activityType: "page_view",
            description: "Viewed daily goals page"
        });
        
        // Fetch daily activities from API
        const fetchData = async () => {
            try {
                // In a real app, replace with actual API call
                const response = await api.get('/api/student/daily-activities');
                setDailyActivities(response.data);
                
                // Count completed activities
                const completed = response.data.filter(activity => activity.completed).length;
                setActivitiesCompleted(completed);
            } catch (error) {
                console.error('Error fetching daily activities:', error);
                // Set empty array if fetch fails
                setDailyActivities([]);
                setActivitiesCompleted(0);
            }
        };
        
        fetchData();
    }, []);

    // Update completed count when activities change
    useEffect(() => {
        const completed = dailyActivities.filter(activity => activity.completed).length;
        setActivitiesCompleted(completed);
    }, [dailyActivities]);

    // Function to toggle activity completion (for demo purposes)
    const toggleActivityCompletion = (index) => {
        const updatedActivities = [...dailyActivities];
        const activity = updatedActivities[index];
        const newCompletionStatus = !activity.completed;
        activity.completed = newCompletionStatus;
        setDailyActivities(updatedActivities);
        
        // Log activity completion or un-completion
        logActivity({
            activityType: "learning_activity",
            description: newCompletionStatus 
                ? `Completed daily activity: ${activity.title}` 
                : `Unmarked daily activity: ${activity.title}`,
            metadata: {
                action: newCompletionStatus ? "complete_daily_activity" : "unmark_daily_activity",
                activityTitle: activity.title,
                activityXP: activity.xp,
                dailyProgress: {
                    completed: newCompletionStatus 
                        ? activitiesCompleted + 1 
                        : activitiesCompleted - 1,
                    total: 3
                }
            }
        });
        
        // Show toast notification
        if (newCompletionStatus) {
            toast.success(`Activity completed: ${activity.title}`);
            
            // Check if all activities are completed
            if (activitiesCompleted + 1 >= 3) {
                // Log streak increase
                logActivity({
                    activityType: "achievement",
                    description: "Completed all daily activities",
                    metadata: {
                        action: "complete_daily_goal",
                        streakDays: 5, // This would be dynamic in a real app
                        xpEarned: updatedActivities.reduce((sum, act) => sum + act.xp, 0)
                    }
                });
                
                toast.success("🎉 Congratulations! You've completed all daily activities!");
            }
        } else {
            toast.info(`Activity unmarked: ${activity.title}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Daily Goal
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Track your daily activities and achievements
                </p>
            </motion.div>

            {/* Daily Progress Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Flame className="w-6 h-6 text-orange-500 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Daily Progress
                        </h2>
                    </div>
                    
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full px-4 py-2">
                        <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            🔥 Great job!
                        </span>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Complete 3 activities today
                </p>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${(activitiesCompleted / 3) * 100}%` }}
                    ></div>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {activitiesCompleted}/3 Done
                    </span>
                    
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Today's Activities */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
            >
                <div className="flex items-center mb-6">
                    <Target className="w-6 h-6 text-indigo-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Today's Activities
                    </h2>
                </div>

                <div className="space-y-4">
                    {dailyActivities.map((activity, index) => (
                        <motion.div 
                            key={index}
                            whileHover={{ scale: 1.01 }}
                            className={`border ${activity.completed ? 'border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 cursor-pointer`}
                            onClick={() => toggleActivityCompletion(index)}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${activity.gradient} flex items-center justify-center mr-4`}>
                                        {activity.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800 dark:text-white">{activity.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className="mr-4 text-right">
                                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 block">+{activity.xp} XP</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{activity.completed ? 'Completed' : 'Pending'}</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.completed ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                        {activity.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium shadow-md inline-flex items-center"
                        onClick={() => {
                            // Log navigation to dashboard
                            logActivity({
                                activityType: "navigation",
                                description: "Navigated from daily goals to dashboard",
                                metadata: {
                                    from: "daily_goals",
                                    to: "dashboard"
                                }
                            });
                            navigate("/student/dashboard");
                        }}
                    >
                        View All Activities
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </motion.button>
                </div>
            </motion.div>

            {/* Streak Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            >
                <div className="flex items-center mb-6">
                    <TrendingUp className="w-6 h-6 text-indigo-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Your Streak
                    </h2>
                </div>

                <div className="flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">5</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">days</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Keep up the good work! You're on a 5-day streak.
                    </p>
                    <span className="text-sm text-indigo-600 dark:text-indigo-400">
                        Complete today's activities to maintain your streak!
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default DailyGoal;