import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck, RefreshCw, ShieldCheck } from "lucide-react";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [mode, setMode] = useState(""); // 'register' or 'forgot'
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const [resendDisabled, setResendDisabled] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const registerEmail = localStorage.getItem("pending_verification_email");
        const resetEmail = localStorage.getItem("reset_password_email");

        if (registerEmail) {
            setMode("register");
            setEmail(registerEmail);
        } else if (resetEmail) {
            setMode("forgot");
            setEmail(resetEmail);
        } else {
            return navigate("/login");
        }
    }, []);

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

        try {
            const res = await api.post('/api/auth/verify-otp', {
                email,
                otp,
            });

            // If this is registration verification
            if (mode === "register") {
                localStorage.removeItem("pending_verification_email");
                setSuccess("OTP verified! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1500);
            }

            // If this is forgot password verification
            if (mode === "forgot") {
                localStorage.setItem("verified_reset_email", email);
                localStorage.removeItem("reset_password_email");
                setSuccess("OTP verified! Redirecting to password reset...");
                setTimeout(() => navigate("/reset-password"), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "OTP verification failed.");
        }
    };

    const handleResendOTP = async () => {
        setError("");
        setSuccess("");

        try {
            await api.post('/api/auth/resend-otp', { email });
            setResendTimer(60);
            setResendDisabled(true);
            setSuccess("OTP resent successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP.");
        }
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
                    Enter the 6-digit OTP sent to <strong>{email}</strong>
                </p>

                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                {success && <p className="text-green-400 text-center mb-4">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        maxLength={6}
                        required
                        className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition duration-300"
                    >
                        Verify OTP
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleResendOTP}
                        disabled={resendDisabled}
                        className="flex items-center justify-center gap-2 text-sm text-green-300 hover:text-white disabled:text-gray-500"
                    >
                        <RefreshCw className="w-4 h-4" />
                        {resendDisabled ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;
