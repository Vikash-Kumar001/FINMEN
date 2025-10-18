import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "school_teacher",
    position: "",
    subjects: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

    if (!formData.position || !formData.subjects) {
      toast.error("Position and subjects are required for teacher role");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "school_teacher",
        position: formData.position,
        subjects: formData.subjects,
      };

      await api.post(`/api/auth/register-stakeholder?t=${Date.now()}`, requestData);
      toast.success("Teacher account created successfully! Pending admin approval.");
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
      [e.target.name]: e.target.value,
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
          className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl"
          animate={{ x: [0, 20, -10, 0], y: [0, 10, -5, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl"
          animate={{ x: [0, -15, 25, 0], y: [0, -5, 15, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
        />
      </motion.div>

      {/* Added responsive padding and mobile-friendly layout */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Buttons - Adjusted for mobile */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
          <button
            onClick={() => navigate("/choose-account-type")}
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
          >
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
            <span className="hidden xs:inline">Back to Account Type</span>
            <span className="xs:hidden">Back</span>
          </button>
        </div>

        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Adjusted padding for mobile */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div className="text-center mb-5 sm:mb-6">
              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mb-2 sm:mb-3"
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </motion.div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                Teacher Registration
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Create your teacher account
              </p>
            </motion.div>

            {/* Adjusted spacing for mobile */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  required
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                />
              </div>

              {/* Password and Confirm Password - Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    required
                    className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Position and Subjects - Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Position (e.g., Mathematics Teacher)"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Adjusted button padding and text sizes */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 text-xs sm:text-sm disabled:opacity-50"
              >
                <span className="flex items-center justify-center">
                  {isLoading ? (
                    <motion.div
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      Create Teacher Account <ArrowRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="text-center mt-3 sm:mt-4">
              <button onClick={() => navigate("/login")} className="text-purple-400 hover:underline text-xs sm:text-sm">
                Already have a Teacher account? Sign in
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherRegister;