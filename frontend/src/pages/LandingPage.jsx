import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  School,
  GraduationCap,
  Users,
  Building,
  ArrowRight,
  CheckCircle,
  Star,
  Heart,
  Brain,
  Target,
  ArrowUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import kidsImage from "../assets/kids.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const userTypesRef = useRef(null);
  const featuresRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const services = [
    {
      title: "Curated Solutions",
      description: "Tools, services, and resources that support real student needs"
    },
    {
      title: "Meaningful Reach",
      description: "Connect with families, schools, and learners ina purposeful way."
    },
    {
      title: "Trusted Network",
      description: "Part of a community built around education and growth."
    },
    {
      title: "Aligned with Values",
      description: "Contribute to student development, not just transactions."
    }
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Financial Literacy",
      description: "Smart with money from day one.",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Mental Health",
      description: "Balanced, resilient, and emotionally strong.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Life Skills & Values (UVLS)",
      description: "Empathy, respect, and problem-solving.",
      color: "from-orange-500 to-rose-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Digital Citizenship",
      description: "Safe, ethical, and confident in the online world.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Moral Values",
      description: "Honesty, kindness, and integrity in action.",
      color: "from-amber-500 to-yellow-500"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "AI for All",
      description: "Early exposure to tomorrow’s technologies.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Health – Boys",
      description: "Hygiene, fitness, and self-awareness.",
      color: "from-sky-500 to-teal-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health – Girls",
      description: "Menstrual health, nutrition, and self-care.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Entrepreneurship & Careers",
      description: "Clarity, creativity, and innovation.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: <School className="w-8 h-8" />,
      title: "Civic Responsibility",
      description: "Rights, duties, and global citizenship.",
      color: "from-blue-500 to-indigo-500"
    }
  ];

  const userTypes = [
    {
      title: "Educational Institutions",
      description: "Schools and colleges looking for comprehensive management solutions",
      icon: <Building className="w-12 h-12" />,
      color: "from-blue-500 to-cyan-500",
      action: () => navigate("/institution-type"),
      buttonText: "Start Your Institution"
    },
    {
      title: "Individual Students",
      description: "Students & Parents wanting to access mental wellness and learning tools",
      icon: <GraduationCap className="w-12 h-12" />,
      color: "from-purple-500 to-pink-500",
      action: () => navigate("/register"),
      buttonText: "Join as Student"
    },
    {
      title: "Mentors & Guides",
      description: "Choose Parent, Teacher, or Seller to create your account",
      icon: <GraduationCap className="w-12 h-12" />,
      color: "from-purple-500 to-pink-500",
      action: () => navigate("/choose-account-type"),
      buttonText: "Choose Account Type"
    },
    // {
    //   title: "Stakeholders",
    //   description: "Sellers & CSRs supporting schools with resources and guidance",
    //   icon: <Users className="w-12 h-16" />,
    //   color: "from-green-500 to-emerald-500",
    //   action: () => navigate("/register-stakeholder"),
    //   buttonText: "Register as Stakeholder"
    // }
  ];

  const handleGetStartedClick = () => {
    userTypesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePillarsClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300); // Show button after scrolling 300px
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
          <span className="text-white font-bold">WS</span>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">Wise Student</h1>
          </div>
          <div className="space-x-4 flex items-center">
        <button onClick={handlePillarsClick} className="text-gray-600 hover:text-gray-900">Pillars</button>

            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
  <div className="relative h-screen flex items-center justify-center">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-4"
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Wise Student
              </span>
              
          <p className="font-bold text-sm mt-2">Beyond Subjects. Building Humans. </p>
              <p className="italic font-light text-sm mb-2">Holistic & Futuristic Education for Every Student </p>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
          className="text-xl md:text-xl text-gray-600 mb-6 max-w-4xl mx-auto"
            >
              Knowledge alone is no longer enough — today’s learners need balance, resilience, and future-ready skills. 
Our Platform raises students who are not just exam-ready, but life-ready. 
            </motion.p>
            <p className="text-sm font-bold mb-2">The Firm foundation no textbook can teach — but every Student needs.</p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            onClick={handleGetStartedClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center items-center mt-8 w-full max-w-3xl mx-auto rounded-full"
            >
              <motion.img
                src={kidsImage}
                alt="Kids avatars"
                className="w-full max-w-3xl mx-auto rounded-full"
  
              />

              {/* <motion.img
              src="/kid.png"
              alt="Kid"
              className="w-64 h-auto mx-auto"
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            /> */}

            </motion.div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Features Section */}
      <div id="features" ref={featuresRef} className="py-10 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Everything You Need in One Platform
            </h2>
        <p className="text-lg text-gray-600 max-w-7xl mx-auto py-4">
              WiseStudent sets a new standard in education: blending holistic growth with futuristic learning experiences, nurturing confidence, 
