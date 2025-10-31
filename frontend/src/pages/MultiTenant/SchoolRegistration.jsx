import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line
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
  Users,
  Calendar
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
  const activeStepRef = useRef(null);
  const progressContainerRef = useRef(null);

  // Auto-scroll to active step on mobile
  useEffect(() => {
    if (activeStepRef.current && progressContainerRef.current) {
      const container = progressContainerRef.current;
      const activeStep = activeStepRef.current;
      
      // Only auto-scroll on mobile devices
      if (window.innerWidth < 640) {
        const containerRect = container.getBoundingClientRect();
        const activeStepRect = activeStep.getBoundingClientRect();
        
        const scrollLeft = activeStep.offsetLeft - containerRect.width / 2 + activeStepRect.width / 2;
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [step]);

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

  const handleNext = () => {
    // Validate current step before proceeding
    let errorMessage = "";

    if (step === 1) {
      // Validate basic information
      if (!formData.schoolName.trim()) {
        errorMessage = "School name is required";
      } else if (!formData.schoolId.trim()) {
        errorMessage = "School ID is required";
      } else if (!formData.email.trim()) {
        errorMessage = "Email is required";
      } else if (!formData.password) {
        errorMessage = "Password is required";
      } else if (formData.password !== formData.confirmPassword) {
        errorMessage = "Passwords do not match";
      } else if (formData.password.length < 6) {
        errorMessage = "Password must be at least 6 characters";
      }
    } else if (step === 2) {
      // Validate contact information
      if (!formData.contactInfo.phone.trim()) {
        errorMessage = "Phone number is required";
      } else if (!formData.contactInfo.address.trim()) {
        errorMessage = "Address is required";
      } else if (!formData.contactInfo.city.trim()) {
        errorMessage = "City is required";
      } else if (!formData.contactInfo.state.trim()) {
        errorMessage = "State is required";
      } else if (!formData.contactInfo.pincode.trim()) {
        errorMessage = "Pincode is required";
      }
    } else if (step === 3) {
      // Validate academic information
      if (formData.academicInfo.classes.length === 0) {
        errorMessage = "Please select at least one class";
      } else if (!formData.academicInfo.board.trim()) {
        errorMessage = "Educational board is required";
      }
    }

    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      setStep(step + 1);
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", description: "School details and credentials" },
    { number: 2, title: "Contact Information", description: "Address and contact details" },
    { number: 3, title: "Academic Setup", description: "Classes, streams, and board information" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl"></div>
      </div>

      {/* Back Buttons - Adjusted for mobile */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <button
          onClick={() => navigate('/')}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
        >
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
          <span className="hidden xs:inline">Back to Homepage</span>
          <span className="xs:hidden">Home</span>
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-8 max-w-md w-full text-center"
          >
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">School Registered Successfully!</h2>
            <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">Your school has been registered. You can now log in to your account and start using the platform.</p>
            <button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
              onClick={() => navigate("/login")}
            >
              Login Now
            </button>
          </motion.div>
        </div>
      )}
      {/* Main Content - Added responsive padding */}
      <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Progress Steps - Adjusted for mobile */}
      <div className="bg-transparent border-b border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div 
            ref={progressContainerRef}
            className="flex items-center justify-between pb-2 overflow-x-auto sm:overflow-x-hidden"
          >
            {steps.map((stepItem, index) => (
              <div 
                key={stepItem.number} 
                className="flex items-center flex-shrink-0"
                ref={stepItem.number === step ? activeStepRef : null}
              >
                <div
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-semibold cursor-pointer ${step >= stepItem.number
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/10 text-gray-400'
                    } ${stepItem.number > step ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => stepItem.number <= step && setStep(stepItem.number)}
                >
                  {step > stepItem.number ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : stepItem.number}
                </div>
                <div className="ml-2 sm:ml-3 min-w-0">
                  <p className={`text-xs sm:text-sm font-medium ${stepItem.number <= step ? 'text-white' : 'text-gray-500'}`}>{stepItem.title}</p>
                  <p className={`text-xs hidden sm:block ${stepItem.number <= step ? 'text-gray-400' : 'text-gray-600'}`}>{stepItem.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > stepItem.number ? 'bg-purple-500' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
        {/* Adjusted padding for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-5 sm:p-8"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5 sm:space-y-6"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Basic Information</h2>
                  <p className="text-gray-300 text-xs sm:text-sm">Enter your school's basic details and create your account</p>
                </div>

                {/* Adjusted grid for mobile */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <School className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      School Name *
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                      placeholder="Enter school name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      School ID *
                    </label>
                    <input
                      type="text"
                      name="schoolId"
                      value={formData.schoolId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                      placeholder="Enter unique school ID"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                      placeholder="Create password"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
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
                className="space-y-5 sm:space-y-6"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Contact Information</h2>
                  <p className="text-gray-300 text-xs sm:text-sm">Provide your school's contact and address details</p>
                </div>

                {/* Adjusted grid for mobile */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="contactInfo.phone"
                      value={formData.contactInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      Website
                    </label>
                    <input
                      type="url"
                      name="contactInfo.website"
                      value={formData.contactInfo.website}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                      placeholder="https://yourschool.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      Address *
                    </label>
                    <input
                      type="text"
                      name="contactInfo.address"
                      value={formData.contactInfo.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                      placeholder="Enter full address"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="contactInfo.city"
                        value={formData.contactInfo.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="contactInfo.state"
                        value={formData.contactInfo.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="contactInfo.pincode"
                      value={formData.contactInfo.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
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
                className="space-y-5 sm:space-y-6"
              >
                <div className="grid grid-cols-1 gap-5 sm:gap-6">
                  <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Academic Setup</h2>
                  <p className="text-gray-300 text-xs sm:text-sm">Configure your school's academic structure</p>
                </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      Classes Offered *
                    </label>
                    {/* Adjusted grid for mobile */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {classOptions.map((classOption) => (
                        <label key={classOption.value} className="flex items-center text-white text-xs sm:text-sm">
                          <input
                            type="checkbox"
                            checked={formData.academicInfo.classes.includes(classOption.value)}
                            onChange={() => handleClassChange(classOption.value)}
                            className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          {classOption.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                      Streams Offered
                    </label>
                    {/* Adjusted grid for mobile */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {streamOptions.map((streamOption) => (
                        <label key={streamOption.value} className="flex items-center text-white text-xs sm:text-sm">
                          <input
                            type="checkbox"
                            checked={formData.academicInfo.streams.includes(streamOption.value)}
                            onChange={() => handleStreamChange(streamOption.value)}
                            className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          {streamOption.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Adjusted grid for mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                        <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                        Educational Board *
                      </label>
                      <select
                        name="academicInfo.board"
                        value={formData.academicInfo.board}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                      >
                        <option value="">Select Board</option>
                        {boardOptions.map((option) => (
                          <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                        Year of Establishment
                      </label>
                      <input
                        type="number"
                        name="academicInfo.establishedYear"
                        value={formData.academicInfo.establishedYear}
                        onChange={handleInputChange}
                        min="1800"
                        max={new Date().getFullYear()}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                        placeholder="Enter establishment year"
                      />
                    </div>
                  </div>

                  {/* Adjusted grid for mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                        Total Students
                      </label>
                      <input
                        type="number"
                        name="academicInfo.totalStudents"
                        value={formData.academicInfo.totalStudents}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                        placeholder="Enter total students"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">
                        Total Teachers
                      </label>
                      <input
                        type="number"
                        name="academicInfo.totalTeachers"
                        value={formData.academicInfo.totalTeachers}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm"
                        placeholder="Enter total teachers"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons - Adjusted for mobile */}
            <div className="flex justify-between mt-6 sm:mt-8">
              <button
                type="button"
                onClick={() => setStep(step > 1 ? step - 1 : 1)}
                disabled={step === 1}
                className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm ${step === 1
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Previous
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all text-xs sm:text-sm"
                >
                  Next
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-xs sm:text-sm"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full mr-1.5 sm:mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-xs sm:text-sm">Registering...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs sm:text-sm">Register School</span>
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Login Link - Adjusted for mobile */}
        <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
          <p className="text-gray-300 text-xs sm:text-sm">
            Already have a School account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors relative group text-xs sm:text-sm"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
