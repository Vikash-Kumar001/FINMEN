import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { Mail, Send, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email) {
            return setError("Email is required.");
        }

        try {
            setIsLoading(true);
            setError('');
            setMessage('');
            
            // Only log in development (never expose email in production)
            if (import.meta.env.DEV) {
              const apiBaseURL = api.defaults.baseURL;
              console.log('🌐 API Base URL:', apiBaseURL);
              console.log('📧 Sending forgot password request');
            }
            
            const res = await api.post(
                '/api/auth/forgot-password',
                { email }
            );

            if (res.data && res.data.message) {
                setMessage(res.data.message || 'OTP sent successfully!');
                localStorage.setItem('reset_password_email', email);
                // Small delay to show success message before navigation
                setTimeout(() => {
                    navigate('/verify-otp');
                }, 1000);
            } else {
                setError('Unexpected response from server. Please try again.');
                setIsLoading(false);
            }
        } catch (err) {
            // Log full error details for debugging
            console.error('🔴 API Error:', err);
            console.error('Error type:', typeof err);
            console.error('Error message:', err?.message);
            console.error('Error response:', err?.response);
            console.error('Error response data:', err?.response?.data);
            console.error('Error status:', err?.response?.status);
            console.error('Error code:', err?.code);
            
            let errorMessage = 'Failed to send OTP. Please try again.';
            
            // Extract error message from response
            const responseMessage = err?.response?.data?.message;
            const errorMsg = err?.message;
            
            // Network error (CORS, connection refused, etc.)
            if (err.code === 'ERR_NETWORK' || errorMsg === 'Network Error') {
                errorMessage = 'Unable to connect to server. Please check your internet connection or contact support.';
            }
            // Request timeout
            else if (err.code === 'ECONNABORTED' || (errorMsg && errorMsg.includes('timeout'))) {
                errorMessage = 'Request timed out. Please try again.';
            }
            // Server error (500+)
            else if (err.response?.status >= 500) {
                // Use server message if available, otherwise generic message
                errorMessage = responseMessage || 'Server error. Please try again later or contact support.';
            }
            // Client error (400-499) - use server message
            else if (err.response?.status >= 400 && err.response?.status < 500) {
                errorMessage = responseMessage || 'Invalid request. Please check your email and try again.';
            }
            // Use response message if available
            else if (responseMessage) {
                errorMessage = responseMessage;
            }
            // Use error message if available
            else if (errorMsg && typeof errorMsg === 'string' && errorMsg.length > 0) {
                errorMessage = errorMsg;
            }
            
            console.error('Final error message:', errorMessage);
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 px-4">
            <motion.div
                className="bg-white/10 border border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10 w-full max-w-md"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-indigo-500 mb-4">
                        <Mail className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Forgot Password?
                    </h2>
                    <p className="text-gray-300 mt-2 text-sm">
                        Enter your email to receive a reset OTP.
                    </p>
                </div>

                {message && (
                    <div className="bg-green-500/10 text-green-300 text-sm px-4 py-2 rounded-xl mb-4 border border-green-500/20">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-500/10 text-red-300 text-sm px-4 py-2 rounded-xl mb-4 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send OTP
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-400">
                    Remember your password?{" "}
                    <button
                        className="text-indigo-400 hover:text-indigo-300 font-semibold"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
