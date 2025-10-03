import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
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
  Award,
  Target
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const CollegeRegistration = () => {
  const [formData, setFormData] = useState({
    collegeName: "",
    collegeId: "",
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
      departments: [],
      courses: [],
      university: "",
      establishedYear: "",
      totalStudents: "",
      totalFaculty: "",
      accreditation: "",
      type: ""
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const departmentOptions = [
    { value: "computer_science", label: "Computer Science" },
    { value: "information_technology", label: "Information Technology" },
    { value: "electronics", label: "Electronics & Communication" },
    { value: "mechanical", label: "Mechanical Engineering" },
    { value: "civil", label: "Civil Engineering" },
    { value: "electrical", label: "Electrical Engineering" },
    { value: "business", label: "Business Administration" },
    { value: "commerce", label: "Commerce" },
    { value: "arts", label: "Arts" },
    { value: "science", label: "Science" },
    { value: "pharmacy", label: "Pharmacy" },
    { value: "law", label: "Law" }
  ];

  const courseOptions = [
    { value: "btech", label: "B.Tech" },
    { value: "mtech", label: "M.Tech" },
    { value: "bca", label: "BCA" },
    { value: "mca", label: "MCA" },
    { value: "bba", label: "BBA" },
    { value: "mba", label: "MBA" },
    { value: "bcom", label: "B.Com" },
    { value: "mcom", label: "M.Com" },
    { value: "ba", label: "B.A" },
    { value: "ma", label: "M.A" },
    { value: "bsc", label: "B.Sc" },
    { value: "msc", label: "M.Sc" },
    { value: "phd", label: "Ph.D" }
  ];

  const universityOptions = [
    { value: "state", label: "State University" },
    { value: "central", label: "Central University" },
    { value: "deemed", label: "Deemed University" },
    { value: "private", label: "Private University" },
    { value: "autonomous", label: "Autonomous College" }
  ];

  const collegeTypeOptions = [
    { value: "engineering", label: "Engineering College" },
    { value: "management", label: "Management Institute" },
    { value: "arts_science", label: "Arts & Science College" },
    { value: "medical", label: "Medical College" },
    { value: "pharmacy", label: "Pharmacy College" },
    { value: "law", label: "Law College" },
    { value: "composite", label: "Composite College" }
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

  const handleDepartmentChange = (deptValue) => {
    setFormData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        departments: prev.academicInfo.departments.includes(deptValue)
          ? prev.academicInfo.departments.filter(d => d !== deptValue)
          : [...prev.academicInfo.departments, deptValue]
      }
    }));
  };

  const handleCourseChange = (courseValue) => {
    setFormData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        courses: prev.academicInfo.courses.includes(courseValue)
          ? prev.academicInfo.courses.filter(c => c !== courseValue)
          : [...prev.academicInfo.courses, courseValue]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.academicInfo.departments.length === 0) {
      toast.error("Please select at least one department");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/company/signup", {
        name: formData.collegeName,
        email: formData.email,
        password: formData.password,
        contactInfo: formData.contactInfo,
        type: "college",
        academicInfo: formData.academicInfo,
        collegeId: formData.collegeId
      });
      if (response.data.success) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      if (error.response?.data?.error === 'DUPLICATE_EMAIL') {
        toast.error("A college with this email already exists. Please use a different email.");
      } else if (error.response?.data?.error === 'DUPLICATE_INSTITUTION_ID') {
        toast.error("College ID already exists. Please use a different College ID.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", description: "College details and credentials" },
    { number: 2, title: "Contact Information", description: "Address and contact details" },
    { number: 3, title: "Academic Setup", description: "Departments, courses, and academic information" }
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
            <h2 className="text-2xl font-bold mb-2 text-gray-900">College Registered Successfully!</h2>
            <p className="text-gray-700 mb-6">Your college has been registered. You can now log in to your account and start using the platform.</p>
            <button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              onClick={() => navigate("/login")}
            >
              Login Now
            </button>
          </motion.div>
        </div>
      )}
      {/* Header aligned with account chooser styling */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">FM</span>
              </div>
              <h1 className="ml-3 text-2xl font-semibold text-gray-800">Wise Student</h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-transparent border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                  step >= stepItem.number
                    ? 'bg-purple-600 text-white'
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
                  <p className="text-gray-600">Enter your college's basic details and create your account</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <GraduationCap className="w-4 h-4 inline mr-2" />
                      College Name *
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter college name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Building className="w-4 h-4 inline mr-2" />
                      College ID *
                    </label>
                    <input
                      type="text"
                      name="collegeId"
                      value={formData.collegeId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter unique college ID"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  <p className="text-gray-600">Provide your college's contact and address details</p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  <p className="text-gray-600">Configure your college's academic structure and information</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Departments *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {departmentOptions.map((dept) => (
                        <label key={dept.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.academicInfo.departments.includes(dept.value)}
                            onChange={() => handleDepartmentChange(dept.value)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{dept.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Award className="w-4 h-4 inline mr-2" />
                      Courses Offered
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {courseOptions.map((course) => (
                        <label key={course.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.academicInfo.courses.includes(course.value)}
                            onChange={() => handleCourseChange(course.value)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{course.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        University Type *
                      </label>
                      <select
                        name="academicInfo.university"
                        value={formData.academicInfo.university}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select University Type</option>
                        {universityOptions.map((univ) => (
                          <option key={univ.value} value={univ.value}>
                            {univ.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        College Type *
                      </label>
                      <select
                        name="academicInfo.type"
                        value={formData.academicInfo.type}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select College Type</option>
                        {collegeTypeOptions.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter year"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Accreditation
                      </label>
                      <input
                        type="text"
                        name="academicInfo.accreditation"
                        value={formData.academicInfo.accreditation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., NAAC, NBA"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter number of students"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Total Faculty
                      </label>
                      <input
                        type="number"
                        name="academicInfo.totalFaculty"
                        value={formData.academicInfo.totalFaculty}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter number of faculty"
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
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? "Creating College..." : "Create College"}
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

export default CollegeRegistration;
