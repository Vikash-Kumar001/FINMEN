import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    Check,
    X,
    Trash2,
    CheckCheck,
    Info,
    AlertCircle,
    AlertTriangle,
    Trophy,
    Sparkles,
    Clock,
    Filter,
    MoreVertical,
    Bookmark,
    Star,
    Zap,
    Gift,
    Target,
    Crown,
    Heart,
    Calendar,
    MessageCircle,
    Award,
    TrendingUp,
    Flame,
    Shield,
    RefreshCw
} from "lucide-react";
// Using fetch API for requests

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [error, setError] = useState(null);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [showActions, setShowActions] = useState(false);

    // Notification type configurations
    const notificationTypes = {
        info: {
            icon: Info,
            color: "blue",
            bgGradient: "from-blue-50 to-indigo-50",
            iconBg: "from-blue-500 to-indigo-500",
            borderColor: "border-blue-200"
        },
        success: {
            icon: Trophy,
            color: "green",
            bgGradient: "from-green-50 to-emerald-50",
            iconBg: "from-green-500 to-emerald-500",
            borderColor: "border-green-200"
        },
        warning: {
            icon: AlertTriangle,
            color: "yellow",
            bgGradient: "from-yellow-50 to-orange-50",
            iconBg: "from-yellow-500 to-orange-500",
            borderColor: "border-yellow-200"
        },
        alert: {
            icon: AlertCircle,
            color: "red",
            bgGradient: "from-red-50 to-rose-50",
            iconBg: "from-red-500 to-rose-500",
            borderColor: "border-red-200"
        }
    };

    // Enhanced notification icons based on content
    const getNotificationIcon = (notification) => {
        const message = notification.message.toLowerCase();

        if (message.includes('level') || message.includes('achievement')) return Trophy;
        if (message.includes('streak')) return Flame;
        if (message.includes('reward') || message.includes('coin')) return Gift;
        if (message.includes('challenge')) return Target;
        if (message.includes('rank')) return Crown;
        if (message.includes('mood')) return Heart;
        if (message.includes('reminder')) return Calendar;
        if (message.includes('friend') || message.includes('message')) return MessageCircle;
        if (message.includes('badge')) return Award;
        if (message.includes('progress')) return TrendingUp;
        if (message.includes('milestone')) return Star;
        if (message.includes('bonus')) return Zap;
        if (message.includes('protection')) return Shield;

        return notificationTypes[notification.type]?.icon || Bell;
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API}/notifications`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data || []);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
            setError("Failed to load notifications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API}/notifications/${notificationId}/read`, {
                method: 'PATCH',
                credentials: 'include'
            });

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
                );
            }
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API}/notifications/mark-all-read`, {
                method: 'PATCH',
                credentials: 'include'
            });

            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            }
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API}/notifications/${notificationId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(n => n._id !== notificationId));
            }
        } catch (err) {
            console.error("Failed to delete notification", err);
        }
    };

    // Delete selected notifications
    const deleteSelectedNotifications = async () => {
        try {
            const deletePromises = selectedNotifications.map(id =>
                fetch(`${import.meta.env.VITE_API}/notifications/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
            );

            await Promise.all(deletePromises);
            setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n._id)));
            setSelectedNotifications([]);
            setShowActions(false);
        } catch (err) {
            console.error("Failed to delete notifications", err);
        }
    };

    // Toggle notification selection
    const toggleSelection = (notificationId) => {
        setSelectedNotifications(prev =>
            prev.includes(notificationId)
                ? prev.filter(id => id !== notificationId)
                : [...prev, notificationId]
        );
    };

    // Filter notifications
    const filteredNotifications = notifications.filter(notification => {
        if (filter === "all") return true;
        if (filter === "unread") return !notification.isRead;
        if (filter === "read") return notification.isRead;
        return notification.type === filter;
    });

    // Get unread count
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        setShowActions(selectedNotifications.length > 0);
    }, [selectedNotifications]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
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
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <div className="relative inline-block">
                        <h1 className="text-4xl sm:text-5xl font-black mb-3 flex items-center justify-center gap-2 text-center">
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Notifications
                            </span>
                            <span className="text-black dark:text-white">📢</span>
                        </h1>

                        {unreadCount > 0 && (
                            <motion.div
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                            >
                                {unreadCount}
                            </motion.div>
                        )}
                    </div>
                    <p className="text-gray-600 text-lg font-medium">
                        Stay up to date with your gaming journey 🎮
                    </p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            {["all", "unread", "read", "info", "success", "warning", "alert"].map((filterType) => (
                                <motion.button
                                    key={filterType}
                                    onClick={() => setFilter(filterType)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all ${filter === filterType
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {filterType === "all" ? "All" : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                                    {filterType === "unread" && unreadCount > 0 && (
                                        <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <motion.button
                                onClick={fetchNotifications}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-semibold"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </motion.button>
                            {unreadCount > 0 && (
                                <motion.button
                                    onClick={markAllAsRead}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Mark All Read
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    <AnimatePresence>
                        {showActions && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600 font-medium">
                                        {selectedNotifications.length} selected
                                    </span>
                                    <motion.button
                                        onClick={deleteSelectedNotifications}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-semibold"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Selected
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setSelectedNotifications([])}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-semibold"
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Notifications List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {loading ? (
                        // Loading skeletons
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
                        >
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                            <p className="text-red-600 mb-4">{error}</p>
                            <motion.button
                                onClick={fetchNotifications}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-semibold"
                            >
                                Try Again
                            </motion.button>
                        </motion.div>
                    ) : filteredNotifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/50"
                        >
                            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Bell className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">All caught up! 🎉</h3>
                            <p className="text-gray-600 text-lg">
                                {filter === "all"
                                    ? "No notifications yet. Keep playing to earn achievements!"
                                    : `No ${filter} notifications found.`}
                            </p>
                        </motion.div>
                    ) : (
                        filteredNotifications.map((notification) => {
                            const NotificationIcon = getNotificationIcon(notification);
                            const typeConfig = notificationTypes[notification.type];
                            const isSelected = selectedNotifications.includes(notification._id);

                            return (
                                <motion.div
                                    key={notification._id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`bg-gradient-to-r ${typeConfig.bgGradient} backdrop-blur-sm rounded-2xl p-6 shadow-xl border ${typeConfig.borderColor} ${!notification.isRead ? 'ring-2 ring-indigo-200' : ''
                                        } ${isSelected ? 'ring-2 ring-purple-400' : ''} transition-all duration-300 cursor-pointer`}
                                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Selection Checkbox */}
                                        <motion.div
                                            className="flex-shrink-0 mt-1"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelection(notification._id)}
                                                className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </motion.div>

                                        {/* Notification Icon */}
                                        <motion.div
                                            className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${typeConfig.iconBg} rounded-xl flex items-center justify-center text-white shadow-lg`}
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <NotificationIcon className="w-6 h-6" />
                                        </motion.div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-gray-800 font-medium leading-relaxed ${!notification.isRead ? 'font-semibold' : ''
                                                }`}>
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-500">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </span>
                                                {!notification.isRead && (
                                                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
                                                        <Sparkles className="w-3 h-3" />
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {!notification.isRead && (
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(notification._id);
                                                    }}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </motion.button>
                                            )}
                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification._id);
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                                title="Delete notification"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>

                {/* Fun Footer */}
                {!loading && filteredNotifications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-center mt-10"
                    >
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                            <Trophy className="w-6 h-6" />
                            <span>You're all caught up! Keep being awesome! 🌟</span>
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Notifications;