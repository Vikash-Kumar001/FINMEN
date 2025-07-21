import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, User } from 'lucide-react';

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
            const response = await api.post(
                `/api/auth/login`,
                { email, password }
            );

            const { token, user } = response.data;
            localStorage.setItem('finmen_token', token);

            await fetchUser();

            if (user.role === 'educator' && user.approvalStatus === 'pending') {
                navigate('/pending-approval', {
                    state: {
                        message: 'Your educator account is still under review.',
                        user: { email: user.email },
                    },
                });
                return;
            }

            if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'educator') navigate('/educator/dashboard');
            else if (user.role === 'student') navigate('/student/dashboard');
        } catch (err) {
            if (
                err.response?.status === 400 &&
                err.response?.data?.message?.includes('verify')
            ) {
                localStorage.setItem('verificationEmail', email);
                navigate('/verify-email');
            } else if (err.response?.data?.approvalStatus === 'pending') {
                navigate('/pending-approval', {
                    state: {
                        message: err.response.data.message,
                        user: { email },
                    },
                });
            } else {
                setError(err.response?.data?.message || 'Something went wrong.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const token = credentialResponse.credential;
            const res = await api.post(
                `/api/auth/google`,
                { token }
            );

            localStorage.setItem('finmen_token', res.data.token);
            const user = await fetchUser();

            if (user?.role === 'student') {
                navigate('/student/dashboard');
            } else {
                setError('Google login is only available for students.');
                localStorage.removeItem('finmen_token');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Google login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div
                        className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
                        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    />
                </motion.div>

                <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="w-full max-w-md"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.8, ease: 'easeOut' },
                            },
                        }}
                    >
                        <motion.div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl">
                            <motion.div className="text-center mb-8">
                                <motion.div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                </motion.div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome Back</h1>
                                <p className="text-gray-300 text-sm sm:text-base">Sign in to continue your journey</p>
                            </motion.div>

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

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email address"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                        className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
                                >
                                    <span className="flex items-center justify-center">
                                        {isLoading ? (
                                            <motion.div
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            />
                                        ) : (
                                            <>
                                                Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            <div className="text-center mt-4">
                                <button onClick={() => navigate('/forgot-password')} className="text-purple-400 hover:underline text-sm">
                                    Forgot your password?
                                </button>
                            </div>

                            <div className="flex items-center my-8">
                                <div className="flex-1 h-px bg-white/20" />
                                <span className="px-4 text-gray-400 text-sm">or continue with</span>
                                <div className="flex-1 h-px bg-white/20" />
                            </div>

                            <div className="flex justify-center">
                                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-2">
                                    <GoogleLogin
                                        onSuccess={handleGoogleLogin}
                                        onError={() => setError('Google login failed.')}
                                        theme="filled_black"
                                        size="large"
                                        width="300"
                                        text="signin_with"
                                        shape="rectangular"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
