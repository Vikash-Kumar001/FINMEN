import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  School, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Building,
  BookOpen,
  Users
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const SchoolRegistration = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolId: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactInfo: {
      phone: "",
      address: "",
      website: "",
      city: "",
      state: "",
      pincode: ""
    },
    academicInfo: {
      classes: [],
      streams: [],
      board: "",
      establishedYear: "",
      totalStudents: "",
      totalTeachers: ""
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const classOptions = [
    { value: "1", label: "Class 1" },
    { value: "2", label: "Class 2" },
    { value: "3", label: "Class 3" },
    { value: "4", label: "Class 4" },
    { value: "5", label: "Class 5" },
    { value: "6", label: "Class 6" },
    { value: "7", label: "Class 7" },
    { value: "8", label: "Class 8" },
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
    { value: "11", label: "Class 11" },
    { value: "12", label: "Class 12" }
  ];

  const streamOptions = [
    { value: "science", label: "Science" },
    { value: "commerce", label: "Commerce" },
    { value: "arts", label: "Arts" }
  ];

  const boardOptions = [
    { value: "cbse", label: "CBSE" },
    { value: "icse", label: "ICSE" },
    { value: "state", label: "State Board" },
    { value: "ib", label: "IB" },
    { value: "igcse", label: "IGCSE" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contactInfo.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value,
        },
      }));
    } else if (name.startsWith("academicInfo.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        academicInfo: {
          ...prev.academicInfo,
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

  const handleClassChange = (classValue) => {
    setFormData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        classes: prev.academicInfo.classes.includes(classValue)
          ? prev.academicInfo.classes.filter(c => c !== classValue)
          : [...prev.academicInfo.classes, classValue]
      }
    }));
  };

  const handleStreamChange = (streamValue) => {
    setFormData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        streams: prev.academicInfo.streams.includes(streamValue)
          ? prev.academicInfo.streams.filter(s => s !== streamValue)
          : [...prev.academicInfo.streams, streamValue]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.academicInfo.classes.length === 0) {
      toast.error("Please select at least one class");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/company/signup", {
        name: formData.schoolName,
        email: formData.email,
        password: formData.password,
        contactInfo: formData.contactInfo,
        type: "school",
        academicInfo: formData.academicInfo,
        schoolId: formData.schoolId
      });
      if (response.data && response.data.token && response.data.user) {
        // Store token
        localStorage.setItem("finmen_token", response.data.token);
        // Fetch authenticated user to ensure correct role/tenant
        try {
          const userRes = await api.get("/api/auth/me");
          localStorage.setItem("finmen_user", JSON.stringify(userRes.data));
        } catch {
          toast.error("Failed to fetch user context after registration");
        }
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/school/admin/dashboard");
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      if (error.response?.data?.error === 'DUPLICATE_EMAIL') {
        toast.error("A school with this email already exists. Please use a different email.");
      } else if (error.response?.data?.error === 'DUPLICATE_INSTITUTION_ID') {
        toast.error("School ID already exists. Please use a different School ID.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", description: "School details and credentials" },
    { number: 2, title: "Contact Information", description: "Address and contact details" },
    { number: 3, title: "Academic Setup", description: "Classes, streams, and board information" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">School Registered Successfully!</h2>
            <p className="text-gray-700 mb-6">Your school has been registered. You can now log in to your account and start using the platform.</p>
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              onClick={() => navigate("/login")}
            >
              Login Now
            </button>
          </motion.div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">School Registration</h1>
            </div>
            <button
              onClick={() => navigate("/institution-type")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Selection
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                  step >= stepItem.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepItem.number ? <CheckCircle className="w-5 h-5" /> : stepItem.number}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{stepItem.title}</p>
                  <p className="text-xs text-gray-500">{stepItem.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Information</h2>
                  <p className="text-gray-600">Enter your school's basic details and create your account</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <School className="w-4 h-4 inline mr-2" />
                      School Name *
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter school name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Building className="w-4 h-4 inline mr-2" />
                      School ID *
                    </label>
                    <input
                      type="text"
                      name="schoolId"
                      value={formData.schoolId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter unique school ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Create password"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
                  <p className="text-gray-600">Provide your school's contact and address details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="contactInfo.phone"
                      value={formData.contactInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Website
                    </label>
                    <input
                      type="url"
                      name="contactInfo.website"
                      value={formData.contactInfo.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter website URL"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Address *
                    </label>
                    <textarea
                      name="contactInfo.address"
                      value={formData.contactInfo.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter complete address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="contactInfo.city"
                      value={formData.contactInfo.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="contactInfo.state"
                      value={formData.contactInfo.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="contactInfo.pincode"
                      value={formData.contactInfo.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Academic Setup */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Academic Setup</h2>
                  <p className="text-gray-600">Configure your school's academic structure and information</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Classes Offered *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {classOptions.map((classOption) => (
                        <label key={classOption.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.academicInfo.classes.includes(classOption.value)}
                            onChange={() => handleClassChange(classOption.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{classOption.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Users className="w-4 h-4 inline mr-2" />
                      Streams (for Classes 11-12)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {streamOptions.map((streamOption) => (
                        <label key={streamOption.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.academicInfo.streams.includes(streamOption.value)}
                            onChange={() => handleStreamChange(streamOption.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{streamOption.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Board *
                      </label>
                      <select
                        name="academicInfo.board"
                        value={formData.academicInfo.board}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Board</option>
                        {boardOptions.map((board) => (
                          <option key={board.value} value={board.value}>
                            {board.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Established Year *
                      </label>
                      <input
                        type="number"
                        name="academicInfo.establishedYear"
                        value={formData.academicInfo.establishedYear}
                        onChange={handleInputChange}
                        required
                        min="1900"
                        max="2024"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter year"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Total Students
                      </label>
                      <input
                        type="number"
                        name="academicInfo.totalStudents"
                        value={formData.academicInfo.totalStudents}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter number of students"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Total Teachers
                      </label>
                      <input
                        type="number"
                        name="academicInfo.totalTeachers"
                        value={formData.academicInfo.totalTeachers}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter number of teachers"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  step === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? "Creating School..." : "Create School"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
