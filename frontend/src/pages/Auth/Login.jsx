import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../utils/api";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Sparkles,
    ArrowRight,
} from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                {/* Back to Homepage Button */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-6 left-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm flex items-center gap-2"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to Homepage
                </button>

                <div className="w-full max-w-xl">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-3 sm:mb-4">
                                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-gray-300 text-xs sm:text-sm lg:text-base">
                                Sign in to continue your journey
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 sm:p-3 mb-4 sm:mb-6">
                                <p className="text-red-300 text-xs sm:text-sm text-center">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Sign In <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="text-center mt-3 sm:mt-4">
                            <button
                                onClick={() => navigate("/forgot-password")}
                                className="text-purple-400 hover:underline text-xs sm:text-sm block mx-auto"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </div>

                    {/* Registration Links - Outside the form */}
                    <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
                        <h3 className="text-white text-center font-semibold mb-3 sm:mb-4">Don't have an account? Register as:</h3>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                            <button
                                onClick={() => navigate("/school-registration")}
                                className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-xl transition-all duration-300 border border-white/20 whitespace-nowrap"
                            >
                                Register as School
                            </button>
                            <button
                                onClick={() => navigate("/college-registration")}
                                className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-xl transition-all duration-300 border border-white/20 whitespace-nowrap"
                            >
                                Register as College
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-xl transition-all duration-300 border border-white/20 whitespace-nowrap"
                            >
                                Register as Student
                            </button>
                            <button
                                onClick={() => navigate("/register-parent")}
                                className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-xl transition-all duration-300 border border-white/20 whitespace-nowrap"
                            >
                                Register as Parent
                            </button>
                            <button
                                onClick={() => navigate("/register-teacher")}
                                className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-xl transition-all duration-300 border border-white/20 whitespace-nowrap"
                            >
                                Register as Teacher/Mentor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;