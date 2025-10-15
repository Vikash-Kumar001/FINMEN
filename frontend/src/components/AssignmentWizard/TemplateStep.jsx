import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Star, Lock, Eye } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const TemplateStep = ({ data, updateData }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get("/api/school/teacher/assignment-templates");
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", "math", "science", "english", "social"];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template) => {
    updateData({
      type: "template",
      selectedTemplate: template,
      title: template.title,
      description: template.description,
      subject: template.subject
    });
  };

  const handleBlankAssignment = () => {
    updateData({
      type: "blank",
      selectedTemplate: null,
      title: data.title || "",
      description: data.description || "",
      subject: data.subject || ""
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Template</h3>
        <p className="text-gray-600">Start from a template or create from scratch</p>
      </div>

      {/* Template Type Selection */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBlankAssignment}
          className={`p-6 rounded-xl border-2 transition-all ${
            data.type === "blank"
              ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-500"
              : "bg-white border-gray-200 hover:border-blue-300"
          }`}
        >
          <FileText className={`w-12 h-12 mb-3 ${data.type === "blank" ? "text-blue-600" : "text-gray-400"}`} />
          <h4 className="font-bold text-gray-900 mb-1">Blank Assignment</h4>
          <p className="text-sm text-gray-600">Start from scratch with your own questions</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => updateData({ type: "template" })}
          className={`p-6 rounded-xl border-2 transition-all ${
            data.type === "template"
              ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-500"
              : "bg-white border-gray-200 hover:border-purple-300"
          }`}
        >
          <Star className={`w-12 h-12 mb-3 ${data.type === "template" ? "text-purple-600" : "text-gray-400"}`} />
          <h4 className="font-bold text-gray-900 mb-1">Use Template</h4>
          <p className="text-sm text-gray-600">Choose from pre-made templates</p>
        </motion.button>
      </div>

      {/* Blank Assignment Form */}
      {data.type === "blank" && (
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Title *</label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateData({ title: e.target.value })}
              placeholder="e.g., Math Quiz - Algebra Basics"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={data.description || ""}
              onChange={(e) => updateData({ description: e.target.value })}
              placeholder="Brief description of the assignment..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              value={data.subject || ""}
              onChange={(e) => updateData({ subject: e.target.value })}
              placeholder="e.g., Mathematics"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Template Library */}
      {data.type === "template" && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Templates Grid */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredTemplates.map((template) => {
                const isSelected = data.selectedTemplate?._id === template._id;
                
                return (
                  <motion.div
                    key={template._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-500"
                        : "bg-white border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{template.title}</h4>
                      {template.premium && (
                        <div className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Premium
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{template.questionCount} questions</span>
                      <span>{template.duration} min</span>
                      <span className="capitalize">{template.category}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateStep;

