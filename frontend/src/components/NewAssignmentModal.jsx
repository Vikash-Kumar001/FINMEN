import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, BookOpen, Users, Upload, Plus, Trash2, Sparkles } from "lucide-react";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import AssignmentWizard from "./AssignmentWizard";

const NewAssignmentModal = ({ isOpen, onClose, onSuccess, defaultClassId, defaultClassName }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    assignedTo: [],
    points: 100,
    attachments: [],
    type: "homework"
  });

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

  const fetchClasses = async () => {
    try {
      const response = await api.get("/api/school/teacher/classes");
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/school/teacher/assignments", formData);
      toast.success("Assignment created successfully!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error(error.response?.data?.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      dueDate: "",
      assignedTo: [],
      points: 100,
      attachments: [],
      type: "homework"
    });
    onClose();
  };

  const handleClassToggle = (classId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(classId)
        ? prev.assignedTo.filter(id => id !== classId)
        : [...prev.assignedTo, classId]
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Assignment</h2>
                  <p className="text-purple-100 text-sm">Quick mode - For advanced options, use wizard</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleClose();
                    setShowWizard(true);
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Advanced Wizard
                </motion.button>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Math Homework - Chapter 5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about the assignment..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Subject and Type */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="homework">Homework</option>
                  <option value="classwork">Classwork</option>
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="project">Project</option>
                </select>
              </div>
            </div>

            {/* Due Date and Points */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Assign to Classes */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Assign to Classes *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {classes.map((cls, index) => (
                  <motion.button
                    key={cls._id || cls.name || `class-${index}`}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClassToggle(cls._id || cls.name)}
                    className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                      formData.assignedTo.includes(cls._id || cls.name)
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white border-purple-500"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    {cls.name}
                  </motion.button>
                ))}
              </div>
              {classes.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No classes available</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading || formData.assignedTo.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Assignment"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Assignment Wizard */}
      {showWizard && (
        <AssignmentWizard
          isOpen={showWizard}
          onClose={() => {
            setShowWizard(false);
            onSuccess?.();
          }}
          defaultClassId={defaultClassId}
          defaultClassName={defaultClassName}
        />
      )}
    </AnimatePresence>
  );
};

export default NewAssignmentModal;

