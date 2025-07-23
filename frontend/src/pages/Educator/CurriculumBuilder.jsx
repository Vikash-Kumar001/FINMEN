import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  Copy,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Award,
  BarChart,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  SortAsc,
  Layers,
  Folder,
  FolderPlus,
  Download,
  Upload,
  Share2,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  Tag,
  Paperclip,
  Target,
  List,
  Grid,
  Zap,
  Sparkles,
} from "lucide-react";

const CurriculumBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showLessonModal, setShowLessonModal] = useState(false);

  // Sample data
  const lessons = [
    {
      id: 1,
      title: "Introduction to Financial Literacy",
      description: "Foundational concepts of personal finance and money management",
      duration: "45 mins",
      level: "Beginner",
      category: "finance",
      progress: 85,
      status: "published",
      lastUpdated: "2023-10-15",
      objectives: [
        "Understand basic financial terminology",
        "Identify personal financial goals",
        "Create a simple budget",
      ],
      assessments: 3,
      resources: 5,
      tags: ["finance", "beginner", "budgeting"],
    },
    {
      id: 2,
      title: "Saving Strategies for Teens",
      description: "Practical approaches to saving money for teenagers",
      duration: "30 mins",
      level: "Beginner",
      category: "finance",
      progress: 100,
      status: "published",
      lastUpdated: "2023-10-18",
      objectives: [
        "Set up a savings account",
        "Create savings goals",
        "Track progress toward financial goals",
      ],
      assessments: 2,
      resources: 4,
      tags: ["saving", "teens", "goals"],
    },
    {
      id: 3,
      title: "Understanding Credit Cards",
      description: "How credit cards work and responsible usage practices",
      duration: "40 mins",
      level: "Intermediate",
      category: "finance",
      progress: 60,
      status: "draft",
      lastUpdated: "2023-10-20",
      objectives: [
        "Explain how credit cards work",
        "Calculate interest and fees",
        "Develop responsible credit habits",
      ],
      assessments: 4,
      resources: 6,
      tags: ["credit", "cards", "debt"],
    },
    {
      id: 4,
      title: "Investment Basics for Young Adults",
      description: "Introduction to investing concepts and strategies",
      duration: "50 mins",
      level: "Intermediate",
      category: "investment",
      progress: 30,
      status: "draft",
      lastUpdated: "2023-10-22",
      objectives: [
        "Understand different investment vehicles",
        "Assess risk tolerance",
        "Create a simple investment plan",
      ],
      assessments: 3,
      resources: 7,
      tags: ["investing", "stocks", "bonds"],
    },
    {
      id: 5,
      title: "Entrepreneurship Fundamentals",
      description: "Core concepts for starting and running a small business",
      duration: "60 mins",
      level: "Advanced",
      category: "business",
      progress: 10,
      status: "planning",
      lastUpdated: "2023-10-25",
      objectives: [
        "Identify business opportunities",
        "Create a basic business plan",
        "Understand startup costs and funding",
      ],
      assessments: 5,
      resources: 8,
      tags: ["business", "entrepreneurship", "startup"],
    },
  ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "finance", name: "Financial Literacy" },
    { id: "investment", name: "Investments" },
    { id: "business", name: "Business & Entrepreneurship" },
    { id: "economics", name: "Economics" },
    { id: "wellness", name: "Financial Wellness" },
  ];

  const filteredLessons = lessons.filter(
    (lesson) =>
      (filterCategory === "all" || lesson.category === filterCategory) &&
      (searchTerm === "" ||
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateLesson = () => {
    setShowLessonModal(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const handleDeleteLesson = (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      // Delete logic would go here
      alert(`Lesson ${id} would be deleted`);
    }
  };

  const handleDuplicateLesson = (lesson) => {
    alert(`Lesson "${lesson.title}" would be duplicated`);
  };

  const handleSaveLesson = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowLessonModal(false);
      setSelectedLesson(null);
      alert("Lesson saved successfully!");
    }, 800);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
              <span className="text-lg font-semibold text-gray-800">
                Loading...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedLesson ? "Edit Lesson" : "Create New Lesson"}
                </h2>
                <button
                  onClick={() => setShowLessonModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter lesson title"
                      defaultValue={selectedLesson?.title || ""}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-32"
                      placeholder="Enter lesson description"
                      defaultValue={selectedLesson?.description || ""}
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. 45 mins"
                        defaultValue={selectedLesson?.duration || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Level
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue={selectedLesson?.level || "Beginner"}
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Category
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      defaultValue={selectedLesson?.category || "finance"}
                    >
                      {categories
                        .filter((cat) => cat.id !== "all")
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Learning Objectives
                    </label>
                    <div className="space-y-2">
                      {(selectedLesson?.objectives || ["", "", ""]).map(
                        (objective, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder={`Objective ${index + 1}`}
                              defaultValue={objective}
                            />
                            {index > 2 && (
                              <button className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        )
                      )}
                      <button className="text-orange-500 hover:text-orange-700 flex items-center gap-1 text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add Objective
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter tags separated by commas"
                      defaultValue={selectedLesson?.tags?.join(", ") || ""}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Status
                    </label>
                    <div className="flex gap-4">
                      {["planning", "draft", "published"].map((status) => (
                        <label
                          key={status}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            defaultChecked={
                              selectedLesson?.status === status ||
                              (!selectedLesson && status === "planning")
                            }
                            className="form-radio text-orange-500 focus:ring-orange-500"
                          />
                          <span className="capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowLessonModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLesson}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Lesson
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-red-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black">
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                  Curriculum Builder
                </span>
              </h1>
              <p className="text-gray-600 text-lg font-medium mt-2">
                Create and manage personalized learning paths
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateLesson}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Lesson</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-gray-100"
              >
                <FolderPlus className="w-5 h-5" />
                <span>New Module</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-gray-100"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="text-gray-500 w-5 h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-orange-100 text-orange-600" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-orange-100 text-orange-600" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Lesson Planning Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange-500" />
            Lesson Planning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Lesson Templates",
                icon: <FileText className="w-6 h-6 text-white" />,
                description: "Pre-designed templates for quick lesson creation",
                color: "from-blue-500 to-indigo-500",
                count: 12,
              },
              {
                title: "Learning Objectives",
                icon: <Target className="w-6 h-6 text-white" />,
                description: "Define clear, measurable learning outcomes",
                color: "from-purple-500 to-violet-500",
                count: 45,
              },
              {
                title: "Resource Library",
                icon: <Folder className="w-6 h-6 text-white" />,
                description: "Access shared educational materials and media",
                color: "from-emerald-500 to-green-500",
                count: 78,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl`}>
                      {feature.icon}
                    </div>
                    <div className="bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm font-medium text-gray-700">{feature.count}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-purple-500" />
            Progress Tracking
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                {
                  title: "Completion Rate",
                  value: "78%",
                  change: "+5%",
                  trend: "up",
                  color: "text-green-500",
                },
                {
                  title: "Average Score",
                  value: "82/100",
                  change: "+3",
                  trend: "up",
                  color: "text-green-500",
                },
                {
                  title: "Time to Complete",
                  value: "4.2 days",
                  change: "-0.5",
                  trend: "up",
                  color: "text-green-500",
                },
              ].map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                    <span className={`flex items-center ${stat.color} text-sm font-medium`}>
                      {stat.trend === "up" ? "↑" : "↓"} {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Student Progress Overview</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Student</th>
                      <th className="text-center py-3 px-4 text-gray-600 font-semibold">Lessons Completed</th>
                      <th className="text-center py-3 px-4 text-gray-600 font-semibold">Avg. Score</th>
                      <th className="text-center py-3 px-4 text-gray-600 font-semibold">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Alex Johnson", completed: 12, total: 15, score: 94, progress: 80 },
                      { name: "Jamie Smith", completed: 15, total: 15, score: 88, progress: 100 },
                      { name: "Taylor Brown", completed: 9, total: 15, score: 76, progress: 60 },
                      { name: "Casey Wilson", completed: 7, total: 15, score: 82, progress: 47 },
                      { name: "Riley Garcia", completed: 11, total: 15, score: 90, progress: 73 },
                    ].map((student, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{student.name}</td>
                        <td className="py-3 px-4 text-center text-gray-700">
                          {student.completed}/{student.total}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700">{student.score}%</td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${student.progress === 100 ? "bg-green-500" : "bg-orange-500"}`}
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Assessment Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Assessment Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Quiz Builder",
                description: "Create interactive quizzes with multiple question types",
                icon: <HelpCircle className="w-6 h-6 text-white" />,
                color: "from-amber-500 to-orange-500",
                features: ["Multiple choice", "True/False", "Short answer", "Auto-grading"],
              },
              {
                title: "Rubric Creator",
                description: "Design detailed assessment rubrics for assignments",
                icon: <Layers className="w-6 h-6 text-white" />,
                color: "from-pink-500 to-rose-500",
                features: ["Customizable criteria", "Point scales", "Feedback templates", "Export options"],
              },
              {
                title: "Peer Assessment",
                description: "Set up structured peer review activities",
                icon: <Users className="w-6 h-6 text-white" />,
                color: "from-blue-500 to-cyan-500",
                features: ["Anonymous reviews", "Guided feedback", "Rating systems", "Reflection prompts"],
              },
              {
                title: "Progress Reports",
                description: "Generate comprehensive student progress reports",
                icon: <FileText className="w-6 h-6 text-white" />,
                color: "from-violet-500 to-purple-500",
                features: ["Performance analytics", "Visual charts", "Exportable formats", "Parent view"],
              },
            ].map((tool, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`bg-gradient-to-r ${tool.color} p-3 rounded-xl`}>
                      {tool.icon}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{tool.title}</h3>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lessons Grid/List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-500" />
            Your Lessons ({filteredLessons.length})
          </h2>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div
                    className={`h-2 ${lesson.status === "published" ? "bg-green-500" : lesson.status === "draft" ? "bg-amber-500" : "bg-gray-300"}`}
                  ></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.status === "published" ? "bg-green-100 text-green-700" : lesson.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateLesson(lesson)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lesson.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {lesson.lastUpdated}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Completion</span>
                        <span className="text-sm font-medium text-gray-700">{lesson.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                          style={{ width: `${lesson.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Category</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Level</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Duration</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Progress</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLessons.map((lesson) => (
                    <motion.tr
                      key={lesson.id}
                      variants={itemVariants}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-800">{lesson.title}</div>
                          <div className="text-sm text-gray-500">{lesson.lastUpdated}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 capitalize">{lesson.category}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{lesson.level}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{lesson.duration}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.status === "published" ? "bg-green-100 text-green-700" : lesson.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                            style={{ width: `${lesson.progress}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditLesson(lesson)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateLesson(lesson)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
            <BookOpen className="w-6 h-6" />
            <span>Lesson Planning • Progress Tracking • Assessment Tools 📚</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CurriculumBuilder;