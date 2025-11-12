import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Target, Star, Award, MapPin, Clock, DollarSign } from "lucide-react";
import MainNavbar from "../components/MainNavbar";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Careers = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [positionsError, setPositionsError] = useState("");

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

  const fetchPositions = async () => {
    try {
      const res = await api.get("/api/careers/openings");
      setPositions(res.data?.data || []);
      setPositionsError("");
    } catch (error) {
      console.error("Error fetching job openings:", error);
      setPositionsError("Unable to load openings right now. Please try again later.");
    } finally {
      setLoadingPositions(false);
    }
  };

  useEffect(() => {
    fetchPositions();

    let eventSource;
    const baseURL = api.defaults.baseURL?.replace(/\/$/, "");

    if (baseURL && typeof EventSource !== "undefined") {
      try {
        eventSource = new EventSource(`${baseURL}/api/careers/openings/stream`, {
          withCredentials: true
        });

        eventSource.onmessage = (event) => {
          if (!event.data) return;
          try {
            const data = JSON.parse(event.data);
            setPositions(Array.isArray(data) ? data : []);
            setPositionsError("");
            setLoadingPositions(false);
          } catch (err) {
            console.error("Error parsing job openings stream payload:", err);
          }
        };

        eventSource.onerror = (event) => {
          console.error("Job openings stream error:", event);
          setPositionsError((prev) =>
            prev || "Live updates temporarily unavailable. Showing the latest data."
          );
        };
      } catch (error) {
        console.error("Error connecting to job openings stream:", error);
      }
    }

    return () => {
      eventSource?.close();
    };
  }, []);

  const sortedPositions = useMemo(() => {
    return [...positions].sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return a.status === "open" ? -1 : 1;
    });
  }, [positions]);

  const displayWorkMode = (mode) => (mode === "Remote" ? "Work From Home" : mode || "Work From Home");

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

          {loadingPositions ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-semibold">Loading open positions...</p>
            </div>
          ) : positionsError ? (
            <div className="py-16 text-center text-red-500 font-semibold">
              {positionsError}
            </div>
          ) : sortedPositions.length === 0 ? (
            <div className="py-16 text-center text-gray-600">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Target className="w-8 h-8" />
              </div>
              <p className="text-xl font-semibold">We’re not hiring at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">
                Check back soon or follow us on social to hear about new opportunities first.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedPositions.map((position, index) => {
                const isOpen = position.status !== "closed";
                const buttonLabel = isOpen ? "Apply Now" : "Applications Closed";
                const hasExternalLink = Boolean(position.applyUrl);
                const buttonDisabled = !isOpen;

                return (
                  <motion.div
                    key={position.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{position.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {position.department}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                            {position.location}
                          </span>
                          {position.workMode && (
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                          {displayWorkMode(position.workMode)}
                            </span>
                          )}
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            {position.employmentType || "Full-time"}
                          </span>
                        </div>
                      </div>
                      <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                          buttonDisabled
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                        }`}
                        disabled={buttonDisabled}
                        onClick={() => {
                          if (!isOpen) return;
                          if (hasExternalLink) {
                            window.open(position.applyUrl, "_blank", "noopener,noreferrer");
                          } else {
                            navigate(`/careers/apply/${position.id}`);
                          }
                        }}
                      >
                        {buttonLabel}
                      </button>
                    </div>

                    <p className="text-gray-600 mb-4">{position.description}</p>

                    {position.status === "closed" && position.statusMessage && (
                      <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                        {position.statusMessage}
                      </div>
                    )}

                    {(position.responsibilities || []).length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-2">Responsibilities:</h4>
                        <ul className="space-y-1">
                          {position.responsibilities.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(position.requirements || []).length > 0 && (
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
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
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