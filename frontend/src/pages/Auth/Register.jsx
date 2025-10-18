import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, UserPlus, ArrowRight, Shield, Zap, User, Calendar } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!fullName.trim() || !dob || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }

        if (fullName.trim().length === 0) {
            setError('Full name is required.');
            setIsLoading(false);
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
            setError('Date of Birth must be in YYYY-MM-DD format.');
            setIsLoading(false);
            return;
        }
        const dobDate = new Date(dob);
        if (isNaN(dobDate.getTime())) {
            setError('Invalid Date of Birth.');
            setIsLoading(false);
            return;
        }
        const today = new Date();
        if (dobDate > today) {
            setError('Date of Birth cannot be in the future.');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            // Register the user
            await api.post(`/api/auth/register`, {
                email,
                password,
                fullName: fullName.trim(),
                dateOfBirth: dob
            });

            // Now log in the user
            const res = await api.post(`/api/auth/login`, {
                email,
                password
            });

            localStorage.setItem('finmen_token', res.data.token);
            const user = await fetchUser();
            if (user?.role === "admin") {
                navigate("/admin/dashboard");
            } else if (user?.role === "student") {
                navigate("/student/dashboard");
            } else {
                // For any other roles, use the proper routing logic
                navigate("/student/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'from-red-500 to-orange-500';
        if (passwordStrength <= 3) return 'from-yellow-500 to-amber-500';
        return 'from-green-500 to-emerald-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 3) return 'Medium';
        return 'Strong';
    };

    return (
        // Changed from min-h-screen to h-screen to ensure exact screen height
        // Added responsive padding and mobile-friendly layout
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Gradient Orbs */}
                <motion.div
                    className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Floating particles */}
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </motion.div>

            {/* Main Content - Changed to use flex to fill entire screen */}
            {/* Added responsive padding and mobile-friendly positioning */}
            <div className="relative z-10 h-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                {/* Back to Homepage Button - Adjusted positioning for mobile */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 z-50"
                >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                    <span className="hidden xs:inline">Back to Homepage</span>
                    <span className="xs:hidden">Home</span>
                </button>

                <motion.div
                    className="w-full max-w-2xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Register Card - Adjusted padding for mobile */}
                    <motion.div
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl"
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {/* Header - Adjusted text sizes for mobile */}
                        <motion.div
                            className="text-center mb-6 sm:mb-8"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-3 sm:mb-4"
                                variants={floatingVariants}
                                animate="animate"
                            >
                                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </motion.div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                                Create Account
                            </h1>
                            <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                                Join the gamified learning experience
                            </p>
                        </motion.div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 sm:p-3 mb-4 sm:mb-6"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-red-300 text-xs sm:text-sm text-center">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Register Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4 sm:space-y-6"
                            variants={itemVariants}
                        >
                            {/* Full Name and Date of Birth Fields - Responsive grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Full Name Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    />
                                </motion.div>

                                {/* Date of Birth Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        placeholder="Date of Birth"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    />
                                </motion.div>
                            </div>

                            {/* Email Field */}
                            <motion.div
                                className="relative"
                                whileFocus={{ scale: 1.02 }}
                            >
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                />
                            </motion.div>

                            {/* Password and Confirm Password Fields - Responsive grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Password Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                                    </button>
                                </motion.div>

                                {/* Confirm Password Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                                    </button>
                                </motion.div>
                            </div>

                            {/* Password Strength Indicator */}
                            <AnimatePresence>
                                {password && (
                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs sm:text-sm text-gray-400">Password Strength</span>
                                            <span className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${getPasswordStrengthColor()} bg-clip-text text-transparent`}>
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
                                            <motion.div
                                                className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${getPasswordStrengthColor()}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Password Match Indicator */}
                            <AnimatePresence>
                                {confirmPassword && (
                                    <motion.div
                                        className="flex items-center space-x-2"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${password === confirmPassword ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className={`text-xs sm:text-sm ${password === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                                            {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Register Button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group text-sm sm:text-base"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {isLoading ? (
                                        <motion.div
                                            className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                    ) : (
                                        <>
                                            <Zap className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            Create Account
                                            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.8 }}
                                />
                            </motion.button>
                        </motion.form>

                        {/* Login Link */}
                        <motion.div
                            className="text-center mt-6 pt-5 border-t border-white/10"
                            variants={itemVariants}
                        >
                            <p className="text-gray-300 text-xs sm:text-sm">
                                Already have a Student account?{' '}
                                <motion.button
                                    onClick={() => navigate('/login')}
                                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors relative group"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Sign In
                                    <motion.span
                                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"
                                        layoutId="underline"
                                    />
                                </motion.button>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;