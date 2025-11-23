import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Settings as SettingsIcon,
    User,
    Key,
    Shield,
    Eye,
    EyeOff,
    Bell,
    Palette,
    Volume2,
    Smartphone,
    Shield as ShieldIcon,
    ChevronRight,
    Check,
    AlertCircle,
    Crown,
    Sparkles,
    Users,
    Copy,
    Link as LinkIcon,
    CheckCircle
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import { useSocket } from '../context/SocketContext';

const Settings = () => {
    const { user, setUser } = useAuth();
    const socketContext = useSocket();
    const socket = socketContext?.socket || null;
    const [form, setForm] = useState({
        name: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [preferences, setPreferences] = useState({
        notifications: true,
        sounds: true,
        language: "english",
        autoSave: true,
        privacy: "friends"
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        achievementUpdates: true,
        weeklySummaries: true,
        systemAnnouncements: true,
        dailyReminders: true,
        newRewards: true,
        friendActivity: false
    });

    const [loading, setLoading] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [linkingCode, setLinkingCode] = useState(null);
    const [parentLinkingCode, setParentLinkingCode] = useState("");
    const [linkedParents, setLinkedParents] = useState([]);
    const [linkingLoading, setLinkingLoading] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    // Fetch settings from backend
    useEffect(() => {
        fetchSettings();
    }, [user]);

    const fetchSettings = async () => {
        try {
            setSettingsLoading(true);
            const [settingsRes, profileRes] = await Promise.all([
                api.get('/api/user/settings').catch(() => ({ data: {} })),
                api.get('/api/user/profile').catch(() => ({ data: null }))
            ]);

            // Update form with user data
            if (profileRes.data) {
                setForm(prev => ({
                    ...prev,
                    name: profileRes.data.name || profileRes.data.fullName || user?.name || ""
                }));
            }

            // Update preferences from backend settings
            if (settingsRes.data?.settings) {
                const settings = settingsRes.data.settings;
                
                // Update notification settings
                if (settings.notifications) {
                    const digestFreq = settings.notifications.digestFrequency || 'daily';
                    setNotificationSettings(prev => ({
                        ...prev,
                        emailNotifications: settings.notifications.emailNotifications ?? true,
                        pushNotifications: settings.notifications.pushNotifications ?? true,
                        achievementUpdates: settings.notifications.notifyOnWellbeing ?? true,
                        weeklySummaries: digestFreq === 'weekly',
                        systemAnnouncements: settings.notifications.notifyOnSystemUpdates ?? true,
                        dailyReminders: digestFreq === 'daily',
                        newRewards: settings.notifications.notifyOnApproval ?? true,
                        friendActivity: settings.notifications.notifyOnNewStudent ?? false
                    }));
                }

                // Update display/preferences
                if (settings.display) {
                    setPreferences(prev => ({
                        ...prev,
                        sounds: settings.display.soundEffects ?? true,
                        language: settings.display.language || "english",
                        autoSave: settings.display.autoSave ?? true,
                        privacy: settings.privacy?.profileVisibility ? "public" : "private"
                    }));
                }

                // Update privacy settings
                if (settings.privacy) {
                    const profileVisibility = settings.privacy.profileVisibility;
                    setPreferences(prev => ({
                        ...prev,
                        privacy: profileVisibility === true ? "public" : profileVisibility === false ? "private" : "friends"
                    }));
                }
            } else if (user?.preferences) {
                // Fallback to user preferences if settings API fails
                setPreferences(user.preferences);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setSettingsLoading(false);
        }
    };

    useEffect(() => {
        if (form.newPassword) {
            calculatePasswordStrength(form.newPassword);
        } else {
            setPasswordStrength(0);
        }
    }, [form.newPassword]);

    // Fetch linking code and linked parents for school_students
    useEffect(() => {
        if (user?.role === 'school_student') {
            fetchLinkingData();
        }
    }, [user]);

    // Real-time settings updates via socket
    useEffect(() => {
        if (!socket) return;

        const handleSettingsUpdate = (data) => {
            if (data.userId === user?._id) {
                console.log('🔧 Settings updated via socket:', data);
                
                // Update the appropriate state based on section
                if (data.section === 'notifications') {
                    if (data.key === 'digestFrequency') {
                        // Handle digestFrequency specially
                        setNotificationSettings(prev => ({
                            ...prev,
                            weeklySummaries: data.value === 'weekly',
                            dailyReminders: data.value === 'daily'
                        }));
                    } else {
                        // Map backend keys to frontend keys
                        const keyMap = {
                            'notifyOnWellbeing': 'achievementUpdates',
                            'notifyOnSystemUpdates': 'systemAnnouncements',
                            'notifyOnApproval': 'newRewards',
                            'notifyOnNewStudent': 'friendActivity'
                        };
                        const frontendKey = keyMap[data.key] || data.key;
                        setNotificationSettings(prev => ({
                            ...prev,
                            [frontendKey]: data.value
                        }));
                    }
                } else if (data.section === 'display') {
                    if (data.key === 'soundEffects') {
                        setPreferences(prev => ({ ...prev, sounds: data.value }));
                    } else if (data.key === 'language') {
                        setPreferences(prev => ({ ...prev, language: data.value }));
                    } else if (data.key === 'autoSave') {
                        setPreferences(prev => ({ ...prev, autoSave: data.value }));
                    }
                } else if (data.section === 'privacy') {
                    if (data.key === 'profileVisibility') {
                        setPreferences(prev => ({
                            ...prev,
                            privacy: data.value ? 'public' : 'private'
                        }));
                    }
                }
            }
        };

        socket.on('settings:updated', handleSettingsUpdate);

        return () => {
            socket.off('settings:updated', handleSettingsUpdate);
        };
    }, [socket, user?._id]);

    const fetchLinkingData = async () => {
        try {
            const profileRes = await api.get('/api/user/profile');
            if (profileRes.data?.linkingCode) {
                setLinkingCode(profileRes.data.linkingCode);
            } else {
                // If no linking code exists, try to generate one by updating the profile
                // The backend will generate it automatically
                try {
                    const updateRes = await api.put('/api/user/profile', {});
                    if (updateRes.data?.linkingCode) {
                        setLinkingCode(updateRes.data.linkingCode);
                    }
                } catch (err) {
                    console.error('Error generating linking code:', err);
                }
            }
            // Fetch linked parents from user's linkedIds
            const userRes = await api.get('/api/auth/me');
            if (userRes.data?.linkedIds?.parentIds && userRes.data.linkedIds.parentIds.length > 0) {
                // Fetch parent details - try multiple endpoints
                const parentDetails = await Promise.all(
                    userRes.data.linkedIds.parentIds.map(async (parentId) => {
                        try {
                            // Try different endpoints
                            const res = await api.get(`/api/user/${parentId}`).catch(() => 
                                api.get(`/api/parent/profile`).catch(() => null)
                            );
                            if (res?.data) {
                                return {
                                    _id: parentId,
                                    id: parentId,
                                    name: res.data.name || res.data.fullName || 'Parent',
                                    email: res.data.email || '',
                                };
                            }
                            return {
                                _id: parentId,
                                id: parentId,
                                name: 'Parent',
                                email: '',
                            };
                        } catch {
                            return {
                                _id: parentId,
                                id: parentId,
                                name: 'Parent',
                                email: '',
                            };
                        }
                    })
                );
                setLinkedParents(parentDetails.filter(Boolean));
            }
        } catch (error) {
            console.error('Error fetching linking data:', error);
        }
    };

    const handleCopyLinkingCode = () => {
        if (linkingCode) {
            navigator.clipboard.writeText(linkingCode);
            setCopiedCode(true);
            toast.success('Linking code copied to clipboard!');
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const handleLinkParent = async (e) => {
        e.preventDefault();
        if (!parentLinkingCode.trim()) {
            toast.error('Please enter a parent linking code');
            return;
        }

        try {
            setLinkingLoading(true);
            const response = await api.post('/api/auth/school-student/link-parent', {
                parentLinkingCode: parentLinkingCode.trim().toUpperCase(),
            });

            if (response.data.success) {
                toast.success('Successfully linked to parent!');
                setParentLinkingCode('');
                fetchLinkingData();
                // Emit realtime event if socket is available
                if (window.socket) {
                    window.socket.emit('parent_linked', {
                        parentId: response.data.parent.id,
                        parentName: response.data.parent.name,
                    });
                }
            }
        } catch (error) {
            console.error('Error linking parent:', error);
            toast.error(error.response?.data?.message || 'Failed to link to parent');
        } finally {
            setLinkingLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePreferenceChange = async (key, value) => {
        // Optimistically update UI
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));

        // Auto-save to backend
        try {
            let section = 'display';
            let settingsToUpdate = {};

            if (key === 'sounds') {
                settingsToUpdate = { soundEffects: value };
            } else if (key === 'language') {
                settingsToUpdate = { language: value };
            } else if (key === 'autoSave') {
                settingsToUpdate = { autoSave: value };
            } else if (key === 'privacy') {
                section = 'privacy';
                settingsToUpdate = { profileVisibility: value === 'public' };
            }

            if (Object.keys(settingsToUpdate).length > 0) {
                await api.put('/api/user/settings', {
                    section,
                    settings: settingsToUpdate
                });

                // Emit socket event for real-time updates
                if (socket) {
                    socket.emit('settings:update', {
                        userId: user?._id,
                        section,
                        key: Object.keys(settingsToUpdate)[0],
                        value: Object.values(settingsToUpdate)[0]
                    });
                }

                toast.success('Preference saved', { duration: 2000, position: 'bottom-center' });
            }
        } catch (error) {
            console.error('Error saving preference:', error);
            // Revert on error
            setPreferences(prev => ({
                ...prev,
                [key]: !value
            }));
            toast.error('Failed to save preference', { duration: 2000, position: 'bottom-center' });
        }
    };

    const handleNotificationChange = async (key, value) => {
        // Optimistically update UI
        setNotificationSettings(prev => ({
            ...prev,
            [key]: value
        }));

        // Auto-save to backend
        try {
            let settingsToUpdate = {};
            
            // Map frontend keys to backend keys
            if (key === 'emailNotifications') {
                settingsToUpdate = { emailNotifications: value };
            } else if (key === 'pushNotifications') {
                settingsToUpdate = { pushNotifications: value };
            } else if (key === 'achievementUpdates') {
                settingsToUpdate = { notifyOnWellbeing: value };
            } else if (key === 'weeklySummaries') {
                // If enabling weekly summaries, disable daily reminders
                if (value) {
                    setNotificationSettings(prev => ({ ...prev, dailyReminders: false }));
                }
                settingsToUpdate = { digestFrequency: value ? 'weekly' : (notificationSettings.dailyReminders ? 'daily' : 'never') };
            } else if (key === 'systemAnnouncements') {
                settingsToUpdate = { notifyOnSystemUpdates: value };
            } else if (key === 'dailyReminders') {
                // If enabling daily reminders, disable weekly summaries
                if (value) {
                    setNotificationSettings(prev => ({ ...prev, weeklySummaries: false }));
                }
                settingsToUpdate = { digestFrequency: value ? 'daily' : (notificationSettings.weeklySummaries ? 'weekly' : 'never') };
            } else if (key === 'newRewards') {
                settingsToUpdate = { notifyOnApproval: value };
            } else if (key === 'friendActivity') {
                settingsToUpdate = { notifyOnNewStudent: value };
            }

            if (Object.keys(settingsToUpdate).length > 0) {
                await api.put('/api/user/settings', {
                    section: 'notifications',
                    settings: settingsToUpdate
                });

                // Emit socket event for real-time updates
                if (socket) {
                    socket.emit('settings:update', {
                        userId: user?._id,
                        section: 'notifications',
                        key: Object.keys(settingsToUpdate)[0],
                        value: Object.values(settingsToUpdate)[0]
                    });
                }

                toast.success('Notification setting saved', { duration: 2000, position: 'bottom-center' });
            }
        } catch (error) {
            console.error('Error saving notification setting:', error);
            // Revert on error
            setNotificationSettings(prev => ({
                ...prev,
                [key]: !value
            }));
            toast.error('Failed to save notification setting', { duration: 2000, position: 'bottom-center' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (form.newPassword && form.newPassword !== form.confirmPassword) {
            toast.error("New passwords don't match");
            setLoading(false);
            return;
        }

        try {
            // Update profile name
            if (form.name && form.name !== user?.name) {
                await api.put("/api/user/profile", {
                    name: form.name
                });
            }

            // Update password if provided
            if (form.currentPassword && form.newPassword) {
                await api.put("/api/user/change-password", {
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword
                });
            }

            // Refresh user data
            const profileRes = await api.get('/api/user/profile');
            if (profileRes.data) {
                setUser(prev => ({
                    ...prev,
                    ...profileRes.data
                }));
            }

            setForm(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));

            toast.success("Settings updated successfully", { duration: 3000, position: 'bottom-center' });
        } catch (error) {
            console.error("Settings update error:", error);
            toast.error(error.response?.data?.message || "Failed to update settings", { duration: 3000, position: 'bottom-center' });
        } finally {
            setLoading(false);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;

        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

        setPasswordStrength(strength);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 25) return "bg-red-500";
        if (passwordStrength <= 50) return "bg-orange-500";
        if (passwordStrength <= 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
        { id: "security", label: "Security", icon: <Key className="w-5 h-5" /> },
        { id: "preferences", label: "Preferences", icon: <SettingsIcon className="w-5 h-5" /> },
        { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
        ...(user?.role === 'school_student' ? [{ id: "parent-linking", label: "Parent Linking", icon: <Users className="w-5 h-5" /> }] : [])
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <motion.div
                            className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-xl"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <SettingsIcon className="w-8 h-8" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black mb-2 flex items-center justify-center gap-2 text-center">
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Settings
                                </span>
                                <span>⚙️</span>
                            </h1>
                            <p className="text-gray-600 text-lg font-medium">
                                Customize your experience
                            </p>
                        </div>
                    </div>

                    {user?.role === "student" && (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-6 py-3 rounded-full shadow-lg border border-yellow-200">
                            <Crown className="w-5 h-5 text-yellow-600" />
                            <span className="font-bold">Level {user?.level || 1} Player</span>
                            <Sparkles className="w-4 h-4 text-yellow-600" />
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 mb-8"
                >
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all ${activeTab === tab.id
                                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </motion.button>
                    ))}
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
                >
                    <div className="p-8">
                        {activeTab === "profile" && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <User className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Profile Settings
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block font-semibold text-gray-700 mb-2">
                                                Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50"
                                                    placeholder="Enter your name"
                                                />
                                                <User className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block font-semibold text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={user?.email || ""}
                                                    disabled
                                                    className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                                />
                                                <AlertCircle className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                                        >
                                            {loading ? "Saving..." : "Save Profile"}
                                            {!loading && <Check className="w-5 h-5" />}
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === "security" && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Shield className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Security Settings
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block font-semibold text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    name="currentPassword"
                                                    value={form.currentPassword}
                                                    onChange={handleChange}
                                                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50"
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-4 top-4 text-gray-400 focus:outline-none"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block font-semibold text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    name="newPassword"
                                                    value={form.newPassword}
                                                    onChange={handleChange}
                                                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50"
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-4 top-4 text-gray-400 focus:outline-none"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>

                                            {form.newPassword && (
                                                <div className="mt-2">
                                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${getPasswordStrengthColor()}`}
                                                            style={{ width: `${passwordStrength}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {passwordStrength <= 25 && "Weak password"}
                                                        {passwordStrength > 25 && passwordStrength <= 50 && "Fair password"}
                                                        {passwordStrength > 50 && passwordStrength <= 75 && "Good password"}
                                                        {passwordStrength > 75 && "Strong password"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block font-semibold text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={form.confirmPassword}
                                                    onChange={handleChange}
                                                    className={`w-full p-4 border-2 ${form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword
                                                        ? "border-red-300"
                                                        : "border-gray-200"
                                                        } rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50`}
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-4 text-gray-400 focus:outline-none"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword && (
                                                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Passwords don't match
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <motion.button
                                            type="submit"
                                            disabled={loading || (form.newPassword && form.newPassword !== form.confirmPassword)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center gap-2 ${(loading || (form.newPassword && form.newPassword !== form.confirmPassword)) ? "opacity-70 cursor-not-allowed" : ""}`}
                                        >
                                            {loading ? "Saving..." : "Update Password"}
                                            {!loading && <Check className="w-5 h-5" />}
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === "preferences" && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <SettingsIcon className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Preferences
                                    </h2>
                                </div>

                                <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                                <Palette className="w-5 h-5 text-indigo-500" />
                                                Appearance
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <label className="block font-medium text-gray-700">
                                                        Theme
                                                    </label>
                                                    <select
                                                        value="light"
                                                        disabled
                                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-gray-50 text-gray-500 cursor-not-allowed"
                                                    >
                                                        <option value="light">Light (Coming Soon)</option>
                                                        <option value="dark" disabled>Dark Mode (Coming Soon)</option>
                                                    </select>
                                                    <p className="text-xs text-gray-500">Theme customization coming soon</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                                <Volume2 className="w-5 h-5 text-indigo-500" />
                                                Sound & Notifications
                                            </h3>

                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                    <span className="font-medium text-gray-700">Enable Notifications</span>
                                                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            id="notifications-toggle"
                                                            checked={notificationSettings.pushNotifications}
                                                            onChange={(e) => handleNotificationChange("pushNotifications", e.target.checked)}
                                                            disabled={settingsLoading}
                                                            className="absolute w-0 h-0 opacity-0"
                                                        />
                                                        <label
                                                            htmlFor="notifications-toggle"
                                                            className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${notificationSettings.pushNotifications ? "bg-indigo-500" : "bg-gray-300"}`}
                                                        >
                                                            <span
                                                                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationSettings.pushNotifications ? "transform translate-x-6" : ""}`}
                                                            />
                                                        </label>
                                                    </div>
                                                </label>

                                                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                    <span className="font-medium text-gray-700">Sound Effects</span>
                                                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            id="sounds-toggle"
                                                            checked={preferences.sounds}
                                                            onChange={(e) => handlePreferenceChange("sounds", e.target.checked)}
                                                            disabled={settingsLoading}
                                                            className="absolute w-0 h-0 opacity-0"
                                                        />
                                                        <label
                                                            htmlFor="sounds-toggle"
                                                            className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${preferences.sounds ? "bg-indigo-500" : "bg-gray-300"}`}
                                                        >
                                                            <span
                                                                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.sounds ? "transform translate-x-6" : ""}`}
                                                            />
                                                        </label>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                                <Smartphone className="w-5 h-5 text-indigo-500" />
                                                Language & Region
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <label className="block font-medium text-gray-700">
                                                        Language
                                                    </label>
                                                    <select
                                                        value={preferences.language}
                                                        onChange={(e) => handlePreferenceChange("language", e.target.value)}
                                                        disabled={settingsLoading}
                                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50"
                                                    >
                                                        <option value="english">English</option>
                                                        <option value="spanish">Spanish</option>
                                                        <option value="french">French</option>
                                                        <option value="german">German</option>
                                                        <option value="chinese">Chinese</option>
                                                        <option value="japanese">Japanese</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                                <ShieldIcon className="w-5 h-5 text-indigo-500" />
                                                Privacy
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <label className="block font-medium text-gray-700">
                                                        Profile Visibility
                                                    </label>
                                                    <select
                                                        value={preferences.privacy}
                                                        onChange={(e) => handlePreferenceChange("privacy", e.target.value)}
                                                        disabled={settingsLoading}
                                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50"
                                                    >
                                                        <option value="public">Public</option>
                                                        <option value="friends">Friends Only</option>
                                                        <option value="private">Private</option>
                                                    </select>
                                                </div>

                                                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                    <span className="font-medium text-gray-700">Auto-Save Progress</span>
                                                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            id="autosave-toggle"
                                                            checked={preferences.autoSave}
                                                            onChange={(e) => handlePreferenceChange("autoSave", e.target.checked)}
                                                            disabled={settingsLoading}
                                                            className="absolute w-0 h-0 opacity-0"
                                                        />
                                                        <label
                                                            htmlFor="autosave-toggle"
                                                            className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${preferences.autoSave ? "bg-indigo-500" : "bg-gray-300"}`}
                                                        >
                                                            <span
                                                                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.autoSave ? "transform translate-x-6" : ""}`}
                                                            />
                                                        </label>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <p className="text-sm text-blue-700 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Preferences are saved automatically when you change them
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === "notifications" && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Bell className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Notification Settings
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-700">
                                            Email Notifications
                                        </h3>

                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                <div>
                                                    <span className="font-medium text-gray-700 block">Achievement Updates</span>
                                                    <span className="text-sm text-gray-500">Get notified when you earn badges or level up</span>
                                                </div>
                                                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        id="achievements-toggle"
                                                        checked={notificationSettings.achievementUpdates}
                                                        onChange={(e) => handleNotificationChange('achievementUpdates', e.target.checked)}
                                                        disabled={settingsLoading}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="achievements-toggle"
                                                        className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${notificationSettings.achievementUpdates ? 'bg-indigo-500' : 'bg-gray-300'}`}
                                                    >
                                                        <span
                                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationSettings.achievementUpdates ? 'transform translate-x-6' : ''}`}
                                                        />
                                                    </label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                <div>
                                                    <span className="font-medium text-gray-700 block">Weekly Summaries</span>
                                                    <span className="text-sm text-gray-500">Receive a weekly summary of your progress</span>
                                                </div>
                                                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        id="weekly-toggle"
                                                        checked={notificationSettings.weeklySummaries}
                                                        onChange={(e) => handleNotificationChange('weeklySummaries', e.target.checked)}
                                                        disabled={settingsLoading}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="weekly-toggle"
                                                        className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${notificationSettings.weeklySummaries ? 'bg-indigo-500' : 'bg-gray-300'}`}
                                                    >
                                                        <span
                                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationSettings.weeklySummaries ? 'transform translate-x-6' : ''}`}
                                                        />
                                                    </label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                <div>
                                                    <span className="font-medium text-gray-700 block">System Announcements</span>
                                                    <span className="text-sm text-gray-500">Important updates about the platform</span>
                                                </div>
                                                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        id="system-toggle"
                                                        checked={notificationSettings.systemAnnouncements}
                                                        onChange={(e) => handleNotificationChange('systemAnnouncements', e.target.checked)}
                                                        disabled={settingsLoading}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="system-toggle"
                                                        className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${notificationSettings.systemAnnouncements ? 'bg-indigo-500' : 'bg-gray-300'}`}
                                                    >
                                                        <span
                                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationSettings.systemAnnouncements ? 'transform translate-x-6' : ''}`}
                                                        />
                                                    </label>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-700">
                                            In-App Notifications
                                        </h3>

                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                <div>
                                                    <span className="font-medium text-gray-700 block">Daily Reminders</span>
                                                    <span className="text-sm text-gray-500">Remind you to complete your daily goals</span>
                                                </div>
                                                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        id="reminders-toggle"
                                                        checked={notificationSettings.dailyReminders}
                                                        onChange={(e) => handleNotificationChange('dailyReminders', e.target.checked)}
                                                        disabled={settingsLoading}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="reminders-toggle"
                                                        className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${notificationSettings.dailyReminders ? 'bg-indigo-500' : 'bg-gray-300'}`}
                                                    >
                                                        <span
                                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationSettings.dailyReminders ? 'transform translate-x-6' : ''}`}
                                                        />
                                                    </label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                <div>
                                                    <span className="font-medium text-gray-700 block">New Rewards</span>
                                                    <span className="text-sm text-gray-500">Notify when new rewards are available</span>
                                                </div>
                                                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        id="rewards-toggle"
                                                        checked={notificationSettings.newRewards}
                                                        onChange={(e) => handleNotificationChange('newRewards', e.target.checked)}
                                                        disabled={settingsLoading}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="rewards-toggle"
                                                        className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${notificationSettings.newRewards ? 'bg-indigo-500' : 'bg-gray-300'}`}
                                                    >
                                                        <span
                                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationSettings.newRewards ? 'transform translate-x-6' : ''}`}
                                                        />
                                                    </label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                <div>
                                                    <span className="font-medium text-gray-700 block">Friend Activity</span>
                                                    <span className="text-sm text-gray-500">Updates about your friends' progress</span>
                                                </div>
                                                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        id="friends-toggle"
                                                        checked={notificationSettings.friendActivity}
                                                        onChange={(e) => handleNotificationChange('friendActivity', e.target.checked)}
                                                        disabled={settingsLoading}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="friends-toggle"
                                                        className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${notificationSettings.friendActivity ? 'bg-indigo-500' : 'bg-gray-300'}`}
                                                    >
                                                        <span
                                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationSettings.friendActivity ? 'transform translate-x-6' : ''}`}
                                                        />
                                                    </label>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <p className="text-sm text-blue-700 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Notification settings are saved automatically when you toggle them
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === "parent-linking" && user?.role === 'school_student' && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Users className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Parent Linking
                                    </h2>
                    </div>

                                {/* Your Linking Code */}
                                {linkingCode && (
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                    Your Secret Linking Code
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Share this code with your parent so they can link to your account
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleCopyLinkingCode}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                                            >
                                                {copiedCode ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        Copy
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border-2 border-indigo-100">
                                            <p className="text-2xl font-mono font-bold text-indigo-900 text-center tracking-wider">
                                                {linkingCode}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Link with Parent */}
                                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Link with Parent
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Enter your parent's linking code to connect your account
                                    </p>
                                    <form onSubmit={handleLinkParent} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Parent Linking Code
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={parentLinkingCode}
                                                    onChange={(e) => setParentLinkingCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter parent's linking code (e.g., PR-XXXXXX)"
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all font-mono uppercase"
                                                />
                                                <LinkIcon className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={linkingLoading || !parentLinkingCode.trim()}
                                            className={`w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center justify-center gap-2 ${linkingLoading || !parentLinkingCode.trim() ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"}`}
                                        >
                                            {linkingLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Linking...
                                                </>
                                            ) : (
                                                <>
                                                    <LinkIcon className="w-5 h-5" />
                                                    Link with Parent
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>

                                {/* Linked Parents */}
                                {linkedParents.length > 0 && (
                                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            Linked Parents
                                        </h3>
                                        <div className="space-y-3">
                                            {linkedParents.map((parent) => (
                                                <div
                                                    key={parent._id || parent.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <Users className="w-5 h-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">
                                                                {parent.name || parent.fullName || 'Parent'}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {parent.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-green-600">
                                                        <CheckCircle className="w-5 h-5" />
                                                        <span className="text-sm font-medium">Linked</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;