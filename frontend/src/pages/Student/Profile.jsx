import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    User, Key, Shield, Settings, Eye, EyeOff, BookOpen, Lock, Briefcase, Calendar, Users, Building, GraduationCap, Clock, Star, Camera, Phone, MapPin, Globe, Edit, Save, X, Mail, UserCheck, Crown, Trophy, Flame, Zap, Sparkles, Diamond, Award, Target, Heart, Bell, Palette, Volume2, Smartphone, Shield as ShieldIcon, ChevronRight, Upload, Check, AlertCircle
} from "lucide-react";

// Mock data - replace with your actual data fetching
const mockUser = {
    name: "Alex Johnson",
    email: "alex.johnson@healspace.com",
    role: "student",
    picture: "/api/placeholder/128/128",
    level: 7,
    xp: 2340,
    streak: 12,
    rank: 23,
    joinDate: "2024-01-15"
};

const mockAchievements = [
    { icon: <Flame className="w-5 h-5" />, title: "Hot Streak", description: "12 days in a row!", color: "from-orange-400 to-red-400" },
    { icon: <Crown className="w-5 h-5" />, title: "Top Performer", description: "Rank #23 globally", color: "from-yellow-400 to-orange-400" },
    { icon: <Shield className="w-5 h-5" />, title: "Wellness Guardian", description: "100 mood checks", color: "from-blue-400 to-cyan-400" },
    { icon: <Trophy className="w-5 h-5" />, title: "Level Master", description: "Reached Level 7", color: "from-purple-400 to-indigo-400" },
    { icon: <Star className="w-5 h-5" />, title: "Superstar", description: "5-star rating", color: "from-pink-400 to-rose-400" },
    { icon: <Target className="w-5 h-5" />, title: "Goal Crusher", description: "50 goals completed", color: "from-green-400 to-emerald-400" }
];

const DEFAULT_PREFERENCES = {
    language: "en",
    theme: "light",
    notifications: { email: true, push: true, sms: false },
    privacy: { profileVisibility: "friends", contactInfo: "friends", academicInfo: "private" },
    sound: { effects: true, music: true, volume: 75 }
};

