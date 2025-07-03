import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    TrendingUp,
    Award,
    Zap,
    Heart,
    Star,
    Gift,
    Users,
    Activity,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Mock data
const mockUser = {
    name: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    level: 12,
    title: "Wellness Champion"
};

const mockStats = {
    totalPoints: 15420,
    weeklyPoints: 340,
    streakDays: 28,
    completedGoals: 47,
    totalGoals: 52,
    mood: 8.2,
    energy: 85,
    productivity: 92,
    wellnessScore: 88,
    weeklyData: [
        { day: 'Mon', mood: 7, energy: 80, productivity: 85 },
        { day: 'Tue', mood: 8, energy: 85, productivity: 90 },
        { day: 'Wed', mood: 6, energy: 70, productivity: 75 },
        { day: 'Thu', mood: 9, energy: 95, productivity: 98 },
        { day: 'Fri', mood: 8, energy: 85, productivity: 88 },
        { day: 'Sat', mood: 9, energy: 90, productivity: 80 },
        { day: 'Sun', mood: 8, energy: 88, productivity: 85 }
    ],
    achievements: [
        { id: 1, name: "Perfect Week", icon: "🏆", color: "#FFD700", earned: true },
        { id: 2, name: "Early Bird", icon: "🌅", color: "#FF6B6B", earned: true },
        { id: 3, name: "Mood Master", icon: "😊", color: "#4ECDC4", earned: true },
        { id: 4, name: "Goal Crusher", icon: "🎯", color: "#45B7D1", earned: false }
    ],
    recentActivities: [
        { id: 1, action: "Completed morning meditation", time: "2 hours ago", points: 50 },
        { id: 2, action: "Logged mood check-in", time: "3 hours ago", points: 25 },
        { id: 3, action: "Finished daily workout", time: "1 day ago", points: 100 },
    ]
};

const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp size={16} />
                    <span>{Math.abs(trend)}%</span>
                </div>
            )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && <p className="text-sm text-gray-500 mt-1">{change}</p>}
    </motion.div>
);

const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = "#4F46E5" }) => {
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{progress}%</span>
            </div>
        </div>
    );
};

const ActivityFeed = ({ activities }) => (
    <div className="space-y-4">
        {activities.map((activity) => (
            <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div className="text-sm font-semibold text-green-600">+{activity.points}</div>
            </motion.div>
        ))}
    </div>
);

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex flex-col items-center gap-3 p-6 rounded-2xl ${color} text-white hover:shadow-lg transition-all duration-300`}
    >
        <Icon size={28} />
        <span className="font-medium">{label}</span>
    </motion.button>
);

export default function StudentDashboard() {
    const [notifications, setNotifications] = useState(3);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.6
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Points"
                        value={mockStats.totalPoints.toLocaleString()}
                        change="+340 this week"
                        icon={Zap}
                        color="bg-gradient-to-r from-blue-500 to-blue-600"
                        trend={12}
                    />
                    <StatCard
                        title="Current Streak"
                        value={`${mockStats.streakDays} days`}
                        change="Personal best!"
                        icon={Target}
                        color="bg-gradient-to-r from-green-500 to-green-600"
                        trend={8}
                    />
                    <StatCard
                        title="Goals Completed"
                        value={`${mockStats.completedGoals}/${mockStats.totalGoals}`}
                        change="90% completion rate"
                        icon={Award}
                        color="bg-gradient-to-r from-purple-500 to-purple-600"
                        trend={5}
                    />
                    <StatCard
                        title="Wellness Score"
                        value={mockStats.wellnessScore}
                        change="Excellent!"
                        icon={Heart}
                        color="bg-gradient-to-r from-pink-500 to-pink-600"
                        trend={15}
                    />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Weekly Progress Chart */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Weekly Progress</h2>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-600">Mood</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">Energy</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <span className="text-gray-600">Productivity</span>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mockStats.weeklyData}>
                                <XAxis dataKey="day" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Line
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="energy"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="productivity"
                                    stroke="#8B5CF6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Wellness Score */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Wellness Score</h2>
                        <div className="flex flex-col items-center">
                            <ProgressRing
                                progress={mockStats.wellnessScore}
                                color="#4F46E5"
                                size={140}
                            />
                            <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">{mockStats.mood}</div>
                                    <div className="text-xs text-gray-500">Mood</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">{mockStats.energy}</div>
                                    <div className="text-xs text-gray-500">Energy</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-600">{mockStats.productivity}</div>
                                    <div className="text-xs text-gray-500">Focus</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Achievements */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {mockStats.achievements.map((achievement) => (
                                <motion.div
                                    key={achievement.id}
                                    whileHover={{ scale: 1.05 }}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${achievement.earned
                                            ? 'border-gray-200 bg-gradient-to-br from-gray-50 to-white'
                                            : 'border-dashed border-gray-300 bg-gray-50 opacity-60'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{achievement.icon}</div>
                                    <h3 className="font-medium text-gray-900 text-sm">{achievement.name}</h3>
                                    {achievement.earned && (
                                        <div className="flex items-center gap-1 mt-2">
                                            <Star size={12} className="text-yellow-500 fill-current" />
                                            <span className="text-xs text-gray-500">Earned</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <ActivityFeed activities={mockStats.recentActivities} />
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <QuickAction
                            icon={Heart}
                            label="Mood Check"
                            color="bg-gradient-to-r from-pink-500 to-rose-500"
                            onClick={() => console.log('Mood check')}
                        />
                        <QuickAction
                            icon={Activity}
                            label="Log Activity"
                            color="bg-gradient-to-r from-blue-500 to-indigo-500"
                            onClick={() => console.log('Log activity')}
                        />
                        <QuickAction
                            icon={Gift}
                            label="Rewards"
                            color="bg-gradient-to-r from-yellow-500 to-orange-500"
                            onClick={() => console.log('Rewards')}
                        />
                        <QuickAction
                            icon={Users}
                            label="Community"
                            color="bg-gradient-to-r from-green-500 to-emerald-500"
                            onClick={() => console.log('Community')}
                        />
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}