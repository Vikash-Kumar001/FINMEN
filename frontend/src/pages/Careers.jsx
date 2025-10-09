import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Target, Star, Award, MapPin, Clock, DollarSign } from "lucide-react";
import MainNavbar from "../components/MainNavbar";
import { useNavigate } from "react-router-dom";

const Careers = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handlePillarsClick = () => {
    navigate("/");
  };

  const handleWhyChooseClick = () => {
    navigate("/");
  };

  const handlePricingClick = () => {
    navigate("/");
  };

  const handleStudentServicesClick = () => {
    navigate("/");
  };

  const handleFooterClick = () => {
    navigate("/");
  };

  const positions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build and maintain our cutting-edge educational platform using React, TypeScript, and modern web technologies.",
      requirements: [
        "5+ years of experience with React and modern JavaScript",
        "Strong understanding of state management (Redux, Context API)",
        "Experience with testing frameworks (Jest, Cypress)",
        "Passion for education technology"
      ]
    },
    {
      id: 2,
      title: "Educational Content Specialist",
      department: "Content",
      location: "Delhi, India",
      type: "Full-time",
      description: "Create engaging, curriculum-aligned educational content for students across different age groups.",
      requirements: [
        "Bachelor's degree in Education or related field",
        "3+ years of experience in curriculum development",
        "Strong understanding of child psychology and learning theories",
        "Excellent writing and communication skills"
      ]
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive and engaging user experiences for students, parents, and educators.",
      requirements: [
        "Portfolio demonstrating strong UI/UX design skills",
        "Proficiency in Figma, Sketch, or Adobe XD",
        "Understanding of accessibility standards",
        "Experience designing for educational platforms"
      ]
    },
    {
      id: 4,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Mumbai, India",
      type: "Full-time",
      description: "Support our school partners and ensure successful implementation of our platform.",
      requirements: [
        "2+ years in customer success or account management",
        "Experience with educational institutions",
        "Excellent communication and problem-solving skills",
        "Ability to manage multiple accounts simultaneously"
      ]
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Competitive Salary",
      description: "We offer market-leading compensation packages"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Hours",
      description: "Work-life balance with flexible scheduling options"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Growth Opportunities",
      description: "Continuous learning and career advancement paths"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Mission-Driven",
      description: "Work on something that truly makes a difference"
    }
  ];

  // Use motion directly to satisfy linter
  const MotionDiv = motion.div;

  return (
    <MotionDiv 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      {/* Navbar */}
      <MainNavbar 
        handlePillarsClick={handlePillarsClick}
        handleWhyChooseClick={handleWhyChooseClick}
        handlePricingClick={handlePricingClick}
        handleStudentServicesClick={handleStudentServicesClick}
        handleFooterClick={handleFooterClick}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
      
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Join Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Help us shape the future of education and empower the next generation
          </motion.p>
        </div>
      </div>

      {/* Why Join Section */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At WiseStudent, we believe in creating an environment where passionate individuals can make a real impact
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our growing team and help shape the future of education
            </p>
          </motion.div>

          <div className="space-y-6">
            {positions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {position.department}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                        {position.location}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                    Apply Now
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">{position.description}</p>
                
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Culture</h2>
            <p className="text-lg text-gray-600 mb-4">
              At WiseStudent, we foster a culture of innovation, collaboration, and continuous learning. 
              We believe that to empower students, we must first empower our team members.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Our team is made up of passionate educators, technologists, designers, and innovators who 
              share a common mission: to transform education and prepare students for life, not just exams.
            </p>
            <p className="text-lg text-gray-600">
              We offer a supportive environment where everyone's voice is heard, ideas are valued, and 
              professional growth is encouraged.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Collaboration</h3>
              <p className="text-blue-100">We work together to achieve our mission</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-purple-100">We constantly evolve and improve</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-2">Growth</h3>
              <p className="text-green-100">We invest in our team's development</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Impact</h3>
              <p className="text-amber-100">We make a real difference in education</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our team and help shape the future of education
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all text-lg">
              View All Openings
            </button>
          </motion.div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default Careers;