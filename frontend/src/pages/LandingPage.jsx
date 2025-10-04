import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import kidsImage from "../assets/kids.png";

const AutoSlidingCards = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const intervalRef = React.useRef(null);

  const cards = [
    {
      title: "For Students",
      content: [
        "Learn Through Play – 2,000+ games that make growth exciting.",
        "Skills for Life – From money management to mental wellness.",
        "Future-First – Early exposure to AI, tech, and innovation.",
        "Confidence & Balance – Build strong values, health, and clarity.",
        "Heal Coins & Rewards – Celebrate progress and achievements.",
      ],
      color: "from-blue-500 to-cyan-500",
      icon: "🎓",
    },
    {
      title: "For Parents",
      content: [
        "Progress You Can See – Beyond marks, track growth in skills & values.",
        "Peace of Mind – Tools for resilience, safety, and well-being.",
        "Beyond Textbooks – Education that shapes character and confidence.",
        "Partnership – Parents play an active role in their child's journey.",
      ],
      color: "from-purple-500 to-pink-500",
      icon: "👨‍👩‍👧",
    },
    {
      title: "For Teachers",
      content: [
        "Supportive Tools – Life skills content that complements teaching.",
        "Stronger Classrooms – Students with better focus and resilience.",
        "Aligned Resources – Matches NEP 2020 & national goals.",
        "Less Stress – A partner in guiding student well-being.",
        "Recognition & Rewards – Heal Coins for guiding engaged learners.",
      ],
      color: "from-green-500 to-emerald-500",
      icon: "👩‍🏫",
    },
    {
      title: "For Schools & Academic Institutions",
      content: [
        "Holistic Edge – Differentiate with life skills beyond academics.",
        "Future-Ready Reputation – Position as pioneers of new education.",
        "Community Trust – Parents see added value in your institution.",
        "Unified Platform – Growth + engagement + management together.",
        "School Rewards – Achieve milestones as a National Leaders.",
      ],
      color: "from-amber-500 to-orange-500",
      icon: "🏫",
    },
  ];

  React.useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, cards.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const getCardPosition = (index) => {
    const diff = (index - currentIndex + cards.length) % cards.length;

    if (diff === 0) return "center";
    if (diff === 1 || diff === -3) return "right";
    if (diff === cards.length - 1 || diff === -1) return "left";
    return "hidden";
  };

  return (
    <div
      className="relative w-full py-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[500px] max-w-7xl mx-auto">
        {cards.map((card, index) => {
          const position = getCardPosition(index);

          return (
            <div
              key={index}
              className={`absolute top-1/2 left-1/2 transition-all duration-700 ease-out ${position === "center"
                  ? "translate-x-[-50%] translate-y-[-50%] scale-100 z-30 opacity-100"
                  : position === "right"
                    ? "translate-x-[20%] translate-y-[-50%] scale-75 z-10 opacity-60"
                    : position === "left"
                      ? "translate-x-[-120%] translate-y-[-50%] scale-75 z-10 opacity-60"
                      : "translate-x-[-50%] translate-y-[-50%] scale-50 z-0 opacity-0"
                }`}
              style={{
                width: "450px",
                maxWidth: "90vw",
              }}
            >
              <div
                className={`bg-gradient-to-br ${card.color
                  } rounded-3xl p-8 text-white shadow-2xl h-[480px] flex flex-col relative overflow-hidden transition-transform duration-300 ${position === "center" ? "hover:scale-105" : ""
                  }`}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="text-5xl mb-4">{card.icon}</div>
                  <h3 className="text-3xl font-bold mb-6">{card.title}</h3>
                  <div className="space-y-3 flex-1">
                    {card.content.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-white/90 text-sm leading-relaxed">
                          • {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-8 space-x-3">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${index === currentIndex
                ? "w-10 h-3 bg-gradient-to-r from-blue-600 to-purple-600"
                : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const userTypesRef = useRef(null);
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const whyChooseRef = useRef(null);
  const studentServicesRef = useRef(null);
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const services = [
    {
      title: "Curated Solutions",
      description:
        "Tools, services, and resources that support real student needs",
    },
    {
      title: "Meaningful Reach",
      description:
        "Connect with families, schools, and learners ina purposeful way.",
    },
    {
      title: "Trusted Network",
      description: "Part of a community built around education and growth.",
    },
    {
      title: "Aligned with Values",
      description: "Contribute to student development, not just transactions.",
    },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "#contact" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ];

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com", icon: Facebook, color: "hover:bg-blue-600" },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter, color: "hover:bg-sky-500" },
    { name: "Instagram", href: "https://instagram.com", icon: Instagram, color: "hover:bg-pink-600" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin, color: "hover:bg-blue-700" },
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Financial Literacy",
      description: "Smart with money from day one.",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Mental Health",
      description: "Balanced, resilient, and emotionally strong.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Life Skills & Values (UVLS)",
      description: "Empathy, respect, and problem-solving.",
      color: "from-orange-500 to-rose-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Digital Citizenship",
      description: "Safe, ethical, and confident in the online world.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Moral Values",
      description: "Honesty, kindness, and integrity in action.",
      color: "from-amber-500 to-yellow-500",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "AI for All",
      description: "Early exposure to tomorrow's technologies.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Health – Boys",
      description: "Hygiene, fitness, and self-awareness.",
      color: "from-sky-500 to-teal-500",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health – Girls",
      description: "Menstrual health, nutrition, and self-care.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Entrepreneurship & Careers",
      description: "Clarity, creativity, and innovation.",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: <School className="w-8 h-8" />,
      title: "Civic Responsibility",
      description: "Rights, duties, and global citizenship.",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  const userTypes = [
    {
      title: "Educational Institutions",
      description:
        "Schools and colleges looking for comprehensive management solutions",
      icon: <Building className="w-12 h-12" />,
      color: "from-blue-500 to-cyan-500",
      action: () => navigate("/institution-type"),
      buttonText: "Start Your Institution",
    },
    {
      title: "Individual Students",
      description:
        "Students wanting to access mental wellness and learning tools",
      icon: <GraduationCap className="w-12 h-12" />,
      color: "from-purple-500 to-pink-500",
      action: () => navigate("/register"),
      buttonText: "Join as Student",
    },
    {
      title: "Mentors & Guides",
      description: "Parents, Teachers, and Mentors supporting student growth",
      icon: <Users className="w-12 h-12" />,
      color: "from-green-500 to-emerald-500",
      action: () => navigate("/choose-account-type"),
      buttonText: "Choose Account Type",
    },
  ];

  const handleGetStartedClick = () => {
    userTypesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePillarsClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add this function for pricing scroll
  const handlePricingClick = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWhyChooseClick = () => {
    whyChooseRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStudentServicesClick = () => {
    studentServicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFooterClick = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = () => {
    if (email) {
      console.log("Subscribing email:", email);
      setEmail('');
    }
  };

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileMenu]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">WS</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Wise Student
              </h1>
            </div>

            {/* Desktop Navigation - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handlePillarsClick}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pillars
              </button>

              <button
                onClick={handleWhyChooseClick}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Why Choose Us
              </button>

              <button
                onClick={handlePricingClick}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </button>

              <button
                onClick={handleStudentServicesClick}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Services
              </button>

              <button
                onClick={handleFooterClick}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </button>

              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium"
              >
                Sign In
              </button>
            </div>

            {/* Mobile menu button - visible only on mobile */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu Overlay - visible only on mobile */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                className="md:hidden fixed inset-0 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Dark overlay background */}
                <motion.div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                  onClick={() => setShowMobileMenu(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Mobile menu panel */}
                <motion.div
                  className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    mass: 0.8
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Menu header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-sm">WS</span>
                        </div>
                        <h2 className="ml-2 text-lg font-semibold text-gray-900">Wise Student</h2>
                      </div>
                      <button
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Menu items */}
                    <div className="flex flex-col p-4 space-y-4 flex-grow">
                      <motion.button
                        onClick={() => {
                          handlePillarsClick();
                          setShowMobileMenu(false);
                        }}
                        className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                        whileTap={{ scale: 0.98 }}
                      >
                        Pillars
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          handleWhyChooseClick();
                          setShowMobileMenu(false);
                        }}
                        className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                        whileTap={{ scale: 0.98 }}
                      >
                        Why Choose Us
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          handlePricingClick();
                          setShowMobileMenu(false);
                        }}
                        className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                        whileTap={{ scale: 0.98 }}
                      >
                        Pricing
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          handleStudentServicesClick();
                          setShowMobileMenu(false);
                        }}
                        className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                        whileTap={{ scale: 0.98 }}
                      >
                        Services
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          handleFooterClick();
                          setShowMobileMenu(false);
                        }}
                        className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                        whileTap={{ scale: 0.98 }}
                      >
                        Contact
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          navigate("/login");
                          setShowMobileMenu(false);
                        }}
                        className="text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all font-medium mt-auto"
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign In
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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
              <p className="font-bold text-sm mt-2">
                Beyond Subjects. Building Humans.{" "}
              </p>
              <p className="italic font-light text-sm mb-2">
                Holistic & Futuristic Education for Every Student{" "}
              </p>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-xl text-gray-600 mb-6 max-w-4xl mx-auto"
            >
              Knowledge alone is no longer enough — today's learners need
              balance, resilience, and future-ready skills. Our Platform raises
              students who are not just exam-ready, but life-ready.
            </motion.p>
            <p className="text-sm font-bold mb-2">
              The Firm foundation no textbook can teach — but every Student
              needs.
            </p>
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all relative z-10"
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
            </motion.div>
          </motion.div>
        </div>

        {/* Background Elements - Moved behind content with negative z-index */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse z-2" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000 z-2" />
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
              WiseStudent sets a new standard in education: blending holistic
              growth with futuristic learning experiences, nurturing confidence,
              values, wellness, and innovation in every Student. Because the
              leaders of tomorrow deserve more than lessons — they deserve a
              complete foundation for life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.06,
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="group rounded-2xl relative overflow-hidden"
              >
                <div className="group relative rounded-2xl p-6 transition-all overflow-hidden bg-white border border-gray-100">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md group-hover:shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose WiseStudent Section */}
      <div ref={whyChooseRef} className="py-10 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Why Choose WiseStudent?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Because education is more than grades — it's about raising
              life-ready humans.
            </p>
          </motion.div>

          <AutoSlidingCards />
        </div>
      </div>

      {/* Enhanced User Types Section */}
      <div id="get-started" ref={userTypesRef} className="py-16 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Different entry points for different needs. Get started with the
              option that fits you best.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <div key={index} className="group relative">
                <div className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${type.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>

                  <div className="relative z-10 flex flex-col">
                    <div className={`w-24 h-24 bg-gradient-to-br ${type.color} rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                      {type.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      {type.title}
                    </h3>

                    <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm">
                      {type.description}
                    </p>

                    <button
                      onClick={type.action}
                      className={`w-full bg-gradient-to-r ${type.color} text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/btn mt-auto`}
                    >
                      <span className="relative z-10">{type.buttonText}</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </div>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      {/* Add ref to the pricing section div */}
      <div ref={pricingRef} className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Final Pricing & Inclusions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that best fits your needs with comprehensive features for holistic education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan 1 – Student Plan</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-blue-600">₹1,999</span>
                      <span className="text-gray-500">/year</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₹2,500</span>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">
                        Save ₹501
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Full access to all 10 WiseStudent pillars</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Gamified learning, challenges & WiseClub</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Certificates & NEP-linked skills</span>
                  </div>
                </div>

                <button className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Get Student Plan
                </button>
              </div>
            </motion.div>

            {/* Family & School Well-being Pack */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan 2 – Family & School Well-being Pack</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-purple-600">₹2,499</span>
                      <span className="text-gray-500">/year</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₹3,000</span>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">
                        Save ₹501
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">+</span>
                      Everything in Student Plan PLUS:
                    </h4>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4">
                    <h5 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      For Parents:
                    </h5>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-700 text-sm">Mental Health (stress care, emotional well-being, family harmony)</span>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <h5 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      For Teachers:
                    </h5>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-green-700 text-sm">Mental Health & Stress Care (school-wide, included automatically)</span>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-4">
                    <h5 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      For Schools:
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-purple-700 text-sm">Teacher dashboards & student reports</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-purple-700 text-sm">NEP-aligned compliance tools</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-purple-700 text-sm">Collective gamification (school-level challenges, recognition)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Get Family & School Pack
                </button>
              </div>
            </motion.div>
          </div>

          {/* Add-ons Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add-ons (Separate, Not in Bundle)</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Extra Pillars for Adults</h4>
                  <p className="text-gray-600">Finance, Digital Safety, etc.</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="flex items-baseline gap-2 justify-center md:justify-end">
                  <span className="text-2xl font-bold text-amber-600">₹199</span>
                  <span className="text-gray-500">each</span>
                  <span className="text-sm text-gray-500 line-through">₹250</span>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Save ₹51 per pillar
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Student Services Section */}
      <div ref={studentServicesRef} className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
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

            <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-12">
              <motion.div
                animate={{
                  x: [0, -100, -200, -300, -400, -500, -600, -700, -800, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex gap-8 whitespace-nowrap"
                style={{ width: "max-content" }}
              >
                {services.map((service, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex items-start gap-3 min-w-80 flex-shrink-0"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="whitespace-normal">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {service.title}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}

                {services.map((service, index) => (
                  <div
                    key={`second-${index}`}
                    className="flex items-start gap-3 min-w-80 flex-shrink-0"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="whitespace-normal">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {service.title}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}

                {services.map((service, index) => (
                  <div
                    key={`third-${index}`}
                    className="flex items-start gap-3 min-w-80 flex-shrink-0"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="whitespace-normal">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {service.title}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer ref={footerRef} className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-100/40 to-pink-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:mt-20 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-2xl">WS</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Wise Student
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Empowering education with innovative management and wellness
                  solutions for the next generation.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">
                  Stay Updated
                </p>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm outline-none"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-300"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Contact Us
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:support@wisestudent.com"
                  className="flex items-start gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300 flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium">
                      support@wisestudent.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+918595654823"
                  className="flex items-start gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-all duration-300 flex-shrink-0">
                    <Phone className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm font-medium">+91-859-565-4823</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-gray-600 group">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm font-medium">Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Follow Us
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Join our community and stay connected with the latest updates
                and educational insights.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    onMouseEnter={() => setHoveredSocial(index)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className={`w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 hover:border-transparent hover:shadow-lg hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">Trusted by</p>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-xs font-semibold text-blue-600 border border-blue-100">
                    500+ Schools
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-xs font-semibold text-purple-600 border border-purple-100">
                    50K+ Students
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                © 2025 Wise Student. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                >
                  Terms of Service
                </a>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <a
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                >
                  Privacy Policy
                </a>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <a
                  href="/cookies"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
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