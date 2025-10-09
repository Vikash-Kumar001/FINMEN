import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, Tag, ArrowRight, Search, BookOpen } from "lucide-react";
import MainNavbar from "../components/MainNavbar";
import { useNavigate } from "react-router-dom";

const Blog = () => {
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

  const blogPosts = [
    {
      id: 1,
      title: "The Importance of Financial Literacy for Students",
      excerpt: "Why teaching kids about money management early can set them up for lifelong success.",
      author: "Dr. Sarah Johnson",
      date: "May 15, 2025",
      category: "Financial Literacy",
      image: "💰",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Building Emotional Resilience in Teens",
      excerpt: "Practical strategies for helping adolescents navigate stress and build mental strength.",
      author: "Michael Chen",
      date: "April 28, 2025",
      category: "Mental Health",
      image: "🧠",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Digital Citizenship in the Modern Classroom",
      excerpt: "How to teach students to be responsible, ethical, and safe in the digital world.",
      author: "Priya Sharma",
      date: "April 12, 2025",
      category: "Digital Citizenship",
      image: "💻",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Life Skills Every Student Should Master",
      excerpt: "Essential abilities that go beyond textbooks to prepare students for real-world challenges.",
      author: "David Wilson",
      date: "March 30, 2025",
      category: "Life Skills",
      image: "🛠️",
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "The Role of Values in Education",
      excerpt: "Why character development is just as important as academic achievement.",
      author: "Dr. Maria Rodriguez",
      date: "March 18, 2025",
      category: "Values",
      image: "❤️",
      readTime: "5 min read"
    },
    {
      id: 6,
      title: "Preparing Students for Future Careers",
      excerpt: "How to help students develop both technical skills and entrepreneurial thinking.",
      author: "James Kumar",
      date: "March 5, 2025",
      category: "Careers",
      image: "🚀",
      readTime: "6 min read"
    }
  ];

  const categories = [
    "All", "Financial Literacy", "Mental Health", "Life Skills", 
    "Digital Citizenship", "Values", "Careers"
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
            WiseStudent Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Insights, tips, and resources for holistic student development
          </motion.p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search articles..."
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === "All"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                
                <div className="text-5xl mb-4">{post.image}</div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </div>
                  
                  <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
            Load More Articles
          </button>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss our latest articles and resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default Blog;