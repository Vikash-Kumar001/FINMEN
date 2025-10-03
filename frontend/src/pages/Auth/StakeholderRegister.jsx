import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, UserCheck, ArrowRight, Building } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthUtils";
import { toast } from "react-hot-toast";

const StakeholderRegister = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "csr",
        organization: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    // CSR-only form (role fixed to 'csr')

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const requestData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: "csr",
                organization: formData.organization
            };


            // Add timestamp to prevent caching
            const response = await api.post(`/api/auth/register-stakeholder?t=${Date.now()}`, requestData);

            toast.success("CSR account created successfully! Pending admin approval.");

            // Redirect to login since account needs approval
            navigate("/login");

        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
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
                                <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </motion.div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                                CSR Registration
                            </h1>
                            <p className="text-gray-300 text-xs sm:text-sm lg:text-base">
                                Create your CSR sponsor account
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {/* CSR-only: role selection removed */}

                            {/* Name Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    required
                                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email address"
                                    required
                                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
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

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm Password"
                                    required
                                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                    ) : (
                                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Role-specific fields */}
                            {formData.role === "parent" && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Child Email Address *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="childEmail"
                                            value={formData.childEmail}
                                            onChange={handleInputChange}
                                            placeholder="Enter your child's email address"
                                            required
                                            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        This will link your parent account to your child's student account
                                    </p>
                                </div>
                            )}

                            {formData.role === "seller" && (
                                <>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            placeholder="Business Name"
                                            required
                                            className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="relative">
                                        <select
                                            name="shopType"
                                            value={formData.shopType}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm"
                                        >
                                            <option value="Stationery">Stationery</option>
                                            <option value="Uniforms">Uniforms</option>
                                            <option value="Food">Food</option>
                                            <option value="Books">Books</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {formData.role === "csr" && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleInputChange}
                                        placeholder="Organization Name"
                                        required
                                        className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                    />
                                </div>
                            )}

                            {formData.role === "educator" && (
                                <>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleInputChange}
                                            placeholder="Position (e.g., Mathematics Teacher)"
                                            required
                                            className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="subjects"
                                            value={formData.subjects}
                                            onChange={handleInputChange}
                                            placeholder="Subjects (e.g., Mathematics, Physics)"
                                            required
                                            className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 text-sm sm:text-base disabled:opacity-50"
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
                                            Create CSR Account <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="text-purple-400 hover:underline text-xs sm:text-sm"
                            >
                                Already have an account? Sign in
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default StakeholderRegister;