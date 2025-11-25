import React, { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck, RefreshCw, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [mode, setMode] = useState(""); // 'register' or 'forgot'
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const otpInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check for email from navigation state first (from forgot password page)
        if (location.state?.email) {
            setMode(location.state.mode || "forgot");
            setEmail(location.state.email);
            setEmailSent(true);
            return;
        }

        // Fallback to localStorage
        const registerEmail = localStorage.getItem("pending_verification_email");
        const resetEmail = localStorage.getItem("reset_password_email");

        if (registerEmail) {
            setMode("register");
            setEmail(registerEmail);
            setEmailSent(true);
        } else if (resetEmail) {
            setMode("forgot");
            setEmail(resetEmail);
            setEmailSent(true);
        } else {
            return navigate("/login");
        }
    }, [navigate, location]);

    // Auto-focus OTP input when component mounts
    useEffect(() => {
        if (otpInputRef.current && email) {
            otpInputRef.current.focus();
        }
    }, [email]);

    useEffect(() => {
        let timer;
        if (resendTimer > 0 && resendDisabled) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        } else {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [resendTimer, resendDisabled]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsVerifying(true);

        try {
            const res = await api.post('/api/auth/verify-otp', {
                email,
                otp,
                type: mode === "forgot" ? "reset" : "verify",
            });

            // If this is registration verification
            if (mode === "register") {
                localStorage.removeItem("pending_verification_email");
                setSuccess("OTP verified! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1500);
            }

            // If this is forgot password verification
            if (mode === "forgot") {
                // Store verified email and OTP for password reset
                localStorage.setItem("verified_reset_email", email);
                localStorage.setItem("verified_reset_otp", otp);
                localStorage.removeItem("reset_password_email");
                setSuccess("OTP verified! Redirecting to password reset...");
                setTimeout(() => navigate("/reset-password"), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "OTP verification failed.");
            // Clear OTP input on error for better UX
            setOtp("");
            if (otpInputRef.current) {
                otpInputRef.current.focus();
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        setError("");
        setSuccess("");
        setIsResending(true);

        try {
            if (mode === "forgot") {
                // For password reset, use forgot-password endpoint
                await api.post('/api/auth/forgot-password', { email });
            } else {
                // For registration, use resend-otp endpoint
                await api.post('/api/auth/resend-otp', { email });
            }
            setResendTimer(60);
            setResendDisabled(true);
            setEmailSent(true);
            setSuccess("OTP resent successfully! Please check your email.");
            // Clear previous OTP
            setOtp("");
            if (otpInputRef.current) {
                otpInputRef.current.focus();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setIsResending(false);
        }
    };

    // Auto-format OTP input (only numbers, max 6 digits)
    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
        setError(""); // Clear error when user types
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl max-w-md w-full shadow-xl"
            >
                <div className="flex items-center justify-center mb-6">
                    {mode === "register" ? (
                        <MailCheck className="w-8 h-8 text-green-400" />
                    ) : (
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    )}
                    <h2 className="ml-2 text-xl text-white font-semibold">
                        {mode === "register" ? "Verify Your Email" : "Reset Password OTP"}
                    </h2>
                </div>

                <p className="text-gray-300 text-sm text-center mb-6">
                    Enter the 6-digit OTP sent to <strong className="text-white">{email}</strong>
                </p>

                {emailSent && !error && !success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 text-green-400 text-sm mb-4"
                    >
                        <MailCheck className="w-4 h-4" />
                        <span>OTP sent! Check your inbox.</span>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-center mb-4 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                    >
                        {error}
                    </motion.div>
                )}
                
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 text-green-400 text-center mb-4 text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{success}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            ref={otpInputRef}
                            type="text"
                            inputMode="numeric"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="000000"
                            maxLength={6}
                            required
                            disabled={isVerifying}
                            className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        />
                        {otp.length > 0 && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                                {otp.length}/6
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isVerifying || otp.length !== 6}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center gap-2"
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify OTP"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleResendOTP}
                        disabled={resendDisabled || isResending}
                        className="flex items-center justify-center gap-2 text-sm text-green-300 hover:text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-colors mx-auto"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <RefreshCw className={`w-4 h-4 ${!resendDisabled ? 'animate-pulse' : ''}`} />
                                {resendDisabled ? `Resend in ${resendTimer}s` : "Resend OTP"}
                            </>
                        )}
                    </button>
                    {resendTimer > 0 && resendDisabled && (
                        <p className="text-gray-400 text-xs mt-2">
                            Please wait before requesting a new OTP
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;
