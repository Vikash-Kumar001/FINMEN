import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Target, Star, BookOpen, Award } from "lucide-react";
import MainNavbar from "../components/MainNavbar";
import NationalAlignments from "../components/NationalAlignments";
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const values = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Compassion",
            description: "We believe in nurturing the whole child with empathy and care."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community",
            description: "Education thrives when students, parents, and educators work together."
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Holistic Growth",
            description: "We focus on developing well-rounded individuals, not just academic achievers."
        },
        {
            icon: <Star className="w-8 h-8" />,
            title: "Excellence",
            description: "We strive for the highest standards in everything we do."
        }
    ];

    const team = [
        {
            name: "Our Mission",
            role: "To empower every student with the skills, values, and confidence they need to thrive in life.",
            image: "🎯"
        },
        {
            name: "Our Vision",
            role: "A world where education goes beyond textbooks to build compassionate, resilient, and future-ready leaders.",
            image: "🌟"
        }
    ];

    const handlePillarsClick = () => {
        // Scroll to features section or navigate to home page with anchor
        navigate("/");
    };

    const handleWhyChooseClick = () => {
        // Scroll to why choose section or navigate to home page with anchor
        navigate("/");
    };

    const handlePricingClick = () => {
        // Scroll to pricing section or navigate to home page with anchor
        navigate("/");
    };

    const handleStudentServicesClick = () => {
        // Scroll to services section or navigate to home page with anchor
        navigate("/");
    };

    const handleFooterClick = () => {
        // Scroll to footer section or navigate to home page with anchor
        navigate("/");
    };

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
                        About WiseStudent
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Empowering students with holistic education for life
                    </motion.p>
                </div>
            </div>

            {/* Story Section */}
            <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <p className="text-lg text-gray-600 mb-4">
                            WiseStudent was born from a simple yet powerful belief: education should prepare students not just for exams, but for life.
                            In a world rapidly changing with technology and global challenges, we recognized that traditional education systems were
                            missing crucial elements that shape well-rounded individuals.
                        </p>
                        <p className="text-lg text-gray-600 mb-4">
                            Founded by educators, parents, and child development experts, WiseStudent brings together the best of modern pedagogy
                            with timeless values. Our platform integrates financial literacy, mental wellness, life skills, and civic responsibility
                            into a cohesive learning experience that nurtures the whole child.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl p-8 text-white"
                    >
                        <div className="text-6xl mb-6">📚</div>
                        <h3 className="text-2xl font-bold mb-4">Education Beyond Textbooks</h3>
                        <p className="text-blue-100">
                            We believe that true education goes beyond academic subjects. Our holistic approach ensures students develop
                            the skills, values, and mindset needed to navigate life's challenges and opportunities.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            These principles guide everything we do at WiseStudent
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        What drives us forward every day
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-lg border border-gray-100"
                        >
                            <div className="text-6xl mb-6 text-center">{member.image}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{member.name}</h3>
                            <p className="text-gray-600 text-center">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* National Alignments (shared) */}
            <NationalAlignments />
        </MotionDiv>
    );
};

export default About;