values, wellness, and innovation in every Student. 
Because the leaders of tomorrow deserve more than lessons — they deserve a complete foundation for life. 
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, type: "spring", stiffness: 260, damping: 18 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="group rounded-2xl relative overflow-hidden"
              >
                {/* Soft gradient background appears on hover (no border) */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-25 transition-opacity duration-300 rounded-2xl`} />
                <div className="relative bg-white rounded-2xl p-6 shadow-md group-hover:shadow-xl transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md group-hover:shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div id="get-started" ref={userTypesRef} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different entry points for different needs. Get started with the option that fits you best.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {userTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all text-center"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}>
                  {type.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {type.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={type.action}
                  className={`w-full bg-gradient-to-r ${type.color} text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2`}
                >
                  {type.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <h2 className="text-4xl font-bold text-white mb-10 text-center">
              Student Services & Resource Partners
            </h2>

            {/* Horizontal Auto-sliding Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-12">
              <motion.div
                animate={{
                  x: [0, -100, -200, -300, -400, -500, -600, -700, -800, 0]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="flex gap-8 whitespace-nowrap"
                style={{ width: 'max-content' }}
              >
                {/* First set of items */}
                {services.map((service, index) => (
                  <div key={`first-${index}`} className="flex items-start gap-3 min-w-80 flex-shrink-0">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="whitespace-normal">
                      <h3 className="text-xl font-semibold text-white mb-1">{service.title}</h3>
                      <p className="text-blue-100 text-sm">{service.description}</p>
                    </div>
                  </div>
                ))}

                {/* Duplicate set for seamless loop */}
                {services.map((service, index) => (
                  <div key={`second-${index}`} className="flex items-start gap-3 min-w-80 flex-shrink-0">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="whitespace-normal">
                      <h3 className="text-xl font-semibold text-white mb-1">{service.title}</h3>
                      <p className="text-blue-100 text-sm">{service.description}</p>
                    </div>
                  </div>
                ))}

                {/* Third set for extra smooth transition */}
                {services.map((service, index) => (
                  <div key={`third-${index}`} className="flex items-start gap-3 min-w-80 flex-shrink-0">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="whitespace-normal">
                      <h3 className="text-xl font-semibold text-white mb-1">{service.title}</h3>
                      <p className="text-blue-100 text-sm">{service.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Gradient overlays for smooth fade effect */}
              <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800 py-12">
        <div className="max-w-8xl mx-auto px-5 sm:px-5 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div className="text-left">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center mb-3">
                <span className="text-white font-bold text-2xl">FM</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Wise Student</h3>
              <p className="text-gray-600 text-base">
                Empowering education with innovative management and wellness solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-600 hover:text-gray-900 transition">About Us</a></li>
                <li><a href="/services" className="text-gray-600 hover:text-gray-900 transition">Services</a></li>
                <li><a href="/blog" className="text-gray-600 hover:text-gray-900 transition">Blog</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-gray-900 transition">Contact</a></li>
              </ul>
            </div>

            {/* Social Media & Contact */}
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-3">Connect With Us</h3>
              <div className="flex space-x-4 mb-2">
                <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900 transition"><Facebook size={20} /></a>
                <a href="https://twitter.com" className="text-gray-600 hover:text-gray-900 transition"><Twitter size={20} /></a>
                <a href="https://instagram.com" className="text-gray-600 hover:text-gray-900 transition"><Instagram size={20} /></a>
                <a href="https://linkedin.com" className="text-gray-600 hover:text-gray-900 transition"><Linkedin size={20} /></a>
              </div>
              <p className="text-gray-600 text-base">Email: support@finmen.com</p>
              <p className="text-gray-600 text-base">Phone: +91-859-565-4823</p>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-4 text-center text-gray-600 text-sm">
            <p>&copy; 2025 Wise Student. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="/terms" className="hover:underline">Terms of Service</a>
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {isVisible && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default LandingPage;