function AnimatedFormField({ icon: Icon, label, error, className = "", ...props }) {
    return (
        <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
                {label}
            </label>
            <div className="relative">
                <motion.input
                    {...props}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/70 backdrop-blur-sm ${error ? 'border-red-300' : 'border-gray-300'
                        } ${props.disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-indigo-300'} ${className}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                />
                {error && (
                    <motion.p
                        className="text-sm text-red-600 flex items-center gap-1 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
}

function AnimatedTabButton({ active, onClick, children, icon: Icon, badge = null }) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all border-2 relative ${active
                    ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-500 shadow-lg'
                    : 'text-gray-600 border-transparent hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200'
                }`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
            {badge && (
                <motion.span
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                    {badge}
                </motion.span>
            )}
        </motion.button>
    );
}

function GlassCard({ title, children, className = "", gradient = "" }) {
    return (
        <motion.div
            className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden relative ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {gradient && (
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5`} />
            )}
            {title && (
                <div className="px-6 py-4 border-b border-white/20 bg-white/40 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        {title}
                    </h3>
                </div>
            )}
            <div className="p-6 relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

export default function GamifiedProfile() {
    const [user] = useState(mockUser);
    const [personalInfo, setPersonalInfo] = useState({
        name: mockUser.name,
        email: mockUser.email,
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        website: "https://alexjohnson.dev",
        bio: "Passionate student on a journey to improve mental health through gamification. Love coding, reading, and mindfulness practices."
    });
    const [avatarPreview, setAvatarPreview] = useState(mockUser.picture);
    const [avatarFile, setAvatarFile] = useState(null);
    const [passwords, setPasswords] = useState({ current: "", newPass: "", confirmPass: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [academicInfo, setAcademicInfo] = useState({
        major: "Computer Science",
        graduationYear: "2025",
        gpa: "3.8",
        favoriteSubjects: "Psychology, Programming, Design"
    });
    const [professionalInfo, setProfessionalInfo] = useState({
        department: "Technology",
        position: "Student Developer",
        joiningDate: "2024-01-15",
        qualification: "Bachelor's in Computer Science",
        experience: "2",
        specialization: "Full-Stack Development"
    });
    const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleChange = (setter) => (e) => {
        setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handlePreferenceChange = (category, key, value) => {
        setPreferences((prev) => ({
            ...prev,
            [category]: typeof prev[category] === 'object'
                ? { ...prev[category], [key]: value }
                : value
        }));
    };

    const tabs = [
        { id: "personal", label: "Personal Info", icon: User },
        { id: "academic", label: "Academic", icon: BookOpen },
        { id: "professional", label: "Professional", icon: Briefcase },
        { id: "achievements", label: "Achievements", icon: Trophy },
        { id: "security", label: "Security", icon: Lock, badge: "!" },
        { id: "preferences", label: "Preferences", icon: Settings }
    ];

    const renderPersonalTab = () => (
        <div className="space-y-6">
            <AnimatedFormField
                label="Name"
                name="name"
                value={personalInfo.name}
                onChange={handleChange(setPersonalInfo)}
                placeholder="Enter your name"
                icon={User}
            />
            <AnimatedFormField
                label="Email"
                name="email"
                value={personalInfo.email}
                onChange={handleChange(setPersonalInfo)}
                placeholder="Enter your email"
                icon={Mail}
                type="email"
            />
            <AnimatedFormField
                label="Phone"
                name="phone"
                value={personalInfo.phone}
                onChange={handleChange(setPersonalInfo)}
                placeholder="Enter your phone number"
                icon={Phone}
                type="tel"
            />
            <AnimatedFormField
                label="Location"
                name="location"
                value={personalInfo.location}
                onChange={handleChange(setPersonalInfo)}
                placeholder="Enter your location"
                icon={MapPin}
            />
            <AnimatedFormField
                label="Website"
                name="website"
                value={personalInfo.website}
                onChange={handleChange(setPersonalInfo)}
                placeholder="Enter your website URL"
                icon={Globe}
                type="url"
            />
            <AnimatedFormField
                label="Bio"
                name="bio"
                value={personalInfo.bio}
                onChange={handleChange(setPersonalInfo)}
                placeholder="Tell us about yourself"
                icon={UserCheck}
                as="textarea"
                rows={3}
            />
        </div>
    );

    const renderAcademicTab = () => (
        <div className="space-y-6">
            <AnimatedFormField
                label="Major"
                name="major"
                value={academicInfo.major}
                onChange={handleChange(setAcademicInfo)}
                placeholder="Enter your major"
                icon={BookOpen}
            />
            <AnimatedFormField
                label="Graduation Year"
                name="graduationYear"
                value={academicInfo.graduationYear}
                onChange={handleChange(setAcademicInfo)}
                placeholder="Enter your graduation year"
                icon={Calendar}
                type="number"
            />
            <AnimatedFormField
                label="GPA"
                name="gpa"
                value={academicInfo.gpa}
                onChange={handleChange(setAcademicInfo)}
                placeholder="Enter your GPA"
                icon={Star}
                type="number"
                step="0.1"
            />
            <AnimatedFormField
                label="Favorite Subjects"
                name="favoriteSubjects"
                value={academicInfo.favoriteSubjects}
                onChange={handleChange(setAcademicInfo)}
                placeholder="Enter your favorite subjects"
                icon={BookOpen}
                as="textarea"
                rows={3}
            />
        </div>
    );

    const renderProfessionalTab = () => (
        <div className="space-y-6">
            <AnimatedFormField
                label="Department"
                name="department"
                value={professionalInfo.department}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="Enter your department"
                icon={Building}
            />
            <AnimatedFormField
                label="Position"
                name="position"
                value={professionalInfo.position}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="Enter your position"
                icon={Briefcase}
            />
            <AnimatedFormField
                label="Joining Date"
                name="joiningDate"
                value={professionalInfo.joiningDate}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="Enter your joining date"
                icon={Calendar}
                type="date"
            />
            <AnimatedFormField
                label="Qualification"
                name="qualification"
                value={professionalInfo.qualification}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="Enter your qualification"
                icon={UserCheck}
            />
            <AnimatedFormField
                label="Experience (in years)"
                name="experience"
                value={professionalInfo.experience}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="Enter your experience"
                icon={Clock}
                type="number"
            />
            <AnimatedFormField
                label="Specialization"
                name="specialization"
                value={professionalInfo.specialization}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="Enter your specialization"
                icon={Target}
            />
        </div>
    );

    const renderAchievementsTab = () => (
        <div className="grid grid-cols-2 gap-4">
            {mockAchievements.map((achievement, index) => (
                <motion.div
                    key={index}
                    className="flex items-center p-4 bg-white rounded-xl shadow-md border-l-4 cursor-pointer hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => alert(`Unlocked: ${achievement.title}`)}
                >
                    <div className={`p-3 rounded-full ${achievement.color} mr-4`}>
                        {achievement.icon}
                    </div>
                    <div>
                        <h4 className="text-md font-semibold text-gray-800">{achievement.title}</h4>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <AnimatedFormField
                label="Current Password"
                name="current"
                value={passwords.current}
                onChange={handleChange(setPasswords)}
                placeholder="Enter your current password"
                icon={Lock}
                type={showPassword ? "text" : "password"}
                endIcon={
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-gray-500"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                }
            />
            <AnimatedFormField
                label="New Password"
                name="newPass"
                value={passwords.newPass}
                onChange={handleChange(setPasswords)}
                placeholder="Enter a new password"
                icon={Lock}
                type={showPassword ? "text" : "password"}
                endIcon={
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-gray-500"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                }
            />
            <AnimatedFormField
                label="Confirm Password"
                name="confirmPass"
                value={passwords.confirmPass}
                onChange={handleChange(setPasswords)}
                placeholder="Confirm your new password"
                icon={Lock}
                type={showPassword ? "text" : "password"}
                endIcon={
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-gray-500"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                }
            />
        </div>
    );

    const renderPreferencesTab = () => (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-semibold text-gray-700">Language</label>
                <select
                    name="language"
                    value={preferences.language}
                    onChange={handleChange(setPreferences)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/70 backdrop-blur-sm"
                >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700">Theme</label>
                <select
                    name="theme"
                    value={preferences.theme}
                    onChange={handleChange(setPreferences)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/70 backdrop-blur-sm"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700">Notifications</label>
                <div className="flex gap-2">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="email"
                            checked={preferences.notifications.email}
                            onChange={handleChange(setPreferences)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Email Notifications</span>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="push"
                            checked={preferences.notifications.push}
                            onChange={handleChange(setPreferences)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Push Notifications</span>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="sms"
                            checked={preferences.notifications.sms}
                            onChange={handleChange(setPreferences)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">SMS Notifications</span>
                    </div>
                </div>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700">Privacy</label>
                <div className="flex gap-2">
                    <select
                        name="profileVisibility"
                        value={preferences.privacy.profileVisibility}
                        onChange={handleChange(setPreferences)}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/70 backdrop-blur-sm"
                    >
                        <option value="friends">Friends</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <select
                        name="contactInfo"
                        value={preferences.privacy.contactInfo}
                        onChange={handleChange(setPreferences)}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/70 backdrop-blur-sm"
                    >
                        <option value="friends">Friends</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700">Sound</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="range"
                        name="volume"
                        min="0"
                        max="100"
                        value={preferences.sound.volume}
                        onChange={handleChange(setPreferences)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{preferences.sound.volume}%</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="effects"
                            checked={preferences.sound.effects}
                            onChange={handleChange(setPreferences)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Sound Effects</span>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="music"
                            checked={preferences.sound.music}
                            onChange={handleChange(setPreferences)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Background Music</span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
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

            <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl sm:text-5xl font-black mb-3 flex items-center justify-center gap-2 text-center">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Profile Hub
                        </span>
                        <span className="text-black dark:text-white">⚡</span>
                    </h1>

                    <p className="text-gray-600 text-lg font-medium">
                        Customize your gaming experience and level up your profile
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-4 gap-8"
                >
                    {/* Profile Sidebar */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <GlassCard gradient="from-indigo-400 to-purple-400">
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    <motion.img
                                        src={avatarPreview}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-indigo-200 shadow-lg"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.label
                                        className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-full cursor-pointer hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Camera className="w-4 h-4 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </motion.label>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {personalInfo.name || "Your Name"}
                                    </h3>
                                    <p className="text-sm text-gray-600">{personalInfo.email}</p>
                                    <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                                        {user?.role?.toUpperCase()}
                                    </span>
                                </div>
                                {avatarFile && (
                                    <motion.button
                                        onClick={handleSave}
                                        disabled={loading}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 justify-center"
                                    >
                                        <Save className="w-5 h-5" />
                                        {loading ? "Uploading..." : "Update Avatar"}
                                    </motion.button>
                                )}
                                {saveSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 text-green-600 font-bold flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-5 h-5" /> Saved!
                                    </motion.div>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div variants={itemVariants} className="lg:col-span-3">
                        <GlassCard>
                            {/* Tab Navigation */}
                            <div className="border-b-2 border-indigo-100 px-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl">
                                <div className="flex space-x-2 overflow-x-auto">
                                    {tabs.map(tab => (
                                        <AnimatedTabButton
                                            key={tab.id}
                                            active={activeTab === tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            icon={tab.icon}
                                            badge={tab.badge}
                                        >
                                            {tab.label}
                                        </AnimatedTabButton>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {activeTab === "personal" && renderPersonalTab()}
                                {activeTab === "academic" && renderAcademicTab()}
                                {activeTab === "professional" && renderProfessionalTab()}
                                {activeTab === "achievements" && renderAchievementsTab()}
                                {activeTab === "security" && renderSecurityTab()}
                                {activeTab === "preferences" && renderPreferencesTab()}
                            </div>

                            {/* Save Button */}
                            {activeTab !== "security" && (
                                <div className="px-8 py-6 border-t-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-b-3xl">
                                    <div className="flex justify-end">
                                        <motion.button
                                            onClick={handleSave}
                                            disabled={loading}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            {loading ? "Saving..." : "Save Changes"}
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}