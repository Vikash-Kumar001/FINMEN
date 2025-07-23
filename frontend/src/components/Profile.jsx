import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Key, Shield, Settings, Eye, EyeOff, BookOpen, Lock, Briefcase, Calendar, Users, Building, GraduationCap, Clock, Star, Camera, Phone, MapPin, Globe, Edit, Save, X, Mail, UserCheck, Crown, Trophy, Flame, Zap, Sparkles, Diamond, Award, Target, Heart, Bell, Palette, Volume2, Smartphone, Shield as ShieldIcon, ChevronRight, Upload, Check, AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/70 ${error ? 'border-red-300' : 'border-gray-300'} ${props.disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-indigo-300'} ${className}`}
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
                <div className="px-6 py-4 border-b border-white/20 bg-white/40">
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

const Profile = () => {
    const { user } = useAuth();
    const [personalInfo, setPersonalInfo] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        bio: ""
    });
    const [avatarPreview, setAvatarPreview] = useState("/api/placeholder/128/128");
    const [avatarFile, setAvatarFile] = useState(null);
    const [passwords, setPasswords] = useState({ current: "", newPass: "", confirmPass: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [academicInfo, setAcademicInfo] = useState({
        major: "",
        graduationYear: "",
        gpa: "",
        favoriteSubjects: ""
    });
    const [professionalInfo, setProfessionalInfo] = useState({
        department: "",
        position: "",
        joiningDate: "",
        qualification: "",
        experience: "",
        specialization: ""
    });
    const [preferences, setPreferences] = useState({
        language: "en",
        theme: "light",
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: "friends", contactInfo: "friends", academicInfo: "private" },
        sound: { effects: true, music: true, volume: 75 }
    });
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/user/profile');
            const profileData = response.data;
            
            setPersonalInfo({
                name: profileData.name || user?.name || "",
                email: profileData.email || user?.email || "",
                phone: profileData.phone || "",
                location: profileData.location || "",
                website: profileData.website || "",
                bio: profileData.bio || ""
            });
            
            if (profileData.avatar) {
                setAvatarPreview(profileData.avatar);
            }
            
            if (profileData.academic) {
                setAcademicInfo(profileData.academic);
            }
            
            if (profileData.professional) {
                setProfessionalInfo(profileData.professional);
            }
            
            if (profileData.preferences) {
                setPreferences(profileData.preferences);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

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

    const handleSave = async (tabData, tabName) => {
        setLoading(true);
        setErrors({});
        
        try {
            let validationErrors = {};
            
            if (tabName === 'personal' && !tabData.name.trim()) {
                validationErrors.name = 'Name is required';
            }
            
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            
            let formData = null;
            if (tabName === 'personal' && avatarFile) {
                formData = new FormData();
                formData.append('avatar', avatarFile);
                
                await api.post('/api/user/avatar', formData);
            }
            
            const updateData = {};
            updateData[tabName] = tabData;
            
            await api.put('/api/user/profile', updateData);
            
            setSaveSuccess(true);
            toast.success(`${tabName.charAt(0).toUpperCase() + tabName.slice(1)} information updated successfully`);
            
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error(`Error updating ${tabName} information:`, error);
            toast.error(error.response?.data?.message || `Failed to update ${tabName} information`);
        } finally {
            setLoading(false);
        }
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
        { id: "security", label: "Security", icon: Lock, badge: user?.role === "student" ? "!" : null },
        { id: "preferences", label: "Preferences", icon: Settings }
    ];

    const renderPersonalTab = () => (
        <div className="space-y-6">
            <AnimatedFormField
                label="Name"
                name="name"
                value={personalInfo.name}
                onChange={handleChange(setPersonalInfo)}
                placeholder="Your full name"
                icon={User}
                error={errors.name}
            />

            <AnimatedFormField
                label="Email"
                name="email"
                value={personalInfo.email}
                disabled
                icon={Mail}
            />

            <AnimatedFormField
                label="Phone"
                name="phone"
                value={personalInfo.phone}
                onChange={handleChange(setPersonalInfo)}
                placeholder="Your phone number"
                icon={Phone}
                error={errors.phone}
            />

            <AnimatedFormField
                label="Location"
                name="location"
                value={personalInfo.location}
                onChange={handleChange(setPersonalInfo)}
                placeholder="City, Country"
                icon={MapPin}
                error={errors.location}
            />

            <AnimatedFormField
                label="Website"
                name="website"
                value={personalInfo.website}
                onChange={handleChange(setPersonalInfo)}
                placeholder="https://yourwebsite.com"
                icon={Globe}
                error={errors.website}
            />

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="w-4 h-4 text-indigo-500" />
                    Bio
                </label>
                <motion.textarea
                    name="bio"
                    value={personalInfo.bio}
                    onChange={handleChange(setPersonalInfo)}
                    placeholder="Tell us about yourself"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/70 hover:border-indigo-300"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Camera className="w-4 h-4 text-indigo-500" />
                    Profile Picture
                </label>
                <div className="flex items-center gap-4">
                    <motion.div
                        className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-300 flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                    >
                        <img
                            src={avatarPreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <div className="flex-1">
                        <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-300 transition-all">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <Upload className="w-5 h-5 text-indigo-500 mr-2" />
                            <span className="text-sm font-medium text-gray-600">Upload new picture</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <motion.button
                    onClick={() => handleSave(personalInfo, 'personal')}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Saving..." : "Save Changes"}
                    {!loading && <Save className="w-5 h-5" />}
                </motion.button>
            </div>
        </div>
    );

    const renderAcademicTab = () => (
        <div className="space-y-6">
            <AnimatedFormField
                label="Major/Field of Study"
                name="major"
                value={academicInfo.major}
                onChange={handleChange(setAcademicInfo)}
                placeholder="e.g. Computer Science"
                icon={BookOpen}
            />

            <AnimatedFormField
                label="Graduation Year"
                name="graduationYear"
                value={academicInfo.graduationYear}
                onChange={handleChange(setAcademicInfo)}
                placeholder="e.g. 2025"
                icon={Calendar}
            />

            <AnimatedFormField
                label="GPA/Grade"
                name="gpa"
                value={academicInfo.gpa}
                onChange={handleChange(setAcademicInfo)}
                placeholder="e.g. 3.8"
                icon={Star}
            />

            <AnimatedFormField
                label="Favorite Subjects"
                name="favoriteSubjects"
                value={academicInfo.favoriteSubjects}
                onChange={handleChange(setAcademicInfo)}
                placeholder="e.g. Mathematics, Physics"
                icon={Heart}
            />

            <div className="flex justify-end">
                <motion.button
                    onClick={() => handleSave(academicInfo, 'academic')}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Saving..." : "Save Academic Info"}
                    {!loading && <Save className="w-5 h-5" />}
                </motion.button>
            </div>
        </div>
    );

    const renderProfessionalTab = () => (
        <div className="space-y-6">
            <AnimatedFormField
                label="Department"
                name="department"
                value={professionalInfo.department}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="e.g. Technology"
                icon={Building}
            />

            <AnimatedFormField
                label="Position"
                name="position"
                value={professionalInfo.position}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="e.g. Student Developer"
                icon={Briefcase}
            />

            <AnimatedFormField
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={professionalInfo.joiningDate}
                onChange={handleChange(setProfessionalInfo)}
                icon={Calendar}
            />

            <AnimatedFormField
                label="Qualification"
                name="qualification"
                value={professionalInfo.qualification}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="e.g. Bachelor's in Computer Science"
                icon={GraduationCap}
            />

            <AnimatedFormField
                label="Years of Experience"
                name="experience"
                value={professionalInfo.experience}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="e.g. 2"
                icon={Clock}
            />

            <AnimatedFormField
                label="Specialization"
                name="specialization"
                value={professionalInfo.specialization}
                onChange={handleChange(setProfessionalInfo)}
                placeholder="e.g. Full-Stack Development"
                icon={Target}
            />

            <div className="flex justify-end">
                <motion.button
                    onClick={() => handleSave(professionalInfo, 'professional')}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Saving..." : "Save Professional Info"}
                    {!loading && <Save className="w-5 h-5" />}
                </motion.button>
            </div>
        </div>
    );

    const renderAchievementsTab = () => {
        const achievements = user?.role === "student" ? [
            { icon: <Flame className="w-5 h-5" />, title: "Hot Streak", description: "12 days in a row!", color: "from-orange-400 to-red-400" },
            { icon: <Crown className="w-5 h-5" />, title: "Top Performer", description: "Rank #23 globally", color: "from-yellow-400 to-orange-400" },
            { icon: <Shield className="w-5 h-5" />, title: "Wellness Guardian", description: "100 mood checks", color: "from-blue-400 to-cyan-400" },
            { icon: <Trophy className="w-5 h-5" />, title: "Level Master", description: "Reached Level 7", color: "from-purple-400 to-indigo-400" },
            { icon: <Star className="w-5 h-5" />, title: "Superstar", description: "5-star rating", color: "from-pink-400 to-rose-400" },
            { icon: <Target className="w-5 h-5" />, title: "Goal Crusher", description: "50 goals completed", color: "from-green-400 to-emerald-400" }
        ] : [
            { icon: <Award className="w-5 h-5" />, title: "Certified Educator", description: "Completed training", color: "from-blue-400 to-indigo-400" },
            { icon: <Users className="w-5 h-5" />, title: "Mentor", description: "Guided 50+ students", color: "from-green-400 to-teal-400" },
            { icon: <Star className="w-5 h-5" />, title: "Top Rated", description: "4.9/5 student rating", color: "from-yellow-400 to-amber-400" },
        ];
        
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={index}
                            className={`p-4 rounded-2xl bg-gradient-to-r ${achievement.color} bg-opacity-10 border border-white/20 shadow-md`}
                            whileHover={{ scale: 1.03 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-xl bg-gradient-to-r ${achievement.color} text-white`}>
                                    {achievement.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                                    <p className="text-sm text-gray-600">{achievement.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {user?.role === "student" && (
                    <div className="mt-6">
                        <GlassCard title="Progress Stats" gradient="from-indigo-500 to-purple-500">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-indigo-50 rounded-xl">
                                    <div className="text-3xl font-bold text-indigo-600">7</div>
                                    <div className="text-sm text-gray-600">Current Level</div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-xl">
                                    <div className="text-3xl font-bold text-purple-600">2340</div>
                                    <div className="text-sm text-gray-600">XP Points</div>
                                </div>
                                <div className="text-center p-3 bg-orange-50 rounded-xl">
                                    <div className="text-3xl font-bold text-orange-600">12</div>
                                    <div className="text-sm text-gray-600">Day Streak</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-xl">
                                    <div className="text-3xl font-bold text-green-600">23</div>
                                    <div className="text-sm text-gray-600">Global Rank</div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}
            </div>
        );
    };

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>

                <AnimatedFormField
                    label="Current Password"
                    name="current"
                    type={showPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Enter your current password"
                    icon={Key}
                />

                <AnimatedFormField
                    label="New Password"
                    name="newPass"
                    type={showPassword ? "text" : "password"}
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    placeholder="Enter new password"
                    icon={Lock}
                />

                <AnimatedFormField
                    label="Confirm New Password"
                    name="confirmPass"
                    type={showPassword ? "text" : "password"}
                    value={passwords.confirmPass}
                    onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                    placeholder="Confirm new password"
                    icon={Shield}
                    error={passwords.newPass && passwords.confirmPass && passwords.newPass !== passwords.confirmPass ? "Passwords don't match" : ""}
                />

                <div className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        id="show-password"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="mr-2 h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded"
                    />
                    <label htmlFor="show-password" className="text-sm text-gray-600 cursor-pointer select-none">
                        Show password
                    </label>
                </div>
            </div>

            <div className="flex justify-end">
                <motion.button
                    onClick={() => {
                        if (passwords.newPass !== passwords.confirmPass) {
                            toast.error("Passwords don't match");
                            return;
                        }
                        
                        if (!passwords.current || !passwords.newPass) {
                            toast.error("Please fill all password fields");
                            return;
                        }
                        
                        handleSave({
                            currentPassword: passwords.current,
                            newPassword: passwords.newPass
                        }, 'security');
                    }}
                    disabled={loading || (passwords.newPass && passwords.confirmPass && passwords.newPass !== passwords.confirmPass)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center gap-2 ${(loading || (passwords.newPass && passwords.confirmPass && passwords.newPass !== passwords.confirmPass)) ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Updating..." : "Update Password"}
                    {!loading && <Save className="w-5 h-5" />}
                </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                            <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                            <input
                                type="checkbox"
                                id="2fa-toggle"
                                className="absolute w-0 h-0 opacity-0"
                            />
                            <label
                                htmlFor="2fa-toggle"
                                className="absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 bg-gray-300"
                            >
                                <span
                                    className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                            <h4 className="font-medium text-gray-800">Login Notifications</h4>
                            <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                            <input
                                type="checkbox"
                                id="login-toggle"
                                checked={true}
                                className="absolute w-0 h-0 opacity-0"
                            />
                            <label
                                htmlFor="login-toggle"
                                className="absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 bg-indigo-500"
                            >
                                <span
                                    className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform translate-x-6"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPreferencesTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-indigo-500" />
                        Theme
                    </h3>

                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                            <span className="font-medium text-gray-700">Light Mode</span>
                            <input
                                type="radio"
                                name="theme"
                                checked={preferences.theme === "light"}
                                onChange={() => handlePreferenceChange("theme", null, "light")}
                                className="form-radio h-5 w-5 text-indigo-500 focus:ring-indigo-500"
                            />
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-indigo-500" />
                        Notifications
                    </h3>

                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                            <span className="font-medium text-gray-700">Email Notifications</span>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="email-toggle"
                                    checked={preferences.notifications?.email}
                                    onChange={() => handlePreferenceChange("notifications", "email", !preferences.notifications?.email)}
                                    className="absolute w-0 h-0 opacity-0"
                                />
                                <label
                                    htmlFor="email-toggle"
                                    className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${preferences.notifications?.email ? "bg-indigo-500" : "bg-gray-300"}`}
                                >
                                    <span
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.notifications?.email ? "transform translate-x-6" : ""}`}
                                    />
                                </label>
                            </div>
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                            <span className="font-medium text-gray-700">Push Notifications</span>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="push-toggle"
                                    checked={preferences.notifications?.push}
                                    onChange={() => handlePreferenceChange("notifications", "push", !preferences.notifications?.push)}
                                    className="absolute w-0 h-0 opacity-0"
                                />
                                <label
                                    htmlFor="push-toggle"
                                    className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${preferences.notifications?.push ? "bg-indigo-500" : "bg-gray-300"}`}
                                >
                                    <span
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.notifications?.push ? "transform translate-x-6" : ""}`}
                                    />
                                </label>
                            </div>
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                            <span className="font-medium text-gray-700">SMS Notifications</span>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="sms-toggle"
                                    checked={preferences.notifications?.sms}
                                    onChange={() => handlePreferenceChange("notifications", "sms", !preferences.notifications?.sms)}
                                    className="absolute w-0 h-0 opacity-0"
                                />
                                <label
                                    htmlFor="sms-toggle"
                                    className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${preferences.notifications?.sms ? "bg-indigo-500" : "bg-gray-300"}`}
                                >
                                    <span
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.notifications?.sms ? "transform translate-x-6" : ""}`}
                                    />
                                </label>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-indigo-500" />
                        Sound
                    </h3>

                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                            <span className="font-medium text-gray-700">Sound Effects</span>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="effects-toggle"
                                    checked={preferences.sound?.effects}
                                    onChange={() => handlePreferenceChange("sound", "effects", !preferences.sound?.effects)}
                                    className="absolute w-0 h-0 opacity-0"
                                />
                                <label
                                    htmlFor="effects-toggle"
                                    className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${preferences.sound?.effects ? "bg-indigo-500" : "bg-gray-300"}`}
                                >
                                    <span
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.sound?.effects ? "transform translate-x-6" : ""}`}
                                    />
                                </label>
                            </div>
                        </label>

                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                            <span className="font-medium text-gray-700">Background Music</span>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="music-toggle"
                                    checked={preferences.sound?.music}
                                    onChange={() => handlePreferenceChange("sound", "music", !preferences.sound?.music)}
                                    className="absolute w-0 h-0 opacity-0"
                                />
                                <label
                                    htmlFor="music-toggle"
                                    className={`absolute left-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${preferences.sound?.music ? "bg-indigo-500" : "bg-gray-300"}`}
                                >
                                    <span
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.sound?.music ? "transform translate-x-6" : ""}`}
                                    />
                                </label>
                            </div>
                        </label>

                        <div className="p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-700">Volume</span>
                                <span className="text-sm text-gray-500">{preferences.sound?.volume}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={preferences.sound?.volume}
                                onChange={(e) => handlePreferenceChange("sound", "volume", parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <ShieldIcon className="w-5 h-5 text-indigo-500" />
                        Privacy
                    </h3>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">
                                Profile Visibility
                            </label>
                            <select
                                value={preferences.privacy?.profileVisibility}
                                onChange={(e) => handlePreferenceChange("privacy", "profileVisibility", e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50"
                            >
                                <option value="public">Public</option>
                                <option value="friends">Friends Only</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">
                                Contact Information Visibility
                            </label>
                            <select
                                value={preferences.privacy?.contactInfo}
                                onChange={(e) => handlePreferenceChange("privacy", "contactInfo", e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50"
                            >
                                <option value="public">Public</option>
                                <option value="friends">Friends Only</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium text-gray-700">
                                Academic Information Visibility
                            </label>
                            <select
                                value={preferences.privacy?.academicInfo}
                                onChange={(e) => handlePreferenceChange("privacy", "academicInfo", e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all bg-white/50"
                            >
                                <option value="public">Public</option>
                                <option value="friends">Friends Only</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <motion.button
                    onClick={() => handleSave(preferences, 'preferences')}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Saving..." : "Save Preferences"}
                    {!loading && <Save className="w-5 h-5" />}
                </motion.button>
            </div>
        </div>
    );

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
                            <User className="w-8 h-8" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black mb-2 flex items-center justify-center gap-2 text-center">
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Profile
                                </span>
                                <span>👤</span>
                            </h1>
                            <p className="text-gray-600 text-lg font-medium">
                                Manage your personal information
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
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
                >
                    <div className="p-8">
                        {activeTab === "personal" && renderPersonalTab()}
                        {activeTab === "academic" && renderAcademicTab()}
                        {activeTab === "professional" && renderProfessionalTab()}
                        {activeTab === "achievements" && renderAchievementsTab()}
                        {activeTab === "security" && renderSecurityTab()}
                        {activeTab === "preferences" && renderPreferencesTab()}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {saveSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Changes saved successfully!
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;