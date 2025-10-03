import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Sparkles,
    ArrowRight,
} from "lucide-react";

const Login = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const allowedOriginsEnv = import.meta.env.VITE_GOOGLE_ALLOWED_ORIGINS || "";
    const allowedOrigins = allowedOriginsEnv
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
    const defaultDevOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
    ];
    const effectiveAllowed = allowedOrigins.length ? allowedOrigins : defaultDevOrigins;
    const originAllowed = effectiveAllowed.includes(window.location.origin);
    const isGoogleEnabled = Boolean(clientId);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [lastFocused, setLastFocused] = useState(null);

    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email || !password) {
            setError("Please enter both email and password.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post(`/api/auth/login`, { email, password });

            const { token, user } = response.data;
            localStorage.setItem("finmen_token", token);

            await fetchUser();

            if (user.role === "educator" && user.approvalStatus === "pending") {
                navigate("/pending-approval", {
                    state: {
                        message: "Your educator account is still under review.",
                        user: { email: user.email },
                    },
                });
                return;
            }

            // Navigate based on user role
            switch (user.role) {
                case "admin":
                    navigate("/admin/dashboard");
                    break;
                case "educator":
                    navigate("/educator/dashboard");
                    break;
                case "parent":
                    navigate("/parent/dashboard");
                    break;
                case "seller":
                    navigate("/seller/dashboard");
                    break;
                case "csr":
                    navigate("/csr/dashboard");
                    break;
                case "student":
                default:
                    navigate("/student/dashboard");
                    break;
            }
        } catch (err) {
            if (
                err.response?.status === 400 &&
                err.response?.data?.message?.includes("verify")
            ) {
                localStorage.setItem("verificationEmail", email);
                navigate("/verify-email");
            } else if (err.response?.data?.approvalStatus === "pending") {
                navigate("/pending-approval", {
                    state: {
                        message: err.response.data.message,
                        user: { email },
                    },
                });
            } else {
                setError(err.response?.data?.message || "Something went wrong.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        setIsLoading(true);
        setError("");

        try {
            const token = credentialResponse?.credential;

            if (!token) {
                setError("No Google credential received.");
                return;
            }

            const res = await api.post(`/api/auth/google`, { token });

            localStorage.setItem("finmen_token", res.data.token);

            const user = await fetchUser();

            if (user?.role === "student") {
                navigate("/student/dashboard");
            } else {
                setError("Google login is only available for students.");
                localStorage.removeItem("finmen_token");
            }
        } catch (err) {
            console.error("🔴 Google login error:", err);
            if (err.response) {
                console.error("🔴 Response:", err.response);
            }

            setError(err.response?.data?.message || "Google login failed.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (lastFocused === "email" && emailRef.current && document.activeElement !== emailRef.current) {
            emailRef.current.focus();
        }
    }, [email, lastFocused]);

    useEffect(() => {
        if (lastFocused === "password" && passwordRef.current && document.activeElement !== passwordRef.current) {
            passwordRef.current.focus();
        }
    }, [password, lastFocused]);

    const Wrapper = ({ children }) => (
        clientId ? (
            <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
        ) : (
            <>{children}</>
        )
    );

    return (
        <Wrapper>
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
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
                        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
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
                                transition: { duration: 0.8, ease: "easeOut" },
                            },
                        }}
                    >
                        <motion.div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
                            <motion.div className="text-center mb-6 sm:mb-8">
                                <motion.div
                                    className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-3 sm:mb-4"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </motion.div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                                    Welcome Back
                                </h1>
                                <p className="text-gray-300 text-xs sm:text-sm lg:text-base">
                                    Sign in to continue your journey
                                </p>
                            </motion.div>

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

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setLastFocused("email")}
                                        ref={emailRef}
                                        placeholder="Email address"
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setLastFocused("password")}
                                        ref={passwordRef}
                                        placeholder="Password"
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                        ) : (
                                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                        )}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 text-sm sm:text-base"
                                >
                                    <span className="flex items-center justify-center">
                                        {isLoading ? (
                                            <motion.div
                                                className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            />
                                        ) : (
                                            <>
                                                Sign In <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            <div className="text-center mt-3 sm:mt-4 space-y-2">
                                <button
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-purple-400 hover:underline text-xs sm:text-sm block"
                                >
                                    Forgot your password?
                                </button>
                                <button
                                    onClick={() => navigate("/register-stakeholder")}
                                    className="text-blue-400 hover:underline text-xs sm:text-sm block"
                                >
                                    Register as Parent/Seller/CSR
                                </button>
                            </div>

                            {isGoogleEnabled && (
                                <>
                                    <div className="flex items-center my-4 sm:my-6">
                                        <div className="flex-1 h-px bg-white/20" />
                                        <span className="px-2 sm:px-4 text-gray-400 text-xs sm:text-sm">
                                            or continue with
                                        </span>
                                        <div className="flex-1 h-px bg-white/20" />
                                    </div>

                                    <div className="flex justify-center">
                                        <div className="w-full max-w-[280px] sm:max-w-[300px] bg-white/5 border border-white/10 rounded-xl p-1 sm:p-2">
                                            <GoogleLogin
                                                onSuccess={handleGoogleLogin}
                                                onError={() => setError("Google login failed.")}
                                                theme="filled_black"
                                                size="large"
                                                width={280}
                                                text="signin_with"
                                                shape="rectangular"
                                                logo_alignment="left"
                                                locale="en"
                                                useOneTap={false}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {!clientId && (
                                <div className="mt-4 text-center text-gray-300 text-xs sm:text-sm">
                                    Google Sign-In is unavailable: missing client ID.
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </Wrapper>
    );
};

export default Login;