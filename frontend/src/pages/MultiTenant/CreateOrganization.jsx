import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  School, 
  GraduationCap, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle,
  Building,
  Calendar,
  MapPin
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const CreateOrganization = () => {
  const [step, setStep] = useState(1);
  const [orgType, setOrgType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    settings: {
      academicYear: {
        startDate: "",
        endDate: "",
      },
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      contactInfo: {
        phone: "",
        email: "",
      },
    },
    adminUser: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("settings.")) {
      const keys = name.split(".");
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [keys[1]]: {
            ...prev.settings[keys[1]],
            [keys[2]]: value,
          },
        },
      }));
    } else if (name.startsWith("adminUser.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        adminUser: {
          ...prev.adminUser,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTypeSelection = (type) => {
    setOrgType(type);
    setFormData(prev => ({
      ...prev,
      type,
    }));
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.adminUser.name || !formData.adminUser.email || !formData.adminUser.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.adminUser.password.length < 6) {
      toast.error("Admin password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("company_token");
      const response = await api.post("/api/company/organizations", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Organization created successfully!");
      
      // Store admin token and redirect to dashboard
      localStorage.setItem("finmen_token", response.data.admin.token);
      localStorage.removeItem("company_token");
      
      // Redirect based on organization type
      const dashboardPath = formData.type === "school" ? "/school-admin/dashboard" : "/college-admin/dashboard";
      navigate(dashboardPath);

    } catch (error) {
      console.error("Organization creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create organization");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Organization Type Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Organization Type
            </h1>
            <p className="text-xl text-gray-600">
              Select the type of educational institution you want to manage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* School Option */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelection("school")}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <School className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">School</h3>
                
                <p className="text-gray-600 mb-6">
                  Perfect for K-12 schools with classes 1-12, streams for higher classes, and comprehensive student management.
                </p>
                
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Classes 1-12 with sections
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Streams for classes 11-12
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Teacher & student management
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Fee management & reports
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Parent communication
                  </div>
                </div>
              </div>
            </motion.div>

            {/* College Option */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelection("college")}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">College</h3>
                
                <p className="text-gray-600 mb-6">
                  Ideal for colleges and universities with departments, courses, semesters, and advanced features.
                </p>
                
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Departments & courses
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Semester-based system
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Faculty & student management
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Placement management
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Alumni network
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Step 2: Organization Details Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {orgType === "school" ? <School className="w-8 h-8 text-white" /> : <GraduationCap className="w-8 h-8 text-white" />}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your {orgType === "school" ? "School" : "College"}
          </h1>
          <p className="text-gray-600">
            Fill in the details to set up your {orgType}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {orgType === "school" ? "School" : "College"} Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${orgType} name`}
              />
            </div>
          </div>

          {/* Academic Year */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year Start
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="settings.academicYear.startDate"
                  value={formData.settings.academicYear.startDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year End
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="settings.academicYear.endDate"
                  value={formData.settings.academicYear.endDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="settings.contactInfo.phone"
                  value={formData.settings.contactInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="settings.contactInfo.email"
                  value={formData.settings.contactInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="settings.address.street"
                  value={formData.settings.address.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Street address"
                />
                <input
                  type="text"
                  name="settings.address.city"
                  value={formData.settings.address.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
                <input
                  type="text"
                  name="settings.address.state"
                  value={formData.settings.address.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="State"
                />
                <input
                  type="text"
                  name="settings.address.pincode"
                  value={formData.settings.address.pincode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          {/* Admin User */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Admin User Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="adminUser.name"
                  value={formData.adminUser.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="adminUser.email"
                  value={formData.adminUser.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="adminUser.password"
                  value={formData.adminUser.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin password"
                />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold"
            >
              Back
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create {orgType === "school" ? "School" : "College"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateOrganization;