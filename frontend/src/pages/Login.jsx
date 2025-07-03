import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please enter both email and password.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_API}/auth/login`, {
                email,
                password
            }, { withCredentials: true });
            localStorage.setItem('finmen_token', res.data.token);
            const user = await fetchUser();
            if (user?.role === "admin") {
                navigate("/admin");
            } else if (user?.role === "educator") {
                navigate("/educator");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const token = credentialResponse.credential;
            const res = await axios.post(
                `${import.meta.env.VITE_API}/auth/google`,
                { token },
                { withCredentials: true }
            );
            localStorage.setItem('finmen_token', res.data.token);
            const user = await fetchUser();
            if (user?.role === "admin") {
                navigate("/admin");
            } else if (user?.role === "educator") {
                navigate("/educator");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError('Google login failed.');
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

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Animated Background Elements */}
                <motion.div
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Gradient Orbs */}
                    <motion.div
                        className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
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
                        className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
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
                    {[...Array(20)].map((_, i) => (
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

                {/* Main Content */}
                <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="w-full max-w-md"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Login Card */}
                        <motion.div
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl"
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {/* Header */}
                            <motion.div
                                className="text-center mb-8"
                                variants={itemVariants}
                            >
                                <motion.div
                                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4"
                                    variants={floatingVariants}
                                    animate="animate"
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                </motion.div>
                                
                                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                    Welcome Back
                                </h1>
                                <p className="text-gray-300 text-sm sm:text-base">
                                    Sign in to continue your journey
                                </p>
                            </motion.div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-red-300 text-sm text-center">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Login Form */}
                            <motion.form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                                variants={itemVariants}
                            >
                                {/* Email Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    />
                                </motion.div>

                                {/* Password Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </motion.div>

                                {/* Login Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10 flex items-center justify-center">
                                        {isLoading ? (
                                            <motion.div
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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

                            {/* Divider */}
                            <motion.div
                                className="flex items-center my-8"
                                variants={itemVariants}
                            >
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <span className="px-4 text-gray-400 text-sm font-medium">or continue with</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </motion.div>

                            {/* Google Login */}
                            <motion.div
                                className="flex justify-center"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-2 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                                    <GoogleLogin
                                        onSuccess={handleGoogleLogin}
                                        onError={() => setError('Google login failed.')}
                                        theme="filled_black"
                                        size="large"
                                        width="100%"
                                        text="continue_with"
                                    />
                                </div>
                            </motion.div>

                            {/* Register Link */}
                            <motion.div
                                className="text-center mt-8 pt-6 border-t border-white/10"
                                variants={itemVariants}
                            >
                                <p className="text-gray-300 text-sm">
                                    Don't have an account?{' '}
                                    <motion.button
                                        onClick={() => navigate('/register')}
                                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors relative group"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        Create Account
                                        <motion.span
                                            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"
                                            layoutId="underline"
                                        />
                                    </motion.button>
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div
                            className="text-center mt-8"
                            variants={itemVariants}
                        >
                            <p className="text-gray-400 text-xs">
                                Protected by industry-standard encryption
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;