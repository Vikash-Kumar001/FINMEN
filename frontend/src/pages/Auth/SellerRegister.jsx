import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const SellerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seller",
    businessName: "",
    shopType: "Stationery",
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

    if (!formData.businessName || !formData.shopType) {
      toast.error("Business name and shop type are required for seller role");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "seller",
        businessName: formData.businessName,
        shopType: formData.shopType,
      };

      await api.post(`/api/auth/register-stakeholder?t=${Date.now()}`, requestData);
      toast.success("Seller account created successfully! Pending admin approval.");
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
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl"
        />
        <div
          className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl"
        />
      </div>

      {/* Back to Homepage Button - Adjusted for mobile */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 z-50"
      >
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
        <span className="hidden xs:inline">Back to Homepage</span>
        <span className="xs:hidden">Home</span>
      </button>

      {/* Added responsive padding and mobile-friendly layout */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="max-w-2xl w-full"
        >
          {/* Adjusted padding for mobile */}
          <div
            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl"
          >
            <div className="text-center mb-5 sm:mb-6">
              <div
                className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-2 sm:mb-3"
              >
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                Seller Registration
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Create your seller/vendor account
              </p>
            </div>

            {/* Adjusted spacing for mobile */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Name and Email in a single row - Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              </div>

              {/* Password and Confirm Password in a single row - Responsive grid */}
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

              {/* Business Name and Shop Type in a single row - Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Business Name */}
                <div className="relative">
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Business Name"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm"
                  />
                </div>

                {/* Shop Type */}
                <div className="relative">
                  <select
                    name="shopType"
                    value={formData.shopType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-xs sm:text-sm"
                  >
                    <option value="Stationery">Stationery</option>
                    <option value="Uniforms">Uniforms</option>
                    <option value="Food">Food</option>
                    <option value="Books">Books</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Other">Other</option>
                  </select>
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
                    <div
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <>
                      Create Seller Account <ArrowRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="text-center mt-3 sm:mt-4">
              <button onClick={() => navigate("/login")} className="text-purple-400 hover:underline text-xs sm:text-sm">
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;