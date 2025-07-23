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
    Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

const Settings = () => {
    const { user, updateUser } = useAuth();
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

    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                name: user.name || ""
            }));

            if (user.preferences) {
                setPreferences(user.preferences);
            }
        }
    }, [user]);

    useEffect(() => {
        if (form.newPassword) {
            calculatePasswordStrength(form.newPassword);
        } else {
            setPasswordStrength(0);
        }
    }, [form.newPassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
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
            const data = {
                name: form.name,
                preferences: preferences
            };

            if (form.currentPassword && form.newPassword) {
                data.currentPassword = form.currentPassword;
                data.newPassword = form.newPassword;
            }

            const response = await api.put("/api/auth/settings", data);

            updateUser(response.data.user);

            setForm(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));

            toast.success("Settings updated successfully");
        } catch (error) {
            console.error("Settings update error:", error);
            toast.error(error.response?.data?.message || "Failed to update settings");
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
        { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> }
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

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                                <Palette className="w-5 h-5 text-indigo-500" />
                                                Appearance
                                            </h3>

                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all">
                                                    <span className="font-medium text-gray-700">Light Theme</span>
                                                    <input
                                                        type="radio"
                                                        name="theme"
                                                        checked={preferences.theme === "light"}
                                                        onChange={() => handlePreferenceChange("theme", "light")}
                                                        className="form-radio h-5 w-5 text-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </label>
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
                                                            checked={preferences.notifications}
                                                            onChange={() => handlePreferenceChange("notifications", !preferences.notifications)}
                                                            className="absolute w-0 h-0 opacity-0"
                                                        />
                                                        <label
                                                            htmlFor="notifications-toggle"
                                                            className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${preferences.notifications ? "bg-indigo-500" : "bg-gray-300"}`}
                                                        >
                                                            <span
                                                                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.notifications ? "transform translate-x-6" : ""}`}
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
                                                            onChange={() => handlePreferenceChange("sounds", !preferences.sounds)}
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
                                                            onChange={() => handlePreferenceChange("autoSave", !preferences.autoSave)}
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

                                    <div className="flex justify-end">
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                                        >
                                            {loading ? "Saving..." : "Save Preferences"}
                                            {!loading && <Check className="w-5 h-5" />}
                                        </motion.button>
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
                                                        checked={true}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="achievements-toggle"
                                                        className="absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 bg-indigo-500"
                                                    >
                                                        <span
                                                            className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform translate-x-6"
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
                                                        checked={true}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="weekly-toggle"
                                                        className="absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 bg-indigo-500"
                                                    >
                                                        <span
                                                            className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform translate-x-6"
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
                                                        checked={true}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="system-toggle"
                                                        className="absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 bg-indigo-500"
                                                    >
                                                        <span
                                                            className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform translate-x-6"
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
                                                        checked={true}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="reminders-toggle"
                                                        className="absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 bg-indigo-500"
                                                    >
                                                        <span
                                                            className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform translate-x-6"
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
                                                        checked={true}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="rewards-toggle"
                                                        className="absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 bg-indigo-500"
                                                    >
                                                        <span
                                                            className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform translate-x-6"
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
                                                        checked={false}
                                                        className="absolute w-0 h-0 opacity-0"
                                                    />
                                                    <label
                                                        htmlFor="friends-toggle"
                                                        className="absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 bg-gray-300"
                                                    >
                                                        <span
                                                            className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300"
                                                        />
                                                    </label>
                                                </div>
                                            </label>
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
                                            {loading ? "Saving..." : "Save Notification Settings"}
                                            {!loading && <Check className="w-5 h-5" />}
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;