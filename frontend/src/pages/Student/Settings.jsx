import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Settings as SettingsIcon,
    User,
    Mail,
    Lock,
    Shield,
    Eye,
    EyeOff,
    Save,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Crown,
    Zap,
    ArrowLeft,
    Bell,
    Palette,
    Globe,
    Moon,
    Sun,
    Volume2,
    VolumeX,
    Smartphone,
    Monitor,
    Tablet,
} from "lucide-react";

const Settings = () => {
    const { user, fetchUser } = useAuth();

    const [form, setForm] = useState({
        name: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [preferences, setPreferences] = useState({
        theme: "light",
        notifications: true,
        sounds: true,
        language: "en",
        autoSave: true,
        privacy: "public",
    });

    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                name: user.name || "",
            }));
        }
    }, [user]);

    // Password strength calculator
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/)) strength += 25;
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 25;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
        return Math.min(strength, 100);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === "newPassword") {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const handlePreferenceChange = (key, value) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        // Validate passwords match
        if (form.newPassword && form.newPassword !== form.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name: form.name,
                preferences: preferences,
            };

            // Only send password if filled
            if (form.currentPassword && form.newPassword) {
                payload.currentPassword = form.currentPassword;
                payload.newPassword = form.newPassword;
            }

            await axios.put(`${import.meta.env.VITE_API}/auth/settings`, payload, {
                withCredentials: true,
            });

            toast.success("Settings updated successfully! 🎉");
            setForm((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));
            setPasswordStrength(0);
            fetchUser();
        } catch (err) {
            const message =
                err.response?.data?.message || "Failed to update settings";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = (strength) => {
        if (strength < 25) return "bg-red-500";
        if (strength < 50) return "bg-orange-500";
        if (strength < 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getPasswordStrengthText = (strength) => {
        if (strength < 25) return "Weak";
        if (strength < 50) return "Fair";
        if (strength < 75) return "Good";
        return "Strong";
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
        { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
        {
            id: "preferences",
            label: "Preferences",
            icon: <SettingsIcon className="w-5 h-5" />,
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: <Bell className="w-5 h-5" />,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                {/* Header */}
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
                                    Game Settings
                                </span>
                                <span className="text-black dark:text-white">⚙️</span>
                            </h1>

                            <p className="text-gray-600 text-lg font-medium">
                                Customize your gaming experience
                            </p>
                        </div>
                    </div>

                    {/* User Level Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-6 py-3 rounded-full shadow-lg border border-yellow-200">
                        <Crown className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold">Level {user?.level || 1} Player</span>
                        <Sparkles className="w-4 h-4 text-yellow-600" />
                    </div>
                </motion.div>

                {/* Tab Navigation */}
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
                                    : "bg-white/80 text-gray-700 hover:bg-white shadow-md"
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Main Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
                >
                    <div className="p-8">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <User className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Player Profile
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block font-semibold text-gray-700 mb-2">
                                            Player Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50 backdrop-blur-sm"
                                                placeholder="Enter your player name"
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
                                                className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-gray-100 text-gray-600 cursor-not-allowed"
                                            />
                                            <Mail className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Email cannot be changed for security reasons
                                        </p>
                                    </div>
                                </div>

                                {/* Player Stats */}
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                                        Player Stats
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-indigo-600">
                                                {user?.level || 1}
                                            </div>
                                            <div className="text-sm text-gray-600">Level</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {user?.xp || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Total XP</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {user?.achievements || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Achievements</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Shield className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Security Settings
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                name="currentPassword"
                                                value={form.currentPassword}
                                                onChange={handleChange}
                                                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50 backdrop-blur-sm pr-12"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCurrentPassword(!showCurrentPassword)
                                                }
                                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                name="newPassword"
                                                value={form.newPassword}
                                                onChange={handleChange}
                                                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50 backdrop-blur-sm pr-12"
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        {form.newPassword && (
                                            <div className="mt-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm text-gray-600">
                                                        Password Strength:
                                                    </span>
                                                    <span
                                                        className={`text-sm font-semibold ${passwordStrength < 50
                                                                ? "text-red-500"
                                                                : passwordStrength < 75
                                                                    ? "text-yellow-500"
                                                                    : "text-green-500"
                                                            }`}
                                                    >
                                                        {getPasswordStrengthText(passwordStrength)}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                                                            passwordStrength
                                                        )}`}
                                                        style={{ width: `${passwordStrength}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50 backdrop-blur-sm pr-12"
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        {form.confirmPassword &&
                                            form.newPassword !== form.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Passwords don't match
                                                </p>
                                            )}
                                        {form.confirmPassword &&
                                            form.newPassword === form.confirmPassword && (
                                                <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Passwords match
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === "preferences" && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Palette className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Game Preferences
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Theme Selection */}
                                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Sun className="w-5 h-5" />
                                            Theme Preference
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {[
                                                {
                                                    id: "light",
                                                    label: "Light Mode",
                                                    icon: <Sun className="w-5 h-5" />,
                                                },
                                                {
                                                    id: "dark",
                                                    label: "Dark Mode",
                                                    icon: <Moon className="w-5 h-5" />,
                                                },
                                                {
                                                    id: "auto",
                                                    label: "Auto",
                                                    icon: <Monitor className="w-5 h-5" />,
                                                },
                                            ].map((theme) => (
                                                <motion.button
                                                    key={theme.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() =>
                                                        handlePreferenceChange("theme", theme.id)
                                                    }
                                                    className={`p-4 rounded-xl border-2 transition-all ${preferences.theme === theme.id
                                                            ? "border-indigo-500 bg-indigo-50"
                                                            : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 justify-center">
                                                        {theme.icon}
                                                        <span className="font-semibold">{theme.label}</span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Toggle Preferences */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            {
                                                key: "sounds",
                                                label: "Game Sounds",
                                                icon: <Volume2 className="w-5 h-5" />,
                                                description: "Enable sound effects and music",
                                            },
                                            {
                                                key: "notifications",
                                                label: "Push Notifications",
                                                icon: <Bell className="w-5 h-5" />,
                                                description: "Get notified about achievements",
                                            },
                                            {
                                                key: "autoSave",
                                                label: "Auto-Save Progress",
                                                icon: <Save className="w-5 h-5" />,
                                                description: "Automatically save your progress",
                                            },
                                        ].map((pref) => (
                                            <div
                                                key={pref.key}
                                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                                            {pref.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800">
                                                                {pref.label}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {pref.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() =>
                                                            handlePreferenceChange(
                                                                pref.key,
                                                                !preferences[pref.key]
                                                            )
                                                        }
                                                        className={`relative w-12 h-6 rounded-full transition-all ${preferences[pref.key]
                                                                ? "bg-indigo-500"
                                                                : "bg-gray-300"
                                                            }`}
                                                    >
                                                        <motion.div
                                                            className="w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5"
                                                            animate={{
                                                                x: preferences[pref.key] ? 24 : 2,
                                                            }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 300,
                                                                damping: 30,
                                                            }}
                                                        />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === "notifications" && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Bell className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Notification Settings
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        {
                                            id: "achievements",
                                            label: "Achievement Unlocked",
                                            description:
                                                "Get notified when you unlock new achievements",
                                        },
                                        {
                                            id: "dailyReminder",
                                            label: "Daily Check-in Reminder",
                                            description: "Remind me to check in daily",
                                        },
                                        {
                                            id: "weeklyReport",
                                            label: "Weekly Progress Report",
                                            description: "Get a summary of your weekly progress",
                                        },
                                        {
                                            id: "friendActivity",
                                            label: "Friend Activity",
                                            description: "See when friends complete challenges",
                                        },
                                        {
                                            id: "levelUp",
                                            label: "Level Up Celebrations",
                                            description: "Celebrate when you reach a new level",
                                        },
                                    ].map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">
                                                        {notification.label}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {notification.description}
                                                    </p>
                                                </div>
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    className="relative w-12 h-6 rounded-full transition-all bg-indigo-500"
                                                >
                                                    <motion.div
                                                        className="w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5"
                                                        animate={{ x: 24 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 300,
                                                            damping: 30,
                                                        }}
                                                    />
                                                </motion.button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Zap className="w-4 h-4 text-indigo-500" />
                                <span>Changes are saved automatically</span>
                            </div>
                            <motion.button
                                onClick={handleSave}
                                disabled={loading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        >
                                            <SettingsIcon className="w-5 h-5" />
                                        </motion.div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
